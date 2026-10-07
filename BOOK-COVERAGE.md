# JavaScript on Things — coverage

Coverage revision, 2026-10-07.

The guide covers all 12 chapters and inventories all 50 official source projects. 49 projects are importable and have recorded browser program checks (48 JavaScript projects plus the GPIO shell script). The introductory Arduino C++ sketch remains external.

Program checks cover code and observable output using the selected runtime or labelled browser API adapter. All 49 optional prepared circuits passed 475 connection/model/layout checks. This is a separate review; this does not certify every physical, radio, setup or cloud instruction in the book.

## 1. Bringing JavaScript and hardware together

Hardware, JavaScript and toolkit concepts. Build circuits and write your own code in the blank lab; the chapter has no runnable source project.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-1) · [Official source](https://github.com/lyzadanger/javascript-on-things)

## 2. Embarking on hardware with Arduino

Original Johnny-Five blink and stop programs run on the AVR Uno simulation. The optional Arduino C++ sketch remains linked; editing/uploading C++ is outside this JavaScript runtime.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-2) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Arduino C++: blink an LED](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/01-arduino-led-blink) | external-workflow | Optional native Arduino C++ setup sketch. The <1>–<4> inline book annotations must be removed before native compilation. This .ino file cannot execute in the JavaScript editor; the following Johnny-Five blink program demonstrates the same LED behavior. |
| [Johnny-Five: hello, LED](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/02-hello-world-johnny-five) | Program checked | Pin 13 changes HIGH and LOW after board ready. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Stop after counting blinks](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-02/03-hello-world-stop) | Program checked | Ten callbacks observed; no extra callback after stopping. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |

## 3. How to build circuits

Breadboard connections, DC resistance, voltage/current measurements, and series/parallel circuits have circuit models. Transients, component damage and every real-world electrical effect are outside the model.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-3) · [Official source](https://github.com/lyzadanger/javascript-on-things)

## 4. Sensors and input

Original photoresistor, TMP36, threshold, interactive console and push-button programs have browser execution checks. Circuit input controls support working along with the book.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-4) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Read a photoresistor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/01-photoresistor) | Program checked | Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Sensor change threshold](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/02-photoresistor-threshold) | Program checked | Analog values 300 and 700 reach exact Sensor data/change code. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Read a TMP36 thermometer](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/03-temperature) | Program checked | ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Inspect a thermometer in the console](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/04-temperature-repl) | Program checked | ADC value 154 gives about 25 °C; REPL property checked where required. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Read a push button](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-04/05-button) | Program checked | Active-high D2 press invokes original down handler. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |

## 5. Output: making things happen

Original LED, brightness animation, nightlight, weather fixture and LCD timer programs have browser checks. The retired Dark Sky request uses explicitly labelled sample data. Button-driven 00:01 countdown, DONE display and piezo tone are checked. Prepared circuits also have separate connection and layout model checks.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-5) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Experiment with two LEDs](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/01-experiment-led) | Program checked | Injected LED1 D2 on and LED2 D3 brightness(128) produce real pin signals. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Animate LED brightness](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/02-animate-led) | Program checked | Original Animation generates varying D3 PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [A simple LED timer](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/03-timer-led-simple) | Program checked | Original 10-second timeout begins real PWM pulse. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Automatic nightlight](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/04-nightlight) | Program checked | Original calibration/scale/bitwise code lights D3 after bright-to-dark input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Weather ball](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/05-weatherball) | Program checked | Explicit retired-DarkSky fixture produces red RGB PWM. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [LCD timer](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/06-timer-lcd) | Program checked | Original physical buttons select 00:01 and Go reaches DONE; pause works; completion LED6 pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [LCD timer with a chime](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-05/07-timer-lcd-piezo) | Program checked | Original physical buttons select 00:01 and Go reaches DONE; pause works; piezo pin 6 emits a tone. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |

## 6. Output: making things move

Original motor, servo and multi-file rover programs have browser checks with keyboard input and H-bridge models. These cover commands and signals; complete mechanical movement and every motor wiring detail need review.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-6) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Control a DC motor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/01-motor-basic) | Program checked | Motor start(128)/stop() via original REPL yields PWM duty about 0.5/0. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Position a servo](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/02-servo-basic) | Program checked | Original REPL servo.to(120) produces a 120 degree command and real pulses. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Test a pair of motors](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/03-motor-test) | Program checked | Original two-motor code configures D11/D5 PWM and D12/D4 directions; the injected motors collection responds to motors.forward(128) in the console. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Keyboard-controlled rover](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-06/04-rover) | Program checked | Original two-motor code configures D11/D5 PWM and D12/D4 directions; keyboard up reaches Rover.js. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |

## 7. Serial communication

