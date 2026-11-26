// a split-flap row, a turnstile and a pair of sliding doors
export default cfg=>{
 const stops=cfg.acts.flatMap(a=>a.blocks);
 // an invented route: runs of stops on a grid that only turns by 45 degrees
 const pts=[];const turn=[0,1,1,1,0,-1,-1,-1,-1,0,1,1,1,1,-1,-1,0,0,1,0,0,0,0,0],sx=Math.min(100,1500/Math.max(1,stops.length-1));let px=150+(1500-sx*(stops.length-1))/2,py=720;
 stops.forEach((s,i)=>{pts.push([Math.round(px),Math.round(py)]);px+=sx;py-=turn[i%turn.length]*sx});
 return{
  blocks:{flap:2,gate:2,doors:2,flapwall:2,linemap:2,tunnel:2},
  shots:{flap:24,gate:24,doors:24},
  marks:['arrow','rails','door'],
  dither:[['flap',12],['gate',6],['doors',18],['flap',22],['gate',20],['doors',12],['flap',4],['gate',14]],
  hand:{x:1420,y:508},
  stops,names:cfg.acts.flatMap(a=>a.blocks.map((b,i)=>i?'':a.label)),route:pts};
};
