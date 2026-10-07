// Book companion metadata and selected official example source.
// The book text and illustrations are not included.
// Source: https://github.com/lyzadanger/javascript-on-things
// Pinned audit commit: 6f7e825c05933d5658b58c622351d4f9c43d61d5
// Adapter-checked means developer API tests; browser/circuit integration is a separate gate.
/*
MIT License

Copyright (c) 2017 Lyza Gardner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export const chapters = [
  {
    "number": 1,
    "title": "Bringing JavaScript and hardware together",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-1",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things",
    "summary": "Hardware, JavaScript and toolkit concepts. Build circuits and write your own code in the blank lab; the chapter has no runnable source project.",
    "status": "conceptual-only",
    "exercises": []
  },
  {
    "number": 2,
    "title": "Embarking on hardware with Arduino",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-2",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02",
    "summary": "Original Johnny-Five blink and stop programs run on the AVR Uno simulation. The optional Arduino C++ sketch remains linked; editing/uploading C++ is outside this JavaScript runtime.",
    "status": "partial",
    "exercises": [
      {
        "name": "Arduino C++: blink an LED",
        "path": "chapter-02/01-arduino-led-blink",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/01-arduino-led-blink",
        "needs": [
          "Uno",
          "LED D13",
          "resistor"
        ],
        "status": "external-workflow",
        "note": "Optional native Arduino C++ setup sketch. The <1>–<4> inline book annotations must be removed before native compilation. This .ino file cannot execute in the JavaScript editor; the following Johnny-Five blink program demonstrates the same LED behavior.",
        "files": [
          "blink.ino"
        ],
        "dependencies": []
      },
      {
        "name": "Johnny-Five: hello, LED",
        "path": "chapter-02/02-hello-world-johnny-five",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/02-hello-world-johnny-five",
        "needs": [
          "Uno",
          "LED D13",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Pin 13 changes HIGH and LOW after board ready. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Stop after counting blinks",
        "path": "chapter-02/03-hello-world-stop",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/03-hello-world-stop",
        "needs": [
          "Uno",
          "LED D13",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Ten callbacks observed; no extra callback after stopping. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      }
    ]
  },
  {
    "number": 3,
    "title": "How to build circuits",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-3",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things",
    "summary": "Breadboard connections, DC resistance, voltage/current measurements, and series/parallel circuits have circuit models. Transients, component damage and every real-world electrical effect are outside the model.",
    "status": "model-checked",
    "exercises": []
  },
  {
    "number": 4,
    "title": "Sensors and input",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-4",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04",
    "summary": "Original photoresistor, TMP36, threshold, interactive console and push-button programs have browser execution checks. Circuit input controls support working along with the book.",
    "status": "partial",
    "exercises": [
      {
        "name": "Read a photoresistor",
        "path": "chapter-04/01-photoresistor",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/01-photoresistor",
        "needs": [
          "Uno",
          "LDR divider A0",
          "4.7k resistor",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Sensor change threshold",
        "path": "chapter-04/02-photoresistor-threshold",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/02-photoresistor-threshold",
        "needs": [
          "Uno",
          "LDR divider A0",
          "4.7k resistor",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Read a TMP36 thermometer",
        "path": "chapter-04/03-temperature",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/03-temperature",
        "needs": [
          "Uno",
          "TMP36 A0",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Inspect a thermometer in the console",
        "path": "chapter-04/04-temperature-repl",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/04-temperature-repl",
        "needs": [
          "Uno",
          "TMP36 A0",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Read a push button",
        "path": "chapter-04/05-button",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/05-button",
        "needs": [
          "Uno",
          "button D2",
          "10k pulldown",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Active-high D2 press invokes original down handler. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      }
    ]
  },
  {
    "number": 5,
    "title": "Output: making things happen",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-5",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05",
    "summary": "Original LED, brightness animation, nightlight, weather fixture and LCD timer programs have browser checks. The retired Dark Sky request uses explicitly labelled sample data. Button-driven 00:01 countdown, DONE display and piezo tone are checked. Prepared circuits also have separate connection and layout model checks.",
    "status": "partial",
    "exercises": [
      {
        "name": "Experiment with two LEDs",
        "path": "chapter-05/01-experiment-led",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/01-experiment-led",
        "needs": [
          "Uno",
          "LED D2",
          "LED D3",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Injected LED1 D2 on and LED2 D3 brightness(128) produce real pin signals. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Animate LED brightness",
        "path": "chapter-05/02-animate-led",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/02-animate-led",
        "needs": [
          "Uno",
          "LED PWM D3",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original Animation generates varying D3 PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "A simple LED timer",
        "path": "chapter-05/03-timer-led-simple",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/03-timer-led-simple",
        "needs": [
          "Uno",
          "LED PWM D3",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original 10-second timeout begins real PWM pulse. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Automatic nightlight",
        "path": "chapter-05/04-nightlight",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/04-nightlight",
        "needs": [
          "Uno",
          "LED PWM D3",
          "LDR divider A0",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original calibration/scale/bitwise code lights D3 after bright-to-dark input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Weather ball",
        "path": "chapter-05/05-weatherball",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/05-weatherball",
        "needs": [
          "Uno",
          "common-cathode RGB LED D3/D5/D6",
          "johnny-five",
          "request"
        ],
        "status": "runtime-checked",
        "note": "Explicit retired-DarkSky fixture produces red RGB PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "request"
        ]
      },
      {
        "name": "LCD timer",
        "path": "chapter-05/06-timer-lcd",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/06-timer-lcd",
        "needs": [
          "Uno",
          "buttons D2/D3/D4",
          "parallel 16x2 LCD D7..D12",
          "LCD contrast potentiometer",
          "LED D6",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original physical buttons select 00:01 and Go reaches DONE; pause works; completion LED6 pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "LCD timer with a chime",
        "path": "chapter-05/07-timer-lcd-piezo",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/07-timer-lcd-piezo",
        "needs": [
          "Uno",
          "buttons D2/D3/D4",
          "parallel 16x2 LCD D7..D12",
          "LCD contrast potentiometer",
          "piezo D6",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original physical buttons select 00:01 and Go reaches DONE; pause works; piezo pin 6 emits a tone. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      }
    ]
  },
  {
    "number": 6,
    "title": "Output: making things move",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-6",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06",
    "summary": "Original motor, servo and multi-file rover programs have browser checks with keyboard input and H-bridge models. These cover commands and signals; complete mechanical movement and every motor wiring detail need review.",
    "status": "partial",
    "exercises": [
      {
        "name": "Control a DC motor",
        "path": "chapter-06/01-motor-basic",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/01-motor-basic",
        "needs": [
          "Uno",
          "DC motor PWM D6",
          "MOSFET",
          "diode",
          "capacitor",
          "9V battery",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Motor start(128)/stop() via original REPL yields PWM duty about 0.5/0. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Position a servo",
        "path": "chapter-06/02-servo-basic",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/02-servo-basic",
        "needs": [
          "Uno",
          "microservo D6",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original REPL servo.to(120) produces a 120 degree command and real pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Test a pair of motors",
        "path": "chapter-06/03-motor-test",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/03-motor-test",
        "needs": [
          "Uno",
          "dual motors",
          "SN754410 H-bridge",
          "battery",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original two-motor code configures D11/D5 PWM and D12/D4 directions; the injected motors collection responds to motors.forward(128) in the console. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Keyboard-controlled rover",
        "path": "chapter-06/04-rover",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/04-rover",
        "needs": [
          "Uno",
          "dual motors",
          "SN754410 H-bridge",
          "battery",
          "rover chassis",
          "./Rover",
          "johnny-five",
          "keypress"
        ],
        "status": "runtime-checked",
        "note": "Original two-motor code configures D11/D5 PWM and D12/D4 directions; keyboard up reaches Rover.js. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "Rover.js",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "./Rover",
          "johnny-five",
          "keypress"
        ]
      }
    ]
  },
  {
    "number": 7,
    "title": "Serial communication",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-7",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07",
    "summary": "Original GPS, compass, I2C LCD and multisensor programs have browser checks through SoftwareSerial/register models. Virtual sensor controls supply readings; electrical timing is approximate.",
    "status": "partial",
    "exercises": [
      {
        "name": "Read a GPS receiver",
        "path": "chapter-07/01-gps",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/01-gps",
        "needs": [
          "Uno",
          "Ultimate GPS RX/TX D11/D10",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original GPS and REPL observe latitude 37.7749 through real SoftwareSerial. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Read a compass",
        "path": "chapter-07/02-compass",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/02-compass",
        "needs": [
          "Uno",
          "HMC5883L I2C 0x1e",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original compass change handler logs easterly bearing after a 90 degree device input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Show a heading on an LCD",
        "path": "chapter-07/03-compass-lcd",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/03-compass-lcd",
        "needs": [
          "Uno",
          "HMC5883L I2C",
          "Grove RGB LCD JHD1313M1 I2C",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original compass/LCD project displays declination-corrected 76 degrees. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      },
      {
        "name": "Shake-to-change sensor display",
        "path": "chapter-07/04-multi-sensor",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/04-multi-sensor",
        "needs": [
          "Uno",
          "HMC5883L I2C",
          "JHD1313M1 I2C LCD",
          "BMP180 I2C 0x77",
          "ADXL345 I2C",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Original multisensor source displays 77 °F and pressure then switches to heading on shake. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five"
        ]
      }
    ]
  },
  {
    "number": 8,
    "title": "Projects without wires",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-8",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08",
    "summary": "Tessel LED, GPIO, weather and rover sources are available through labelled virtual APIs; selected web-server APIs use an in-memory preview. Wireless configuration and native Tessel hardware execution remain external.",
    "status": "partial",
    "exercises": [
      {
        "name": "Tessel onboard lights",
        "path": "chapter-08/01-hello-tessel",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/01-hello-tessel",
        "needs": [
          "Tessel2 onboard LEDs",
          "tessel"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard L2 and L3 alternate. Native CPU timing and wireless deployment are not emulated.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "tessel"
        ]
      },
      {
        "name": "Johnny-Five on Tessel",
        "path": "chapter-08/02-t2-blink",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/02-t2-blink",
        "needs": [
          "Tessel2",
          "LED A0",
          "johnny-five",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Add an LED and resistor to Tessel A0 and GND as shown in the book. A0 means digital port A pin 0 here.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "tessel-io"
        ]
      },
      {
        "name": "Tessel weather sensor",
        "path": "chapter-08/03-t2-bmp180",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/03-t2-bmp180",
        "needs": [
          "Tessel2",
          "BMP180",
          "johnny-five",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The BMP180 reads from a powered circuit on Tessel I2C. Tessel APIs are adapted; native ARM execution is not emulated.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "tessel-io"
        ]
      },
      {
        "name": "Tessel weather web app",
        "path": "chapter-08/04-t2-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/04-t2-weather",
        "needs": [
          "Tessel2",
          "BMP180",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original weather dashboard uses an in-memory Express/HTTP/Socket.IO preview and a wired BMP180. There is no native TCP listener or wireless deployment.",
        "files": [
          ".tesselinclude",
          "app/index.html",
          "app/style.css",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io",
          "tessel-io"
        ]
      },
      {
        "name": "Tessel rover",
        "path": "chapter-08/05-t2-rover",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/05-t2-rover",
        "needs": [
          "Tessel2",
          "dual motors",
          "H-bridge",
          "rover",
          "./Rover",
          "johnny-five",
          "keypress",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Original Rover.js receives up/space keyboard commands and configures Tessel A5/B5 PWM Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original index.js and Rover.js use Tessel A/B GPIO and keyboard input. Confirm H-bridge wiring and motor direction in the circuit.",
        "files": [
          "Rover.js",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "./Rover",
          "johnny-five",
          "keypress",
          "tessel-io"
        ]
      }
    ]
  },
  {
    "number": 9,
    "title": "Building your own thing",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-9",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09",
    "summary": "Custom multi-file components, APDS9960 registers/FIFO/interrupts and virtual optocoupler/remote channels are available. Original gesture-switch source has browser checks; complete prepared circuit behavior needs review; physical outlets and mains are outside the circuit model.",
    "status": "partial",
    "exercises": [
      {
        "name": "Prototype a remote switch",
        "path": "chapter-09/01-prototype-switch",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/01-prototype-switch",
        "needs": [
          "Tessel2",
          "4N25 optocoupler",
          "remote button/circuit",
          "wall outlet model",
          "johnny-five",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Use turnOn() and turnOff() in the interactive console. GPIO pulses are checked; connect the optocoupler signal model to inspect isolated output. Physical remote outlets and mains behavior are outside this circuit model.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "tessel-io"
        ]
      },
      {
        "name": "Create a RemoteSwitch component",
        "path": "chapter-09/02-remote-switch",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/02-remote-switch",
        "needs": [
          "Tessel2",
          "4N25 optocoupler",
          "remote/outlet",
          "./RemoteSwitch",
          "johnny-five",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Original RemoteSwitch.js is loaded as a local module. Its named on/off pins use the virtual optocoupler/remote circuit; no real outlet or mains behavior is simulated.",
        "files": [
          "RemoteSwitch.js",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "./RemoteSwitch",
          "johnny-five",
          "tessel-io"
        ]
      },
      {
        "name": "Identify a gesture sensor",
        "path": "chapter-09/03-gesture-i2c-test",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/03-gesture-i2c-test",
        "needs": [
          "Tessel2",
          "APDS9960 I2C 0x39",
          "johnny-five",
          "tessel-io"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original program reads APDS9960 device ID 0xAB from a powered I2C model.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "tessel-io"
        ]
      },
      {
        "name": "Write a gesture driver",
        "path": "chapter-09/04-gesture",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/04-gesture",
        "needs": [
          "Tessel2",
          "APDS9960 interrupt A2",
          "./APDS9960",
          "events",
          "johnny-five",
          "tessel-io",
          "util"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original APDS9960.js reads register/FIFO data and active-low A2 interrupts. Direction buttons supply gesture samples to the connected sensor.",
        "files": [
          "APDS9960.js",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "./APDS9960",
          "events",
          "johnny-five",
          "tessel-io",
          "util"
        ]
      },
      {
        "name": "Gesture-controlled remote switches",
        "path": "chapter-09/05-gesture-switches",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/05-gesture-switches",
        "needs": [
          "Tessel2",
          "APDS9960",
          "6 optocouplers",
          "3 remote outlets",
          "./APDS9960",
          "./RemoteSwitch",
          "./RemoteSwitches",
          "events",
          "johnny-five",
          "tessel-io",
          "util"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original gesture driver and RemoteSwitch modules control three virtual remote channels. Check optocoupler pairs and gesture-to-channel behavior; no mains simulation.",
        "files": [
          "APDS9960.js",
          "RemoteSwitch.js",
          "RemoteSwitches.js",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "./APDS9960",
          "./RemoteSwitch",
          "./RemoteSwitches",
          "events",
          "johnny-five",
          "tessel-io",
          "util"
        ]
      }
    ]
  },
  {
    "number": 10,
    "title": "JavaScript and constrained hardware",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-10",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10",
    "summary": "Pico LED, BMP180 and graphical LCD programs have browser checks through selected Espruino API adaptations. Kinoma main/browser source has virtual Pins/WebSocket APIs; its GPL-derived compass helper is replaced by an original model. Kinoma browser compass messages are checked. Native interpreter, CPU, SPI timing and network behavior are outside these adaptations.",
    "status": "partial",
    "exercises": [
      {
        "name": "Espruino Pico lights",
        "path": "chapter-10/01-pico-led-blink",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/01-pico-led-blink",
        "needs": [
          "Espruino Pico onboard LED1/LED2"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard LED1 and LED2 alternate. This provides a selected Espruino API adaptation, not its native JavaScript interpreter.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": []
      },
      {
        "name": "Pico weather sensor",
        "path": "chapter-10/02-pico-bmp180",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/02-pico-bmp180",
        "needs": [
          "Espruino Pico",
          "BMP180",
          "BMP085"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire BMP180 power, GND, B6/SCL and B7/SDA. The virtual BMP085 module supplies readings from your connected sensor controls.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "BMP085"
        ]
      },
      {
        "name": "Pico graphical LCD timer",
        "path": "chapter-10/03-pico-nokia-5110-timer",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/03-pico-nokia-5110-timer",
        "needs": [
          "Espruino Pico",
          "Nokia5110 PCD8544",
          "BTN",
          "PCD8544"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire Nokia5110 SCK=B3, MOSI=B5, DC=B13, CE=B14, RST=B15. Press the Pico BTN to start. Selected Graphics calls are adapted; SPI electrical timing is not emulated.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "PCD8544"
        ]
      },
      {
        "name": "Pico graphical weather display",
        "path": "chapter-10/04-pico-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/04-pico-weather",
        "needs": [
          "Espruino Pico",
          "Nokia5110",
          "BMP180",
          "BMP085",
          "PCD8544"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire both BMP180 and Nokia5110 as shown in the book. The displayed raster font approximates Espruino vector text.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "BMP085",
          "PCD8544"
        ]
      },
      {
        "name": "Kinoma compass web app",
        "path": "chapter-10/05-kinoma-element-compass",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/05-kinoma-element-compass",
        "needs": [
          "Kinoma Element",
          "HMC5883L",
          "pins",
          "websocket"
        ],
        "status": "runtime-checked",
        "note": "Original Kinoma main.js and HTML page display compass heading 123.40 using the explicit virtual Pins/WebSocket adapter. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original main.js and browser compass page use a narrow ESM adaptation and virtual Pins/WebSocket APIs. The GPL-derived HMC5883L helper is linked separately and replaced by an original heading model; native Kinoma CPU/network behavior is not emulated.",
        "files": [
          "HMC5883L.js",
          "index.html",
          "main.js",
          "project.json"
        ],
        "dependencies": [
          "pins",
          "websocket"
        ]
      }
    ]
  },
  {
    "number": 11,
    "title": "Building with Node.js and tiny computers",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-11",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11",
    "summary": "Pi/BeagleBone GPIO, virtual sysfs files, selected wiring-pi/Raspi/BeagleBone APIs and weather web previews are available. The original shell blink uses a bounded virtual echo/sleep/GPIO-filesystem interpreter. Native Bash, OS/addons and actual TCP networking remain external.",
    "status": "partial",
    "exercises": [
      {
        "name": "Pi GPIO from a shell",
        "path": "chapter-11/01-rpi3-blink-sysfs",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/01-rpi3-blink-sysfs",
        "needs": [
          "RaspberryPi3",
          "LED BCM4 physical7"
        ],
        "status": "runtime-checked",
        "note": "Original blink.sh is checked in a browser worker: GPIO4 export, output direction, HIGH/LOW writes with sleep, and unexport use the bounded virtual shell/filesystem. No host shell or native OS is accessed. Original blink.sh uses a bounded virtual shell for echo redirection into the GPIO filesystem and sleep. Wire an LED and a 330 Ω resistor to physical header 7/BCM GPIO4. This runs entirely in the browser; it does not execute Bash or access your computer/Linux kernel.",
        "files": [
          "blink.sh"
        ],
        "dependencies": []
      },
      {
        "name": "Pi GPIO through virtual files",
        "path": "chapter-11/02-rpi3-blink-sysfs-js",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/02-rpi3-blink-sysfs-js",
        "needs": [
          "RaspberryPi3",
          "LED BCM4 physical7",
          "fs"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7 (BCM GPIO4). The file paths refer to a virtual GPIO filesystem, not your computer or a Linux kernel.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "fs"
        ]
      },
      {
        "name": "Pi GPIO with wiring-pi",
        "path": "chapter-11/03-rpi3-blink-wiring-pi",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/03-rpi3-blink-wiring-pi",
        "needs": [
          "RaspberryPi3",
          "LED physical7",
          "wiring-pi"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. The wiring-pi module here is a virtual addon; wiringPi 7 maps to BCM4.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "wiring-pi"
        ]
      },
      {
        "name": "Johnny-Five on Pi",
        "path": "chapter-11/04-rpi3-blink-j5",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/04-rpi3-blink-j5",
        "needs": [
          "RaspberryPi3",
          "LED7",
          "johnny-five",
          "raspi-io"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. Johnny-Five drives a virtual Raspi IO adapter. Numeric 7 is a wiringPi pin number.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "raspi-io"
        ]
      },
      {
        "name": "Pi weather sensor",
        "path": "chapter-11/05-rpi3-bmp180",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/05-rpi3-bmp180",
        "needs": [
          "RaspberryPi3",
          "BMP180",
          "johnny-five",
          "raspi-io"
        ],
        "status": "runtime-checked",
        "note": "Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. A genuine Johnny-Five BMP180 driver reads a powered I2C device through the virtual Raspi IO adapter. Native Linux is not emulated.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "johnny-five",
          "raspi-io"
        ]
      },
      {
        "name": "Pi weather web app",
        "path": "chapter-11/06-rpi3-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/06-rpi3-weather",
        "needs": [
          "RaspberryPi3",
          "BMP180",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "raspi-io",
          "socket.io"
        ],
        "status": "runtime-checked",
        "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual Raspi IO and selected in-memory server APIs. No native network listener is opened.",
        "files": [
          "app/index.html",
          "app/style.css",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "raspi-io",
          "socket.io"
        ]
      },
      {
        "name": "Uno weather web app",
        "path": "chapter-11/07-arduino-uno-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/07-arduino-uno-weather",
        "needs": [
          "Uno",
          "BMP180",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ],
        "status": "runtime-checked",
        "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original Johnny-Five runs on the AVR Uno simulation, with the web dashboard through selected in-memory server APIs. No native TCP server is opened.",
        "files": [
          "app/index.html",
          "app/style.css",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ]
      },
      {
        "name": "Johnny-Five on BeagleBone",
        "path": "chapter-11/08-bbb-blink-j5",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/08-bbb-blink-j5",
        "needs": [
          "BeagleBoneBlack onboard LED",
          "beaglebone-io",
          "johnny-five"
        ],
        "status": "runtime-checked",
        "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. The BeagleBone default onboard LED is USR3. GPIO APIs are adapted; the native operating system is not emulated.",
        "files": [
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "beaglebone-io",
          "johnny-five"
        ]
      },
      {
        "name": "BeagleBone weather web app",
        "path": "chapter-11/09-bbb-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/09-bbb-weather",
        "needs": [
          "BeagleBoneBlack",
          "BMP180",
          "beaglebone-io",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ],
        "status": "runtime-checked",
        "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual BeagleBone IO and selected in-memory server APIs. Native Linux and TCP are not emulated.",
        "files": [
          "app/index.html",
          "app/style.css",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "beaglebone-io",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ]
      }
    ]
  },
  {
    "number": 12,
    "title": "In the cloud, in the browser, and beyond",
    "url": "https://livebook.manning.com/book/javascript-on-things/chapter-12",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12",
    "summary": "The cloud weather program has a virtual local-server path; Puck LED/doorbell sources have explicit virtual Bluetooth serial models. Cloud provisioning, Docker deployment, physical Bluetooth pairing and radios remain external. Original Puck web button/doorbell flows, LED pulse, CHIME parsing and bundled audio loading have browser checks; complete prepared wiring remains a separate review.",
    "status": "partial",
    "exercises": [
      {
        "name": "Cloud-managed weather station",
        "path": "chapter-12/01-bbb-resin-io-weather",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/01-bbb-resin-io-weather",
        "needs": [
          "BeagleBoneBlack",
          "BMP180",
          "cloud fleet/container",
          "beaglebone-io",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ],
        "status": "runtime-checked",
        "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The weather program and web interface can run locally with virtual APIs. Resin/balena account, Docker deployment, device provisioning and cloud management are outside this browser model.",
        "files": [
          "Dockerfile.template",
          "app/index.html",
          "app/style.css",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "beaglebone-io",
          "express",
          "http",
          "johnny-five",
          "os",
          "path",
          "socket.io"
        ]
      },
      {
        "name": "Puck.js lights from a web page",
        "path": "chapter-12/02-puck-js-web-led-toggle",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/02-puck-js-web-led-toggle",
        "needs": [
          "Puck.js LED1",
          "browser BLE",
          "express",
          "http",
          "path"
        ],
        "status": "runtime-checked",
        "note": "Original Puck browser ON/OFF buttons control virtual LED1 through the explicit connection shim. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original browser buttons send LED1.set/reset through an explicit virtual Puck connection. This demonstrates the JavaScript workflow without a Bluetooth radio, physical pairing or native Puck interpreter.",
        "files": [
          "app/index.html",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "express",
          "http",
          "path"
        ]
      },
      {
        "name": "Bluetooth doorbell",
        "path": "chapter-12/03-puck-js-doorbell",
        "url": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/03-puck-js-doorbell",
        "needs": [
          "Puck.js BTN/LED1",
          "browser audio/BLE",
          "express",
          "http",
          "path"
        ],
        "status": "runtime-checked",
        "note": "Original doorbell HTML and PuckChime.js receive virtual BTN/CHIME text, emit a 250 ms LED1 pulse and load the inlined original audio asset in a real browser. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original PuckChime.js sends reset/button-watch code through a virtual Puck connection. BTN rising events emit CHIME text and LED flashes. Browser sound uses the bundled example audio; no Bluetooth radio or pairing is emulated.",
        "files": [
          "app/PuckChime.js",
          "app/chime.mp3",
          "app/index.html",
          "index.js",
          "package.json"
        ],
        "dependencies": [
          "express",
          "http",
          "path"
        ]
      }
    ]
  }
];

export const bookExamples = [
  {
    "id": "book-chapter-02-02-hello-world-johnny-five",
    "chapter": 2,
    "name": "Johnny-Five: hello, LED",
    "title": "Johnny-Five: hello, LED",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led = new five.Led(13);\n  led.blink(500);\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led = new five.Led(13);\n  led.blink(500);\n});\n",
    "sourcePath": "chapter-02/02-hello-world-johnny-five",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/02-hello-world-johnny-five",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Pin 13 changes HIGH and LOW after board ready. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED D13"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:13",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-02-03-hello-world-stop",
    "chapter": 2,
    "name": "Stop after counting blinks",
    "title": "Stop after counting blinks",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led = new five.Led(13);\n  var blinkCount = 0;\n  const blinkMax = 10;\n\n  led.blink(500, () => {\n    blinkCount++;\n    console.log(`I have changed state ${blinkCount} times`);\n    if (blinkCount >= blinkMax) {\n      console.log('I shall stop blinking now');\n      led.stop();\n    }\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led = new five.Led(13);\n  var blinkCount = 0;\n  const blinkMax = 10;\n\n  led.blink(500, () => {\n    blinkCount++;\n    console.log(`I have changed state ${blinkCount} times`);\n    if (blinkCount >= blinkMax) {\n      console.log('I shall stop blinking now');\n      led.stop();\n    }\n  });\n});\n",
    "sourcePath": "chapter-02/03-hello-world-stop",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/03-hello-world-stop",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Ten callbacks observed; no extra callback after stopping. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED D13"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:13",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-04-01-photoresistor",
    "chapter": 4,
    "name": "Read a photoresistor",
    "title": "Read a photoresistor",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const sensor = new five.Sensor({\n    pin: 'A0'\n  });\n  sensor.on('data', () => {\n    console.log(sensor.value);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const sensor = new five.Sensor({\n    pin: 'A0'\n  });\n  sensor.on('data', () => {\n    console.log(sensor.value);\n  });\n});\n",
    "sourcePath": "chapter-04/01-photoresistor",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/01-photoresistor",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LDR divider A0",
      "4.7k resistor"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "ldr",
          "type": "photoresistor",
          "x": 505,
          "y": 125,
          "value": 500
        },
        {
          "id": "ldr-divider",
          "type": "resistor",
          "x": 505,
          "y": 255,
          "value": 4700
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "ldr:1"
        },
        {
          "a": "ldr:2",
          "b": "board:A0"
        },
        {
          "a": "ldr:2",
          "b": "ldr-divider:1"
        },
        {
          "a": "ldr-divider:2",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-04-02-photoresistor-threshold",
    "chapter": 4,
    "name": "Sensor change threshold",
    "title": "Sensor change threshold",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const sensor = new five.Sensor({\n    pin: 'A0'\n  });\n  sensor.threshold = 5;\n  sensor.on('change', () => {\n    console.log(sensor.value);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const sensor = new five.Sensor({\n    pin: 'A0'\n  });\n  sensor.threshold = 5;\n  sensor.on('change', () => {\n    console.log(sensor.value);\n  });\n});\n",
    "sourcePath": "chapter-04/02-photoresistor-threshold",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/02-photoresistor-threshold",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LDR divider A0",
      "4.7k resistor"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "ldr",
          "type": "photoresistor",
          "x": 505,
          "y": 125,
          "value": 500
        },
        {
          "id": "ldr-divider",
          "type": "resistor",
          "x": 505,
          "y": 255,
          "value": 4700
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "ldr:1"
        },
        {
          "a": "ldr:2",
          "b": "board:A0"
        },
        {
          "a": "ldr:2",
          "b": "ldr-divider:1"
        },
        {
          "a": "ldr-divider:2",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-04-03-temperature",
    "chapter": 4,
    "name": "Read a TMP36 thermometer",
    "title": "Read a TMP36 thermometer",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const tmp36 = new five.Thermometer({\n    controller: 'TMP36',\n    pin       : 'A0'\n  });\n  tmp36.on('data', () => {\n    console.log(tmp36.celsius);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const tmp36 = new five.Thermometer({\n    controller: 'TMP36',\n    pin       : 'A0'\n  });\n  tmp36.on('data', () => {\n    console.log(tmp36.celsius);\n  });\n});\n",
    "sourcePath": "chapter-04/03-temperature",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/03-temperature",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "TMP36 A0"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "tmp36",
          "type": "tmp36",
          "x": 510,
          "y": 160,
          "value": 25
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "tmp36:VCC"
        },
        {
          "a": "tmp36:OUT",
          "b": "board:A0"
        },
        {
          "a": "tmp36:GND",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-04-04-temperature-repl",
    "chapter": 4,
    "name": "Inspect a thermometer in the console",
    "title": "Inspect a thermometer in the console",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const tmp36 = new five.Thermometer({\n    controller: 'TMP36',\n    pin       : 'A0'\n  });\n  board.repl.inject({\n    tmp36: tmp36\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const tmp36 = new five.Thermometer({\n    controller: 'TMP36',\n    pin       : 'A0'\n  });\n  board.repl.inject({\n    tmp36: tmp36\n  });\n});\n",
    "sourcePath": "chapter-04/04-temperature-repl",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/04-temperature-repl",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "TMP36 A0"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "tmp36",
          "type": "tmp36",
          "x": 510,
          "y": 160,
          "value": 25
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "tmp36:VCC"
        },
        {
          "a": "tmp36:OUT",
          "b": "board:A0"
        },
        {
          "a": "tmp36:GND",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-04-05-button",
    "chapter": 4,
    "name": "Read a push button",
    "title": "Read a push button",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pushButton = new five.Button(2);\n  pushButton.on('down', () => {\n    console.log('I have been pressed!');\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pushButton = new five.Button(2);\n  pushButton.on('down', () => {\n    console.log('I have been pressed!');\n  });\n});\n",
    "sourcePath": "chapter-04/05-button",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/05-button",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Active-high D2 press invokes original down handler. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "button D2",
      "10k pulldown"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "pushbutton",
          "type": "button",
          "x": 515,
          "y": 160,
          "value": 0
        },
        {
          "id": "pushbutton-pull-down",
          "type": "resistor",
          "x": 515,
          "y": 320,
          "value": 10000
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "pushbutton:1.l"
        },
        {
          "a": "pushbutton:2.l",
          "b": "board:2"
        },
        {
          "a": "pushbutton:2.l",
          "b": "pushbutton-pull-down:1"
        },
        {
          "a": "pushbutton-pull-down:2",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-01-experiment-led",
    "chapter": 5,
    "name": "Experiment with two LEDs",
    "title": "Experiment with two LEDs",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led1 = new five.Led(2);\n  const led2 = new five.Led(3);\n\n  board.repl.inject({\n    led1: led1,\n    led2: led2\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const led1 = new five.Led(2);\n  const led2 = new five.Led(3);\n\n  board.repl.inject({\n    led1: led1,\n    led2: led2\n  });\n});\n",
    "sourcePath": "chapter-05/01-experiment-led",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/01-experiment-led",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Injected LED1 D2 on and LED2 D3 brightness(128) produce real pin signals. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED D2",
      "LED D3"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "first-light",
          "type": "led",
          "x": 500,
          "y": 60
        },
        {
          "id": "first-light-resistor",
          "type": "resistor",
          "x": 500,
          "y": 180,
          "value": 330
        },
        {
          "id": "second-light",
          "type": "led",
          "x": 690,
          "y": 60
        },
        {
          "id": "second-light-resistor",
          "type": "resistor",
          "x": 690,
          "y": 180,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:2",
          "b": "first-light-resistor:1"
        },
        {
          "a": "first-light-resistor:2",
          "b": "first-light:A"
        },
        {
          "a": "first-light:C",
          "b": "board:GND.2"
        },
        {
          "a": "board:3",
          "b": "second-light-resistor:1"
        },
        {
          "a": "second-light-resistor:2",
          "b": "second-light:A"
        },
        {
          "a": "second-light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-02-animate-led",
    "chapter": 5,
    "name": "Animate LED brightness",
    "title": "Animate LED brightness",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pulsingLED = new five.Led(3);\n  const options = {\n    easing    : 'inOutSine',\n    metronomic: true,\n    loop      : true,\n    keyFrames : [0, 255],\n    duration  : 1000\n  };\n  const animation = new five.Animation(pulsingLED);\n  animation.enqueue(options);\n});\n"
    },
    "code": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pulsingLED = new five.Led(3);\n  const options = {\n    easing    : 'inOutSine',\n    metronomic: true,\n    loop      : true,\n    keyFrames : [0, 255],\n    duration  : 1000\n  };\n  const animation = new five.Animation(pulsingLED);\n  animation.enqueue(options);\n});\n",
    "sourcePath": "chapter-05/02-animate-led",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/02-animate-led",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original Animation generates varying D3 PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED PWM D3"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:3",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-03-timer-led-simple",
    "chapter": 5,
    "name": "A simple LED timer",
    "title": "A simple LED timer",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pulsingLED = new five.Led(3);\n  const timerLength = 10000;\n  setTimeout(() => {\n    pulsingLED.pulse();\n  }, timerLength);\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const pulsingLED = new five.Led(3);\n  const timerLength = 10000;\n  setTimeout(() => {\n    pulsingLED.pulse();\n  }, timerLength);\n});\n",
    "sourcePath": "chapter-05/03-timer-led-simple",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/03-timer-led-simple",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original 10-second timeout begins real PWM pulse. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED PWM D3"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:3",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-04-nightlight",
    "chapter": 5,
    "name": "Automatic nightlight",
    "title": "Automatic nightlight",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const nightlight = new five.Led(3);\n  const ldr        = new five.Light({ pin : 'A0', freq: 500 });\n  var dimmest = 1024,\n    brightest = 0;\n  ldr.on('change', () => {\n    if (ldr.value < dimmest)   { dimmest   = ldr.value; }\n    if (ldr.value > brightest) { brightest = ldr.value; }\n\n    const relativeValue = five.Fn.scale(ldr.value, dimmest, brightest, 0, 511);\n    if (relativeValue <= 255) {\n      nightlight.brightness((relativeValue >> 1) ^ 255);\n    } else {\n      nightlight.off();\n    }\n  });\n});\n"
    },
    "code": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const nightlight = new five.Led(3);\n  const ldr        = new five.Light({ pin : 'A0', freq: 500 });\n  var dimmest = 1024,\n    brightest = 0;\n  ldr.on('change', () => {\n    if (ldr.value < dimmest)   { dimmest   = ldr.value; }\n    if (ldr.value > brightest) { brightest = ldr.value; }\n\n    const relativeValue = five.Fn.scale(ldr.value, dimmest, brightest, 0, 511);\n    if (relativeValue <= 255) {\n      nightlight.brightness((relativeValue >> 1) ^ 255);\n    } else {\n      nightlight.off();\n    }\n  });\n});\n",
    "sourcePath": "chapter-05/04-nightlight",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/04-nightlight",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original calibration/scale/bitwise code lights D3 after bright-to-dark input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "LED PWM D3",
      "LDR divider A0"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "ldr",
          "type": "photoresistor",
          "x": 505,
          "y": 125,
          "value": 500
        },
        {
          "id": "ldr-divider",
          "type": "resistor",
          "x": 505,
          "y": 255,
          "value": 4700
        },
        {
          "id": "light",
          "type": "led",
          "x": 620,
          "y": 55
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 620,
          "y": 175,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "ldr:1"
        },
        {
          "a": "ldr:2",
          "b": "board:A0"
        },
        {
          "a": "ldr:2",
          "b": "ldr-divider:1"
        },
        {
          "a": "ldr-divider:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:3",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-05-weatherball",
    "chapter": 5,
    "name": "Weather ball",
    "title": "Weather ball",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const request = require('request');\nconst five    = require('johnny-five');\n\nconst API_KEY = 'YOUR API KEY HERE';\nconst LAT     = '43.3463760';\nconst LONG    = '-72.6395340';\nconst API_URL = 'https://api.darksky.net/forecast';\n\nconst board   = new five.Board();\n\nboard.on('ready', () => {\n  console.log('Powered by Dark Sky: https://darksky.net/poweredby/');\n  const rgb        = new five.Led.RGB({ pins: [3, 5, 6] });\n  const requestURL = `${API_URL}/${API_KEY}/${LAT},${LONG}`;\n\n  request(requestURL, function (error, response, body) {\n    if (error) {\n      console.error(error);\n    } else if (response.statusCode === 200) {\n      const forecast   = JSON.parse(body);\n      const daily      = forecast.daily.data;\n      const willBeDamp = daily[1].precipProbability > 0.2;\n      const tempDelta  = daily[1].temperatureMax - daily[0].temperatureMax;\n      console.log(forecast);\n\n      if (tempDelta > 4) {\n        rgb.color('#ff0000'); // warmer\n      } else if (tempDelta < -4) {\n        rgb.color('#ffffff'); // colder\n      } else {\n        rgb.color('#00ff00'); // about the same\n      }\n      if (willBeDamp) { rgb.strobe(1000); }\n    }\n  });\n});\n"
    },
    "code": "const request = require('request');\nconst five    = require('johnny-five');\n\nconst API_KEY = 'YOUR API KEY HERE';\nconst LAT     = '43.3463760';\nconst LONG    = '-72.6395340';\nconst API_URL = 'https://api.darksky.net/forecast';\n\nconst board   = new five.Board();\n\nboard.on('ready', () => {\n  console.log('Powered by Dark Sky: https://darksky.net/poweredby/');\n  const rgb        = new five.Led.RGB({ pins: [3, 5, 6] });\n  const requestURL = `${API_URL}/${API_KEY}/${LAT},${LONG}`;\n\n  request(requestURL, function (error, response, body) {\n    if (error) {\n      console.error(error);\n    } else if (response.statusCode === 200) {\n      const forecast   = JSON.parse(body);\n      const daily      = forecast.daily.data;\n      const willBeDamp = daily[1].precipProbability > 0.2;\n      const tempDelta  = daily[1].temperatureMax - daily[0].temperatureMax;\n      console.log(forecast);\n\n      if (tempDelta > 4) {\n        rgb.color('#ff0000'); // warmer\n      } else if (tempDelta < -4) {\n        rgb.color('#ffffff'); // colder\n      } else {\n        rgb.color('#00ff00'); // about the same\n      }\n      if (willBeDamp) { rgb.strobe(1000); }\n    }\n  });\n});\n",
    "sourcePath": "chapter-05/05-weatherball",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/05-weatherball",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Explicit retired-DarkSky fixture produces red RGB PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "common-cathode RGB LED D3/D5/D6"
    ],
    "fixtures": {
      "weather": {
        "currently": {
          "temperature": 68,
          "summary": "Sample forecast for the browser lab"
        },
        "daily": {
          "data": [
            {
              "temperatureMax": 68,
              "precipProbability": 0.1
            },
            {
              "temperatureMax": 75,
              "precipProbability": 0.65
            }
          ]
        }
      }
    },
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "rgb",
          "type": "rgb",
          "x": 600,
          "y": 100
        },
        {
          "id": "color-resistor-R",
          "type": "resistor",
          "x": 440,
          "y": 160,
          "value": 330
        },
        {
          "id": "color-resistor-G",
          "type": "resistor",
          "x": 440,
          "y": 250,
          "value": 330
        },
        {
          "id": "color-resistor-B",
          "type": "resistor",
          "x": 440,
          "y": 340,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "rgb:COM",
          "b": "board:GND.2"
        },
        {
          "a": "board:3",
          "b": "color-resistor-R:1"
        },
        {
          "a": "color-resistor-R:2",
          "b": "rgb:R"
        },
        {
          "a": "board:5",
          "b": "color-resistor-G:1"
        },
        {
          "a": "color-resistor-G:2",
          "b": "rgb:G"
        },
        {
          "a": "board:6",
          "b": "color-resistor-B:1"
        },
        {
          "a": "color-resistor-B:2",
          "b": "rgb:B"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-06-timer-lcd",
    "chapter": 5,
    "name": "LCD timer",
    "title": "LCD timer",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nconst DEFAULT_TIMER = 60000;\nconst UPPER_LIMIT   = 99 * 60000;\nconst LOWER_LIMIT   = 1000;\n\nboard.on('ready', () => {\n  const downButton = new five.Button(2);\n  const upButton   = new five.Button(3);\n  const goButton   = new five.Button(4);\n  const lcd        = new five.LCD([7, 8, 9, 10, 11, 12]);\n  const alertLED   = new five.Led(6);\n  var remaining, timer, timeString, lastTimeString, timestamp, lastTimestamp;\n\n  function init () {\n    remaining      = DEFAULT_TIMER;\n    lastTimeString = '00:00';\n    timeString     = '';\n    showRemaining();\n  }\n\n  function showRemaining () {\n    var minutes, seconds, minPad, secPad;\n    minutes    = Math.floor(remaining / 60000);\n    seconds    = Math.floor((remaining % 60000) / 1000);\n    minPad     = (minutes < 10) ? '0' : '';\n    secPad     = (seconds < 10) ? '0' : '';\n    timeString = `${minPad}${minutes}:${secPad}${seconds}`;\n    if (timeString != lastTimeString) {\n      lcd.cursor(0, 0).print(timeString);\n    }\n  }\n\n  function adjustTime (delta) {\n    remaining += delta;\n    if (remaining < LOWER_LIMIT) {\n      remaining = LOWER_LIMIT;\n    } else if (remaining > UPPER_LIMIT) {\n      remaining = UPPER_LIMIT;\n    }\n    showRemaining();\n  }\n\n  function start () {\n    alertLED.stop().off();\n    lcd.clear();\n    timestamp = Date.now();\n    timer     = setInterval(tick, 250);\n    tick();\n  }\n\n  function pause () {\n    timer = clearInterval(timer);\n    lcd.cursor(0, 9).print('PAUSED');\n  }\n\n  function tick () {\n    lastTimestamp = timestamp;\n    timestamp     = Date.now();\n    remaining -= (timestamp - lastTimestamp);\n    if (remaining <= 0) {\n      timer = clearInterval(timer);\n      chime();\n      init();\n    }\n    showRemaining();\n  }\n\n  function chime () {\n    alertLED.pulse();\n    lcd.cursor(0, 9).print('DONE!');\n  }\n\n  downButton.on('press', () => { // remove a second\n    adjustTime(-1000);\n  });\n  upButton.on('press', () => { // add a second\n    adjustTime(1000);\n  });\n  goButton.on('press', () => {\n    if (!timer) {\n      start();\n    } else {\n      pause();\n    }\n  });\n  init();\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nconst DEFAULT_TIMER = 60000;\nconst UPPER_LIMIT   = 99 * 60000;\nconst LOWER_LIMIT   = 1000;\n\nboard.on('ready', () => {\n  const downButton = new five.Button(2);\n  const upButton   = new five.Button(3);\n  const goButton   = new five.Button(4);\n  const lcd        = new five.LCD([7, 8, 9, 10, 11, 12]);\n  const alertLED   = new five.Led(6);\n  var remaining, timer, timeString, lastTimeString, timestamp, lastTimestamp;\n\n  function init () {\n    remaining      = DEFAULT_TIMER;\n    lastTimeString = '00:00';\n    timeString     = '';\n    showRemaining();\n  }\n\n  function showRemaining () {\n    var minutes, seconds, minPad, secPad;\n    minutes    = Math.floor(remaining / 60000);\n    seconds    = Math.floor((remaining % 60000) / 1000);\n    minPad     = (minutes < 10) ? '0' : '';\n    secPad     = (seconds < 10) ? '0' : '';\n    timeString = `${minPad}${minutes}:${secPad}${seconds}`;\n    if (timeString != lastTimeString) {\n      lcd.cursor(0, 0).print(timeString);\n    }\n  }\n\n  function adjustTime (delta) {\n    remaining += delta;\n    if (remaining < LOWER_LIMIT) {\n      remaining = LOWER_LIMIT;\n    } else if (remaining > UPPER_LIMIT) {\n      remaining = UPPER_LIMIT;\n    }\n    showRemaining();\n  }\n\n  function start () {\n    alertLED.stop().off();\n    lcd.clear();\n    timestamp = Date.now();\n    timer     = setInterval(tick, 250);\n    tick();\n  }\n\n  function pause () {\n    timer = clearInterval(timer);\n    lcd.cursor(0, 9).print('PAUSED');\n  }\n\n  function tick () {\n    lastTimestamp = timestamp;\n    timestamp     = Date.now();\n    remaining -= (timestamp - lastTimestamp);\n    if (remaining <= 0) {\n      timer = clearInterval(timer);\n      chime();\n      init();\n    }\n    showRemaining();\n  }\n\n  function chime () {\n    alertLED.pulse();\n    lcd.cursor(0, 9).print('DONE!');\n  }\n\n  downButton.on('press', () => { // remove a second\n    adjustTime(-1000);\n  });\n  upButton.on('press', () => { // add a second\n    adjustTime(1000);\n  });\n  goButton.on('press', () => {\n    if (!timer) {\n      start();\n    } else {\n      pause();\n    }\n  });\n  init();\n});\n",
    "sourcePath": "chapter-05/06-timer-lcd",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/06-timer-lcd",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original physical buttons select 00:01 and Go reaches DONE; pause works; completion LED6 pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "buttons D2/D3/D4",
      "parallel 16x2 LCD D7..D12",
      "LCD contrast potentiometer",
      "LED D6"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "lcd",
          "type": "lcd",
          "x": 380,
          "y": 15
        },
        {
          "id": "contrast",
          "type": "pot",
          "x": 850,
          "y": 50,
          "value": 100
        },
        {
          "id": "down",
          "type": "button",
          "x": 380,
          "y": 320,
          "value": 0
        },
        {
          "id": "down-pull-down",
          "type": "resistor",
          "x": 380,
          "y": 480,
          "value": 10000
        },
        {
          "id": "up",
          "type": "button",
          "x": 510,
          "y": 320,
          "value": 0
        },
        {
          "id": "up-pull-down",
          "type": "resistor",
          "x": 510,
          "y": 480,
          "value": 10000
        },
        {
          "id": "go",
          "type": "button",
          "x": 640,
          "y": 320,
          "value": 0
        },
        {
          "id": "go-pull-down",
          "type": "resistor",
          "x": 640,
          "y": 480,
          "value": 10000
        },
        {
          "id": "light",
          "type": "led",
          "x": 820,
          "y": 230
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 820,
          "y": 350,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "lcd:VDD"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:VSS"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:RW"
        },
        {
          "a": "board:5V",
          "b": "contrast:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "contrast:GND"
        },
        {
          "a": "contrast:SIG",
          "b": "lcd:V0"
        },
        {
          "a": "board:5V",
          "b": "lcd:A"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:K"
        },
        {
          "a": "board:7",
          "b": "lcd:RS"
        },
        {
          "a": "board:8",
          "b": "lcd:E"
        },
        {
          "a": "board:9",
          "b": "lcd:D4"
        },
        {
          "a": "board:10",
          "b": "lcd:D5"
        },
        {
          "a": "board:11",
          "b": "lcd:D6"
        },
        {
          "a": "board:12",
          "b": "lcd:D7"
        },
        {
          "a": "board:5V",
          "b": "down:1.l"
        },
        {
          "a": "down:2.l",
          "b": "board:2"
        },
        {
          "a": "down:2.l",
          "b": "down-pull-down:1"
        },
        {
          "a": "down-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:5V",
          "b": "up:1.l"
        },
        {
          "a": "up:2.l",
          "b": "board:3"
        },
        {
          "a": "up:2.l",
          "b": "up-pull-down:1"
        },
        {
          "a": "up-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:5V",
          "b": "go:1.l"
        },
        {
          "a": "go:2.l",
          "b": "board:4"
        },
        {
          "a": "go:2.l",
          "b": "go-pull-down:1"
        },
        {
          "a": "go-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:6",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND.2"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-05-07-timer-lcd-piezo",
    "chapter": 5,
    "name": "LCD timer with a chime",
    "title": "LCD timer with a chime",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nconst DEFAULT_TIMER = 60000;\nconst UPPER_LIMIT   = 99 * 60000;\nconst LOWER_LIMIT   = 1000;\n\nboard.on('ready', () => {\n  const downButton = new five.Button(2);\n  const upButton   = new five.Button(3);\n  const goButton   = new five.Button(4);\n  const lcd        = new five.LCD([7, 8, 9, 10, 11, 12]);\n  const alertChime = new five.Piezo(6);\n  var remaining, timer, timeString, lastTimeString, timestamp, lastTimestamp;\n\n  function init () {\n    remaining      = DEFAULT_TIMER;\n    lastTimeString = '00:00';\n    timeString     = '';\n    showRemaining();\n  }\n\n  function showRemaining () {\n    var minutes, seconds, minPad, secPad;\n    minutes    = Math.floor(remaining / 60000);\n    seconds    = Math.floor((remaining % 60000) / 1000);\n    minPad     = (minutes < 10) ? '0' : '';\n    secPad     = (seconds < 10) ? '0' : '';\n    timeString = `${minPad}${minutes}:${secPad}${seconds}`;\n    if (timeString != lastTimeString) {\n      lcd.cursor(0, 0).print(timeString);\n    }\n  }\n\n  function adjustTime (delta) {\n    remaining += delta;\n    if (remaining < LOWER_LIMIT) {\n      remaining = LOWER_LIMIT;\n    } else if (remaining > UPPER_LIMIT) {\n      remaining = UPPER_LIMIT;\n    }\n    showRemaining();\n  }\n\n  function start () {\n    lcd.clear();\n    timestamp = Date.now();\n    timer     = setInterval(tick, 250);\n    tick();\n  }\n\n  function pause () {\n    timer = clearInterval(timer);\n    lcd.cursor(0, 9).print('PAUSED');\n  }\n\n  function tick () {\n    lastTimestamp = timestamp;\n    timestamp     = Date.now();\n    remaining -= (timestamp - lastTimestamp);\n    if (remaining <= 0) {\n      timer = clearInterval(timer);\n      chime();\n      init();\n    }\n    showRemaining();\n  }\n\n  function chime () {\n    alertChime.play({\n      tempo: 120,\n      song: [\n        ['e5', 1],\n        ['g#5', 1],\n        ['f#5', 1],\n        ['b4', 2],\n        ['e5', 1],\n        ['f#5', 1],\n        ['g#5', 1],\n        ['e5', 2],\n        ['g#5', 1],\n        ['e5', 1],\n        ['f#5', 1],\n        ['b4', 2],\n        ['b4', 1],\n        ['f#5', 1],\n        ['g#5', 1],\n        ['e5', 2]\n      ]\n    });\n    lcd.cursor(0, 9).print('DONE!');\n  }\n\n  downButton.on('press', () => { // remove a second\n    adjustTime(-1000);\n  });\n  upButton.on('press', () => { // add a second\n    adjustTime(1000);\n  });\n  goButton.on('press', () => {\n    if (!timer) {\n      start();\n    } else {\n      pause();\n    }\n  });\n  init();\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nconst DEFAULT_TIMER = 60000;\nconst UPPER_LIMIT   = 99 * 60000;\nconst LOWER_LIMIT   = 1000;\n\nboard.on('ready', () => {\n  const downButton = new five.Button(2);\n  const upButton   = new five.Button(3);\n  const goButton   = new five.Button(4);\n  const lcd        = new five.LCD([7, 8, 9, 10, 11, 12]);\n  const alertChime = new five.Piezo(6);\n  var remaining, timer, timeString, lastTimeString, timestamp, lastTimestamp;\n\n  function init () {\n    remaining      = DEFAULT_TIMER;\n    lastTimeString = '00:00';\n    timeString     = '';\n    showRemaining();\n  }\n\n  function showRemaining () {\n    var minutes, seconds, minPad, secPad;\n    minutes    = Math.floor(remaining / 60000);\n    seconds    = Math.floor((remaining % 60000) / 1000);\n    minPad     = (minutes < 10) ? '0' : '';\n    secPad     = (seconds < 10) ? '0' : '';\n    timeString = `${minPad}${minutes}:${secPad}${seconds}`;\n    if (timeString != lastTimeString) {\n      lcd.cursor(0, 0).print(timeString);\n    }\n  }\n\n  function adjustTime (delta) {\n    remaining += delta;\n    if (remaining < LOWER_LIMIT) {\n      remaining = LOWER_LIMIT;\n    } else if (remaining > UPPER_LIMIT) {\n      remaining = UPPER_LIMIT;\n    }\n    showRemaining();\n  }\n\n  function start () {\n    lcd.clear();\n    timestamp = Date.now();\n    timer     = setInterval(tick, 250);\n    tick();\n  }\n\n  function pause () {\n    timer = clearInterval(timer);\n    lcd.cursor(0, 9).print('PAUSED');\n  }\n\n  function tick () {\n    lastTimestamp = timestamp;\n    timestamp     = Date.now();\n    remaining -= (timestamp - lastTimestamp);\n    if (remaining <= 0) {\n      timer = clearInterval(timer);\n      chime();\n      init();\n    }\n    showRemaining();\n  }\n\n  function chime () {\n    alertChime.play({\n      tempo: 120,\n      song: [\n        ['e5', 1],\n        ['g#5', 1],\n        ['f#5', 1],\n        ['b4', 2],\n        ['e5', 1],\n        ['f#5', 1],\n        ['g#5', 1],\n        ['e5', 2],\n        ['g#5', 1],\n        ['e5', 1],\n        ['f#5', 1],\n        ['b4', 2],\n        ['b4', 1],\n        ['f#5', 1],\n        ['g#5', 1],\n        ['e5', 2]\n      ]\n    });\n    lcd.cursor(0, 9).print('DONE!');\n  }\n\n  downButton.on('press', () => { // remove a second\n    adjustTime(-1000);\n  });\n  upButton.on('press', () => { // add a second\n    adjustTime(1000);\n  });\n  goButton.on('press', () => {\n    if (!timer) {\n      start();\n    } else {\n      pause();\n    }\n  });\n  init();\n});\n",
    "sourcePath": "chapter-05/07-timer-lcd-piezo",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/07-timer-lcd-piezo",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original physical buttons select 00:01 and Go reaches DONE; pause works; piezo pin 6 emits a tone. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "buttons D2/D3/D4",
      "parallel 16x2 LCD D7..D12",
      "LCD contrast potentiometer",
      "piezo D6"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "lcd",
          "type": "lcd",
          "x": 380,
          "y": 15
        },
        {
          "id": "contrast",
          "type": "pot",
          "x": 850,
          "y": 50,
          "value": 100
        },
        {
          "id": "down",
          "type": "button",
          "x": 380,
          "y": 320,
          "value": 0
        },
        {
          "id": "down-pull-down",
          "type": "resistor",
          "x": 380,
          "y": 480,
          "value": 10000
        },
        {
          "id": "up",
          "type": "button",
          "x": 510,
          "y": 320,
          "value": 0
        },
        {
          "id": "up-pull-down",
          "type": "resistor",
          "x": 510,
          "y": 480,
          "value": 10000
        },
        {
          "id": "go",
          "type": "button",
          "x": 640,
          "y": 320,
          "value": 0
        },
        {
          "id": "go-pull-down",
          "type": "resistor",
          "x": 640,
          "y": 480,
          "value": 10000
        },
        {
          "id": "chime",
          "type": "piezo",
          "x": 820,
          "y": 230
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "lcd:VDD"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:VSS"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:RW"
        },
        {
          "a": "board:5V",
          "b": "contrast:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "contrast:GND"
        },
        {
          "a": "contrast:SIG",
          "b": "lcd:V0"
        },
        {
          "a": "board:5V",
          "b": "lcd:A"
        },
        {
          "a": "board:GND.2",
          "b": "lcd:K"
        },
        {
          "a": "board:7",
          "b": "lcd:RS"
        },
        {
          "a": "board:8",
          "b": "lcd:E"
        },
        {
          "a": "board:9",
          "b": "lcd:D4"
        },
        {
          "a": "board:10",
          "b": "lcd:D5"
        },
        {
          "a": "board:11",
          "b": "lcd:D6"
        },
        {
          "a": "board:12",
          "b": "lcd:D7"
        },
        {
          "a": "board:5V",
          "b": "down:1.l"
        },
        {
          "a": "down:2.l",
          "b": "board:2"
        },
        {
          "a": "down:2.l",
          "b": "down-pull-down:1"
        },
        {
          "a": "down-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:5V",
          "b": "up:1.l"
        },
        {
          "a": "up:2.l",
          "b": "board:3"
        },
        {
          "a": "up:2.l",
          "b": "up-pull-down:1"
        },
        {
          "a": "up-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:5V",
          "b": "go:1.l"
        },
        {
          "a": "go:2.l",
          "b": "board:4"
        },
        {
          "a": "go:2.l",
          "b": "go-pull-down:1"
        },
        {
          "a": "go-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:6",
          "b": "chime:2"
        },
        {
          "a": "board:GND.2",
          "b": "chime:1"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-06-01-motor-basic",
    "chapter": 6,
    "name": "Control a DC motor",
    "title": "Control a DC motor",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const motor = new five.Motor({ pin: 6 });\n  board.repl.inject({\n    motor: motor\n  });\n});\n"
    },
    "code": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const motor = new five.Motor({ pin: 6 });\n  board.repl.inject({\n    motor: motor\n  });\n});\n",
    "sourcePath": "chapter-06/01-motor-basic",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/01-motor-basic",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Motor start(128)/stop() via original REPL yields PWM duty about 0.5/0. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "DC motor PWM D6",
      "MOSFET",
      "diode",
      "capacitor",
      "9V battery"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "motor",
          "type": "motor",
          "x": 560,
          "y": 65,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "gate",
          "type": "mosfet",
          "x": 500,
          "y": 300
        },
        {
          "id": "battery",
          "type": "battery",
          "x": 740,
          "y": 120,
          "value": 9
        },
        {
          "id": "flyback",
          "type": "diode",
          "x": 570,
          "y": 220
        },
        {
          "id": "gate-pull-down",
          "type": "resistor",
          "x": 400,
          "y": 430,
          "value": 10000
        },
        {
          "id": "supply-capacitor",
          "type": "capacitor",
          "x": 735,
          "y": 330,
          "value": 100
        }
      ],
      "wires": [
        {
          "a": "board:6",
          "b": "gate:G"
        },
        {
          "a": "gate:G",
          "b": "gate-pull-down:1"
        },
        {
          "a": "gate-pull-down:2",
          "b": "board:GND.2"
        },
        {
          "a": "board:GND.2",
          "b": "gate:S"
        },
        {
          "a": "board:GND.2",
          "b": "battery:-"
        },
        {
          "a": "battery:+",
          "b": "motor:+"
        },
        {
          "a": "motor:-",
          "b": "gate:D"
        },
        {
          "a": "flyback:A",
          "b": "gate:D"
        },
        {
          "a": "flyback:C",
          "b": "motor:+"
        },
        {
          "a": "supply-capacitor:+",
          "b": "battery:+"
        },
        {
          "a": "supply-capacitor:-",
          "b": "battery:-"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-06-02-servo-basic",
    "chapter": 6,
    "name": "Position a servo",
    "title": "Position a servo",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const servo = new five.Servo({ pin: 6 });\n  board.repl.inject({\n    servo: servo\n  });\n});\n"
    },
    "code": "const five  = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const servo = new five.Servo({ pin: 6 });\n  board.repl.inject({\n    servo: servo\n  });\n});\n",
    "sourcePath": "chapter-06/02-servo-basic",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/02-servo-basic",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original REPL servo.to(120) produces a 120 degree command and real pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "microservo D6"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "servo",
          "type": "servo",
          "x": 485,
          "y": 150
        }
      ],
      "wires": [
        {
          "a": "board:6",
          "b": "servo:PWM"
        },
        {
          "a": "board:5V",
          "b": "servo:V+"
        },
        {
          "a": "board:GND.2",
          "b": "servo:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-06-03-motor-test",
    "chapter": 6,
    "name": "Test a pair of motors",
    "title": "Test a pair of motors",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 12, pwm: 11 }, invertPWM: true },\n    { pins: { dir: 4, pwm: 5}, invertPWM: true }\n  ]);\n\n  board.repl.inject({\n    motors: motors\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 12, pwm: 11 }, invertPWM: true },\n    { pins: { dir: 4, pwm: 5}, invertPWM: true }\n  ]);\n\n  board.repl.inject({\n    motors: motors\n  });\n});\n",
    "sourcePath": "chapter-06/03-motor-test",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/03-motor-test",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original two-motor code configures D11/D5 PWM and D12/D4 directions; the injected motors collection responds to motors.forward(128) in the console. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "dual motors",
      "SN754410 H-bridge",
      "battery"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "driver",
          "type": "hbridge",
          "x": 365,
          "y": 70
        },
        {
          "id": "left-motor",
          "type": "motor",
          "x": 555,
          "y": 45,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "right-motor",
          "type": "motor",
          "x": 555,
          "y": 245,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "battery",
          "type": "battery",
          "x": 390,
          "y": 305,
          "value": 9
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "driver:VCC1"
        },
        {
          "a": "battery:+",
          "b": "driver:VCC2"
        },
        {
          "a": "battery:-",
          "b": "board:GND.2"
        },
        {
          "a": "board:GND.2",
          "b": "driver:GND.1"
        },
        {
          "a": "board:5V",
          "b": "driver:1EN"
        },
        {
          "a": "board:5V",
          "b": "driver:2EN"
        },
        {
          "a": "driver:1Y",
          "b": "left-motor:+"
        },
        {
          "a": "driver:2Y",
          "b": "left-motor:-"
        },
        {
          "a": "driver:3Y",
          "b": "right-motor:+"
        },
        {
          "a": "driver:4Y",
          "b": "right-motor:-"
        },
        {
          "a": "board:12",
          "b": "driver:1A"
        },
        {
          "a": "board:11",
          "b": "driver:2A"
        },
        {
          "a": "board:4",
          "b": "driver:3A"
        },
        {
          "a": "board:5",
          "b": "driver:4A"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-06-04-rover",
    "chapter": 6,
    "name": "Keyboard-controlled rover",
    "title": "Keyboard-controlled rover",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "Rover.js": "class Rover {\n  constructor (motors) {\n    this.motors = motors;\n  }\n\n  forward () {\n    console.log('Full speed ahead!');\n    this.motors.forward(255);\n  }\n\n  backward () {\n    console.log('Reverse!');\n    this.motors.reverse(255);\n  }\n\n  left () {\n    console.log('To the left!');\n    this.motors[0].reverse(200);\n    this.motors[1].forward(200);\n  }\n\n  right () {\n    console.log('To the right!');\n    this.motors[0].forward(200);\n    this.motors[1].reverse(200);\n  }\n\n  stop () {\n    this.motors.stop();\n    console.log('Stopping motors...');\n  }\n}\n\nmodule.exports = Rover;\n",
      "index.js": "const five     = require('johnny-five');\nconst board    = new five.Board();\nconst keypress = require('keypress');\nconst Rover    = require('./Rover');\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 12, pwm: 11 }, invertPWM: true },\n    { pins: { dir: 4, pwm: 5}, invertPWM: true }\n  ]);\n  const rover = new Rover(motors);\n\n  keypress(process.stdin);\n  process.stdin.setEncoding('utf8');\n\n  process.stdin.on('keypress', function (ch, key) {\n\n    if (!key) { return; }\n\n    switch (key.name) {\n      case 'q':\n        rover.stop();\n        console.log('Bye-bye!');\n        process.exit();\n        break;\n      case 'up':\n        rover.forward();\n        break;\n      case 'down':\n        rover.backward();\n        break;\n      case 'left':\n        rover.left();\n        break;\n      case 'right':\n        rover.right();\n        break;\n      case 'space':\n        rover.stop();\n        break;\n      default:\n        return;\n    }\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst board    = new five.Board();\nconst keypress = require('keypress');\nconst Rover    = require('./Rover');\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 12, pwm: 11 }, invertPWM: true },\n    { pins: { dir: 4, pwm: 5}, invertPWM: true }\n  ]);\n  const rover = new Rover(motors);\n\n  keypress(process.stdin);\n  process.stdin.setEncoding('utf8');\n\n  process.stdin.on('keypress', function (ch, key) {\n\n    if (!key) { return; }\n\n    switch (key.name) {\n      case 'q':\n        rover.stop();\n        console.log('Bye-bye!');\n        process.exit();\n        break;\n      case 'up':\n        rover.forward();\n        break;\n      case 'down':\n        rover.backward();\n        break;\n      case 'left':\n        rover.left();\n        break;\n      case 'right':\n        rover.right();\n        break;\n      case 'space':\n        rover.stop();\n        break;\n      default:\n        return;\n    }\n  });\n});\n",
    "sourcePath": "chapter-06/04-rover",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/04-rover",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original two-motor code configures D11/D5 PWM and D12/D4 directions; keyboard up reaches Rover.js. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "dual motors",
      "SN754410 H-bridge",
      "battery",
      "rover chassis"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "driver",
          "type": "hbridge",
          "x": 365,
          "y": 70
        },
        {
          "id": "left-motor",
          "type": "motor",
          "x": 555,
          "y": 45,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "right-motor",
          "type": "motor",
          "x": 555,
          "y": 245,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "battery",
          "type": "battery",
          "x": 390,
          "y": 305,
          "value": 9
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "driver:VCC1"
        },
        {
          "a": "battery:+",
          "b": "driver:VCC2"
        },
        {
          "a": "battery:-",
          "b": "board:GND.2"
        },
        {
          "a": "board:GND.2",
          "b": "driver:GND.1"
        },
        {
          "a": "board:5V",
          "b": "driver:1EN"
        },
        {
          "a": "board:5V",
          "b": "driver:2EN"
        },
        {
          "a": "driver:1Y",
          "b": "left-motor:+"
        },
        {
          "a": "driver:2Y",
          "b": "left-motor:-"
        },
        {
          "a": "driver:3Y",
          "b": "right-motor:+"
        },
        {
          "a": "driver:4Y",
          "b": "right-motor:-"
        },
        {
          "a": "board:12",
          "b": "driver:1A"
        },
        {
          "a": "board:11",
          "b": "driver:2A"
        },
        {
          "a": "board:4",
          "b": "driver:3A"
        },
        {
          "a": "board:5",
          "b": "driver:4A"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-07-01-gps",
    "chapter": 7,
    "name": "Read a GPS receiver",
    "title": "Read a GPS receiver",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', function () {\n  const gps = new five.GPS([11, 10]);\n\n  board.repl.inject({\n    gps: gps\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', function () {\n  const gps = new five.GPS([11, 10]);\n\n  board.repl.inject({\n    gps: gps\n  });\n});\n",
    "sourcePath": "chapter-07/01-gps",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/01-gps",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original GPS and REPL observe latitude 37.7749 through real SoftwareSerial. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "Ultimate GPS RX/TX D11/D10"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "gps",
          "type": "gps",
          "x": 500,
          "y": 120,
          "settings": {
            "latitude": 40.7128,
            "longitude": -74.006,
            "altitude": 10
          }
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "gps:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "gps:GND"
        },
        {
          "a": "board:11",
          "b": "gps:TX"
        },
        {
          "a": "board:10",
          "b": "gps:RX"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-07-02-compass",
    "chapter": 7,
    "name": "Read a compass",
    "title": "Read a compass",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const compass = new five.Compass({ controller: 'HMC5883L' });\n  compass.on('change', () => {\n    console.log(compass.bearing);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst board = new five.Board();\n\nboard.on('ready', () => {\n  const compass = new five.Compass({ controller: 'HMC5883L' });\n  compass.on('change', () => {\n    console.log(compass.bearing);\n  });\n});\n",
    "sourcePath": "chapter-07/02-compass",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/02-compass",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original compass change handler logs easterly bearing after a 90 degree device input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "HMC5883L I2C 0x1e"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "compass",
          "type": "compass",
          "x": 430,
          "y": 40,
          "value": 90,
          "settings": {
            "heading": 90
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "compass:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "compass:GND"
        },
        {
          "a": "board:A5",
          "b": "compass:SCL"
        },
        {
          "a": "board:A4",
          "b": "compass:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-07-03-compass-lcd",
    "chapter": 7,
    "name": "Show a heading on an LCD",
    "title": "Show a heading on an LCD",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five           = require('johnny-five');\n\nconst DECLINATION    = -14.28;\nconst UPDATE_FREQ_MS = 1000;\nvar lastDisplay      = null;\n\nconst board          = new five.Board();\n\nfunction correctForDeclination (heading, declination) {\n  var corrected = heading + declination;\n  corrected += 360;\n  while (corrected >= 360) {\n    corrected -= 360;\n  }\n  return corrected;\n}\n\nfunction formatDisplay (readings, altDisplay) {\n  var displayLine1, displayLine2;\n  displayLine1 = 'HEADING: ';\n  displayLine2 = Math.round(readings.heading) + ':circle:';\n  return [displayLine1, displayLine2];\n}\n\nboard.on('ready', () => {\n  const compass        = new five.Compass({ controller: 'HMC5883L' });\n  const lcd            = new five.LCD({ controller: 'JHD1313M1' });\n\n  lcd.useChar('circle');\n\n  function update () {\n    var display = formatDisplay({\n      heading: correctForDeclination(compass.heading, DECLINATION),\n    });\n    if (!lastDisplay || (lastDisplay.join('') != display.join(''))) {\n      lcd.clear();\n      lcd.cursor(0, 0).print(display[0]);\n      lcd.cursor(1, 0).print(display[1]);\n      lastDisplay = display;\n    }\n  }\n\n  board.loop(UPDATE_FREQ_MS, update);\n});\n"
    },
    "code": "const five           = require('johnny-five');\n\nconst DECLINATION    = -14.28;\nconst UPDATE_FREQ_MS = 1000;\nvar lastDisplay      = null;\n\nconst board          = new five.Board();\n\nfunction correctForDeclination (heading, declination) {\n  var corrected = heading + declination;\n  corrected += 360;\n  while (corrected >= 360) {\n    corrected -= 360;\n  }\n  return corrected;\n}\n\nfunction formatDisplay (readings, altDisplay) {\n  var displayLine1, displayLine2;\n  displayLine1 = 'HEADING: ';\n  displayLine2 = Math.round(readings.heading) + ':circle:';\n  return [displayLine1, displayLine2];\n}\n\nboard.on('ready', () => {\n  const compass        = new five.Compass({ controller: 'HMC5883L' });\n  const lcd            = new five.LCD({ controller: 'JHD1313M1' });\n\n  lcd.useChar('circle');\n\n  function update () {\n    var display = formatDisplay({\n      heading: correctForDeclination(compass.heading, DECLINATION),\n    });\n    if (!lastDisplay || (lastDisplay.join('') != display.join(''))) {\n      lcd.clear();\n      lcd.cursor(0, 0).print(display[0]);\n      lcd.cursor(1, 0).print(display[1]);\n      lastDisplay = display;\n    }\n  }\n\n  board.loop(UPDATE_FREQ_MS, update);\n});\n",
    "sourcePath": "chapter-07/03-compass-lcd",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/03-compass-lcd",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original compass/LCD project displays declination-corrected 76 degrees. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "HMC5883L I2C",
      "Grove RGB LCD JHD1313M1 I2C"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "compass",
          "type": "compass",
          "x": 430,
          "y": 40,
          "value": 90,
          "settings": {
            "heading": 90
          }
        },
        {
          "id": "grove",
          "type": "grove-lcd",
          "x": 680,
          "y": 50
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "compass:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "compass:GND"
        },
        {
          "a": "board:A5",
          "b": "compass:SCL"
        },
        {
          "a": "board:A4",
          "b": "compass:SDA"
        },
        {
          "a": "board:5V",
          "b": "grove:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "grove:GND"
        },
        {
          "a": "board:A5",
          "b": "grove:SCL"
        },
        {
          "a": "board:A4",
          "b": "grove:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-07-04-multi-sensor",
    "chapter": 7,
    "name": "Shake-to-change sensor display",
    "title": "Shake-to-change sensor display",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "index.js": "const five           = require('johnny-five');\nconst board          = new five.Board();\n\nconst DECLINATION    = -14.28;\nconst UPDATE_FREQ_MS = 1000;\nconst SHAKE_THRESHOLD = 1.15;\n\nvar altDisplay     = false;\nvar lastJiggleTime = null;\nvar lastDisplay    = null;\n\nfunction correctForDeclination (heading, declination) {\n  var corrected = heading + declination;\n  corrected += 360;\n  while (corrected >= 360) {\n    corrected -= 360;\n  }\n  return corrected;\n}\n\nfunction formatDisplay (readings, altDisplay) {\n  var displayLine1, displayLine2;\n  if (altDisplay) {\n    displayLine1 = 'HEADING: ';\n    displayLine2 = Math.round(readings.heading) + ':circle:';\n  } else {\n    displayLine1 = 'TEMP/PRESSURE:';\n    displayLine2 = readings.temperature.toFixed(1) + ':circle:F';\n    // Convert kPa to mb\n    displayLine2 += ' / ' + Math.round(10 * readings.pressure) + 'mb';\n  }\n  return [displayLine1, displayLine2];\n}\n\nboard.on('ready', () => {\n  const compass        = new five.Compass({ controller: 'HMC5883L' });\n  const lcd            = new five.LCD({ controller: 'JHD1313M1' });\n  const multi          = new five.Multi({ controller: 'BMP180' });\n  const accel          = new five.Accelerometer({ controller: 'ADXL345' });\n\n  lcd.useChar('circle');\n\n  function update () {\n    var display = formatDisplay({\n      temperature: multi.thermometer.F,\n      heading    : correctForDeclination(compass.heading, DECLINATION),\n      pressure   : multi.barometer.pressure\n    }, altDisplay);\n    if (!lastDisplay || (lastDisplay.join('') != display.join(''))) {\n      lcd.clear();\n      lcd.cursor(0, 0).print(display[0]);\n      lcd.cursor(1, 0).print(display[1]);\n      lastDisplay = display;\n    }\n  }\n\n  board.loop(UPDATE_FREQ_MS, update);\n\n  accel.on('acceleration', () => {\n    if (accel.acceleration > SHAKE_THRESHOLD) {\n      var jiggleTime = Date.now();\n      if (!lastJiggleTime || jiggleTime > (lastJiggleTime + 1000)) {\n        altDisplay     = !altDisplay;\n        lastJiggleTime = Date.now();\n        update();\n      }\n    }\n  });\n});\n"
    },
    "code": "const five           = require('johnny-five');\nconst board          = new five.Board();\n\nconst DECLINATION    = -14.28;\nconst UPDATE_FREQ_MS = 1000;\nconst SHAKE_THRESHOLD = 1.15;\n\nvar altDisplay     = false;\nvar lastJiggleTime = null;\nvar lastDisplay    = null;\n\nfunction correctForDeclination (heading, declination) {\n  var corrected = heading + declination;\n  corrected += 360;\n  while (corrected >= 360) {\n    corrected -= 360;\n  }\n  return corrected;\n}\n\nfunction formatDisplay (readings, altDisplay) {\n  var displayLine1, displayLine2;\n  if (altDisplay) {\n    displayLine1 = 'HEADING: ';\n    displayLine2 = Math.round(readings.heading) + ':circle:';\n  } else {\n    displayLine1 = 'TEMP/PRESSURE:';\n    displayLine2 = readings.temperature.toFixed(1) + ':circle:F';\n    // Convert kPa to mb\n    displayLine2 += ' / ' + Math.round(10 * readings.pressure) + 'mb';\n  }\n  return [displayLine1, displayLine2];\n}\n\nboard.on('ready', () => {\n  const compass        = new five.Compass({ controller: 'HMC5883L' });\n  const lcd            = new five.LCD({ controller: 'JHD1313M1' });\n  const multi          = new five.Multi({ controller: 'BMP180' });\n  const accel          = new five.Accelerometer({ controller: 'ADXL345' });\n\n  lcd.useChar('circle');\n\n  function update () {\n    var display = formatDisplay({\n      temperature: multi.thermometer.F,\n      heading    : correctForDeclination(compass.heading, DECLINATION),\n      pressure   : multi.barometer.pressure\n    }, altDisplay);\n    if (!lastDisplay || (lastDisplay.join('') != display.join(''))) {\n      lcd.clear();\n      lcd.cursor(0, 0).print(display[0]);\n      lcd.cursor(1, 0).print(display[1]);\n      lastDisplay = display;\n    }\n  }\n\n  board.loop(UPDATE_FREQ_MS, update);\n\n  accel.on('acceleration', () => {\n    if (accel.acceleration > SHAKE_THRESHOLD) {\n      var jiggleTime = Date.now();\n      if (!lastJiggleTime || jiggleTime > (lastJiggleTime + 1000)) {\n        altDisplay     = !altDisplay;\n        lastJiggleTime = Date.now();\n        update();\n      }\n    }\n  });\n});\n",
    "sourcePath": "chapter-07/04-multi-sensor",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/04-multi-sensor",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multisensor source displays 77 °F and pressure then switches to heading on shake. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior.",
    "needs": [
      "Uno",
      "HMC5883L I2C",
      "JHD1313M1 I2C LCD",
      "BMP180 I2C 0x77",
      "ADXL345 I2C"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "compass",
          "type": "compass",
          "x": 430,
          "y": 40,
          "value": 90,
          "settings": {
            "heading": 90
          }
        },
        {
          "id": "grove",
          "type": "grove-lcd",
          "x": 680,
          "y": 50
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 430,
          "y": 280,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        },
        {
          "id": "accel",
          "type": "accelerometer",
          "x": 680,
          "y": 280,
          "settings": {
            "x": 0,
            "y": 0,
            "z": 1
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "compass:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "compass:GND"
        },
        {
          "a": "board:A5",
          "b": "compass:SCL"
        },
        {
          "a": "board:A4",
          "b": "compass:SDA"
        },
        {
          "a": "board:5V",
          "b": "grove:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "grove:GND"
        },
        {
          "a": "board:A5",
          "b": "grove:SCL"
        },
        {
          "a": "board:A4",
          "b": "grove:SDA"
        },
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "weather:GND"
        },
        {
          "a": "board:A5",
          "b": "weather:SCL"
        },
        {
          "a": "board:A4",
          "b": "weather:SDA"
        },
        {
          "a": "board:3.3V",
          "b": "accel:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "accel:GND"
        },
        {
          "a": "board:A5",
          "b": "accel:SCL"
        },
        {
          "a": "board:A4",
          "b": "accel:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-08-01-hello-tessel",
    "chapter": 8,
    "name": "Tessel onboard lights",
    "title": "Tessel onboard lights",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const tessel = require('tessel');\n\ntessel.led[2].on();\n\nsetInterval(function () {\n  tessel.led[2].toggle();\n  tessel.led[3].toggle();\n}, 100);\n\nconsole.log(\"I'm blinking! (Press CTRL + C to stop)\");\n"
    },
    "code": "const tessel = require('tessel');\n\ntessel.led[2].on();\n\nsetInterval(function () {\n  tessel.led[2].toggle();\n  tessel.led[3].toggle();\n}, 100);\n\nconsole.log(\"I'm blinking! (Press CTRL + C to stop)\");\n",
    "sourcePath": "chapter-08/01-hello-tessel",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/01-hello-tessel",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard L2 and L3 alternate. Native CPU timing and wireless deployment are not emulated.",
    "needs": [
      "Tessel2 onboard LEDs"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        }
      ],
      "wires": []
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-08-02-t2-blink",
    "chapter": 8,
    "name": "Johnny-Five on Tessel",
    "title": "Johnny-Five on Tessel",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst board = new five.Board({\n  io: new Tessel()\n});\n\nboard.on('ready', () => {\n  const led = new five.Led('A0');\n  led.blink(500);\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst board = new five.Board({\n  io: new Tessel()\n});\n\nboard.on('ready', () => {\n  const led = new five.Led('A0');\n  led.blink(500);\n});\n",
    "sourcePath": "chapter-08/02-t2-blink",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/02-t2-blink",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Add an LED and resistor to Tessel A0 and GND as shown in the book. A0 means digital port A pin 0 here.",
    "needs": [
      "Tessel2",
      "LED A0"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 100
        }
      ],
      "wires": [
        {
          "a": "board:A0",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-09-01-prototype-switch",
    "chapter": 9,
    "name": "Prototype a remote switch",
    "title": "Prototype a remote switch",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\n\nconst board = new five.Board({ io: new Tessel() });\n\nconst switchPins = {\n  on: 'A0',\n  off: 'A1'\n};\nconst pressDuration = 500;\n\nboard.on('ready', () => {\n\n  const pressButton = function (pin) {\n    board.digitalWrite(pin, 1);\n    setTimeout(() => {\n      board.digitalWrite(pin, 0);\n    }, pressDuration);\n  };\n  const turnOn = function () {\n    pressButton(switchPins.on);\n  };\n  const turnOff = function () {\n    pressButton(switchPins.off);\n  };\n\n  board.pinMode(switchPins.on, five.Pin.OUTPUT);\n  board.pinMode(switchPins.off, five.Pin.OUTPUT);\n\n  board.repl.inject({\n    turnOn: turnOn,\n    turnOff: turnOff\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\n\nconst board = new five.Board({ io: new Tessel() });\n\nconst switchPins = {\n  on: 'A0',\n  off: 'A1'\n};\nconst pressDuration = 500;\n\nboard.on('ready', () => {\n\n  const pressButton = function (pin) {\n    board.digitalWrite(pin, 1);\n    setTimeout(() => {\n      board.digitalWrite(pin, 0);\n    }, pressDuration);\n  };\n  const turnOn = function () {\n    pressButton(switchPins.on);\n  };\n  const turnOff = function () {\n    pressButton(switchPins.off);\n  };\n\n  board.pinMode(switchPins.on, five.Pin.OUTPUT);\n  board.pinMode(switchPins.off, five.Pin.OUTPUT);\n\n  board.repl.inject({\n    turnOn: turnOn,\n    turnOff: turnOff\n  });\n});\n",
    "sourcePath": "chapter-09/01-prototype-switch",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/01-prototype-switch",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Use turnOn() and turnOff() in the interactive console. GPIO pulses are checked; connect the optocoupler signal model to inspect isolated output. Physical remote outlets and mains behavior are outside this circuit model.",
    "needs": [
      "Tessel2",
      "4N25 optocoupler",
      "remote button/circuit",
      "wall outlet model"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "isolated-battery",
          "type": "battery",
          "x": 630,
          "y": 620,
          "value": 3
        },
        {
          "id": "optical-A0",
          "type": "optocoupler",
          "x": 390,
          "y": 330
        },
        {
          "id": "optical-A0-input-resistor",
          "type": "resistor",
          "x": 390,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A0-output-resistor",
          "type": "resistor",
          "x": 600,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A0-output",
          "type": "led",
          "x": 630,
          "y": 335
        },
        {
          "id": "optical-A1",
          "type": "optocoupler",
          "x": 790,
          "y": 330
        },
        {
          "id": "optical-A1-input-resistor",
          "type": "resistor",
          "x": 790,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A1-output-resistor",
          "type": "resistor",
          "x": 1000,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A1-output",
          "type": "led",
          "x": 1030,
          "y": 335
        }
      ],
      "wires": [
        {
          "a": "board:A0",
          "b": "optical-A0-input-resistor:1"
        },
        {
          "a": "optical-A0-input-resistor:2",
          "b": "optical-A0:A"
        },
        {
          "a": "optical-A0:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A0-output-resistor:1"
        },
        {
          "a": "optical-A0-output-resistor:2",
          "b": "optical-A0-output:A"
        },
        {
          "a": "optical-A0-output:C",
          "b": "optical-A0:C"
        },
        {
          "a": "optical-A0:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A1",
          "b": "optical-A1-input-resistor:1"
        },
        {
          "a": "optical-A1-input-resistor:2",
          "b": "optical-A1:A"
        },
        {
          "a": "optical-A1:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A1-output-resistor:1"
        },
        {
          "a": "optical-A1-output-resistor:2",
          "b": "optical-A1-output:A"
        },
        {
          "a": "optical-A1-output:C",
          "b": "optical-A1:C"
        },
        {
          "a": "optical-A1:E",
          "b": "isolated-battery:-"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-10-01-pico-led-blink",
    "chapter": 10,
    "name": "Espruino Pico lights",
    "title": "Espruino Pico lights",
    "entry": "index.js",
    "platform": "pico",
    "environment": "virtual-platform",
    "files": {
      "index.js": "/* global LED1, LED2, digitalWrite */\nvar ledStatus = false;\nfunction toggleLED () {\n  if (!ledStatus) {\n    digitalWrite(LED1, 1);\n    digitalWrite(LED2, 0);\n  } else {\n    digitalWrite(LED1, 0);\n    digitalWrite(LED2, 1);\n  }\n  ledStatus = !ledStatus;\n  setTimeout(toggleLED, 500);\n}\n\ntoggleLED();\n"
    },
    "code": "/* global LED1, LED2, digitalWrite */\nvar ledStatus = false;\nfunction toggleLED () {\n  if (!ledStatus) {\n    digitalWrite(LED1, 1);\n    digitalWrite(LED2, 0);\n  } else {\n    digitalWrite(LED1, 0);\n    digitalWrite(LED2, 1);\n  }\n  ledStatus = !ledStatus;\n  setTimeout(toggleLED, 500);\n}\n\ntoggleLED();\n",
    "sourcePath": "chapter-10/01-pico-led-blink",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/01-pico-led-blink",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard LED1 and LED2 alternate. This provides a selected Espruino API adaptation, not its native JavaScript interpreter.",
    "needs": [
      "Espruino Pico onboard LED1/LED2"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "pico",
          "x": 25,
          "y": 5
        }
      ],
      "wires": []
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-10-02-pico-bmp180",
    "chapter": 10,
    "name": "Pico weather sensor",
    "title": "Pico weather sensor",
    "entry": "index.js",
    "platform": "pico",
    "environment": "virtual-platform",
    "files": {
      "index.js": "/* global I2C1, B6, B7 */\nI2C1.setup({ scl: B6, sda: B7});\nvar bmp = require('BMP085').connect(I2C1);\nsetInterval(function () {\n  bmp.getPressure(function (readings) {\n    console.log('Pressure: ' + readings.pressure + ' Pa');\n    console.log('Temperature: ' + readings.temperature + ' C');\n  });\n}, 1000);\n"
    },
    "code": "/* global I2C1, B6, B7 */\nI2C1.setup({ scl: B6, sda: B7});\nvar bmp = require('BMP085').connect(I2C1);\nsetInterval(function () {\n  bmp.getPressure(function (readings) {\n    console.log('Pressure: ' + readings.pressure + ' Pa');\n    console.log('Temperature: ' + readings.temperature + ' C');\n  });\n}, 1000);\n",
    "sourcePath": "chapter-10/02-pico-bmp180",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/02-pico-bmp180",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire BMP180 power, GND, B6/SCL and B7/SDA. The virtual BMP085 module supplies readings from your connected sensor controls.",
    "needs": [
      "Espruino Pico",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "pico",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 250,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:B6",
          "b": "weather:SCL"
        },
        {
          "a": "board:B7",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-10-03-pico-nokia-5110-timer",
    "chapter": 10,
    "name": "Pico graphical LCD timer",
    "title": "Pico graphical LCD timer",
    "entry": "index.js",
    "platform": "pico",
    "environment": "virtual-platform",
    "files": {
      "index.js": "/* global B3, B5, B13, B14, B15, SPI1, setWatch, BTN */\nvar lcd;\nvar progress      = 0;\nvar frameDuration = 200; // ms\nvar timerSeconds  = 10;\nvar timerLength   = timerSeconds * 1000 / frameDuration;\nvar timerActive   = false;\n\nfunction onInit () {\n  // Set up SPI for LCD\n  SPI1.setup({ sck: B3, mosi: B5 });\n  lcd = require('PCD8544').connect(SPI1, B13, B14, B15);\n}\n\nfunction draw () {\n  progress++;\n  if (progress > timerLength) {\n    clearInterval();\n    timerActive = false;\n  }\n  var rightEdge = Math.floor((progress / timerLength) * 84) - 1;\n  lcd.clear();\n  lcd.drawRect(0, 19, 83, 27);\n  lcd.fillRect(0, 19, rightEdge, 27);\n  lcd.flip();\n}\n\nonInit();\n\nsetWatch (function (e) {\n  if (!timerActive) {\n    progress = 0;\n    setInterval(draw, frameDuration);\n    timerActive = true;\n  }\n}, BTN, { repeat: true });\n"
    },
    "code": "/* global B3, B5, B13, B14, B15, SPI1, setWatch, BTN */\nvar lcd;\nvar progress      = 0;\nvar frameDuration = 200; // ms\nvar timerSeconds  = 10;\nvar timerLength   = timerSeconds * 1000 / frameDuration;\nvar timerActive   = false;\n\nfunction onInit () {\n  // Set up SPI for LCD\n  SPI1.setup({ sck: B3, mosi: B5 });\n  lcd = require('PCD8544').connect(SPI1, B13, B14, B15);\n}\n\nfunction draw () {\n  progress++;\n  if (progress > timerLength) {\n    clearInterval();\n    timerActive = false;\n  }\n  var rightEdge = Math.floor((progress / timerLength) * 84) - 1;\n  lcd.clear();\n  lcd.drawRect(0, 19, 83, 27);\n  lcd.fillRect(0, 19, rightEdge, 27);\n  lcd.flip();\n}\n\nonInit();\n\nsetWatch (function (e) {\n  if (!timerActive) {\n    progress = 0;\n    setInterval(draw, frameDuration);\n    timerActive = true;\n  }\n}, BTN, { repeat: true });\n",
    "sourcePath": "chapter-10/03-pico-nokia-5110-timer",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/03-pico-nokia-5110-timer",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire Nokia5110 SCK=B3, MOSI=B5, DC=B13, CE=B14, RST=B15. Press the Pico BTN to start. Selected Graphics calls are adapted; SPI electrical timing is not emulated.",
    "needs": [
      "Espruino Pico",
      "Nokia5110 PCD8544",
      "BTN"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "pico",
          "x": 25,
          "y": 5
        },
        {
          "id": "display",
          "type": "nokia-lcd",
          "x": 425,
          "y": 30
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "display:VCC"
        },
        {
          "a": "board:GND",
          "b": "display:GND"
        },
        {
          "a": "board:B3",
          "b": "display:SCLK"
        },
        {
          "a": "board:B5",
          "b": "display:DIN"
        },
        {
          "a": "board:B13",
          "b": "display:DC"
        },
        {
          "a": "board:B14",
          "b": "display:CE"
        },
        {
          "a": "board:B15",
          "b": "display:RST"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-10-04-pico-weather",
    "chapter": 10,
    "name": "Pico graphical weather display",
    "title": "Pico graphical weather display",
    "entry": "index.js",
    "platform": "pico",
    "environment": "virtual-platform",
    "files": {
      "index.js": "/* global SPI1, B3, B5, B6, B7, B13, B14, B15, I2C1 */\nvar altitude = 300; // Local altitude in meters\nvar lcd;\n\nfunction onInit () {\n  clearInterval();\n  I2C1.setup({ scl: B6, sda: B7});\n  var bmp180 = require('BMP085').connect(I2C1);\n  SPI1.setup({ sck: B3, mosi: B5 });\n  lcd = require('PCD8544').connect(SPI1, B13, B14, B15, function () {\n    setInterval(function () {\n      bmp180.getPressure(function (readings) {\n        draw(readings.temperature,\n             bmp180.getSeaLevel(readings.pressure, altitude));\n      });\n    }, 1000);\n  });\n}\n\nonInit();\n\nfunction draw (temperature, pressure) {\n  lcd.clear();\n  var tempString = (temperature * (9 / 5) + 32).toFixed(1);\n  var pressString = (pressure / 100).toFixed(1);\n\n  lcd.drawLine(0, (lcd.getHeight() / 2), lcd.getWidth(), (lcd.getHeight() / 2));\n\n  lcd.setFontVector(18);\n  var tempWidth  = lcd.stringWidth(tempString);\n  var pressWidth = lcd.stringWidth(pressString);\n  var xTemp      = ((lcd.getWidth() - tempWidth) / 2);\n\n  lcd.drawString(tempString, xTemp, 2);\n  lcd.drawCircle(xTemp + tempWidth + 4, 5, 2);\n  lcd.drawString(pressString, 0, (lcd.getHeight() / 2 + 2));\n\n  lcd.setFontVector(8);\n  lcd.drawString('F', xTemp + tempWidth + 2, 12);\n  lcd.drawString('m', pressWidth + 3, (lcd.getHeight() / 2 + 12));\n  lcd.drawString('b', pressWidth + 12, (lcd.getHeight() / 2 + 12));\n  lcd.flip();\n}\n"
    },
    "code": "/* global SPI1, B3, B5, B6, B7, B13, B14, B15, I2C1 */\nvar altitude = 300; // Local altitude in meters\nvar lcd;\n\nfunction onInit () {\n  clearInterval();\n  I2C1.setup({ scl: B6, sda: B7});\n  var bmp180 = require('BMP085').connect(I2C1);\n  SPI1.setup({ sck: B3, mosi: B5 });\n  lcd = require('PCD8544').connect(SPI1, B13, B14, B15, function () {\n    setInterval(function () {\n      bmp180.getPressure(function (readings) {\n        draw(readings.temperature,\n             bmp180.getSeaLevel(readings.pressure, altitude));\n      });\n    }, 1000);\n  });\n}\n\nonInit();\n\nfunction draw (temperature, pressure) {\n  lcd.clear();\n  var tempString = (temperature * (9 / 5) + 32).toFixed(1);\n  var pressString = (pressure / 100).toFixed(1);\n\n  lcd.drawLine(0, (lcd.getHeight() / 2), lcd.getWidth(), (lcd.getHeight() / 2));\n\n  lcd.setFontVector(18);\n  var tempWidth  = lcd.stringWidth(tempString);\n  var pressWidth = lcd.stringWidth(pressString);\n  var xTemp      = ((lcd.getWidth() - tempWidth) / 2);\n\n  lcd.drawString(tempString, xTemp, 2);\n  lcd.drawCircle(xTemp + tempWidth + 4, 5, 2);\n  lcd.drawString(pressString, 0, (lcd.getHeight() / 2 + 2));\n\n  lcd.setFontVector(8);\n  lcd.drawString('F', xTemp + tempWidth + 2, 12);\n  lcd.drawString('m', pressWidth + 3, (lcd.getHeight() / 2 + 12));\n  lcd.drawString('b', pressWidth + 12, (lcd.getHeight() / 2 + 12));\n  lcd.flip();\n}\n",
    "sourcePath": "chapter-10/04-pico-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/04-pico-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire both BMP180 and Nokia5110 as shown in the book. The displayed raster font approximates Espruino vector text.",
    "needs": [
      "Espruino Pico",
      "Nokia5110",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "pico",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 250,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        },
        {
          "id": "display",
          "type": "nokia-lcd",
          "x": 425,
          "y": 30
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:B6",
          "b": "weather:SCL"
        },
        {
          "a": "board:B7",
          "b": "weather:SDA"
        },
        {
          "a": "board:3.3V",
          "b": "display:VCC"
        },
        {
          "a": "board:GND",
          "b": "display:GND"
        },
        {
          "a": "board:B3",
          "b": "display:SCLK"
        },
        {
          "a": "board:B5",
          "b": "display:DIN"
        },
        {
          "a": "board:B13",
          "b": "display:DC"
        },
        {
          "a": "board:B14",
          "b": "display:CE"
        },
        {
          "a": "board:B15",
          "b": "display:RST"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-02-rpi3-blink-sysfs-js",
    "chapter": 11,
    "name": "Pi GPIO through virtual files",
    "title": "Pi GPIO through virtual files",
    "entry": "index.js",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const fs = require('fs');\n\nconst sysfsPath = '/sys/class/gpio';\nconst pinLED = '4';\nconst blinkTotal = 10;\nvar blinkCount = 0;\nvar status = false;\n\nfs.writeFileSync(`${sysfsPath}/export`, pinLED);\nfs.writeFileSync(`${sysfsPath}/gpio${pinLED}/direction`, 'out');\n\nvar blinker = setInterval(() => {\n  if (status) {\n    fs.writeFileSync(`${sysfsPath}/gpio${pinLED}/value`, '0');\n    blinkCount++;\n    if (blinkCount >= blinkTotal) {\n      console.log('All done blinking');\n      fs.writeFileSync(`${sysfsPath}/unexport`, '4');\n      clearInterval(blinker);\n    }\n  } else {\n    fs.writeFileSync(`${sysfsPath}/gpio${pinLED}/value`, '1');\n  }\n  status = !status;\n}, 1000);\n"
    },
    "code": "const fs = require('fs');\n\nconst sysfsPath = '/sys/class/gpio';\nconst pinLED = '4';\nconst blinkTotal = 10;\nvar blinkCount = 0;\nvar status = false;\n\nfs.writeFileSync(`${sysfsPath}/export`, pinLED);\nfs.writeFileSync(`${sysfsPath}/gpio${pinLED}/direction`, 'out');\n\nvar blinker = setInterval(() => {\n  if (status) {\n    fs.writeFileSync(`${sysfsPath}/gpio${pinLED}/value`, '0');\n    blinkCount++;\n    if (blinkCount >= blinkTotal) {\n      console.log('All done blinking');\n      fs.writeFileSync(`${sysfsPath}/unexport`, '4');\n      clearInterval(blinker);\n    }\n  } else {\n    fs.writeFileSync(`${sysfsPath}/gpio${pinLED}/value`, '1');\n  }\n  status = !status;\n}, 1000);\n",
    "sourcePath": "chapter-11/02-rpi3-blink-sysfs-js",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/02-rpi3-blink-sysfs-js",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7 (BCM GPIO4). The file paths refer to a virtual GPIO filesystem, not your computer or a Linux kernel.",
    "needs": [
      "RaspberryPi3",
      "LED BCM4 physical7"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:GPIO4",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-03-rpi3-blink-wiring-pi",
    "chapter": 11,
    "name": "Pi GPIO with wiring-pi",
    "title": "Pi GPIO with wiring-pi",
    "entry": "index.js",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const wpi = require('wiring-pi');\nconst ledPin = 7;\nconst blinkTotal = 10;\nvar blinkCount = 0;\nvar status = false;\n\nwpi.setup('wpi');\nwpi.pinMode(ledPin, wpi.OUTPUT);\n\nvar blinker = setInterval(() => {\n  wpi.digitalWrite(ledPin, status);\n  if (!status) {\n    blinkCount++;\n    if (blinkCount >= blinkTotal) {\n      console.log('All done blinking!');\n      clearInterval(blinker);\n    }\n  }\n  status = +!status;\n}, 1000);\n"
    },
    "code": "const wpi = require('wiring-pi');\nconst ledPin = 7;\nconst blinkTotal = 10;\nvar blinkCount = 0;\nvar status = false;\n\nwpi.setup('wpi');\nwpi.pinMode(ledPin, wpi.OUTPUT);\n\nvar blinker = setInterval(() => {\n  wpi.digitalWrite(ledPin, status);\n  if (!status) {\n    blinkCount++;\n    if (blinkCount >= blinkTotal) {\n      console.log('All done blinking!');\n      clearInterval(blinker);\n    }\n  }\n  status = +!status;\n}, 1000);\n",
    "sourcePath": "chapter-11/03-rpi3-blink-wiring-pi",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/03-rpi3-blink-wiring-pi",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. The wiring-pi module here is a virtual addon; wiringPi 7 maps to BCM4.",
    "needs": [
      "RaspberryPi3",
      "LED physical7"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:GPIO4",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-04-rpi3-blink-j5",
    "chapter": 11,
    "name": "Johnny-Five on Pi",
    "title": "Johnny-Five on Pi",
    "entry": "index.js",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Raspi = require('raspi-io');\n\nconst board = new five.Board({\n  io: new Raspi()\n});\n\nboard.on('ready', () => {\n  const led = new five.Led(7);\n  var blinkCount = 0;\n  const blinkMax = 10;\n\n  led.blink(500, () => {\n    blinkCount++;\n    console.log(`I have changed state ${blinkCount} times`);\n    if (blinkCount >= blinkMax) {\n      console.log('I shall stop blinking now');\n      led.stop();\n    }\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Raspi = require('raspi-io');\n\nconst board = new five.Board({\n  io: new Raspi()\n});\n\nboard.on('ready', () => {\n  const led = new five.Led(7);\n  var blinkCount = 0;\n  const blinkMax = 10;\n\n  led.blink(500, () => {\n    blinkCount++;\n    console.log(`I have changed state ${blinkCount} times`);\n    if (blinkCount >= blinkMax) {\n      console.log('I shall stop blinking now');\n      led.stop();\n    }\n  });\n});\n",
    "sourcePath": "chapter-11/04-rpi3-blink-j5",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/04-rpi3-blink-j5",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. Johnny-Five drives a virtual Raspi IO adapter. Numeric 7 is a wiringPi pin number.",
    "needs": [
      "RaspberryPi3",
      "LED7"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:GPIO4",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-08-bbb-blink-j5",
    "chapter": 11,
    "name": "Johnny-Five on BeagleBone",
    "title": "Johnny-Five on BeagleBone",
    "entry": "index.js",
    "platform": "beaglebone",
    "environment": "virtual-platform",
    "files": {
      "index.js": "var five = require('johnny-five');\nvar BeagleBone = require('beaglebone-io');\n\nvar board = new five.Board({\n  io: new BeagleBone()\n});\n\nboard.on('ready', function () {\n  var led = new five.Led();\n  led.blink(500);\n});\n"
    },
    "code": "var five = require('johnny-five');\nvar BeagleBone = require('beaglebone-io');\n\nvar board = new five.Board({\n  io: new BeagleBone()\n});\n\nboard.on('ready', function () {\n  var led = new five.Led();\n  led.blink(500);\n});\n",
    "sourcePath": "chapter-11/08-bbb-blink-j5",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/08-bbb-blink-j5",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. The BeagleBone default onboard LED is USR3. GPIO APIs are adapted; the native operating system is not emulated.",
    "needs": [
      "BeagleBoneBlack onboard LED"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "beaglebone",
          "x": 25,
          "y": 5
        }
      ],
      "wires": []
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-08-03-t2-bmp180",
    "chapter": 8,
    "name": "Tessel weather sensor",
    "title": "Tessel weather sensor",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\n\nconst board = new five.Board({\n  io: new Tessel()\n});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180'\n  });\n  weatherSensor.thermometer.on('change', function () {\n    console.log(this.F);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\n\nconst board = new five.Board({\n  io: new Tessel()\n});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180'\n  });\n  weatherSensor.thermometer.on('change', function () {\n    console.log(this.F);\n  });\n});\n",
    "sourcePath": "chapter-08/03-t2-bmp180",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/03-t2-bmp180",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The BMP180 reads from a powered circuit on Tessel I2C. Tessel APIs are adapted; native ARM execution is not emulated.",
    "needs": [
      "Tessel2",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:A0",
          "b": "weather:SCL"
        },
        {
          "a": "board:A1",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-08-04-t2-weather",
    "chapter": 8,
    "name": "Tessel weather web app",
    "title": "Tessel weather web app",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "app/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <script src=\"/socket.io/socket.io.js\"></script>\n  <link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" />\n  <title>Current Conditions</title>\n</head>\n<body>\n\n  <main role=\"main\">\n    <h1>Current Conditions</h1>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Temperature</h2>\n          <span class=\"data--value\" id=\"temperature\">--.--</span>\n          <small class=\"data--unit\">F</small>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Pressure</h2>\n          <span class=\"data--value\" id=\"pressure\">---.--</span>\n          <small class=\"data--unit\">mBar</small>\n        </div>\n      </div>\n    </div>\n  </main>\n\n  <script>\n  window.addEventListener('DOMContentLoaded', function () {\n    var socket = io();\n    socket.on('weather', updateData);\n  });\n  function updateData (data) {\n    ['temperature', 'pressure'].forEach(function (dataPoint) {\n      document.getElementById(dataPoint).innerHTML = data[dataPoint].toFixed(2);\n    });\n    document.querySelectorAll('.data--value').forEach(function (el) {\n      el.classList.add('connected');\n    });\n  }\n  </script>\n </body>\n</html>\n",
      "app/style.css": "html {\n  font-family    : \"Helvetica Neue\", \"Helvetica\", \"Arial\", san-serif;\n}\n.row {\n display         : flex;\n justify-content : center;\n max-width       : 48rem;\n margin          : auto;\n}\n.row .col {\n margin          : auto;\n padding         : 2rem;\n}\nh1, h2 {\n margin          : 0;\n text-align      : center;\n}\nh2 {\n font-size       : 1.5rem;\n}\nsmall {\n color           : #999;\n font-size       : 0.65em;\n}\n.data {\n padding         : 1.5rem;\n background-color: #eee;\n border-radius   : 10px;\n font-size       : 3rem;\n}\n.data--value {\n font-weight     : bold;\n}\n.connected {\n color           : #093;\n}\n",
      "index.js": "const five     = require('johnny-five');\nconst Tessel   = require('tessel-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst Tessel   = require('tessel-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n",
    "sourcePath": "chapter-08/04-t2-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/04-t2-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original weather dashboard uses an in-memory Express/HTTP/Socket.IO preview and a wired BMP180. There is no native TCP listener or wireless deployment.",
    "needs": [
      "Tessel2",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:A0",
          "b": "weather:SCL"
        },
        {
          "a": "board:A1",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-08-05-t2-rover",
    "chapter": 8,
    "name": "Tessel rover",
    "title": "Tessel rover",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "Rover.js": "class Rover {\n  constructor (motors) {\n    this.motors = motors;\n  }\n\n  forward () {\n    console.log('Full speed ahead!');\n    this.motors.forward(255);\n  }\n\n  backward () {\n    console.log('Reverse!');\n    this.motors.reverse(255);\n  }\n\n  left () {\n    console.log('To the left!');\n    this.motors[0].reverse(200);\n    this.motors[1].forward(200);\n  }\n\n  right () {\n    console.log('To the right!');\n    this.motors[0].forward(200);\n    this.motors[1].reverse(200);\n  }\n\n  stop () {\n    this.motors.stop();\n    console.log('Stopping motors...');\n  }\n}\n\nmodule.exports = Rover;\n",
      "index.js": "const five     = require('johnny-five');\nconst Tessel   = require('tessel-io');\nconst board    = new five.Board({\n  io: new Tessel()\n});\nconst keypress = require('keypress');\nconst Rover    = require('./Rover');\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 'A4', pwm: 'A5' }, invertPWM: true },\n    { pins: { dir: 'B4', pwm: 'B5' }, invertPWM: true }\n  ]);\n  const rover = new Rover(motors);\n\n  keypress(process.stdin);\n  process.stdin.setEncoding('utf8');\n\n  process.stdin.on('keypress', function (ch, key) {\n\n    if (!key) { return; }\n\n    switch (key.name) {\n      case 'q':\n        rover.stop();\n        console.log('Bye-bye!');\n        process.exit();\n        break;\n      case 'up':\n        rover.forward();\n        break;\n      case 'down':\n        rover.backward();\n        break;\n      case 'left':\n        rover.left();\n        break;\n      case 'right':\n        rover.right();\n        break;\n      case 'space':\n        rover.stop();\n        break;\n      default:\n        return;\n    }\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst Tessel   = require('tessel-io');\nconst board    = new five.Board({\n  io: new Tessel()\n});\nconst keypress = require('keypress');\nconst Rover    = require('./Rover');\n\nboard.on('ready', function () {\n  const motors = new five.Motors([\n    { pins: { dir: 'A4', pwm: 'A5' }, invertPWM: true },\n    { pins: { dir: 'B4', pwm: 'B5' }, invertPWM: true }\n  ]);\n  const rover = new Rover(motors);\n\n  keypress(process.stdin);\n  process.stdin.setEncoding('utf8');\n\n  process.stdin.on('keypress', function (ch, key) {\n\n    if (!key) { return; }\n\n    switch (key.name) {\n      case 'q':\n        rover.stop();\n        console.log('Bye-bye!');\n        process.exit();\n        break;\n      case 'up':\n        rover.forward();\n        break;\n      case 'down':\n        rover.backward();\n        break;\n      case 'left':\n        rover.left();\n        break;\n      case 'right':\n        rover.right();\n        break;\n      case 'space':\n        rover.stop();\n        break;\n      default:\n        return;\n    }\n  });\n});\n",
    "sourcePath": "chapter-08/05-t2-rover",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/05-t2-rover",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original Rover.js receives up/space keyboard commands and configures Tessel A5/B5 PWM Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original index.js and Rover.js use Tessel A/B GPIO and keyboard input. Confirm H-bridge wiring and motor direction in the circuit.",
    "needs": [
      "Tessel2",
      "dual motors",
      "H-bridge",
      "rover"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "driver",
          "type": "hbridge",
          "x": 365,
          "y": 70
        },
        {
          "id": "left-motor",
          "type": "motor",
          "x": 555,
          "y": 45,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "right-motor",
          "type": "motor",
          "x": 555,
          "y": 245,
          "settings": {
            "voltage": 9
          }
        },
        {
          "id": "battery",
          "type": "battery",
          "x": 390,
          "y": 305,
          "value": 9
        }
      ],
      "wires": [
        {
          "a": "board:5V",
          "b": "driver:VCC1"
        },
        {
          "a": "battery:+",
          "b": "driver:VCC2"
        },
        {
          "a": "battery:-",
          "b": "board:GND"
        },
        {
          "a": "board:GND",
          "b": "driver:GND.1"
        },
        {
          "a": "board:5V",
          "b": "driver:1EN"
        },
        {
          "a": "board:5V",
          "b": "driver:2EN"
        },
        {
          "a": "driver:1Y",
          "b": "left-motor:+"
        },
        {
          "a": "driver:2Y",
          "b": "left-motor:-"
        },
        {
          "a": "driver:3Y",
          "b": "right-motor:+"
        },
        {
          "a": "driver:4Y",
          "b": "right-motor:-"
        },
        {
          "a": "board:A4",
          "b": "driver:1A"
        },
        {
          "a": "board:A5",
          "b": "driver:2A"
        },
        {
          "a": "board:B4",
          "b": "driver:3A"
        },
        {
          "a": "board:B5",
          "b": "driver:4A"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-09-02-remote-switch",
    "chapter": 9,
    "name": "Create a RemoteSwitch component",
    "title": "Create a RemoteSwitch component",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "RemoteSwitch.js": "module.exports = function (five) {\n  return (function () {\n    function RemoteSwitch (opts) {\n      if (!(this instanceof RemoteSwitch)) {\n        return new RemoteSwitch(opts);\n      }\n      five.Board.Component.call(this, opts = five.Board.Options(opts));\n\n      this.pins     = opts.pins;\n      this.duration = opts.duration || 500;\n      this.isOn     = undefined;\n      this.isActive = false;\n      this.queue    = [];\n\n      this.io.pinMode(this.pins.on, this.io.MODES.OUTPUT);\n      this.io.pinMode(this.pins.off, this.io.MODES.OUTPUT);\n    }\n\n    RemoteSwitch.prototype.toggle = function (turnOn) {\n      if (this.isActive) {\n        this.queue.push(turnOn);\n        return;\n      }\n      this.isActive = true;\n      if (typeof turnOn === 'undefined') {\n        turnOn = !this.isOn;\n      }\n      const pin = (turnOn) ? this.pins.on : this.pins.off;\n      this.io.digitalWrite(pin, 1);\n      setTimeout(() => {\n        this.io.digitalWrite(pin, 0);\n        this.isActive = false;\n        this.isOn = !!turnOn;\n        if (this.queue.length) {\n          this.toggle(this.queue.shift());\n        }\n      }, this.duration);\n    };\n\n    RemoteSwitch.prototype.on = function () {\n      this.toggle(true);\n    };\n    RemoteSwitch.prototype.off = function () {\n      this.toggle(false);\n    };\n    return RemoteSwitch;\n  }());\n};\n",
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst RemoteSwitch = require('./RemoteSwitch')(five);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const switch1 = new RemoteSwitch({\n    pins : { on: 'A0', off: 'A1' }\n  });\n  const switch2 = new RemoteSwitch({\n    pins: { on: 'A2', off: 'A3' }\n  });\n  const switch3 = new RemoteSwitch({\n    pins: { on: 'A4', off: 'A5' }\n  });\n  board.repl.inject({\n    switch1: switch1,\n    switch2: switch2,\n    switch3: switch3\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst RemoteSwitch = require('./RemoteSwitch')(five);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const switch1 = new RemoteSwitch({\n    pins : { on: 'A0', off: 'A1' }\n  });\n  const switch2 = new RemoteSwitch({\n    pins: { on: 'A2', off: 'A3' }\n  });\n  const switch3 = new RemoteSwitch({\n    pins: { on: 'A4', off: 'A5' }\n  });\n  board.repl.inject({\n    switch1: switch1,\n    switch2: switch2,\n    switch3: switch3\n  });\n});\n",
    "sourcePath": "chapter-09/02-remote-switch",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/02-remote-switch",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Original RemoteSwitch.js is loaded as a local module. Its named on/off pins use the virtual optocoupler/remote circuit; no real outlet or mains behavior is simulated.",
    "needs": [
      "Tessel2",
      "4N25 optocoupler",
      "remote/outlet"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "isolated-battery",
          "type": "battery",
          "x": 630,
          "y": 825,
          "value": 3
        },
        {
          "id": "optical-A0",
          "type": "optocoupler",
          "x": 390,
          "y": 330
        },
        {
          "id": "optical-A0-input-resistor",
          "type": "resistor",
          "x": 390,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A0-output-resistor",
          "type": "resistor",
          "x": 600,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A0-output",
          "type": "led",
          "x": 630,
          "y": 335
        },
        {
          "id": "optical-A1",
          "type": "optocoupler",
          "x": 790,
          "y": 330
        },
        {
          "id": "optical-A1-input-resistor",
          "type": "resistor",
          "x": 790,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A1-output-resistor",
          "type": "resistor",
          "x": 1000,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A1-output",
          "type": "led",
          "x": 1030,
          "y": 335
        },
        {
          "id": "optical-A2",
          "type": "optocoupler",
          "x": 1190,
          "y": 330
        },
        {
          "id": "optical-A2-input-resistor",
          "type": "resistor",
          "x": 1190,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A2-output-resistor",
          "type": "resistor",
          "x": 1400,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A2-output",
          "type": "led",
          "x": 1430,
          "y": 335
        },
        {
          "id": "optical-A3",
          "type": "optocoupler",
          "x": 390,
          "y": 610
        },
        {
          "id": "optical-A3-input-resistor",
          "type": "resistor",
          "x": 390,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-A3-output-resistor",
          "type": "resistor",
          "x": 600,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-A3-output",
          "type": "led",
          "x": 630,
          "y": 615
        },
        {
          "id": "optical-A4",
          "type": "optocoupler",
          "x": 790,
          "y": 610
        },
        {
          "id": "optical-A4-input-resistor",
          "type": "resistor",
          "x": 790,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-A4-output-resistor",
          "type": "resistor",
          "x": 1000,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-A4-output",
          "type": "led",
          "x": 1030,
          "y": 615
        },
        {
          "id": "optical-A5",
          "type": "optocoupler",
          "x": 1190,
          "y": 610
        },
        {
          "id": "optical-A5-input-resistor",
          "type": "resistor",
          "x": 1190,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-A5-output-resistor",
          "type": "resistor",
          "x": 1400,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-A5-output",
          "type": "led",
          "x": 1430,
          "y": 615
        }
      ],
      "wires": [
        {
          "a": "board:A0",
          "b": "optical-A0-input-resistor:1"
        },
        {
          "a": "optical-A0-input-resistor:2",
          "b": "optical-A0:A"
        },
        {
          "a": "optical-A0:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A0-output-resistor:1"
        },
        {
          "a": "optical-A0-output-resistor:2",
          "b": "optical-A0-output:A"
        },
        {
          "a": "optical-A0-output:C",
          "b": "optical-A0:C"
        },
        {
          "a": "optical-A0:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A1",
          "b": "optical-A1-input-resistor:1"
        },
        {
          "a": "optical-A1-input-resistor:2",
          "b": "optical-A1:A"
        },
        {
          "a": "optical-A1:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A1-output-resistor:1"
        },
        {
          "a": "optical-A1-output-resistor:2",
          "b": "optical-A1-output:A"
        },
        {
          "a": "optical-A1-output:C",
          "b": "optical-A1:C"
        },
        {
          "a": "optical-A1:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A2",
          "b": "optical-A2-input-resistor:1"
        },
        {
          "a": "optical-A2-input-resistor:2",
          "b": "optical-A2:A"
        },
        {
          "a": "optical-A2:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A2-output-resistor:1"
        },
        {
          "a": "optical-A2-output-resistor:2",
          "b": "optical-A2-output:A"
        },
        {
          "a": "optical-A2-output:C",
          "b": "optical-A2:C"
        },
        {
          "a": "optical-A2:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A3",
          "b": "optical-A3-input-resistor:1"
        },
        {
          "a": "optical-A3-input-resistor:2",
          "b": "optical-A3:A"
        },
        {
          "a": "optical-A3:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A3-output-resistor:1"
        },
        {
          "a": "optical-A3-output-resistor:2",
          "b": "optical-A3-output:A"
        },
        {
          "a": "optical-A3-output:C",
          "b": "optical-A3:C"
        },
        {
          "a": "optical-A3:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A4",
          "b": "optical-A4-input-resistor:1"
        },
        {
          "a": "optical-A4-input-resistor:2",
          "b": "optical-A4:A"
        },
        {
          "a": "optical-A4:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A4-output-resistor:1"
        },
        {
          "a": "optical-A4-output-resistor:2",
          "b": "optical-A4-output:A"
        },
        {
          "a": "optical-A4-output:C",
          "b": "optical-A4:C"
        },
        {
          "a": "optical-A4:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A5",
          "b": "optical-A5-input-resistor:1"
        },
        {
          "a": "optical-A5-input-resistor:2",
          "b": "optical-A5:A"
        },
        {
          "a": "optical-A5:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A5-output-resistor:1"
        },
        {
          "a": "optical-A5-output-resistor:2",
          "b": "optical-A5-output:A"
        },
        {
          "a": "optical-A5-output:C",
          "b": "optical-A5:C"
        },
        {
          "a": "optical-A5:E",
          "b": "isolated-battery:-"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-09-03-gesture-i2c-test",
    "chapter": 9,
    "name": "Identify a gesture sensor",
    "title": "Identify a gesture sensor",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  board.i2cConfig({ address: 0x39 });\n  board.i2cReadOnce(0x39, 0x92, 1, data => {\n    if (data[0] !== 0xAB) { // DEVICE_ID register should return 0xAB\n      throw new Error('Unable to establish connection with APDS9960');\n    } else {\n      console.log('Connected to APDS-9960!');\n    }\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  board.i2cConfig({ address: 0x39 });\n  board.i2cReadOnce(0x39, 0x92, 1, data => {\n    if (data[0] !== 0xAB) { // DEVICE_ID register should return 0xAB\n      throw new Error('Unable to establish connection with APDS9960');\n    } else {\n      console.log('Connected to APDS-9960!');\n    }\n  });\n});\n",
    "sourcePath": "chapter-09/03-gesture-i2c-test",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/03-gesture-i2c-test",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original program reads APDS9960 device ID 0xAB from a powered I2C model.",
    "needs": [
      "Tessel2",
      "APDS9960 I2C 0x39"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "gesture",
          "type": "gesture",
          "x": 440,
          "y": 80
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "gesture:VCC"
        },
        {
          "a": "board:GND",
          "b": "gesture:GND"
        },
        {
          "a": "board:A0",
          "b": "gesture:SCL"
        },
        {
          "a": "board:A1",
          "b": "gesture:SDA"
        },
        {
          "a": "board:A2",
          "b": "gesture:INT"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-09-04-gesture",
    "chapter": 9,
    "name": "Write a gesture driver",
    "title": "Write a gesture driver",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "APDS9960.js": "// Datasheet: https://cdn.sparkfun.com/assets/learn_tutorials/3/2/1/Avago-APDS-9960-datasheet.pdf\nconst Emitter = require('events').EventEmitter;\nconst util    = require('util');\n\nconst I2C_ADDR = 0x39; // Sensor's hardwired I2C address (p.8)\nconst DEVICE_ID = 0xAB; // The device will report this ID (p.25)\n\n// Register addresses; only those used by plugin included\nconst REGISTERS = {\n  ENABLE   : 0x80, // Enable different sensors/features (p.20)\n  WTIME    : 0x83, // Wait time config value (p.21)\n  PPULSE   : 0x8E, // Proximity pulse count and length (p.23)\n  CONFIG2  : 0x90, // Second configuration register (p.24), for LED boost\n  DEVICE_ID: 0x92, // Contains device ID (0xAB) (p.25)\n  GPENTH   : 0xA0, // Entry proximity threshold for gestures (p.27)\n  GEXTH    : 0xA1, // Exit proximity threshold for gestures (p.28)\n  GCONF1   : 0xA2, // Gesture config 1: gesture detection masking (p.28)\n  GCONF2   : 0xA3, // G config 2: gain, LED drive, gesture wait time (p.29)\n  GOFFSET_U: 0xA4, // Gesture offset (up) (p.30)\n  GOFFSET_D: 0xA5, // Gesture offset (down) (p.30)\n  GPULSE   : 0xA6, // Gesture Pulse count and length (p.31)\n  GOFFSET_L: 0xA7, // Gesture offset (left) (p.30)\n  GOFFSET_R: 0xA9, // Gesture offset (right) (p.31)\n  GCONF4   : 0xAB, // Gesture config 4: interrupts, mode enable (p.32)\n  GFLVL    : 0xAE, // Gesture FIFO level: # of datasets in FIFO (p.32)\n  GSTATUS  : 0xAF, // Gesture status; bit 0 indicates available data (p.33)\n  GFIFO_U  : 0xFC, // 1st FIFO register in (RAM)—read data from here (p.33)\n};\n\nconst FLAGS = {\n  GFIFOTH  : 0b10000000, /* FIFO threshold: trigger interrupt after\n                            4 datasets in FIFO (GCONF1 <7:6> p.28) */\n  GGAIN    : 0b01000000, /* Gesture gain control:\n                            4x (GCONF2 <6:5> p.29) */\n  GLDRIVE  : 0b00000000, /* Gesture LED drive strength:\n                          * 100mA (GCONF2 <4:3> p.29) */\n  GWTIME   : 0b00000001, /* Gesture wait time:\n                            2.8ms (GCONF2 <2:0> p.29) */\n  GPLEN    : 0b11000000, /* Gesture pulse length:\n                            32µs (GPULSE <7 :6> p.31) */\n  GPULSE   : 0b00001001, /* Gesture pulse count:\n                            10 (9 + 1) (GPULSE <5:0> p.31) */\n  GVALID   : 0b00000001, /* GSTATUS register value\n                            indicates valid data if 0th bit is 1 */\n  PPLEN    : 0b10000000, /* Proximity pulse length:\n                            16µs (PPULSE <7 :6> p.23) */\n  PPULSE   : 0b10001001, /* Proximity pulse count:\n                            10 (9 + 1) (PPULSE <5:0> p.23) */\n  LED_BOOST: 0b00110000, /* LED drive boost:\n                            300% (CONFIG2 <5:4> p.24) */\n  GIEN     : 0b00000010, /* Gesture interrupt enable:\n                            yes (GCONF4 <1> p.32) */\n  GMODE    : 0b00000001, /* Gesture mode:\n                            yes! (GCONF4 <0> p.32) */\n  ENABLE   : 0b01001101, /* Enable features:\n                            Gesture, Wait, Proximity, Power on\n                            (ENABLE, p.20) */\n};\n\n// During setup, (value) is written to each register (key)\nconst SETUP_DEFAULTS = {\n  ENABLE   : 0x00,          /* Disable all things,\n                              effectively turning the chip off (p. 20) */\n  GPENTH   : 40,            // Entry proximity threshold\n  GEXTH    : 30,            // Exit proximity threshold\n  GCONF1   : FLAGS.GFIFOTH, // FIFO interrupt threshold\n  GCONF2   : FLAGS.GGAIN | FLAGS.GLDRIVE | FLAGS.GWTIME, // Gesture gain, LED drive, wait time\n  GOFFSET_U: 0x00,          // no offset\n  GOFFSET_D: 0x00,          // no offset\n  GOFFSET_L: 0x00,          // no offset\n  GOFFSET_R: 0x00,          // no offset\n  GPULSE   : FLAGS.GPLEN | FLAGS.GPULSE // pulse count and length,\n};\n\n// During enable, each (value) is written to register (key)\nconst ENABLE_VALUES = {\n  WTIME  : 0xFF,                       /* Wait time between cycles in\n                                          low-power mode: 2.78ms (p. 21) */\n  PPULSE : FLAGS.PPLEN | FLAGS.PPULSE, // Proximity pulse length and count\n  CONFIG2: FLAGS.LED_BOOST,\n  GCONF4 : FLAGS.GIEN | FLAGS.GMODE,\n  ENABLE : FLAGS.ENABLE\n};\n\n// For processing read data\nconst GESTURE_THRESHOLD_OUT = 30;\nconst GESTURE_SENSITIVITY = 10;\n\nmodule.exports = function (five) {\n  return (function () {\n    /**\n     * @param {Object} opts Options: pin, address\n     * pin denotes interrupt pin connection\n     *\n     * Sample initialization:\n     * new APDS9960('A2');\n     * new APDS9960({ pin: 'A2'});\n     *\n     */\n    function APDS9960 (opts) {\n      if (!(this instanceof APDS9960)) {\n        return new APDS9960(opts);\n      }\n      five.Board.Component.call(this, opts = five.Board.Options(opts));\n      this.interruptState = 1; // Interrupt is active LOW\n      opts.address        = opts.address || I2C_ADDR;\n      this.address        = opts.address;\n      this.io.i2cConfig(opts); // Get I2C comms started for the device\n\n      this.io.i2cReadOnce(this.address, REGISTERS.DEVICE_ID, 1, data => {\n        if (data[0] !== DEVICE_ID) { // DEVICE_ID register should return 0xAB\n          throw new Error('Unable to establish connection with APDS9960');\n        }\n      });\n      this.resetGesture();\n      this.setup(this.enable);\n    }\n\n    util.inherits(APDS9960, Emitter);\n\n    APDS9960.prototype.resetGesture = function () {\n      this.gestureData = {\n        raw: [],\n        deltas: {},\n        movements: { // A gesture can have movements along more than one axis\n          vertical  : false,\n          horizontal: false,\n          up        : false,\n          down      : false,\n          left      : false,\n          right     : false\n        },\n        valid: false, // Was gesture decoding successful?\n        direction: undefined\n      };\n    };\n\n    APDS9960.prototype.setup = function (callback) {\n      for (var rKey in SETUP_DEFAULTS) {\n        this.io.i2cWrite(this.address,\n          REGISTERS[rKey], [SETUP_DEFAULTS[rKey]]);\n      }\n      if (typeof callback === 'function') {\n        callback.call(this);\n      }\n    };\n\n    APDS9960.prototype.enable = function () {\n      // Set up interrupt handling\n      this.io.pinMode(this.pin, this.io.MODES.INPUT);\n      // Interrupts from device are active LOW—when pin goes LOW we should act\n      this.io.digitalRead(this.pin, data => {\n        if (data !== this.interruptState && data === 0) {\n          this.readGesture();\n        }\n        this.interruptState = data;\n      });\n      for (var rKey in ENABLE_VALUES) {\n        this.io.i2cWrite(this.address,\n          REGISTERS[rKey], [ENABLE_VALUES[rKey]]);\n      }\n    };\n\n    APDS9960.prototype.readGesture = function () {\n      // GSTATUS value determines whether valid data is available (p.33)\n      this.io.i2cReadOnce(this.address, REGISTERS.GSTATUS, 1, status => {\n        if (status & FLAGS.GVALID === FLAGS.GVALID) {\n          // There should be valid data in the FIFO\n          // GFLVL will report how many datasets are in the FIFO (p.32)\n          this.io.i2cReadOnce(this.address, REGISTERS.GFLVL, 1, fifoLevel => {\n            // Read the number of 4-byte samples indicated by sampleCount\n            // And split them out into their directional components\n            this.io.i2cReadOnce(this.address,\n              REGISTERS.GFIFO_U, (fifoLevel * 4), rawData => {\n                for (var i = 0; i < rawData.length; i += 4) {\n                  this.gestureData.raw.push({\n                    up   : rawData[i],\n                    down : rawData[i + 1],\n                    left : rawData[i + 2],\n                    right: rawData[i + 3]\n                  });\n                }\n                return this.readGesture(); // Keep reading data...\n              });\n          });\n        } else { // No (more) data to gather about this gesture\n          this.processGesture();\n          this.decodeGesture();\n          this.resetGesture();\n        }\n      });\n    };\n\n    APDS9960.prototype.processGesture = function () {\n      const raw = this.gestureData.raw;\n      const directionDelta = function (el1, el2, dir1, dir2) {\n        var el2r = ((el2[dir1] - el2[dir2]) * 100) / (el2[dir1] + el2[dir2]);\n        var el1r = ((el1[dir1] - el1[dir2]) * 100) / (el1[dir1] + el1[dir2]);\n        return el2r - el1r;\n      };\n      const exceedsThreshold = raw.filter(sample => {\n        return (sample.up > GESTURE_THRESHOLD_OUT &&\n                sample.down > GESTURE_THRESHOLD_OUT &&\n                sample.left > GESTURE_THRESHOLD_OUT &&\n                sample.right > GESTURE_THRESHOLD_OUT);\n      });\n      if (!exceedsThreshold.length || raw.length < 4) {\n        // If not enough data or none exceed threshold, nothing to do\n        // This will result in gesture data being ignored and discarded\n        return false;\n      }\n\n      const first = exceedsThreshold[0];\n      const last = exceedsThreshold[exceedsThreshold.length - 1];\n      const deltas = {\n        upDown: directionDelta(first, last, 'up', 'down'),\n        leftRight: directionDelta(first, last, 'left', 'right')\n      };\n      this.gestureData.deltas = deltas;\n    };\n\n    APDS9960.prototype.decodeGesture = function () {\n      const deltas = this.gestureData.deltas;\n      const verticalMotion = Math.abs(deltas.upDown);\n      const horizontalMotion = Math.abs(deltas.leftRight);\n      if (verticalMotion > GESTURE_SENSITIVITY) {\n        this.gestureData.valid = true;\n        this.gestureData.movements.vertical = true;\n        this.gestureData.movements.up = (deltas.upDown >= 0);\n        this.gestureData.movements.down = (deltas.upDown < 0);\n      }\n      if (horizontalMotion > GESTURE_SENSITIVITY) {\n        this.gestureData.valid = true;\n        this.gestureData.movements.horizontal = true;\n        this.gestureData.movements.left = (deltas.leftRight >= 0);\n        this.gestureData.movements.right = (deltas.leftRight < 0);\n      }\n      if (this.gestureData.valid) {\n        if (verticalMotion > horizontalMotion) {\n          this.gestureData.direction = (this.gestureData.movements.up) ?\n            'up' : 'down';\n        } else {\n          this.gestureData.direction = (this.gestureData.movements.left) ?\n          'left' : 'right';\n        }\n      }\n      // Emit a directional event if there is a direction\n      if (this.gestureData.direction) {\n        this.emit(this.gestureData.direction, this.gestureData);\n      }\n      // Always emit a generic gesture event, even if decoding failed\n      this.emit('gesture', this.gestureData);\n    };\n\n    return APDS9960;\n  }());\n};\n",
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst Gesture = require('./APDS9960')(five);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const gesture = new Gesture({ pin: 'A2'});\n  gesture.on('left', () => console.log('left'));\n  gesture.on('right', () => console.log('right'));\n  gesture.on('up', () => console.log('up'));\n  gesture.on('down', () => console.log('down'));\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst Gesture = require('./APDS9960')(five);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const gesture = new Gesture({ pin: 'A2'});\n  gesture.on('left', () => console.log('left'));\n  gesture.on('right', () => console.log('right'));\n  gesture.on('up', () => console.log('up'));\n  gesture.on('down', () => console.log('down'));\n});\n",
    "sourcePath": "chapter-09/04-gesture",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/04-gesture",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original APDS9960.js reads register/FIFO data and active-low A2 interrupts. Direction buttons supply gesture samples to the connected sensor.",
    "needs": [
      "Tessel2",
      "APDS9960 interrupt A2"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "gesture",
          "type": "gesture",
          "x": 440,
          "y": 80
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "gesture:VCC"
        },
        {
          "a": "board:GND",
          "b": "gesture:GND"
        },
        {
          "a": "board:A0",
          "b": "gesture:SCL"
        },
        {
          "a": "board:A1",
          "b": "gesture:SDA"
        },
        {
          "a": "board:A2",
          "b": "gesture:INT"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-09-05-gesture-switches",
    "chapter": 9,
    "name": "Gesture-controlled remote switches",
    "title": "Gesture-controlled remote switches",
    "entry": "index.js",
    "platform": "tessel",
    "environment": "virtual-platform",
    "files": {
      "APDS9960.js": "// Datasheet: https://cdn.sparkfun.com/assets/learn_tutorials/3/2/1/Avago-APDS-9960-datasheet.pdf\nconst Emitter = require('events').EventEmitter;\nconst util    = require('util');\n\nconst I2C_ADDR = 0x39; // Sensor's hardwired I2C address (p.8)\nconst DEVICE_ID = 0xAB; // The device will report this ID (p.25)\n\nconst REGISTERS = { // Register addresses\n  ENABLE   : 0x80, // Enable different sensors/features (p.20)\n  WTIME    : 0x83, // Wait time config value (p.21)\n  PPULSE   : 0x8E, // Proximity pulse count and length (p.23)\n  CONFIG2  : 0x90, // Second configuration register (p.24), specifically for LED boost\n  DEVICE_ID: 0x92, // Contains device ID (0xAB) (p.25)\n  GPENTH   : 0xA0, // Entry proximity threshold for gestures (p.27)\n  GEXTH    : 0xA1, // Exit proximity threshold for gestures (p.28)\n  GCONF1   : 0xA2, // Gesture configuration 1: gesture detection masking (p.28)\n  GCONF2   : 0xA3, // Gesture configuration 2: gain, LED drive, gesture wait time (p.29)\n  GOFFSET_U: 0xA4, // Gesture offset (up) (p.30)\n  GOFFSET_D: 0xA5, // Gesture offset (down) (p.30)\n  GPULSE   : 0xA6, // Gesture Pulse count and length (p.31)\n  GOFFSET_L: 0xA7, // Gesture offset (left) (p.30)\n  GOFFSET_R: 0xA9, // Gesture offset (right) (p.31)\n  GCONF4   : 0xAB, // Gesture configuration 4: interrupts, mode enable (p.32)\n  GFLVL    : 0xAE, // Gesture FIFO level; reports # of datasets in FIFO (p.32)\n  GSTATUS  : 0xAF, // Gesture status info, bit 0 indicates available valid data (p.33)\n  GFIFO_U  : 0xFC, // First FIFO register for data (RAM)—read data from here (p.33)\n};\n\nconst FLAGS = {\n  GFIFOTH  : 0b10000000, // FIFO threshold            : trigger interrupt after 4 datasets in FIFO (GCONF1 <7:6> p.28)\n  GGAIN    : 0b01000000, // Gesture gain control      : 4x (GCONF2 <6:5> p.29)\n  GLDRIVE  : 0b00000000, // Gesture LED drive strength: 100mA (GCONF2 <4:3> p.29)\n  GWTIME   : 0b00000001, // Gesture wait time         : 2.8ms (GCONF2 <2:0> p.29)\n  GPLEN    : 0b11000000, // Gesture pulse length      : 32µs (GPULSE <7 :6> p.31)\n  GPULSE   : 0b00001001, // Gesture pulse count       : 10 (9 + 1) (GPULSE <5:0> p.31)\n  GVALID   : 0b00000001, // GSTATUS register value indicates valid data if 0th bit is 1\n  PPLEN    : 0b10000000, // Proximity pulse length    : 16µs (PPULSE <7 :6> p.23)\n  PPULSE   : 0b10001001, // Proximity pulse count     : 10 (9 + 1) (PPULSE <5:0> p.23)\n  LED_BOOST: 0b00110000, // LED drive boost           : 300% (CONFIG2 <5:4> p.24),\n  GIEN     : 0b00000010, // Gesture interrupt enable  : yes (GCONF4 <1> p.32)\n  GMODE    : 0b00000001, // Gesture mode              : yes! (GCONF4 <0> p.32),\n  ENABLE   : 0b01001101, // Enable features           : Gesture, Wait, Proximity, Power on (ENABLE, p.20)\n};\n\nconst SETUP_DEFAULTS = { // During setup, (value) is written to each register (key)\n  ENABLE   : 0x00, // Disable all things, effectively turning the chip off (p. 20)\n  GPENTH   : 40, // Entry proximity threshold (this number is magic ATM)\n  GEXTH    : 30, // Exit proximity threshold (this number is magic ATM)\n  GCONF1   : FLAGS.GFIFOTH, // FIFO interrupt threshold\n  GCONF2   : FLAGS.GGAIN | FLAGS.GLDRIVE | FLAGS.GWTIME, // Gesture gain, LED drive, wait time\n  GOFFSET_U: 0x00, // no offset\n  GOFFSET_D: 0x00, // no offset\n  GOFFSET_L: 0x00, // no offset\n  GOFFSET_R: 0x00, // no offset\n  GPULSE   : FLAGS.GPLEN | FLAGS.GPULSE // pulse count and length,\n};\n\nconst ENABLE_VALUES = { // During enable, each (value) is written to register (key)\n  WTIME  : 0xFF, // Wait time between cycles in low-power mode: 2.78ms (p. 21)\n  PPULSE : FLAGS.PPLEN | FLAGS.PPULSE, // Proximity pulse length and count\n  CONFIG2: FLAGS.LED_BOOST,\n  GCONF4 : FLAGS.GIEN | FLAGS.GMODE,\n  ENABLE : FLAGS.ENABLE\n};\n\n// For processing read data\nconst GESTURE_THRESHOLD_OUT = 30;\nconst GESTURE_SENSITIVITY = 10;\n\nmodule.exports = function (five) {\n  return (function () {\n    /**\n     * @param {Object} opts Options: pin, address\n     * pin denotes interrupt pin connection\n     *\n     * Sample initialization:\n     * new APDS9960('A2');\n     * new APDS9960({ pin: 'A2'});\n     *\n     */\n    function APDS9960 (opts) {\n      if (!(this instanceof APDS9960)) {\n        return new APDS9960(opts);\n      }\n      five.Board.Component.call(this, opts = five.Board.Options(opts));\n      this.interruptState = 1; // Interrupt is active LOW\n      opts.address        = opts.address || I2C_ADDR;\n      this.address        = opts.address;\n      this.io.i2cConfig(opts); // Get I2C comms started for the device\n\n      this.io.i2cReadOnce(this.address, REGISTERS.DEVICE_ID, 1, data => {\n        if (data[0] !== DEVICE_ID) { // DEVICE_ID register should return 0xAB\n          throw new Error('Unable to establish connection with APDS9960');\n        }\n      });\n      this.resetGesture();\n      this.setup(this.enable);\n    }\n\n    util.inherits(APDS9960, Emitter);\n\n    APDS9960.prototype.resetGesture = function () {\n      this.gestureData = {\n        raw: [],\n        deltas: {},\n        movements: { // A gesture can have movements along more than one axis\n          vertical  : false,\n          horizontal: false,\n          up        : false,\n          down      : false,\n          left      : false,\n          right     : false\n        },\n        valid: false, // Was gesture decoding successful?\n        direction: undefined\n      };\n    };\n\n    APDS9960.prototype.setup = function (callback) {\n      for (var rKey in SETUP_DEFAULTS) {\n        this.io.i2cWrite(this.address,\n          REGISTERS[rKey], [SETUP_DEFAULTS[rKey]]);\n      }\n      if (typeof callback === 'function') {\n        callback.call(this);\n      }\n    };\n\n    APDS9960.prototype.enable = function () {\n      // Set up interrupt handling\n      this.io.pinMode(this.pin, this.io.MODES.INPUT);\n      // Interrupts from device are active LOW—when pin goes LOW we should act\n      this.io.digitalRead(this.pin, data => {\n        if (data !== this.interruptState && data === 0) {\n          this.readGesture();\n        }\n        this.interruptState = data;\n      });\n      for (var rKey in ENABLE_VALUES) {\n        this.io.i2cWrite(this.address,\n          REGISTERS[rKey], [ENABLE_VALUES[rKey]]);\n      }\n    };\n\n    APDS9960.prototype.readGesture = function () {\n      // GSTATUS value determines whether valid data is available (p.33)\n      this.io.i2cReadOnce(this.address, REGISTERS.GSTATUS, 1, status => {\n        if (status & FLAGS.GVALID === FLAGS.GVALID) {\n          // There should be valid data in the FIFO\n          // GFLVL will report how many datasets are in the FIFO (p.32)\n          this.io.i2cReadOnce(this.address, REGISTERS.GFLVL, 1, fifoLevel => {\n            // Read the number of 4-byte samples indicated by sampleCount\n            // And split them out into their directional components\n            this.io.i2cReadOnce(this.address,\n              REGISTERS.GFIFO_U, (fifoLevel * 4), rawData => {\n                for (var i = 0; i < rawData.length; i += 4) {\n                  this.gestureData.raw.push({\n                    up   : rawData[i],\n                    down : rawData[i + 1],\n                    left : rawData[i + 2],\n                    right: rawData[i + 3]\n                  });\n                }\n                return this.readGesture(); // Keep reading data...\n              });\n          });\n        } else { // No (more) data to gather about this gesture\n          this.processGesture();\n          this.decodeGesture();\n          this.resetGesture();\n        }\n      });\n    };\n\n    APDS9960.prototype.processGesture = function () {\n      const raw = this.gestureData.raw;\n      const directionDelta = function (el1, el2, dir1, dir2) {\n        var el2r = ((el2[dir1] - el2[dir2]) * 100) / (el2[dir1] + el2[dir2]);\n        var el1r = ((el1[dir1] - el1[dir2]) * 100) / (el1[dir1] + el1[dir2]);\n        return el2r - el1r;\n      };\n      const exceedsThreshold = raw.filter(sample => {\n        return (sample.up > GESTURE_THRESHOLD_OUT &&\n                sample.down > GESTURE_THRESHOLD_OUT &&\n                sample.left > GESTURE_THRESHOLD_OUT &&\n                sample.right > GESTURE_THRESHOLD_OUT);\n      });\n      if (!exceedsThreshold.length || raw.length < 4) {\n        // If not enough data or none exceed threshold, nothing to do\n        // This will result in gesture data being ignored and discarded\n        return false;\n      }\n\n      const first = exceedsThreshold[0];\n      const last = exceedsThreshold[exceedsThreshold.length - 1];\n      const deltas = {\n        upDown: directionDelta(first, last, 'up', 'down'),\n        leftRight: directionDelta(first, last, 'left', 'right')\n      };\n      this.gestureData.deltas = deltas;\n    };\n\n    APDS9960.prototype.decodeGesture = function () {\n      const deltas = this.gestureData.deltas;\n      const verticalMotion = Math.abs(deltas.upDown);\n      const horizontalMotion = Math.abs(deltas.leftRight);\n      if (verticalMotion > GESTURE_SENSITIVITY) {\n        this.gestureData.valid = true;\n        this.gestureData.movements.vertical = true;\n        this.gestureData.movements.up = (deltas.upDown >= 0);\n        this.gestureData.movements.down = (deltas.upDown < 0);\n      }\n      if (horizontalMotion > GESTURE_SENSITIVITY) {\n        this.gestureData.valid = true;\n        this.gestureData.movements.horizontal = true;\n        this.gestureData.movements.left = (deltas.leftRight >= 0);\n        this.gestureData.movements.right = (deltas.leftRight < 0);\n      }\n      if (this.gestureData.valid) {\n        if (verticalMotion > horizontalMotion) {\n          this.gestureData.direction = (this.gestureData.movements.up) ?\n            'up' : 'down';\n        } else {\n          this.gestureData.direction = (this.gestureData.movements.left) ?\n          'left' : 'right';\n        }\n      }\n      // Emit a directional event if there is a direction\n      if (this.gestureData.direction) {\n        this.emit(this.gestureData.direction, this.gestureData);\n      }\n      // Always emit a generic gesture event, even if decoding failed\n      this.emit('gesture', this.gestureData);\n    };\n\n    return APDS9960;\n  }());\n};\n",
      "RemoteSwitch.js": "module.exports = function (five) {\n  return (function () {\n    function RemoteSwitch (opts) {\n      if (!(this instanceof RemoteSwitch)) {\n        return new RemoteSwitch(opts);\n      }\n      five.Board.Component.call(this, opts = five.Board.Options(opts));\n\n      this.pins     = opts.pins;\n      this.duration = opts.duration || 500;\n      this.isOn     = undefined;\n      this.isActive = false;\n      this.queue    = [];\n\n      this.io.pinMode(this.pins.on, this.io.MODES.OUTPUT);\n      this.io.pinMode(this.pins.off, this.io.MODES.OUTPUT);\n    }\n\n    RemoteSwitch.prototype.toggle = function (turnOn, callback) {\n      if (this.isActive) {\n        this.queue.push([turnOn, callback]);\n        return;\n      }\n      this.isActive = true;\n      if (typeof turnOn === 'undefined') {\n        turnOn = !this.isOn;\n      }\n      const pin = (turnOn) ? this.pins.on : this.pins.off;\n      this.io.digitalWrite(pin, 1);\n      setTimeout(() => {\n        this.io.digitalWrite(pin, 0);\n        this.isActive = false;\n        this.isOn = !!turnOn;\n        if (typeof callback === 'function') {\n          callback();\n        }\n        if (this.queue.length) {\n          this.toggle.apply(this, this.queue.shift());\n        }\n      }, this.duration);\n    };\n\n    RemoteSwitch.prototype.on = function (callback) {\n      this.toggle(true, callback);\n    };\n    RemoteSwitch.prototype.off = function (callback) {\n      this.toggle(false, callback);\n    };\n    return RemoteSwitch;\n  }());\n};\n",
      "RemoteSwitches.js": "const util    = require('util');\n\nmodule.exports = function (five, RemoteSwitch) {\n  return (function () {\n    function RemoteSwitches (numsOrObjects) {\n      if (!(this instanceof RemoteSwitches)) {\n        return new RemoteSwitches(numsOrObjects);\n      }\n      Object.defineProperty(this, 'type', {\n        value: RemoteSwitch\n      });\n      five.Collection.call(this, numsOrObjects);\n      this.isActive = false;\n      this.queue = [];\n    }\n\n    util.inherits(RemoteSwitches, five.Collection);\n    five.Collection.installMethodForwarding(\n      RemoteSwitches.prototype, RemoteSwitch.prototype\n    );\n\n    const write = function (whichSwitch, turnOn) {\n      if (this.isActive) {\n        this.queue.push([whichSwitch, turnOn]);\n        return;\n      }\n      this.isActive = true;\n      whichSwitch.toggle.call(whichSwitch, turnOn, () => {\n        this.isActive = false;\n        if (this.queue.length) {\n          write.apply(this, this.queue.shift());\n        }\n      });\n    };\n\n    RemoteSwitches.prototype.toggle = function (idx, turnOn) {\n      if (typeof idx !== 'undefined' && this[idx]) {\n        write.call(this, this[idx], turnOn);\n      } else {\n        this.each(whichSwitch => write.call(this, whichSwitch, turnOn));\n      }\n    };\n\n    RemoteSwitches.prototype.on = function (idx) { this.toggle(idx, true); };\n    RemoteSwitches.prototype.off = function (idx) { this.toggle(idx, false); };\n    return RemoteSwitches;\n  }());\n};\n",
      "index.js": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst Gesture = require('./APDS9960')(five);\nconst RemoteSwitch = require('./RemoteSwitch')(five);\nconst RemoteSwitches = require('./RemoteSwitches')(five, RemoteSwitch);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const gesture = new Gesture({ pin: 'A2'});\n  const switches = new RemoteSwitches([\n    new RemoteSwitch({ pins : { on: 'A3', off: 'A4' } }),\n    new RemoteSwitch({ pins: { on: 'A5', off: 'A6' } }),\n    new RemoteSwitch({ pins: { on: 'A7', off: 'B0' } })\n  ]);\n  gesture.on('up', () => switches.on());\n  gesture.on('down', () => switches.off());\n  gesture.on('right', () => switches.on(1));\n  gesture.on('left', () => switches.off(1));\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Tessel = require('tessel-io');\nconst Gesture = require('./APDS9960')(five);\nconst RemoteSwitch = require('./RemoteSwitch')(five);\nconst RemoteSwitches = require('./RemoteSwitches')(five, RemoteSwitch);\n\nconst board = new five.Board({ io: new Tessel() });\n\nboard.on('ready', () => {\n  const gesture = new Gesture({ pin: 'A2'});\n  const switches = new RemoteSwitches([\n    new RemoteSwitch({ pins : { on: 'A3', off: 'A4' } }),\n    new RemoteSwitch({ pins: { on: 'A5', off: 'A6' } }),\n    new RemoteSwitch({ pins: { on: 'A7', off: 'B0' } })\n  ]);\n  gesture.on('up', () => switches.on());\n  gesture.on('down', () => switches.off());\n  gesture.on('right', () => switches.on(1));\n  gesture.on('left', () => switches.off(1));\n});\n",
    "sourcePath": "chapter-09/05-gesture-switches",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/05-gesture-switches",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original gesture driver and RemoteSwitch modules control three virtual remote channels. Check optocoupler pairs and gesture-to-channel behavior; no mains simulation.",
    "needs": [
      "Tessel2",
      "APDS9960",
      "6 optocouplers",
      "3 remote outlets"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "tessel",
          "x": 25,
          "y": 5
        },
        {
          "id": "gesture",
          "type": "gesture",
          "x": 1070,
          "y": 40
        },
        {
          "id": "isolated-battery",
          "type": "battery",
          "x": 630,
          "y": 825,
          "value": 3
        },
        {
          "id": "optical-A3",
          "type": "optocoupler",
          "x": 390,
          "y": 330
        },
        {
          "id": "optical-A3-input-resistor",
          "type": "resistor",
          "x": 390,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A3-output-resistor",
          "type": "resistor",
          "x": 600,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A3-output",
          "type": "led",
          "x": 630,
          "y": 335
        },
        {
          "id": "optical-A4",
          "type": "optocoupler",
          "x": 790,
          "y": 330
        },
        {
          "id": "optical-A4-input-resistor",
          "type": "resistor",
          "x": 790,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A4-output-resistor",
          "type": "resistor",
          "x": 1000,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A4-output",
          "type": "led",
          "x": 1030,
          "y": 335
        },
        {
          "id": "optical-A5",
          "type": "optocoupler",
          "x": 1190,
          "y": 330
        },
        {
          "id": "optical-A5-input-resistor",
          "type": "resistor",
          "x": 1190,
          "y": 530,
          "value": 330
        },
        {
          "id": "optical-A5-output-resistor",
          "type": "resistor",
          "x": 1400,
          "y": 475,
          "value": 330
        },
        {
          "id": "optical-A5-output",
          "type": "led",
          "x": 1430,
          "y": 335
        },
        {
          "id": "optical-A6",
          "type": "optocoupler",
          "x": 390,
          "y": 610
        },
        {
          "id": "optical-A6-input-resistor",
          "type": "resistor",
          "x": 390,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-A6-output-resistor",
          "type": "resistor",
          "x": 600,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-A6-output",
          "type": "led",
          "x": 630,
          "y": 615
        },
        {
          "id": "optical-A7",
          "type": "optocoupler",
          "x": 790,
          "y": 610
        },
        {
          "id": "optical-A7-input-resistor",
          "type": "resistor",
          "x": 790,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-A7-output-resistor",
          "type": "resistor",
          "x": 1000,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-A7-output",
          "type": "led",
          "x": 1030,
          "y": 615
        },
        {
          "id": "optical-B0",
          "type": "optocoupler",
          "x": 1190,
          "y": 610
        },
        {
          "id": "optical-B0-input-resistor",
          "type": "resistor",
          "x": 1190,
          "y": 810,
          "value": 330
        },
        {
          "id": "optical-B0-output-resistor",
          "type": "resistor",
          "x": 1400,
          "y": 755,
          "value": 330
        },
        {
          "id": "optical-B0-output",
          "type": "led",
          "x": 1430,
          "y": 615
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "gesture:VCC"
        },
        {
          "a": "board:GND",
          "b": "gesture:GND"
        },
        {
          "a": "board:A0",
          "b": "gesture:SCL"
        },
        {
          "a": "board:A1",
          "b": "gesture:SDA"
        },
        {
          "a": "board:A2",
          "b": "gesture:INT"
        },
        {
          "a": "board:A3",
          "b": "optical-A3-input-resistor:1"
        },
        {
          "a": "optical-A3-input-resistor:2",
          "b": "optical-A3:A"
        },
        {
          "a": "optical-A3:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A3-output-resistor:1"
        },
        {
          "a": "optical-A3-output-resistor:2",
          "b": "optical-A3-output:A"
        },
        {
          "a": "optical-A3-output:C",
          "b": "optical-A3:C"
        },
        {
          "a": "optical-A3:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A4",
          "b": "optical-A4-input-resistor:1"
        },
        {
          "a": "optical-A4-input-resistor:2",
          "b": "optical-A4:A"
        },
        {
          "a": "optical-A4:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A4-output-resistor:1"
        },
        {
          "a": "optical-A4-output-resistor:2",
          "b": "optical-A4-output:A"
        },
        {
          "a": "optical-A4-output:C",
          "b": "optical-A4:C"
        },
        {
          "a": "optical-A4:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A5",
          "b": "optical-A5-input-resistor:1"
        },
        {
          "a": "optical-A5-input-resistor:2",
          "b": "optical-A5:A"
        },
        {
          "a": "optical-A5:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A5-output-resistor:1"
        },
        {
          "a": "optical-A5-output-resistor:2",
          "b": "optical-A5-output:A"
        },
        {
          "a": "optical-A5-output:C",
          "b": "optical-A5:C"
        },
        {
          "a": "optical-A5:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A6",
          "b": "optical-A6-input-resistor:1"
        },
        {
          "a": "optical-A6-input-resistor:2",
          "b": "optical-A6:A"
        },
        {
          "a": "optical-A6:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A6-output-resistor:1"
        },
        {
          "a": "optical-A6-output-resistor:2",
          "b": "optical-A6-output:A"
        },
        {
          "a": "optical-A6-output:C",
          "b": "optical-A6:C"
        },
        {
          "a": "optical-A6:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:A7",
          "b": "optical-A7-input-resistor:1"
        },
        {
          "a": "optical-A7-input-resistor:2",
          "b": "optical-A7:A"
        },
        {
          "a": "optical-A7:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-A7-output-resistor:1"
        },
        {
          "a": "optical-A7-output-resistor:2",
          "b": "optical-A7-output:A"
        },
        {
          "a": "optical-A7-output:C",
          "b": "optical-A7:C"
        },
        {
          "a": "optical-A7:E",
          "b": "isolated-battery:-"
        },
        {
          "a": "board:B0",
          "b": "optical-B0-input-resistor:1"
        },
        {
          "a": "optical-B0-input-resistor:2",
          "b": "optical-B0:A"
        },
        {
          "a": "optical-B0:K",
          "b": "board:GND"
        },
        {
          "a": "isolated-battery:+",
          "b": "optical-B0-output-resistor:1"
        },
        {
          "a": "optical-B0-output-resistor:2",
          "b": "optical-B0-output:A"
        },
        {
          "a": "optical-B0-output:C",
          "b": "optical-B0:C"
        },
        {
          "a": "optical-B0:E",
          "b": "isolated-battery:-"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-05-rpi3-bmp180",
    "chapter": 11,
    "name": "Pi weather sensor",
    "title": "Pi weather sensor",
    "entry": "index.js",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "index.js": "const five = require('johnny-five');\nconst Raspi = require('raspi-io');\n\nconst board = new five.Board({\n  io: new Raspi()\n});\n\nboard.on('ready', () => {\n  const bmp180 = new five.Multi({\n    controller: 'BMP180'\n  });\n  bmp180.on('change', () => {\n    var temperature = bmp180.thermometer.fahrenheit.toFixed(2);\n    var pressure    = bmp180.barometer.pressure.toFixed(2);\n    console.log(`${temperature}°F | ${pressure}kPa`);\n  });\n});\n"
    },
    "code": "const five = require('johnny-five');\nconst Raspi = require('raspi-io');\n\nconst board = new five.Board({\n  io: new Raspi()\n});\n\nboard.on('ready', () => {\n  const bmp180 = new five.Multi({\n    controller: 'BMP180'\n  });\n  bmp180.on('change', () => {\n    var temperature = bmp180.thermometer.fahrenheit.toFixed(2);\n    var pressure    = bmp180.barometer.pressure.toFixed(2);\n    console.log(`${temperature}°F | ${pressure}kPa`);\n  });\n});\n",
    "sourcePath": "chapter-11/05-rpi3-bmp180",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/05-rpi3-bmp180",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. A genuine Johnny-Five BMP180 driver reads a powered I2C device through the virtual Raspi IO adapter. Native Linux is not emulated.",
    "needs": [
      "RaspberryPi3",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:GPIO3",
          "b": "weather:SCL"
        },
        {
          "a": "board:GPIO2",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-06-rpi3-weather",
    "chapter": 11,
    "name": "Pi weather web app",
    "title": "Pi weather web app",
    "entry": "index.js",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "app/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <script src=\"/socket.io/socket.io.js\"></script>\n  <link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" />\n  <title>Current Conditions</title>\n</head>\n<body>\n\n  <main role=\"main\">\n    <h1>Current Conditions</h1>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Temperature</h2>\n          <span class=\"data--value\" id=\"temperature\">--.--</span>\n          <small class=\"data--unit\">F</small>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Pressure</h2>\n          <span class=\"data--value\" id=\"pressure\">---.--</span>\n          <small class=\"data--unit\">mBar</small>\n        </div>\n      </div>\n    </div>\n  </main>\n\n  <script>\n  window.addEventListener('DOMContentLoaded', function () {\n    var socket = io();\n    socket.on('weather', updateData);\n  });\n  function updateData (data) {\n    ['temperature', 'pressure'].forEach(function (dataPoint) {\n      document.getElementById(dataPoint).innerHTML = data[dataPoint].toFixed(2);\n    });\n    document.querySelectorAll('.data--value').forEach(function (el) {\n      el.classList.add('connected');\n    });\n  }\n  </script>\n </body>\n</html>\n",
      "app/style.css": "html {\n  font-family    : \"Helvetica Neue\", \"Helvetica\", \"Arial\", san-serif;\n}\n.row {\n display         : flex;\n justify-content : center;\n max-width       : 48rem;\n margin          : auto;\n}\n.row .col {\n margin          : auto;\n padding         : 2rem;\n}\nh1, h2 {\n margin          : 0;\n text-align      : center;\n}\nh2 {\n font-size       : 1.5rem;\n}\nsmall {\n color           : #999;\n font-size       : 0.65em;\n}\n.data {\n padding         : 1.5rem;\n background-color: #eee;\n border-radius   : 10px;\n font-size       : 3rem;\n}\n.data--value {\n font-weight     : bold;\n}\n.connected {\n color           : #093;\n}\n",
      "index.js": "const five     = require('johnny-five');\nconst Raspi   = require('raspi-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new Raspi() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst Raspi   = require('raspi-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new Raspi() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n",
    "sourcePath": "chapter-11/06-rpi3-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/06-rpi3-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual Raspi IO and selected in-memory server APIs. No native network listener is opened.",
    "needs": [
      "RaspberryPi3",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:GPIO3",
          "b": "weather:SCL"
        },
        {
          "a": "board:GPIO2",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-07-arduino-uno-weather",
    "chapter": 11,
    "name": "Uno weather web app",
    "title": "Uno weather web app",
    "entry": "index.js",
    "platform": "uno",
    "environment": "arduino",
    "files": {
      "app/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <script src=\"/socket.io/socket.io.js\"></script>\n  <link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" />\n  <title>Current Conditions</title>\n</head>\n<body>\n\n  <main role=\"main\">\n    <h1>Current Conditions</h1>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Temperature</h2>\n          <span class=\"data--value\" id=\"temperature\">--.--</span>\n          <small class=\"data--unit\">F</small>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Pressure</h2>\n          <span class=\"data--value\" id=\"pressure\">---.--</span>\n          <small class=\"data--unit\">mBar</small>\n        </div>\n      </div>\n    </div>\n  </main>\n\n  <script>\n  window.addEventListener('DOMContentLoaded', function () {\n    var socket = io();\n    socket.on('weather', updateData);\n  });\n  function updateData (data) {\n    ['temperature', 'pressure'].forEach(function (dataPoint) {\n      document.getElementById(dataPoint).innerHTML = data[dataPoint].toFixed(2);\n    });\n    document.querySelectorAll('.data--value').forEach(function (el) {\n      el.classList.add('connected');\n    });\n  }\n  </script>\n </body>\n</html>\n",
      "app/style.css": "html {\n  font-family    : \"Helvetica Neue\", \"Helvetica\", \"Arial\", san-serif;\n}\n.row {\n display         : flex;\n justify-content : center;\n max-width       : 48rem;\n margin          : auto;\n}\n.row .col {\n margin          : auto;\n padding         : 2rem;\n}\nh1, h2 {\n margin          : 0;\n text-align      : center;\n}\nh2 {\n font-size       : 1.5rem;\n}\nsmall {\n color           : #999;\n font-size       : 0.65em;\n}\n.data {\n padding         : 1.5rem;\n background-color: #eee;\n border-radius   : 10px;\n font-size       : 3rem;\n}\n.data--value {\n font-weight     : bold;\n}\n.connected {\n color           : #093;\n}\n",
      "index.js": "const five     = require('johnny-five');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().wlan0[0].address}:3000`);\n  });\n});\n",
    "sourcePath": "chapter-11/07-arduino-uno-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/07-arduino-uno-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original Johnny-Five runs on the AVR Uno simulation, with the web dashboard through selected in-memory server APIs. No native TCP server is opened.",
    "needs": [
      "Uno",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "uno",
          "x": 25,
          "y": 90
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 500,
          "y": 120,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND.2",
          "b": "weather:GND"
        },
        {
          "a": "board:A5",
          "b": "weather:SCL"
        },
        {
          "a": "board:A4",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-11-09-bbb-weather",
    "chapter": 11,
    "name": "BeagleBone weather web app",
    "title": "BeagleBone weather web app",
    "entry": "index.js",
    "platform": "beaglebone",
    "environment": "virtual-platform",
    "files": {
      "app/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <script src=\"/socket.io/socket.io.js\"></script>\n  <link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" />\n  <title>Current Conditions</title>\n</head>\n<body>\n\n  <main role=\"main\">\n    <h1>Current Conditions</h1>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Temperature</h2>\n          <span class=\"data--value\" id=\"temperature\">--.--</span>\n          <small class=\"data--unit\">F</small>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Pressure</h2>\n          <span class=\"data--value\" id=\"pressure\">---.--</span>\n          <small class=\"data--unit\">mBar</small>\n        </div>\n      </div>\n    </div>\n  </main>\n\n  <script>\n  window.addEventListener('DOMContentLoaded', function () {\n    var socket = io();\n    socket.on('weather', updateData);\n  });\n  function updateData (data) {\n    ['temperature', 'pressure'].forEach(function (dataPoint) {\n      document.getElementById(dataPoint).innerHTML = data[dataPoint].toFixed(2);\n    });\n    document.querySelectorAll('.data--value').forEach(function (el) {\n      el.classList.add('connected');\n    });\n  }\n  </script>\n </body>\n</html>\n",
      "app/style.css": "html {\n  font-family    : \"Helvetica Neue\", \"Helvetica\", \"Arial\", san-serif;\n}\n.row {\n display         : flex;\n justify-content : center;\n max-width       : 48rem;\n margin          : auto;\n}\n.row .col {\n margin          : auto;\n padding         : 2rem;\n}\nh1, h2 {\n margin          : 0;\n text-align      : center;\n}\nh2 {\n font-size       : 1.5rem;\n}\nsmall {\n color           : #999;\n font-size       : 0.65em;\n}\n.data {\n padding         : 1.5rem;\n background-color: #eee;\n border-radius   : 10px;\n font-size       : 3rem;\n}\n.data--value {\n font-weight     : bold;\n}\n.connected {\n color           : #093;\n}\n",
      "index.js": "const five     = require('johnny-five');\nconst BeagleBone = require('beaglebone-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new BeagleBone() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().eth0[0].address}:4000`);\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst BeagleBone = require('beaglebone-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({ io: new BeagleBone() });\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(3000, () => {\n    console.log(`http://${os.networkInterfaces().eth0[0].address}:4000`);\n  });\n});\n",
    "sourcePath": "chapter-11/09-bbb-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/09-bbb-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual BeagleBone IO and selected in-memory server APIs. Native Linux and TCP are not emulated.",
    "needs": [
      "BeagleBoneBlack",
      "BMP180"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "beaglebone",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:P9_19",
          "b": "weather:SCL"
        },
        {
          "a": "board:P9_20",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-12-01-bbb-resin-io-weather",
    "chapter": 12,
    "name": "Cloud-managed weather station",
    "title": "Cloud-managed weather station",
    "entry": "index.js",
    "platform": "beaglebone",
    "environment": "virtual-platform",
    "files": {
      "app/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <script src=\"/socket.io/socket.io.js\"></script>\n  <link rel=\"stylesheet\" href=\"style.css\" type=\"text/css\" />\n  <title>Current Conditions</title>\n</head>\n<body>\n\n  <main role=\"main\">\n    <h1>Current Conditions</h1>\n    <div class=\"row\">\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Temperature</h2>\n          <span class=\"data--value\" id=\"temperature\">--.--</span>\n          <small class=\"data--unit\">F</small>\n        </div>\n      </div>\n      <div class=\"col\">\n        <div class=\"data\">\n          <h2>Pressure</h2>\n          <span class=\"data--value\" id=\"pressure\">---.--</span>\n          <small class=\"data--unit\">mBar</small>\n        </div>\n      </div>\n    </div>\n  </main>\n\n  <script>\n  window.addEventListener('DOMContentLoaded', function () {\n    var socket = io();\n    socket.on('weather', updateData);\n  });\n  function updateData (data) {\n    ['temperature', 'pressure'].forEach(function (dataPoint) {\n      document.getElementById(dataPoint).innerHTML = data[dataPoint].toFixed(2);\n    });\n    document.querySelectorAll('.data--value').forEach(function (el) {\n      el.classList.add('connected');\n    });\n  }\n  </script>\n </body>\n</html>\n",
      "app/style.css": "html {\n  font-family    : \"Helvetica Neue\", \"Helvetica\", \"Arial\", san-serif;\n}\n.row {\n display         : flex;\n justify-content : center;\n max-width       : 48rem;\n margin          : auto;\n}\n.row .col {\n margin          : auto;\n padding         : 2rem;\n}\nh1, h2 {\n margin          : 0;\n text-align      : center;\n}\nh2 {\n font-size       : 1.5rem;\n}\nsmall {\n color           : #999;\n font-size       : 0.65em;\n}\n.data {\n padding         : 1.5rem;\n background-color: #eee;\n border-radius   : 10px;\n font-size       : 3rem;\n}\n.data--value {\n font-weight     : bold;\n}\n.connected {\n color           : #093;\n}\n",
      "index.js": "const five     = require('johnny-five');\nconst BeagleBone = require('beaglebone-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({\n  io: new BeagleBone(),\n  repl: false\n});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(80, () => {\n    console.log(`http://${os.networkInterfaces().eth0[0].address}:80`);\n  });\n});\n"
    },
    "code": "const five     = require('johnny-five');\nconst BeagleBone = require('beaglebone-io');\nconst express  = require('express');\nconst SocketIO = require('socket.io');\n\nconst path = require('path');\nconst http = require('http');\nconst os   = require('os');\n\nconst app    = new express();\nconst server = new http.Server(app);\nconst socket = new SocketIO(server);\napp.use(express.static(path.join(__dirname, '/app')));\n\nconst board = new five.Board({\n  io: new BeagleBone(),\n  repl: false\n});\n\nboard.on('ready', () => {\n  const weatherSensor = new five.Multi({\n    controller: 'BMP180',\n    freq: 5000\n  });\n\n  socket.on('connection', client => {\n    weatherSensor.on('change', () => {\n      client.emit('weather', {\n        temperature: weatherSensor.thermometer.F,\n        pressure: (weatherSensor.barometer.pressure * 10)\n      });\n    });\n  });\n\n  server.listen(80, () => {\n    console.log(`http://${os.networkInterfaces().eth0[0].address}:80`);\n  });\n});\n",
    "sourcePath": "chapter-12/01-bbb-resin-io-weather",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/01-bbb-resin-io-weather",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The weather program and web interface can run locally with virtual APIs. Resin/balena account, Docker deployment, device provisioning and cloud management are outside this browser model.",
    "needs": [
      "BeagleBoneBlack",
      "BMP180",
      "cloud fleet/container"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "beaglebone",
          "x": 25,
          "y": 5
        },
        {
          "id": "weather",
          "type": "weather",
          "x": 485,
          "y": 120,
          "value": 25,
          "settings": {
            "temperature": 25,
            "pressurePa": 101325
          }
        }
      ],
      "wires": [
        {
          "a": "board:3.3V",
          "b": "weather:VCC"
        },
        {
          "a": "board:GND",
          "b": "weather:GND"
        },
        {
          "a": "board:P9_19",
          "b": "weather:SCL"
        },
        {
          "a": "board:P9_20",
          "b": "weather:SDA"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-10-05-kinoma-element-compass",
    "chapter": 10,
    "name": "Kinoma compass web app",
    "title": "Kinoma compass web app",
    "entry": "main.js",
    "platform": "kinoma",
    "environment": "virtual-platform",
    "files": {
      "index.html": "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Live Compass Heading</title>\n    <style>\n      #compass {\n        text-align: center;\n        font-size: 2em;\n        font-family: \"Helvetica\", sans-serif;\n        margin: 2em;\n      }\n    </style>\n    <script>\n      window.addEventListener('load', function () {\n        var ws = new WebSocket('ws://10.0.0.17:80');\n        ws.onmessage = function (message) {\n          var data = JSON.parse(message.data);\n          document.getElementById('direction').innerHTML = data.heading;\n        };\n      });\n    </script>\n  </head>\n  <body>\n    <div id=\"compass\">\n      <label for=\"direction\">Compass Heading</label><div id=\"direction\">...</div>\n    </div>\n  </body>\n</html>\n",
      "main.js": "/* global trace */\nimport Pins from 'pins';\nimport { WebSocketServer } from 'websocket';\n\nvar formatMsg = heading => JSON.stringify({ heading: heading.toFixed(2) });\nvar main = {\n  onLaunch () {\n    Pins.configure({\n      compass: {\n        require: 'HMC5883L',\n        pins: {\n          compass: { sda: 13, clock: 14 },\n          ground: { pin: 12, type: 'Ground' },\n          power: { pin: 11, type: 'Power' }\n        }\n      },\n    }, success => {\n      if (success) {\n        const clients = new Set();\n        const wss = new WebSocketServer(80);\n        let lastResult = 0;\n\n        wss.onStart = client => {\n          clients.add(client);\n          client.send(formatMsg(lastResult));\n          client.onclose = () => clients.remove(client);\n        };\n\n        Pins.repeat('/compass/read', 500, result => {\n          if (Math.abs(result - lastResult) >= 0.5) {\n            clients.forEach(recipient => {\n              recipient.send(formatMsg(result));\n            });\n          }\n          lastResult = result;\n        });\n      } else {\n        trace('Failed to configure\\n');\n      }\n    });\n  }\n};\n\nexport default main;\n"
    },
    "code": "/* global trace */\nimport Pins from 'pins';\nimport { WebSocketServer } from 'websocket';\n\nvar formatMsg = heading => JSON.stringify({ heading: heading.toFixed(2) });\nvar main = {\n  onLaunch () {\n    Pins.configure({\n      compass: {\n        require: 'HMC5883L',\n        pins: {\n          compass: { sda: 13, clock: 14 },\n          ground: { pin: 12, type: 'Ground' },\n          power: { pin: 11, type: 'Power' }\n        }\n      },\n    }, success => {\n      if (success) {\n        const clients = new Set();\n        const wss = new WebSocketServer(80);\n        let lastResult = 0;\n\n        wss.onStart = client => {\n          clients.add(client);\n          client.send(formatMsg(lastResult));\n          client.onclose = () => clients.remove(client);\n        };\n\n        Pins.repeat('/compass/read', 500, result => {\n          if (Math.abs(result - lastResult) >= 0.5) {\n            clients.forEach(recipient => {\n              recipient.send(formatMsg(result));\n            });\n          }\n          lastResult = result;\n        });\n      } else {\n        trace('Failed to configure\\n');\n      }\n    });\n  }\n};\n\nexport default main;\n",
    "sourcePath": "chapter-10/05-kinoma-element-compass",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/05-kinoma-element-compass",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original Kinoma main.js and HTML page display compass heading 123.40 using the explicit virtual Pins/WebSocket adapter. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original main.js and browser compass page use a narrow ESM adaptation and virtual Pins/WebSocket APIs. The GPL-derived HMC5883L helper is linked separately and replaced by an original heading model; native Kinoma CPU/network behavior is not emulated.",
    "needs": [
      "Kinoma Element",
      "HMC5883L"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "kinoma",
          "x": 25,
          "y": 5
        },
        {
          "id": "compass",
          "type": "compass",
          "x": 485,
          "y": 120,
          "value": 90,
          "settings": {
            "heading": 90
          }
        }
      ],
      "wires": [
        {
          "a": "board:11",
          "b": "compass:VCC"
        },
        {
          "a": "board:12",
          "b": "compass:GND"
        },
        {
          "a": "board:13",
          "b": "compass:SDA"
        },
        {
          "a": "board:14",
          "b": "compass:SCL"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check",
    "adaptations": [
      "Only exact Kinoma ESM imports/export are transformed and onLaunch is invoked",
      "An original virtual Pins adapter reads connected compass heading instead of bundling the GPL-derived HMC5883L helper",
      "WebSocket URLs are intercepted into the local browser preview",
      "The original Set.remove typo is narrowly corrected to Set.delete for client disconnects"
    ]
  },
  {
    "id": "book-chapter-12-02-puck-js-web-led-toggle",
    "chapter": 12,
    "name": "Puck.js lights from a web page",
    "title": "Puck.js lights from a web page",
    "entry": "index.js",
    "platform": "puck",
    "environment": "virtual-platform",
    "files": {
      "app/index.html": "<html>\n <head>\n  <title>Puck.js LED Toggle</title>\n  <style>\n    h1 {\n      font-family: \"Helvetica\";\n    }\n    button {\n      display: block;\n      width: 6em;\n      height: 4em;\n      margin: 2em;\n      background-color: #eee;\n      border: 1px solid #ccc;\n      font-size: 1.75em;\n    }\n  </style>\n </head>\n  <body>\n  <h1>Web Bluetooth Puck.js Toggle</h1>\n  <div id=\"message\"></div>\n  <button id=\"onButton\">ON</button>\n  <button id=\"offButton\">OFF</button>\n  <script src=\"https://www.puck-js.com/puck.js\"></script>\n  <script>\n    window.addEventListener('load', () => {\n      if ('bluetooth' in window.navigator) {\n        const onButton = window.document.getElementById('onButton');\n        const offButton = window.document.getElementById('offButton');\n        onButton.addEventListener('click', () => Puck.write('LED1.set();\\n'));\n        offButton.addEventListener('click', () => Puck.write('LED1.reset();\\n'));\n      } else {\n        const mEl = window.document.getElementById('message');\n        mEl.innerHTML = \"Looks like your browser doesn't support Bluetooth!\";\n      }\n    });\n  </script>\n  </body>\n</html>\n",
      "index.js": "const express = require('express');\nconst path    = require('path');\nconst http    = require('http');\n\nconst app    = new express();\nconst server = new http.Server(app);\n\napp.use(express.static(path.join(__dirname, '/app')));\nserver.listen(3000);\n"
    },
    "code": "const express = require('express');\nconst path    = require('path');\nconst http    = require('http');\n\nconst app    = new express();\nconst server = new http.Server(app);\n\napp.use(express.static(path.join(__dirname, '/app')));\nserver.listen(3000);\n",
    "sourcePath": "chapter-12/02-puck-js-web-led-toggle",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/02-puck-js-web-led-toggle",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original Puck browser ON/OFF buttons control virtual LED1 through the explicit connection shim. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original browser buttons send LED1.set/reset through an explicit virtual Puck connection. This demonstrates the JavaScript workflow without a Bluetooth radio, physical pairing or native Puck interpreter.",
    "needs": [
      "Puck.js LED1",
      "browser BLE"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "puck",
          "x": 25,
          "y": 5
        }
      ],
      "wires": []
    },
    "sceneStatus": "prepared-needs-browser-check"
  },
  {
    "id": "book-chapter-12-03-puck-js-doorbell",
    "chapter": 12,
    "name": "Bluetooth doorbell",
    "title": "Bluetooth doorbell",
    "entry": "index.js",
    "platform": "puck",
    "environment": "virtual-platform",
    "files": {
      "app/PuckChime.js": "/* global window, Puck */\nclass Sound {\n  constructor (url) {\n    const AudioContext = window.AudioContext || window.webkitAudioContext;\n    this.url = url;\n    this.context = new AudioContext();\n    this.buffer = null;\n  }\n  load () {\n    return new Promise((resolve, reject) => {\n      if (this.buffer) { resolve(this.buffer); }\n      var request = new window.XMLHttpRequest();\n      request.open('GET', this.url, true);\n      request.responseType = 'arraybuffer';\n      request.onload = () => {\n        this.context.decodeAudioData(request.response, soundBuffer => {\n          this.buffer = soundBuffer;\n          resolve(this.buffer);\n        });\n      };\n      request.send();\n    });\n  }\n  play () {\n    this.load().then(buffer => {\n      const source = this.context.createBufferSource();\n      source.buffer = buffer;\n      source.connect(this.context.destination);\n      source.start(0);\n    });\n  }\n}\n\nclass PuckChime {\n  constructor () {\n    this.connection = null;\n    this.dataBuffer = '';\n    this.sound = new Sound('/chime.mp3');\n  }\n\n  init () {\n    return this.connect().then(() => {\n      return new Promise((resolve, reject) => {\n        this.reset()\n        .then(this.watchButton.bind(this))\n        .then(() => {\n          this.chime();\n          resolve();\n        });\n      });\n    });\n  }\n\n  connect () {\n    return new Promise ((resolve, reject) => {\n      Puck.connect(connection => {\n        this.connection = connection;\n        this.connection.on('data', this.parseData.bind(this));\n        resolve(this.connection);\n      });\n    });\n  }\n\n  send (cmd) {\n    cmd = `\\x10${cmd}\\n`;\n    return new Promise ((resolve, reject) => {\n      this.connection.write(cmd, () => { resolve(cmd); });\n    });\n  }\n\n  reset () {\n    return new Promise((resolve, reject) => {\n      this.send('reset()').then(() => { setTimeout(resolve, 1500); });\n    });\n  }\n\n  watchButton () {\n    const cb = \"function() { Bluetooth.println('CHIME'); LED1.set(); setTimeout(() => LED1.reset(), 250);}\";\n    const opts = \"{repeat:true,debounce:250,edge:'rising'}\";\n    const cmd = `setWatch(${cb},BTN,${opts});`;\n    return this.send(cmd);\n  }\n\n  parseData (data) {\n    this.dataBuffer += data;\n    var cmdEndIndex = this.dataBuffer.indexOf('\\n');\n    while (~cmdEndIndex) {\n      var cmd = this.dataBuffer.substr(0, cmdEndIndex).replace(/\\W/g, '');\n      this.parseCommand(cmd);\n      this.dataBuffer = this.dataBuffer.substr(cmdEndIndex + 1);\n      cmdEndIndex = this.dataBuffer.indexOf('\\n');\n    }\n  }\n\n  parseCommand (cmd) {\n    if (cmd.match('CHIME')) {\n      this.chime();\n    }\n  }\n\n  chime () {\n    window.document.body.classList.add('ding');\n    this.sound.play();\n    window.setTimeout(() => {\n      window.document.body.classList.remove('ding');\n    }, 500);\n  }\n}\n",
      "app/index.html": "<html>\n <head>\n  <title>Puck.js Remote Chime</title>\n  <style>\n    body {\n      max-width: 90%;\n      font-family: \"Times New Roman\";\n      margin: 1em auto;\n      color: #111;\n      background-color: transparent;\n      transition: background-color 0.5s ease-in-out;\n    }\n    .ding {\n      background-color: #e60a62;\n      transition: all 0.1s ease-in-out;\n    }\n    button {\n      width: 100%;\n      height: 100%;\n      border: 5px solid #e60a62;\n      font-family: \"Times New Roman\";\n      text-transform: lowercase;\n      font-variant: small-caps;\n      background-color: transparent;\n      font-size: 3em;\n      font-weight: 600;\n      cursor: pointer;\n    }\n    button:hover {\n      color: #fff;\n      border-color: #b5084d;\n      background-color: #f62c7d;\n    }\n    .active {\n      opacity: 0;\n      transition: all 1s;\n    }\n  </style>\n </head>\n  <body>\n    <button id=\"goButton\">Turn it on</button>\n    <script src=\"https://www.puck-js.com/puck.js\"></script>\n    <script src=\"PuckChime.js\"></script>\n    <script>\n    window.addEventListener('load', () => {\n      const onButton = window.document.getElementById('goButton');\n      onButton.addEventListener('click', function () {\n        var chime = new PuckChime();\n        chime.init().then(() => {\n          onButton.classList.add('active');\n        });\n      });\n    });\n    </script>\n  </body>\n</html>\n",
      "index.js": "const express = require('express');\nconst path    = require('path');\nconst http    = require('http');\n\nconst app    = new express();\nconst server = new http.Server(app);\n\napp.use(express.static(path.join(__dirname, '/app')));\nserver.listen(3000);\n"
    },
    "code": "const express = require('express');\nconst path    = require('path');\nconst http    = require('http');\n\nconst app    = new express();\nconst server = new http.Server(app);\n\napp.use(express.static(path.join(__dirname, '/app')));\nserver.listen(3000);\n",
    "sourcePath": "chapter-12/03-puck-js-doorbell",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/03-puck-js-doorbell",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original doorbell HTML and PuckChime.js receive virtual BTN/CHIME text, emit a 250 ms LED1 pulse and load the inlined original audio asset in a real browser. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original PuckChime.js sends reset/button-watch code through a virtual Puck connection. BTN rising events emit CHIME text and LED flashes. Browser sound uses the bundled example audio; no Bluetooth radio or pairing is emulated.",
    "needs": [
      "Puck.js BTN/LED1",
      "browser audio/BLE"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "puck",
          "x": 25,
          "y": 5
        }
      ],
      "wires": []
    },
    "sceneStatus": "prepared-needs-browser-check",
    "assets": {
      "/app/chime.mp3": {
        "mimeType": "audio/mpeg",
        "base64": "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Kaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+pIARINcD/AAAGkHAAAAAAANIOAAAAAAAaQAAAAAAAA0gAAAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
      }
    }
  },
  {
    "id": "book-chapter-11-01-rpi3-blink-sysfs",
    "chapter": 11,
    "name": "Pi GPIO from a shell",
    "title": "Pi GPIO from a shell",
    "entry": "blink.sh",
    "platform": "raspi",
    "environment": "virtual-platform",
    "files": {
      "blink.sh": "#! /bin/bash\n\necho \"4\" > /sys/class/gpio/export\necho \"out\" > /sys/class/gpio/gpio4/direction\necho \"1\" > /sys/class/gpio/gpio4/value\nsleep 1\necho \"0\" > /sys/class/gpio/gpio4/value\nsleep 1\necho \"4\" > /sys/class/gpio/unexport\n"
    },
    "code": "#! /bin/bash\n\necho \"4\" > /sys/class/gpio/export\necho \"out\" > /sys/class/gpio/gpio4/direction\necho \"1\" > /sys/class/gpio/gpio4/value\nsleep 1\necho \"0\" > /sys/class/gpio/gpio4/value\nsleep 1\necho \"4\" > /sys/class/gpio/unexport\n",
    "sourcePath": "chapter-11/01-rpi3-blink-sysfs",
    "sourceUrl": "https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/01-rpi3-blink-sysfs",
    "license": "MIT · Copyright 2017 Lyza Gardner",
    "status": "runtime-checked",
    "note": "Original blink.sh is checked in a browser worker: GPIO4 export, output direction, HIGH/LOW writes with sleep, and unexport use the bounded virtual shell/filesystem. No host shell or native OS is accessed. Original blink.sh uses a bounded virtual shell for echo redirection into the GPIO filesystem and sleep. Wire an LED and a 330 Ω resistor to physical header 7/BCM GPIO4. This runs entirely in the browser; it does not execute Bash or access your computer/Linux kernel.",
    "needs": [
      "RaspberryPi3",
      "LED BCM4 physical7"
    ],
    "scene": {
      "parts": [
        {
          "id": "board",
          "type": "raspi",
          "x": 25,
          "y": 5
        },
        {
          "id": "light",
          "type": "led",
          "x": 540,
          "y": 120
        },
        {
          "id": "led-resistor",
          "type": "resistor",
          "x": 540,
          "y": 240,
          "value": 330
        }
      ],
      "wires": [
        {
          "a": "board:GPIO4",
          "b": "led-resistor:1"
        },
        {
          "a": "led-resistor:2",
          "b": "light:A"
        },
        {
          "a": "light:C",
          "b": "board:GND"
        }
      ]
    },
    "sceneStatus": "prepared-needs-browser-check"
  }
];

export const bookSourceLicense = "MIT License\n\nCopyright (c) 2017 Lyza Gardner\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n";
