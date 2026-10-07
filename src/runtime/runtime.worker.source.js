const processShim = require('process/browser');
const { Buffer } = require('buffer');
processShim.version = 'v22.0.0';
processShim.versions = {};
processShim.hrtime = previous => {
  const milliseconds = performance.now();
  let seconds = Math.floor(milliseconds / 1000);
  let nanoseconds = Math.floor((milliseconds % 1000) * 1e6);
  if (previous) {
    seconds -= previous[0]; nanoseconds -= previous[1];
    if (nanoseconds < 0) { seconds--; nanoseconds += 1e9; }
  }
  return [seconds, nanoseconds];
};
globalThis.Buffer = Buffer;
const five = require('johnny-five');
const Firmata = require('firmata-io').Firmata;
const { Uno } = require('./uno');
const hex = require('./firmware-data');

let emulator;
let io;
let running = false;
let lastSnapshotAt = 0;
const send = message => postMessage(message);
function printable(value) {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  try { return JSON.stringify(value); } catch { return String(value); }
}
for (const level of ['log','info','warn','error','debug']) {
  console[level] = (...args) => send({type:'console',level,args:args.map(printable)});
}
function failure(error) { send({type:'status',status:'error',message:error.message || String(error),stack:error.stack}); }

function run(code) {
  if (running) throw new Error('Create a fresh worker for each run.');
  running = true;
  emulator = new Uno(hex);
  io = new Firmata(emulator.serial, {reportVersionTimeout:100, samplingInterval:20});
  io.defaultLed = 13;
  // Johnny-Five recognizes this name to normalize A0..A5 correctly.
  io.name = 'Firmata';
  io.port = 'virtual-uno';
  io.virtualServoRanges = {};
  const configureServo = io.servoConfig.bind(io);
  io.servoConfig = (pin, min, max) => {
    if (typeof pin === 'object') { ({pin, min, max} = pin); }
    io.virtualServoRanges[pin] = {min, max};
    return configureServo(pin, min, max);
  };
  io.on('error', failure);
  io.on('ready', () => send({type:'status',status:'ready',firmware:io.firmware,version:io.version}));
  class BrowserBoard extends five.Board {
    constructor(options = {}) {
      super({...options, io, repl:false, debug:false, sigint:false});
      this.on('error', failure);
    }
  }
  Object.setPrototypeOf(BrowserBoard, five.Board);
  const browserFive = {...five, Board:BrowserBoard};
  const localRequire = name => {
    if (name === 'johnny-five') return browserFive;
    if (name === 'events') return require('events');
    throw new Error(`Module "${name}" is unavailable. This lab includes johnny-five and events.`);
  };
  send({type:'status',status:'connecting'});
  const module = {exports:{}};
  new Function('require','module','exports',code)(localRequire,module,module.exports);
  emulator.serial.emit('open');
  let previous = performance.now();
  const pump = () => {
    if (!running) return;
    try {
      const now = performance.now();
      // Advance at Uno's real clock; cap catch-up after background suspension.
      const cycles = Math.max(16000, Math.min(320000, (now - previous) * 16000));
      previous = now;
      emulator.step(cycles);
      if (now - lastSnapshotAt >= 30) {
        send({type:'pins',...emulator.snapshot(io)}); lastSnapshotAt = now;
      }
      setTimeout(pump, 4);
    } catch (error) { running = false; failure(error); }
  };
  setTimeout(pump, 0);
}
onmessage = event => {
  try {
    const message = event.data;
    if (message.type === 'run') run(message.code);
    if (message.type === 'input' && emulator) emulator.input(message.pin, message.value);
    if (message.type === 'snapshot' && emulator) send({type:'pins',...emulator.snapshot(io)});
  } catch (error) { failure(error); }
};
onerror = event => failure(new Error(event.message));
onunhandledrejection = event => failure(event.reason);
