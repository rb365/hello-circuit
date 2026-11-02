import '@wokwi/elements';
import {EditorView, keymap, placeholder} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {definitions, initializeComponent, applyComponentState, deviceInputValues} from './components.mjs';
import {analyzeCircuit} from './circuit.mjs';
import {examples} from './examples.mjs';
import {chapters, bookExamples} from './book.mjs';
import {routeWires} from './wire-routing.mjs';
import {applyHistoryState} from './circuit-history.mjs';
import {viewportWorldBounds,gridGeometry,fitCamera,zoomCamera} from './workspace-camera.mjs';
import {resolveProjectStartup} from './project-startup.mjs';

const $ = selector => document.querySelector(selector);
const isBoard = type => type==='uno'||definitions[type]?.isBoard;
const storageKey='little-circuit-lab-workbench-v2';
let project,editor,parts=[],wires=[],worker=null,running=false,ready=false,snapshot={},analysis,wireStart=null,selectedPart=null,selectedWire=null;
let sceneVersion=0,suppressSave=false,saveTimer,toastTimer,undoProject=null,fileAction='add',previousInputs={},previousDevices='',previousPeripherals='',evalId=0;
let camera={x:0,y:0,scale:1},audio=null,tones=new Map();
let hoveredWire=null,wireGeometryKey='',wireRoutes=[],pinLabelBounds=[];
let placement=null,pointerWorld=null,wireCandidate=null,pinBankPartId=null,buildNotice='',pointerFrame=0;
const circuitUndo=[],circuitRedo=[];
let restoringCircuit=false,historyBusy=false,suppressPlacementClick=false;
let activeGesture=null,hoverPin=null,detailTab='pins',renderedPinPartId=null;
const circuitState=()=>({parts:parts.map(cleanPart),wires:wires.map(w=>({...w}))});
const cloneState=value=>JSON.parse(JSON.stringify(value));
function recordCircuit(before,label,{merge=false}={}){
 if(restoringCircuit)return;const after=cloneState(circuitState());if(JSON.stringify(before)===JSON.stringify(after))return;
 const previous=circuitUndo.at(-1),now=Date.now();
 if(merge&&previous?.label===label&&now-previous.at<500&&JSON.stringify(previous.after)===JSON.stringify(before)){previous.after=after;previous.at=now;}
 else circuitUndo.push({before:cloneState(before),after,label,at:now});
 if(circuitUndo.length>60)circuitUndo.shift();circuitRedo.length=0;updateHistory();
}
function updateHistory(){for(const [id,stack]of [['circuit-undo',circuitUndo],['circuit-redo',circuitRedo]]){const button=$('#'+id);if(!button)continue;button.disabled=historyBusy||!stack.length;button.title=stack.length?`${id==='circuit-undo'?'Undo':'Redo'}: ${stack.at(-1).label}`:id==='circuit-undo'?'No circuit edits to undo':'No circuit edits to redo';}}
async function stepHistory(redo=false){
 if(historyBusy)return;if(activeGesture||placement||wireStart){cancelBuild();return;}const source=redo?circuitRedo:circuitUndo,target=redo?circuitUndo:circuitRedo,item=source.pop();if(!item)return;historyBusy=true;updateHistory();
 cancelBuild();restoringCircuit=true;const state=applyHistoryState(circuitState(),redo?item.before:item.after,redo?item.after:item.before);
 parts=state.parts;wires=state.wires;project.parts=parts;project.wires=wires;selectedPart=null;selectedWire=null;
 try{await renderScene();target.push(item);buildNotice=`${redo?'Redid':'Undid'} ${item.label[0].toLowerCase()+item.label.slice(1)}.`;save();updateBuildContext();}finally{restoringCircuit=false;historyBusy=false;updateHistory();}
}
function componentName(part){const siblings=parts.filter(p=>p.type===part.type);return definitions[part.type].name.split(' · ')[0]+(siblings.length>1&&siblings.includes(part)?' '+(siblings.indexOf(part)+1):'');}
function worldPoint(event){const bounds=$('#circuit-viewport').getBoundingClientRect();return {x:(event.clientX-bounds.left-camera.x)/camera.scale,y:(event.clientY-bounds.top-camera.y)/camera.scale};}
function keepPartVisible(id){
 const part=parts.find(p=>p.id===id),view=$('#circuit-viewport');if(!part||!part.root||!view.clientWidth)return;
 const margin=24,width=definitions[part.type].w*definitions[part.type].scale*camera.scale,height=part.root.offsetHeight*camera.scale;
 const x=part.x*camera.scale+camera.x,y=part.y*camera.scale+camera.y;
 if(width>view.clientWidth-margin*2)camera.x+=(view.clientWidth-width)/2-x;
 else if(x<margin)camera.x+=margin-x;else if(x+width>view.clientWidth-margin)camera.x+=view.clientWidth-margin-x-width;
 if(height>view.clientHeight-margin*2)camera.y+=(view.clientHeight-height)/2-y;
 else if(y<margin)camera.y+=margin-y;else if(y+height>view.clientHeight-margin)camera.y+=view.clientHeight-margin-y-height;
 transform();drawPendingWire();
}
function sizeWorkspace(){const area=$('.circuit-work-area');if(document.body.classList.contains('circuit-focus')){const bankHeight=matchMedia('(max-width:760px)').matches?$('#pin-bank').offsetHeight:0,remaining=window.innerHeight-area.getBoundingClientRect().top-$('.circuit-footer').offsetHeight-18-bankHeight;area.style.setProperty('--circuit-height',Math.max(220,remaining)+'px');}else area.style.removeProperty('--circuit-height');}
function centerPoint(){const view=$('#circuit-viewport');return {x:(view.clientWidth/2-camera.x)/camera.scale,y:(view.clientHeight/2-camera.y)/camera.scale};}
function nativeControl(event){return event.composedPath().some(node=>node instanceof Element&&(node.matches('input,select,textarea,button,[role="button"],[role="slider"]')||node.hasAttribute('data-board-button')||node.hasAttribute('data-gesture')));}
function closestPin(point,pointerType='mouse'){
 let best=null,distance=pointerType==='touch'?24:14;
 for(const node of $('#parts').querySelectorAll('.pin')){const key=node.dataset.endpoint;if(key===wireStart)continue;const pin=endpoint(key);if(!pin)continue;const d=Math.hypot((pin.x-point.x)*camera.scale,(pin.y-point.y)*camera.scale);if(d<distance){distance=d;best=key;}}
 return best;
}
function updateBuildContext(){
 const pending=!!placement||!!wireStart,context=$('#build-context'),text=$('#build-context-text');let message;
 if(placement)message=`Place ${definitions[placement.type].name.split(' · ')[0]}: click or tap the canvas. Enter places it in the center; Esc cancels.`;
 else if(wireStart)message=`From ${pinDescription(wireStart).text} → ${wireCandidate?pinDescription(wireCandidate).text+'. Click to connect.':'choose a destination pin.'}`;
 else message=buildNotice||'Add a part, then place it. Select a gold pin or choose one from the pin list to connect.';
 if(text&&text.textContent!==message)text.textContent=message;context?.classList.toggle('context-active',pending);if($('#build-cancel'))$('#build-cancel').hidden=!pending;
}
function cancelBuild(){activeGesture?.cancel();placement=null;wireStart=null;wireCandidate=null;buildNotice='';$('#placement-ghost').hidden=true;drawPendingWire();updateWireHighlights();}
function showDetailTab(name){
 detailTab=name;
 for(const tab of ['pins','details']){
  const button=$('#'+tab+'-tab'),panel=$('#'+tab+'-panel');
  if(button){button.setAttribute('aria-selected',String(tab===name));button.tabIndex=tab===name?0:-1;}
  if(panel)panel.hidden=tab!==name;
 }
}
function showPinTooltip(key){
 hoverPin=key;const tip=$('#pin-tooltip');if(!tip)return;
 const point=key&&endpoint(key);tip.hidden=!point;if(!point)return;
 tip.textContent=pinDescription(key).text;
 const view=$('#circuit-viewport'),width=tip.offsetWidth;
 tip.style.left=Math.max(8,Math.min(view.clientWidth-width-8,point.x*camera.scale+camera.x-width/2))+'px';
 const y=point.y*camera.scale+camera.y;
 tip.style.top=(y<45?y+20:Math.min(view.clientHeight-tip.offsetHeight-8,y-tip.offsetHeight-16))+'px';
}
function suppressCanvasClick(){suppressPlacementClick=true;setTimeout(()=>{suppressPlacementClick=false;},0);}
function beginPartDrag(event,part,handle){
 if(event.button!==0||placement||wireStart||activeGesture)return;
 if(!handle&&nativeControl(event))return;
 // Real controls keep their normal press/turn behavior. Their name remains a move handle.
 if(!handle&&event.composedPath().some(n=>n instanceof Element&&n.matches('wokwi-pushbutton,wokwi-potentiometer,wokwi-slide-switch,[id="reset-button"]')))return;
 event.stopPropagation();event.preventDefault();
 const root=part.root,before=cloneState(circuitState());
 const start={x:part.x,y:part.y,cx:event.clientX,cy:event.clientY,scale:camera.scale};
 let moved=false,finished=false;
 select(part.id,null,{reveal:false});$('#circuit-viewport').focus({preventScroll:true});
 const move=e=>{
  if(e.pointerId!==event.pointerId)return;
  if(!moved&&Math.hypot(e.clientX-start.cx,e.clientY-start.cy)<4)return;
  moved=true;root.classList.add('dragging');showPinTooltip(null);
  part.x=start.x+(e.clientX-start.cx)/start.scale;
  part.y=start.y+(e.clientY-start.cy)/start.scale;
  root.style.left=part.x+'px';root.style.top=part.y+'px';drawWires();
 };
 const finish=(commit=true)=>{
  if(finished)return;finished=true;activeGesture=null;
  root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('lostpointercapture',cancel);
  if(root.hasPointerCapture(event.pointerId))root.releasePointerCapture(event.pointerId);
  root.classList.remove('dragging');
  if(!commit){part.x=start.x;part.y=start.y;root.style.left=part.x+'px';root.style.top=part.y+'px';drawWires();}
  else if(moved){recordCircuit(before,'Move '+componentName(part));save();buildNotice=componentName(part)+' moved. Undo brings it back.';updateBuildContext();}
  if(moved)suppressCanvasClick();
 };
 const up=e=>{if(e.pointerId===event.pointerId)finish(true);};
 const cancel=e=>{if(!e||e.pointerId===event.pointerId)finish(false);};
 activeGesture={cancel};root.setPointerCapture(event.pointerId);
 root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('lostpointercapture',cancel);
}
function beginPinDrag(event,key,node){
 if(event.button!==0||placement||activeGesture)return;
 // A second click completes the existing wire through the usual click handler.
 if(wireStart&&wireStart!==key)return;
 event.preventDefault();event.stopPropagation();
 const started=!wireStart,start={x:event.clientX,y:event.clientY};let moved=false,finished=false;
 if(started)connectPin(key);$('#circuit-viewport').focus({preventScroll:true});
 const move=e=>{if(e.pointerId!==event.pointerId)return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>4)moved=true;pointerWorld=worldPoint(e);wireCandidate=closestPin(pointerWorld,e.pointerType);updateWireHighlights();};
 const finish=(commit,e)=>{
  if(finished)return;finished=true;activeGesture=null;
  node.removeEventListener('pointermove',move);node.removeEventListener('pointerup',up);node.removeEventListener('pointercancel',cancel);node.removeEventListener('lostpointercapture',cancel);
  if(node.hasPointerCapture(event.pointerId))node.releasePointerCapture(event.pointerId);
  if(!commit){wireStart=null;wireCandidate=null;setWireHint();}
  else if(moved){const target=closestPin(worldPoint(e),e.pointerType);if(target)connectPin(target);else{wireCandidate=null;setWireHint();}}
  else if(!started)connectPin(key);
  suppressCanvasClick();
 };
 const up=e=>{if(e.pointerId===event.pointerId)finish(true,e);};
 const cancel=e=>{if(!e||e.pointerId===event.pointerId)finish(false,e);};
 activeGesture={cancel};node.setPointerCapture(event.pointerId);
 node.addEventListener('pointermove',move);node.addEventListener('pointerup',up);node.addEventListener('pointercancel',cancel);node.addEventListener('lostpointercapture',cancel);
}
function setPlacementPoint(point){if(!placement)return;const spec=definitions[placement.type];placement.x=point.x-spec.w*spec.scale/2;placement.y=point.y-spec.h*spec.scale/2-35;const ghost=$('#placement-ghost');ghost.style.left=placement.x+'px';ghost.style.top=placement.y+'px';}
function beginPlacement(type){
 if(parts.length>=60){toast('This project supports up to 60 components.');return;}cancelBuild();showDetailTab('pins');selectedWire=null;buildNotice='';const spec=definitions[type],settings={...spec.settings};for(const control of spec.controls??[])if(control.key!=='value')settings[control.key]=control.default;
 placement={type,settings,value:spec.defaultValue};const ghost=$('#placement-ghost');ghost.replaceChildren();ghost.style.width=spec.w*spec.scale+'px';ghost.style.height=(spec.h*spec.scale+35)+'px';
 const caption=document.createElement('div');caption.className='ghost-caption';caption.textContent=spec.name.split(' · ')[0];
 const body=document.createElement('div');body.className='ghost-native';body.style.cssText=`position:relative;width:${spec.w*spec.scale}px;height:${spec.h*spec.scale}px`;
 const element=document.createElement(spec.tag);element.style.cssText=`transform:scale(${spec.scale});transform-origin:top left;position:absolute;left:0;top:0`;
 initializeComponent({id:'placement',type,value:spec.defaultValue,settings},element);body.append(element);ghost.append(caption,body);ghost.hidden=false;
 setPlacementPoint(centerPoint());updateBuildContext();$('#circuit-viewport').focus({preventScroll:true});
}
async function placePart(point){
 if(!placement)return;setPlacementPoint(point);const pending=placement,before=cloneState(circuitState());placement=null;$('#placement-ghost').hidden=true;
 const id=pending.type+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,5);
 parts.push({id,type:pending.type,x:pending.x,y:pending.y,value:pending.value,settings:pending.settings});recordCircuit(before,'Add '+definitions[pending.type].name.split(' · ')[0]);
 await renderScene();select(id);buildNotice=`${componentName(parts.find(p=>p.id===id))} placed. Choose a gold pin or a pin in the list.`;updateBuildContext();save();$('#circuit-viewport').focus({preventScroll:true});
}
function updatePinBankStates(){for(const button of $('#pin-bank')?.querySelectorAll('[data-endpoint]')??[]){button.classList.toggle('source',button.dataset.endpoint===wireStart);button.classList.toggle('candidate',button.dataset.endpoint===wireCandidate);button.setAttribute('aria-pressed',String(button.dataset.endpoint===wireStart));}}
function renderPinBank(){
 const bank=$('#pin-bank');if(!bank||!parts.length)return;const activeEndpoint=bank.contains(document.activeElement)?document.activeElement.dataset.endpoint:null,scroll=$('#pin-list').scrollTop;
 const part=parts.find(p=>p.id===pinBankPartId)||parts.find(p=>p.id===selectedPart)||parts.find(p=>p.id===wireStart?.split(':')[0])||parts.find(p=>isBoard(p.type));if(!part)return;
 const changed=renderedPinPartId!==part.id;pinBankPartId=part.id;renderedPinPartId=part.id;if(changed)$('#pin-search').value='';bank.hidden=false;$('#pin-bank-title').textContent=componentName(part);
 let choose=$('#pin-component');if(!choose){choose=document.createElement('select');choose.id='pin-component';choose.setAttribute('aria-label','Choose a component for its pins');$('#pin-search').before(choose);choose.onchange=()=>{pinBankPartId=choose.value;$('#pin-search').value='';select(choose.value);};}
 choose.replaceChildren();for(const item of parts){const option=document.createElement('option');option.value=item.id;option.textContent=componentName(item);choose.append(option);}choose.value=part.id;
 let quick=$('#pin-quick');if(!quick){quick=document.createElement('div');quick.id='pin-quick';quick.setAttribute('role','group');quick.setAttribute('aria-label','Common board pins');$('#pin-search').after(quick);}quick.replaceChildren();
 const board=parts.find(p=>p.type==='uno');if(board){for(const [label,name]of [['Board 13','13'],['Board GND','GND.1']]){const key=board.id+':'+name,button=document.createElement('button');button.className='pin-quick-button';button.textContent=label;button.dataset.endpoint=key;button.setAttribute('aria-label',`Connect Arduino Uno pin ${name}`);button.onclick=()=>connectPin(key);button.onfocus=()=>{if(wireStart&&key!==wireStart){wireCandidate=key;updateWireHighlights();}};button.onblur=()=>{if(wireCandidate===key){wireCandidate=null;updateWireHighlights();}};quick.append(button);}}quick.hidden=!board;
 const filter=$('#pin-search').value.trim().toLowerCase(),list=$('#pin-list');list.replaceChildren();
 const available=new Set([...part.body.querySelectorAll('.pin')].map(node=>node.dataset.endpoint));
 const pins=part.pins.filter(pin=>available.has(part.id+':'+pin.name)&&pin.name.toLowerCase().includes(filter));
 for(const pin of pins){const key=part.id+':'+pin.name,button=document.createElement('button');button.className='pin-bank-button';button.dataset.endpoint=key;button.setAttribute('aria-label',`Connect ${componentName(part)} pin ${pin.name}`);button.textContent=pinDescription(key).short;
  const count=wires.filter(w=>w.a===key||w.b===key).length;if(count){const detail=document.createElement('small');detail.textContent=`${count} wire${count===1?'':'s'}`;button.append(detail);}
  button.onclick=()=>connectPin(key);button.onpointerenter=()=>{if(wireStart&&key!==wireStart){wireCandidate=key;updateWireHighlights();}};button.onpointerleave=()=>{if(wireCandidate===key){wireCandidate=null;updateWireHighlights();}};button.onfocus=()=>{if(wireStart&&key!==wireStart){wireCandidate=key;updateWireHighlights();}};button.onblur=()=>{if(wireCandidate===key){wireCandidate=null;updateWireHighlights();}};list.append(button);
 }
 if(!pins.length){const empty=document.createElement('p');empty.className='pin-bank-empty';empty.textContent='No pins match. Try a shorter name.';list.append(empty);}
 updatePinBankStates();list.scrollTop=changed?0:scroll;if(activeEndpoint&&!changed){const restore=[...bank.querySelectorAll('[data-endpoint]')].find(button=>button.dataset.endpoint===activeEndpoint);restore?.focus({preventScroll:true});}
}
function drawPendingWire(){
 const svg=$('#wires');svg?.querySelector('#pending-wire-preview')?.remove();if(!svg||!wireStart)return;
 const a=endpoint(wireStart);if(!a)return;const b=wireCandidate?endpoint(wireCandidate):pointerWorld??a;let points;
 if(wireCandidate){const obstacles=parts.map(p=>({id:p.id,x:p.x,y:p.y+(p.body?.offsetTop??35),width:definitions[p.type].w*definitions[p.type].scale,height:p.body?.offsetHeight??definitions[p.type].h*definitions[p.type].scale}));points=routeWires([{id:'preview',a,b}],obstacles)[0]?.points;}
 if(!points){const sourcePart=parts.find(p=>p.id===a.partId),spec=definitions[sourcePart.type],top=sourcePart.y+(sourcePart.body?.offsetTop??35),escape={x:a.x,y:a.y};if(a.direction==='up')escape.y=top-14;else if(a.direction==='down')escape.y=top+spec.h*spec.scale+14;else if(a.direction==='left')escape.x=sourcePart.x-14;else escape.x=sourcePart.x+spec.w*spec.scale+14;points=[a,escape,...(a.direction==='up'||a.direction==='down'?[{x:b.x,y:escape.y}]:[{x:escape.x,y:b.y}]),b];}
 svg.append(svgNode('path',{id:'pending-wire-preview',d:pathData(points),class:'pending-wire',stroke:wireColor}));
}

