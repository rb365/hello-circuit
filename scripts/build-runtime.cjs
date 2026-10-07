const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const esbuild = require('esbuild');
const root = path.resolve(__dirname,'..');
const files = new Set();
const entry = path.join(root,'src/runtime/runtime.worker.source.js');
const build = browserify(entry);
for (const module of ['serialport','browser-serialport','firmata','repl']) build.ignore(module);
build.on('file',file=>files.add(file));
build.bundle(async (error, output) => {
  if (error) throw error;
  const result=await esbuild.transform(output.toString(),{minify:true,target:'es2020',legalComments:'eof'});
  fs.mkdirSync(path.join(root,'dist'),{recursive:true});
  fs.writeFileSync(path.join(root,'dist/assets/runtime.worker.js'),result.code);
  const packages=new Map();
  for (const file of files) {
    let directory=path.dirname(file);
    while(directory!==path.dirname(directory)) {
      const manifest=path.join(directory,'package.json');
      if(fs.existsSync(manifest)) {
        const pkg=JSON.parse(fs.readFileSync(manifest,'utf8'));
        if(pkg.name) packages.set(`${pkg.name}@${pkg.version}`,{directory,pkg});
        break;
      }
      directory=path.dirname(directory);
    }
  }
  let notices='Runtime third-party license notices\n\nThe runtime executes Firmata firmware, licensed LGPL-2.1-or-later, using AVR8js.\nMatching Arduino/Firmata/Servo firmware source and licenses: firmware/source.tar.gz\nFirmata firmware binary: firmware/StandardFirmata.hex\n\n';
  for (const [name,{directory,pkg}] of [...packages].sort()) {
    notices+=`\n========================================\n${name}\nDeclared license: ${typeof pkg.license==='object'?JSON.stringify(pkg.license):pkg.license||JSON.stringify(pkg.licenses)||'See upstream source'}\n`;
    const licenseFiles=fs.readdirSync(directory).filter(name=>/^(license|copying|copyright|licence)(\.|-|$)/i.test(name));
    for (const name of licenseFiles) {
      const filename=path.join(directory,name);
      if(fs.statSync(filename).isFile())notices+=`\n${name}\n${fs.readFileSync(filename,'utf8')}\n`;
    }
    if(!licenseFiles.length && pkg.name==='johnny-five') {
      const readme=fs.readFileSync(path.join(directory,'README.md'),'utf8');
      notices+=readme.slice(readme.indexOf('## License'),readme.indexOf('## License')+400)+'\n';
    }
  }
  const additional=path.join(root,'runtime-additional-notices.txt');
  if(fs.existsSync(additional))notices+='\n'+fs.readFileSync(additional,'utf8');
  fs.writeFileSync(path.join(root,'dist/runtime-licenses.txt'),notices);
  console.log(`Runtime: ${result.code.length} bytes. ${packages.size} package notices written.`);
});
