// A first-visit project, not the New project template. Never run automatically.
// Johnny-Five 2.1.0 JHD1313M1 initializes synchronously in its constructor;
// LCD.on() turns the display on, and is not an EventEmitter ready callback.
export function starterProject() {
  return {
    version:2,name:'Button counter',platform:'uno',entry:'index.js',selectedFile:'index.js',
    note:'Press Run, then click the button. Each press adds one to the LCD count and toggles the Uno’s built-in light (pin 13). New project opens a blank workbench.',
    files:{'index.js':`const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  const button = new five.Button({ pin: 2, isPullup: true });
  const light = new five.Led(13); // Built-in Uno light
  const lcd = new five.LCD({ controller: 'JHD1313M1', color: 'white' });
  let count = 0;

  lcd.cursor(0, 0).print('Count: 0');
  button.on('press', () => {
    count += 1;
    lcd.cursor(0, 0).print('Count: ' + count);
    light.toggle();
  });
});
`},
    parts:[
      {id:'board',type:'uno',x:100,y:160},
      {id:'display',type:'grove-lcd',x:570,y:100},
      {id:'button',type:'button',x:650,y:370,value:0}
    ],
    wires:[
      {a:'board:2',b:'button:1.l'},
      {a:'board:GND.1',b:'button:2.l'},
      {a:'board:5V',b:'display:VCC'},
      {a:'board:GND.2',b:'display:GND'},
      {a:'board:A4',b:'display:SDA'},
      {a:'board:A5',b:'display:SCL'}
    ]
  };
}
