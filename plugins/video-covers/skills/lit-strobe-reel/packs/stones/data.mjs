// a stone, a board and a bowl. The positions are invented and played through the rules below.
export const SIZE=19,key=(a,b)=>a+','+b;
const around=(a,b)=>[[a+1,b],[a-1,b],[a,b+1],[a,b-1]].filter(([c,d])=>c>=0&&d>=0&&c<SIZE&&d<SIZE);
/** the group of a stone and its liberties, on a Map of "x,y" -> "B" or "W" */
export function group(pos,a,b){const col=pos.get(key(a,b)),seen=new Set([key(a,b)]),lib=new Set(),todo=[[a,b]];while(todo.length)for(const[c,d]of around(...todo.pop())){const k=key(c,d),v=pos.get(k);if(!v)lib.add(k);else if(v===col&&!seen.has(k)){seen.add(k);todo.push([c,d])}}return{stones:[...seen],liberties:lib.size}}
/** plays one stone, removes what it captures and returns the captured points; an illegal move throws */
export function play(pos,[col,a,b]){if(a<0||b<0||a>=SIZE||b>=SIZE||pos.has(key(a,b)))throw new Error(`illegal move ${col} ${a},${b}`);pos.set(key(a,b),col);const out=[];for(const[c,d]of around(a,b))if(pos.has(key(c,d))&&pos.get(key(c,d))!==col){const g=group(pos,c,d);if(!g.liberties)for(const k of g.stones){pos.delete(k);out.push(k)}}if(!group(pos,a,b).liberties)throw new Error(`suicide ${col} ${a},${b}`);return out}
export const start=set=>{const pos=new Map();for(const m of set)play(pos,m);return pos};
/** a ladder: White ataris, Black extends, down the diagonal to the corner, where the last stone takes the chain */
export function ladder(x0=9,y0=9){const set=[['B',x0,y0],['W',x0-1,y0],['W',x0,y0-1],['W',x0+1,y0-1]],moves=[];let a=x0,b=y0,right=true;for(;;){moves.push(['W',...(right?[a,b+1]:[a+1,b])]);right?a++:b++;moves.push(['B',a,b]);right=!right;if(a===SIZE-1&&!right){moves.push(['W',a,b+1]);return{set,moves}}}}
/** a diamond of 41 black stones that White closes with twenty stones, while Black answers outside */
export function capture(m=9){const ring=r=>{const p=[];for(let t=0;t<4*r;t++){const s=Math.floor(t/r),q=t%r;p.push(s===0?[m+q,m-r+q]:s===1?[m+r-q,m+q]:s===2?[m-q,m+r-q]:[m-r+q,m-q])}return p},set=[];for(let d=-4;d<=4;d++)for(let e=-4;e<=4;e++)if(Math.abs(d)+Math.abs(e)<=4)set.push(['B',m+d,m+e]);const w=ring(5),o=ring(8),moves=[];w.forEach((p,i)=>{moves.push(['W',...p]);if(i<w.length-1){const q=o[(Math.round(i*o.length/w.length)+2)%o.length];moves.push(['B',...q])}});return{set,moves}}
const walk=({set,moves})=>{const pos=start(set);return moves.map(m=>({m,out:play(pos,m)}))};
export default()=>{const l=ladder(),c=capture();return{
 blocks:{stone:2,board:2,bowl:2,grid19:2,ladder:2,capture:2},
 shots:{stone:24,board:24,bowl:24},
 marks:['solid','open','taken'],
 mono:true,
 dither:[['stone',12],['board',6],['bowl',14],['board',20],['stone',20],['bowl',6],['board',12],['stone',5]],
 hand:{x:1420,y:508},
 ladder:{set:l.set,steps:walk(l)},capture:{set:c.set,steps:walk(c)},
 shot:{stones:[...start([...c.set,...c.moves.slice(0,-1)])].map(([k,v])=>[v,...k.split(',').map(Number)])}}};
