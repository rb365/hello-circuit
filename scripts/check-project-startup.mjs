import assert from 'node:assert/strict';
import {resolveProjectStartup} from '../src/project-startup.mjs';

const old={version:2,name:'My saved work'},shared={version:2,name:'Shared work'},empty={version:2,name:'Blank'};
let confirmations=0;
const defaults={saved:JSON.stringify(old),hash:'#project=example',blank:()=>empty,normalize:p=>{if(p?.version!==2)throw new Error('Invalid project');return p;},decode:async()=>shared,confirmReplace:()=>{confirmations++;return true;}};
const resolve=overrides=>resolveProjectStartup({...defaults,...overrides});
let result=await resolve({});
assert.deepEqual(result.project,shared);assert.deepEqual(result.previous,old);assert.equal(result.shared,true);assert.equal(confirmations,1);
result=await resolve({confirmReplace:()=>false});assert.deepEqual(result.project,old);assert.equal(result.canceled,true);
result=await resolve({decode:async()=>{throw new Error('Bad compressed data');}});assert.deepEqual(result.project,old);assert.match(result.error.message,/Bad compressed/);
result=await resolve({decode:async()=>({version:99})});assert.deepEqual(result.project,old);assert.match(result.error.message,/Invalid project/);
result=await resolve({hash:''});assert.deepEqual(result.project,old);assert.equal(result.shared,undefined);
result=await resolve({saved:null});assert.deepEqual(result.project,shared);assert.equal(result.previous,null);
result=await resolve({saved:'{broken',hash:''});assert.deepEqual(result.project,empty);assert.ok(result.error);
result=await resolve({saved:null,decode:async()=>{throw new Error('Bad link');}});assert.deepEqual(result.project,empty);
result=await resolve({decode:async()=>old,confirmReplace:()=>{throw new Error('Identical project must not prompt');}});assert.deepEqual(result.project,old);assert.equal(result.shared,true);
console.log('Project startup: 9 cases passed (valid/invalid links, confirmation, saved recovery, first visit).');
