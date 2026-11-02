# Little Bunny Circuit Lab

A browser workbench for following **JavaScript on Things** without a physical board. Start with an unwired Arduino Uno and an empty code editor, choose components, connect pins, and write your own program. Examples are optional and live in **Help & book companion**.

The workbench can run locally or as a hosted static website. The same browser runtime is used in both.

## Open locally

On this Mac, double-click **Start Local Lab.command**. It opens the workbench at `http://127.0.0.1:4178/`. Keep its terminal window open while using the lab; Ctrl+C stops the local server.

Alternatively, run `npm start` from the project directory. The prebuilt `dist` folder needs only a static web server. Learners do not need Node.js, npm, a serial connection, or a compilation service to use the browser lab after its assets load. The local launcher uses Python 3, already available on this development machine.

## Work alongside the book

1. Choose the book’s board. Arduino Uno is the default; the other boards are labelled virtual API models.
2. Choose a part from the searchable component library, then click the canvas to place it, or drag it straight from the library. Move parts by their body or name. Click two gold pins, drag between pins, or use the larger targets in the Pins tab to make a wire. The Details tab holds properties and readings; Undo/Redo covers circuit edits.
3. Write the code. Add local files such as `Rover.js`, and choose the program’s entry file. HTML/CSS, JSON and the selected virtual-shell exercise are also editable.
4. Run the program. The interactive console evaluates JavaScript for objects exposed with `board.repl.inject`. Control keys send arrow/space/Ctrl+C events to rover programs. The virtual Pi/BeagleBone console also has a bounded GPIO shell.
5. Experiment. Change light, temperature, pressure, acceleration, GPS position or gesture controls. LCDs, motors, LEDs and the web-page preview respond to the wired circuit.

Download/Open save complete JSON projects. Share includes files, assets, components and wiring in a link. Projects are saved on this device, and imported/shared programs wait for Run. Loading an example or changing the board can be undone. A first visit opens the empty workbench, rather than a prepared lesson.

The canvas extends in every direction. Drag empty space to pan, use +/− or Ctrl/⌘-scroll to zoom, and choose Fit (F) to see the whole circuit. If all parts are off screen, Back to circuit brings them into view. Focus circuit gives you more building space while keeping Run and Stop available.

## Book coverage and limits

The guide inventories all **12 chapters and 50 official source projects**. Browser execution checks cover **49 projects: 48 JavaScript projects and the GPIO shell script**. The 22 Arduino JavaScript projects use actual Johnny-Five with emulated AVR/Firmata. Other board, network and Bluetooth programs use explicit browser API adapters.

**Program checked** means the source and an observable result passed the recorded browser checks. It does not mean every physical, installation, radio or deployment instruction in the chapter is reproduced. All 49 optional prepared circuits passed 475 model checks for endpoints, source pins, power/bus routing, resistor/driver wiring and layout bounds. These are separate from the program checks; the reader can always build their own circuit from the book. See [BOOK-COVERAGE.md](BOOK-COVERAGE.md) and Help for details per exercise.

The introductory Arduino C++ `.ino` project needs annotation removal and a C++ compiler; it is linked as an external setup workflow. The original repository includes `<1>`–`<4>` book callouts that are not valid C++. This JavaScript lab does not provide arbitrary Arduino C++ compilation.

Tessel, Pico, Pi, BeagleBone, Kinoma and Puck are selected **API models**, not CPU/OS/radio emulators. The Pi/BeagleBone shell models the book’s GPIO files and commands; it cannot access the host filesystem or install packages. Web previews simulate the selected Express/HTTP/Socket.IO or WebSocket APIs inside a sandboxed iframe; they open no TCP listener. Puck connections are virtual and use no physical Bluetooth chooser. Actual cloud deployment, board provisioning, native setup and radio pairing remain external book workflows.

The book’s Dark Sky service has retired. Its Weatherball example uses an explicitly labelled sample forecast. Browser `request` uses fetch for other URLs, subject to CORS. Kinoma’s original GPL-derived helper is not bundled; its selected behavior is supplied by an original, labelled browser model.

The electrical model calculates introductory DC resistor networks, breadboard connectivity, voltage dividers, LED current, MOSFET/H-bridge signals and selected optocoupler behavior. It does not model damage, calibrated tolerances, inductive/capacitive transients, mains electricity or an RF outlet’s radio link. It is not an electrical safety tool or a general Node.js terminal.

## Runtime

Uno: Johnny-Five 2.1.0 → Firmata-IO 2.3.0 → in-memory serial → AVR8js 0.21.1 running StandardFirmataPlus 2.5.9 on an ATmega328P. Real GPIO, PWM, ADC, USART/SoftwareSerial and TWI drive original peripheral models. Wokwi elements and original SVG models render components. Code runs in a fresh worker; Stop terminates it, including a stuck program.

Other platforms preserve selected source APIs and their native pin maps. Compatibility wrappers handle two book-era Johnny-Five constructor patterns. Espruino graphics use an original approximate font; Kinoma ESM and its `Set.remove` typo receive narrow documented adaptations. See [the runtime documentation](src/runtime/README.md) for the message protocol and limits.

## Validation

Recorded checks include the 22 original Uno programs; full LCD countdown/DONE/piezo; rover local modules and keys; GPS; simultaneous I²C sensor/LCD/shake behavior; native board pin maps and APIs; APDS plugins; five original weather pages; Kinoma compass page; Puck toggle/doorbell/audio; and the original GPIO shell script. The model suite adds 83 circuit assertions, 23 SVG/pin checks, 61 shell assertions and 475 prepared-circuit checks.

The workbench was also checked through its visible controls: blank startup, adding and wiring an LED/resistor, writing code, REPL on/off, multi-file modules, book importing, sensor editing and page-preview messages. Coverage data separates source execution checks from circuit/template review.

## Rebuild and redistribute

Install a recent Node.js release, then run `npm ci --ignore-scripts` and `npm run build`. This builds the static frontend, worker and notices; it never publishes. `python3 scripts/package-source.py` packages editable source and prebuilt assets into `dist/source.zip`.

Original app code is MIT licensed. The author’s example code and sound retain their MIT notice (Copyright 2017 Lyza Gardner). The book’s chapter text and illustrations are not included. Firmware and dependencies retain their own licenses: see `THIRD_PARTY_NOTICES.txt`, `dist/firmware/BUILD.md` and `dist/firmware/source.tar.gz`. Matching firmware source and build flags are included.

Sources: [Manning’s book](https://www.manning.com/books/javascript-on-things), [official example repository](https://github.com/lyzadanger/javascript-on-things) pinned to `6f7e825c05933d5658b58c622351d4f9c43d61d5`, [Johnny-Five](https://github.com/rwaldron/johnny-five), [Firmata](https://github.com/firmata/arduino), [AVR8js](https://github.com/wokwi/avr8js), [Wokwi elements](https://github.com/wokwi/wokwi-elements), [CodeMirror](https://codemirror.net/).

The lab is independent and not affiliated with Manning, Arduino, Wokwi or Velxio.
