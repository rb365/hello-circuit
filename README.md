# Little Circuit Lab

Write Johnny-Five JavaScript and experiment with a virtual Arduino Uno in one browser page. Code and circuit appear side by side. No physical board is required.

The app includes six original experiments: blinking an LED, counting blinks, reading a button, fading an LED, reading a dial, and moving a servo. You can edit the JavaScript, add parts, drag components, and connect their pins.

## Try it

1. Open the published lab in a recent browser.
2. Choose an experiment and click **Run code**.
3. Edit the code, then run it again. Press **Stop** to terminate the program and reset the virtual board.
4. Click two gold pins to connect them. Click a wire to remove it. Drag a component by its name.

**Share project** shows a link containing the current code, components, and connections. Opening that link displays the project and waits for the recipient to click Run. **Download project** and **Open project** save and restore JSON project files. The current project is also saved in your browser on that device.

## How it works

The actual Johnny-Five library runs in a Web Worker with a small browser adapter. Its Firmata messages travel through an in-memory serial connection to an ATmega328P emulated by AVR8js. The emulated processor runs precompiled StandardFirmata firmware. Pin states drive Wokwi's visual components.

The Worker keeps the JavaScript execution separate from the page interface. It is terminated when you press Stop. This is a JavaScript learning environment; it does not provide a Node.js terminal, native modules, or arbitrary npm package installation.

AVR8js is also the Arduino processor engine used by Velxio. This lab has its own interface and circuit model; it does not embed the full Velxio application.

## Current scope

- One virtual Arduino Uno.
- LEDs and resistors, buttons, potentiometers, and servos.
- Johnny-Five board initialization, digital input/output, PWM brightness, analog readings, and servo commands.
- Local execution after the app's assets load; no compilation server or board connection is needed.

The circuit model follows connections and pin behavior. It does not calculate electrical current, resistor power, component damage, or every physical effect. A resistor is treated as a conductive connection for these introductory experiments. Other Johnny-Five devices may require additional firmware or component models.

The examples were written for this project. [JavaScript on Things, chapter 2](https://livebook.manning.com/book/javascript-on-things/chapter-2) is linked as a reading companion. The lab is independent and is not affiliated with Manning, Arduino, Wokwi, or Velxio.

## Local hosting

Serve the `dist` directory with a local static web server; opening `index.html` directly from the filesystem will not load its Worker correctly. For example, from the project directory:

```sh
python3 -m http.server 4178 --bind 127.0.0.1 --directory dist
```

Then open `http://localhost:4178`. Clipboard sharing requires a secure browser context such as HTTPS or localhost. Use project files when clipboard permission is unavailable.

## Credits and licenses

The original application code is MIT licensed. Bundled dependencies and firmware retain their own licenses. See `THIRD_PARTY_NOTICES.txt` and the included firmware source and license files before redistributing. The matching firmware sources are publicly downloadable in `dist/firmware/source.tar.gz`.

- [Johnny-Five](https://github.com/rwaldron/johnny-five)
- [Firmata JavaScript](https://github.com/firmata/firmata.js)
- [StandardFirmata](https://github.com/firmata/arduino)
- [AVR8js](https://github.com/wokwi/avr8js)
- [Wokwi elements](https://github.com/wokwi/wokwi-elements)
- [CodeMirror](https://codemirror.net/)

## Rebuild

Install a recent Node.js release, then run `npm ci --ignore-scripts` and `npm run build`. The app itself needs only a static web server. Node.js is build tooling, never a requirement for learners.

The firmware is already compiled and included. To rebuild or replace it, see `dist/firmware/BUILD.md` and the matching source archive. The firmware source licenses permit modification and redistribution under their terms.

The project is MIT licensed for its original code. Download the source ZIP from the public lab’s About dialog to fork or host it yourself.
