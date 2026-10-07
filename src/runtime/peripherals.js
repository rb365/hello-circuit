// Original educational peripheral models. All communication passes through
// emulated GPIO/TWI registers; these do not fabricate Johnny-Five events.
class CharacterDisplay {
  constructor() {this.memory=Array(128).fill(' ');this.address=0;this.displayOn=false;this.increment=true;this.cgram=false;this.custom=Array(64).fill(0);this.backlight=[255,255,255];}
  command(value) {
    if(value===1) {this.memory.fill(' ');this.address=0;this.cgram=false;}
    else if(value===2) {this.address=0;this.cgram=false;}
    else if(value&128) {this.address=value&127;this.cgram=false;}
    else if(value&64) {this.address=value&63;this.cgram=true;}
    else if((value&248)===8) {this.displayOn=Boolean(value&4);this.cursorOn=Boolean(value&2);this.blink=Boolean(value&1);}
    else if((value&252)===4) this.increment=Boolean(value&2);
  }
  data(value) {
    if(this.cgram)this.custom[this.address&63]=value&31;
    else this.memory[this.address&127]=String.fromCharCode(value);
    this.address=(this.address+(this.increment?1:-1))&127;
  }
  snapshot() {
    const lines=[0,64].map(offset=>this.memory.slice(offset,offset+16).join(''));
    return {text:lines.join('\n'),lines,characters:[...lines.join('')].map(ch=>ch.charCodeAt(0)),displayOn:this.displayOn,cursor:this.cursorOn,blink:this.blink,cursorX:this.address%64,cursorY:this.address>=64?1:0,backlight:this.backlight.some(value=>value>0),color:'#'+this.backlight.map(value=>value.toString(16).padStart(2,'0')).join(''),customCharacters:this.custom};
  }
}

class ParallelLCD extends CharacterDisplay {
  constructor() {super();this.fourBit=false;this.pending=null;this.lastEnable=0;}
  gpio(pins,read,levels={}) {
    const enable=read(pins.E ?? pins.EN);
    if(this.lastEnable&&!enable) {
      let nibble=0;for(let bit=0;bit<4;bit++)nibble|=read(pins[`D${bit+4}`])<<bit;
      const data=read(pins.RS);
      if(!this.fourBit) {
        if(nibble===2){this.fourBit=true;this.pending=null;}
        else this.command(nibble<<4);
      } else if(this.pending===null)this.pending={nibble,data};
      else {const value=(this.pending.nibble<<4)|nibble;this.pending.data?this.data(value):this.command(value);this.pending=null;}
    }
    this.lastEnable=enable;
  }
}

class ShiftRegister {
  constructor(){this.shift=0;this.outputs=0;this.clock=0;this.latch=0;}
  gpio(pins,read,levels={}) {
    const clock=read(pins.SHCP),latch=read(pins.STCP);
    if((levels.MR??(pins.MR!==undefined?Boolean(read(pins.MR)):true))===false)this.shift=0;
    else if(clock&&!this.clock)this.shift=((this.shift<<1)|read(pins.DS))&255;
    if(latch&&!this.latch)this.outputs=this.shift;
    this.clock=clock;this.latch=latch;this.enabled=!(levels.OE??(pins.OE!==undefined?Boolean(read(pins.OE)):false));
  }
  snapshot(){return{outputs:Array.from({length:8},(_,bit)=>this.enabled?(this.outputs>>bit)&1:null),value:this.outputs};}
}

class Registers {
  constructor(){this.bytes=new Uint8Array(256);this.pointer=0;}
  write(data){if(!data.length)return;this.pointer=data[0];for(let i=1;i<data.length;i++)this.writeRegister(this.pointer++,data[i]);this.pointer&=255;}
  writeRegister(register,value){this.bytes[register&255]=value;}
  read(count){this.refresh();return Array.from({length:count},()=>this.bytes[this.pointer++&255]);}
  refresh(){}
  word(register,value,little=false){value=Math.round(value)&65535;this.bytes[register]=little?value&255:value>>8;this.bytes[register+1]=little?value>>8:value&255;}
}

