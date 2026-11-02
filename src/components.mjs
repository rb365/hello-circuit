// Original Little Circuit Lab component catalog. Visuals from @wokwi/elements
// are MIT licensed; custom parts below are original SVG, not Velxio source.
const pin = (name,x,y) => ({name,x,y,signals:[]});
const rows = (left,right,w=150,h=100) => [
  ...left.map((name,i)=>pin(name,0,22+i*18)),
  ...right.map((name,i)=>pin(name,w,22+i*18))
];
const range = (key,label,min,max,step,value) => ({key,label,min,max,step,default:value,type:'range'});
function def(name,tag,width,height,extra={}) {
  return {name,tag,width,height,w:width,h:height,scale:1,defaultValue:0,controls:[],...extra};
}
// Native platform pin numbers match the original virtual IO adapter. These
// boards model public APIs, not their processors or operating systems.
const tesselLabels=[...Array.from({length:8},(_,i)=>'A'+i),...Array.from({length:8},(_,i)=>'B'+i),...Array.from({length:4},(_,i)=>'L'+i)];
const picoLabels=[...Array.from({length:16},(_,i)=>'A'+i),...Array.from({length:16},(_,i)=>'B'+i),'LED1','LED2','BTN'];
const bbbGPIO={'P8_7':66,'P8_8':67,'P8_9':69,'P8_10':68,'P8_11':45,'P8_12':44,'P8_13':23,'P8_14':26,'P8_15':47,'P8_16':46,'P8_17':27,'P8_18':65,'P8_19':22,'P8_26':61,'P9_11':30,'P9_12':60,'P9_13':31,'P9_14':50,'P9_15':48,'P9_16':51,'P9_17':5,'P9_18':4,'P9_21':3,'P9_22':2,'P9_23':49,'P9_24':15,'P9_26':14,'P9_27':115,'P9_30':112,'P9_41':20,'P9_42':7};
const bbbLabels=[...Object.keys(bbbGPIO),'USR0','USR1','USR2','USR3','P9_19','P9_20'];
const piPhysical={3:2,5:3,7:4,8:14,10:15,11:17,12:18,13:27,15:22,16:23,18:24,19:10,21:9,22:25,23:11,24:8,26:7,27:0,28:1,29:5,31:6,32:12,33:13,35:19,36:16,37:26,38:20,40:21};
const piWiring=[17,18,27,22,23,24,25,4,2,3,8,7,10,9,11,14,15,28,29,30,31,5,6,13,19,26,12,16,20,21,0,1];
const labelMap=labels=>Object.fromEntries(labels.map((label,i)=>[label,i]));
function boardDef(name,platform,labels,extra={}){
  const width=300;const all=[...labels,'GND','3.3V','5V'];const middle=Math.ceil(all.length/2);const height=Math.max(260,60+middle*18);
  return def(name,'lab-board-'+platform,width,height,{isBoard:true,virtual:true,platform,logicVoltage:3.3,pins:rows(all.slice(0,middle),all.slice(middle),width),pinMap:labelMap(labels),nativeLabels:labels,adcResolution:1023,analogPins:[],i2cPairs:[],ledPins:[],...extra});
}
const breadboardPins=[];
for(let col=1;col<=15;col++){
  for(let row=0;row<10;row++)breadboardPins.push(pin('abcdefghij'[row]+col,28+(col-1)*16,36+row*10+(row>=5?20:0)));
  breadboardPins.push(pin('+'+col,28+(col-1)*16,15),pin('-'+col,28+(col-1)*16,168));
}
export const definitions = {
  uno:def('Arduino Uno','wokwi-arduino-uno',274.3,201.6,{scale:1.2,isBoard:true,platform:'uno',logicVoltage:5,adcResolution:1023,analogPins:[14,15,16,17,18,19],i2cPairs:[{SDA:18,SCL:19}]}),
  tessel:boardDef('Tessel 2 · virtual API','tessel',tesselLabels,{adcResolution:4095,analogPins:[4,8,9,10,11,12,13,14],i2cPairs:[{SDA:1,SCL:0},{SDA:9,SCL:8}],ledPins:['L0','L1','L2','L3']}),
  pico:boardDef('Espruino Pico · virtual API','pico',picoLabels,{analogPins:Array.from({length:32},(_,i)=>i),i2cPairs:[{SDA:23,SCL:22}],ledPins:['LED1','LED2'],controls:[range('value','Onboard BTN (0 = released, 1 = pressed)',0,1,1,0)]}),
  raspi:boardDef('Raspberry Pi · virtual API','raspi',Array.from({length:28},(_,i)=>'GPIO'+i),{pinMap:{...labelMap(Array.from({length:32},(_,i)=>'GPIO'+i)),...Object.fromEntries(Object.entries(piPhysical).map(([header,bcm])=>['P1-'+header,bcm])),...Object.fromEntries(piWiring.map((bcm,i)=>['WPI'+i,bcm]))},i2cPairs:[{SDA:2,SCL:3}]}),
  beaglebone:boardDef('BeagleBone · virtual API','beaglebone',bbbLabels,{pinMap:{...labelMap(bbbLabels),...Object.fromEntries(Object.entries(bbbGPIO).map(([label,gpio])=>['GPIO'+gpio,bbbLabels.indexOf(label)]))},i2cPairs:[{SDA:36,SCL:35}],ledPins:['USR0','USR1','USR2','USR3'],reservedPins:[35,36]}),
  kinoma:boardDef('Kinoma Element · virtual API','kinoma',Array.from({length:16},(_,i)=>String(i+1)),{i2cPairs:[{SDA:12,SCL:13}],powerPins:{11:3.3},groundPins:['12'],reservedPins:[10,11,12,13]}),
  puck:boardDef('Puck.js · virtual API','puck',['LED1','LED2','LED3','BTN'],{ledPins:['LED1','LED2','LED3'],controls:[range('value','Onboard BTN (0 = released, 1 = pressed)',0,1,1,0)]}),
  led:def('LED','wokwi-led',40,50,{scale:1.3}),
  rgb:def('RGB LED · common cathode','wokwi-rgb-led',42.129,72.582,{scale:1.2}),
  resistor:def('Resistor','wokwi-resistor',58.8,11.3,{defaultValue:330,settings:{maxPower:.25},controls:[range('value','Resistance (Ω)',10,100000,10,330)]}),
  button:def('Push button','wokwi-pushbutton',67,45,{scale:1.2}),
  switch:def('Slide switch','wokwi-slide-switch',32.13,34.89,{scale:1.5,controls:[range('value','Switch position',0,1,1,0)]}),
  pot:def('Potentiometer','wokwi-potentiometer',75.6,75.6,{scale:1.2,defaultValue:512,controls:[range('value','Dial (0–1023)',0,1023,1,512)]}),
  photoresistor:def('Photoresistor','lab-photoresistor',88,78,{defaultValue:500,pins:[pin('1',25,78),pin('2',63,78)],controls:[range('value','Light level (lux)',0,10000,10,500)]}),
  tmp36:def('TMP36 temperature sensor','lab-tmp36',110,90,{defaultValue:25,pins:[pin('VCC',22,90),pin('OUT',55,90),pin('GND',88,90)],controls:[range('value','Temperature (°C)',-40,125,1,25)]}),
  servo:def('Servo motor','wokwi-servo',170.08,119.55),
  piezo:def('Piezo buzzer','wokwi-buzzer',75,93),
  lcd:def('16×2 LCD · parallel','wokwi-lcd1602',302.4,136.1),
  'grove-lcd':def('Grove RGB LCD · I²C','wokwi-lcd1602',302.4,136.1,{settings:{address:0x3e}}),
  'nokia-lcd':def('Nokia 5110 · numeric Graphics API','lab-nokia-lcd',240,154,{pins:rows(['VCC','GND','SCLK','DIN'],['DC','CE','RST'],240)}),
  motor:def('DC motor','lab-motor',120,110,{pins:[pin('+',15,100),pin('-',105,100)]}),
  mosfet:def('N-channel MOSFET','lab-mosfet',110,94,{pins:[pin('G',20,94),pin('D',55,94),pin('S',90,94)]}),
  hbridge:def('SN754410 motor driver','lab-hbridge',160,170,{pins:rows(['1EN','1A','1Y','GND.1','GND.2','2Y','2A','VCC2'],['VCC1','4A','4Y','GND.4','GND.3','3Y','3A','2EN'],160)}),
  'shift-register':def('74HC595 shift register','lab-shift-register',150,170,{pins:rows(['QB','QC','QD','QE','QF','QG','QH','GND'],['VCC','QA','DS','OE','STCP','SHCP','MR','QH′'],150)}),
  breadboard:def('Mini breadboard','lab-breadboard',280,186,{pins:breadboardPins}),
  battery:def('Battery','lab-battery',110,96,{defaultValue:9,pins:[pin('+',30,0),pin('-',80,0)],controls:[range('value','Battery voltage (V)',1.5,12,0.5,9)]}),
  diode:def('1N4001 diode','lab-diode',100,40,{pins:[pin('A',0,20),pin('C',100,20)]}),
  capacitor:def('Capacitor','lab-capacitor',85,83,{defaultValue:100,pins:[pin('+',24,83),pin('-',61,83)]}),
  compass:def('HMC5883L compass','lab-compass',150,110,{defaultValue:0,pins:rows(['VCC','GND'],['SDA','SCL'],150),controls:[range('value','Heading (°)',0,359,1,0)]}),
  weather:def('BMP180 weather sensor','lab-weather',150,110,{defaultValue:25,pins:rows(['VCC','GND'],['SDA','SCL'],150),settings:{temperature:25,pressurePa:101325},controls:[range('temperature','Temperature (°C)',-20,85,1,25),range('pressurePa','Pressure (Pa)',30000,110000,100,101325)]}),
  accelerometer:def('ADXL345 accelerometer','lab-accelerometer',150,110,{pins:rows(['VCC','GND'],['SDA','SCL'],150),settings:{x:0,y:0,z:1},controls:[range('x','X acceleration (g)',-16,16,0.1,0),range('y','Y acceleration (g)',-16,16,0.1,0),range('z','Z acceleration (g)',-16,16,0.1,1)]}),
  gesture:def('APDS9960 gesture sensor','lab-gesture',270,170,{pins:rows(['VCC','GND','INT'],['SDA','SCL'],270),settings:{sequence:0},controls:[range('value','Gesture (0:none, 1:up, 2:down, 3:left, 4:right)',0,4,1,0)]}),
  optocoupler:def('4N25 optocoupler · signal model','lab-optocoupler',170,130,{pins:rows(['A','K','NC'],['B','C','E'],170),settings:{currentTransferRatio:.2}}),
  gps:def('GPS serial receiver','lab-gps',160,110,{pins:rows(['VCC','GND'],['TX','RX'],160),settings:{latitude:40.7128,longitude:-74.006,altitude:10},controls:[range('latitude','Latitude (°)',-90,90,0.001,40.7128),range('longitude','Longitude (°)',-180,180,0.001,-74.006),range('altitude','Altitude (m)',-100,5000,1,10)]})
};