const svgNode=(tag,attributes={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attributes))node.setAttribute(key,String(value));return node;};
const pathData=points=>points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
const blank = () => ({version:2,name:'Untitled circuit',platform:'uno',entry:'index.js',selectedFile:'index.js',files:{'index.js':''},parts:[{id:'board',type:'uno',x:200,y:200}],wires:[]});
const cleanPart = ({id,type,x,y,value,settings}) => ({id,type,x,y,value,settings:settings?{...settings}:undefined});
const capture = () => {if(editor&&!suppressSave)project.files[project.selectedFile]=editor.state.doc.toString();return {...project,files:{...project.files},parts:parts.map(cleanPart),wires:wires.map(w=>({...w}))};};
function log(message,level='log'){const root=$('#console');root.querySelector('.console-empty')?.remove();const line=document.createElement('div');line.className=`console-line ${level}`;const time=document.createElement('time');time.textContent=new Date().toLocaleTimeString([],{hour12:false});const text=document.createElement('span');text.textContent=String(message).slice(0,6000);line.append(time,text);root.append(line);while(root.childElementCount>200)root.firstElementChild.remove();root.scrollTop=root.scrollHeight;}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4000);}
function save(){if(suppressSave||!project)return;project.files[project.selectedFile]=editor.state.doc.toString();$('#save-state').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(storageKey,JSON.stringify(capture()));$('#save-state').textContent='Saved on this device';}catch{$('#save-state').textContent='Download to save your work';}},400);}
function status(kind,text){$('#status').className=`status ${kind}`;$('#status').textContent=text;$('#run').disabled=running;$('#stop').disabled=!running;if($('#circuit-run'))$('#circuit-run').disabled=running;if($('#circuit-stop'))$('#circuit-stop').disabled=!running;$('#repl-input').disabled=!ready;$('#repl-send').disabled=!ready;$('#repl-input').placeholder=ready?'Enter a JavaScript command…':'Run a program first, then enter a command…';}
function replaceCode(code){suppressSave=true;editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:code}});suppressSave=false;}
function validName(name){return typeof name==='string'&&/^(?!\.)(?:[\w-]+\/)*[\w.-]+\.(js|json|html|css|sh)$/.test(name)&&name.length<=100&&!name.includes('..');}
function normalizeProject(p){
 if(p?.version===1)p={...blank(),name:p.lesson?`${p.lesson} circuit`:'Imported circuit',files:{'index.js':p.code},parts:p.parts,wires:p.wires};
 if(!p||p.version!==2||!p.files||typeof p.files!=='object'||Array.isArray(p.files)||!Array.isArray(p.parts)||!Array.isArray(p.wires))throw new Error('This is not a Hello Circuit project file.');
 const files=Object.entries(p.files);if(!files.length||files.length>30||files.some(([name,code])=>!validName(name)||typeof code!=='string'||code.length>60000)||files.reduce((sum,[,code])=>sum+code.length,0)>250000)throw new Error('Use up to 30 code files, with 60,000 characters per file.');
 if(!Object.hasOwn(p.files,p.entry)||!p.entry.endsWith('.js')&&!p.entry.endsWith('.sh'))throw new Error('Choose a JavaScript entry file, or a .sh file for the virtual Pi/BeagleBone shell.');
 if(p.parts.length<1||p.parts.length>60||p.wires.length>250)throw new Error('Use up to 60 components and 250 wires.');
 const ids=new Set();for(const n of p.parts){if(!n||!/^[-\w]{1,40}$/.test(n.id)||ids.has(n.id)||!Object.hasOwn(definitions,n.type)||!Number.isFinite(n.x)||!Number.isFinite(n.y))throw new Error('A component in this project is invalid.');ids.add(n.id);}
 if(p.parts.filter(n=>isBoard(n.type)).length!==1)throw new Error('A project needs one board.');
 const partList=p.parts.map(n=>{const spec=definitions[n.type],settings={...spec.settings};for(const c of spec.controls??[])if(c.key!=='value')settings[c.key]=c.default;for(const [k,v]of Object.entries(n.settings??{}))if(typeof v==='string'&&v.length<100||typeof v==='number'&&Number.isFinite(v))settings[k]=v;for(const c of spec.controls??[]){if(c.key!=='value'&&typeof settings[c.key]==='number')settings[c.key]=Math.max(c.min,Math.min(c.max,settings[c.key]));}const valueControl=spec.controls?.find(c=>c.key==='value'),rawValue=Number.isFinite(n.value)?n.value:spec.defaultValue,partValue=valueControl?Math.max(valueControl.min,Math.min(valueControl.max,rawValue)):rawValue;return {...cleanPart(n),x:n.x,y:n.y,value:partValue,settings};});
 for(const w of p.wires){if(!w||typeof w.a!=='string'||typeof w.b!=='string'||w.a.length>100||w.b.length>100||!ids.has(w.a.split(':')[0])||!ids.has(w.b.split(':')[0]))throw new Error('A wire in this project is invalid.');}
 const assets={};let assetSize=0;for(const [name,asset]of Object.entries(p.assets??{})){if(!/^(?:\/)?(?:[\w-]+\/)*[\w.-]+\.(mp3|wav|png|jpg|svg)$/.test(name)||name.includes('..')||!asset||typeof asset.base64!=='string'||asset.base64.length>150000||!/^[-\w.+]+\/[-\w.+]+$/.test(asset.mimeType??'')||!/^[A-Za-z0-9+\/=]*$/.test(asset.base64))throw new Error('A project asset is invalid.');assetSize+=asset.base64.length;if(assetSize>250000)throw new Error('Project assets are too large.');assets[name]={mimeType:asset.mimeType,base64:asset.base64};}const board=partList.find(n=>isBoard(n.type));if(p.entry.endsWith('.sh')&&!['raspi','beaglebone'].includes(board.type))throw new Error('Shell files run only on a virtual Pi or BeagleBone board.');return {version:2,name:String(p.name??'Untitled circuit').slice(0,80),platform:board.type==='uno'?'uno':definitions[board.type].platform,entry:p.entry,selectedFile:Object.hasOwn(p.files,p.selectedFile)?p.selectedFile:p.entry,files:Object.fromEntries(files),parts:partList,wires:p.wires.map(w=>({a:w.a,b:w.b,color:/^#[\da-f]{6}$/i.test(w.color??'')?w.color:/:GND|:VSS|:K$|:C$/.test(w.a+w.b)?'#526477':/:5V|:3\.3V|:VCC|:VDD|:V\+/.test(w.a+w.b)?'#ed6f48':'#194ced'})),note:typeof p.note==='string'?p.note.slice(0,2000):'',fixtures:p.fixtures&&typeof p.fixtures==='object'?p.fixtures:undefined,assets};
}
async function loadProject(p,{undo=true}={}){const validated=normalizeProject(p);if(undo&&project){undoProject=capture();$('#undo-load').hidden=false;}stop();project=validated;parts=project.parts;wires=project.wires;$('#project-name').value=project.name;replaceCode(project.files[project.selectedFile]);renderFiles();updateNote();await renderScene({fitView:true,resetSelection:true});circuitUndo.length=0;circuitRedo.length=0;updateHistory();save();}
function renderFiles(){const tabs=$('#file-tabs'),entries=$('#entry-file');tabs.replaceChildren();entries.replaceChildren();for(const name of Object.keys(project.files)){const tab=document.createElement('button');tab.className='file-tab'+(name===project.selectedFile?' active':'');tab.textContent=name;tab.setAttribute('aria-pressed',String(name===project.selectedFile));tab.addEventListener('click',()=>{project.files[project.selectedFile]=editor.state.doc.toString();project.selectedFile=name;replaceCode(project.files[name]);renderFiles();save();});tabs.append(tab);if(name.endsWith('.js')||name.endsWith('.sh')&&['raspi','beaglebone'].includes(project.platform)){const option=document.createElement('option');option.value=name;option.textContent=name;entries.append(option);}}entries.value=project.entry;$('#delete-file').disabled=Object.keys(project.files).length===1||project.selectedFile===project.entry;$('#code-language').textContent=project.platform==='uno'?'Johnny-Five':'Virtual API model';}
function updateNote(){const shellAvailable=['raspi','beaglebone'].includes(project.platform);$('#console-mode option[value="shell"]').hidden=!shellAvailable;$('#console-mode option[value="shell"]').disabled=!shellAvailable;if(!shellAvailable)$('#console-mode').value='js';else if(project.entry.endsWith('.sh'))$('#console-mode').value='shell';const messages=['Only run code you trust. Projects can access network and browser APIs. Do not include secrets.'];if(project.platform!=='uno')messages.push('This board’s APIs and pins are simulated in the browser. See Help for supported code and setup differences.');if(project.note)messages.push(project.note);if(project.fixtures?.weather)messages.push('Weather responses come from an editable sample fixture. The book’s Dark Sky service has retired.');$('#project-note').textContent=messages.join(' ');$('#project-note').hidden=!messages.length;$('#board-select').value=parts.find(p=>isBoard(p.type))?.type??'uno';}
function updateCanvasSurface(){
 const view=$('#circuit-viewport');if(!view.clientWidth||!view.clientHeight)return;
 const bounds=viewportWorldBounds(camera,view.clientWidth,view.clientHeight);
 // SVG coordinates stay in world units; only their drawing window follows the camera.
 for(const svg of [$('#wires'),$('#pin-labels')]){
  svg.style.left=bounds.x+'px';svg.style.top=bounds.y+'px';svg.style.width=bounds.width+'px';svg.style.height=bounds.height+'px';
  svg.setAttribute('viewBox',`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
 }
 const grid=gridGeometry(camera);view.style.backgroundSize=`${grid.spacing}px ${grid.spacing}px`;view.style.backgroundPosition=`${grid.x}px ${grid.y}px`;
 updateCanvasRecovery();
}
function updateCanvasRecovery(){
 const view=$('#circuit-viewport');
 const visible=parts.some(p=>{const spec=definitions[p.type],x=p.x*camera.scale+camera.x,y=p.y*camera.scale+camera.y;return x+spec.w*spec.scale*camera.scale>0&&y+(p.root?.offsetHeight??spec.h*spec.scale+70)*camera.scale>0&&x<view.clientWidth&&y<view.clientHeight;});
 $('#return-to-circuit').hidden=visible||!parts.length;
}
function transform(){const stage=$('#circuit-stage');stage.style.transform=`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;updateCanvasSurface();updateWireHitSizes();drawPinLabels();if(hoverPin)showPinTooltip(hoverPin);}
function fit(){
 const view=$('#circuit-viewport');if(!view.clientWidth||!view.clientHeight||!parts.length)return;
 for(let pass=0;pass<4;pass++){
  const extents=[...parts.map(p=>({x:p.x,y:p.y,width:definitions[p.type].w*definitions[p.type].scale,height:(p.root?.offsetHeight??definitions[p.type].h*definitions[p.type].scale+90)})),...wireRoutes.flatMap(r=>r.points.map(p=>({...p,width:0,height:0}))),...pinLabelBounds];
  const left=Math.min(...extents.map(p=>p.x)),top=Math.min(...extents.map(p=>p.y)),right=Math.max(...extents.map(p=>p.x+p.width)),bottom=Math.max(...extents.map(p=>p.y+p.height));
  camera=fitCamera({x:left,y:top,width:right-left,height:bottom-top},view.clientWidth,view.clientHeight);transform();
 }
 drawPendingWire();
}
function zoom(factor){const view=$('#circuit-viewport');camera=zoomCamera(camera,factor,{x:view.clientWidth/2,y:view.clientHeight/2});transform();drawPendingWire();}
new ResizeObserver(()=>{transform();if(selectedPart)keepPartVisible(selectedPart);}).observe($('#circuit-viewport'));window.addEventListener('resize',sizeWorkspace);
function select(id=null,wire=null,{reveal=true}={}){selectedPart=id;selectedWire=wire;buildNotice=wire!==null?`Wire: ${pinDescription(wires[wire].a).text} → ${pinDescription(wires[wire].b).text}. Choose a color below, or press Delete.`:id?`${componentName(parts.find(p=>p.id===id))} selected. Drag to move, or choose a pin to connect.`:'';if(id)pinBankPartId=id;document.querySelectorAll('.part').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));$('#remove-selected').disabled=!id&&wire===null||!!id&&isBoard(parts.find(p=>p.id===id)?.type);drawWires();renderInspector();renderPinBank();if(wire!==null)showDetailTab('details');if(id&&reveal)keepPartVisible(id);if(wire!==null)setWireColor(wires[wire]?.color??wireColor,false);updateBuildContext();}
async function renderScene({fitView=false,resetSelection=false}={}){const version=++sceneVersion;if(resetSelection){wireStart=null;wireCandidate=null;selectedPart=null;selectedWire=null;pinBankPartId=null;placement=null;$('#placement-ghost').hidden=true;}else{if(!parts.some(p=>p.id===selectedPart))selectedPart=null;} previousInputs={};previousPeripherals='';previousDevices='';hoveredWire=null;wireGeometryKey='';wireRoutes=[];pinLabelBounds=[];$('#parts').replaceChildren();$('#wires').replaceChildren();$('#pin-labels').replaceChildren();$('#remove-selected').disabled=true;
 for(const part of parts){const spec=definitions[part.type],root=document.createElement('div');root.className='part'+(part.type==='uno'?' uno-part':'');root.dataset.id=part.id;root.style.left=part.x+'px';root.style.top=part.y+'px';part.root=root;
 const label=document.createElement('button');label.className='part-label';label.textContent='⋮⋮ '+componentName(part);label.setAttribute('aria-label',`Move or select ${componentName(part)}`);label.onclick=()=>{if(!placement)select(part.id,null,{reveal:false});};root.append(label);
 const body=document.createElement('div');body.className='part-body';body.style.width=spec.w*spec.scale+'px';body.style.height=spec.h*spec.scale+'px';part.body=body;
 const element=document.createElement(spec.tag);element.style.cssText=`transform:scale(${spec.scale});transform-origin:top left;position:absolute;left:0;top:0`;part.el=element;part.lastState=null;initializeComponent(part,element);if(part.type==='button')element.label=part.id==='down'?'− second':part.id==='up'?'+ second':part.id==='go'?'Start / pause':'';body.append(element);root.append(body);$('#parts').append(root);await element.updateComplete;if(version!==sceneVersion)return;if(part.type==='button')body.style.height=Math.max(spec.h,element.offsetHeight)*spec.scale+'px';
 body.addEventListener('pointerdown',event=>beginPartDrag(event,part,false));
 body.addEventListener('click',event=>{if(nativeControl(event))return;if(placement){event.stopPropagation();placePart(worldPoint(event));return;}if(wireStart){const candidate=closestPin(worldPoint(event),event.pointerType);if(candidate){event.stopPropagation();connectPin(candidate);return;}}select(part.id);});
 part.pins=element.pinInfo??spec.pins??[];for(const pin of part.pins){if(part.type==='uno'&&!/^(\d+|A\d|GND\.\d|5V|3\.3V|SDA|SCL)$/.test(pin.name))continue;const key=part.id+':'+pin.name,node=document.createElement('button');node.className='pin';node.style.left=pin.x*spec.scale+'px';node.style.top=pin.y*spec.scale+'px';node.dataset.endpoint=key;node.dataset.label=pin.name;node.title=spec.name+' '+pin.name;node.setAttribute('aria-label',`Connect ${componentName(part)} pin ${pin.name}`);node.onclick=e=>{e.stopPropagation();connectPin(key);};node.onpointerdown=e=>beginPinDrag(e,key,node);node.onpointerenter=()=>showPinTooltip(key);node.onpointerleave=()=>showPinTooltip(null);node.onfocus=()=>{showPinTooltip(key);if(wireStart&&key!==wireStart){wireCandidate=key;updateWireHighlights();}};node.onblur=()=>{showPinTooltip(null);if(wireCandidate===key){wireCandidate=null;updateWireHighlights();}};body.append(node);}
 if(isBoard(part.type)){const note=document.createElement('div');note.className='part-note';note.textContent=part.type==='uno'?'Built-in light · pin 13':'Virtual API model · '+project.platform;root.append(note);element.addEventListener('board-input',e=>{part.value=e.detail.value;worker?.postMessage({type:'input',pin:e.detail.pin,value:e.detail.value});refresh();save();});}
 if(part.type==='gesture')element.addEventListener('device-action',e=>{part.value={up:1,down:2,left:3,right:4}[e.detail.gesture]??0;part.settings??={};part.settings.sequence=(part.settings.sequence??0)+1;refresh();save();});
 if(part.type==='button'){const toggle=document.createElement('button');toggle.className='push-toggle';part.toggle=toggle;const set=(down,latched=false)=>{part.value=down?1:0;element.sticky=down&&latched;element.pressed=down;toggle.textContent=down?'Release button':'Press button';toggle.classList.toggle('active',down);toggle.setAttribute('aria-pressed',String(down));refresh();save();};toggle.onclick=()=>set(!part.value,true);root.append(toggle);element.addEventListener('button-press',()=>set(true));element.addEventListener('button-release',()=>set(false));set(!!part.value,true);}
 if(part.type==='pot'||part.type==='switch'){const wrap=document.createElement('label');wrap.className='part-control';wrap.textContent=part.type==='pot'?'Turn':'Switch';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max=part.type==='pot'?'1023':'1';slider.step='1';slider.value=part.value;slider.setAttribute('aria-label',spec.name+' value');slider.oninput=()=>{part.value=Number(slider.value);element.value=part.value;refresh();save();};element.addEventListener('input',()=>{part.value=Number(element.value);slider.value=part.value;refresh();save();});wrap.append(slider);root.append(wrap);}
 label.addEventListener('pointerdown',event=>beginPartDrag(event,part,true));
 }wires=wires.filter(w=>endpoint(w.a)&&endpoint(w.b));project.wires=wires;if(wireStart&&!endpoint(wireStart)){wireStart=null;wireCandidate=null;}drawWires();refresh();renderPinBank();sizeWorkspace();if(fitView)fit();setWireHint();renderInspector();updateHistory();}
function endpoint(key){
 const pos=key.indexOf(':'),part=parts.find(p=>p.id===key.slice(0,pos)),pin=part?.pins?.find(p=>p.name===key.slice(pos+1));if(!pin)return null;
 const spec=definitions[part.type],distances=[['left',pin.x],['right',spec.w-pin.x],['up',pin.y],['down',spec.h-pin.y]];
 const direction=part.type==='uno'?(pin.y<spec.h/2?'up':'down'):distances.sort((a,b)=>a[1]-b[1])[0][0];
 return {x:part.x+pin.x*spec.scale,y:part.y+(part.body?.offsetTop??35)+pin.y*spec.scale,direction,partId:part.id};
}
function pinDescription(key){
 const [id,name]=key.split(':'),part=parts.find(p=>p.id===id),spec=definitions[part?.type];
 const siblings=parts.filter(p=>p.type===part?.type),ordinal=siblings.length>1?` ${siblings.indexOf(part)+1}`:'';
 const component=(spec?.name??id).split(' · ')[0]+ordinal;
 const pin=part?.type==='led'?(name==='A'?'A (+)':'C (−)'):name;
 return {component,pin,text:`${component} · ${pin}`,short:pin};
}
function activeWireIndex(){return hoveredWire??selectedWire;}
let wireColor='#194ced';
function setWireColor(color,edit=true){
 wireColor=color;
 for(const button of document.querySelectorAll('.color')){const active=button.dataset.color===color;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
 if(edit&&selectedWire!==null&&wires[selectedWire]){const before=cloneState(circuitState());wires[selectedWire].color=color;recordCircuit(before,'Change wire color');drawWires();renderInspector();save();}
 drawPendingWire();
}
function setWireHint(){updateWireHighlights();}
function connectPin(key){
 if(placement)return;if(!endpoint(key))return;buildNotice='';
 if(!wireStart){wireStart=key;wireCandidate=null;pointerWorld=endpoint(key);selectedWire=null;selectedPart=key.split(':')[0];pinBankPartId=selectedPart;showDetailTab('pins');select(selectedPart,null,{reveal:false});setWireHint();return;}
 const first=wireStart;wireStart=null;wireCandidate=null;
 if(first===key){buildNotice='Connection canceled.';setWireHint();return;}
 const existing=wires.findIndex(w=>w.a===first&&w.b===key||w.a===key&&w.b===first);
 if(existing>=0){select(null,existing);buildNotice='These pins are already connected. The existing wire is selected.';updateBuildContext();toast('Already connected — existing wire selected.');return;}
 const before=cloneState(circuitState());wires.push({a:first,b:key,color:wireColor});selectedPart=null;selectedWire=wires.length-1;hoveredWire=null;
 recordCircuit(before,'Connect '+pinDescription(first).text+' to '+pinDescription(key).text);drawWires();refresh();select(null,wires.length-1);save();
 buildNotice=`Connected ${pinDescription(first).text} → ${pinDescription(key).text}. Choose another pin to make a wire.`;setWireHint();
}

function drawWires(){
 const svg=$('#wires'),obstacles=parts.map(p=>({id:p.id,x:p.x,y:p.y+(p.body?.offsetTop??35),width:definitions[p.type].w*definitions[p.type].scale,height:p.body?.offsetHeight??definitions[p.type].h*definitions[p.type].scale}));
 const connections=wires.map((w,id)=>({id,a:endpoint(w.a),b:endpoint(w.b)})).filter(w=>w.a&&w.b),geometryKey=JSON.stringify([connections,obstacles,wires.map(w=>w.color)]);
 if(geometryKey!==wireGeometryKey){
  wireGeometryKey=geometryKey;hoveredWire=null;wireRoutes=routeWires(connections,obstacles);svg.replaceChildren();
  for(const route of wireRoutes){
   const i=route.id,w=wires[i],group=svgNode('g',{'data-wire':i}),d=pathData(route.points);
   const casing=svgNode('path',{d,class:'wire-casing'}),line=svgNode('path',{d,class:'wire',stroke:w.color??wireColor});
   // Keep the header escape visible over the board. The wider hit target stays
   // outside component bodies, so the gold pins and native controls still work.
   const interior=route.points.slice(1,-1),hitPoints=interior.length>1?interior:route.points;
   const straight=hitPoints.every(p=>p.x===hitPoints[0].x)||hitPoints.every(p=>p.y===hitPoints[0].y);
   const hit=svgNode(straight?'rect':'path',{class:'wire-hit'+(straight?' straight-wire-hit':''),tabindex:0,role:'button','aria-label':`Select wire from ${pinDescription(w.a).text} to ${pinDescription(w.b).text}`});
   if(straight){hit.dataset.x1=hitPoints[0].x;hit.dataset.y1=hitPoints[0].y;hit.dataset.x2=hitPoints.at(-1).x;hit.dataset.y2=hitPoints.at(-1).y;}else hit.setAttribute('d',pathData(hitPoints));
   hit.onclick=e=>{e.stopPropagation();cancelBuild();hoveredWire=null;select(null,i);};
   hit.onpointerenter=()=>{hoveredWire=i;updateWireHighlights();};hit.onpointerleave=()=>{hoveredWire=null;updateWireHighlights();};
   hit.onfocus=()=>{hoveredWire=i;updateWireHighlights();};hit.onblur=()=>{hoveredWire=null;updateWireHighlights();};
   hit.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();hoveredWire=null;select(null,i);}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();e.stopPropagation();select(null,i);removeSelected();}};
   group.append(casing,line,hit);svg.append(group);
  }
 }
 updateCanvasRecovery();updateWireHitSizes();updateWireHighlights();
}
function updateWireHitSizes(){
 for(const hit of document.querySelectorAll('.straight-wire-hit')){const x1=Number(hit.dataset.x1),x2=Number(hit.dataset.x2),y1=Number(hit.dataset.y1),y2=Number(hit.dataset.y2),width=Math.max(13/camera.scale,Math.abs(x2-x1)),height=Math.max(13/camera.scale,Math.abs(y2-y1));for(const [key,value]of Object.entries({x:(x1+x2-width)/2,y:(y1+y2-height)/2,width,height}))hit.setAttribute(key,value);}
}
function updateWireHighlights(){
 const active=activeWireIndex(),wire=wires[active],ends=new Set(wire?[wire.a,wire.b]:[]);
 $('#wires').classList.toggle('has-active-wire',!!wire);
 $('#wires').querySelectorAll('[data-wire]').forEach(group=>{group.classList.toggle('active-wire',Number(group.dataset.wire)===active);group.classList.toggle('selected-wire',Number(group.dataset.wire)===selectedWire);group.querySelector('.wire-hit').setAttribute('aria-pressed',String(Number(group.dataset.wire)===selectedWire));});
 document.querySelectorAll('.pin').forEach(p=>{p.classList.toggle('selected',p.dataset.endpoint===wireStart);p.classList.toggle('wire-end',ends.has(p.dataset.endpoint));p.classList.toggle('candidate',p.dataset.endpoint===wireCandidate);});
 $('#cancel-wire').hidden=true;
 $('#wire-hint').textContent=wireStart?`Choose the other pin. From ${pinDescription(wireStart).text}.`:wire?`${pinDescription(wire.a).text} ↔ ${pinDescription(wire.b).text}`:'Click two gold pins to connect. Select a wire to see both ends.';
 drawPinLabels();drawPendingWire();updatePinBankStates();updateBuildContext();
}
function drawPinLabels(){
 const svg=$('#pin-labels');if(!svg)return;svg.replaceChildren();pinLabelBounds=[];
 const active=wires[activeWireIndex()],emphasized=new Set(active?[active.a,active.b]:[]);if(wireStart)emphasized.add(wireStart);if(wireCandidate)emphasized.add(wireCandidate);
 const keys=new Set($('#show-pin-labels').checked?wires.flatMap(w=>[w.a,w.b]):[]);for(const key of emphasized)keys.add(key);
 const scale=camera.scale,vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},occupied=parts.map(p=>({x:p.x-4/scale,y:p.y-4/scale,width:(p.root?.offsetWidth??0)+8/scale,height:(p.root?.offsetHeight??0)+8/scale}));
 const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 const ordered=[...keys].sort((a,b)=>a.localeCompare(b));
 for(const key of ordered){
  const point=endpoint(key);if(!point)continue;
  const part=parts.find(p=>p.id===point.partId),description=pinDescription(key),[dx,dy]=vectors[point.direction],width=(description.short.length*6.7+14)/scale,height=22/scale,body={x:part.x,y:part.y+(part.body?.offsetTop??35),width:definitions[part.type].w*definitions[part.type].scale,height:part.body?.offsetHeight??definitions[part.type].h*definitions[part.type].scale};
  const edgeDistance=dx<0?point.x-body.x:dx>0?body.x+body.width-point.x:dy<0?point.y-body.y:body.y+body.height-point.y;
  const outer={x:part.x,y:part.y,width:part.root?.offsetWidth??body.width,height:part.root?.offsetHeight??body.height},labelDistance=dx<0?point.x-outer.x:dx>0?outer.x+outer.width-point.x:dy<0?point.y-outer.y:outer.y+outer.height-point.y;
  let rect;
  // Stagger neighboring header labels, with a leader back to the exact pin.
  // Size is measured in screen pixels so it stays readable after zooming out.
  for(let step=0;step<40;step++){
   const row=step%2+2*Math.floor(step/22),column=Math.floor((step%22)/2),depth=labelDistance+(22+row*26)/scale,side=[0,-1,1,-2,2,-3,3,-4,4,-5,5][column]*(width+5/scale);
   const cx=point.x+dx*depth+(dy?side:0),cy=point.y+dy*depth+(dx?side:0),candidate={x:cx-width/2,y:cy-height/2,width,height};
   rect=candidate;if(!occupied.some(r=>overlaps(candidate,r)))break;
  }
  occupied.push({...rect,x:rect.x-3/scale,y:rect.y-3/scale,width:rect.width+6/scale,height:rect.height+6/scale});pinLabelBounds.push(rect);
  const anchor={x:Math.max(rect.x,Math.min(rect.x+rect.width,point.x)),y:Math.max(rect.y,Math.min(rect.y+rect.height,point.y))};
  const bend={x:point.x+dx*(edgeDistance+10/scale),y:point.y+dy*(edgeDistance+10/scale)},group=svgNode('g',{class:'pin-callout'+(emphasized.has(key)?' emphasized':''),'data-endpoint':key});
  group.append(svgNode('path',{d:pathData([point,bend,anchor]),class:'pin-leader'}));
  const badge=svgNode('g',{transform:`translate(${rect.x} ${rect.y}) scale(${1/scale})`});badge.append(svgNode('rect',{width:width*scale,height:22,rx:5}));
  const text=svgNode('text',{x:width*scale/2,y:14.5,'text-anchor':'middle'});text.textContent=description.short;badge.append(text);group.append(badge);svg.append(group);
 }
}

function removeSelected(){
 const before=cloneState(circuitState());
 if(selectedWire!==null){wires.splice(selectedWire,1);selectedWire=null;wireCandidate=null;recordCircuit(before,'Remove wire');drawWires();refresh();select();save();buildNotice='Wire removed. Undo brings it back.';updateBuildContext();return;}
 if(!selectedPart||isBoard(parts.find(p=>p.id===selectedPart)?.type))return;const part=parts.find(p=>p.id===selectedPart),id=part.id,name=componentName(part);
 parts=parts.filter(p=>p.id!==id);wires=wires.filter(w=>!w.a.startsWith(id+':')&&!w.b.startsWith(id+':'));if(wireStart?.startsWith(id+':'))wireStart=null;recordCircuit(before,'Remove '+name);renderScene();save();buildNotice='Component and its wires removed. Undo restores them.';updateBuildContext();
}

function syncInputs(){if(!worker||!analysis)return;const next={...analysis.digitalInputs,...analysis.analogInputs};for(const [pin,value]of Object.entries(next))if(previousInputs[pin]!==value)worker.postMessage({type:'input',pin:/^\d+$/.test(pin)?Number(pin):pin,value});previousInputs=next;const descriptors=JSON.stringify(analysis.peripherals);if(descriptors!==previousPeripherals){worker.postMessage({type:'peripherals',items:analysis.peripherals});previousPeripherals=descriptors;}const devices=parts.filter(p=>['compass','weather','accelerometer','gps','gesture'].includes(p.type)).map(p=>({type:'device-input',id:p.id,values:deviceInputValues(p)})),signature=JSON.stringify(devices);if(signature!==previousDevices){for(const d of devices)worker.postMessage(d);previousDevices=signature;}}
function refresh(){analysis=analyzeCircuit(parts,wires,{...snapshot,running});syncInputs();for(const part of parts){if(!part.el)continue;const state=analysis.components[part.id]??{};const signature=JSON.stringify(state);if(part.lastState!==signature){applyComponentState(part,state);part.lastState=signature;}}updateAudio();$('#warnings').textContent=(analysis.warnings??[]).join(' · ');updateReadings();}
function renderInspector(){const target=$('#inspector');target.replaceChildren();$('#part-count').textContent=`${parts.length} component${parts.length===1?'':'s'}`;if(selectedWire!==null){$('#inspector-title').textContent='Selected wire';const wire=wires[selectedWire];if(!wire)return;
 const connection=document.createElement('div');connection.className='wire-connection';connection.style.setProperty('--wire-color',wire.color??wireColor);
 for(const [label,key]of [['From',wire.a],['To',wire.b]]){const row=document.createElement('div'),caption=document.createElement('span'),name=document.createElement('b'),pin=document.createElement('code'),description=pinDescription(key);caption.textContent=label;name.textContent=description.component;pin.textContent=description.pin;row.append(caption,name,pin);connection.append(row);}
 const hint=document.createElement('p');hint.textContent=wireRoutes.find(r=>r.id===selectedWire)?.blocked?'Both pins are highlighted. Move nearby components apart to give this wire a clear path.':'Both pins are highlighted on the circuit. Press Remove to delete this wire.';target.append(connection,hint);return;}
 const part=parts.find(p=>p.id===selectedPart);if(!part){$('#inspector-title').textContent='Build it your way';const p=document.createElement('p');p.textContent='Add a component, then place it. Drag its body to move it. Click two pins or drag between pins to connect.';const more=document.createElement('p');more.textContent='Help has optional examples and a chapter guide. Your editor starts empty.';target.append(p,more);return;}
 const spec=definitions[part.type];$('#inspector-title').textContent=spec.name;const description=document.createElement('p');description.textContent=isBoard(part.type)?(part.type==='uno'?'Pins use the book’s Arduino numbers. Run starts a fresh Firmata board.':'Use the named pins printed on this virtual API board. Check Help for exact supported examples.'):'Connect each pin as shown in the book. Change values below and observe your program.';target.append(description);
 for(const control of spec.controls??[]){const label=document.createElement('label');label.className='property';const text=document.createElement('span');text.textContent=control.label;const input=document.createElement('input');input.type='number';input.min=control.min;input.max=control.max;input.step=control.step;input.value=control.key==='value'?part.value:part.settings?.[control.key]??control.default;input.setAttribute('aria-label',control.label);const applyValue=(clamp=false)=>{const value=input.valueAsNumber;if(!Number.isFinite(value))return;if(!clamp&&(value<control.min||value>control.max))return;const clamped=Math.max(control.min,Math.min(control.max,value));if(clamp)input.value=clamped;if(part.type==='gesture'){part.settings??={};part.settings.sequence=(part.settings.sequence??0)+1;}if(control.key==='value'){part.value=clamped;part.el.value=part.type==='resistor'?String(clamped):clamped;}else{part.settings??={};part.settings[control.key]=clamped;}refresh();save();};const editValue=clamp=>{const before=cloneState(circuitState());applyValue(clamp);recordCircuit(before,'Change '+control.label,{merge:true});};input.oninput=()=>editValue(false);input.onchange=()=>editValue(true);label.append(text,input);target.append(label);}
 if(part.type==='button'){const button=document.createElement('button');button.className='secondary compact';button.style.marginTop='12px';button.textContent='Press / release button';button.onclick=()=>part.toggle?.click();target.append(button);}
 const readings=document.createElement('div');readings.className='pin-readings';readings.id='component-readings';target.append(readings);updateReadings();}
function updateReadings(){const root=$('#component-readings'),part=parts.find(p=>p.id===selectedPart);if(!root||!part||!analysis)return;const state=analysis.components[part.id]??{};if(part.type==='resistor')root.textContent=`Voltage: ${(state.voltage??0).toFixed(3)} V · Current: ${((state.current??0)*1000).toFixed(2)} mA · Power: ${((state.watts??0)*1000).toFixed(2)} mW`;else root.textContent=(part.pins??[]).slice(0,20).map(pin=>`${pin.name}: ${(analysis.voltage(part.id+':'+pin.name)??0).toFixed(2)} V`).join(' · ');}
function updateAudio(){if(!audio)return;const active=new Set();for(const part of parts){if(part.type!=='piezo')continue;const frequency=analysis?.components[part.id]?.frequency??0;if(!running||!frequency)continue;active.add(part.id);let voice=tones.get(part.id);if(!voice){const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='square';gain.gain.value=.025;oscillator.connect(gain).connect(audio.destination);oscillator.start();voice={oscillator,gain};tones.set(part.id,voice);}voice.oscillator.frequency.setValueAtTime(frequency,audio.currentTime);}for(const [id,voice]of tones)if(!active.has(id)){voice.oscillator.stop();tones.delete(id);}}
function stop({silent=true}={}){$('#web-preview').hidden=true;$('#web-preview-frame').srcdoc='';worker?.terminate();worker=null;running=false;ready=false;snapshot={};previousInputs={};for(const voice of tones.values())voice.oscillator.stop();tones.clear();status('idle','Ready to build');if(parts.length)refresh();if(!silent)log('Stopped. The virtual board has been reset.','system');}
function run(){const p=capture();if(!p.files[p.entry]?.trim()&&$('#console-mode').value!=='shell'){log('Write your program in '+p.entry+', then press Run. Help has optional examples.','system');editor.focus();return;}stop();running=true;status('connecting','Connecting…');$('#console').replaceChildren();log(`Starting ${definitions[parts.find(p=>isBoard(p.type)).type].name}…`,'system');const AudioContext=window.AudioContext??window.webkitAudioContext;if(AudioContext){audio??=new AudioContext();audio.resume().catch(()=>{});}
 try{worker=new Worker(new URL('./assets/runtime.worker.js', document.baseURI));worker.addEventListener('message',({data})=>{if(data.type==='status'){if(data.status==='ready'){ready=true;status('running','Running');log('Board ready. Your code is running.','system');}else if(data.status==='error'){log(data.message??'The program stopped.','error');stop();status('error','Check your code');}else if(data.status==='stopped'){stop();log(data.message??'Program stopped.','system');}}
 if(data.type==='console')log((data.args??[]).join(' '),data.level);if(data.type==='pins'){snapshot=data;refresh();}if(data.type==='eval-result')log(data.error??data.value,data.error?'error':'log');if(data.type==='repl-context')$('#repl-input').placeholder='Available: '+data.keys.join(', ');if(data.type==='network'&&data.mode==='fixture')log('Using the sample weather response.','system');if(data.type==='web-preview'){const preview=$('#web-preview');preview.hidden=false;$('#web-preview-frame').srcdoc=data.html;$('#web-preview-status').textContent=`Simulated server · port ${data.port??3000} · on this device`;log('Your web page preview is ready. Its server connection is simulated in the browser.','system');}if(data.type==='web-socket')$('#web-preview-frame').contentWindow?.postMessage(data,'*');});worker.addEventListener('error',event=>{log(event.message??'The program could not start.','error');stop();status('error','Check your code');});worker.postMessage({type:'run',code:p.files[p.entry],files:Object.fromEntries(Object.entries(p.files).map(([name,code])=>['/'+name,code])),entry:'/'+p.entry,platform:p.platform,peripherals:analysis.peripherals,fixtures:p.fixtures??{},assets:p.assets??{}});previousInputs={};previousPeripherals='';previousDevices='';refresh();}catch(error){log(error.message,'error');stop();status('error','Could not start');}}
const theme=EditorView.theme({'&':{fontSize:'14px'},'.cm-content':{caretColor:'#173f40'},'&.cm-focused .cm-selectionBackground, .cm-selectionBackground':{backgroundColor:'#dce8e2'}});
editor=new EditorView({state:EditorState.create({doc:'',extensions:[basicSetup,javascript(),theme,placeholder('Start with your own code.\n\nFollow JavaScript on Things, or open Help for an optional example.'),EditorView.contentAttributes.of({'aria-label':'JavaScript code editor'}),keymap.of([{key:'Mod-Enter',run:()=>{run();return true;}}]),EditorView.updateListener.of(update=>{if(update.docChanged)save();})]}),parent:$('#editor')});
const boardLabel=document.createElement('label');boardLabel.className='board-choice';boardLabel.textContent='Board ';const boardSelect=document.createElement('select');boardSelect.id='board-select';boardSelect.setAttribute('aria-label','Select board');for(const [type,spec]of Object.entries(definitions))if(isBoard(type)){const option=document.createElement('option');option.value=type;option.textContent=spec.name;boardSelect.append(option);}boardLabel.append(boardSelect);$('.project-bar').insertBefore(boardLabel,$('.project-actions'));
boardSelect.onchange=async()=>{const type=boardSelect.value;undoProject=capture();$('#undo-load').hidden=false;stop();const board=parts.find(p=>isBoard(p.type)),id=board.id;board.type=type;board.settings={};board.value=definitions[type].defaultValue;wires=wires.filter(w=>!w.a.startsWith(id+':')&&!w.b.startsWith(id+':'));project.platform=definitions[type].platform??'uno';if(project.entry.endsWith('.sh')&&!['raspi','beaglebone'].includes(project.platform)){project.entry=Object.keys(project.files).find(name=>name.endsWith('.js'))??'index.js';project.files[project.entry]??='';}project.note='';renderFiles();updateNote();cancelBuild();circuitUndo.length=0;circuitRedo.length=0;updateHistory();await renderScene({fitView:true,resetSelection:true});save();toast('Board changed. Connect your components to its pins.');};
for(const [type,spec]of Object.entries(definitions))if(!isBoard(type)){const option=document.createElement('option');option.value=type;option.textContent=spec.name;$('#add-component').append(option);}
$('#add-component').onchange=e=>{const type=e.target.value;e.target.value='';if(type)beginPlacement(type);};
const partNotes={led:'A simple light output',rgb:'Red, green and blue in one light',resistor:'Limit current · 330 Ω to start',button:'Press to change a digital input',switch:'Choose between two connections',pot:'A dial for an analog input',photoresistor:'Respond to the light level',tmp36:'Measure temperature',servo:'Turn to an angle',piezo:'Make tones and sounds',lcd:'Two lines of text · parallel pins','grove-lcd':'Text and backlight · I²C','nokia-lcd':'Draw pixels and numbers',motor:'Spin forwards or backwards',mosfet:'Control a larger load',hbridge:'Control motor speed and direction','shift-register':'Eight outputs from a few pins',breadboard:'Connect parts through shared rows',battery:'An adjustable power source',diode:'Let current flow one way',capacitor:'Store electrical charge',compass:'Read a magnetic direction',weather:'Temperature and pressure',accelerometer:'Read motion and tilt',gesture:'Swipe to send an input',optocoupler:'Control a signal with light',gps:'Read sample location data'};
function renderParts(){
 const query=$('#parts-search').value.trim().toLowerCase(),list=$('#parts-list');list.replaceChildren();
 for(const [type,spec]of Object.entries(definitions)){
  const note=partNotes[type]??'Add this component to your circuit';if(isBoard(type)||!`${spec.name} ${note}`.toLowerCase().includes(query))continue;
  const choice=document.createElement('button');choice.className='part-choice';choice.setAttribute('aria-label','Add '+spec.name);
  const icon=document.createElement('span');icon.className='part-choice-icon';icon.setAttribute('aria-hidden','true');
  const scale=Math.min(44/spec.w,40/spec.h),visual=document.createElement(spec.tag);visual.style.cssText=`pointer-events:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(${scale});transform-origin:center`;
  // The library uses the same component artwork as the canvas.
  initializeComponent({id:'library',type,value:spec.defaultValue,settings:{...spec.settings}},visual);icon.style.position='relative';icon.style.overflow='hidden';icon.append(visual);
  const copy=document.createElement('span');copy.className='part-choice-copy';const name=document.createElement('strong'),description=document.createElement('small');name.textContent=spec.name.split(' · ')[0];description.textContent=note;copy.append(name,description);choice.append(icon,copy);
  choice.onclick=()=>{closeParts();beginPlacement(type);};choice.onpointerdown=event=>beginLibraryDrag(event,type);list.append(choice);
 }
 if(!list.children.length){const empty=document.createElement('p');empty.className='parts-empty';empty.textContent='No matching components. Try “LED”, “motor”, or “sensor”.';list.append(empty);}
}
function openParts(){cancelBuild();$('#parts-search').value='';renderParts();$('#parts-dialog').showModal();$('#parts-search').focus();}
function closeParts(){$('#parts-dialog').close();}
function beginLibraryDrag(event,type){
 // Touch can scroll the library naturally; a tap chooses the part for placement.
 if(event.button!==0||event.pointerType==='touch')return;const start={x:event.clientX,y:event.clientY};let started=false,finished=false;
 const move=e=>{if(e.pointerId!==event.pointerId)return;if(!started&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>6){started=true;closeParts();beginPlacement(type);activeGesture={cancel:()=>finish(false)};}if(started)setPlacementPoint(worldPoint(e));};
 const finish=(commit,e)=>{if(finished)return;finished=true;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);if(!started)return;activeGesture=null;const r=$('#circuit-viewport').getBoundingClientRect();if(commit&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)placePart(worldPoint(e));else cancelBuild();suppressCanvasClick();};
 const up=e=>{if(e.pointerId===event.pointerId)finish(true,e);};const cancel=e=>{if(e.pointerId===event.pointerId)finish(false,e);};
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
}
$('#parts-open').onclick=openParts;$('#parts-close').onclick=closeParts;$('#parts-search').oninput=renderParts;
$('#parts-search').onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();$('#parts-list button')?.focus();}if(e.key==='Enter'&&$('#parts-list').querySelectorAll('button').length===1){e.preventDefault();$('#parts-list button').click();}};
$('#parts-dialog').addEventListener('click',e=>{if(e.target===$('#parts-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeParts();}});
for(const name of ['pins','details']){
 $('#'+name+'-tab').onclick=()=>showDetailTab(name);
 $('#'+name+'-tab').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'pins':e.key==='End'?'details':name==='pins'?'details':'pins';showDetailTab(next);$('#'+next+'-tab').focus();}};
}
$('#show-pin-labels').onchange=drawPinLabels;
$('#run').onclick=run;$('#stop').onclick=()=>stop({silent:false});$('#circuit-run').onclick=run;$('#circuit-stop').onclick=()=>stop({silent:false});$('#remove-selected').onclick=removeSelected;$('#fit-circuit').onclick=fit;$('#return-to-circuit').onclick=()=>{fit();$('#circuit-viewport').focus({preventScroll:true});};$('#zoom-in').onclick=()=>zoom(1.2);$('#zoom-out').onclick=()=>zoom(1/1.2);$('#cancel-wire').onclick=cancelBuild;document.querySelectorAll('.color').forEach(button=>button.onclick=()=>setWireColor(button.dataset.color));
const viewport=$('#circuit-viewport');
viewport.addEventListener('pointermove',event=>{
 pointerWorld=worldPoint(event);if(placement){setPlacementPoint(pointerWorld);return;}if(!wireStart)return;
 const explicit=event.target.closest?.('.pin')?.dataset.endpoint;wireCandidate=explicit&&explicit!==wireStart?explicit:closestPin(pointerWorld,event.pointerType);
 if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;updateWireHighlights();});
});
viewport.addEventListener('pointerleave',()=>{showPinTooltip(null);if(wireStart&&!activeGesture){wireCandidate=null;updateWireHighlights();}});
viewport.addEventListener('contextmenu',event=>{if(placement||wireStart||activeGesture){event.preventDefault();cancelBuild();}});
viewport.addEventListener('wheel',event=>{
 if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();showPinTooltip(null);
 const r=viewport.getBoundingClientRect();camera=zoomCamera(camera,Math.exp(-event.deltaY*.01),{x:event.clientX-r.left,y:event.clientY-r.top});transform();drawPendingWire();
},{passive:false});
viewport.addEventListener('pointerdown',event=>{
 if(event.button!==0)return;
 if(placement){event.preventDefault();event.stopImmediatePropagation();suppressPlacementClick=true;placePart(worldPoint(event));return;}
 if(nativeControl(event))return;
 if(wireStart&&event.target.closest?.('.pin'))return;
 if(wireStart){const candidate=closestPin(worldPoint(event),event.pointerType);if(candidate){event.preventDefault();event.stopPropagation();suppressPlacementClick=true;connectPin(candidate);return;}}
 if(event.target!==viewport&&event.target!==$('#circuit-stage')&&event.target!==$('#parts'))return;
 event.preventDefault();viewport.focus({preventScroll:true});const initial={x:camera.x,y:camera.y,cx:event.clientX,cy:event.clientY};let moved=false;
 viewport.setPointerCapture(event.pointerId);
 const move=e=>{if(Math.hypot(e.clientX-initial.cx,e.clientY-initial.cy)>4)moved=true;camera.x=initial.x+e.clientX-initial.cx;camera.y=initial.y+e.clientY-initial.cy;transform();drawPendingWire();};
 const end=e=>{viewport.removeEventListener('pointermove',move);viewport.removeEventListener('pointerup',end);viewport.removeEventListener('pointercancel',end);viewport.removeEventListener('lostpointercapture',end);if(!moved&&e.type==='pointerup'){if(wireStart){cancelBuild();buildNotice='Connection canceled.';updateBuildContext();}else select();}};
 viewport.addEventListener('pointermove',move);viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',end);
},true);
viewport.addEventListener('click',event=>{if(suppressPlacementClick){suppressPlacementClick=false;event.preventDefault();event.stopImmediatePropagation();}},true);
window.addEventListener('pointerup',()=>{if(suppressPlacementClick)setTimeout(()=>{suppressPlacementClick=false;},0);});window.addEventListener('pointercancel',()=>{suppressPlacementClick=false;});
$('#build-cancel').onclick=cancelBuild;$('#circuit-undo').onclick=()=>stepHistory();$('#circuit-redo').onclick=()=>stepHistory(true);$('#pin-search').oninput=renderPinBank;
$('#circuit-focus-toggle').onclick=()=>{const center=centerPoint(),enabled=document.body.classList.toggle('circuit-focus');$('#circuit-focus-toggle').textContent=enabled?'Code + circuit':'Focus circuit';$('#circuit-focus-toggle').setAttribute('aria-pressed',String(enabled));requestAnimationFrame(()=>{sizeWorkspace();camera.x=viewport.clientWidth/2-center.x*camera.scale;camera.y=viewport.clientHeight/2-center.y*camera.scale;transform();keepPartVisible(selectedPart??pinBankPartId);viewport.focus({preventScroll:true});});};

