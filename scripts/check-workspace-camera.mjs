import assert from 'node:assert/strict';
import {viewportWorldBounds,gridGeometry,fitCamera,zoomCamera} from '../src/workspace-camera.mjs';

let checks=0;
const near=(a,b,message='Numbers match')=>assert.ok(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${message}: ${a} vs ${b}`);
const screen=(camera,point)=>({x:camera.x+point.x*camera.scale,y:camera.y+point.y*camera.scale});
const world=(camera,point)=>({x:(point.x-camera.x)/camera.scale,y:(point.y-camera.y)/camera.scale});
function check(name,run){run();checks++;console.log('✓ '+name);}
function visibleFit(bounds,width,height,padding){
 const camera=fitCamera(bounds,width,height,{padding}),a=screen(camera,bounds),b=screen(camera,{x:bounds.x+bounds.width,y:bounds.y+bounds.height});
 assert.ok(a.x>=padding-1e-7&&a.y>=padding-1e-7&&b.x<=width-padding+1e-7&&b.y<=height-padding+1e-7);
 near((a.x+b.x)/2,width/2);near((a.y+b.y)/2,height/2);return camera;
}

check('Viewport SVG rectangle has exact world-to-screen calibration with its margin',()=>{
 const camera={x:300,y:-450,scale:.5},bounds=viewportWorldBounds(camera,800,600),a=screen(camera,bounds),b=screen(camera,{x:bounds.x+bounds.width,y:bounds.y+bounds.height});
 assert.deepEqual(a,{x:-64,y:-64});assert.deepEqual(b,{x:864,y:664});
});
check('Panning far beyond the old canvas keeps the SVG frame around the current viewport',()=>{
 const camera={x:-120000,y:80000,scale:1.25},bounds=viewportWorldBounds(camera,1280,720,0);
 assert.deepEqual(screen(camera,bounds),{x:0,y:0});assert.deepEqual(screen(camera,{x:bounds.x+bounds.width,y:bounds.y+bounds.height}),{x:1280,y:720});
 assert.ok(bounds.x>1600&&bounds.y<0);
});
check('Fit includes parts entirely in negative world coordinates',()=>{
 visibleFit({x:-3400,y:-2200,width:700,height:500},1000,700,40);
});
check('Fit includes distant parts across both sides of the former scene',()=>{
 const camera=visibleFit({x:-100000,y:-50000,width:200000,height:100000},1280,720,40);
 assert.ok(camera.scale<.02);
});
check('Fit centers a very distant compact circuit without depending on the origin',()=>{
 const bounds={x:10000000,y:-20000000,width:400,height:240},camera=visibleFit(bounds,800,600,40);
 near(camera.scale,1.5);
});
check('Fitting the same layout at a different origin preserves its displayed size',()=>{
 const a=fitCamera({x:0,y:0,width:1000,height:800},900,700),b=fitCamera({x:-90000,y:80000,width:1000,height:800},900,700);
 near(a.scale,b.scale);near(screen(a,{x:500,y:400}).x,screen(b,{x:-89500,y:80400}).x);near(screen(a,{x:500,y:400}).y,screen(b,{x:-89500,y:80400}).y);
});
check('A zero-area selection remains centered at a bounded useful zoom',()=>{
 const camera=fitCamera({x:-9000,y:12000,width:0,height:0},800,600);
 assert.equal(camera.scale,1.5);assert.deepEqual(screen(camera,{x:-9000,y:12000}),{x:400,y:300});
});
check('Pointer-centered zoom preserves the world point under the pointer',()=>{
 const camera={x:-8500,y:4800,scale:.6},anchor={x:735,y:271},before=world(camera,anchor),after=world(zoomCamera(camera,1.4,anchor),anchor);
 near(before.x,after.x);near(before.y,after.y);
});
check('Zoom in and out reverse each other when no zoom limit is reached',()=>{
 const camera={x:300,y:-500,scale:.75},anchor={x:200,y:300},result=zoomCamera(zoomCamera(camera,1.25,anchor),.8,anchor);
 near(result.x,camera.x);near(result.y,camera.y);near(result.scale,camera.scale);
});
check('Zoom out after a very wide Fit never jumps in to the ordinary minimum',()=>{
 const camera={x:400,y:300,scale:.001},result=zoomCamera(camera,.8,{x:400,y:300});
 assert.deepEqual(result,camera);
});
check('Zoom in recovers gradually from a Fit below the ordinary minimum',()=>{
 const camera={x:400,y:300,scale:.001},result=zoomCamera(camera,1.2,{x:400,y:300});
 near(result.scale,.0012);assert.ok(result.scale<.02);
});
check('Ordinary zoom limits preserve pointer anchoring',()=>{
 const camera={x:40,y:-90,scale:2},anchor={x:100,y:200},result=zoomCamera(camera,100,anchor);
 assert.equal(result.scale,2.5);near(world(camera,anchor).x,world(result,anchor).x);near(world(camera,anchor).y,world(result,anchor).y);
 assert.equal(zoomCamera({x:0,y:0,scale:.03},.1,anchor).scale,.02);
});
check('Grid world spacing changes by powers of two and stays readable in screen pixels',()=>{
 assert.equal(gridGeometry({x:0,y:0,scale:1}).worldStep,18);
 assert.equal(gridGeometry({x:0,y:0,scale:2}).worldStep,9);
 assert.equal(gridGeometry({x:0,y:0,scale:.5}).worldStep,36);
 for(const scale of [.0001,.002,.02,.1,.7,1,1.3,2.5]){const grid=gridGeometry({x:0,y:0,scale});assert.ok(grid.spacing>=18/Math.sqrt(2)-1e-9&&grid.spacing<=18*Math.sqrt(2)+1e-9);near(grid.worldStep*scale,grid.spacing);}
});
check('Radial-gradient dot centers align with the projected world origin, including negative pan',()=>{
 for(const camera of [{x:0,y:0,scale:1},{x:-77,y:121,scale:.7},{x:120000,y:-40000,scale:.002}]){
  const grid=gridGeometry(camera),phase=value=>((value%grid.spacing)+grid.spacing)%grid.spacing;
  for(const offset of [grid.x+grid.spacing/2-camera.x,grid.y+grid.spacing/2-camera.y]){const p=phase(offset);assert.ok(Math.min(p,grid.spacing-p)<1e-7,'Dot center and projected origin have the same circular phase');}
  assert.ok(grid.x>=0&&grid.x<grid.spacing&&grid.y>=0&&grid.y<grid.spacing);
 }
});
check('Grid phase follows pan and repeats after one screen-space grid tile',()=>{
 const a=gridGeometry({x:-20,y:40,scale:.7}),b=gridGeometry({x:-20+a.spacing,y:40-a.spacing,scale:.7});
 near(a.x,b.x);near(a.y,b.y);near(a.spacing,b.spacing);
});
check('Camera helpers leave frozen caller inputs untouched',()=>{
 const camera=Object.freeze({x:100,y:-300,scale:.5}),anchor=Object.freeze({x:400,y:300}),bounds=Object.freeze({x:-500,y:800,width:400,height:300});
 viewportWorldBounds(camera,800,600);gridGeometry(camera);fitCamera(bounds,800,600);zoomCamera(camera,1.2,anchor);
 assert.deepEqual(camera,{x:100,y:-300,scale:.5});assert.deepEqual(bounds,{x:-500,y:800,width:400,height:300});
});
check('Invalid or unrepresentable geometry is rejected before returning NaN/Infinity',()=>{
 assert.throws(()=>viewportWorldBounds({x:0,y:0,scale:0},800,600),RangeError);
 assert.throws(()=>viewportWorldBounds({x:Infinity,y:0,scale:1},800,600),RangeError);
 assert.throws(()=>fitCamera({x:0,y:0,width:-1,height:100},800,600),RangeError);
 assert.throws(()=>fitCamera({x:0,y:0,width:100,height:100},0,600),RangeError);
 assert.throws(()=>zoomCamera({x:0,y:0,scale:1},0,{x:0,y:0}),RangeError);
 assert.throws(()=>zoomCamera({x:0,y:0,scale:1},1.2,{x:0,y:0},{minScale:3,maxScale:2}),RangeError);
});
console.log(`Workspace camera: ${checks} meaningful checks passed.`);
