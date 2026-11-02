// Original visual router. Electrical endpoints and connection data stay unchanged.
// Rectangles are solid bodies; their clearance boundaries may carry a wire.
const EPS=1e-7;
// Equal-length routes must keep their tie order after world-coordinate shifts.
const compareCost=(a,b)=>a===b||Math.abs(a-b)<EPS?0:a-b;
const vectors={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const same=(a,b)=>Math.abs(a.x-b.x)<EPS&&Math.abs(a.y-b.y)<EPS;
const axis=(a,b)=>Math.abs(a.x-b.x)<EPS?1:0;
const inside=(p,r)=>p.x>r.left+EPS&&p.x<r.right-EPS&&p.y>r.top+EPS&&p.y<r.bottom-EPS;
const contains=(p,r)=>p.x>=r.left-EPS&&p.x<=r.right+EPS&&p.y>=r.top-EPS&&p.y<=r.bottom+EPS;
function intersects(a,b,r){
  if(same(a,b))return inside(a,r);
  if(Math.abs(a.y-b.y)<EPS)return a.y>r.top+EPS&&a.y<r.bottom-EPS&&Math.max(a.x,b.x)>r.left+EPS&&Math.min(a.x,b.x)<r.right-EPS;
  if(Math.abs(a.x-b.x)<EPS)return a.x>r.left+EPS&&a.x<r.right-EPS&&Math.max(a.y,b.y)>r.top+EPS&&Math.min(a.y,b.y)<r.bottom-EPS;
  return true;
}
function compact(points){
  const out=[];
  for(const point of points){
    const p={x:point.x,y:point.y};if(out.length&&same(out.at(-1),p))continue;
    // Retain reversals: a forced pin escape must never be erased.
    while(out.length>1){const a=out.at(-2),b=out.at(-1);if(axis(a,b)!==axis(b,p)||(b.x-a.x)*(p.x-b.x)+(b.y-a.y)*(p.y-b.y)<0)break;out.pop();}
    out.push(p);
  }
  return out;
}
function pathCost(points,bendPenalty){let cost=0,last=-1;for(let i=1;i<points.length;i++){if(same(points[i-1],points[i]))continue;const next=axis(points[i-1],points[i]);cost+=distance(points[i-1],points[i]);if(last!==-1&&next!==last)cost+=bendPenalty;last=next;}return cost;}
class Heap{
  constructor(){this.items=[];this.order=0;}
  push(value){value.order=this.order++;const a=this.items;a.push(value);let i=a.length-1;while(i){const p=(i-1)>>1;if(this.before(a[p],value))break;a[i]=a[p];i=p;}a[i]=value;}
  before(a,b){const f=compareCost(a.f,b.f),g=compareCost(a.g,b.g);return f<0||f===0&&(g>0||g===0&&a.order<b.order);}
  pop(){const a=this.items,first=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let child=i*2+1;if(child+1<a.length&&this.before(a[child+1],a[child]))child++;if(this.before(last,a[child]))break;a[i]=a[child];i=child;}a[i]=last;}return first;}
  get length(){return this.items.length;}
}

/**
 * routeWires([{id,a:{x,y,direction,partId?},b:{...}}],
 *            [{id,x,y,width,height}], options?)
 *   -> [{id,points:[{x,y}],blocked:boolean}], in connection input order.
 *
 * Directions point OUT of the endpoint's component. partId identifies its body;
 * if omitted, a containing rectangle is inferred. Inset pins receive straight
 * escape legs beyond that entire body before turning. blocked means no clear
 * route was found, including a forced escape through an overlapping body.
 *
 * A few cheap orthogonal candidates handle common circuits. Difficult routes
 * use a bounded search over rectangle edges, never a per-pixel canvas grid.
 * Outer channels follow circuit/endpoint extents by default. options.bounds
 * may supply an additional reference area; it does not clip circuit geometry.
 * No DOM, persistent cache, input mutation, or electrical simulation is used.
 */