const escapeXML = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function artwork(type,state,value){
  if(type==='gesture'){
    const arrows=[['up',135,48,'↑'],['left',102,85,'←'],['right',168,85,'→'],['down',135,122,'↓']];
    return `<rect x="8" y="6" width="254" height="158" rx="10" fill="#16775d"/><text x="135" y="25" text-anchor="middle" fill="white" font-size="11">APDS9960</text>${arrows.map(([direction,x,y,arrow])=>`<g data-gesture="${direction}" role="button" tabindex="0" aria-label="Generate ${direction} gesture" style="cursor:pointer"><rect x="${x-15}" y="${y-15}" width="30" height="30" rx="6" fill="#dfeee7"/><text x="${x}" y="${y+6}" text-anchor="middle" fill="#22534a" font-size="22">${arrow}</text></g>`).join('')}<text x="135" y="153" text-anchor="middle" fill="#c3e8dd" font-size="9">${escapeXML(state.lastGesture??(state.powered?'tap a gesture':'connect power / I²C / INT'))}</text>${definitions[type].pins.map(p=>`<path d="M${p.x} ${p.y}h${p.x===0?10:-10}" stroke="#d5c471" stroke-width="4"/><text x="${p.x===0?12:258}" y="${p.y+3}" text-anchor="${p.x===0?'start':'end'}" fill="white" font-size="8">${escapeXML(p.name)}</text>`).join('')}`;
  }
  if(type==='optocoupler')return `<rect x="8" y="6" width="154" height="116" rx="9" fill="#26313e"/><path d="M0 22H43M0 40H43M126 40H170M126 58H170" stroke="#c9bb73" stroke-width="4"/><path d="M43 19L61 31L43 43Z" fill="${state.active?'#ff9256':'#718096'}"/><path d="M64 19V44M84 11V78" stroke="#b8c9dd" stroke-width="2" stroke-dasharray="3 3"/><path d="M93 31L113 31L126 18M113 31V57L126 70M113 45L126 58" stroke="#b8c9dd" stroke-width="3" fill="none"/><path d="M67 26L77 22M67 39L77 35" stroke="${state.active?'#ff9256':'#68798c'}" stroke-width="2"/><text x="85" y="91" text-anchor="middle" fill="white" font-size="11">4N25 · signal model</text><text x="85" y="108" text-anchor="middle" fill="#c4eadf" font-size="9">${state.active?'optical output active':'input off'}</text>${definitions[type].pins.map((p,i)=>`<text x="${p.x===0?12:158}" y="${p.y+3}" text-anchor="${p.x===0?'start':'end'}" fill="white" font-size="8">${p.x===0?i+1:9-i} ${escapeXML(p.name)}</text>`).join('')}`;
  if(definitions[type]?.isBoard){
    const spec=definitions[type],cx=spec.width/2,cy=spec.height/2;
    const ledPositions=spec.ledPins.map((name,i)=>({name,x:cx+(i-(spec.ledPins.length-1)/2)*24}));
    return `<rect x="8" y="6" width="${spec.width-16}" height="${spec.height-14}" rx="14" fill="#263e65" stroke="#a9bad3"/><rect x="${cx-65}" y="${cy-70}" width="130" height="90" rx="10" fill="#192c4a"/><text x="${cx}" y="${cy-44}" text-anchor="middle" fill="white" font-size="12">${escapeXML(spec.name.split(' · ')[0])}</text><text x="${cx}" y="${cy-23}" text-anchor="middle" fill="#b9d5fb" font-size="10">Virtual API model</text><text x="${cx}" y="${cy-7}" text-anchor="middle" fill="#b9d5fb" font-size="9">No CPU / OS emulation</text>${ledPositions.map(({name,x})=>`<circle cx="${x}" cy="${cy+37}" r="6" fill="${state.leds?.[name]?'#b4ee65':'#526074'}"/><text x="${x}" y="${cy+57}" text-anchor="middle" fill="#cbd8ea" font-size="8">${escapeXML(name)}</text>`).join('')}${type==='pico'||type==='puck'?`<g data-board-button="BTN" role="button" tabindex="0" aria-label="Onboard BTN" aria-pressed="${!!value}" style="cursor:pointer"><rect x="${cx-28}" y="${cy+74}" width="56" height="25" rx="6" fill="${value?'#ff965f':'#e5ecf5'}"/><text x="${cx}" y="${cy+91}" text-anchor="middle" fill="#243c60" font-size="10">BTN ${value?'ON':'OFF'}</text></g>`:''}${spec.pins.map(p=>`<path d="M${p.x} ${p.y}h${p.x===0?10:-10}" stroke="#d5c471" stroke-width="4"/><text x="${p.x===0?12:spec.width-12}" y="${p.y+3}" text-anchor="${p.x===0?'start':'end'}" fill="#eef1e8" font-size="8">${escapeXML(p.name)}</text>`).join('')}`;
  }
  if(type==='nokia-lcd'){
    const width=84,height=48,pixels=Array.isArray(state.pixels)||ArrayBuffer.isView(state.pixels)?Array.prototype.slice.call(state.pixels,0,width*height):[];
    return `<rect x="8" y="6" width="224" height="138" rx="8" fill="#245547"/><rect x="36" y="18" width="168" height="96" fill="#c9d89c"/>${state.powered!==false?Array.from(pixels,(pixel,i)=>pixel?`<rect x="${36+(i%width)*2}" y="${18+Math.floor(i/width)*2}" width="2" height="2" fill="#263d28"/>`:'').slice(0,width*height).join(''):''}<text x="120" y="132" text-anchor="middle" fill="white" font-size="9">Nokia 5110 · numeric Graphics subset</text>${definitions[type].pins.map(p=>`<path d="M${p.x} ${p.y}h${p.x===0?10:-10}" stroke="#d5c471" stroke-width="4"/><text x="${p.x===0?12:228}" y="${p.y+3}" text-anchor="${p.x===0?'start':'end'}" fill="white" font-size="8">${escapeXML(p.name)}</text>`).join('')}`;
  }
  if(type==='breadboard')return `<rect x="2" y="2" width="276" height="180" rx="10" fill="#fffdf7" stroke="#c8c6bb"/><path d="M10 104H270" stroke="#d2cfbf" stroke-width="12"/><path d="M15 15H265" stroke="#de4b4b" stroke-width="2"/><path d="M15 168H265" stroke="#315fe8" stroke-width="2"/>${breadboardPins.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="2" fill="#7d817e"/>`).join('')}<text x="140" y="181" text-anchor="middle" font-size="8">a–e and f–j connect by column · full +/− rails</text>`;
  if(type==='motor')return `<circle cx="60" cy="49" r="39" fill="#cad5e1" stroke="#64748b" stroke-width="5"/><g class="motor-rotor ${state.speed?'spinning':''}" style="animation-duration:${Math.max(.08,1-Math.abs(state.speed??0)*.9)}s;animation-direction:${state.direction===-1?'reverse':'normal'}"><path d="M60 20V78M31 49H89" stroke="#194ced" stroke-width="9"/><circle cx="60" cy="49" r="9" fill="#273d57"/></g><text x="60" y="107" text-anchor="middle" font-size="10">${Math.round(Math.abs(state.speed??0)*100)}% · ${state.direction===-1?'reverse':'forward'}</text>`;
  if(type==='photoresistor')return `<path d="M25 40V78M63 40V78" stroke="#9aa1aa" stroke-width="3"/><circle cx="44" cy="31" r="25" fill="#ddad5b" stroke="#907146" stroke-width="2"/><path d="M29 16H52V24H35V32H52V40H29" stroke="#a14825" stroke-width="4" fill="none"/><text x="44" y="68" text-anchor="middle" font-size="9">${escapeXML(value)} lux</text>`;
  if(type==='tmp36'||type==='mosfet')return `<path d="M20 51V94M55 51V94M90 51V94" stroke="#9ca3af" stroke-width="4"/><rect x="13" y="8" width="84" height="53" rx="15" fill="#27313c"/><text x="55" y="34" text-anchor="middle" fill="white" font-size="12">${type==='tmp36'?'TMP36':'MOSFET'}</text><text x="55" y="51" text-anchor="middle" fill="#b9c9dd" font-size="10">${type==='tmp36'?escapeXML(value)+' °C':'FQP30N06L'}</text>`;
  if(type==='battery')return `<rect x="17" y="9" width="77" height="83" rx="7" fill="#273d57"/><path d="M30 0V13M80 0V13" stroke="#b8c1cc" stroke-width="8"/><rect x="17" y="9" width="77" height="24" rx="7" fill="#ed794c"/><text x="55" y="62" text-anchor="middle" fill="white" font-size="22">${escapeXML(value)} V</text><text x="55" y="80" text-anchor="middle" fill="#b8cee6" font-size="9">virtual battery</text>`;
  if(type==='diode')return `<path d="M0 20H100" stroke="#a5adba" stroke-width="3"/><rect x="27" y="10" width="46" height="20" rx="5" fill="#27313c"/><path d="M64 10V30" stroke="#cbd5e1" stroke-width="6"/><text x="50" y="38" text-anchor="middle" font-size="8">1N4001</text>`;
  if(type==='capacitor')return `<path d="M24 51V83M61 51V83" stroke="#9ca3af" stroke-width="3"/><rect x="14" y="6" width="56" height="53" rx="12" fill="#4a5c76"/><path d="M62 9V56" stroke="#cad6e6" stroke-width="7"/><text x="40" y="31" text-anchor="middle" fill="white" font-size="10">${escapeXML(value)} µF</text>`;
  const spec=definitions[type];const chip=type==='hbridge'||type==='shift-register';
  return `<rect x="8" y="6" width="${spec.width-16}" height="${spec.height-14}" rx="8" fill="${chip?'#26313e':'#16775d'}" stroke="#315664"/><circle cx="20" cy="18" r="3" fill="#d8cbd8"/><text x="${spec.width/2}" y="${spec.height/2-10}" text-anchor="middle" fill="white" font-size="11">${escapeXML(type==='hbridge'?'SN754410':type==='shift-register'?'74HC595':spec.name.split(' ')[0])}</text><text x="${spec.width/2}" y="${spec.height/2+10}" text-anchor="middle" fill="#c4eadf" font-size="10">${escapeXML(state.summary??(state.powered?'powered':'connect power'))}</text>${spec.pins.map(p=>`<path d="M${p.x} ${p.y}h${p.x===0?10:-10}" stroke="#d5c471" stroke-width="4"/><text x="${p.x===0?12:spec.width-12}" y="${p.y+3}" text-anchor="${p.x===0?'start':'end'}" fill="#eef1e8" font-size="8">${escapeXML(p.name)}</text>`).join('')}`;
}
if(typeof HTMLElement!=='undefined'&&typeof customElements!=='undefined'){
  for(const [type,spec]of Object.entries(definitions)){
    if(!spec.tag.startsWith('lab-')||customElements.get(spec.tag))continue;
    class CircuitPart extends HTMLElement{
      constructor(){super();this.attachShadow({mode:'open'});this._value=spec.defaultValue;this.state={};
        if(type==='pico'||type==='puck'){
          const press=value=>{this._value=value;this.render();this.dispatchEvent(new CustomEvent('board-input',{bubbles:true,composed:true,detail:{pin:'BTN',value}}));};
          this.addEventListener('pointerdown',event=>{if(!event.composedPath().some(node=>node?.getAttribute?.('data-board-button')==='BTN'))return;event.preventDefault();event.stopPropagation();this.setPointerCapture(event.pointerId);this._pressedPointer=event.pointerId;press(1);});
          this.addEventListener('pointerup',event=>{if(this._pressedPointer!==event.pointerId)return;event.stopPropagation();this._pressedPointer=null;press(0);});
          this.addEventListener('pointercancel',()=>{if(this._pressedPointer===null)return;this._pressedPointer=null;press(0);});
          this.addEventListener('keydown',event=>{if(![' ','Enter'].includes(event.key)||!event.composedPath().some(node=>node?.getAttribute?.('data-board-button')==='BTN'))return;event.preventDefault();press(this._value?0:1);});
        }
        if(type==='gesture'){
          const trigger=event=>{const direction=event.composedPath().map(node=>node?.getAttribute?.('data-gesture')).find(Boolean);if(!direction)return;event.preventDefault();event.stopPropagation();this._value=['none','up','down','left','right'].indexOf(direction);this.render();this.dispatchEvent(new CustomEvent('device-action',{bubbles:true,composed:true,detail:{gesture:direction}}));};
          this.addEventListener('click',trigger);this.addEventListener('keydown',event=>{if([' ','Enter'].includes(event.key))trigger(event);});
        }
      }
      get pinInfo(){return spec.pins;}
      get updateComplete(){return Promise.resolve();}
      get value(){return this._value;}
      set value(value){this._value=Number(value);if(this.isConnected)this.render();}
      connectedCallback(){this.render();}
      setState(state){this.state=state??{};this.render();}
      render(){const active=this.shadowRoot.activeElement,buttonFocused=active?.getAttribute('data-board-button')==='BTN',gestureFocused=active?.getAttribute('data-gesture');this.shadowRoot.innerHTML=`<style>:host{display:inline-block;width:${spec.width}px;height:${spec.height}px;color:#273d57}text{font-family:system-ui,sans-serif;pointer-events:none}[data-board-button]:focus,[data-gesture]:focus{outline:2px solid #ffa977;outline-offset:3px}.motor-rotor{transform-origin:60px 49px}.spinning{animation:turn .5s linear infinite}@keyframes turn{to{transform:rotate(360deg)}}</style><svg width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" role="${spec.isBoard||type==='gesture'?'group':'img'}" aria-label="${escapeXML(spec.name)}">${artwork(type,this.state,this._value)}</svg>`;if(buttonFocused)this.shadowRoot.querySelector('[data-board-button]')?.focus();if(gestureFocused&&['up','down','left','right'].includes(gestureFocused))this.shadowRoot.querySelector(`[data-gesture="${gestureFocused}"]`)?.focus();}
    }
    customElements.define(spec.tag,CircuitPart);
  }
}

