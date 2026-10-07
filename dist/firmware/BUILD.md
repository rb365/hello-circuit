# StandardFirmata Uno firmware source

This archive contains the exact unmodified libraries and platform source used
to compile the included firmware:

- Firmata 2.5.9 (LGPL-2.1-or-later): `libraries/Firmata`
- Servo 1.2.2 (LGPL-2.1-or-later): `libraries/Servo`
- Arduino AVR Boards 1.8.6: `arduino-avr-1.8.6`, including Arduino AVR core,
  standard Uno variant, Wire, and source notices

Compiled using Arduino CLI 1.5.1 and its pinned avr-gcc toolchain
7.3.0-atmel3.6.1-arduino7, for `arduino:avr:uno`, default build settings.
No source files were changed.

Install Arduino CLI from https://github.com/arduino/arduino-cli/releases/tag/v1.5.1.
Rebuild with an isolated configuration whose data/download/user directories are
inside your project (see `arduino-cli.yaml.example`).

```sh
arduino-cli core update-index --config-file arduino-cli.yaml
arduino-cli core install arduino:avr@1.8.6 --config-file arduino-cli.yaml
arduino-cli compile --fqbn arduino:avr:uno --libraries libraries --build-path build --config-file arduino-cli.yaml libraries/Firmata/examples/StandardFirmata
```

The matching `.hex` is `build/StandardFirmata.ino.hex`. The linked sketch occupies
13212 bytes of flash and 1153 bytes of RAM. Its SHA-256 is:

`521371e2f0f6fbc18a7db0a2e7aa49768103d202dc3805ab0bb3971d42f99fe2`

The firmware announces protocol/firmware version 2.5; the library release is 2.5.9.
The complete supplied source may be modified and recompiled under its included
license terms. Host JavaScript communicates over the Firmata protocol and is
bundled separately from the AVR binary.

Upstream source/downloads:

https://downloads.arduino.cc/libraries/github.com/firmata/Firmata-2.5.9.zip
https://downloads.arduino.cc/libraries/github.com/arduino-libraries/Servo-1.2.2.zip
https://github.com/arduino/ArduinoCore-avr/releases/tag/1.8.6
