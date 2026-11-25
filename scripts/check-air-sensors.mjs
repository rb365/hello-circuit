import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {examples} from '../src/examples.mjs';
import {definitions} from '../src/components.mjs';
import {analyzeCircuit} from '../src/circuit.mjs';

const require=createRequire(import.meta.url);
const {PeripheralManager}=require('../src/runtime/peripherals.js');
const manager=new PeripheralManager({input(){}});
const parts=[{id:'board',type:'uno',pins:['3.3V','5V','GND.1','GND.2','A4','A5'].map(name=>({name}))},{id:'air',type:'ccs811'}];
const wires=[
  {a:'board:3.3V',b:'air:VCC'},{a:'board:GND.1',b:'air:GND'},
  {a:'board:GND.2',b:'air:WAKE'},{a:'board:A4',b:'air:SDA'},{a:'board:A5',b:'air:SCL'}
];
const descriptors=connections=>analyzeCircuit(parts,connections).peripherals;
const configure=connections=>manager.configure(descriptors(connections));
const read=(register,count=1)=>manager.readI2C(0x5a,register,count);
const write=(...bytes)=>manager.writeI2C(0x5a,bytes);

assert.deepEqual(descriptors(wires),[{id:'air',type:'ccs811',supply:true,powered:true,pins:{SDA:18,SCL:19}}]);
configure(wires);
assert.deepEqual(read(0x20),[0x81]);
assert.deepEqual(read(0x00),[0x10]);
write(0x01,0x10);
assert.deepEqual(read(0x01),[0]);
write(0xf4);
assert.deepEqual(read(0x00),[0x90]);
write(0x01,0x10);
assert.deepEqual(read(0x00),[0x98]);
assert.deepEqual(read(0x02,8),[2,138,0,25,0x98,0,0,0]);
manager.input('air',{eco2:1450,tvoc:700});
assert.deepEqual(read(0x02,4),[5,170,2,188]);
for(const index of [2,3,4]){
  configure(wires.filter((_,i)=>i!==index));
  assert.throws(()=>read(0x20),/No powered I2C device/);
  configure(wires);
  assert.deepEqual(read(0x00),[0x98],'Wake and interrupted wiring do not reset the powered device');
}
configure([{a:'board:5V',b:'air:VCC'},...wires.slice(1)]);
assert.throws(()=>read(0x20),/No powered I2C device/);
configure(wires);
assert.deepEqual(read(0x00),[0x10],'Loss of the allowed supply resets configuration');
assert.throws(()=>manager.readI2C(0x5b,0x20,1),/No powered I2C device/);
console.log('CCS811: powered-wiring gate, hardware ID, start/mode, live data and power-cycle checks passed.');

const bench=examples.find(example=>example.id==='air-bench').scene;
const boardPins=['5V','3.3V','GND.1','A0','A4','A5'].map(name=>({name}));
const benchParts=bench.parts.map(part=>part.type==='uno'?{...part,pins:boardPins}:part);
for(const {a,b} of bench.wires)for(const endpoint of [a,b]){
  const [id,name]=endpoint.split(':');
  const part=benchParts.find(part=>part.id===id);
  assert.ok((part?.pins??definitions[part?.type]?.pins??[]).some(pin=>pin.name===name),endpoint);
}
const defaultBench=analyzeCircuit(benchParts,bench.wires);
assert.equal(defaultBench.analogInputs.A0,160);
assert.ok(defaultBench.components.dust.powered);
assert.ok(defaultBench.peripherals.find(p=>p.type==='ccs811').powered);
assert.deepEqual(defaultBench.warnings,[]);
const adjusted=benchParts.map(part=>part.id==='dust'?{...part,settings:{dust:160}}:part);
assert.equal(analyzeCircuit(adjusted,bench.wires).analogInputs.A0,364);
for(const endpoint of ['dust:VCC','dust:GND','dust:AO']){
  const disconnected=bench.wires.filter(wire=>wire.a!==endpoint&&wire.b!==endpoint);
  assert.equal(analyzeCircuit(benchParts,disconnected).analogInputs.A0,0,endpoint);
}
console.log('Air sensor bench: all endpoints, breadboard continuity, analog scale, and disconnected dust signals passed.');