export function initializeComponent(part,element){
  const spec=definitions[part.type];
  element.value=part.value??spec.defaultValue;
  if(part.type==='resistor')element.value=String(part.value??330);
  if(part.type==='led')element.color=part.settings?.color??'#ff7849';
  if(part.type==='button')element.color='#194ced';
  if(part.type==='grove-lcd')element.pins='i2c';
  if(part.type==='lcd'||part.type==='grove-lcd')part.baseFont=Array.from(element.font??[]);
  return element;
}
export function deviceInputValues(part){
  if(part.type==='compass')return {heading:part.value??0};
  if(part.type==='weather')return {temperature:part.settings?.temperature??part.value??25,pressurePa:part.settings?.pressurePa??part.settings?.pressure??101325};
  if(part.type==='accelerometer')return {x:part.settings?.x??0,y:part.settings?.y??0,z:part.settings?.z??1};
  if(part.type==='gps')return {latitude:part.settings?.latitude??40.7128,longitude:part.settings?.longitude??-74.006,altitude:part.settings?.altitude??10};
  if(part.type==='gesture')return {gesture:['none','up','down','left','right'][part.value??0]??'none',sequence:part.settings?.sequence??0};
  return {value:part.value};
}
export function applyComponentState(part,state={}){
  const element=part.el??part.element;if(!element)return;
  if(part.type==='led'){element.value=(state.brightness??0)>0;element.brightness=state.brightness??0;}
  if(part.type==='rgb'){element.ledRed=state.red??0;element.ledGreen=state.green??0;element.ledBlue=state.blue??0;}
  if(part.type==='servo')element.angle=state.angle??90;
  if(part.type==='piezo')element.hasSignal=!!state.frequency;
  if(part.type==='lcd'||part.type==='grove-lcd'){
    const visible=state.powered!==false&&state.displayOn!==false;
    element.characters=!visible?new Uint8Array(32).fill(32):state.characters??new Uint8Array(32).fill(32);
    element.cursor=visible&&!!state.cursor;element.blink=visible&&!!state.blink;element.cursorX=state.cursorX??0;element.cursorY=state.cursorY??0;
    element.backlight=state.powered!==false&&state.backlight!==false;
    if(state.font)element.font=state.font;
    if(state.customCharacters&&part.baseFont?.length){
      const font=part.baseFont.slice();for(let i=0;i<64;i++){
        const source=state.customCharacters[i]??0;let row=0;for(let bit=0;bit<5;bit++)if(source&(1<<bit))row|=1<<(4-bit);
        font[i]=row;font[i+64]=row;
      }element.font=font;
    }
    if(state.color==='green'||state.color==='blue')element.background=state.color;
    if(typeof state.color==='string'&&/^#[0-9a-f]{6}$/i.test(state.color)){
      // Wokwi 1.9.2's custom-background fallback returns an object. Recolor
      // the screen rectangle after its normal Lit render instead.
      Promise.resolve(element.updateComplete).then(()=>element.shadowRoot?.querySelector('rect[x="7.55"][fill]')?.setAttribute('fill',state.color));
    }
  }
  if(part.type==='uno'){element.ledPower=!!state.powered;element.led13=!!state.led13;}
  element.setState?.(state);
}
