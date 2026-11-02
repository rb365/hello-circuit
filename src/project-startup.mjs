// Resolve startup before rendering: loading a temporary blank project autosaves it.
export async function resolveProjectStartup({saved,hash,blank,normalize,decode,confirmReplace}) {
  let current=blank(),savedProject=null,error=null;
  if(saved){try{savedProject=normalize(JSON.parse(saved));current=savedProject;}catch(cause){error=cause;}}
  if(!hash.startsWith('#project='))return {project:current,error};
  try{
    const shared=normalize(await decode(hash.slice(9)));
    if(savedProject&&JSON.stringify(savedProject)!==JSON.stringify(shared)&&!confirmReplace())return {project:current,canceled:true};
    return {project:shared,previous:savedProject,shared:true};
  }catch(cause){return {project:current,error:cause};}
}
