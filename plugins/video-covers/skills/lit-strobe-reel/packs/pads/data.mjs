// a pad grid, a speaker cone and a hi-hat. film.json carries the pattern: three rows of sixteen steps, x or a dot.
export function check(cfg){const p=cfg.pattern;if(!Array.isArray(p)||p.length!==3)return'"pattern" needs three rows, one per word';for(const[i,r]of p.entries())if(!/^[x.]{16}$/.test(r))return`"pattern" row ${i+1} needs sixteen steps of x or a dot, got ${[...String(r)].length}`;if(p.every(r=>!r.includes('x')))return'"pattern" has no step set'}
export const steps=cfg=>cfg.pattern.map(r=>[...r].map(q=>q==='x'?1:0));
export default cfg=>({
 blocks:{pad:2,cone:2,cymbal:2,seq16:4,solo:2,scope:2},
 shots:{pad:24,cone:24,cymbal:24},
 marks:['disc','diamond','cross'],
 dither:[['pad',3],['cone',12],['cymbal',11],['pad',12],['cone',16],['cymbal',4],['pad',0],['cone',13]],
 hand:{x:1420,y:508},
 steps:steps(cfg),shot:{steps:steps(cfg)},
});