$('#project-name').oninput=()=>{project.name=$('#project-name').value;save();};$('#entry-file').onchange=e=>{project.entry=e.target.value;renderFiles();save();};$('#new-project').onclick=()=>loadProject(blank());$('#undo-load').onclick=async()=>{if(!undoProject)return;const previous=undoProject,current=capture();await loadProject(previous,{undo:false});undoProject=current;toast('Project change undone.');};
function openFileDialog(action){fileAction=action;$('#file-dialog-title').textContent=action==='add'?'Add a file':'Rename this file';$('#file-name').value=action==='add'?'':project.selectedFile;$('#file-error').textContent='';$('#file-dialog').showModal();$('#file-name').focus();}
$('#add-file').onclick=()=>openFileDialog('add');$('#rename-file').onclick=()=>openFileDialog('rename');$('#file-dialog-close').onclick=()=>$('#file-dialog').close();$('#file-form').onsubmit=e=>{e.preventDefault();const name=$('#file-name').value.trim(),old=project.selectedFile;if(!validName(name)){ $('#file-error').textContent='Use a .js, .json, .html, .css or .sh name, such as Rover.js or app/index.html.';return;}if(Object.hasOwn(project.files,name)&&!(fileAction==='rename'&&name===old)){$('#file-error').textContent='A file with that name already exists.';return;}if(fileAction==='add'&&Object.keys(project.files).length>=30){$('#file-error').textContent='This project already has 30 files.';return;}capture();if(fileAction==='rename'){project.files[name]=project.files[old];if(name!==old)delete project.files[old];if(project.entry===old){if(!name.endsWith('.js')&&!(name.endsWith('.sh')&&['raspi','beaglebone'].includes(project.platform))){$('#file-error').textContent='The entry file must end in .js, or .sh for the virtual Pi/BeagleBone shell.';project.files[old]=project.files[name];if(name!==old)delete project.files[name];return;}project.entry=name;}}else project.files[name]='';project.selectedFile=name;replaceCode(project.files[name]);renderFiles();save();$('#file-dialog').close();};
$('#delete-file').onclick=()=>{if(project.selectedFile===project.entry)return;delete project.files[project.selectedFile];project.selectedFile=project.entry;replaceCode(project.files[project.entry]);renderFiles();save();};
$('#console-mode').onchange=()=>{$('#repl-input').placeholder=$('#console-mode').value==='shell'?'Virtual GPIO shell: enter help for supported commands':'Enter a JavaScript command…';if($('#console-mode').value==='shell')log('Virtual shell: only the book’s GPIO/file commands are simulated. Enter help for details.','system');};
$('#clear-console').onclick=()=>$('#console').replaceChildren();$('#repl-form').onsubmit=e=>{e.preventDefault();const code=$('#repl-input').value;if(!ready||!code.trim())return;log('› '+code,'command');worker.postMessage({type:$('#console-mode').value==='shell'?'shell':'eval',id:++evalId,code});$('#repl-input').value='';};
$('#keys-toggle').onclick=()=>{const open=$('#key-controls').hidden;$('#key-controls').hidden=!open;$('#keys-toggle').setAttribute('aria-expanded',String(open));$('#key-controls').tabIndex=0;if(open)$('#key-controls').focus();};
function sendKey(name,ctrl=false,character=''){if(worker&&ready)worker.postMessage({type:'key',key:{name,ctrl},character});}
document.querySelectorAll('[data-key]').forEach(button=>button.onclick=()=>sendKey(button.dataset.key));
document.addEventListener('keydown',event=>{
 if(document.querySelector('dialog[open]'))return;
 const circuit=event.target.closest('.circuit-panel'),editable=event.target.closest('input,textarea,select,.cm-editor,[contenteditable=true]');
 if(circuit&&event.key==='Escape'){event.preventDefault();cancelBuild();select();return;}
 if(circuit&&!editable&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='z'){event.preventDefault();stepHistory(event.shiftKey);return;}
 if(circuit&&!editable&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='y'){event.preventDefault();stepHistory(true);return;}
 if(circuit&&!editable&&!event.metaKey&&!event.ctrlKey&&event.key.toLowerCase()==='a'){event.preventDefault();openParts();return;}
 if(circuit&&!editable&&!event.metaKey&&!event.ctrlKey&&event.key.toLowerCase()==='f'){event.preventDefault();fit();return;}
 if(circuit&&!editable&&placement&&event.key==='Enter'){event.preventDefault();placePart(centerPoint());return;}
 if(editable)return;
 if(circuit&&['Delete','Backspace'].includes(event.key)&&(selectedPart||selectedWire!==null)){event.preventDefault();removeSelected();return;}
 if(circuit&&selectedPart&&!placement&&!wireStart&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)&&(event.target===viewport||event.target.closest('.part-label'))){
  event.preventDefault();const part=parts.find(p=>p.id===selectedPart),before=cloneState(circuitState()),amount=event.shiftKey?10:1;
  part.x+=event.key==='ArrowLeft'?-amount:event.key==='ArrowRight'?amount:0;part.y+=event.key==='ArrowUp'?-amount:event.key==='ArrowDown'?amount:0;
  part.root.style.left=part.x+'px';part.root.style.top=part.y+'px';drawWires();recordCircuit(before,'Move '+componentName(part),{merge:true});save();return;
 }
 if(!$('#key-controls').hidden&&$('#key-controls').contains(event.target)&&!(event.key===' '&&event.target.closest('button'))&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(event.key)){event.preventDefault();sendKey(event.key===' '?'space':event.key.slice(5).toLowerCase());}
 if(!$('#key-controls').hidden&&$('#key-controls').contains(event.target)&&event.ctrlKey&&event.key==='c'){event.preventDefault();sendKey('c',true);}
});

