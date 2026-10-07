import {build} from 'esbuild';
import {writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/app.mjs'],outfile:'dist/assets/app.js',bundle:true,format:'esm',target:'es2022',minify:true,legalComments:'linked',metafile:true});
await writeFile('node_modules/.lab-frontend-inputs.json',JSON.stringify(Object.keys(result.metafile.inputs)));
console.log('Browser interface built.');
