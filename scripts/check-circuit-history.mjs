import assert from 'node:assert/strict';
import {applyHistoryState} from '../src/circuit-history.mjs';

const board = {id:'board',type:'uno',x:10,y:20};
const resistor = {id:'r',type:'resistor',x:100,y:200,value:330,settings:{label:'load',environment:{temperature:20,humidity:50}}};
const led = {id:'led',type:'led',x:300,y:200};
const pot = {id:'pot',type:'pot',x:400,y:200,value:512};
const wire = {a:'board:13',b:'r:1',color:'#194ced'};
const attached = {a:'r:2',b:'led:A',color:'#18a57b'};
const extra = {a:'board:5V',b:'pot:VCC',color:'#ed6f48'};
const clone = value => JSON.parse(JSON.stringify(value));
const state = (parts,wires=[]) => ({parts:clone(parts),wires:clone(wires)});
let checks = 0;
function check(name, run) {run();checks++;console.log('✓ '+name);}
const find = (value,id) => value.parts.find(part=>part.id===id);

check('Undo connection preserves a resistor value changed after the connection',()=>{
  const before=state([board,resistor]),after=state([board,resistor],[wire]),current=clone(after);
  find(current,'r').value=1000;
  assert.deepEqual(applyHistoryState(current,after,before),state([board,{...resistor,value:1000}]));
});
check('Undo movement restores coordinates without rewinding inputs or nested settings; Redo keeps them',()=>{
  const before=state([board,resistor,pot],[wire]),after=clone(before);find(after,'r').x=150;find(after,'r').y=220;
  const current=clone(after);find(current,'r').value=1000;find(current,'r').settings.environment.humidity=90;find(current,'pot').value=789;
  const undone=applyHistoryState(current,after,before),expected=clone(current);find(expected,'r').x=100;find(expected,'r').y=200;
  assert.deepEqual(undone,expected);assert.deepEqual(applyHistoryState(undone,before,after),current);
});
check('Undo one nested setting edit preserves other current settings and inputs',()=>{
  const before=state([board,resistor,pot]),after=clone(before);find(after,'r').settings.environment.temperature=30;
  const current=clone(after);find(current,'r').settings.environment.humidity=80;find(current,'r').settings.nickname='hot sensor';find(current,'pot').value=900;
  const actual=applyHistoryState(current,after,before),expected=clone(current);find(expected,'r').settings.environment.temperature=20;
  assert.deepEqual(actual,expected);
});
check('Undo setting key addition removes only that key',()=>{
  const before=state([board,resistor]),after=clone(before);find(after,'r').settings.note='new';
  const current=clone(after);find(current,'r').settings.other='keep';
  const result=applyHistoryState(current,after,before);assert.equal(find(result,'r').settings.note,undefined);assert.equal(find(result,'r').settings.other,'keep');
});
check('Undo part addition removes it and current wires attached to it',()=>{
  const before=state([board,resistor,pot],[wire,extra]),after=state([board,resistor,pot,led],[wire,extra]);
  const current=clone(after);current.wires.push(attached);find(current,'r').value=470;
  assert.deepEqual(applyHistoryState(current,after,before),state([board,{...resistor,value:470},pot],[wire,extra]));
});
check('Undo removal restores the part, its original position in order and its attached wire',()=>{
  const before=state([board,resistor,led,pot],[wire,attached,extra]),after=state([board,resistor,pot],[wire,extra]);
  const current=clone(after);find(current,'pot').value=800;
  assert.deepEqual(applyHistoryState(current,after,before),state([board,resistor,led,{...pot,value:800}],[wire,attached,extra]));
});
check('Connection delta preserves an unrelated newer connection',()=>{
  const before=state([board,resistor,pot]),after=state([board,resistor,pot],[wire]),current=state([board,resistor,pot],[wire,extra]);
  assert.deepEqual(applyHistoryState(current,after,before),state([board,resistor,pot],[extra]));
});
check('An unchanged wire list preserves current colors and additional wires',()=>{
  const before=state([board,resistor,pot],[wire]),after=clone(before);find(after,'r').x=120;
  const current=clone(after);current.wires[0].color='#ae78dc';current.wires.push(extra);
  const result=applyHistoryState(current,after,before);assert.deepEqual(result.wires,current.wires);
});
check('Unchanged connection history preserves current wire order and imported duplicate wires',()=>{
  const before=state([board,resistor],[wire]),after=clone(before);find(after,'r').x=120;
  const current=state(after.parts,[{...wire,color:'#526477'},wire]);
  assert.deepEqual(applyHistoryState(current,after,before).wires,current.wires);
});
check('Undo and Redo wire color change affect that connection only',()=>{
  const before=state([board,resistor,pot],[wire,extra]),after=clone(before);after.wires[0].color='#18a57b';
  const current=clone(after);current.wires[1].color='#526477';
  const undone=applyHistoryState(current,after,before);assert.equal(undone.wires[0].color,wire.color);assert.equal(undone.wires[1].color,'#526477');
  assert.deepEqual(applyHistoryState(undone,before,after),current);
});
check('Adding a connection already present in reverse direction creates no duplicate',()=>{
  const before=state([board,resistor]),after=state([board,resistor],[wire]);
  const current=state([board,resistor],[{a:wire.b,b:wire.a,color:'#526477'}]);
  const result=applyHistoryState(current,before,after);assert.deepEqual(result,current);assert.deepEqual(applyHistoryState(result,before,after),result);
});
check('Unrelated current parts survive an edit to known parts',()=>{
  const before=state([board,resistor]),after=clone(before);find(after,'r').x=150;
  const current=state([board,{...resistor,x:150},led]);
  assert.deepEqual(applyHistoryState(current,after,before),state([board,resistor,led]));
});
check('Reordering changes known part order while preserving an unrelated part slot',()=>{
  const before=state([board,resistor]),after=state([resistor,board]),current=state([board,led,resistor]);
  assert.deepEqual(applyHistoryState(current,before,after),state([resistor,led,board]));
});
check('Reordering connections preserves an unrelated connection slot',()=>{
  const before=state([board,resistor,led,pot],[wire,attached]),after=state([board,resistor,led,pot],[attached,wire]),current=state([board,resistor,led,pot],[wire,extra,attached]);
  assert.deepEqual(applyHistoryState(current,before,after).wires,[attached,extra,wire]);
});
check('A field-only edit does not resurrect a part or connection removed independently',()=>{
  const before=state([board,resistor],[wire]),after=clone(before);find(after,'r').value=470;after.wires[0].color='#18a57b';
  assert.deepEqual(applyHistoryState(state([board]),after,before),state([board]));
});
check('Inputs and returned nested values do not share mutable objects',()=>{
  const before=state([board,resistor]),after=clone(before);find(after,'r').x=150;const current=clone(after),saved=clone({current,before,after});
  const result=applyHistoryState(current,after,before);find(result,'r').settings.environment.humidity=99;
  assert.deepEqual({current,before,after},saved);
});
check('Object property order alone does not count as a setting change',()=>{
  const before=state([board,resistor]),after=clone(before);find(after,'r').settings={environment:{humidity:50,temperature:20},label:'load'};
  const current=clone(after);find(current,'r').settings.environment.humidity=95;
  assert.deepEqual(applyHistoryState(current,after,before),current);
});
check('Imported prototype-like keys remain own data properties',()=>{
  const before=state([board,resistor]),after=clone(before);find(after,'r').settings=JSON.parse('{"__proto__":{"flag":true},"label":"load"}');
  const result=applyHistoryState(before,before,after),settings=find(result,'r').settings;
  assert.equal(Object.getPrototypeOf(settings),Object.prototype);assert.equal(Object.hasOwn(settings,'__proto__'),true);assert.equal(settings.__proto__.flag,true);
});
console.log(`Circuit history: ${checks} meaningful checks passed.`);
