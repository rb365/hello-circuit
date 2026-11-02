import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inflateSync} from 'node:zlib';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const output=path.resolve('browser-test-results');
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.hex':'text/plain'};
// Serve only the project prefix: an accidental root-relative request must fail.
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(!pathname.startsWith('/hello-circuit/')){res.writeHead(404).end();return;}
 const file=path.resolve(root,pathname.slice('/hello-circuit/'.length)||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);});
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const baseURL=`http://127.0.0.1:${server.address().port}/hello-circuit/`;
let activeBrowser;

(async()=>{const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']}); activeBrowser=browser; const results=[],errors=[],http=[];const context=await browser.newContext({viewport:{width:1440,height:1000}});context.setDefaultTimeout(10000);const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)http.push([r.status(),r.url()])});const url=baseURL;const test=async(name,fn)=>{try{await fn();results.push({name,status:'PASS'});}catch(e){results.push({name,status:'FAIL',error:e.message});}console.log(JSON.stringify(results.at(-1)));if(results.at(-1).status==='FAIL')await p.screenshot({path:path.join(output,name.replace(/[^a-z0-9]+/gi,'-')+'-failure.png'),fullPage:true}).catch(()=>{});};
await p.goto(url);await p.locator('.cm-content').waitFor();await p.waitForTimeout(800);
await test('blank startup',async()=>{assert.equal((await p.locator('.cm-content').innerText()).trim(),'');assert.equal(await p.locator('#parts .part-label').count(),1);assert(await p.locator('#stop').isDisabled());});
for(const width of [360,390,768,1440]) await test('layout '+width,async()=>{await p.setViewportSize({width,height:1000});await p.waitForTimeout(150);const m=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily}));assert(m.scroll<=width,JSON.stringify(m));assert.match(m.font,/Open Sans/i);await p.screenshot({path:`browser-test-results/prefix-${width}.png`,fullPage:true});});
await test('empty run',async()=>{await p.locator('#run').click();await p.waitForFunction(()=>document.querySelector('#console').innerText.includes('Write your program'));assert(await p.locator('#stop').isDisabled());});
await test('sample run stop rerun',async()=>{await p.locator('#help-open').click();await p.locator('#help-examples-tab').click();await p.locator('#sample-list .sample').first().getByText('Load prepared circuit',{exact:true}).click();assert(await p.locator('#stop').isDisabled());for(let i=0;i<2;i++){await p.locator('#run').click();await p.waitForFunction(()=>document.querySelector('#console').innerText.includes('Hello, little circuit!'),null,{timeout:20000});await p.locator('#stop').click();assert(await p.locator('#stop').isDisabled());}});
await test('wire remove undo redo',async()=>{await p.waitForFunction(()=>document.querySelectorAll('.wire-hit').length===3);await p.locator('.wire-hit').first().focus();await p.keyboard.press('Enter');await p.locator('#remove-selected').click();assert.equal(await p.locator('.wire-hit').count(),2);await p.locator('#circuit-undo').click();await p.waitForFunction(()=>document.querySelectorAll('.wire-hit').length===3);await p.locator('#circuit-redo').click();await p.waitForFunction(()=>document.querySelectorAll('.wire-hit').length===2);await p.locator('#circuit-undo').click();});
await test('component movement and connecting pins',async()=>{
 await p.locator('#fit-circuit').click();
 const label=p.getByRole('button',{name:'Move or select LED',exact:true});
 const before=await label.locator('..').getAttribute('style');
 const bounds=await label.boundingBox();assert(bounds,'LED label visible');
 await p.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await p.mouse.down();await p.mouse.move(bounds.x+bounds.width/2+30,bounds.y+bounds.height/2-25,{steps:8});await p.mouse.up();
 assert.notEqual(await label.locator('..').getAttribute('style'),before);
 await p.locator('#circuit-undo').click();await p.waitForFunction(()=>document.querySelector('#circuit-redo').disabled===false);
 // Connect a previously unconnected board pin, then remove only the new wire.
 await p.locator('#parts').getByRole('button',{name:'Connect Arduino Uno pin 12',exact:true}).click();
 await p.locator('#parts').getByRole('button',{name:'Connect LED pin A',exact:true}).click();
 assert.equal(await p.locator('.wire-hit').count(),4);await p.locator('#remove-selected').click();assert.equal(await p.locator('.wire-hit').count(),3);
});
await test('share roundtrip no autorun' ,async()=>{await p.locator('#share').click();await p.locator('#share-dialog').waitFor({state:'visible'});const link=await p.locator('#share-link').inputValue();assert(link.startsWith(url+'#project='));const q=await context.newPage();q.on('dialog',dialog=>dialog.accept());await q.goto(link);await q.waitForFunction(()=>document.querySelector('#project-name')?.value==='Blink a light');assert.equal(await q.locator('.wire-hit').count(),3);assert.match(await q.locator('.cm-content').innerText(),/light.blink/);assert(await q.locator('#stop').isDisabled());await q.close();await p.locator('#share-close').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'share');});
await test('download open roundtrip',async()=>{const promise=p.waitForEvent('download');await p.locator('#download-project').click();const d=await promise;await d.saveAs('browser-test-results/project.json');await p.locator('#new-project').click();await p.locator('#project-file').setInputFiles('browser-test-results/project.json');await p.waitForFunction(()=>document.querySelector('#project-name').value==='Blink a light');assert.equal(await p.locator('.wire-hit').count(),3);assert(await p.locator('#stop').isDisabled());});
await test('file dialog escape restores focus',async()=>{await p.locator('#add-file').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'file-name');await p.keyboard.press('Escape');assert.equal(await p.locator('#file-dialog').evaluate(e=>e.open),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'add-file');});
await test('bad code and infinite loop stoppable',async()=>{for(const code of ['const = ;','while(true) {}']){await p.locator('.cm-content').fill(code);await p.locator('#run').click();if(code==='const = ;')await p.waitForFunction(()=>document.querySelector('#console .error'));else await p.waitForTimeout(1200);if(await p.locator('#stop').isEnabled())await p.locator('#stop').click();assert(await p.locator('#stop').isDisabled());assert(await p.locator('#run').isEnabled());}});
await test('saved shared project retains edits on reload',async()=>{
await p.locator('#new-project').click();await p.locator('#project-file').setInputFiles('browser-test-results/project.json');
await p.waitForFunction(()=>document.querySelector('#project-name').value==='Blink a light' && document.querySelector('.cm-content').textContent.includes('light.blink'));
await p.locator('#add-file').click();await p.locator('#file-name').fill('Rover.js');await p.locator('#file-form button[type=submit]').click();await p.locator('.cm-content').fill('module.exports = {message: "preserved"};');
await p.locator('#share').click();await p.locator('#share-dialog').waitFor({state:'visible'});const link=await p.locator('#share-link').inputValue();const encoded=JSON.parse(inflateSync(Buffer.from(link.split('#project=')[1],'base64url')).toString());assert.equal(encoded.files['Rover.js'],'module.exports = {message: "preserved"};');await p.locator('#share-close').click();
const q=await context.newPage();q.on('dialog',dialog=>dialog.accept());await q.goto(link);await q.waitForFunction(()=>document.querySelector('.cm-content')?.textContent.includes('preserved'));await q.locator('#project-name').fill('Edited shared project');await q.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');q.removeAllListeners('dialog');q.on('dialog',dialog=>dialog.dismiss());await q.reload();await q.waitForFunction(()=>document.querySelector('#project-name').value==='Edited shared project');assert(await q.locator('#stop').isDisabled());await q.close();
});
await test('invalid share preserves saved work',async()=>{
 const q=await context.newPage();await q.goto(url);await q.locator('.cm-content').waitFor();await q.locator('#project-name').fill('Keep this saved project');await q.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');await q.goto(url+'#project=not-valid-compressed-data');await q.reload();await q.waitForFunction(()=>document.querySelector('#project-name').value==='Keep this saved project');assert(await q.locator('#stop').isDisabled());await q.close();
});
await test('no page or asset errors' ,async()=>{assert.deepEqual(errors,[]);assert.deepEqual(http,[]);});fs.writeFileSync('browser-test-results/results.json',JSON.stringify({url,results,errors,http},null,2));await browser.close();process.exitCode=results.some(x=>x.status==='FAIL')?1:0;})().catch(e=>{console.error(e);process.exitCode=2;}).finally(async()=>{await activeBrowser?.close();await new Promise(resolve=>server.close(resolve));});
