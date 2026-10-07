# Browser runtime

The Uno mode runs unmodified Johnny-Five 2.1.0, Firmata-IO 2.3.0 and AVR8js
0.21.1. The AVR executes pinned Firmata 2.5.9 StandardFirmataPlus firmware.
GPIO, ADC, PWM, Servo timers, USART, SoftwareSerial and TWI use the simulated
chip. Original educational models implement the attached peripherals; they
do not invent Johnny-Five sensor events.

Tessel, Raspberry Pi, BeagleBone, Espruino Pico, Kinoma and Puck modes are virtual
API adapters. They preserve the selected book APIs and native pin names, but
do not emulate those CPUs, Linux, native addons, cloud deployment or radios.

## Worker protocol

Create a fresh worker for each execution. Terminate it to stop all code and
timers. Incoming messages:

- `run`: `{code?, files?, entry:'/index.js', platform:'uno', peripherals?, fixtures?}`.
  File names resolve from `/`. `code` overrides the entry file when present.
  `assets` holds binary project resources as `{path:{mimeType,base64}}`.
  Include initial peripheral wiring in this message: Pico's display connects
  during script startup. Platforms: `uno`, `tessel`, `raspi`, `beaglebone`,
  `pico`, `kinoma`, `puck`.
- `input`: `{pin, value}`; Uno digital pins 0–19 and analog names A0–A5.
  Virtual platforms accept their snapshot's numeric pin indices or native
  labels. Virtual inputs never overwrite OUTPUT/PWM/SERVO pins.
- `board-input`: `{pin:'BTN', value:0|1}` for Pico/Puck's onboard button.
- `peripherals`: `{items:[{id,type,powered,pins,levels?}]}` updates wiring.
- `device-input`: `{id, values}` updates sensor controls. Weather accepts
  temperature Celsius and `pressurePa`. Gesture accepts direction and an
  incrementing `sequence` so repeating the same direction triggers again.
- `key`: `{character, key:{name,ctrl?}}` forwards a terminal keypress.
- `eval`: `{id,code}` evaluates a REPL expression against `board.repl.inject`
  objects and returns `eval-result` with the same id and value/error.
- `shell`: `{id,code}` runs the bounded Pi/BBB virtual GPIO shell and returns
  one `eval-result`. Shell entries ending `.sh` also execute directly on Run.
- `snapshot` requests an immediate `pins` message.
- `web-client`: `{action:'connect'|'event'|'disconnect',clientId,event?,args?}`
  relays a dashboard client into the selected in-memory server bridge. Kinoma
  uses `raw-connect`/`raw-event`; Puck uses `puck-connect`/`puck-write` with
  `code` and `requestId`.

Outgoing messages include `status`, `console`, `repl-context`, `eval-result`,
`network`, `pins`, `platform-output`, `web-preview` and `web-socket`.

Snapshots contain `digital`, `pwm`, `servo`, `modes`, `analog`, `components`
and `platform`. PWM is normalized 0–1 and Servo positions are degrees.
Virtual snapshots additionally include `pinMap`, `ioPins`, `resolution` and
`virtual:true`. Uno snapshots include elapsed emulated time `simTimeMs`.
`tones[pin]` exposes Johnny-Five's selected tone frequency/duration for audio;
real Johnny-Five NanoTimer still sends the output GPIO commands.

## Models and compatibility

Models: HD44780 16×2 parallel LCD, 74HC595 shift register, HMC5883L compass,
ADXL345 accelerometer, BMP180 calibration/conversion registers, JHD1313M1
LCD/backlight, NMEA GPS bytes through real AVR SoftwareSerial, and APDS9960
gesture configuration/status/FIFO registers with an active-low interrupt.
Pico's selected BMP085 and Nokia Graphics APIs use the same sensor controls
and an original small bitmap font; that font is an explicit approximation.

Two narrow book-era compatibility wrappers support named pin objects passed
to Board.Component and ES5 `Collection.call` constructors. They delegate to
the actual modern Johnny-Five implementations. Board construction supplies
the selected virtual IO automatically. Browser REPL and keyboard adapters
replace Node's terminal facilities.

The Kinoma mode implements the book's selected Pins.configure/repeat and
WebSocketServer APIs. Its original heading adapter replaces the explicitly
GPL-derived helper. The entry loader converts the two known ESM imports and
default export, calls onLaunch and corrects the book's Set.remove typo to
Set.delete. This is not a general ESM loader or Kinoma firmware emulator.
Puck mode implements LED set/reset, BTN watches, debounce, reset and virtual
Bluetooth serial text. The original web dashboard receives a virtual Puck
client library; it neither pairs with nor accesses an actual Bluetooth radio.

The `request` adapter performs browser `fetch` for ordinary URLs, subject to
normal browser CORS. The retired Dark Sky URL may use an explicit
`fixtures.weather` forecast; its `network` message identifies fixture mode.

The web adapter implements only the weather examples' `express.static`,
`http.Server.listen` and Socket.IO connection/event API. It embeds original
HTML and local CSS into `web-preview.html`, replacing the Socket.IO browser
script with an in-memory relay. It also embeds local project scripts and
audio assets, and supplies the selected Kinoma/Puck browser clients.
A sandboxed iframe sends `lab-web-client`
messages to its parent; the parent relays them to the worker as `web-client`.
The parent relays worker `web-socket` messages into that iframe. It opens no
TCP socket, does not implement a general Node server and does not deploy.

The original shell interpreter supports project `.sh` files, variables,
echo/redirection, GPIO export/direction/value, cat/ls/pwd/cd, sleep and
cancellable while loops. Paths are virtual and access is limited to project
files and modeled sysfs. It rejects host commands, installers, pipes and
command substitution; no operating-system shell is invoked.

## Firmware/build

Firmware uses Arduino AVR Boards 1.8.6, avr-gcc
7.3.0-atmel3.6.1-arduino7, Servo 1.2.2 and Firmata 2.5.9, compiled for
`arduino:avr:uno` with `build.extra_flags=-DSERIAL_RX_BUFFER_SIZE=256`.
The larger RX buffer accommodates concurrent I2C startup traffic.
The virtual USB transport queues unread data and leaves a 2ms gap between
complete sysex requests so the AVR's Wire/Serial handlers can service them.
Firmware HEX SHA256:
`23a039923e874979f48630499ed365c246af2975012840a8127869627a79159e`.
Flash 15,828 bytes; static RAM 1,522 bytes. Matching firmware sources,
licenses and rebuild instructions are in `dist/firmware/`.

Run `npm run build:runtime` from the project root. Browserify supplies the
required JS builtins; the build binds package `setImmediate` calls to a
MessageChannel macrotask scheduler, allowing real NanoTimer and AVR execution
to share worker time. The build writes the minified worker and third-party
license notices. It does not publish anything.
