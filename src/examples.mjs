export const examples = [
  {id:'blink',label:'Blink a light',title:'Make a light blink.',description:'Meet the “hello, world” of electronics. Run the code, then change 500 to 100 and run it again.',challenge:'How slow can you make the LED blink? Try 2000 milliseconds.',scene:'led',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  console.log("Hello, little circuit!");
  const light = new five.Led(13);
  light.blink(500);
});`},
  {id:'count',label:'Count the blinks',title:'Give your light a finish line.',description:'A callback runs each time the light changes. Count those changes and tell it when to stop.',challenge:'Can you make it stop after 6 changes instead of 10? What happens if you add light.off() after light.stop()?',scene:'led',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(13);
  let changes = 0;

  light.blink(500, () => {
    changes += 1;
    console.log("Light changed:", changes);
    if (changes === 10) {
      light.stop();
      light.off();
      console.log("Finished!");
    }
  });
});`},
  {id:'button',label:'Press a button',title:'Let your circuit listen.',description:'Run your code, then press the virtual button. An input tells the board something has happened.',challenge:'Try changing the press handler to light.blink(150). Keep light.stop().off() in the release handler.',scene:'button',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(13);
  const button = new five.Button({
    pin: 2,
    isPullup: true
  });

  button.on("press", () => {
    light.on();
    console.log("Button pressed!");
  });
  button.on("release", () => {
    light.stop().off();
    console.log("Button released.");
  });
});`},
  {id:'fade',label:'Fade a light',title:'Explore the in-between.',description:'Pin 11 can change the brightness of the external LED. Watch it grow brighter and dimmer.',challenge:'Try light.brightness(80) instead of light.pulse(1500). Brightness ranges from 0 to 255.',scene:'fade',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(11);
  light.pulse(1500);
  console.log("A little wave of light.");
});`},
  {id:'dial',label:'Turn a dial',title:'Turn a little. Change a lot.',description:'Run your code and move the dial’s slider. Analog input lets your circuit read more than on or off.',challenge:'Try using the dial to change blink speed: light.blink(five.Fn.map(this.value, 0, 1023, 50, 1500)).',scene:'dial',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(11);
  const dial = new five.Sensor("A0");

  dial.on("change", function () {
    const brightness = five.Fn.map(
      this.value, 0, 1023, 0, 255
    );
    light.brightness(brightness);
    console.log("Dial:", this.value);
  });
});`},
  {id:'servo',label:'Move a motor',title:'Make your code move.',description:'A servo rotates to the angle you choose. Run this experiment and watch its arm sweep.',challenge:'Try motor.to(45) instead of motor.sweep(). Then try 90 and 135 degrees.',scene:'servo',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const motor = new five.Servo(9);
  motor.sweep();
  console.log("Watch the servo arm!");
});`},
  {id:'air-bench',label:'Air sensor bench',title:'Read dust and gas signals.',
    description:'An Arduino Uno and breadboard read a Sharp-style analog dust sensor and a CCS811-style I²C gas sensor. Change the simulated readings in Details.',
    workspaceNote:'Virtual bench only. These look-alike modules were inferred from photos, not verified part IDs or physical wiring. The dust output is a steady teaching signal, not Sharp LED pulse timing or calibration. CCS811 eCO₂ is an estimate, not a CO₂ measurement. Pick a sensor, open Details, and edit the simulated values.',
    scene:{
      parts:[
        {id:'board',type:'uno',x:150,y:210},
        {id:'breadboard',type:'breadboard',x:585,y:260},
        {id:'dust',type:'dust-sensor',x:650,y:10},
        {id:'gas',type:'ccs811',x:650,y:475}
      ],
      wires:[
        {a:'board:5V',b:'breadboard:+1',color:'#ed6f48'},
        {a:'board:GND.1',b:'breadboard:-1',color:'#526477'},
        {a:'breadboard:+5',b:'dust:VCC',color:'#ed6f48'},
        {a:'breadboard:-5',b:'dust:GND',color:'#526477'},
        {a:'dust:AO',b:'breadboard:a8',color:'#194ced'},
        {a:'breadboard:e8',b:'board:A0',color:'#194ced'},
        {a:'board:3.3V',b:'gas:VCC',color:'#ed6f48'},
        {a:'breadboard:-9',b:'gas:GND',color:'#526477'},
        {a:'breadboard:-13',b:'gas:WAKE',color:'#526477'},
        {a:'board:A4',b:'gas:SDA',color:'#194ced'},
        {a:'board:A5',b:'gas:SCL',color:'#7b5ab3'}
      ]
    },
    code:`const five = require("johnny-five");
const board = new five.Board();
const GAS = 0x5a;

board.on("ready", () => {
  const dust = new five.Sensor({ pin: "A0", freq: 250 });
  let lastDust;
  dust.on("data", function () {
    const raw = this.value;
    if (raw === lastDust) return;
    lastDust = raw;
    if (raw === 0) {
      console.log("Dust: no analog signal (check power and A0).");
      return;
    }
    const volts = raw * 5 / 1023;
    // Inverse of this lab's teaching curve, NOT a real calibration.
    const level = Math.max(0, Math.round((volts - 0.5) / 0.008));
    console.log("Dust: " + level + " µg/m³ (simulated, A0 " + raw + ")");
  });

  board.i2cConfig();
  board.i2cReadOnce(GAS, 0x20, 1, ([id]) => {
    if (id !== 0x81) {
      console.log("Gas sensor not found. Check power, WAKE and I²C.");
      return;
    }
    board.i2cWrite(GAS, [0xf4]);       // APP_START
    board.i2cWriteReg(GAS, 0x01, 0x10); // MEAS_MODE: 1 s
    let lastGas = "";
    board.i2cRead(GAS, 0x02, 4, ([co2Hi, co2Lo, vocHi, vocLo]) => {
      const eco2 = (co2Hi << 8) | co2Lo;
      const tvoc = (vocHi << 8) | vocLo;
      const line = "eCO₂: " + eco2 + " ppm (estimate), TVOC: " + tvoc + " ppb";
      if (line !== lastGas) console.log(line);
      lastGas = line;
    });
  });
});`}
];
