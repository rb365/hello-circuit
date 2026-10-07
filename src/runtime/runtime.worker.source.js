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
// A macrotask-backed immediate prevents NanoTimer's real Johnny-Five piezo
// loop from monopolizing process.nextTick and starving the AVR pump.
const immediateTasks=new Map(),immediateChannel=new MessageChannel();
let immediateId=0;
immediateChannel.port1.onmessage=event=>{const task=immediateTasks.get(event.data);immediateTasks.delete(event.data);if(task)task.callback(...task.args);};
globalThis.setImmediate=(callback,...args)=>{const id=++immediateId;immediateTasks.set(id,{callback,args});immediateChannel.port2.postMessage(id);return id;};
globalThis.clearImmediate=id=>immediateTasks.delete(id);
const five = require('johnny-five');
const Firmata = require('firmata-io').Firmata;
const { Uno } = require('./uno');
const { createHost } = require('./browser-host');
const { createPlatformModules } = require('./platform-adapters');
const { createWebModules } = require('./web-adapters');
const { createAdvancedModules,adaptKinomaEntry } = require('./advanced-platform-adapters');
const { createShell } = require('./shell-adapter');
const hex = require('./firmware-data');

let emulator;
let io;
let running = false;
let lastSnapshotAt = 0;
let platform='uno';
let platforms;
let configuredPeripherals=[];
let web;
let advanced;
let shell;
const tones={};
const send = message => postMessage(message);
const host=createHost(processShim,send,()=>{running=false;close();});
function printable(value) {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  try { return JSON.stringify(value); } catch { return String(value); }
}
for (const level of ['log','info','warn','error','debug']) {
  console[level] = (...args) => send({type:'console',level,args:args.map(printable)});
}
function failure(error) { send({type:'status',status:'error',message:error.message || String(error),stack:error.stack}); }