class CompassModel extends Registers {
  constructor(){super();this.values={heading:0,z:0};this.bytes.set([72,52,51],10);this.bytes[9]=1;}
  refresh(){const angle=this.values.heading*Math.PI/180;const x=this.values.x??Math.cos(angle)*1000,y=this.values.y??Math.sin(angle)*1000;this.word(3,x);this.word(5,this.values.z);this.word(7,y);}
  snapshot(){return {...this.values};}
}

class AccelerometerModel extends Registers {
  constructor(){super();this.values={x:0,y:0,z:1};this.bytes[0]=229;}
  refresh(){for(const [index,axis]of ['x','y','z'].entries())this.word(50+index*2,this.values[axis]*256,true);}
  snapshot(){return{...this.values};}
}

class WeatherModel extends Registers {
  constructor(){
    // Factory calibration varies between BMP180 units. This modeled unit
    // shifts AC6 so its raw temperature remains within Johnny-Five's signed
    // 16-bit decoder throughout the workbench's -20..85 Celsius controls.
    super();this.values={temperature:22,pressure:101.325};this.coefficients=[408,-72,-14383,32741,32757,16000,6190,4,-32768,-8711,2868];
    this.coefficients.forEach((value,index)=>this.word(170+index*2,value));this.bytes[208]=85;this.b5=0;
  }
  temperatureFor(raw){const c=this.coefficients;const x=((raw-c[5])*c[4])>>15;const b5=x+Math.trunc((c[9]*2048)/(x+c[10]));return {temperature:((b5+8)>>4)/10,b5};}
  pressureFor(raw,oss){
    const [a1,a2,a3,a4,, ,b1,b2]=this.coefficients;
    const b6=this.b5-4000, square=(b6*b6)>>12;
    const b3=Math.trunc((((a1*4+((b2*square)>>11)+((a2*b6)>>11))<<oss)+2)/4);
    const b4=(a4*(((((a3*b6)>>13)+((b1*square)>>16)+2)>>2)+32768))>>15;
    const b7=(raw-b3)*(50000>>oss);
    let pressure=Math.trunc(b7<2147483648?b7*2/b4:b7/b4*2);
    const adjust=(((((pressure>>8)*(pressure>>8))*3038)>>16)+((-7357*pressure)>>16)+3791)>>4;
    return pressure+adjust;
  }
  nearest(low,high,target,convert){while(low<high){const middle=(low+high)>>1;if(convert(middle)<target)low=middle+1;else high=middle;}return low;}
  writeRegister(register,value){
    super.writeRegister(register,value);
    if(register!==244)return;
    if(value===46){
      const raw=this.nearest(17000,32767,this.values.temperature,raw=>this.temperatureFor(raw).temperature);
      this.b5=this.temperatureFor(raw).b5;this.word(246,raw);
    }else{
      const oss=(value>>6)&3,target=this.values.pressure>1000?this.values.pressure:this.values.pressure*1000;
      const raw=this.nearest(0,65535<<oss,target,raw=>this.pressureFor(raw,oss))<<(8-oss);
      this.bytes[246]=(raw>>16)&255;this.bytes[247]=(raw>>8)&255;this.bytes[248]=raw&255;
    }
  }
  snapshot(){return{...this.values};}
}

class GroveLCD extends CharacterDisplay {
  write(data){const dataMode=Boolean(data[0]&64);for(const byte of data.slice(1))dataMode?this.data(byte):this.command(byte);}
  read(count){return Array(count).fill(0);}
}
class GroveBacklight extends Registers {
  constructor(display){super();this.display=display;}
  writeRegister(register,value){super.writeRegister(register,value);if(register===4)this.display.backlight[0]=value;if(register===3)this.display.backlight[1]=value;if(register===2)this.display.backlight[2]=value;}
}

