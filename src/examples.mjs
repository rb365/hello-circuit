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
});`}
];