function run(code,options={}) {
  if (running) throw new Error('Create a fresh worker for each run.');
  running = true;
  platform=options.platform==='arduino'?'uno':options.platform||'uno';
  if(!['uno','tessel','pico','raspi','beaglebone','kinoma','puck'].includes(platform))throw new Error(`Unknown platform "${platform}".`);
  emulator = new Uno(hex);
  configuredPeripherals=options.peripherals||options.items||[];
  emulator.peripherals.configure(configuredPeripherals);
  platforms=createPlatformModules({
    send:message=>{
      send(message);
      if(message.type==='platform-output'&&message.kind==='digital')emulator.peripherals.gpio(pin=>platforms.getIO(message.platform).pins[pin]?.value?1:0);
    },
    devices:{
      readI2C:(_platform,address,register,length)=>emulator.peripherals.readI2C(address,register,length),
      writeI2C:(_platform,address,register,data)=>emulator.peripherals.writeI2C(address,register,data),
      environment:()=>{const model=[...emulator.peripherals.models.values()].find(model=>model.item.type==='weather'&&model.item.powered!==false);return model?{...model.values,pressure:model.values.pressure>1000?model.values.pressure:model.values.pressure*1000,connected:true}:{connected:false};},
      displayConnected:()=>configuredPeripherals.some(item=>['nokia-lcd','nokia5110'].includes(item.type)&&item.powered!==false)
    }
  });
  io = platform==='uno'?new Firmata(emulator.serial, {reportVersionTimeout:100, samplingInterval:20}):platforms.getIO(platform);
  emulator.peripherals.driveInput=(pin,value)=>{if(pin!==undefined&&pin!==null)platform==='uno'?emulator.input(pin,value):platforms.input(platform,pin,value);};
  emulator.peripherals.configure(configuredPeripherals);
  if(platform==='uno'){
  io.defaultLed = 13;
  // Johnny-Five recognizes this name to normalize A0..A5 correctly.
  io.name = 'Firmata';
  io.port = 'virtual-uno';
  io.virtualServoRanges = {};
  io.virtualSerialPorts={};
  const configureSerial=io.serialConfig.bind(io);
  io.serialConfig=config=>{io.virtualSerialPorts[config.portId]=config;return configureSerial(config);};
  const configureServo = io.servoConfig.bind(io);
  io.servoConfig = (pin, min, max) => {
    if (typeof pin === 'object') { ({pin, min, max} = pin); }
    io.virtualServoRanges[pin] = {min, max};
    return configureServo(pin, min, max);
  };
  io.on('error', failure);
  io.on('ready', () => send({type:'status',status:'ready',firmware:io.firmware,version:io.version}));
  }
  class BrowserBoard extends five.Board {
    constructor(options = {}) {
      const selectedIO=platform==='uno'?io:options.io||io;
      super({...options, io:selectedIO, repl:false, debug:false, sigint:false});
      this.repl=new host.BrowserRepl(this);
      this.on('error', failure);
    }
  }
  Object.setPrototypeOf(BrowserBoard, five.Board);
  // The book's 2017 custom component passes named pin objects. Normalize that
  // historical shape narrowly before delegating to Johnny-Five 2.1 itself.
  BrowserBoard.Component=function(options={},componentOptions={}){
    if(options.pins&&!Array.isArray(options.pins)&&typeof options.pins==='object'){
      const selectedIO=five.Board.mount(options).io;
      options={...options,pins:Object.fromEntries(Object.entries(options.pins).map(([name,pin])=>[name,selectedIO.normalize?selectedIO.normalize(pin):pin]))};
      componentOptions={...componentOptions,normalizePin:false};
    }
    return five.Board.Component.call(this,options,componentOptions);
  };
  Object.assign(BrowserBoard.Component,five.Board.Component);
  class BrowserPiezo extends five.Piezo {
    constructor(options) {
      super(options);
      const tone=this.tone.bind(this),off=this.noTone.bind(this);
      this.tone=(period,duration)=>{tones[this.pin]={frequency:500000/period,duration,until:performance.now()+duration};return tone(period,duration);};
      this.noTone=()=>{delete tones[this.pin];return off();};
    }
  }
  // The same book plugin also initializes collections with Collection.call.
  // Delegate construction to the real modern Collection, then transfer its
  // initialized properties to the historical subclass instance.
  function BrowserCollection(items){
    function Target(){}
    Target.prototype=Object.create(Object.getPrototypeOf(this));
    if(this.type)Object.defineProperty(Target.prototype,'type',{value:this.type});
    const initialized=Reflect.construct(five.Collection,[items],Target);
    for(const key of Reflect.ownKeys(initialized))Object.defineProperty(this,key,Object.getOwnPropertyDescriptor(initialized,key));
  }
  Object.setPrototypeOf(BrowserCollection,five.Collection);
  BrowserCollection.prototype=five.Collection.prototype;
  const browserFive = {...five, Board:BrowserBoard, Piezo:BrowserPiezo, Collection:BrowserCollection};
  web=createWebModules({send,files:options.files,assets:options.assets,platform});
  if(['kinoma','puck'].includes(platform))advanced=createAdvancedModules({
    send:message=>send(message.type==='web-preview'?{...message,html:web.renderHTML(message.html)}:message),io,files:options.files,
    devices:{compass:()=>{const model=[...emulator.peripherals.models.values()].find(model=>model.item.type==='compass'&&model.item.powered!==false);return model?{connected:true,heading:model.values.heading}:{connected:false};}}
  });
  if(['raspi','beaglebone'].includes(platform))shell=createShell({fs:platforms.modules.fs,io,send,files:options.files});
  const project=host.modules({five:browserFive,files:options.files,fixtures:options.fixtures,entry:options.entry,additionalModules:{...(platform==='uno'?{}:platforms.modules),...web.modules,...(advanced?.modules||{})},globals:platform==='pico'?platforms.globals:advanced?.globals||{},resolveModule:platform==='uno'?undefined:platforms.resolveModule});
  send({type:'status',status:'connecting'});
  if(platform==='kinoma')code=adaptKinomaEntry(code??options.files?.[options.entry]??options.files?.['/main.js']??options.files?.['main.js']??'');
  if(shell&&/\.sh$/.test(options.entry||''))shell.execute(code??options.files?.[options.entry]??'', 'program');
  else project.execute(code);
  if(platform==='uno')emulator.serial.emit('open');
  else send({type:'status',status:'ready',platform,virtual:true,message:'Virtual platform API adapter'});
  let previous = performance.now();
  const pump = () => {
    if (!running) return;
    try {
      const now = performance.now();
      // Advance at Uno's real clock; cap catch-up after background suspension.
      const cycles = Math.max(16000, Math.min(320000, (now - previous) * 16000));
      previous = now;
      if(platform==='uno'){emulator.peripherals.scheduleGPS(io);emulator.step(cycles);}
      if (now - lastSnapshotAt >= 30) {
        for(const[pin,tone]of Object.entries(tones))if(tone.until<now)delete tones[pin];
        send({type:'pins',...snapshot(),tones}); lastSnapshotAt = now;
      }
      setTimeout(pump, 4);
    } catch (error) { running = false; failure(error); }
  };
  setTimeout(pump, 0);
}
function snapshot(){
  if(platform==='uno')return {platform,...emulator.snapshot(io)};
  const native=platforms.getIO(platform),digital=native.pins.map(pin=>pin.value?1:0),modes={},pwm={},servo={};
  native.pins.forEach((pin,index)=>{modes[index]=pin.mode;pwm[index]=pin.mode===3?pin.value/255:digital[index];if(pin.mode===4)servo[index]=pin.value>180?(pin.value-600)/10:pin.value;});
  const components=emulator.peripherals.snapshot(),frame=platforms.frames.at(-1);
  for(const item of configuredPeripherals)if(['nokia-lcd','nokia5110'].includes(item.type)&&frame)components[item.id]={...frame,powered:item.powered!==false};
  return {platform,virtual:true,pinMap:Object.fromEntries(native.labels.map((label,index)=>[label,index])),ioPins:native.descriptors,digital,pwm,servo,modes,analog:native.pins.map(pin=>pin.value),resolution:native.RESOLUTION,components};
}
onmessage = event => {
  try {
    const message = event.data;
    if (message.type === 'run') run(message.code,message);
    if (message.type === 'input' && emulator) platform==='uno'?emulator.input(message.pin, message.value):platforms.input(platform,message.pin,message.value);
    if (message.type === 'board-input' && platforms)platforms.input(platform,message.pin||'BTN',message.value);
    if (message.type === 'snapshot' && emulator) send({type:'pins',...snapshot()});
    if (message.type === 'eval') host.evaluate(message.code,message.id);
    if (message.type === 'shell'){
      if(shell)shell.execute(message.code??message.command??'',message.id);
      else send({type:'eval-result',id:message.id,error:'The virtual GPIO shell is available on Raspberry Pi and BeagleBone API boards.'});
    }
    if (message.type === 'key') host.keyboard(message);
    if (message.type === 'web-client' && web){web.handle(message);advanced?.handle(message);}
    if (message.type === 'peripherals' && emulator){configuredPeripherals=message.items||[];emulator.peripherals.configure(configuredPeripherals);}
    if (message.type === 'device-input' && emulator) emulator.peripherals.input(message.id,message.values);
  } catch (error) { failure(error); }
};
onerror = event => failure(new Error(event.message));
onunhandledrejection = event => failure(event.reason);