Original GPS, compass, I2C LCD and multisensor programs have browser checks through SoftwareSerial/register models. Virtual sensor controls supply readings; electrical timing is approximate.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-7) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Read a GPS receiver](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/01-gps) | Program checked | Original GPS and REPL observe latitude 37.7749 through real SoftwareSerial. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Read a compass](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/02-compass) | Program checked | Original compass change handler logs easterly bearing after a 90 degree device input. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Show a heading on an LCD](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/03-compass-lcd) | Program checked | Original compass/LCD project displays declination-corrected 76 degrees. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |
| [Shake-to-change sensor display](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-07/04-multi-sensor) | Program checked | Original multisensor source displays 77 °F and pressure then switches to heading on shake. Program execution checked in a real browser worker; prepared connections and layout bounds are model-reviewed separately. This does not certify full physical behavior. |

## 8. Projects without wires

Tessel LED, GPIO, weather and rover sources are available through labelled virtual APIs; selected web-server APIs use an in-memory preview. Wireless configuration and native Tessel hardware execution remain external.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-8) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Tessel onboard lights](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/01-hello-tessel) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard L2 and L3 alternate. Native CPU timing and wireless deployment are not emulated. |
| [Johnny-Five on Tessel](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/02-t2-blink) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Add an LED and resistor to Tessel A0 and GND as shown in the book. A0 means digital port A pin 0 here. |
| [Tessel weather sensor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/03-t2-bmp180) | Program checked | Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The BMP180 reads from a powered circuit on Tessel I2C. Tessel APIs are adapted; native ARM execution is not emulated. |
| [Tessel weather web app](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/04-t2-weather) | Program checked | Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original weather dashboard uses an in-memory Express/HTTP/Socket.IO preview and a wired BMP180. There is no native TCP listener or wireless deployment. |
| [Tessel rover](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-08/05-t2-rover) | Program checked | Original Rover.js receives up/space keyboard commands and configures Tessel A5/B5 PWM Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original index.js and Rover.js use Tessel A/B GPIO and keyboard input. Confirm H-bridge wiring and motor direction in the circuit. |

## 9. Building your own thing

Custom multi-file components, APDS9960 registers/FIFO/interrupts and virtual optocoupler/remote channels are available. Original gesture-switch source has browser checks; complete prepared circuit behavior needs review; physical outlets and mains are outside the circuit model.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-9) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Prototype a remote switch](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/01-prototype-switch) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Use turnOn() and turnOff() in the interactive console. GPIO pulses are checked; connect the optocoupler signal model to inspect isolated output. Physical remote outlets and mains behavior are outside this circuit model. |
| [Create a RemoteSwitch component](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/02-remote-switch) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Original RemoteSwitch.js is loaded as a local module. Its named on/off pins use the virtual optocoupler/remote circuit; no real outlet or mains behavior is simulated. |
| [Identify a gesture sensor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/03-gesture-i2c-test) | Program checked | Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original program reads APDS9960 device ID 0xAB from a powered I2C model. |
| [Write a gesture driver](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/04-gesture) | Program checked | Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original APDS9960.js reads register/FIFO data and active-low A2 interrupts. Direction buttons supply gesture samples to the connected sensor. |
| [Gesture-controlled remote switches](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-09/05-gesture-switches) | Program checked | Exact original program checked in a browser worker against the APDS9960 register/FIFO/interrupt model and virtual GPIO. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original gesture driver and RemoteSwitch modules control three virtual remote channels. Check optocoupler pairs and gesture-to-channel behavior; no mains simulation. |

## 10. JavaScript and constrained hardware

Pico LED, BMP180 and graphical LCD programs have browser checks through selected Espruino API adaptations. Kinoma main/browser source has virtual Pins/WebSocket APIs; its GPL-derived compass helper is replaced by an original model. Kinoma browser compass messages are checked. Native interpreter, CPU, SPI timing and network behavior are outside these adaptations.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-10) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Espruino Pico lights](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/01-pico-led-blink) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Onboard LED1 and LED2 alternate. This provides a selected Espruino API adaptation, not its native JavaScript interpreter. |
| [Pico weather sensor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/02-pico-bmp180) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire BMP180 power, GND, B6/SCL and B7/SDA. The virtual BMP085 module supplies readings from your connected sensor controls. |
| [Pico graphical LCD timer](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/03-pico-nokia-5110-timer) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire Nokia5110 SCK=B3, MOSI=B5, DC=B13, CE=B14, RST=B15. Press the Pico BTN to start. Selected Graphics calls are adapted; SPI electrical timing is not emulated. |
| [Pico graphical weather display](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/04-pico-weather) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire both BMP180 and Nokia5110 as shown in the book. The displayed raster font approximates Espruino vector text. |
| [Kinoma compass web app](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-10/05-kinoma-element-compass) | Program checked | Original Kinoma main.js and HTML page display compass heading 123.40 using the explicit virtual Pins/WebSocket adapter. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original main.js and browser compass page use a narrow ESM adaptation and virtual Pins/WebSocket APIs. The GPL-derived HMC5883L helper is linked separately and replaced by an original heading model; native Kinoma CPU/network behavior is not emulated. |

## 11. Building with Node.js and tiny computers

