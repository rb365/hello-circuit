// Validate the actual deploy artifact under both a root and project-site URL.
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {resolve, relative} from 'node:path';
const root = resolve('dist');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'style.css'), 'utf8');
let checks = 0;
for (const base of ['https://example.test/', 'https://example.test/hello-circuit/']) {
  const paths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  paths.push(...[...css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]));
  paths.push('./assets/runtime.worker.js', './firmware/StandardFirmata.hex', './firmware/source.tar.gz');
  for (const path of paths) {
    if (/^(?:https?:|data:|#)/.test(path)) continue;
    assert.ok(!path.startsWith('/'), `Root-absolute URL breaks project Pages: ${path}`);
    const url = new URL(path, base);
    assert.ok(url.href.startsWith(base), `URL escapes site base: ${path}`);
    const local = resolve(root, decodeURIComponent(url.pathname.slice(new URL(base).pathname.length)) || 'index.html');
    assert.ok(!relative(root, local).startsWith('..'), `URL escapes dist: ${path}`);
    assert.ok(statSync(local).isFile(), `Missing asset: ${path}`);
    checks++;
  }
}
const app = readFileSync(resolve(root, 'assets/app.js'), 'utf8');
assert.ok(!/new Worker\(["']\//.test(app), 'Worker URL must not be root-absolute');
assert.ok(html.includes('Hello Circuit') && css.includes('Open Sans'), 'Expected branding missing');
console.log(`Deploy artifact: ${checks} local asset URLs passed at / and /hello-circuit/.`);
