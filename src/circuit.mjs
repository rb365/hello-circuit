// Original signal-level circuit analysis. Wires form ideal nets; resistors
// remain finite conductances so the book's dividers and pull-downs work.
import {definitions} from './components.mjs';
const limit=(value,min,max)=>{const n=Number(value);return Math.max(min,Math.min(max,Number.isFinite(n)?n:min));};
const number=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
const analogIndex=name=>/^A[0-5](?:\.2)?$/.test(name)?Number(name[1]):null;
const digitalIndex=name=>/^\d+$/.test(name)?Number(name):analogIndex(name)!==null?14+analogIndex(name):null;
const key=(part,pin)=>part.id+':'+pin;
export function photoresistance(lux){
  // A representative CdS response, not calibration for a particular sensor.
  return limit(50000*Math.pow(10/Math.max(.01,number(lux,500)),.7),100,10000000);
}
export function tmp36Voltage(celsius){return .5+.01*limit(number(celsius,25),-40,125);}

function solve(nodes,edges,fixed,currents=[]){
  const relevant=new Set([...edges,...currents].flatMap(edge=>[edge.a,edge.b]));
  const unknown=[...nodes].filter(n=>!fixed.has(n)&&relevant.has(n));const index=new Map(unknown.map((n,i)=>[n,i]));const count=unknown.length;
  if(!count)return new Map(fixed);
  const matrix=Array.from({length:count},()=>new Float64Array(count+1));
  // A tiny leakage anchors otherwise floating islands without claiming a
  // physically meaningful floating voltage. UI diagnostics identify them.
  for(let i=0;i<count;i++)matrix[i][i]=1e-10;
  for(const {a,b,resistance,drop=0}of edges){
    if(a===b)continue;const g=1/Math.max(.01,resistance);
    for(const [own,other,direction]of [[a,b,1],[b,a,-1]]){
      const i=index.get(own);if(i===undefined)continue;matrix[i][i]+=g;
      if(index.has(other))matrix[i][index.get(other)]-=g;else matrix[i][count]+=g*(fixed.get(other)??0);
      matrix[i][count]+=g*drop*direction;
    }
  }
  for(const {a,b,current}of currents)for(const [node,direction]of [[a,-1],[b,1]]){const i=index.get(node);if(i!==undefined)matrix[i][count]+=direction*current;}
  for(let col=0;col<count;col++){
    let pivot=col;for(let row=col+1;row<count;row++)if(Math.abs(matrix[row][col])>Math.abs(matrix[pivot][col]))pivot=row;
    [matrix[col],matrix[pivot]]=[matrix[pivot],matrix[col]];
    const divisor=matrix[col][col];if(Math.abs(divisor)<1e-20)continue;
    for(let j=col;j<=count;j++)matrix[col][j]/=divisor;
    for(let row=0;row<count;row++)if(row!==col){const factor=matrix[row][col];if(!factor)continue;for(let j=col;j<=count;j++)matrix[row][j]-=factor*matrix[col][j];}
  }
  const volts=new Map(fixed);unknown.forEach((node,i)=>volts.set(node,matrix[i][count]));return volts;
}

