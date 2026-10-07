import fs from 'node:fs';
import path from 'node:path';
import {bookSourceLicense} from '../src/book.mjs';
const packages=new Map();
for(const file of JSON.parse(fs.readFileSync('node_modules/.lab-frontend-inputs.json','utf8'))){
  if(!file.startsWith('node_modules/'))continue;
  let directory=path.dirname(path.resolve(file));
  while(directory!==path.dirname(directory)){
    const manifest=path.join(directory,'package.json');
    if(fs.existsSync(manifest)){
      const pkg=JSON.parse(fs.readFileSync(manifest,'utf8'));
      packages.set(pkg.name+'@'+pkg.version,{directory,pkg});break;
    }
    directory=path.dirname(directory);
  }
}
let notices='Little Circuit Lab — third-party notices\n\nOriginal interface, examples and browser adapter: MIT (see LICENSE).\nFirmware and bundled dependencies retain their own licenses below.\nMatching firmware source: /firmware/source.tar.gz\nFirmware build details: /firmware/BUILD.md\nOriginal app source: /source.zip\n\nFrontend packages\n';
for(const[name,{directory,pkg}]of [...packages].sort()){
  notices+='\n========================================\n'+name+'\nDeclared license: '+JSON.stringify(pkg.license??pkg.licenses)+'\n';
  for(const file of fs.readdirSync(directory).filter(n=>/^(license|copying|copyright|licence)(\.|-|$)/i.test(n))){
    const filename=path.join(directory,file);if(fs.statSync(filename).isFile())notices+='\n'+file+'\n'+fs.readFileSync(filename,'utf8');
  }
}
notices+='\nOfficial JavaScript on Things example source\n'+bookSourceLicense+'\n';
notices+='\n'+fs.readFileSync('dist/runtime-licenses.txt','utf8');
fs.writeFileSync('dist/THIRD_PARTY_NOTICES.txt',notices);
fs.copyFileSync('dist/THIRD_PARTY_NOTICES.txt','THIRD_PARTY_NOTICES.txt');
console.log('Third-party notices assembled.');
