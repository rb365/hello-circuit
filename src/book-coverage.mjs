// Counts describe recorded program checks, not complete chapter/hardware coverage.
export const labelFor=status=>status==='verified'||status==='working'?'Verified example':status==='runtime-checked'?'Program checked':status==='api-checked'||status==='adapter-checked'?'API check passed':status==='model-checked'?'Circuit model checked':status==='conceptual-only'?'Concepts':status==='partial'?'Partial coverage':status==='external-workflow'?'External workflow':'More work needed';
export const classFor=status=>status==='verified'||status==='working'||status==='runtime-checked'||status==='model-checked'?'working':status==='partial'||status==='adapter-checked'||status==='api-checked'?'partial':'pending';
export function chapterCoverage(chapter) {
  const exercises=chapter.exercises??[];
  if(!exercises.length)return {label:labelFor(chapter.status),className:classFor(chapter.status)};
  const checked=exercises.filter(e=>['runtime-checked','verified','working'].includes(e.status)).length;
  const external=exercises.filter(e=>e.status==='external-workflow').length;
  return {label:`${checked}/${exercises.length} programs checked${external?` · ${external} external`:''}`,className:checked===exercises.length?'working':'partial'};
}