Pi/BeagleBone GPIO, virtual sysfs files, selected wiring-pi/Raspi/BeagleBone APIs and weather web previews are available. The original shell blink uses a bounded virtual echo/sleep/GPIO-filesystem interpreter. Native Bash, OS/addons and actual TCP networking remain external.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-11) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Pi GPIO from a shell](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/01-rpi3-blink-sysfs) | Program checked | Original blink.sh is checked in a browser worker: GPIO4 export, output direction, HIGH/LOW writes with sleep, and unexport use the bounded virtual shell/filesystem. No host shell or native OS is accessed. Original blink.sh uses a bounded virtual shell for echo redirection into the GPIO filesystem and sleep. Wire an LED and a 330 Ω resistor to physical header 7/BCM GPIO4. This runs entirely in the browser; it does not execute Bash or access your computer/Linux kernel. |
| [Pi GPIO through virtual files](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/02-rpi3-blink-sysfs-js) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7 (BCM GPIO4). The file paths refer to a virtual GPIO filesystem, not your computer or a Linux kernel. |
| [Pi GPIO with wiring-pi](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/03-rpi3-blink-wiring-pi) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. The wiring-pi module here is a virtual addon; wiringPi 7 maps to BCM4. |
| [Johnny-Five on Pi](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/04-rpi3-blink-j5) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. Wire an LED and resistor to physical header 7. Johnny-Five drives a virtual Raspi IO adapter. Numeric 7 is a wiringPi pin number. |
| [Pi weather sensor](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/05-rpi3-bmp180) | Program checked | Original BMP180 thermometer change handler logs 77 °F Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. A genuine Johnny-Five BMP180 driver reads a powered I2C device through the virtual Raspi IO adapter. Native Linux is not emulated. |
| [Pi weather web app](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/06-rpi3-weather) | Program checked | Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual Raspi IO and selected in-memory server APIs. No native network listener is opened. |
| [Uno weather web app](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/07-arduino-uno-weather) | Program checked | Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original Johnny-Five runs on the AVR Uno simulation, with the web dashboard through selected in-memory server APIs. No native TCP server is opened. |
| [Johnny-Five on BeagleBone](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/08-bbb-blink-j5) | Program checked | Exact original program checked in a real browser worker with the labelled virtual platform APIs. Prepared circuits have separate connection/model checks. Complete physical lesson behavior is outside this browser model. The BeagleBone default onboard LED is USR3. GPIO APIs are adapted; the native operating system is not emulated. |
| [BeagleBone weather web app](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-11/09-bbb-weather) | Program checked | Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The original dashboard runs with virtual BeagleBone IO and selected in-memory server APIs. Native Linux and TCP are not emulated. |

## 12. In the cloud, in the browser, and beyond

The cloud weather program has a virtual local-server path; Puck LED/doorbell sources have explicit virtual Bluetooth serial models. Cloud provisioning, Docker deployment, physical Bluetooth pairing and radios remain external. Original Puck web button/doorbell flows, LED pulse, CHIME parsing and bundled audio loading have browser checks; complete prepared wiring remains a separate review.

[Read chapter](https://livebook.manning.com/book/javascript-on-things/chapter-12) · [Official source](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12)

| Exercise | Program status | Scope / adaptation |
| --- | --- | --- |
| [Cloud-managed weather station](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/01-bbb-resin-io-weather) | Program checked | Original multi-file weather dashboard displays 77.00 F and 1013.25 mbar in the browser iframe through the in-memory server API bridge. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. The weather program and web interface can run locally with virtual APIs. Resin/balena account, Docker deployment, device provisioning and cloud management are outside this browser model. |
| [Puck.js lights from a web page](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/02-puck-js-web-led-toggle) | Program checked | Original Puck browser ON/OFF buttons control virtual LED1 through the explicit connection shim. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original browser buttons send LED1.set/reset through an explicit virtual Puck connection. This demonstrates the JavaScript workflow without a Bluetooth radio, physical pairing or native Puck interpreter. |
| [Bluetooth doorbell](https://github.com/lyzadanger/javascript-on-things/tree/master/chapter-12/03-puck-js-doorbell) | Program checked | Original doorbell HTML and PuckChime.js receive virtual BTN/CHIME text, emit a 250 ms LED1 pulse and load the inlined original audio asset in a real browser. Prepared circuits have separate connection/model checks; hardware and native deployment remain external workflows. Original PuckChime.js sends reset/button-watch code through a virtual Puck connection. BTN rising events emit CHIME text and LED flashes. Browser sound uses the bundled example audio; no Bluetooth radio or pairing is emulated. |

## How the book maps to this workbench

Uno code uses real Johnny-Five with AVR/Firmata emulation. Other boards use their printed native pin names and selected browser API models. Ordinary book project code is preserved where possible; native libraries, HTTP/socket connections, embedded runtimes, Bluetooth and Linux GPIO setup receive explicit adapters. Kinoma’s ESM/Set.remove adjustment and original replacement driver are documented in the runtime README.

Cloud deployment, board provisioning, hardware installation, actual radios/physical pairing and arbitrary C++ compilation remain external. Dark Sky has retired, so Weatherball uses an explicit forecast fixture. Introductory electrical measurements are DC approximations, without damage, mains or transient simulation.

The author’s code and sound use the included MIT notice. Chapter text and illustrations stay in the book. Source audit pinned to commit 6f7e825c05933d5658b58c622351d4f9c43d61d5.
