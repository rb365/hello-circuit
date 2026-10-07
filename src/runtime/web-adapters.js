// Selected Express/HTTP/Socket.IO APIs for the book's weather dashboard.
// This original in-memory bridge opens no network socket or native server.
const EventEmitter=require('events');
const path=require('path');

function createWebModules({send,files={},assets={},platform='uno'}){
  const sources=new Map(Object.entries(files).map(([name,source])=>[path.resolve('/',name),source]));
  const servers=new Set();
  function express(){
    const app=()=>{throw new Error('Native HTTP requests are unavailable in the browser preview bridge.');};
    app.staticDirectories=[];
    app.use=middleware=>{if(!middleware?.staticDirectory)throw new Error('Only express.static project files are supported in the browser preview.');app.staticDirectories.push(middleware.staticDirectory);return app;};
    for(const method of ['get','post','put','delete','listen'])app[method]=()=>{throw new Error(`express.${method} is outside the selected static weather preview APIs.`);};
    return app;
  }
  express.static=directory=>({staticDirectory:path.resolve('/',directory)});
  const clientScript=`(()=>{
    const clients=new Map(),puckConnections=new Map(),rawConnections=new Map();
    window.io=()=>{
      const clientId='preview-'+Math.random().toString(36).slice(2),listeners=new Map();
      const client={on(event,callback){if(!listeners.has(event))listeners.set(event,[]);listeners.get(event).push(callback);return client;},emit(event,...args){parent.postMessage({type:'lab-web-client',action:'event',clientId,event,args},'*');return client;},disconnect(){parent.postMessage({type:'lab-web-client',action:'disconnect',clientId},'*');clients.delete(clientId);}};
      clients.set(clientId,listeners);parent.postMessage({type:'lab-web-client',action:'connect',clientId},'*');return client;
    };
    window.WebSocket=class {
      constructor(url){this.clientId='raw-'+Math.random().toString(36).slice(2);this.readyState=1;rawConnections.set(this.clientId,this);parent.postMessage({type:'lab-web-client',action:'raw-connect',clientId:this.clientId,port:Number(new URL(url).port)||80},'*');}
      send(data){parent.postMessage({type:'lab-web-client',action:'raw-event',clientId:this.clientId,args:[data]},'*');}
      close(){this.readyState=3;parent.postMessage({type:'lab-web-client',action:'disconnect',clientId:this.clientId},'*');rawConnections.delete(this.clientId);}
      addEventListener(event,callback){this['on'+event]=callback;}
    };
    let defaultPuck;
    const connectPuck=callback=>{
      const clientId='puck-'+Math.random().toString(36).slice(2),listeners=new Map(),pending=new Map();let requestNumber=0;
      const connection={on(event,fn){if(!listeners.has(event))listeners.set(event,[]);listeners.get(event).push(fn);return connection;},write(code,done){const requestId=++requestNumber;pending.set(requestId,done);parent.postMessage({type:'lab-web-client',action:'puck-write',clientId,requestId,code},'*');},close(){parent.postMessage({type:'lab-web-client',action:'disconnect',clientId},'*');puckConnections.delete(clientId);}};
      puckConnections.set(clientId,{connection,listeners,pending,callback});parent.postMessage({type:'lab-web-client',action:'puck-connect',clientId},'*');return connection;
    };
    window.Puck={connect:connectPuck,write(code,done){if(!defaultPuck)defaultPuck=connectPuck(()=>{});defaultPuck.write(code,done);}};
    if(${JSON.stringify(platform)}==='puck')Object.defineProperty(navigator,'bluetooth',{value:{virtual:true},configurable:true});
    addEventListener('message',event=>{
      if(event.source!==parent||event.data?.type!=='web-socket')return;const message=event.data;
      for(const callback of clients.get(message.clientId)?.get(message.event)||[])callback(...message.args);
      const raw=rawConnections.get(message.clientId);if(raw&&message.event==='message')raw.onmessage?.(...message.args);
      const puck=puckConnections.get(message.clientId);if(puck){
        if(message.event==='connected')puck.callback?.(puck.connection);
        else if(message.event==='write-complete'){const requestId=message.args[0];puck.pending.get(requestId)?.();puck.pending.delete(requestId);}
        else for(const callback of puck.listeners.get(message.event)||[])callback(...message.args);
      }
    });
  })();`;
  function renderHTML(html,directory='/'){
    html=html.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,(tag,src)=>{
      if(src==='/socket.io/socket.io.js'||src==='https://www.puck-js.com/puck.js')return '';
      const source=sources.get(path.resolve(directory,src));if(source===undefined)return tag;
      const inlined=source.replace(/(['"])(\/[^'"]+)\1/g,(literal,quote,url)=>{
        const asset=assets[url]||assets[path.join(directory,url.replace(/^\/+/,''))];
        return asset?quote+`data:${asset.mimeType};base64,${asset.base64}`+quote:literal;
      });
      return `<script>${inlined.replace(/<\/script/gi,'<\\/script')}</script>`;
    });
    html=html.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi,(tag,href)=>{
      const source=sources.get(path.resolve(directory,href));
      return source===undefined?tag:`<style>${source.replace(/<\/style/gi,'<\\/style')}</style>`;
    });
    return /<head\b[^>]*>/i.test(html)?html.replace(/<head\b[^>]*>/i,tag=>tag+`<script>${clientScript}</script>`):`<script>${clientScript}</script>`+html;
  }
  function preview(app){
    const directory=app.staticDirectories[0];
    if(!directory)throw new Error('The browser preview requires express.static with project HTML files.');
    const html=sources.get(path.join(directory,'index.html'));
    if(html===undefined)throw new Error(`Project file ${path.join(directory,'index.html')} is missing.`);
    return renderHTML(html,directory);
  }
  class Server extends EventEmitter{
    constructor(app){super();this.app=app;this.clients=new Map();servers.add(this);}
    listen(port,callback){this.port=Number(port);send({type:'web-preview',html:preview(this.app),port:this.port,mode:'in-memory-api',message:'Browser preview of selected server APIs; no TCP listener is opened.'});callback?.();return this;}
    close(callback){for(const client of this.clients.values())client.emit('disconnect');this.clients.clear();servers.delete(this);callback?.();return this;}
  }
  class SocketIO extends EventEmitter{
    constructor(server){super();if(!(server instanceof Server))throw new Error('Socket.IO preview requires its in-memory HTTP Server.');this.server=server;server.socketIO=this;}
  }
  class Client extends EventEmitter{
    constructor(id){super();this.id=id;this.connected=true;}
    emit(event,...args){send({type:'web-socket',clientId:this.id,event,args});return true;}
    receive(event,args){return super.emit(event,...args);}
  }
  return {
    renderHTML,
    modules:{express,http:{Server,createServer:app=>new Server(app),request(){throw new Error('Native HTTP requests are unavailable; use browser fetch. This adapter supports the selected static preview Server.');},get(){throw new Error('Native HTTP requests are unavailable; use browser fetch.');}},'socket.io':SocketIO,os:{networkInterfaces:()=>({wlan0:[{address:'browser-preview'}],eth0:[{address:'browser-preview'}]})}},
    handle(message){
      for(const server of servers){
        if(!server.socketIO)continue;
        if(message.action==='connect'){
          const client=new Client(message.clientId);server.clients.set(message.clientId,client);server.socketIO.emit('connection',client);
        }else if(message.action==='disconnect'){
          const client=server.clients.get(message.clientId);if(client){client.connected=false;client.receive('disconnect',[]);server.clients.delete(message.clientId);}
        }else if(message.action==='event')server.clients.get(message.clientId)?.receive(message.event,message.args||[]);
      }
    }
  };
}
module.exports={createWebModules};
