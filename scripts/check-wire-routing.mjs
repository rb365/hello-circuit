import assert from 'node:assert/strict';
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {routeWires} from '../src/wire-routing.mjs';
import {definitions} from '../src/components.mjs';
import {bookExamples} from '../src/book.mjs';

let checks=0;
const expect=(value,message)=>{checks++;assert.ok(value,message);};
const v={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const rect=(id,x,y,width,height)=>({id,x,y,width,height});
const pin=(partId,x,y,direction)=>({partId,x,y,direction});
const wire=(id,a,b)=>({id,a,b});
function crosses(a,b,r){
 const left=r.x,right=r.x+r.width,top=r.y,bottom=r.y+r.height;
 if(a.x===b.x)return a.x>left+1e-6&&a.x<right-1e-6&&Math.max(a.y,b.y)>top+1e-6&&Math.min(a.y,b.y)<bottom-1e-6;
 return a.y>top+1e-6&&a.y<bottom-1e-6&&Math.max(a.x,b.x)>left+1e-6&&Math.min(a.x,b.x)<right-1e-6;
}
function verify(connection,route,obstacles,{blocked=false}={}){
 expect(route.blocked===blocked,`${connection.id}: expected blocked=${blocked}`);
 expect(route.points.length>=2,`${connection.id}: has visible points`);
 assert.deepEqual(route.points[0],{x:connection.a.x,y:connection.a.y});assert.deepEqual(route.points.at(-1),{x:connection.b.x,y:connection.b.y});checks+=2;
 for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i];expect(a.x===b.x||a.y===b.y,`${connection.id}: segment is orthogonal`);expect(a.x!==b.x||a.y!==b.y,`${connection.id}: no zero-length segment`);}
 for(const [endpoint,neighbor]of [[connection.a,route.points[1]],[connection.b,route.points.at(-2)]]){const vector=v[endpoint.direction],dx=neighbor.x-endpoint.x,dy=neighbor.y-endpoint.y;expect(dx*vector.x+dy*vector.y>0&&dx*vector.y-dy*vector.x===0,`${connection.id}: pin leg points outward normally`);const own=obstacles.find(r=>r.id===endpoint.partId);if(own){const outside=endpoint.direction==='up'?neighbor.y<own.y:endpoint.direction==='down'?neighbor.y>own.y+own.height:endpoint.direction==='left'?neighbor.x<own.x:neighbor.x>own.x+own.width;expect(outside,`${connection.id}: no turn before leaving inset header's component`);}}
 if(blocked)return;
 for(let i=1;i<route.points.length;i++)for(const obstacle of obstacles){const allowed=i===1&&obstacle.id===connection.a.partId||i===route.points.length-1&&obstacle.id===connection.b.partId;if(!allowed)expect(!crosses(route.points[i-1],route.points[i],obstacle),`${connection.id}: body ${obstacle.id} is avoided`);}
}

// Real Uno dimensions and header inset: the first turn must be beyond its body.
const uno=rect('uno',100,100,274.3*1.2,201.6*1.2),led=rect('led',550,160,52,65);
for(const [name,a]of [['uno-top',pin('uno',250,110.8,'up')],['uno-bottom',pin('uno',350,329.8,'down')]]){const c=wire(name,a,pin('led',580,216,'down'));verify(c,routeWires([c],[uno,led])[0],[uno,led]);}

// A wire between opposite headers on one component must wrap around the body.
const sameBoard=wire('same-board',pin('uno',250,110.8,'up'),pin('uno',350,329.8,'down'));verify(sameBoard,routeWires([sameBoard],[uno])[0],[uno]);
const source=rect('source',100,200,100,100),target=rect('target',650,200,100,100),wall=rect('wall',300,80,260,360);
const around=wire('around-wall',pin('source',195,250,'right'),pin('target',655,250,'left'));verify(around,routeWires([around],[source,target,wall])[0],[source,target,wall]);
const original=routeWires([around],[source,target,wall]);const moved=rect('wall',300,250,260,360);const rerouted=routeWires([around],[source,target,moved]);verify(around,rerouted[0],[source,target,moved]);expect(JSON.stringify(original)!==JSON.stringify(rerouted),'Moving a component changes the visible route');

// Alternating barriers need several turns; the bounded edge search handles them.
const maze=[rect('a',130,0,100,700),rect('b',350,300,100,700),rect('c',570,0,100,700),rect('ceiling',0,300,100,40),rect('floor',0,660,100,40)];
const through=wire('maze',pin(undefined,50,500,'right'),pin(undefined,780,500,'left'));const mazeRoute=routeWires([through],maze,{laneGap:0})[0];verify(through,mazeRoute,maze);expect(mazeRoute.points.length>=7,'Multi-barrier route uses the sparse search for multiple bends');
const bounded=routeWires([through],maze,{maxExpansions:1,tightPassages:false})[0];verify(through,bounded,maze,{blocked:true});expect(bounded.points.length<20,'Exhausted search budget returns a finite fallback');