class GestureModel extends Registers {
  constructor(){super();this.bytes[146]=171;this.values={gesture:'none',sequence:0};this.fifo=[];this.interruptLevel=1;this.lastSequence=0;}
  write(data){super.write(data);this.readingFIFO=data[0]===252;}
  writeRegister(register,value){super.writeRegister(register,value);if(register===128&&!(value&64)){this.fifo=[];this.release();}}
  release(){this.interruptLevel=1;this.manager?.driveInput(this.item.pins?.INT,1);}
  refresh(){this.bytes[174]=Math.ceil(this.fifo.length/4);this.bytes[175]=this.fifo.length?1:0;}
  read(count){
    if(!this.readingFIFO)return super.read(count);
    const bytes=Array.from({length:count},()=>this.fifo.shift()??0);
    if(!this.fifo.length){this.readingFIFO=false;this.release();}
    return bytes;
  }
  trigger(values){
    Object.assign(this.values,values);
    if(!values.gesture||values.gesture==='none'||values.sequence===this.lastSequence)return;
    this.lastSequence=values.sequence;
    if(!(this.bytes[128]&64))return;
    const horizontal=['left','right'].includes(values.gesture),positive=['up','left'].includes(values.gesture);
    this.fifo=[];
    for(let sample=0;sample<4;sample++){
      const a=Math.round(positive?50+sample*100/3:150-sample*100/3),b=200-a;
      this.fifo.push(...(horizontal?[100,100,a,b]:[a,b,100,100]));
    }
    this.lastGesture=values.gesture;this.interruptLevel=0;
    this.manager.driveInput(this.item.pins?.INT,0);
  }
  snapshot(){return {interruptLevel:this.interruptLevel,lastGesture:this.lastGesture,pendingSamples:Math.ceil(this.fifo.length/4)};}
}

const nmea=sentence=>`$${sentence}*${[...sentence].reduce((sum,ch)=>sum^ch.charCodeAt(0),0).toString(16).toUpperCase().padStart(2,'0')}\r\n`;
function coordinate(degrees,isLongitude){const absolute=Math.abs(degrees),whole=Math.floor(absolute);return `${String(whole).padStart(isLongitude?3:2,'0')}${((absolute-whole)*60).toFixed(4).padStart(7,'0')}`;}