function helpTab(name){for(const id of ['start','book','examples']){$('#help-'+id).hidden=id!==name;$('#help-'+id+'-tab').setAttribute('aria-selected',String(id===name));}}
for(const name of ['start','book','examples'])$('#help-'+name+'-tab').onclick=()=>helpTab(name);$('#help-open').onclick=()=>$('#help').showModal();$('#help-footer').onclick=()=>{helpTab('book');$('#help').showModal();};for(const name of ['help','about','share'])$('#'+name+'-close').onclick=()=>$('#'+(name==='share'?'share-dialog':name)).close();$('#about-open').onclick=()=>$('#about').showModal();
function sampleScene(kind){const nodes=[{id:'board',type:'uno',x:180,y:160}],links=[];const wire=(a,b)=>links.push({a,b,color:/:GND|:C$/.test(a+b)?'#526477':/:5V|:VCC|:V\+/.test(a+b)?'#ed6f48':'#194ced'});if(kind==='servo'){nodes.push({id:'motor',type:'servo',x:680,y:190});wire('board:9','motor:PWM');wire('board:5V','motor:V+');wire('board:GND.2','motor:GND');}else{nodes.push({id:'light',type:'led',x:780,y:190},{id:'resistor',type:'resistor',x:660,y:300,value:330});wire(`board:${kind==='fade'||kind==='dial'?11:13}`,'resistor:1');wire('resistor:2','light:A');wire('board:GND.1','light:C');if(kind==='button'){nodes.push({id:'switch',type:'button',x:720,y:390,value:0});wire('board:2','switch:1.l');wire('board:GND.2','switch:2.l');}if(kind==='dial'){nodes.push({id:'dial',type:'pot',x:700,y:390,value:512});wire('board:A0','dial:SIG');wire('board:5V','dial:VCC');wire('board:GND.2','dial:GND');}}return {parts:nodes,wires:links};}
async function loadExample(example,prepared){const platform=example.platform??'uno',boardType=Object.keys(definitions).find(t=>(definitions[t].platform??(t==='uno'?'uno':''))===platform&&isBoard(t))??'uno',base={...blank(),name:example.label??example.name??example.title,files:example.files??{'index.js':example.code},entry:example.entry?.replace(/^\//,'')??'index.js',platform,note:example.workspaceNote??(example.environment==='arduino'?'Optional book example. Edit the code or build your own circuit.':example.platform==='puck'?'The Puck connection is simulated. Use the web page preview and the virtual BTN.':example.platform==='kinoma'?'The compass page uses a browser model of the board APIs and driver.':Object.keys(example.files??{}).some(name=>name.endsWith('.html'))?'Your web page runs with a simulated server connection. Change the sensor to update it.':'Optional book example. Build it yourself or explore the prepared circuit.'),fixtures:example.fixtures,assets:example.assets};base.files=Object.fromEntries(Object.entries(base.files).map(([k,v])=>[k.replace(/^\//,''),v]));base.selectedFile=base.entry;if(prepared&&example.scene){const scene=typeof example.scene==='string'?sampleScene(example.scene):example.scene;base.parts=scene.parts;base.wires=scene.wires;}else base.parts=[{id:'board',type:boardType,x:200,y:200}];await loadProject(base);$('#help').close();toast(prepared?'Example loaded. Explore or change it.':'Code loaded. Build the circuit yourself.');}
const labelFor=status=>status==='verified'||status==='working'?'Verified example':status==='runtime-checked'?'Program checked':status==='api-checked'||status==='adapter-checked'?'API check passed':status==='model-checked'?'Circuit model checked':status==='conceptual-only'?'Concepts':status==='partial'?'Partial coverage':'More work needed';const classFor=status=>status==='verified'||status==='working'||status==='runtime-checked'||status==='model-checked'?'working':status==='partial'||status==='adapter-checked'||status==='api-checked'?'partial':'pending';
function tag(status){const span=document.createElement('span');span.className='coverage-tag '+classFor(status);span.textContent=labelFor(status);return span;}
function link(text,url){const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener';return a;}
for(const chapter of chapters){const details=document.createElement('details');details.className='chapter';const summary=document.createElement('summary'),num=document.createElement('span');num.className='chapter-number';num.textContent=String(chapter.number).padStart(2,'0');summary.append(num,document.createTextNode(chapter.title),tag(chapter.status));details.append(summary);const body=document.createElement('div');body.className='chapter-body';const desc=document.createElement('p');desc.textContent=chapter.summary??chapter.needs??'';body.append(desc);const actions=document.createElement('div');actions.className='example-actions';actions.append(link('Read this chapter ↗',chapter.url??`https://livebook.manning.com/book/javascript-on-things/chapter-${chapter.number}`),link('Official example source ↗',chapter.sourceUrl??'https://github.com/lyzadanger/javascript-on-things'));body.append(actions);for(const exercise of chapter.exercises??[]){const div=document.createElement('div');div.className='book-example';const row=document.createElement('div'),title=document.createElement('b');title.textContent=exercise.name??exercise.path;row.append(title,tag(exercise.status));div.append(row);const p=document.createElement('p');p.textContent=exercise.note??exercise.needs??'';div.append(p);const example=bookExamples.find(e=>e.sourcePath===exercise.path||e.path===exercise.path);if(example){const buttons=document.createElement('div');buttons.className='example-actions';const button=document.createElement('button');button.className='text-button';button.textContent='Load code';button.onclick=()=>loadExample(example,false);buttons.append(button);if(example.scene){const built=document.createElement('button');built.className='text-button';built.textContent='Load prepared circuit';built.onclick=()=>loadExample(example,true);buttons.append(built);}div.append(buttons);}body.append(div);}details.append(body);$('#chapter-list').append(details);}
for(const sample of [...examples,...bookExamples.filter(e=>e.featured)]){const card=document.createElement('article');card.className='sample';const h=document.createElement('h3');h.textContent=sample.label??sample.name??sample.title;const p=document.createElement('p');p.textContent=sample.description??sample.note??'';const buttons=document.createElement('div');buttons.className='example-actions';const code=document.createElement('button');code.className='text-button';code.textContent='Load code';code.onclick=()=>loadExample(sample,false);buttons.append(code);if(sample.scene){const prepared=document.createElement('button');prepared.className='text-button';prepared.textContent='Load prepared circuit';prepared.onclick=()=>loadExample(sample,true);buttons.append(prepared);}card.append(h,p,buttons);$('#sample-list').append(card);}
$('#download-project').onclick=()=>{const blob=new Blob([JSON.stringify(capture(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(project.name.replace(/[^\w-]+/g,'-').slice(0,60)||'my-circuit')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};$('#open-project').onclick=()=>$('#project-file').click();$('#project-file').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>500000)throw new Error('The project is too large.');await loadProject(JSON.parse(await file.text()));toast('Project opened. Press Run when you’re ready.');}catch(error){toast(error.message);}e.target.value='';};
async function encodeProject(){const stream=new Blob([JSON.stringify(capture())]).stream().pipeThrough(new CompressionStream('deflate')),compressed=new Uint8Array(await new Response(stream).arrayBuffer());let binary='';for(const byte of compressed)binary+=String.fromCharCode(byte);return btoa(binary).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');}
async function decodeProject(encoded){if(encoded.length>300000)throw new Error('The shared project is too large.');const raw=atob(encoded.replaceAll('-','+').replaceAll('_','/')),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0)),reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate')).getReader(),decoder=new TextDecoder();let output='',size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>500000){await reader.cancel();throw new Error('The shared project is too large.');}output+=decoder.decode(value,{stream:true});}return JSON.parse(output+decoder.decode());}
$('#share-mobile').onclick=()=>$('#share').click();$('#share').onclick=async()=>{try{$('#share-link').value=location.origin+location.pathname+'#project='+await encodeProject();$('#share-status').textContent='';$('#share-dialog').showModal();}catch{toast('Could not create a link. Use Download to share a project file.');}};$('#copy-share').onclick=async()=>{try{await navigator.clipboard.writeText($('#share-link').value);$('#share-status').textContent='Link copied!';}catch{$('#share-link').focus();$('#share-link').select();$('#share-status').textContent='Select and copy the link above.';}};
let initialSaved=null;try{initialSaved=localStorage.getItem(storageKey);}catch{}
const startup=await resolveProjectStartup({saved:initialSaved,hash:location.hash,blank,normalize:normalizeProject,decode:decodeProject,confirmReplace:()=>window.confirm('Open this shared project and replace the project saved on this device? Cancel keeps your saved work so you can download it first. After opening, Undo project change restores it until you leave this page.')});
await loadProject(startup.project,{undo:false});
if(startup.previous){undoProject=startup.previous;$('#undo-load').hidden=false;}
if(startup.shared)toast('Shared project opened. Press Run when you’re ready.');
else if(startup.canceled)toast('Your saved project is still open.');
else if(startup.error)toast(startup.error.message+' Your saved project, if valid, has been kept.');
window.addEventListener('beforeunload',()=>{worker?.terminate();try{localStorage.setItem(storageKey,JSON.stringify(capture()));}catch{}});
window.addEventListener('message',event=>{if(event.source!==$('#web-preview-frame').contentWindow||!worker)return;const data=event.data;if(!data||data.type!=='lab-web-client'||typeof data.clientId!=='string'||data.clientId.length>80)return;try{if(JSON.stringify(data).length>12000)return;}catch{return;}worker.postMessage({...data,type:'web-client'});});
const context=document.modelContext;if(context?.registerTool){const lifecycle=new AbortController(),register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};register({name:'read_circuit_lab',description:'Read the current project, circuit and running state.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({...capture(),running,ready,snapshot})});register({name:'configure_circuit_lab_code',description:'Replace the code in the selected file without running it.',inputSchema:{type:'object',properties:{code:{type:'string',maxLength:60000}},required:['code'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{if(typeof input?.code!=='string'||input.code.length>60000)throw new Error('Use at most 60000 characters.');replaceCode(input.code);save();return {configured:true};}});register({name:'configure_circuit_lab_project',description:'Load a complete project including files and wiring. The previous project can be restored with Undo.',inputSchema:{type:'object',properties:{project:{type:'object'}},required:['project'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async input=>{await loadProject(input.project);return {configured:true};}});register({name:'run_circuit_lab',description:'Run the code currently shown in the entry file.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:()=>{run();return {started:running};}});register({name:'stop_circuit_lab',description:'Stop the running program and reset the virtual board.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{stop({silent:false});return {stopped:true};}});window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