export function routeWires(connections,obstacles=[],options={}){
  const clearance=Math.max(0,options.clearance??10),escape=Math.max(1,options.escape??14),laneGap=Math.max(0,options.laneGap??4),lanes=Math.max(1,Math.min(12,options.lanes??6));
  const bendPenalty=Math.max(0,options.bendPenalty??18),maxExpansions=Math.max(1,Math.min(20000,options.maxExpansions??4000)),margin=Math.max(1,options.margin??32);
  const bodies=obstacles.filter(r=>r&&[r.x,r.y,r.width,r.height].every(Number.isFinite)&&r.width>0&&r.height>0).map((r,bodyIndex)=>({...r,bodyIndex,left:r.x,right:r.x+r.width,top:r.y,bottom:r.y+r.height}));
  const padded=bodies.map(r=>({...r,left:r.left-clearance,right:r.right+clearance,top:r.top-clearance,bottom:r.bottom+clearance}));
  const endpoints=connections.flatMap(wire=>[wire.a,wire.b]).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y));
  const extentX=[...padded.flatMap(r=>[r.left,r.right]),...endpoints.map(p=>p.x)],extentY=[...padded.flatMap(r=>[r.top,r.bottom]),...endpoints.map(p=>p.y)];
  const left=extentX.length?Math.min(...extentX):0,top=extentY.length?Math.min(...extentY):0;
  const bounds=options.bounds??{x:left,y:top,width:extentX.length?Math.max(...extentX)-left:0,height:extentY.length?Math.max(...extentY)-top:0};
  const byId=new Map(bodies.map(r=>[r.id,r]));
  const segmentCache=new Map(),pointCache=new Map();
  const clear=(a,b)=>{if(same(a,b))return true;const first=a.x<b.x||a.x===b.x&&a.y<b.y?a:b,second=first===a?b:a,key=`${first.x},${first.y}:${second.x},${second.y}`;if(segmentCache.has(key))return segmentCache.get(key);const result=!padded.some(r=>intersects(a,b,r));segmentCache.set(key,result);return result;};
  const pointClear=p=>{const key=`${p.x},${p.y}`;if(!pointCache.has(key))pointCache.set(key,!padded.some(r=>inside(p,r)));return pointCache.get(key);};
  const isClear=points=>points.every((p,i)=>!i||clear(points[i-1],p));
  const minX=Math.min(bounds.x??0,...padded.map(r=>r.left))-margin,maxX=Math.max((bounds.x??0)+(bounds.width??1600),...padded.map(r=>r.right))+margin;
  const minY=Math.min(bounds.y??0,...padded.map(r=>r.top))-margin,maxY=Math.max((bounds.y??0)+(bounds.height??1000),...padded.map(r=>r.bottom))+margin;
  const baseX=[minX,maxX,...padded.flatMap(r=>[r.left,r.right])],baseY=[minY,maxY,...padded.flatMap(r=>[r.top,r.bottom])];
  const ordered=connections.map((wire,index)=>({wire,index})).sort((a,b)=>String(a.wire.id)<String(b.wire.id)?-1:String(a.wire.id)>String(b.wire.id)?1:a.index-b.index);
  const endpointCounts=new Map(),results=new Array(connections.length);
  function endpoint(p,rank){
    let own=p.partId===undefined?undefined:byId.get(p.partId);if(!own)own=bodies.filter(r=>contains(p,r)).sort((a,b)=>a.width*a.height-b.width*b.height)[0];
    let direction=p.direction;if(!vectors[direction]){if(own){const choices=[['up',Math.abs(p.y-own.top)],['down',Math.abs(p.y-own.bottom)],['left',Math.abs(p.x-own.left)],['right',Math.abs(p.x-own.right)]];direction=choices.sort((a,b)=>a[1]-b[1])[0][0];}else direction='right';}
    const v=vectors[direction],key=`${p.partId??own?.id??''}:${p.x},${p.y}:${direction}`,group=endpointCounts.get(key)??{seed:rank%lanes,count:0};endpointCounts.set(key,group);
    const lane=(group.seed+group.count++)%lanes;
    function escaped(offset){const q={x:p.x+v.x*(escape+offset),y:p.y+v.y*(escape+offset)};if(own){if(direction==='up')q.y=Math.min(q.y,own.top-clearance-offset);if(direction==='down')q.y=Math.max(q.y,own.bottom+clearance+offset);if(direction==='left')q.x=Math.min(q.x,own.left-clearance-offset);if(direction==='right')q.x=Math.max(q.x,own.right+clearance+offset);}return q;}
    let q=escaped(lane*laneGap);const legClear=next=>!padded.some(r=>r.bodyIndex!==own?.bodyIndex&&intersects(p,next,r));
    if(!legClear(q))q=escaped(0);
    return {point:{x:p.x,y:p.y},escape:q,direction,own,blocked:!legClear(q)};
  }
  function search(a,b){
    if(!pointClear(a.escape)||!pointClear(b.escape))return null;
    const xs=[...new Set([...baseX,a.escape.x,b.escape.x])].sort((x,y)=>x-y),ys=[...new Set([...baseY,a.escape.y,b.escape.y])].sort((x,y)=>x-y),width=xs.length;
    const start=ys.indexOf(a.escape.y)*width+xs.indexOf(a.escape.x),goal=ys.indexOf(b.escape.y)*width+xs.indexOf(b.escape.x);
    const point=node=>({x:xs[node%width],y:ys[Math.floor(node/width)]}),heap=new Heap(),costs=new Map(),previous=new Map();
    const initial=start*2+(vectors[a.direction].x?0:1);costs.set(initial,0);heap.push({state:initial,g:0,f:distance(a.escape,b.escape)});
    let expanded=0;
    while(heap.length&&expanded++<maxExpansions){
      const current=heap.pop();if(current.g!==costs.get(current.state))continue;const node=Math.floor(current.state/2),lastAxis=current.state%2;
      if(node===goal){const path=[];for(let state=current.state;state!==undefined;state=previous.get(state))path.push(point(Math.floor(state/2)));return path.reverse();}
      const x=node%width,y=Math.floor(node/width),here=point(node);
      for(const [dx,dy,nextAxis]of [[-1,0,0],[1,0,0],[0,-1,1],[0,1,1]]){
        const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=ys.length)continue;const nextNode=ny*width+nx,next=point(nextNode);if(!pointClear(next)||!clear(here,next))continue;
        const state=nextNode*2+nextAxis,g=current.g+distance(here,next)+(nextAxis===lastAxis?0:bendPenalty);
        if(compareCost(g,costs.get(state)??Infinity)>=0)continue;costs.set(state,g);previous.set(state,current.state);heap.push({state,g,f:g+distance(next,b.escape)});
      }
    }
    return null;
  }
  for(let rank=0;rank<ordered.length;rank++){
    const {wire,index}=ordered[rank];
    if(!wire.a||!wire.b||![wire.a.x,wire.a.y,wire.b.x,wire.b.y].every(Number.isFinite)){results[index]={id:wire.id,points:[],blocked:true};continue;}
    const a=endpoint(wire.a,rank),b=endpoint(wire.b,rank),start=a.escape,end=b.escape;
    const candidates=[[start,{x:end.x,y:start.y},end],[start,{x:start.x,y:end.y},end]];
    const channels=(values,p,q)=>[...new Set(values)].sort((x,y)=>compareCost(Math.abs(x-p)+Math.abs(x-q),Math.abs(y-p)+Math.abs(y-q))||x-y).slice(0,24);
    for(const x of channels([...baseX,start.x,end.x],start.x,end.x))candidates.push([start,{x,y:start.y},{x,y:end.y},end]);
    for(const y of channels([...baseY,start.y,end.y],start.y,end.y))candidates.push([start,{x:start.x,y},{x:end.x,y},end]);
    // Outer channels keep sparse long detours available even in crowded scenes.
    for(const x of [minX,maxX])candidates.push([start,{x,y:start.y},{x,y:end.y},end]);
    for(const y of [minY,maxY])candidates.push([start,{x:start.x,y},{x:end.x,y},end]);
    const orderedCandidates=candidates.map(compact).sort((p,q)=>compareCost(pathCost([a.point,...p,b.point],bendPenalty),pathCost([a.point,...q,b.point],bendPenalty)));
    let middle=orderedCandidates.find(isClear),blocked=a.blocked||b.blocked;
    if(!middle)middle=search(a,b);
    if(!middle){blocked=true;middle=orderedCandidates.map(points=>({points,hits:points.reduce((n,p,i)=>n+(i?padded.filter(r=>intersects(points[i-1],p,r)).length:0),0)})).sort((p,q)=>p.hits-q.hits)[0]?.points??[start,{x:end.x,y:start.y},end];}
    // Keep explicit escape vertices even along a straight continuation. The UI
    // uses these two vertices to keep selection targets away from pin buttons.
    results[index]={id:wire.id,points:[a.point,...compact(middle),b.point],blocked};
    // Educational layouts sometimes leave less than two normal clearances
    // between parts. Retry only a failed wire with a smaller safe gap, then
    // exact body boundaries. Both retries still avoid physical interiors.
    if(blocked&&clearance>0&&options.tightPassages!==false){
      for(const gap of [...new Set([Math.min(4,clearance/2),0])]){
        const retry=routeWires([wire],obstacles,{...options,clearance:gap,escape:Math.min(escape,Math.max(2,gap)),laneGap:0,tightPassages:false})[0];
        if(!retry.blocked){results[index]=retry;break;}
      }
    }
  }
  return results;
}