class PeripheralManager {
  constructor(uno){this.uno=uno;this.driveInput=(pin,value)=>uno.input(pin,value);this.models=new Map();this.bus=new Map();this.address=null;this.writeBuffer=[];this.readQueue=[];}
  configure(items){
    const previous=this.models;this.models=new Map();this.bus=new Map();
    for(const item of items||[]){
      const previousModel=previous.get(item.id);let model=previousModel&&previousModel.item.type===item.type?previousModel:null;
      if(!model){
        if(item.type==='lcd')model=new ParallelLCD();
        if(item.type==='shift-register')model=new ShiftRegister();
        if(item.type==='compass')model=new CompassModel();
        if(item.type==='weather')model=new WeatherModel();
        if(item.type==='accelerometer')model=new AccelerometerModel();
        if(item.type==='grove-lcd')model=new GroveLCD();
        if(item.type==='gesture')model=new GestureModel();
        if(item.type==='gps')model={values:{latitude:37.7749,longitude:-122.4194,altitude:20},nextSend:0,busy:false,snapshot(){return {...this.values};}};
      }
      if(!model)continue;
      model.item=item;model.manager=this;this.models.set(item.id,model);
      if(item.powered===false)continue;
      const addresses={compass:30,weather:119,accelerometer:83,'grove-lcd':62,gesture:57};
      if(item.type in addresses)this.bus.set(item.address??addresses[item.type],model);
      if(item.type==='grove-lcd')this.bus.set(98,new GroveBacklight(model));
      if(item.type==='gesture')this.driveInput(item.pins?.INT,model.interruptLevel);
    }
  }
  input(id,values){const model=this.models.get(id);if(model&&model.values){if(model.trigger){if(model.item.powered!==false)model.trigger(values);}else Object.assign(model.values,values);if(model.item.type==='weather'&&values.pressurePa!==undefined)model.values.pressure=values.pressurePa;}}
  readI2C(address,register,length){
    const model=this.bus.get(address);if(!model)throw new Error(`No powered I2C device at 0x${address.toString(16)}.`);
    if(register!==null&&register!==undefined)model.write([register]);
    return model.read(length);
  }
  writeI2C(address,register,data){
    const model=this.bus.get(address);if(!model)throw new Error(`No powered I2C device at 0x${address.toString(16)}.`);
    const bytes=Array.isArray(register)?register:[register,...(Array.isArray(data)?data:[data])];
    model.write(bytes.filter(value=>value!==undefined));
  }
  gpio(read=pin=>this.uno.readPin(pin)){for(const model of this.models.values())if(model.gpio&&model.item.powered!==false)model.gpio(model.item.pins||{},read,model.item.levels);}
  finishWrite(){const model=this.bus.get(this.address);if(this.writeBuffer.length&&model)model.write(this.writeBuffer);this.writeBuffer=[];}
  twiHandlers(twi){return {
    start:()=>{this.finishWrite();twi.completeStart();},
    stop:()=>{this.finishWrite();twi.completeStop();},
    connectToSlave:(address,write)=>{this.finishWrite();this.address=address;this.readQueue=[];twi.completeConnect(this.bus.has(address));},
    writeByte:value=>{this.writeBuffer.push(value);twi.completeWrite(this.bus.has(this.address));},
    readByte:()=>{const model=this.bus.get(this.address);twi.completeRead(model?model.read(1)[0]:255);}
  };}
  scheduleGPS(io){
    for(const model of this.models.values()){
      if(model.item.type!=='gps'||model.item.powered===false||model.busy||model.nextSend>this.uno.cpu.cycles)continue;
      const pins=model.item.pins||{},rxPin=pins.TX??pins.RX??11;
      const config=Object.values(io&&io.virtualSerialPorts||{}).find(config=>config.rxPin===rxPin);
      if(!config)continue;
      // Allow the real UART to finish delivering Firmata's software-serial
      // configuration and read command before GPS interrupts consume the CPU.
      if(model.serialPin!==rxPin){model.serialPin=rxPin;model.nextSend=this.uno.cpu.cycles+1600000;continue;}
      const v=model.values,lat=coordinate(v.latitude,false),lon=coordinate(v.longitude,true),ns=v.latitude<0?'S':'N',ew=v.longitude<0?'W':'E';
      const sentences=nmea(`GPGGA,120000,${lat},${ns},${lon},${ew},1,08,0.9,${v.altitude.toFixed(1)},M,0.0,M,,`)+nmea(`GPRMC,120000,A,${lat},${ns},${lon},${ew},0.0,0.0,071026,,,A`);
      // Two idle stop bits give SoftwareSerial's interrupt handler time to
      // service the Firmata transport between bytes. Idle is legal UART framing.
      const bits=[];for(const byte of [...sentences].map(ch=>ch.charCodeAt(0))){bits.push(0);for(let bit=0;bit<8;bit++)bits.push((byte>>bit)&1);bits.push(1,1);}
      const cycles=Math.round(16000000/(config.baud||9600));let index=0;model.busy=true;
      const next=()=>{
        if(this.models.get(model.item.id)!==model||model.item.powered===false){model.busy=false;return;}
        if(index===bits.length){model.busy=false;model.nextSend=this.uno.cpu.cycles+16000000;return;}
        this.uno.input(rxPin,bits[index++]);this.uno.cpu.addClockEvent(next,cycles);
      };
      this.uno.input(rxPin,1);this.uno.cpu.addClockEvent(next,cycles*5);
    }
  }
  snapshot(){return Object.fromEntries([...this.models].map(([id,model])=>[id,{...model.snapshot(),powered:model.item.powered!==false,type:model.item.type}]));}
}

module.exports={PeripheralManager,ParallelLCD,CharacterDisplay,WeatherModel,CompassModel,AccelerometerModel};
