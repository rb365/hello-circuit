const EventEmitter = require('events');
const path = require('path');

function createHost(process, send, stop) {
  const context = Object.create(null);
  const stdin = new EventEmitter();
  for (const method of ['resume','pause','setEncoding','setRawMode']) stdin[method] = () => stdin;
  process.stdin = stdin;
  process.stdout = {write:value => send({type:'console',level:'log',args:[String(value)]})};
  process.stderr = {write:value => send({type:'console',level:'error',args:[String(value)]})};
  process.argv = ['browser-node','/index.js'];
  process.cwd = () => '/';
  process.exit = code => {send({type:'status',status:'stopped',message:`Program exited (${code || 0})`});stop();};

  class BrowserRepl extends EventEmitter {
    constructor(board) {super();this.context=context;context.board=board;this.ready=false;}
    initialize(callback) {this.ready=true;this.emit('ready');callback();}
    inject(values) {Object.assign(context,values);send({type:'repl-context',keys:Object.keys(context).filter(key=>!key.startsWith('__'))});return this;}
  }
  const format = value => {
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
    if (value instanceof Error) return value.message;
    try {return JSON.stringify(value);} catch {return String(value);}
  };
  return {
    BrowserRepl,
    context,
    stdin,
    async evaluate(code,id) {
      try {
        const result = new Function('scope','code','with(scope) { return eval(code); }')(context,code);
        send({type:'eval-result',id,value:format(await result)});
      } catch(error) {send({type:'eval-result',id,error:error.message});}
    },
    keyboard(message) {stdin.emit('keypress',message.character || '',message.key || {name:message.name});},
    modules({five,files={},fixtures={},entry='/index.js',additionalModules={},globals={},resolveModule}) {
      entry=path.resolve('/',entry);
      const sources=new Map(Object.entries(files).map(([name,source])=>[path.resolve('/',name),source]));
      const cache=new Map();
      const request=(url,options,callback) => {
        if(typeof options==='function') {callback=options;options={};}
        options=options||{};
        const urlString=typeof url==='object'?url.url:url;
        const controller=new AbortController();
        const isWeather=/api\.darksky\.net\/forecast\//.test(urlString);
        if(isWeather&&fixtures.weather) {
          send({type:'network',mode:'fixture',url:urlString});
          setTimeout(()=>callback(null,{statusCode:200,headers:{'content-type':'application/json'}},options.json?fixtures.weather:JSON.stringify(fixtures.weather)),0);
        } else {
          send({type:'network',mode:'fetch',url:urlString});
          fetch(urlString,{signal:controller.signal,method:options.method||'GET'}).then(async response=>{
            const body=options.json?await response.json():await response.text();
            callback(null,{statusCode:response.status,headers:Object.fromEntries(response.headers)},body);
          }).catch(error=>callback(error));
        }
        return {abort:()=>controller.abort()};
      };
      request.get=request;
      const builtins={
        'johnny-five':five,
        events:EventEmitter,
        util:require('util'),
        path,
        process,
        buffer:require('buffer'),
        request,
        keypress:stream=>{stream.isTTY=true;return stream;}
      };
      Object.assign(builtins,additionalModules);
      const globalNames=Object.keys(globals),globalValues=Object.values(globals);
      function executeSource(filename,source,module){
        new Function('require','module','exports','__filename','__dirname','process','Buffer',...globalNames,source)(
          name=>requireFrom(filename,name),module,module.exports,filename,path.dirname(filename),process,require('buffer').Buffer,...globalValues);
      }
      function requireFrom(base,name) {
        if(name in builtins)return builtins[name];
        if(!name.startsWith('.')&&!name.startsWith('/')) {
          if(resolveModule)return resolveModule(name);
          throw new Error(`Module "${name}" is unavailable in the browser Arduino runtime.`);
        }
        let filename=path.resolve(path.dirname(base),name);
        if(!sources.has(filename))filename=[filename+'.js',filename+'.json',path.join(filename,'index.js')].find(name=>sources.has(name))||filename;
        if(!sources.has(filename))throw new Error(`Project file "${name}" is missing. Add it to the project files.`);
        if(cache.has(filename))return cache.get(filename).exports;
        const module={exports:{}};cache.set(filename,module);
        if(filename.endsWith('.json'))module.exports=JSON.parse(sources.get(filename));
        else executeSource(filename,sources.get(filename),module);
        return module.exports;
      }
      const localRequire=name=>requireFrom(entry,name);
      context.require=localRequire;context.process=process;Object.assign(context,globals);
      return {require:localRequire,execute(code) {
        const module={exports:{}};
        executeSource(entry,code??sources.get(entry)??'',module);
      }};
    }
  };
}

module.exports={createHost};
