/* Original browser API adapters for Little Circuit Lab. MIT.
 * These simulate public platform API behavior; they do not emulate native CPUs,
 * Linux, native addons, Wi-Fi, cloud provisioning, or Bluetooth radios.
 */
const EventEmitter = require('events');
const MODES = {INPUT:0, OUTPUT:1, ANALOG:2, PWM:3, SERVO:4, I2C:6, SERIAL:10, PULLUP:11};
const WPI_TO_BCM = [17,18,27,22,23,24,25,4,2,3,8,7,10,9,11,14,15,28,29,30,31,5,6,13,19,26,12,16,20,21,0,1];
const PI_PHYSICAL_TO_BCM = {3:2,5:3,7:4,8:14,10:15,11:17,12:18,13:27,15:22,16:23,18:24,19:10,21:9,22:25,23:11,24:8,26:7,27:0,28:1,29:5,31:6,32:12,33:13,35:19,36:16,37:26,38:20,40:21};
const BBB_GPIO = {'P8_7':66,'P8_8':67,'P8_9':69,'P8_10':68,'P8_11':45,'P8_12':44,'P8_13':23,'P8_14':26,'P8_15':47,'P8_16':46,'P8_17':27,'P8_18':65,'P8_19':22,'P8_26':61,'P9_11':30,'P9_12':60,'P9_13':31,'P9_14':50,'P9_15':48,'P9_16':51,'P9_17':5,'P9_18':4,'P9_21':3,'P9_22':2,'P9_23':49,'P9_24':15,'P9_26':14,'P9_27':115,'P9_30':112,'P9_41':20,'P9_42':7};
const BBB_PWM = new Set(['P8_13','P8_19','P9_14','P9_16','P9_21','P9_22','P9_42']);
function unsupported(name) { throw new Error(`${name} is not implemented in the browser platform adapter. This mode simulates GPIO and selected embedded APIs, not native operating systems, web servers, cloud deployment, or Bluetooth.`); }
function integer(value,min,max,name) {const n=Number(value);if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}.`);return n;}
function descriptors(platform) {
 if(platform==='tessel')return Array.from({length:20},(_,index)=>{
  const label=index<8?`A${index}`:index<16?`B${index-8}`:`L${index-16}`;
  const capabilities=index>=16?[MODES.OUTPUT]:[MODES.INPUT,MODES.OUTPUT];
  if(index===0||index===1||index===8||index===9)capabilities.push(MODES.I2C);
  if(index===5||index===6||index===13||index===14)capabilities.push(MODES.PWM,MODES.SERVO);
  if(index===4||(index>=8&&index<=14))capabilities.push(MODES.ANALOG);
  return {label,capabilities};
 });
 if(platform==='raspi')return Array.from({length:32},(_,index)=>({label:`GPIO${index}`,capabilities:index===2||index===3?[MODES.I2C]:index<=27?[MODES.INPUT,MODES.OUTPUT,MODES.PWM,MODES.SERVO]:[]}));
 if(platform==='beaglebone')return [...Object.keys(BBB_GPIO).map(label=>({label,capabilities:[MODES.INPUT,MODES.OUTPUT,...(BBB_PWM.has(label)?[MODES.PWM,MODES.SERVO]:[])]})),...[0,1,2,3].map(n=>({label:`USR${n}`,capabilities:[MODES.OUTPUT]})),...['P9_19','P9_20'].map(label=>({label,capabilities:[MODES.I2C]}))];
 if(platform==='pico')return [...['A','B'].flatMap(port=>Array.from({length:16},(_,n)=>({label:port+n,capabilities:[MODES.INPUT,MODES.OUTPUT,MODES.ANALOG,MODES.PWM,MODES.SERVO]}))),...['LED1','LED2','BTN'].map(label=>({label,capabilities:label==='BTN'?[MODES.INPUT]:[MODES.OUTPUT]}))];
 if(platform==='kinoma')return Array.from({length:16},(_,index)=>({label:String(index+1),capabilities:index===12||index===13?[MODES.I2C]:index===10||index===11?[]:[MODES.INPUT,MODES.OUTPUT]}));
 if(platform==='puck')return ['LED1','LED2','LED3','BTN'].map(label=>({label,capabilities:label==='BTN'?[MODES.INPUT]:[MODES.OUTPUT]}));
 unsupported(`Platform ${platform}`);
}
function createPlatformModules({send=()=>{},devices={}}={}) {
 const instances=new Map(), timers=new Set(), watches=new Map(), frames=[];
 let watchId=0;
 function schedule(fn,ms,repeat=false) {const id=(repeat?setInterval:setTimeout)(()=>{if(!repeat)timers.delete(id);fn();},ms);timers.add(id);return id;}
 function cancel(id) {if(id===undefined){for(const timer of timers){clearTimeout(timer);clearInterval(timer);}timers.clear();return;}clearInterval(id);clearTimeout(id);timers.delete(id);}
 function emit(platform,kind,data) {send({type:'platform-output',platform,kind,...data});}
 class VirtualIO extends EventEmitter {
  constructor(platform) {
   super();this.platform=platform;this.name=`Virtual ${platform}`;this.port=`virtual-${platform}`;this.isReady=true;this.isConnected=true;this.MODES=MODES;this.HIGH=1;this.LOW=0;this.debug=false;
   this.descriptors=descriptors(platform);this.labels=this.descriptors.map(x=>x.label);
   this.pins=this.descriptors.map((x,n)=>({supportedModes:x.capabilities,mode:x.capabilities.includes(MODES.INPUT)?MODES.INPUT:x.capabilities[0]??MODES.INPUT,value:0,analogChannel:x.capabilities.includes(MODES.ANALOG)?n:127}));
   this.analogPins=this.descriptors.map((x,n)=>x.capabilities.includes(MODES.ANALOG)?n:-1).filter(n=>n!==-1);
   this.defaultLed=platform==='tessel'?18:platform==='raspi'?4:platform==='beaglebone'?this.labels.indexOf('USR3'):this.labels.indexOf('LED1');
   this.RESOLUTION={ADC:platform==='tessel'?4095:1023,PWM:255};this.digitalCallbacks=new Map();this.analogCallbacks=new Map();this.i2cTimers=new Set();
   emit(platform,'mode',{message:'Virtual API adapter: hardware timing, native OS and wireless behavior are not emulated.'});
  }
  normalize(pin) {
   if(this.platform==='raspi') {
    if(typeof pin==='number')return integer(WPI_TO_BCM[pin],0,27,'Raspberry Pi wiringPi pin');
    const named=String(pin).toUpperCase();
    if(/^GPIO\d+$/.test(named))return integer(named.slice(4),0,27,'Raspberry Pi BCM pin');
    if(/^P1-\d+$/.test(named))return integer(PI_PHYSICAL_TO_BCM[named.slice(3)],0,27,'Raspberry Pi header GPIO');
    throw new Error(`Invalid Raspberry Pi GPIO ${pin}; use a wiringPi number, GPIO4 or P1-7. Power and ground pins are not GPIO.`);
   }
   // Johnny-Five invokes methods with already-normalized numeric indices.
   if(typeof pin==='number')return integer(pin,0,this.pins.length-1,'Pin index');
   let label=String(pin).toUpperCase();
   if(this.platform==='beaglebone'&&/^GPIO\d+$/.test(label))label=Object.keys(BBB_GPIO).find(key=>BBB_GPIO[key]===+label.slice(4));
   const n=this.labels.indexOf(label);if(n<0)throw new Error(`Pin ${pin} is unsupported on virtual ${this.platform}.`);return n;
  }
  index(pin) {return typeof pin==='number'?integer(pin,0,this.pins.length-1,'Pin index'):this.normalize(pin);}
  pinMode(pin,mode) {const n=this.index(pin);if(!this.pins[n].supportedModes.includes(mode))throw new Error(`${this.labels[n]} does not support mode ${mode}.`);this.pins[n].mode=mode;emit(this.platform,'mode-pin',{pin:this.labels[n],mode});return this;}
  digitalWrite(pin,value) {const n=this.index(pin);this.pins[n].value=value?1:0;emit(this.platform,'digital',{pin:this.labels[n],value:this.pins[n].value});return this;}
  pwmWrite(pin,value) {const n=this.index(pin);this.pins[n].value=integer(value,0,255,'PWM');emit(this.platform,'pwm',{pin:this.labels[n],value});return this;}
  analogWrite(pin,value) {return this.pwmWrite(pin,value);}
  servoConfig() {return this;}
  servoWrite(pin,value) {const n=this.index(pin);this.pins[n].value=value;emit(this.platform,'servo',{pin:this.labels[n],value});return this;}
  digitalRead(pin,callback) {const n=this.index(pin);if(!this.digitalCallbacks.has(n))this.digitalCallbacks.set(n,new Set());this.digitalCallbacks.get(n).add(callback);schedule(()=>callback(this.pins[n].value),0);return this;}
  analogRead(pin,callback) {const n=this.index(pin);if(!this.analogCallbacks.has(n))this.analogCallbacks.set(n,new Set());this.analogCallbacks.get(n).add(callback);schedule(()=>callback(this.pins[n].value),0);return this;}
  input(pin,value) {const n=this.index(pin);if([MODES.OUTPUT,MODES.PWM,MODES.SERVO].includes(this.pins[n].mode))return this;const previous=this.pins[n].value;this.pins[n].value=value;for(const cb of this.digitalCallbacks.get(n)||[])cb(value);for(const cb of this.analogCallbacks.get(n)||[])cb(value);this.emit('input',{pin:this.labels[n],value,previous});return this;}
  i2cConfig() {if(!devices.readI2C)unsupported('I2C devices: connect a register-level device model');return this;}
  i2cWrite(address,register,data) {if(!devices.writeI2C)unsupported('I2C writes');devices.writeI2C(this.platform,address,register,data);return this;}
  i2cWriteReg(address,register,data) {return this.i2cWrite(address,register,data);}
  i2cReadOnce(address,register,length,callback) {if(typeof length==='function'){callback=length;length=register;register=null;}if(!devices.readI2C)unsupported('I2C reads');Promise.resolve(devices.readI2C(this.platform,address,register,length)).then(bytes=>{if(!bytes||bytes.length!==length)throw new Error('I2C model returned the wrong number of bytes.');callback(Array.from(bytes));}).catch(error=>this.emit('error',error));return this;}
  i2cRead(address,register,length,callback) {if(typeof length==='function'){callback=length;length=register;register=null;}const id=schedule(()=>this.i2cReadOnce(address,register,length,callback),20,true);this.i2cTimers.add(id);return this;}
  setSamplingInterval() {return this;}
  queryCapabilities(callback) {callback?.(this.pins);return this;}
  queryAnalogMapping(callback) {callback?.(this.analogPins);return this;}
  queryPinState(pin,callback) {callback?.(this.pins[this.index(pin)]);return this;}
  snapshot() {return {platform:this.platform,pins:this.labels.map((label,n)=>({label,mode:this.pins[n].mode,value:this.pins[n].value})),virtual:true};}
 }
 function getIO(platform) {if(!instances.has(platform)){const io=new VirtualIO(platform);instances.set(platform,io);if(platform==='pico')io.on('input',notifyPicoInput);}return instances.get(platform);}
 function VirtualTessel(){return getIO('tessel');}
 function VirtualRaspi(){return getIO('raspi');}
 VirtualRaspi.RaspiIO=VirtualRaspi;
 function VirtualBeagleBone(){return getIO('beaglebone');}
 const tessel={get led(){const io=getIO('tessel');return [0,1,2,3].map(n=>({on(){io.digitalWrite(`L${n}`,1);return this;},off(){io.digitalWrite(`L${n}`,0);return this;},toggle(){const pin=io.normalize(`L${n}`);io.digitalWrite(pin,!io.pins[pin].value);return this;}}));}};
 let wiringPiScheme='wpi';
 const wiringPi={OUTPUT:1,INPUT:0,setup(scheme='wpi'){if(!['wpi','gpio','phys'].includes(scheme))unsupported(`wiring-pi numbering ${scheme}`);wiringPiScheme=scheme;return 0;},
  index(pin){const io=getIO('raspi');return wiringPiScheme==='gpio'?integer(pin,0,27,'BCM GPIO'):wiringPiScheme==='phys'?io.normalize(`P1-${pin}`):io.normalize(pin);},
  pinMode(pin,mode){getIO('raspi').pinMode(this.index(pin),mode);},digitalWrite(pin,value){getIO('raspi').digitalWrite(this.index(pin),value);},digitalRead(pin){return getIO('raspi').pins[this.index(pin)].value;}};
 const exportsGPIO=new Set(), directions=new Map();
 const fs={writeFileSync(path,data){
  const text=String(data).trim();const prefix='/sys/class/gpio/';if(!String(path).startsWith(prefix))unsupported(`Filesystem path ${path}`);
  const local=String(path).slice(prefix.length);
  if(local==='export'){const n=integer(text,0,27,'BCM GPIO');if(exportsGPIO.has(n))throw new Error('EBUSY: GPIO is already exported.');exportsGPIO.add(n);getIO('raspi');return;}
  if(local==='unexport'){const n=integer(text,0,27,'BCM GPIO');if(!exportsGPIO.delete(n))throw new Error('EINVAL: GPIO is not exported.');directions.delete(n);return;}
  const match=/^gpio(\d+)\/(direction|value)$/.exec(local);if(!match)unsupported(`Filesystem path ${path}`);const n=+match[1];if(!exportsGPIO.has(n))throw new Error('ENOENT: export the GPIO first.');
  if(match[2]==='direction'){if(!['in','out'].includes(text))throw new Error('EINVAL: direction must be in or out.');directions.set(n,text);getIO('raspi').pinMode(n,text==='out'?MODES.OUTPUT:MODES.INPUT);}
  else{if(directions.get(n)!=='out')throw new Error('EPERM: GPIO is not an output.');getIO('raspi').digitalWrite(n,integer(text,0,1,'GPIO value'));}
 },readFileSync(path,encoding){const match=/^\/sys\/class\/gpio\/gpio(\d+)\/(direction|value)$/.exec(String(path));if(!match||!exportsGPIO.has(+match[1]))throw new Error('ENOENT: no virtual GPIO file.');const value=match[2]==='direction'?directions.get(+match[1]):String(getIO('raspi').pins[+match[1]].value);if(!encoding)unsupported('fs readFileSync without a text encoding');return value+'\n';}};
 function digitalWrite(pin,value){const io=getIO('pico');io.pinMode(pin,MODES.OUTPUT);io.digitalWrite(pin,value);}
 const globals={digitalWrite,digitalRead:pin=>getIO('pico').pins[getIO('pico').normalize(pin)].value,setInterval:(fn,ms)=>schedule(fn,ms,true),setTimeout:(fn,ms)=>schedule(fn,ms),clearInterval:cancel,clearTimeout:cancel,
  setWatch(callback,pin,options={}) {const id=++watchId, label=getIO('pico').labels[getIO('pico').normalize(pin)];watches.set(id,{callback,pin:label,options,lastAt:-Infinity});return id;},clearWatch(id){if(id===undefined)watches.clear();else watches.delete(id);}};
 for(const {label} of descriptors('pico'))globals[label]=label;
 function notifyPicoInput({pin,value,previous}){for(const[id,w]of watches){if(w.pin!==pin||value===previous)continue;const edge=w.options.edge;if(edge==='rising'&&!value||edge==='falling'&&value)continue;const now=performance.now()/1000;if(now-w.lastAt<(w.options.debounce||0)/1000)continue;const lastTime=Number.isFinite(w.lastAt)?w.lastAt:0;w.lastAt=now;w.callback({state:!!value,time:now,lastTime});if(!w.options.repeat)watches.delete(id);}}
 const I2C1={setup(config){this.config=config;}};const SPI1={setup(config){this.config=config;}};globals.I2C1=I2C1;globals.SPI1=SPI1;
 const BMP085={connect(bus){if(!bus.config)throw new Error('Call I2C1.setup before connecting BMP085.');return {getPressure(callback){const env=devices.environment?.('pico');if(!env?.connected)throw new Error('Connect a virtual BMP180 to the Pico I2C pins.');schedule(()=>callback({temperature:env.temperature,pressure:env.pressure}),0);},getSeaLevel(pressure,altitude){return pressure/Math.pow(1-altitude/44330,5.255);}};}};
 // This is a selected Graphics API adaptation with an original bitmap font,
 // not the Espruino vector-font rasterizer or PCD8544 SPI electrical timing.
 const glyphs={'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],'2':['111','001','111','100','111'],'3':['111','001','111','001','111'],'4':['101','101','111','001','001'],'5':['111','100','111','001','111'],'6':['111','100','111','101','111'],'7':['111','001','010','010','010'],'8':['111','101','111','101','111'],'9':['111','101','111','001','111'],'.':['000','000','000','000','010'],'-':['000','000','111','000','000'],'F':['111','100','110','100','100'],'m':['000','000','111','111','101'],'b':['100','100','110','101','110'],' ':['000','000','000','000','000']};
 class Graphics {
  constructor(){this.width=84;this.height=48;this.pixels=new Uint8Array(84*48);this.font=8;}
  getWidth(){return this.width;}getHeight(){return this.height;}clear(){this.pixels.fill(0);return this;}
  pixel(x,y){x=Math.round(x);y=Math.round(y);if(x>=0&&x<84&&y>=0&&y<48)this.pixels[y*84+x]=1;}
  drawLine(x0,y0,x1,y1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let error=dx+dy;for(let steps=0;steps<10000;steps++){this.pixel(x0,y0);if(x0===x1&&y0===y1)break;const e=2*error;if(e>=dy){error+=dy;x0+=sx;}if(e<=dx){error+=dx;y0+=sy;}}return this;}
  drawRect(x0,y0,x1,y1){this.drawLine(x0,y0,x1,y0).drawLine(x1,y0,x1,y1).drawLine(x1,y1,x0,y1).drawLine(x0,y1,x0,y0);return this;}
  fillRect(x0,y0,x1,y1){for(let y=Math.max(0,Math.round(y0));y<=Math.min(47,Math.round(y1));y++)for(let x=Math.max(0,Math.round(x0));x<=Math.min(83,Math.round(x1));x++)this.pixel(x,y);return this;}
  drawCircle(cx,cy,r){for(let theta=0;theta<Math.PI*2;theta+=1/Math.max(12,8*r))this.pixel(cx+Math.cos(theta)*r,cy+Math.sin(theta)*r);return this;}
  setFontVector(size){this.font=size;return this;}stringWidth(text){return String(text).length*4*Math.max(1,Math.floor(this.font/6));}
  drawString(text,x,y){const scale=Math.max(1,Math.floor(this.font/6));for(const ch of String(text)){const glyph=glyphs[ch];if(!glyph)unsupported(`Graphics glyph ${JSON.stringify(ch)} (selected font supports numeric weather output)`);glyph.forEach((row,dy)=>[...row].forEach((value,dx)=>{if(value==='1')this.fillRect(x+dx*scale,y+dy*scale,x+(dx+1)*scale-1,y+(dy+1)*scale-1);}));x+=4*scale;}return this;}
  flip(){const frame={width:84,height:48,pixels:Array.from(this.pixels),fontApproximation:true};frames.push(frame);if(frames.length>2)frames.shift();emit('pico','lcd',frame);return this;}
 }
 const PCD8544={connect(bus,dc,ce,rst,callback){if(!bus.config)throw new Error('Call SPI1.setup before connecting PCD8544.');if(!devices.displayConnected?.('pico'))throw new Error('Connect a virtual Nokia 5110 display to Pico SPI.');const graphics=new Graphics();if(callback)schedule(()=>callback(graphics),0);return graphics;}};
 const modules={'tessel-io':VirtualTessel,tessel,'raspi-io':VirtualRaspi,'beaglebone-io':VirtualBeagleBone,'wiring-pi':wiringPi,fs,BMP085,PCD8544};
 const unsupportedModules=['http','https','express','socket.io','pins','websocket'];
 function resolveModule(name){if(name in modules)return modules[name];unsupported(`Module ${name}`);}
 return {modules,resolveModule,unsupportedModules,globals,getIO,input(platform,pin,value){getIO(platform).input(pin,value);},snapshot(){return [...instances.values()].map(io=>io.snapshot());},dispose(){cancel();watches.clear();for(const io of instances.values())io.removeAllListeners();},capabilities:{mode:'virtual API adapters',platforms:['Tessel2 GPIO/onboard LEDs','RPi3 GPIO/wiringPi/sysfs subset','BBB supported GPIO/USR3','Espruino Pico GPIO/watch/BMP085/PCD8544 numeric Graphics subset'],unsupported:['native CPU/OS emulation','GPIO electrical timing','cloud provisioning','WiFi deployment','Bluetooth radios','HTTP/Express/Socket.IO servers','Kinoma ESM API runtime']},frames};
}
module.exports={createPlatformModules,descriptors,MODES,WPI_TO_BCM,PI_PHYSICAL_TO_BCM,BBB_GPIO};
