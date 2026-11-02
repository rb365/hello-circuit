const { CPU, avrInstruction, AVRTimer, timer0Config, timer1Config, timer2Config,
  AVRIOPort, portBConfig, portCConfig, portDConfig, AVRUSART, usart0Config,
  AVRADC, adcConfig, AVRTWI, twiConfig } = require('avr8js');
const EventEmitter = require('events');
const { PeripheralManager } = require('./peripherals');

function loadHex(hex) {
  const bytes = new Uint8Array(32768);
  let upper = 0;
  for (const line of hex.trim().split(/\r?\n/)) {
    if (!line.startsWith(':')) continue;
    const data = line.slice(1).match(/../g).map(value => parseInt(value, 16));
    if ((data.reduce((sum, value) => sum + value, 0) & 255) !== 0) throw new Error('Firmware checksum failed');
    const length = data[0];
    const address = (data[1] << 8) | data[2];
    if (data[3] === 0) bytes.set(data.slice(4, 4 + length), upper + address);
    if (data[3] === 4) upper = ((data[4] << 8) | data[5]) << 16;
  }
  return new Uint16Array(bytes.buffer);
}

class VirtualSerial extends EventEmitter {
  constructor() { super(); this.queue = []; this.path = 'virtual-uno'; }
  write(data, callback) { this.queue.push(...data); if (callback) callback(); }
}

class Uno {
  constructor(hex) {
    this.cpu = new CPU(loadHex(hex));
    this.ports = { B: new AVRIOPort(this.cpu, portBConfig), C: new AVRIOPort(this.cpu, portCConfig), D: new AVRIOPort(this.cpu, portDConfig) };
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);
    this.adc = new AVRADC(this.cpu, adcConfig);
    this.peripherals=new PeripheralManager(this);
    this.twi=new AVRTWI(this.cpu,twiConfig,16000000);
    this.twi.eventHandler=this.peripherals.twiHandlers(this.twi);
    for(const port of Object.values(this.ports))port.addListener(()=>this.peripherals.gpio());
    this.usart = new AVRUSART(this.cpu, usart0Config, 16000000);
    this.serial = new VirtualSerial();
    this.received = [];
    this.nextSerialCycle=0;
    this.usart.onByteTransmit = value => this.received.push(value);
    this.usart.onRxComplete = () => this.feedSerial();
    this.usart.onConfigurationChange = () => this.feedSerial();
    const readSerial=this.cpu.readHooks[usart0Config.UDR];
    this.cpu.readHooks[usart0Config.UDR]=address=>{
      const byte=readSerial(address);
      // Virtual USB transport leaves a small frame gap after a complete
      // Firmata sysex request. That lets genuine Wire/Serial handlers service
      // concurrent sensors before the next host request arrives.
      const gap=byte===247?32000:1;
      this.nextSerialCycle=this.cpu.cycles+gap;
      this.cpu.addClockEvent(()=>this.feedSerial(),gap);
      return byte;
    };
    this.inputs = Array(20).fill(0);
    this.analog = Array(6).fill(0);
  }
  feedSerial() {
    // AVR8js has a single receive register. Keep USB transport bytes queued
    // until the firmware consumes it instead of overwriting unread data.
    if (this.serial.queue.length && this.cpu.cycles>=this.nextSerialCycle && this.usart.rxEnable && !this.usart.rxBusy && !(this.cpu.data[usart0Config.UCSRA]&128)) {
      this.usart.writeByte(this.serial.queue.shift());
    }
  }
  input(pin, value) {
    if (typeof pin === 'string' && /^A[0-5]$/.test(pin)) {
      const channel = Number(pin.slice(1));
      this.analog[channel] = Math.max(0, Math.min(1023, Number(value)));
      this.adc.channelValues[channel] = this.analog[channel] * 5 / 1023;
      return;
    }
    pin = Number(pin);
    if (!Number.isInteger(pin) || pin < 0 || pin > 19) return;
    const [port, bit] = this.pinLocation(pin);
    this.inputs[pin] = Number(Boolean(value));
    port.setPin(bit, Boolean(value));
  }
  pinLocation(pin) { return pin < 8 ? [this.ports.D, pin] : pin < 14 ? [this.ports.B, pin - 8] : [this.ports.C, pin - 14]; }
  readPin(pin) {if(!Number.isInteger(pin)||pin<0||pin>19)return 0;const[port,bit]=this.pinLocation(pin);return (this.cpu.data[port.portConfig.PIN]>>bit)&1;}
  step(cycles = 160000) {
    const end = this.cpu.cycles + cycles;
    this.feedSerial();
    while (this.cpu.cycles < end) { avrInstruction(this.cpu); this.cpu.tick(); }
    if (this.received.length) {
      const bytes = this.received.splice(0);
      this.serial.emit('data', bytes);
    }
  }
  snapshot(io) {
    const digital = Array.from({length:20}, (_, pin) => {
      const [port, bit] = this.pinLocation(pin);
      const state = port.pinState(bit);
      return state < 2 ? state : this.inputs[pin];
    });
    const pwm = {};
    for (const pin of [3,5,6,9,10,11]) {
      // GPIO outputs above are measured from the emulated chip. PWM's target
      // duty is also exposed by real Firmata IO to draw brightness smoothly.
      pwm[pin] = io && io.pins[pin] && io.pins[pin].mode === io.MODES.PWM ? io.pins[pin].value / 255 : digital[pin];
    }
    const servo = {};
    if (io) for (let pin = 0; pin < io.pins.length; pin++) {
      if (io.pins[pin].mode === io.MODES.SERVO) {
        const value = io.pins[pin].value;
        const range = (io.virtualServoRanges && io.virtualServoRanges[pin]) || {min:600,max:2400};
        servo[pin] = value > 180 ? Math.max(0,Math.min(180,(value-range.min)*180/(range.max-range.min))) : value;
      }
    }
    const modes={};
    for(let pin=0;pin<20;pin++){
      const[port,bit]=this.pinLocation(pin),mask=1<<bit;
      const requested=io?.pins[pin]?.mode;
      const output=Boolean(this.cpu.data[port.portConfig.DDR]&mask);
      const pullup=!output&&Boolean(this.cpu.data[port.portConfig.PORT]&mask);
      // Johnny-Five enables a Button pullup using INPUT + digitalWrite(HIGH).
      // Firmata still calls that INPUT; expose the chip's pullup to the circuit
      // solver so releasing a grounded button restores HIGH instead of floating.
      modes[pin]=requested===0&&pullup?11:requested??(output?1:pullup?11:0);
    }
    return { digital, pwm, servo, modes, components:this.peripherals.snapshot(), analog: [...this.analog], simTimeMs: this.cpu.cycles / 16000 };
  }
}

module.exports = { Uno, loadHex };
