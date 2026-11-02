import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
let checks = 0;
function check(directory) {
  for (const entry of readdirSync(directory, {withFileTypes:true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) check(path);
    else if (/\.(mjs|cjs|js)$/.test(path)) {
      execFileSync(process.execPath, ['--check', path], {stdio:'inherit'});
      checks++;
    }
  }
}
check('src'); check('scripts');
console.log(`Syntax: ${checks} JavaScript files passed (not a style lint or type check).`);