// Overlapping objects can make a required normal pin escape impossible.
const overlap=rect('overlap',185,210,80,80);const impossible=routeWires([around],[source,target,overlap])[0];verify(around,impossible,[source,target,overlap],{blocked:true});expect(impossible.points.length<20,'Impossible overlap has a bounded visible fallback');
const noIds=[rect(undefined,100,200,100,100),rect(undefined,300,100,100,300)];const inferred=wire('infer',pin(undefined,195,250,'right'),pin(undefined,500,250,'left'));const inference=routeWires([inferred],noIds)[0];expect(!inference.blocked,'Anonymous obstacle ownership is inferred without ignoring other anonymous bodies');expect(inference.points[1].x>200,'Inferred source pin escapes its body');

// Stable IDs make routes deterministic even when input order changes.
const fanout=Array.from({length:6},(_,i)=>wire(`fan-${i}`,pin('uno',250,110.8,'up'),pin(`load-${i}`,530+i*65,330,'down'))),loads=fanout.map((c,i)=>rect('load-'+i,c.b.x-15,280,30,50));
const sorted=routeWires(fanout,[uno,...loads]),reversed=routeWires([...fanout].reverse(),[uno,...loads]);expect(JSON.stringify(sorted)===JSON.stringify(reversed.reverse()),'Stable route IDs are independent of connection input order');expect(new Set(sorted.map(r=>JSON.stringify(r.points))).size===fanout.length,'Fan-out routes have distinct paths');
expect(new Set(sorted.map(r=>r.points[1].y)).size===6,'Six wires sharing one pin use six separate escape channels where space permits');
for(let i=0;i<fanout.length;i++)verify(fanout[i],sorted[i],[uno,...loads]);
const frozenConnections=structuredClone(fanout),frozenBodies=structuredClone([uno,...loads]);routeWires(frozenConnections,frozenBodies);assert.deepEqual(frozenConnections,fanout);assert.deepEqual(frozenBodies,[uno,...loads]);checks+=2;
const straight=wire('straight',pin(undefined,10,10,'right'),pin(undefined,100,10,'left')),straightRoute=routeWires([straight],[])[0];verify(straight,straightRoute,[]);expect(straightRoute.points.length===4,'Straight routes retain both explicit escape vertices');
assert.deepEqual(straightRoute.points[1],{x:24,y:10});assert.deepEqual(straightRoute.points.at(-2),{x:86,y:10});checks+=2;
assert.deepEqual(routeWires([],[]),[]);checks++;

// World translations must not change a route's shape or invent a canvas edge.
function translatedInput(connections,obstacles,dx,dy){return {connections:connections.map(w=>({...w,a:{...w.a,x:w.a.x+dx,y:w.a.y+dy},b:{...w.b,x:w.b.x+dx,y:w.b.y+dy}})),obstacles:obstacles.map(r=>({...r,x:r.x+dx,y:r.y+dy}))};}
function verifyTranslation(connections,obstacles,dx,dy,label,options={}){
 const reference=routeWires(connections,obstacles,options),input=translatedInput(connections,obstacles,dx,dy),movedOptions=options.bounds?{...options,bounds:{...options.bounds,x:(options.bounds.x??0)+dx,y:(options.bounds.y??0)+dy}}:options,routes=routeWires(input.connections,input.obstacles,movedOptions);
 for(let i=0;i<routes.length;i++){
  expect(routes[i].blocked===reference[i].blocked,`${label}: translation preserves blocked state`);
  expect(routes[i].points.length===reference[i].points.length,`${label}: translation preserves bends and escape vertices`);
  for(let j=0;j<reference[i].points.length;j++){const a=reference[i].points[j],b=routes[i].points[j];expect(Math.abs(a.x-(b.x-dx))<1e-6&&Math.abs(a.y-(b.y-dy))<1e-6,`${label} wire ${connections[i].id}, offset ${dx}/${dy}, point ${j}: ${JSON.stringify(a)} versus ${JSON.stringify({x:b.x-dx,y:b.y-dy})}`);}
  verify(input.connections[i],routes[i],input.obstacles,{blocked:reference[i].blocked});
 }
 return routes.length;
}
for(const [dx,dy]of [[-5000,-4000],[1000000,-1000000]]){
 verifyTranslation([sameBoard],[uno],dx,dy,'Translated inset Uno headers');
 verifyTranslation([around],[source,target,wall],dx,dy,'Translated obstacle detour');
 verifyTranslation([through],maze,dx,dy,'Translated sparse-search maze',{laneGap:0});
 verifyTranslation(fanout,[uno,...loads],dx,dy,'Translated fan-out');
 verifyTranslation([straight],[],dx,dy,'Translated endpoints without bodies');
 verifyTranslation([around],[source,target,wall],dx,dy,'Explicit reference bounds',{bounds:{x:-100,y:-100,width:1600,height:1000}});
}