export function analyzeCircuit(parts,wires,snapshot={}){
  snapshot=snapshot??{};const parent=new Map();const warnings=[];
  const find=name=>{if(!parent.has(name))parent.set(name,name);let at=name;while(parent.get(at)!==at)at=parent.get(at);const root=at;at=name;while(parent.get(at)!==at){const next=parent.get(at);parent.set(at,root);at=next;}return root;};
  const join=(a,b)=>{parent.set(find(a),find(b));};
  const pinsFor=part=>part.pins??definitions[part.type]?.pins??[];
  const board=parts.find(p=>definitions[p.type]?.isBoard);const boardSpec=definitions[board?.type]??{};const virtual=!!boardSpec.virtual;
  const logicVoltage=boardSpec.logicVoltage??5;const adcResolution=snapshot.resolution?.ADC??boardSpec.adcResolution??1023;
  const pinMap={...boardSpec.pinMap,...snapshot.pinMap};
  const indexFor=name=>virtual?(Number.isInteger(pinMap[name])?pinMap[name]:null):digitalIndex(name);
  const ioPins=snapshot.ioPins??snapshot.pins??[];
  const modes=snapshot.modes??snapshot.pinModes??{};
  const modeFor=index=>index===null?undefined:modes[index]??ioPins[index]?.mode??(virtual&&boardSpec.ledPins?.includes(ioPins[index]?.label??boardSpec.nativeLabels?.[index])?1:undefined);
  const digitalFor=index=>snapshot.digital?.[index]??(modeFor(index)===1?ioPins[index]?.value:0)??0;
  const pwmFor=index=>limit(snapshot.pwm?.[index]??(modeFor(index)===3?number(ioPins[index]?.value,0)/255:0),0,1);
  const servoFor=index=>snapshot.servo?.[index]??(modeFor(index)===4?ioPins[index]?.value:90)??90;
  for(const part of parts)for(const pin of pinsFor(part))find(key(part,pin.name));
  for(const wire of wires)join(wire.a,wire.b);
  for(const part of parts){
    if(part.type==='button'){
      join(key(part,'1.l'),key(part,'1.r'));join(key(part,'2.l'),key(part,'2.r'));
      if(part.value)join(key(part,'1.l'),key(part,'2.l'));
    }
    if(part.type==='switch')join(key(part,'2'),key(part,part.value?'3':'1'));
    if(definitions[part.type]?.isBoard){
      for(const p of pinsFor(part))if(p.name.startsWith('GND'))join(key(part,p.name),key(part,'GROUND'));
      for(const name of definitions[part.type].groundPins??[])join(key(part,name),key(part,'GROUND'));
      if(part.type==='uno'){join(key(part,'A4'),key(part,'A4.2'));join(key(part,'A5'),key(part,'A5.2'));}
      if(part===board){const aliases=new Map();for(const p of pinsFor(part)){const index=indexFor(p.name);if(index===null)continue;if(aliases.has(index))join(key(part,p.name),aliases.get(index));else aliases.set(index,key(part,p.name));}}
    }
    if(part.type==='hbridge')for(const name of ['GND.1','GND.2','GND.3','GND.4'])join(key(part,name),key(part,'GND'));
    if(part.type==='breadboard'){
      for(let col=1;col<=15;col++){
        for(const row of ['b','c','d','e'])join(key(part,'a'+col),key(part,row+col));
        for(const row of ['g','h','i','j'])join(key(part,'f'+col),key(part,row+col));
        join(key(part,'+1'),key(part,'+'+col));join(key(part,'-1'),key(part,'-'+col));
      }
    }
  }
  const nodes=new Set([...parent.keys()].map(find));const fixed=new Map();const edges=[];
  const source=(endpoint,voltage)=>{const node=find(endpoint);nodes.add(node);if(fixed.has(node)&&Math.abs(fixed.get(node)-voltage)>.15){warnings.push('Power sources or output pins are connected together.');return;}fixed.set(node,voltage);};
  const resistance=(a,b,ohms)=>{const an=find(a),bn=find(b);nodes.add(an);nodes.add(bn);edges.push({a:an,b:bn,resistance:Math.max(.01,number(ohms,330))});};
  if(board){
    source(key(board,'GROUND'),0);source(key(board,'5V'),5);source(key(board,'3.3V'),3.3);
    for(const [name,voltage]of Object.entries(boardSpec.powerPins??{}))source(key(board,name),voltage);
    for(const p of pinsFor(board)){
      if(Object.hasOwn(boardSpec.powerPins??{},p.name)||(boardSpec.groundPins??[]).includes(p.name))continue;
      const index=indexFor(p.name);if(index===null)continue;const mode=modeFor(index);
      if(mode===1)source(key(board,p.name),digitalFor(index)?logicVoltage:0);
      else if(mode===3)source(key(board,p.name),logicVoltage*pwmFor(index));
      else if(mode===11){const pull=key(board,'pullup-'+index);source(pull,logicVoltage);resistance(key(board,p.name),pull,30000);}
    }
    if((board.type==='pico'||board.type==='puck')&&board.value)source(key(board,'BTN'),logicVoltage);
  }
  for(const part of parts){
    if(part.type==='battery'){source(key(part,'-'),0);source(key(part,'+'),limit(part.value??9,0,12));}
    if(part.type==='resistor')resistance(key(part,'1'),key(part,'2'),part.value??330);
    if(part.type==='photoresistor')resistance(key(part,'1'),key(part,'2'),photoresistance(part.value));
    if(part.type==='motor')resistance(key(part,'+'),key(part,'-'),Math.max(1,number(part.settings?.resistance,22)));
    if(part.type==='pot'){
      const total=Math.max(10,number(part.settings?.resistance,10000));const position=limit((part.value??512)/1023,0,1);
      resistance(key(part,'VCC'),key(part,'SIG'),Math.max(.01,total*(1-position)));resistance(key(part,'SIG'),key(part,'GND'),Math.max(.01,total*position));
    }
  }
  let volts=solve(nodes,edges,fixed);const voltage=endpoint=>volts.get(find(endpoint))??0;
  // Active devices are driven by the voltages at their wired terminals.
  for(const part of parts){
    if(part.type==='tmp36'&&voltage(key(part,'VCC'))-voltage(key(part,'GND'))>=2.7)source(key(part,'OUT'),voltage(key(part,'GND'))+tmp36Voltage(part.value));
    if(part.type==='gesture'&&voltage(key(part,'VCC'))-voltage(key(part,'GND'))>=2.7)source(key(part,'INT'),snapshot.components?.[part.id]?.interruptLevel===0?voltage(key(part,'GND')):voltage(key(part,'VCC')));
    if(part.type==='mosfet'){
      const driven=board?pinsFor(board).find(p=>modeFor(indexFor(p.name))===3&&find(key(board,p.name))===find(key(part,'G'))):null;
      if(driven){
        const duty=pwmFor(indexFor(driven.name));
        const sourceVolts=voltage(key(part,'S'));const drainVolts=voltage(key(part,'D'));
        // An idealized switching MOSFET averages the powered load's voltage;
        // using average gate voltage would introduce a false PWM dead band.
        source(key(part,'D'),sourceVolts+(drainVolts-sourceVolts)*(1-duty));
      }else if(voltage(key(part,'G'))-voltage(key(part,'S'))>=2.5)resistance(key(part,'D'),key(part,'S'),.1);
    }
    if(part.type==='hbridge'&&voltage(key(part,'VCC1'))-voltage(key(part,'GND'))>=2.7){
      const supply=voltage(key(part,'VCC2'));const base=voltage(key(part,'GND'));
      for(const [enable,input,output]of [['1EN','1A','1Y'],['1EN','2A','2Y'],['2EN','3A','3Y'],['2EN','4A','4Y']]){
        const enabled=limit((voltage(key(part,enable))-base)/logicVoltage,0,1);
        if(enabled>.001)source(key(part,output),base+(supply-base)*limit((voltage(key(part,input))-base)/logicVoltage,0,1)*enabled);
      }
    }
    if(part.type==='shift-register'){
      const output=snapshot.components?.[part.id]?.outputs??[];
      if(voltage(key(part,'VCC'))-voltage(key(part,'GND'))>=2.7)for(let i=0;i<8;i++)if(output[i]!==undefined)source(key(part,'Q'+'ABCDEFGH'[i]),output[i]?voltage(key(part,'VCC')):0);
    }
  }
  volts=solve(nodes,edges,fixed);
  // LEDs/diodes are idealized fixed drops plus finite series resistance.
  // Iteration chooses conducting junctions from the most recent DC solution.
  const diodeParts=[];
  for(const part of parts){
    if(part.type==='led'||part.type==='diode')diodeParts.push({part,a:key(part,'A'),b:key(part,'C'),drop:part.type==='led'?1.8:.7});
    if(part.type==='rgb')for(const name of ['R','G','B'])diodeParts.push({part,a:key(part,name),b:key(part,'COM'),drop:name==='R'?1.8:2.5,channel:name});
    if(part.type==='optocoupler')diodeParts.push({part,a:key(part,'A'),b:key(part,'K'),drop:1.2});
  }
  for(const diode of diodeParts){nodes.add(find(diode.a));nodes.add(find(diode.b));}
  let active=[];
  for(let iteration=0;iteration<8;iteration++){
    const next=diodeParts.filter(d=>voltage(d.a)-voltage(d.b)>d.drop+.0001);
    // Include a junction already conducting when close to its knee to avoid
    // oscillation between an unloaded net and its forward-drop voltage.
    for(const d of active)if(!next.includes(d)&&voltage(d.a)-voltage(d.b)>=d.drop-.005)next.push(d);
    active=next;const branches=active.map(d=>({a:find(d.a),b:find(d.b),resistance:10,drop:d.drop}));
    volts=solve(nodes,[...edges,...branches],fixed);
  }
  const opticalParts=parts.filter(part=>part.type==='optocoupler');let opticalClamps=[];let opticalCurrents=[];
  const opticalForward=new Map(opticalParts.map(part=>[part,voltage(key(part,'C'))>=voltage(key(part,'E'))-.001]));
  const inputCurrent=part=>Math.max(0,(voltage(key(part,'A'))-voltage(key(part,'K'))-1.2)/10);
  // A selected DC phototransistor model: collector current is limited by
  // the LED current times CTR, with a 0.2 V saturation approximation. Its
  // input/output nets stay electrically separate; B and NC are not modeled.
  if(opticalParts.length)for(let iteration=0;iteration<8;iteration++){
    opticalCurrents=opticalParts.map(part=>({part,a:find(key(part,'C')),b:find(key(part,'E')),current:opticalForward.get(part)?inputCurrent(part)*limit(number(part.settings?.currentTransferRatio,.2),.01,2):0}));
    const previousClamps=opticalClamps;opticalClamps=opticalCurrents.filter(({part,current})=>current>1e-10&&(voltage(key(part,'C'))-voltage(key(part,'E'))<.2||previousClamps.some(clamp=>clamp.part===part)&&voltage(key(part,'C'))-voltage(key(part,'E'))<=.205)).map(({part,a,b})=>({part,a,b,resistance:.1,drop:.2}));
    const next=diodeParts.filter(d=>voltage(d.a)-voltage(d.b)>d.drop+.0001);for(const d of active)if(!next.includes(d)&&voltage(d.a)-voltage(d.b)>=d.drop-.005)next.push(d);active=next;
    volts=solve(nodes,[...edges,...active.map(d=>({a:find(d.a),b:find(d.b),resistance:10,drop:d.drop})),...opticalClamps],fixed,opticalCurrents);
  }
  const connected=(a,b)=>find(a)===find(b);
  const boardPins=endpoint=>board?pinsFor(board).filter(p=>connected(endpoint,key(board,p.name))).map(p=>p.name):[];
  const zeroNets=new Set([...fixed].filter(([,v])=>v===0).map(([n])=>n));
  const ground=endpoint=>zeroNets.has(find(endpoint));
  const power=endpoint=>voltage(endpoint)>=2.7;
  const digitalInputs={};const analogInputs={};
  if(virtual&&board){
    for(const p of pinsFor(board)){
      const index=indexFor(p.name);if(index===null||boardSpec.reservedPins?.includes(index))continue;const mode=modeFor(index);
      if(mode===undefined||mode===0||mode===11)digitalInputs[index]=voltage(key(board,p.name))>=logicVoltage/2?1:0;
      if(mode===2&&boardSpec.analogPins?.includes(index))analogInputs[index]=Math.round(limit(voltage(key(board,p.name))/logicVoltage*adcResolution,0,adcResolution));
    }
  }else{
    for(let i=0;i<20;i++){
      const name=i<14?String(i):'A'+(i-14);const level=board?voltage(key(board,name)):0;
      digitalInputs[i]=level>=2.5?1:0;
    }
    for(let i=0;i<6;i++)analogInputs['A'+i]=Math.round(limit(board?voltage(key(board,'A'+i))/5*1023:0,0,1023));
  }
  const pinNumber=endpoint=>{for(const name of boardPins(endpoint)){const index=indexFor(name);if(index!==null)return index;}return null;};
  const passiveNeighbors=new Map();
  for(const edge of edges)for(const [own,other]of [[edge.a,edge.b],[edge.b,edge.a]]){
    if(!passiveNeighbors.has(own))passiveNeighbors.set(own,[]);passiveNeighbors.get(own).push({node:other,ohms:edge.resistance});
  }
  const pwmDrive=endpoint=>{
    if(!board)return null;const distances=new Map([[find(endpoint),0]]);const pending=[find(endpoint)];
    while(pending.length){const current=pending.shift();for(const neighbor of passiveNeighbors.get(current)??[]){const cost=distances.get(current)+neighbor.ohms;if(cost<(distances.get(neighbor.node)??Infinity)){distances.set(neighbor.node,cost);pending.push(neighbor.node);}}}
    for(const p of pinsFor(board)){const index=indexFor(p.name);if(index!==null&&modeFor(index)===3&&distances.has(find(key(board,p.name))))return {duty:pwmFor(index),ohms:distances.get(find(key(board,p.name)))};}
    return null;
  };
  const components={};const peripherals=[];
  const running=snapshot.running!==false&&Object.keys(snapshot).length>0;
  for(const part of parts){
    const state={powered:true,...snapshot.components?.[part.id]};
    if(definitions[part.type]?.isBoard){state.powered=running;state.led13=running&&!!digitalFor(13);state.leds=Object.fromEntries((definitions[part.type].ledPins??[]).map(name=>[name,running&&!!digitalFor(indexFor(name))]));}
    if(part.type==='led'||part.type==='rgb'){
      const current=(a,b,drop)=>{
        const drive=pwmDrive(key(part,a));
        // The DC voltage solver uses PWM's average voltage for inputs. A
        // forward LED instead conducts during each HIGH interval; displaying
        // average voltage would incorrectly extinguish low duty cycles.
        if(drive&&ground(key(part,b)))return Math.max(0,(logicVoltage-drop)/(drive.ohms+10))*drive.duty;
        return Math.max(0,(voltage(key(part,a))-voltage(key(part,b))-drop)/10);
      };
      const light=amps=>amps<.00001?0:limit(amps/.015,0,1);
      if(part.type==='led'){state.current=current('A','C',1.8);state.brightness=light(state.current);}
      else{state.red=light(current('R','COM',1.8));state.green=light(current('G','COM',2.5));state.blue=light(current('B','COM',2.5));}
      if(part.type==='led'&&state.current>.02)warnings.push(`LED ${part.id} exceeds 20 mA in this model. Add or increase its series resistor.`);
      if(part.type==='rgb'&&['R','G','B'].some(channel=>current(channel,'COM',channel==='R'?1.8:2.5)>.02))warnings.push(`RGB LED ${part.id} exceeds 20 mA on a channel in this model. Use a series resistor for each channel.`);
    }
    if(part.type==='servo'){state.powered=power(key(part,'V+'))&&ground(key(part,'GND'));state.angle=state.powered?servoFor(pinNumber(key(part,'PWM'))):90;}
    if(part.type==='piezo'){const pins=boardPins(key(part,'2'));const pin=pins.map(indexFor).find(n=>n!==null);state.frequency=ground(key(part,'1'))&&running?(snapshot.tones?.[pin]?.frequency??snapshot.tones?.[pin]??0):0;}
    if(part.type==='motor'){const difference=voltage(key(part,'+'))-voltage(key(part,'-'));state.speed=Math.abs(difference)<.001?0:limit(Math.abs(difference)/Math.max(1,number(part.settings?.voltage,9)),0,1);state.direction=difference<0?-1:1;}
    if(part.type==='hbridge')state.powered=power(key(part,'VCC1'))&&power(key(part,'VCC2'))&&ground(key(part,'GND'));
    if(part.type==='tmp36')state.powered=power(key(part,'VCC'))&&ground(key(part,'GND'));
    if(part.type==='resistor'){state.voltage=voltage(key(part,'1'))-voltage(key(part,'2'));state.current=state.voltage/Math.max(.01,number(part.value,330));state.watts=Math.abs(state.voltage*state.current);const rating=Math.max(.01,number(part.settings?.maxPower,.25));if(state.watts>rating)warnings.push(`Resistor ${part.id} dissipates ${state.watts.toFixed(2)} W in this model, above its ${rating} W rating.`);}
    if(part.type==='optocoupler'){
      state.inputCurrent=inputCurrent(part);state.active=state.inputCurrent>.00001;
      state.outputPolarity=opticalForward.get(part)?'forward':'reverse';
      const transistor=opticalCurrents.find(entry=>entry.part===part);const clamp=opticalClamps.some(entry=>entry.part===part);
      state.outputCurrent=Math.max(0,(transistor?.current??0)+(clamp?(voltage(key(part,'C'))-voltage(key(part,'E'))-.2)/.1:0));
      if(state.inputCurrent>.02)warnings.push(`Optocoupler ${part.id} input exceeds 20 mA in this model. Add or increase its series resistor.`);
      if(wires.some(wire=>wire.a===key(part,'B')||wire.b===key(part,'B')))warnings.push(`Optocoupler ${part.id} base-pin behavior is outside this DC model.`);
    }
    if(part.type==='lcd'){
      state.powered=power(key(part,'VDD'))&&ground(key(part,'VSS'));
      state.backlight=power(key(part,'A'))&&ground(key(part,'K'));
      peripherals.push({id:part.id,type:'lcd',powered:state.powered,pins:Object.fromEntries(['RS','E','D4','D5','D6','D7'].map(role=>[role,pinNumber(key(part,role))]))});
    }
    if(['grove-lcd','compass','weather','accelerometer','gesture'].includes(part.type)){
      state.powered=power(key(part,'VCC'))&&ground(key(part,'GND'));
      const busPins={SDA:pinNumber(key(part,'SDA')),SCL:pinNumber(key(part,'SCL'))};
      if(part.type==='gesture')busPins.INT=pinNumber(key(part,'INT'));
      peripherals.push({id:part.id,type:part.type,powered:state.powered&&(boardSpec.i2cPairs??[]).some(pair=>pair.SDA===busPins.SDA&&pair.SCL===busPins.SCL),pins:busPins});
      if(part.type==='compass')state.summary=Math.round(part.value??0)+'°';
      if(part.type==='weather')state.summary=(part.settings?.temperature??25)+' °C';
      if(part.type==='accelerometer')state.summary='X '+(part.settings?.x??0)+'g';
    }
    if(part.type==='gps'){
      state.powered=power(key(part,'VCC'))&&ground(key(part,'GND'));
      peripherals.push({id:part.id,type:'gps',powered:state.powered,pins:{TX:pinNumber(key(part,'TX')),RX:pinNumber(key(part,'RX'))}});
    }
    if(part.type==='nokia-lcd'){
      const roles=['SCLK','DIN','DC','CE','RST'];const displayPins=Object.fromEntries(roles.map(role=>[role,pinNumber(key(part,role))]));
      state.powered=power(key(part,'VCC'))&&ground(key(part,'GND'));
      peripherals.push({id:part.id,type:'nokia-lcd',powered:state.powered&&board?.type==='pico'&&roles.every((role,i)=>displayPins[role]===[19,21,29,30,31][i]),pins:displayPins});
    }
    if(part.type==='shift-register'){
      state.powered=power(key(part,'VCC'))&&ground(key(part,'GND'));
      peripherals.push({id:part.id,type:'shift-register',powered:state.powered,pins:Object.fromEntries(['DS','SHCP','STCP','MR','OE'].map(role=>[role,pinNumber(key(part,role))])),levels:{MR:voltage(key(part,'MR'))>=logicVoltage/2,OE:voltage(key(part,'OE'))>=logicVoltage/2}});
    }
    components[part.id]=state;
  }
  return {board,connected,boardPins,ground,power,voltage,digitalInputs,analogInputs,components,peripherals,warnings:[...new Set(warnings)]};
}
