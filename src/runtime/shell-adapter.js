/* SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Little Circuit Lab contributors.
 * Original virtual shell subset. This is a small command interpreter, not an
 * operating system, Bash process, native filesystem, or package manager.
 */

function createShell({fs,io,send=()=>{},files={}}={}) {
  if(!io||!['raspi','beaglebone'].includes(io.platform))throw new Error('The virtual shell supports the Raspberry Pi and BeagleBone API boards.');
  const variables=new Map(),exported=new Set(),directions=new Map(),timers=new Map(),jobs=new Set();
  let cwd='/project',disposed=false;
  const projectFiles=new Map();
  const unsupported=command=>new Error(`${command} is outside the virtual shell subset. Type help for supported commands.`);
  const normalize=path=>{
    const pieces=(String(path).startsWith('/')?String(path):cwd+'/'+path).split('/'),result=[];
    for(const piece of pieces){if(!piece||piece==='.')continue;if(piece==='..')result.pop();else result.push(piece);}
    return '/'+result.join('/');
  };
  for(const [path,source]of Object.entries(files))if(typeof source==='string')projectFiles.set(normalize('/project/'+path.replace(/^\/+/,'')),source);
  const nativeIndex=gpio=>{
    if(!/^\d+$/.test(String(gpio)))throw new Error('Use a numeric native GPIO number.');
    const index=io.normalize('GPIO'+Number(gpio));
    if(!Number.isInteger(index))throw new Error(`GPIO ${gpio} is unavailable on this virtual board.`);
    return index;
  };
  const gpioFile=path=>/^\/sys\/class\/gpio\/gpio(\d+)\/(direction|value)$/.exec(path);
  const write=(path,value)=>{
    const target=normalize(path),text=String(value).trim();
    if(target==='/sys/class/gpio/export'||target==='/sys/class/gpio/unexport'){
      const n=Number(text);nativeIndex(text);
      if(io.platform==='raspi'){
        if(!fs?.writeFileSync)throw new Error('Virtual GPIO filesystem is unavailable.');
        fs.writeFileSync(target,text);
      }else if(target.endsWith('/export')){
        if(exported.has(n))throw new Error('EBUSY: GPIO is already exported.');
      }else if(!exported.has(n))throw new Error('EINVAL: GPIO is not exported.');
      if(target.endsWith('/export')){exported.add(n);directions.set(n,'in');}
      else{exported.delete(n);directions.delete(n);}
      return;
    }
    const match=gpioFile(target);if(!match)throw new Error('Writes are limited to the virtual GPIO export, unexport, direction and value files.');
    const gpio=Number(match[1]),index=nativeIndex(gpio);
    if(io.platform==='raspi'){
      if(!fs?.writeFileSync)throw new Error('Virtual GPIO filesystem is unavailable.');
      fs.writeFileSync(target,text);exported.add(gpio);if(match[2]==='direction')directions.set(gpio,text);
    }else{
      if(!exported.has(gpio))throw new Error('ENOENT: export the virtual GPIO first.');
      if(match[2]==='direction'){
        if(!['in','out'].includes(text))throw new Error('EINVAL: direction must be in or out.');
        io.pinMode(index,text==='out'?io.MODES.OUTPUT:io.MODES.INPUT);directions.set(gpio,text);
      }else{
        if(directions.get(gpio)!=='out')throw new Error('EPERM: GPIO is not an output.');
        if(!/^[01]$/.test(text))throw new Error('EINVAL: GPIO value must be 0 or 1.');
        io.digitalWrite(index,Number(text));
      }
    }
  };
  const read=path=>{
    const target=normalize(path);if(projectFiles.has(target))return projectFiles.get(target);
    const match=gpioFile(target);if(!match)throw new Error('Reads are limited to project files and virtual GPIO direction/value files.');
    const gpio=Number(match[1]),index=nativeIndex(gpio);
    if(io.platform==='raspi'){
      if(!fs?.readFileSync)throw new Error('Virtual GPIO filesystem is unavailable.');
      const value=fs.readFileSync(target,'utf8');exported.add(gpio);return String(value);
    }
    if(!exported.has(gpio))throw new Error('ENOENT: export the virtual GPIO first.');
    return String(match[2]==='direction'?directions.get(gpio):io.pins[index].value)+'\n';
  };
  const children=path=>{
    const target=normalize(path);
    const staticDirectories={'/':['project','sys'],'/sys':['class'],'/sys/class':['gpio']};
    if(staticDirectories[target])return staticDirectories[target];
    if(target==='/sys/class/gpio')return ['export','unexport',...[...exported].sort((a,b)=>a-b).map(n=>'gpio'+n)];
    const gpioDirectory=/^\/sys\/class\/gpio\/gpio(\d+)$/.exec(target);
    if(gpioDirectory){read(target+'/value');return ['direction','value'];}
    if(target==='/project'||target.startsWith('/project/')){
      const prefix=target+'/';const names=[...projectFiles.keys()].filter(name=>name.startsWith(prefix)).map(name=>name.slice(prefix.length).split('/')[0]);
      if(names.length||target==='/project')return [...new Set(names)].sort();
    }
    throw new Error(`No virtual directory ${target}.`);
  };
  function statements(source){
    if(typeof source!=='string'||source.length>60000)throw new Error('Use at most 60,000 characters in a virtual shell command.');
    const output=[];let current='',quote='',escaped=false,comment=false;
    for(let i=0;i<source.length;i++){
      const char=source[i];if(char==='\0')throw unsupported('NUL characters');
      if(comment){if(char!=='\n')continue;comment=false;}
      if(escaped){current+=char;escaped=false;continue;}
      if(char==='\\'&&quote!=="'"){current+=char;escaped=true;continue;}
      if(quote){current+=char;if(char===quote)quote='';continue;}
      if(char==='"'||char==="'"){quote=char;current+=char;continue;}
      if(char==='#'&&(!current||/\s$/.test(current))){comment=true;continue;}
      if(char===';'||char==='\n'){if(current.trim())output.push(current.trim());current='';continue;}
      current+=char;
    }
    if(quote||escaped)throw new Error('Close the quote or escape in your virtual shell command.');
    if(current.trim())output.push(current.trim());return output;
  }
  function words(source){
    const output=[];let word='',started=false,quote='';
    const finish=()=>{if(started){output.push({word});word='';started=false;}};
    for(let i=0;i<source.length;i++){
      const char=source[i];
      if(char==='\\'&&quote!=="'"){
        const next=source[++i];if(next===undefined)throw new Error('Incomplete escape.');
        if(next!=='\n'){word+=next;started=true;}continue;
      }
      if(char===quote){quote='';started=true;continue;}
      if(!quote&&(char==='"'||char==="'")){quote=char;started=true;continue;}
      if(char==='$'&&quote!=="'"){
        if(source[i+1]==='(')throw unsupported('Command substitution');
        const match=/^\$\{([A-Za-z_]\w*)\}|^\$([A-Za-z_]\w*)/.exec(source.slice(i));
        if(match){word+=variables.get(match[1]??match[2])??'';started=true;i+=match[0].length-1;continue;}
      }
      if(!quote&&/\s/.test(char)){finish();continue;}
      if(!quote&&char==='>'){finish();if(source[i+1]==='>')throw unsupported('Append redirection');output.push({redirect:true});continue;}
      if(quote!=="'"&&char==='`'||!quote&&/[|&<()]/.test(char))throw unsupported('Pipes, background jobs and shell substitution');
      word+=char;started=true;
    }
    if(quote)throw new Error('Close the quote in your virtual shell command.');finish();return output;
  }
  function parse(source){
    const lines=statements(source);let index=0;
    const block=(nested=false)=>{
      const body=[];
      while(index<lines.length){
        const line=lines[index++];
        if(line==='done'){if(nested)return body;throw new Error('Unexpected done.');}
        if(/^while(?:\s|$)/.test(line)){
          if(nested)throw unsupported('Nested loops');
          if(!/^while\s+(true|:)$/.test(line))throw unsupported('Only while true or while : loops');
          const opening=lines[index++];if(!/^do(?:\s|$)/.test(opening??''))throw new Error('Use while true; do ...; done.');
          if(opening!=='do')lines.splice(index,0,opening.slice(2).trim());
          const contents=block(true);if(!contents.length)throw new Error('Add a command to the loop.');body.push({loop:contents});
        }else if(line==='do')throw new Error('Unexpected do.');else body.push({command:line});
      }
      if(nested)throw new Error('Close the loop with done.');return body;
    };
    return block();
  }
  const cancelled=()=>Object.assign(new Error('Virtual shell stopped.'),{cancelled:true});
  const check=job=>{if(job.stopped||disposed)throw cancelled();};
  function pause(milliseconds,job){
    check(job);return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{timers.delete(timer);job.stopped||disposed?reject(cancelled()):resolve();},milliseconds);
      timers.set(timer,{job,reject});
    });
  }
  function stop(except){
    for(const job of jobs)if(job!==except)job.stopped=true;
    for(const [timer,pending]of timers)if(pending.job!==except){clearTimeout(timer);timers.delete(timer);pending.reject(cancelled());}
  }
  const output=(job,text)=>{
    const line=String(text).replace(/\n$/,'').slice(0,6000);
    if(job.inLoop)send({type:'console',level:'log',args:[line],shell:true});
    else{job.output.push(line);if(job.output.length>100)job.output.shift();}
  };
  const help='Virtual shell API model: echo VALUE > /sys/class/gpio/export|unexport; echo in|out > gpioN/direction; echo 0|1 > gpioN/value; export GPIO_PIN=4; cat; ls; pwd; cd; sleep (0–3600 seconds); sh FILE.sh; while true; do ...; done; stop. Paths are virtual. Host commands, packages, pipes, command substitution and OS behavior are unavailable.';
  async function command(source,job){
    check(job);const tokens=words(source);if(!tokens.length)return;const redirect=tokens.findIndex(token=>token.redirect),args=tokens.slice(0,redirect<0?tokens.length:redirect).map(token=>token.word);
    if(redirect>=0){if(args[0]!=='echo'||redirect!==tokens.length-2||tokens.at(-1).redirect)throw unsupported('Only echo VALUE > PATH redirection');write(tokens.at(-1).word,args.slice(1).join(' '));return;}
    const name=args[0];
    if(name==='echo'){output(job,args.slice(1).join(' '));return;}
    if(name==='export'||/^[A-Za-z_]\w*=/.test(name)){
      const assignments=name==='export'?args.slice(1):args;
      if(!assignments.length)throw new Error('Use export NAME=value.');
      for(const assignment of assignments){const match=/^([A-Za-z_]\w*)=(.*)$/.exec(assignment);if(!match)throw new Error('Use export NAME=value.');if(match[2].length>256)throw new Error('Virtual shell variables support up to 256 characters.');variables.set(match[1],match[2]);}return;
    }
    if(name==='cat'){if(args.length<2)throw new Error('Use cat PATH.');for(const path of args.slice(1))output(job,read(path));return;}
    if(name==='ls'){if(args.length>2)throw unsupported('ls options or multiple paths');output(job,children(args[1]??cwd).join('\n'));return;}
    if(name==='pwd'){if(args.length!==1)throw unsupported('pwd arguments');output(job,cwd);return;}
    if(name==='cd'){if(args.length>2)throw unsupported('cd arguments');const next=normalize(args[1]??'/project');children(next);cwd=next;return;}
    if(name==='help'){output(job,help);return;}
    if(name==='stop'){stop(job);output(job,'Virtual shell loops stopped.');return;}
    if(name==='sleep'){
      if(args.length!==2||!/^\d+(?:\.\d+)?$/.test(args[1])||Number(args[1])>3600)throw new Error('Use sleep SECONDS, from 0 to 3600.');await pause(Number(args[1])*1000,job);return;
    }
    if(name==='sh'||name==='bash'||name.startsWith('./')){
      const path=name.startsWith('./')?name:args[1];if(!path||args.length!==(name.startsWith('./')?1:2))throw new Error('Use sh FILE.sh.');
      const target=normalize(path);if(!target.endsWith('.sh')||!projectFiles.has(target))throw new Error('Run a .sh file from the virtual project.');
      if(++job.depth>8)throw new Error('Virtual shell script nesting is limited to eight files.');try{await run(parse(projectFiles.get(target)),job);}finally{job.depth--;}return;
    }
    if(name==='true'||name===':')return;
    throw unsupported(name);
  }
  async function run(body,job){
    for(const node of body){
      check(job);
      if(node.command)await command(node.command,job);
      else{
        send({type:'console',level:'info',args:['Virtual shell loop running. Use stop or the Stop button to end it.'],shell:true});
        const wasInLoop=job.inLoop;job.inLoop=true;
        try{while(!job.stopped&&!disposed){await run(node.loop,job);await pause(16,job);}}finally{job.inLoop=wasInLoop;}
      }
    }
  }
  async function execute(source,id){
    const job={id,stopped:false,output:[],depth:0,inLoop:false};jobs.add(job);let result;
    try{check(job);await run(parse(source),job);result={type:'eval-result',id,value:job.output.join('\n')||'Done.',shell:true};}
    catch(error){result=error.cancelled?{type:'eval-result',id,value:'Virtual shell stopped.',shell:true}:{type:'eval-result',id,error:error.message||String(error),shell:true};}
    finally{jobs.delete(job);}
    send(result);return result;
  }
  return {execute,stop:()=>stop(),dispose(){disposed=true;stop();},get cwd(){return cwd;},get activeJobs(){return jobs.size;},get pendingTimers(){return timers.size;}};
}

module.exports={createShell};