// Use installed official pin metadata, without executing browser/custom elements.
const modules={uno:'arduino-uno',led:'led',rgb:'rgb-led',resistor:'resistor',button:'pushbutton',pot:'potentiometer',servo:'servo',piezo:'buzzer',switch:'slide-switch',lcd:'lcd1602','grove-lcd':'lcd1602'};
function componentPins(type){
 if(definitions[type].pins)return definitions[type].pins;
 let source=fs.readFileSync(new URL(`../node_modules/@wokwi/elements/dist/cjs/${modules[type]}-element.js`,import.meta.url),'utf8');
 if(type==='lcd'||type==='grove-lcd')source=source.split(type==='lcd'?"case 'full':":"case 'i2c':")[1].split('];')[0];else source=source.split('this.pinInfo = [')[1]?.split('];')[0]??source.split('get pinInfo()')[1]?.split('return [')[1]?.split('];')[0];
 return [...source.matchAll(/\{ name: '([^']+)', x: ([\w.]+), y(?:: ([\w.]+))?/g)].map(([,name,x,y])=>({name,x:x==='anodeX'?25:x==='cathodeX'?15:Number(x),y:y?Number(y):87.5+2*5.75*3.78}));
}
const catalog=Object.fromEntries(Object.keys(definitions).map(type=>[type,componentPins(type)]));
function sceneInput(scene){
 const bodies=scene.parts.map(part=>{const spec=definitions[part.type];return rect(part.id,part.x,part.y+35,spec.width*spec.scale,spec.height*spec.scale);});
 function end(key){const index=key.indexOf(':'),part=scene.parts.find(p=>p.id===key.slice(0,index)),spec=definitions[part.type],p=catalog[part.type].find(pin=>pin.name===key.slice(index+1));assert.ok(p,key);const sides=[['left',p.x],['right',spec.width-p.x],['up',p.y],['down',spec.height-p.y]].sort((a,b)=>a[1]-b[1]);return pin(part.id,part.x+p.x*spec.scale,part.y+35+p.y*spec.scale,sides[0][0]);}
 return {obstacles:bodies,connections:scene.wires.map((w,i)=>wire(String(i),end(w.a),end(w.b)))};
}
const prepared=bookExamples.filter(e=>e.scene),sceneResults=[];let wireCount=0,translatedWires=0,maxMs=0;const began=performance.now();
for(const example of prepared){const input=sceneInput(example.scene),t=performance.now(),routes=routeWires(input.connections,input.obstacles),ms=performance.now()-t;maxMs=Math.max(maxMs,ms);wireCount+=routes.length;sceneResults.push({path:example.sourcePath,wires:routes.length,blocked:routes.filter(r=>r.blocked).length,ms});for(let i=0;i<routes.length;i++)verify(input.connections[i],routes[i],input.obstacles,{blocked:routes[i].blocked});}
const elapsed=performance.now()-began;
if(sceneResults.some(s=>s.blocked))console.log('Blocked scene diagnostic:',JSON.stringify(sceneResults.filter(s=>s.blocked)));
expect(sceneResults.every(s=>s.blocked===0),'All prepared scenes have body-avoiding routes');
expect(maxMs<150,'Largest prepared scene routes within 150 ms on the local test machine');
for(const example of prepared){const input=sceneInput(example.scene);for(const [dx,dy]of [[-5000,-4000],[1000000,-1000000]])translatedWires+=verifyTranslation(input.connections,input.obstacles,dx,dy,example.sourcePath);}
// Deliberate upper limit: 60 bodies and 250 connections, not a per-pixel grid.
const stressBodies=Array.from({length:60},(_,i)=>rect('p'+i,40+(i%10)*150,40+Math.floor(i/10)*150,55,55));
const stress=Array.from({length:250},(_,i)=>{const a=stressBodies[i%60],b=stressBodies[(i*7+11)%60];return wire(i,pin(a.id,a.x+30,a.y+3,'up'),pin(b.id,b.x+30,b.y+52,'down'));});
const stressStart=performance.now(),stressRoutes=routeWires(stress,stressBodies),stressMs=performance.now()-stressStart;
expect(stressRoutes.length===250,'Maximum-size redraw retains every connection');expect(stressRoutes.every(r=>r.points.length&&r.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))),'Stress routes remain finite');expect(stressMs<1500,'Maximum-size redraw is bounded under 1.5 seconds on the local test machine');
expect(stressRoutes.every(r=>!r.blocked),'Maximum-size separated layout has no blocked wires');
for(let i=0;i<stress.length;i++)verify(stress[i],stressRoutes[i],stressBodies);
console.log(JSON.stringify({checks,preparedScenes:prepared.length,preparedWires:wireCount,translatedWires,blocked:sceneResults.filter(s=>s.blocked),elapsedMs:Math.round(elapsed),slowestSceneMs:Math.round(maxMs),stressMs:Math.round(stressMs)},null,2));
