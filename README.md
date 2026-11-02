# Hello Circuit

A browser workbench for following **JavaScript on Things** without a physical board. On your first visit, try a short button counter: press Run, then click the button to update an LCD and toggle the Uno’s built-in light. Choose New project for an unwired Uno and empty editor, then add components and write your own program. Examples are optional and live in **Help & book companion**.

The workbench can run locally or as a hosted static website. The same browser runtime is used in both.

**[Try Hello Circuit in your browser](https://little-circuit-lab.skarine545725.chatgpt.site/)** — no hardware or installation required.

## Open locally

Clone this repository and serve the included prebuilt app with Python 3:

```sh
git clone https://github.com/rb365/hello-circuit.git
cd hello-circuit
python3 -m http.server 4178 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4178/` in your browser. Keep the terminal open while using the lab; Ctrl+C stops the local server. On Windows, use `py -3` instead of `python3` if needed. Python 3 must be installed.

On macOS, you can also double-click **Start Local Lab.command** to start the server and open the browser.

Alternatively, run `npm start` from the project directory if Node.js and Python 3 are installed. The prebuilt `dist` folder needs only a static web server. Learners do not need Node.js, npm, a serial connection, or a compilation service to use the hosted browser lab after its assets load.

## Work alongside the book

1. Choose the book’s board. Arduino Uno is the default; the other boards are labelled virtual API models.
2. Choose a part from the searchable component library, then click the canvas to place it, or drag it straight from the library. Move parts by their body or name. Click two gold pins, drag between pins, or use the larger targets in the Pins tab to make a wire. The Details tab holds properties and readings; Undo/Redo covers circuit edits.
3. Write the code. Add local files such as `Rover.js`, and choose the program’s entry file. HTML/CSS, JSON and the selected virtual-shell exercise are also editable.
4. Run the program. The interactive console evaluates JavaScript for objects exposed with `board.repl.inject`. Control keys send arrow/space/Ctrl+C events to rover programs. The virtual Pi/BeagleBone console also has a bounded GPIO shell.
5. Experiment. Change light, temperature, pressure, acceleration, GPS position or gesture controls. LCDs, motors, LEDs and the web-page preview respond to the wired circuit.

Download/Open save complete JSON projects. Share includes files, assets, components and wiring in a link. Projects are saved on this device, and imported/shared programs wait for Run. Loading an example or changing the board can be undone. Only a first visit with no saved payload or project link opens the button counter; it waits for Run. Saved projects (including blank work) and shared links retain priority. New project always opens a blank workbench. **Load starter project** reopens the button counter anytime, after confirmation. It stops the current simulation and waits for Run; Undo project change restores your previous work until you leave the page.

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

Install Node.js 24 and Python 3, then run `npm ci --ignore-scripts` and `npm run build`. This builds the static frontend, worker and notices; it never publishes. `python3 scripts/package-source.py` packages editable source and prebuilt assets into `dist/source.zip`.

Original app code is MIT licensed. The author’s example code and sound retain their MIT notice (Copyright 2017 Lyza Gardner). The book’s chapter text and illustrations are not included. Firmware and dependencies retain their own licenses: see `THIRD_PARTY_NOTICES.txt`, `dist/firmware/BUILD.md` and `dist/firmware/source.tar.gz`. Matching firmware source and build flags are included.

Sources: [Manning’s book](https://www.manning.com/books/javascript-on-things), [official example repository](https://github.com/lyzadanger/javascript-on-things) pinned to `6f7e825c05933d5658b58c622351d4f9c43d61d5`, [Johnny-Five](https://github.com/rwaldron/johnny-five), [Firmata](https://github.com/firmata/arduino), [AVR8js](https://github.com/wokwi/avr8js), [Wokwi elements](https://github.com/wokwi/wokwi-elements), [CodeMirror](https://codemirror.net/).

The lab is independent and not affiliated with Manning, Arduino, Wokwi or Velxio.

## Branding and project compatibility

Hello Circuit uses the supplied circuit speech-bubble logo and bundled Open Sans fonts. Font licensing is included in `dist/assets/hello-circuit/fonts/` and the third-party notices. The existing hosted URL, package identifier, storage key, project format and browser-agent tool names retain their original names so existing links and saved projects continue to work. Historical artwork and copyright notices retain their original attribution.


## CI, production, and staging

The `CI and Pages` workflow installs the lockfile with lifecycle scripts disabled,
runs JavaScript syntax checks, the history/wire-routing/camera/startup/console regression suites,
rebuilds both bundles and license notices, packages editable source, and validates
local asset URLs at both `/` and `/hello-circuit/`. CI also installs Chromium and
runs browser acceptance at the project-site path, retaining screenshots/logs for
seven days. Run the same gates locally:

```sh
npm ci --ignore-scripts
npm run check
npx playwright install --with-deps chromium
npm run test:browser
```

`check:syntax` is a syntax check, not a style linter or type checker. The JSON files
in `validation/` record earlier manual/program checks; CI does **not** replay all
of those historical browser or electrical-model checks. The browser smoke suite covers only its explicit assertions; full simulator,
accessibility, and visual review remain release checks.

### Production

Enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Only a successful workflow on `main` can deploy to the `github-pages` environment;
pull requests cannot publish. The expected project-site address is
<https://rb365.github.io/hello-circuit/>. The workflow rebuilds from source rather
than trusting committed bundles and publishes the exact checked `dist/` artifact.
Asset URLs are relative so the same output also works at a custom-domain root.
No deployment secret or personal access token is required. Actions are pinned to
full commit SHAs; update these intentionally as upstream releases change.

Restrict the `github-pages` environment to `main`, and protect `main` with pull
request review and the **Check and build** status check. Those repository settings
are separate from this source change. To roll back, revert the faulty change on
`main` and let the same check/deploy pipeline run; do not bypass the checks.

### Staging without changing production

Every PR produces a seven-day `static-site-<commit>` Actions artifact. Download
and unzip a trusted revision, then serve that directory on a **different local
port** (for example `python3 -m http.server 4180 --bind 127.0.0.1`). Use a disposable
browser profile for unfamiliar contributions. Test at a project subpath as well:
put the extracted files in a directory named `hello-circuit` and serve its parent,
then visit `http://127.0.0.1:4180/hello-circuit/`.

Before merging, check first-visit counter and blank New project, a known program's Run/Stop/Run and observable
output, adding/moving/wiring components, Undo/Redo, Download/Open/Share, modal
close/Escape and keyboard focus, and 360/390/768/1440 px layouts. Check the browser
console/network panel for failures. After deployment, repeat the smoke check at
the public URL and verify the Actions deployment points at the expected commit.

This is artifact-based review, **not** an automatically hosted staging URL. For
shared hosted staging, use a separately approved isolated origin and deploy only
trusted revisions. A `/staging/` path or another repository on `rb365.github.io`
shares the same origin/storage and is not a security boundary. Do not use
`pull_request_target` to run contributor code with deployment permissions, and do
not deploy PRs over the production Pages artifact.

### Running code safely

Only run projects you trust. Workers isolate computation and let Stop terminate
a stuck program, but are **not a hostile-code security sandbox**: project code
can make network requests and access browser APIs available to a same-origin
worker. Web previews use a sandboxed iframe but may also make network requests.
Do not enter credentials, API keys, or private data into projects or share links.
Imported/shared projects wait for an explicit Run; inspect their code first.
GitHub project sites under one `username.github.io` host share an origin, so use
an isolated origin/profile when testing untrusted code.

Workflow references: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Review dependency note (2026-11-02): `npm audit --omit=dev --ignore-scripts`
reported no production dependency vulnerabilities. The full audit reported eight
low/moderate development-chain advisories (no high/critical); do not interpret
this as a complete browser-bundle security audit or automatically apply breaking
`audit fix --force` changes. Recheck before releases.
