import assert from 'node:assert/strict';
import {chapters} from '../src/book.mjs';
import {chapterCoverage,labelFor} from '../src/book-coverage.mjs';
assert.equal(chapterCoverage(chapters[0]).label,'Concepts');
assert.equal(chapterCoverage(chapters[1]).label,'2/3 programs checked · 1 external');
assert.equal(chapterCoverage(chapters[2]).label,'Circuit model checked');
assert.equal(chapterCoverage(chapters[3]).label,'5/5 programs checked');
assert.equal(labelFor('external-workflow'),'External workflow');
let total=0,checked=0;
for(const chapter of chapters){const exercises=chapter.exercises??[];total+=exercises.length;checked+=exercises.filter(e=>e.status==='runtime-checked').length;if(exercises.length)assert.ok(chapterCoverage(chapter).label.startsWith(`${exercises.filter(e=>e.status==='runtime-checked').length}/${exercises.length} programs checked`));}
assert.equal(total,50);assert.equal(checked,49);
assert.equal(chapterCoverage({exercises:[{status:'api-checked'},{status:'model-checked'}]}).label,'0/2 programs checked');
assert.equal(chapterCoverage({exercises:[{status:'runtime-checked'},{status:'verified'},{status:'working'},{status:'api-checked'},{status:'model-checked'}]}).label,'3/5 programs checked');
console.log('Book coverage: recorded child program statuses, external workflow and non-program chapters passed.');
