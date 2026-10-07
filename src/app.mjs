import '@wokwi/elements';
import {EditorView, keymap} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';

const $ = (selector) => document.querySelector(selector);
const lessonList = [
  {id:'blink',label:'Blink a light',title:'Make a light blink.',description:'Meet the “hello, world” of electronics. Run the code, then change 500 to 100 and run it again.',challenge:'How slow can you make the LED blink? Try 2000 milliseconds.',scene:'led',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  console.log("Hello, little circuit!");
  const light = new five.Led(13);
  light.blink(500);
});`},
  {id:'count',label:'Count the blinks',title:'Give your light a finish line.',description:'A callback runs each time the light changes. Count those changes and tell it when to stop.',challenge:'Can you make it stop after 6 changes instead of 10? What happens if you add light.off() after light.stop()?',scene:'led',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(13);
  let changes = 0;

  light.blink(500, () => {
    changes += 1;
    console.log("Light changed:", changes);
    if (changes === 10) {
      light.stop();
      light.off();
      console.log("Finished!");
    }
  });
});`},
  {id:'button',label:'Press a button',title:'Let your circuit listen.',description:'Run your code, then press the virtual button. An input tells the board something has happened.',challenge:'Try changing the press handler to light.blink(150). Keep light.stop().off() in the release handler.',scene:'button',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(13);
  const button = new five.Button({
    pin: 2,
    isPullup: true
  });

  button.on("press", () => {
    light.on();
    console.log("Button pressed!");
  });
  button.on("release", () => {
    light.stop().off();
    console.log("Button released.");
  });
});`},
  {id:'fade',label:'Fade a light',title:'Explore the in-between.',description:'Pin 11 can change the brightness of the external LED. Watch it grow brighter and dimmer.',challenge:'Try light.brightness(80) instead of light.pulse(1500). Brightness ranges from 0 to 255.',scene:'fade',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(11);
  light.pulse(1500);
  console.log("A little wave of light.");
});`},
  {id:'dial',label:'Turn a dial',title:'Turn a little. Change a lot.',description:'Run your code and move the dial’s slider. Analog input lets your circuit read more than on or off.',challenge:'Try using the dial to change blink speed: light.blink(five.Fn.map(this.value, 0, 1023, 50, 1500)).',scene:'dial',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const light = new five.Led(11);
  const dial = new five.Sensor("A0");

  dial.on("change", function () {
    const brightness = five.Fn.map(
      this.value, 0, 1023, 0, 255
    );
    light.brightness(brightness);
    console.log("Dial:", this.value);
  });
});`},
  {id:'servo',label:'Move a motor',title:'Make your code move.',description:'A servo rotates to the angle you choose. Run this experiment and watch its arm sweep.',challenge:'Try motor.to(45) instead of motor.sweep(). Then try 90 and 135 degrees.',scene:'servo',code:`const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  const motor = new five.Servo(9);
  motor.sweep();
  console.log("Watch the servo arm!");
});`}
];
const shapes = {
  uno:{tag:'wokwi-arduino-uno',name:'Arduino Uno',w:274.3,h:201.6,scale:1.3},
  led:{tag:'wokwi-led',name:'LED',w:40,h:50,scale:1.3},
  resistor:{tag:'wokwi-resistor',name:'330 Ω resistor',w:58.8,h:11.3,scale:1.2},
  button:{tag:'wokwi-pushbutton',name:'Button',w:67,h:45,scale:1.2},
  pot:{tag:'wokwi-potentiometer',name:'Dial',w:75.6,h:75.6,scale:1.2},
  servo:{tag:'wokwi-servo',name:'Servo',w:170.08,h:119.55,scale:1}
};
let lessonIndex=0, parts=[], wires=[], wireStart=null, selectedPart=null, worker=null, running=false, boardReady=false, snapshot=null, previousInputs={}, saveTimer, toastTimer, sceneVersion=0;
let editor;
const storageKey='little-circuit-lab-v1';
const displayTime=()=>new Date().toLocaleTimeString([], {hour12:false});
function log(message,level='log') {
  const root=$('#console');root.querySelector('.console-empty')?.remove();
  const line=document.createElement('div');line.className=`console-line ${level}`;
  const time=document.createElement('time');time.textContent=displayTime();
  const text=document.createElement('span');text.textContent=String(message).slice(0,5000);
  line.append(time,text);root.append(line);
  while(root.childElementCount>150)root.firstElementChild.remove();root.scrollTop=root.scrollHeight;
}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3500)}
function setStatus(kind,text){$('#status').className=`status ${kind}`;$('#status').textContent=text;$('#run').disabled=running;$('#stop').disabled=!running}
function serialize(){return {version:1,lesson:lessonList[lessonIndex].id,code:editor.state.doc.toString(),parts:parts.map(({id,type,x,y,value})=>({id,type,x,y,value})),wires:wires.map(w=>({...w}))}}
function save(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(storageKey,JSON.stringify(serialize()));$('#code-save').textContent='Saved on this device'}catch{$('#code-save').textContent='Use Download to save'}},400)}
function replaceCode(text){editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:text}})}
function freshScene(kind){
  const nodes=[{id:'board',type:'uno',x:65,y:90}];const links=[];
  if(kind==='servo'){
    nodes.push({id:'motor',type:'servo',x:470,y:125});links.push({a:'board:9',b:'motor:PWM'},{a:'board:5V',b:'motor:V+'},{a:'board:GND.2',b:'motor:GND'});
  }else{
    nodes.push({id:'light',type:'led',x:554,y:117},{id:'resistor',type:'resistor',x:453,y:220});
    links.push({a:`board:${kind==='fade'||kind==='dial'?11:13}`,b:'resistor:1'},{a:'resistor:2',b:'light:A'},{a:'board:GND.1',b:'light:C'});
    if(kind==='button'){nodes.push({id:'switch',type:'button',x:516,y:316,value:0});links.push({a:'board:2',b:'switch:1.l'},{a:'board:GND.2',b:'switch:2.l'})}
    if(kind==='dial'){nodes.push({id:'dial',type:'pot',x:500,y:299,value:512});links.push({a:'board:A0',b:'dial:SIG'},{a:'board:5V',b:'dial:VCC'},{a:'board:GND.2',b:'dial:GND'})}
  }
  return {parts:nodes,wires:links};
}
function setLesson(index,{reset=true}={}){
  stop();lessonIndex=index;const lesson=lessonList[index];
  $('#lesson-title').textContent=lesson.title;$('#lesson-description').textContent=lesson.description;$('#challenge').textContent=lesson.challenge;$('#lesson-number').textContent=String(index+1).padStart(2,'0');$('#filename').textContent=lesson.id+'.js';
  document.querySelectorAll('.lesson-tab').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'step':'false')});
  if(reset){replaceCode(lesson.code);const scene=freshScene(lesson.scene);parts=scene.parts;wires=scene.wires;renderScene()}
  save();
}
function isValidProject(p){
  if(!p||p.version!==1||typeof p.code!=='string'||p.code.length>60000||!Array.isArray(p.parts)||p.parts.length<1||p.parts.length>20||!Array.isArray(p.wires)||p.wires.length>100)return false;
  const seen=new Set();
  for(const n of p.parts){if(!n||typeof n.id!=='string'||!/^[-\w]{1,40}$/.test(n.id)||seen.has(n.id)||!Object.hasOwn(shapes,n.type)||!Number.isFinite(n.x)||!Number.isFinite(n.y))return false;seen.add(n.id)}
  if(p.parts.filter(n=>n.type==='uno').length!==1)return false;
  return p.wires.every(w=>w&&typeof w.a==='string'&&typeof w.b==='string'&&w.a.length<80&&w.b.length<80);
}
function loadProject(p){if(!isValidProject(p))throw new Error('This file does not look like a Little Circuit Lab project.');
  const idx=Math.max(0,lessonList.findIndex(l=>l.id===p.lesson));setLesson(idx,{reset:false});replaceCode(p.code);parts=p.parts.map(n=>({...n,x:Math.max(0,Math.min(720-shapes[n.type].w*shapes[n.type].scale-4,n.x)),y:Math.max(0,Math.min(430-shapes[n.type].h*shapes[n.type].scale-42,n.y)),value:Number.isFinite(n.value)?Math.max(0,Math.min(1023,n.value)):0}));wires=p.wires.map(w=>({a:w.a,b:w.b}));renderScene();save();
}
function fitStage(){const viewport=$('#circuit-viewport');const scale=Math.min(viewport.clientWidth/720,viewport.clientHeight/430);const stage=$('#circuit-stage');stage.style.transform=`scale(${scale})`;stage.style.left=`${Math.max(0,(viewport.clientWidth-720*scale)/2)}px`;stage.style.top=`${Math.max(0,(viewport.clientHeight-430*scale)/2)}px`}
new ResizeObserver(fitStage).observe($('#circuit-viewport'));
function selectPart(id){selectedPart=id;document.querySelectorAll('.part').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));$('#remove-part').disabled=!id||parts.find(p=>p.id===id)?.type==='uno'}
async function renderScene(){
  const version=++sceneVersion;wireStart=null;selectedPart=null;$('#remove-part').disabled=true;$('#parts').replaceChildren();$('#wires').replaceChildren();previousInputs={};
  for(const part of parts){
    const spec=shapes[part.type];const root=document.createElement('div');root.className='part';root.dataset.id=part.id;root.style.left=part.x+'px';root.style.top=part.y+'px';part.root=root;
    const label=document.createElement('button');label.className='part-label';label.textContent=spec.name;label.setAttribute('aria-label',`Move or select ${spec.name}`);label.addEventListener('click',()=>selectPart(part.id));root.append(label);
    const body=document.createElement('div');body.className='part-body';body.style.width=spec.w*spec.scale+'px';body.style.height=spec.h*spec.scale+'px';
    const element=document.createElement(spec.tag);element.style.transform=`scale(${spec.scale})`;element.style.transformOrigin='top left';element.style.position='absolute';element.style.left='0';element.style.top='0';part.el=element;
    if(part.type==='led'){element.color='#ff7849';element.value=false;element.brightness=0}
    if(part.type==='uno'){element.ledPower=running;element.led13=false}
    if(part.type==='resistor')element.value='330';
    if(part.type==='pot')element.value=part.value??512;
    if(part.type==='button'){element.color='#194ced';element.addEventListener('button-press',()=>buttonInput(part,true));element.addEventListener('button-release',()=>buttonInput(part,false))}
    body.append(element);root.append(body);$('#parts').append(root);part.body=body;
    await element.updateComplete;
    if(version!==sceneVersion)return;
    part.pins=element.pinInfo??[];
    for(const pin of part.pins){if(part.type==='uno'&&!/^(\d+|A\d|GND\.\d|5V|3\.3V)$/.test(pin.name))continue;
      const key=part.id+':'+pin.name;const node=document.createElement('button');node.className='pin';node.style.left=pin.x*spec.scale+'px';node.style.top=pin.y*spec.scale+'px';node.dataset.endpoint=key;node.dataset.label=pin.name;node.title=spec.name+' '+pin.name;node.setAttribute('aria-label',`Connect ${spec.name} pin ${pin.name}`);node.addEventListener('click',e=>{e.stopPropagation();connectPin(key)});body.append(node);
    }
    if(part.type==='uno'){const note=document.createElement('div');note.className='part-builtin-note';note.textContent='Built-in light · pin 13';root.append(note)}
    if(part.type==='button'){const toggle=document.createElement('button');toggle.className='push-toggle';toggle.addEventListener('click',()=>{const down=!part.value;element.pressed=down;buttonInput(part,down)});root.append(toggle);part.toggle=toggle;element.pressed=!!part.value;buttonInput(part,!!part.value)}
    if(part.type==='pot'){const wrap=document.createElement('label');wrap.className='dial-input';wrap.textContent='Turn';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='1023';slider.value=String(part.value??512);slider.setAttribute('aria-label','Dial value');slider.addEventListener('input',()=>{part.value=Number(slider.value);element.value=part.value;syncInputs();save()});element.addEventListener('input',()=>{part.value=Number(element.value);slider.value=String(part.value);syncInputs();save()});wrap.append(slider);root.append(wrap)}
    label.addEventListener('pointerdown',event=>{
      const factor=$('#circuit-stage').getBoundingClientRect().width/720;const initial={x:part.x,y:part.y,clientX:event.clientX,clientY:event.clientY};label.setPointerCapture(event.pointerId);selectPart(part.id);
      const move=e=>{part.x=Math.max(3,Math.min(720-spec.w*spec.scale-4,initial.x+(e.clientX-initial.clientX)/factor));part.y=Math.max(3,Math.min(430-spec.h*spec.scale-42,initial.y+(e.clientY-initial.clientY)/factor));root.style.left=part.x+'px';root.style.top=part.y+'px';drawWires()};
      const end=()=>{label.removeEventListener('pointermove',move);label.removeEventListener('pointerup',end);label.removeEventListener('pointercancel',end);save()};label.addEventListener('pointermove',move);label.addEventListener('pointerup',end);label.addEventListener('pointercancel',end);
    });
  }
  wires=wires.filter(w=>endpoint(w.a)&&endpoint(w.b));drawWires();syncInputs();updateComponents();fitStage();setWireHint();
}
function buttonInput(part,pressed){part.value=pressed?1:0;part.toggle?.classList.toggle('active',pressed);part.toggle?.setAttribute('aria-pressed',String(pressed));if(part.toggle)part.toggle.textContent=pressed?'Release button':'Hold button';syncInputs()}
function endpoint(key){const pos=key.indexOf(':');const id=key.slice(0,pos),name=key.slice(pos+1);const part=parts.find(p=>p.id===id),pin=part?.pins?.find(p=>p.name===name);if(!pin)return null;const spec=shapes[part.type];return {x:part.x+pin.x*spec.scale,y:part.y+(part.body?.offsetTop??33)+pin.y*spec.scale,part,pin}}
function setWireHint(){document.querySelectorAll('.pin').forEach(p=>p.classList.toggle('selected',p.dataset.endpoint===wireStart));$('#cancel-wire').hidden=!wireStart;$('#wire-hint').textContent=wireStart?`Now click the other pin. Connecting from ${wireStart.replace(':',' · ')}.`:'Click two gold pins to connect them. Click a wire to remove it.'}
function connectPin(key){if(!wireStart){wireStart=key}else{if(wireStart!==key&&!wires.some(w=>w.a===wireStart&&w.b===key||w.a===key&&w.b===wireStart)){wires.push({a:wireStart,b:key});drawWires();syncInputs();updateComponents();save()}wireStart=null}setWireHint()}
function wireColor(w){if(/:GND|:C$|:2\.l$/.test(w.a+w.b))return '#64748b';if(/:5V|:VCC|:V\+/.test(w.a+w.b))return '#ed6f48';return '#194ced'}
function drawWires(){
  const svg=$('#wires');svg.replaceChildren();for(const [i,w]of wires.entries()){const a=endpoint(w.a),b=endpoint(w.b);if(!a||!b)continue;
    const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.classList.add('wire');const mid=a.x+(b.x-a.x)*.5;
    line.setAttribute('d',`M ${a.x} ${a.y} L ${mid} ${a.y} L ${mid} ${b.y} L ${b.x} ${b.y}`);line.setAttribute('stroke',wireColor(w));line.setAttribute('tabindex','0');line.setAttribute('role','button');line.setAttribute('aria-label',`Remove wire ${w.a} to ${w.b}`);
    const remove=()=>{wires.splice(i,1);drawWires();syncInputs();updateComponents();save();toast('Wire removed')};line.addEventListener('click',remove);line.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove()}});svg.append(line);
  }
}
function netlist(){
  const parent=new Map();const find=k=>{if(!parent.has(k))parent.set(k,k);if(parent.get(k)!==k)parent.set(k,find(parent.get(k)));return parent.get(k)};const union=(a,b)=>parent.set(find(a),find(b));
  for(const w of wires)union(w.a,w.b);
  for(const p of parts){if(p.type==='resistor')union(p.id+':1',p.id+':2');if(p.type==='button'){union(p.id+':1.l',p.id+':1.r');union(p.id+':2.l',p.id+':2.r');if(p.value)union(p.id+':1.l',p.id+':2.l')}
    if(p.type==='uno'){for(const pin of p.pins??[])if(pin.name.startsWith('GND'))union(p.id+':'+pin.name,p.id+':GROUND')}
  }
  const board=parts.find(p=>p.type==='uno');const connected=(a,b)=>find(a)===find(b);const boardPins=key=>{const list=[];for(const pin of board?.pins??[]){if(connected(key,board.id+':'+pin.name))list.push(pin.name)}return list};
  return {connected,board,boardPins,ground:key=>connected(key,board?.id+':GROUND'),power:key=>boardPins(key).includes('5V')||boardPins(key).includes('3.3V')};
}
function syncInputs(){if(!worker)return;const net=netlist();const next={};for(let i=0;i<20;i++)next[i]=net.ground(net.board.id+':'+(i<14?i:'A'+(i-14)))?0:1;for(let i=0;i<6;i++)next['A'+i]=0;
  for(const p of parts){
    if(p.type==='pot'&&net.ground(p.id+':GND')&&net.power(p.id+':VCC')){for(const pin of net.boardPins(p.id+':SIG')){if(/^A[0-5]$/.test(pin))next[pin]=p.value??512}}
  }
  for(const[pin,value]of Object.entries(next))if(previousInputs[pin]!==value)worker.postMessage({type:'input',pin:pin.startsWith('A')?pin:Number(pin),value});previousInputs=next;
}
function updateComponents(){const net=netlist();for(const p of parts){if(!p.el)continue;if(p.type==='uno'){p.el.ledPower=running;p.el.led13=!!snapshot?.digital?.[13]&&running;p.el.ledTX=boardReady&&!!snapshot?.activity?.tx;p.el.ledRX=boardReady&&!!snapshot?.activity?.rx}
    if(p.type==='led'){const pins=net.boardPins(p.id+':A');let brightness=0;if(running&&net.ground(p.id+':C')){if(pins.includes('5V')||pins.includes('3.3V'))brightness=1;for(const pin of pins)if(/^\d+$/.test(pin)){const i=Number(pin);brightness=Math.max(brightness,snapshot?.pwm?.[i]??(snapshot?.digital?.[i]?1:0))}}p.el.value=brightness>0;p.el.brightness=brightness;p.el.setAttribute('aria-label',`LED ${brightness>0?'on':'off'}`)}
    if(p.type==='servo'){if(running&&net.ground(p.id+':GND')&&net.power(p.id+':V+')){for(const pin of net.boardPins(p.id+':PWM'))if(snapshot?.servo?.[pin]!==undefined)p.el.angle=snapshot.servo[pin]}else p.el.angle=90}
  }}
function stop({silent=true}={}){worker?.terminate();worker=null;running=false;boardReady=false;snapshot=null;previousInputs={};setStatus('idle','Ready to try');updateComponents();if(!silent)log('Stopped. The virtual board has been reset.','system')}
function run(){
  stop();running=true;setStatus('connecting','Connecting…');$('#console').replaceChildren();log('Starting your virtual Arduino…','system');
  try{worker=new Worker('/assets/runtime.worker.js');worker.addEventListener('message',({data})=>{
    if(data.type==='status'){if(data.status==='ready'){boardReady=true;setStatus('running','Running');log('Arduino connected. Your code is running.','system')}else if(data.status==='error'){log(data.message??'The program stopped.','error');stop();setStatus('error','Check your code')}else if(data.status==='connecting')setStatus('connecting','Connecting…')}
    if(data.type==='console')log((data.args??[]).join(' '),data.level);
    if(data.type==='pins'){snapshot=data;updateComponents()}
  });worker.addEventListener('error',event=>{log(event.message??'The program could not start.','error');stop();setStatus('error','Check your code')});
    worker.postMessage({type:'run',code:editor.state.doc.toString()});previousInputs={};syncInputs();updateComponents();
  }catch(error){log(error.message,'error');stop();setStatus('error','Could not start')}
}
const theme=EditorView.theme({'&':{fontSize:'14px'},'.cm-content':{caretColor:'#194ced'},'&.cm-focused .cm-selectionBackground, .cm-selectionBackground':{backgroundColor:'#dae5ff'}});
editor=new EditorView({state:EditorState.create({doc:lessonList[0].code,extensions:[basicSetup,javascript(),theme,EditorView.contentAttributes.of({'aria-label':'JavaScript code editor'}),keymap.of([{key:'Mod-Enter',run:()=>{run();return true}}]),EditorView.updateListener.of(update=>{if(update.docChanged)save()})]}),parent:$('#editor')});
for(const[l,lesson]of lessonList.entries()){const button=document.createElement('button');button.className='lesson-tab';const number=document.createElement('span');number.className='step';number.textContent=String(l+1).padStart(2,'0');button.append(number,document.createTextNode(lesson.label));button.addEventListener('click',()=>setLesson(l));$('.lessons').append(button)}
$('#run').addEventListener('click',run);$('#stop').addEventListener('click',()=>stop({silent:false}));$('#reset-code').addEventListener('click',()=>{replaceCode(lessonList[lessonIndex].code);toast('Example code restored')});
$('#reset-circuit').addEventListener('click',()=>{const s=freshScene(lessonList[lessonIndex].scene);parts=s.parts;wires=s.wires;renderScene();save();toast('Example circuit restored')});
$('#cancel-wire').addEventListener('click',()=>{wireStart=null;setWireHint()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){wireStart=null;selectPart(null);setWireHint()}});
$('#add-component').addEventListener('change',e=>{const type=e.target.value;if(!type)return;if(parts.length>=20){toast('This lab supports up to 20 parts.');e.target.value='';return}const id=type+'-'+Date.now().toString(36);parts.push({id,type,x:480+(parts.length%3)*35,y:130+(parts.length%3)*70,value:type==='pot'?512:0});renderScene();save();e.target.value='';toast('Part added. Connect its gold pins.')});
$('#remove-part').addEventListener('click',()=>{const id=selectedPart;if(!id||parts.find(p=>p.id===id)?.type==='uno')return;parts=parts.filter(p=>p.id!==id);wires=wires.filter(w=>!w.a.startsWith(id+':')&&!w.b.startsWith(id+':'));renderScene();save()});
$('#clear-console').addEventListener('click',()=>$('#console').replaceChildren());$('#learn-toggle').addEventListener('click',()=>{$('#explanation').hidden=!$('#explanation').hidden;$('#learn-toggle').textContent=$('#explanation').hidden?'How does it work?':'Hide explanation'});
$('#about-open').addEventListener('click',()=>$('#about').showModal());$('#about-close').addEventListener('click',()=>$('#about').close());$('#about').addEventListener('click',e=>{if(e.target===$('#about')){const r=$('#about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#about').close()}});
$('#download-project').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(serialize(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=lessonList[lessonIndex].id+'-circuit.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('#open-project').addEventListener('click',()=>$('#project-file').click());$('#project-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>150000)throw new Error('This project file is too large.');loadProject(JSON.parse(await file.text()));toast('Project opened. Press Run when you’re ready.')}catch(error){toast(error.message)}e.target.value=''});
async function encodeProject(){const bytes=new TextEncoder().encode(JSON.stringify(serialize()));const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));const compressed=new Uint8Array(await new Response(stream).arrayBuffer());let binary='';for(const byte of compressed)binary+=String.fromCharCode(byte);return btoa(binary).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
async function decodeProject(encoded){if(encoded.length>120000)throw new Error('The shared project is too large.');const raw=atob(encoded.replaceAll('-','+').replaceAll('_','/'));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));const reader=stream.getReader();let output='',size=0;const decoder=new TextDecoder();while(true){const{done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>150000){await reader.cancel();throw new Error('The shared project is too large.')}output+=decoder.decode(value,{stream:true})}output+=decoder.decode();return JSON.parse(output)}
$('#share').addEventListener('click',async()=>{try{const hash=await encodeProject();$('#share-link').value=location.origin+location.pathname+'#project='+hash;$('#share-status').textContent='';$('#share-dialog').showModal()}catch{toast('Could not create a link. Use Download project to share a file.')}});
$('#share-close').addEventListener('click',()=>$('#share-dialog').close());
$('#copy-share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#share-link').value);$('#share-status').textContent='Link copied!'}catch{$('#share-link').focus();$('#share-link').select();$('#share-status').textContent='Select and copy the link above.'}});
setLesson(0);
try{if(location.hash.startsWith('#project=')){loadProject(await decodeProject(location.hash.slice(9)));toast('Shared project opened. Press Run when you’re ready.')}else{const saved=localStorage.getItem(storageKey);if(saved)loadProject(JSON.parse(saved))}}catch{toast('Could not open that project. The first experiment is ready.')}
window.addEventListener('beforeunload',()=>{worker?.terminate();try{localStorage.setItem(storageKey,JSON.stringify(serialize()))}catch{}});
// Optional browser-agent tools mirror the visible controls.
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();
  const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}};
  register({name:'read_circuit_lab',description:'Read the current code, circuit connections and running state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({...serialize(),running,ready:boardReady})});
  register({name:'configure_circuit_lab_code',description:'Replace the JavaScript shown in the editor without running it.',inputSchema:{type:'object',properties:{code:{type:'string',maxLength:60000}},required:['code'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{if(!input||typeof input.code!=='string'||input.code.length>60000)throw new Error('code must be a string of at most 60000 characters');replaceCode(input.code);return {configured:true,running}}});
  register({name:'run_circuit_lab',description:'Run the code currently shown in the editor against the virtual Arduino.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:()=>{run();return {started:true}}});
  register({name:'stop_circuit_lab',description:'Stop the running program and reset the virtual Arduino.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{stop({silent:false});return {stopped:true}}});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
