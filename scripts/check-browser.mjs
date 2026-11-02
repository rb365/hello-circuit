import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inflateSync,deflateSync} from 'node:zlib';
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
const assertBlank=async page=>{await page.waitForFunction(()=>document.querySelectorAll('#parts .part-label').length===1&&document.querySelectorAll('.wire-hit').length===0);assert.equal(await page.locator('.cm-content .cm-line').count(),1);assert.equal(await page.locator('.cm-content .cm-line').first().evaluate(line=>{const copy=line.cloneNode(true);copy.querySelectorAll('.cm-placeholder').forEach(node=>node.remove());return copy.textContent;}),'');assert.equal(await page.locator('#parts .part-label').count(),1);assert.equal(await page.locator('.wire-hit').count(),0);assert(await page.locator('#stop').isDisabled());};
const selectSample=async(page,index=0)=>{await page.locator('#examples-open').click();await page.locator(`#examples-menu [data-sample-index="${index}"]`).click();};
const waitCount=async count=>{
 try{await p.waitForFunction(expected=>String.fromCharCode(...(document.querySelector('wokwi-lcd1602')?.characters??[])).includes(`Count: ${expected}`),count,{timeout:20000});}
 catch(cause){const state=await p.evaluate(()=>{const lcd=document.querySelector('wokwi-lcd1602');return {status:document.querySelector('#status')?.textContent,console:document.querySelector('#console')?.innerText,lcdText:String.fromCharCode(...(lcd?.characters??[])),lcdCharacters:Array.from(lcd?.characters??[]),backlight:lcd?.backlight,button:document.querySelector('.push-toggle')?.textContent,led13:document.querySelector('wokwi-arduino-uno')?.led13,warnings:document.querySelector('#warnings')?.textContent};});throw new Error(`Waiting for Count: ${count} failed: ${JSON.stringify(state)}`,{cause});}
};
await test('first visit counter without autorun',async()=>{assert.equal(await p.locator('#project-name').inputValue(),'Button counter');assert.match(await p.locator('.cm-content').innerText(),/five\.Button/);assert.equal(await p.locator('wokwi-pushbutton').count(),1);assert.equal(await p.locator('wokwi-lcd1602').count(),1);assert(await p.locator('#stop').isDisabled());assert(await p.locator('#run').isEnabled());assert(!await p.locator('wokwi-arduino-uno').evaluate(board=>board.led13));assert(!await p.locator('wokwi-lcd1602').evaluate(lcd=>String.fromCharCode(...lcd.characters).includes('Count:')));});
await test('tagline and sage editor accents',async()=>{
 assert.equal(await p.locator('.brand-tagline').innerText(),'Build circuits. Program them in JavaScript.');
 assert.equal(await p.locator('.cm-gutters').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(250, 251, 250)');
 const gutterColors=await p.locator('.cm-activeLineGutter').evaluateAll(elements=>elements.map(el=>getComputedStyle(el).backgroundColor));
 assert(gutterColors.length>0);assert(gutterColors.every(color=>color==='rgb(234, 240, 238)'),JSON.stringify(gutterColors));
 assert.equal(await p.locator('.cm-activeLine').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(244, 247, 245)');
});
await test('chapter coverage reflects individual program evidence',async()=>{
 await p.locator('#help-open').click();await p.locator('#help-book-tab').click();
 const chapters=p.locator('#chapter-list .chapter');
 assert.equal(await chapters.nth(1).locator('summary .coverage-tag').innerText(),'2/3 programs checked · 1 external');
 assert.equal(await chapters.nth(3).locator('summary .coverage-tag').innerText(),'5/5 programs checked');
 const statuses=await chapters.nth(1).locator('.book-example .coverage-tag').allTextContents();assert.equal(statuses.filter(s=>s==='Program checked').length,2);assert.equal(statuses.filter(s=>s==='External workflow').length,1);
 await p.locator('#help-close').click();
});
await test('counter run press twice stop and rerun',async()=>{
 await p.locator('#run').click();await waitCount(0);assert(await p.locator('wokwi-lcd1602').evaluate(lcd=>lcd.backlight));
 const button=p.locator('.push-toggle');
 for(const count of [1,2]){await button.click();await waitCount(count);await p.waitForFunction(on=>document.querySelector('wokwi-arduino-uno').led13===on,count%2===1);await button.click();await p.waitForTimeout(100);}
 await p.locator('#stop').click();assert(await p.locator('#stop').isDisabled());assert(!await p.locator('wokwi-arduino-uno').evaluate(board=>board.led13));
 await p.locator('#run').click();await waitCount(0);await button.click();await waitCount(1);await button.click();await p.locator('#stop').click();
});
for(const width of [360,390,768,1440]) await test('layout '+width,async()=>{await p.setViewportSize({width,height:1000});await p.waitForTimeout(150);const m=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily}));assert(m.scroll<=width,JSON.stringify(m));assert.match(m.font,/Open Sans/i);const tagline=await p.locator('.brand-tagline').boundingBox();assert(tagline&&tagline.x>=0&&tagline.x+tagline.width<=width,'Tagline stays inside viewport');await p.locator('#examples-open').click();await p.locator('#examples-menu').waitFor({state:'visible'});const menu=await p.locator('#examples-menu').boundingBox();assert(menu&&menu.x>=0&&menu.x+menu.width<=width&&menu.y>=0&&menu.y+menu.height<=1000,'Examples menu stays inside viewport');await p.screenshot({path:`browser-test-results/prefix-${width}.png`,fullPage:true});await p.keyboard.press('Escape');assert.equal(await p.locator('#examples-menu').isVisible(),false);});
await test('examples keyboard dismiss and browse focus',async()=>{
 await p.locator('#examples-open').focus();await p.keyboard.press('Enter');await p.locator('#examples-menu').waitFor({state:'visible'});
 assert.equal(await p.locator('#examples-menu [data-sample-index]').count(),7);
 assert.match(await p.locator('#examples-menu [data-sample-index="0"]').innerText(),/Button counter.*Start here/s);
 await p.keyboard.press('Escape');assert.equal(await p.locator('#examples-menu').isVisible(),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'examples-open');
 await p.locator('#examples-open').click();await p.locator('#examples-browse').click();
 assert(await p.locator('#help-examples').isVisible());assert.equal(await p.locator('#help-examples-tab').getAttribute('aria-selected'),'true');
 const cards=p.locator('#sample-list .sample');assert.equal(await cards.count(),7);assert.match(await cards.first().innerText(),/Button counter.*Start here/s);
 for(let i=0;i<7;i++){assert.equal(await cards.nth(i).getByRole('button').count(),1);assert.equal(await cards.nth(i).getByRole('button').innerText(),'Load project');assert.match(await cards.nth(i).innerText(),/Code \+ circuit/);}
 assert.equal(await p.locator('#sample-list').getByText('Load code',{exact:true}).count(),0);assert.equal(await p.locator('#sample-list').getByText('Load prepared circuit',{exact:true}).count(),0);
 await p.keyboard.press('Escape');assert.equal(await p.locator('#help').evaluate(e=>e.open),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'examples-open');
});
await test('new project stays blank across reload',async()=>{await p.locator('#new-project').click();await assertBlank(p);await p.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');await p.reload();await p.locator('.cm-content').waitFor();await assertBlank(p);});
await test('empty run',async()=>{await p.locator('#run').click();await p.waitForFunction(()=>document.querySelector('#console').innerText.includes('Write your program'));assert(await p.locator('#stop').isDisabled());});
await test('load starter cancel preserves work and running simulation',async()=>{
 await p.locator('#project-name').fill('Keep my work');
 await p.locator('.cm-content').fill('setInterval(() => console.log("still running"), 1000);');
 await p.locator('#run').click();await p.waitForFunction(()=>!document.querySelector('#stop').disabled);
 const before=await p.locator('.cm-content').innerText(),beforeURL=p.url();
 p.once('dialog',dialog=>dialog.dismiss());await selectSample(p);
 assert.equal(await p.locator('#project-name').inputValue(),'Keep my work');assert.equal(await p.locator('.cm-content').innerText(),before);assert.equal(p.url(),beforeURL);assert(await p.locator('#stop').isEnabled());
});
await test('load starter accepts stops and preserves undo',async()=>{
 p.once('dialog',dialog=>{assert.match(dialog.message(),/replace your current work/);return dialog.accept();});await selectSample(p);
 await p.waitForFunction(()=>document.querySelector('#project-name').value==='Button counter'&&!document.querySelector('#examples-open').disabled);
 assert(await p.locator('#stop').isDisabled());assert.equal(await p.locator('wokwi-lcd1602').count(),1);
 await p.locator('#undo-load').click();await p.waitForFunction(()=>document.querySelector('#project-name').value==='Keep my work');assert.match(await p.locator('.cm-content').innerText(),/still running/);assert(await p.locator('#stop').isDisabled());
});
await test('load starter repeatedly saves reloads and runs counter',async()=>{
 for(let i=0;i<2;i++){p.once('dialog',dialog=>dialog.accept());await selectSample(p);await p.waitForFunction(()=>document.querySelector('#project-name').value==='Button counter'&&!document.querySelector('#examples-open').disabled);assert(await p.locator('#stop').isDisabled());}
 await p.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');await p.reload();await p.locator('.cm-content').waitFor();assert.equal(await p.locator('#project-name').inputValue(),'Button counter');assert(await p.locator('#stop').isDisabled());
 await p.locator('#run').click();await waitCount(0);await p.locator('.push-toggle').click();await waitCount(1);await p.locator('#stop').click();
 await p.locator('#new-project').click();await assertBlank(p);
});
await test('all dropdown examples load code and circuit together',async()=>{
 const names=['Blink a light','Count the blinks','Press a button','Fade a light','Turn a dial','Move a motor'];
 for(let index=1;index<=6;index++){
  p.once('dialog',dialog=>dialog.accept());await selectSample(p,index);
  await p.waitForFunction(name=>document.querySelector('#project-name').value===name&&!document.querySelector('#examples-open').disabled,names[index-1]);
  assert(await p.locator('#stop').isDisabled());assert((await p.locator('#parts .part-label').count())>1);assert((await p.locator('.wire-hit').count())>=3);assert.match(await p.locator('.cm-content').innerText(),/five/);
 }
});
await test('sample modal cancel keeps running project and accept supports undo',async()=>{
 await p.locator('#project-name').fill('Keep modal work');await p.locator('.cm-content').fill('setInterval(() => console.log("modal work"),1000);');await p.locator('#run').click();
 const before=await p.locator('.cm-content').innerText(),wires=await p.locator('.wire-hit').count(),beforeURL=p.url();
 await p.locator('#examples-open').click();await p.locator('#examples-browse').click();
 p.once('dialog',dialog=>dialog.dismiss());await p.locator('#sample-list .sample').first().getByRole('button',{name:'Load project',exact:true}).click();
 assert.equal(await p.locator('#project-name').inputValue(),'Keep modal work');assert.equal(await p.locator('.cm-content').innerText(),before);assert.equal(await p.locator('.wire-hit').count(),wires);assert.equal(p.url(),beforeURL);assert(await p.locator('#stop').isEnabled());assert(await p.locator('#help').evaluate(e=>e.open));
 p.once('dialog',dialog=>dialog.accept());await p.locator('#sample-list .sample').first().getByRole('button',{name:'Load project',exact:true}).click();
 await p.waitForFunction(()=>document.querySelector('#project-name').value==='Button counter'&&!document.querySelector('#examples-open').disabled);assert(await p.locator('#stop').isDisabled());assert.equal(await p.locator('wokwi-lcd1602').count(),1);assert.equal(await p.locator('#help').evaluate(e=>e.open),false);
 await p.locator('#undo-load').click();await p.waitForFunction(()=>document.querySelector('#project-name').value==='Keep modal work');assert.equal(await p.locator('.cm-content').innerText(),before);assert.equal(await p.locator('.wire-hit').count(),wires);
});
await test('repeated activation does not duplicate sample confirmation or overwrite undo',async()=>{
 await p.locator('#examples-open').click();let confirmations=0;const accept=dialog=>{confirmations++;return dialog.accept();};p.on('dialog',accept);
 try{await p.locator('#examples-menu [data-sample-index="0"]').evaluate(button=>{button.click();button.click();});await p.waitForFunction(()=>document.querySelector('#project-name').value==='Button counter'&&!document.querySelector('#examples-open').disabled);assert.equal(confirmations,1);}
 finally{p.off('dialog',accept);}
 await p.locator('#undo-load').click();await p.waitForFunction(()=>document.querySelector('#project-name').value==='Keep modal work');
});
await test('sample run stop rerun',async()=>{await p.locator('#help-open').click();await p.locator('#help-examples-tab').click();p.once('dialog',dialog=>dialog.accept());await p.locator('#sample-list .sample').nth(1).getByRole('button',{name:'Load project',exact:true}).click();assert(await p.locator('#stop').isDisabled());for(let i=0;i<2;i++){await p.locator('#run').click();await p.waitForFunction(()=>document.querySelector('#console').innerText.includes('Hello, little circuit!'),null,{timeout:20000});await p.locator('#stop').click();assert(await p.locator('#stop').isDisabled());}});
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
// Fresh contexts prevent a first-visit fixture from inheriting another test's autosave.
const startupFixture={version:2,name:'Saved priority fixture',platform:'uno',entry:'index.js',selectedFile:'index.js',files:{'index.js':'// Keep this saved source'},parts:[{id:'board',type:'uno',x:200,y:200}],wires:[]};
const sharedFixture={...startupFixture,name:'Shared priority fixture',files:{'index.js':'// Keep this shared source'}};
const sharedHash='#project='+deflateSync(JSON.stringify(sharedFixture)).toString('base64url');
for(const [index,name] of [[0,'Button counter'],[1,'Blink a light']])await test(name+' clears shared URL only after confirmation',async()=>{
 const isolated=await browser.newContext({viewport:{width:1440,height:1000}});
 try{
  const q=await isolated.newPage();q.on('pageerror',e=>errors.push(e.message));await q.goto(url+'?review=starter'+sharedHash);await q.locator('.cm-content').waitFor();
  q.once('dialog',dialog=>dialog.dismiss());await selectSample(q,index);assert(q.url().endsWith(sharedHash));assert.equal(await q.locator('#project-name').inputValue(),sharedFixture.name);
  q.once('dialog',dialog=>dialog.accept());await selectSample(q,index);await q.waitForFunction(()=>!location.hash);assert.equal(new URL(q.url()).search,'?review=starter');assert(await q.locator('#stop').isDisabled());
  // Undo also persists without letting the old share override the saved project.
  await q.locator('#undo-load').click();await q.waitForFunction(()=>document.querySelector('#project-name').value==='Shared priority fixture');
  q.once('dialog',dialog=>dialog.accept());await selectSample(q,index);await q.waitForFunction(expected=>document.querySelector('#project-name').value===expected&&!document.querySelector('#examples-open').disabled,name);
  await q.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');let dialogs=0;q.on('dialog',dialog=>{dialogs++;return dialog.dismiss();});await q.reload();await q.locator('.cm-content').waitFor();assert.equal(await q.locator('#project-name').inputValue(),name);assert.equal(dialogs,0);assert(await q.locator('#stop').isDisabled());
 }finally{await isolated.close();}
});
for(const fixture of [
 {name:'saved project wins over starter',saved:JSON.stringify(startupFixture),hash:'',expected:startupFixture},
 {name:'fresh valid share wins over starter',saved:null,hash:sharedHash,expected:sharedFixture},
 {name:'cancel shared replacement preserves saved source',saved:JSON.stringify(startupFixture),hash:sharedHash,expected:startupFixture,cancel:true},
 {name:'accept shared replacement preserves undo project',saved:JSON.stringify(startupFixture),hash:sharedHash,expected:sharedFixture,undo:true},
 {name:'invalid saved payload recovers blank not starter',saved:'{broken',hash:'',blank:true},
 {name:'invalid fresh share recovers blank not starter',saved:null,hash:'#project=invalid',blank:true}
])await test(fixture.name,async()=>{
 const isolated=await browser.newContext({viewport:{width:1440,height:1000}});isolated.setDefaultTimeout(10000);
 try{
  if(fixture.saved!==null)await isolated.addInitScript(saved=>{if(window.top!==window)return;if(!sessionStorage.getItem('fixture-seeded')){localStorage.setItem('little-circuit-lab-workbench-v2',saved);sessionStorage.setItem('fixture-seeded','yes');}},fixture.saved);
  const q=await isolated.newPage();q.on('pageerror',e=>errors.push(e.message));q.on('dialog',dialog=>fixture.cancel?dialog.dismiss():dialog.accept());
  await q.goto(url+fixture.hash);await q.locator('.cm-content').waitFor();await q.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');
  if(fixture.blank)await assertBlank(q);else{await q.waitForFunction(name=>document.querySelector('#project-name').value===name,fixture.expected.name);assert.equal(await q.locator('.cm-content').innerText(),fixture.expected.files['index.js']);assert.equal(await q.locator('wokwi-lcd1602').count(),0);}
  assert(await q.locator('#stop').isDisabled());
  await q.waitForFunction(()=>document.querySelector('#save-state').textContent==='Saved on this device');
  const saved=await q.evaluate(()=>JSON.parse(localStorage.getItem('little-circuit-lab-workbench-v2')));
  assert.equal(saved.files['index.js'],fixture.blank?'':fixture.expected.files['index.js']);
  if(fixture.undo){await q.locator('#undo-load').click();await q.waitForFunction(name=>document.querySelector('#project-name').value===name,startupFixture.name);assert.equal(await q.locator('.cm-content').innerText(),startupFixture.files['index.js']);assert(await q.locator('#stop').isDisabled());}
 }finally{await isolated.close();}
});
await test('no page or asset errors' ,async()=>{assert.deepEqual(errors,[]);assert.deepEqual(http,[]);});fs.writeFileSync('browser-test-results/results.json',JSON.stringify({url,results,errors,http},null,2));await browser.close();process.exitCode=results.some(x=>x.status==='FAIL')?1:0;})().catch(e=>{console.error(e);process.exitCode=2;}).finally(async()=>{await activeBrowser?.close();await new Promise(resolve=>server.close(resolve));});
