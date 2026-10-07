/* Original Little Circuit Lab virtual Kinoma/Puck API models. MIT.
 * No Kinoma CPU, Bluetooth radio, pairing protocol or native network socket.
 * The Kinoma compass device hook replaces the GPL-derived book helper.
 */
const EventEmitter=require('events');
function createAdvancedModules({send=()=>{},io,devices={},files={}}={}){
 const timers=new Set(),watches=new Map(),clients=new Map(),servers=new Set();let watchId=0;
 function later(fn,ms,repeat=false){const timer=(repeat?setInterval:setTimeout)(()=>{if(!repeat)timers.delete(timer);fn();},ms);timers.add(timer);return timer;}
 function clear(timer){clearTimeout(timer);clearInterval(timer);timers.delete(timer);}
 function output(pin,value){if(!io)throw new Error('A virtual Puck IO model is required.');io.pinMode(pin,1);io.digitalWrite(pin,value?1:0);}
 const LED1={set:()=>output('LED1',1),reset:()=>output('LED1',0)};
 const LED2={set:()=>output('LED2',1),reset:()=>output('LED2',0)};
 const LED3={set:()=>output('LED3',1),reset:()=>output('LED3',0)};
 function notifyInput(event){const pin=typeof event.pin==='number'?io.labels[event.pin]:event.pin;for(const[id,watch]of watches){
  if(watch.pin!==pin)continue;
  const rising=event.value&&!event.previous,falling=!event.value&&event.previous;
  if(watch.options.edge==='rising'&&!rising||watch.options.edge==='falling'&&!falling||!rising&&!falling)continue;
  const now=Date.now();if(now-watch.lastAt<(watch.options.debounce||0))continue;watch.lastAt=now;
  watch.callback({state:!!event.value,lastTime:watch.lastTime||0,time:now/1000});watch.lastTime=now/1000;if(!watch.options.repeat)watches.delete(id);
 }}
 io?.on('input',notifyInput);
 const globals={LED1,LED2,LED3,BTN:'BTN',Bluetooth:{println(value){for(const[id,client]of clients)if(client.kind==='puck')send({type:'web-socket',clientId:id,event:'data',args:[String(value)+'\r\n']});}},
  setWatch(callback,pin,options={}){if(pin!=='BTN')throw new Error('The selected Puck model supports BTN watches.');const id=++watchId;watches.set(id,{callback,pin,options,lastAt:-Infinity});return id;},
  clearWatch(id){if(id===undefined)watches.clear();else watches.delete(id);},
  setTimeout:(fn,ms)=>later(fn,ms),setInterval:(fn,ms)=>later(fn,ms,true),clearTimeout:clear,clearInterval:clear,
  reset(){for(const timer of timers)clear(timer);watches.clear();for(const pin of ['LED1','LED2','LED3'])output(pin,0);},
  trace:value=>send({type:'console',level:'log',args:[String(value)]})};
 const pins={configuration:null,
  configure(configuration,callback){const compass=configuration?.compass,p=compass?.pins;
   if(compass?.require!=='HMC5883L'||p?.compass?.sda!==13||p?.compass?.clock!==14||p?.power?.pin!==11||p?.ground?.pin!==12)throw new Error('The selected Kinoma Pins model requires the book compass on SDA13/SCL14, power11/ground12.');
   pins.configuration=configuration;later(()=>callback(!!devices.compass?.().connected),0);},
  repeat(path,ms,callback){if(path!=='/compass/read'||!pins.configuration)throw new Error('Configure the book compass before calling Pins.repeat.');return later(()=>{const model=devices.compass?.();if(model?.connected)callback(Number(model.heading));},ms,true);},
  invoke(path,callback){if(path!=='/compass/read')throw new Error('Only the selected compass read API is available.');const model=devices.compass?.();if(!model?.connected)throw new Error('Connect and power the Kinoma compass before reading.');callback(Number(model.heading));},
  close(){for(const timer of timers)clear(timer);pins.configuration=null;}};
 class WebSocketServer extends EventEmitter{
  constructor(port){super();this.port=Number(port);servers.add(this);
   const html=files['index.html']||files['/index.html'];if(html)send({type:'web-preview',html,port:this.port,mode:'virtual-kinoma-websocket',message:'Virtual Kinoma WebSocket API preview; no native socket or CPU.'});}
  close(){servers.delete(this);for(const[id,client]of clients)if(client.kind==='raw'&&client.server===this){client.onclose?.();clients.delete(id);}}
 }
 const names=Object.keys(globals),values=Object.values(globals);
 function executePuck(code){code=String(code).replace(/^\x10/,'').trim();new Function(...names,code)(...values);}
 return {modules:{pins,websocket:{WebSocketServer}},globals,
  handle(message){const id=message.clientId;
   if(message.action==='raw-connect'){
    const server=[...servers].find(s=>!message.port||s.port===Number(message.port));if(!server)throw new Error('Start the virtual Kinoma WebSocket server before connecting.');
    const client={kind:'raw',server,send(data){send({type:'web-socket',clientId:id,event:'message',args:[{data:String(data)}]});}};clients.set(id,client);server.onStart?.(client);
   }else if(message.action==='raw-event')clients.get(id)?.onmessage?.({data:message.data??message.args?.[0]});
   else if(message.action==='puck-connect'){clients.set(id,{kind:'puck'});send({type:'web-socket',clientId:id,event:'connected',args:[]});}
   else if(message.action==='puck-write'){if(!clients.has(id))clients.set(id,{kind:'puck'});executePuck(message.code??message.data??message.args?.[0]??'');send({type:'web-socket',clientId:id,event:'write-complete',args:[message.requestId]});}
   else if(message.action==='disconnect'){const client=clients.get(id);client?.onclose?.();clients.delete(id);}
  },
  input(pin,value){const index=typeof pin==='number'?pin:io.labels.indexOf(pin);if(index<0)throw new Error('Unknown virtual Puck input.');if(io.input)io.input(index,value);else{const previous=io.pins[index].value;io.pins[index].value=value;notifyInput({pin:io.labels[index],value,previous});}},
  dispose(){for(const timer of timers)clear(timer);watches.clear();clients.clear();servers.clear();io?.removeListener('input',notifyInput);},
  capabilities:{kinoma:'Pins.configure/repeat HMC5883L heading model + in-memory WebSocketServer',puck:'LED set/reset, BTN watches/debounce, reset and virtual Bluetooth serial text',nativeCPU:false,bluetoothRadio:false,nativeNetwork:false,compassHelper:'original virtual adapter; GPL-derived helper not bundled'}
 };
}
function adaptKinomaEntry(source){return source.replace(/import\s+Pins\s+from\s+['"]pins['"];?/,'const Pins=require("pins");').replace(/import\s*\{\s*WebSocketServer\s*\}\s*from\s*['"]websocket['"];?/,'const {WebSocketServer}=require("websocket");').replace('clients.remove(client)','clients.delete(client)').replace(/export\s+default\s+main\s*;/,'module.exports=main; main.onLaunch();');}
module.exports={createAdvancedModules,adaptKinomaEntry};
