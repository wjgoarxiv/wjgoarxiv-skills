import { steps } from "./data.mjs";
export default({T,CFG,beat,hum,boom,kick,G,tick,stab,snare,hat,add,nz,gate,ten,ring})=>{
// the pattern plays from here alone: step i of a block is i/4 beats in
const P=steps(CFG),VOICE=[t=>kick(t,1.1),t=>snare(t,1.15),t=>hat(t,.5,.05)];
const bar=(b,n,from=0)=>{for(let i=0;i<n;i++)VOICE.forEach((v,j)=>{if(P[j][from+i])v(T(b+i/4))})};
return{
seq16(){bar(0,16)},
solo(){bar(0,8)},
pad(){bar(0,8);hum(T(0),2*beat,.02)},
cone(){ten(T(0),beat-.04);snare(T(1),1.2);kick(T(1),1.2);boom(T(1));stab(T(1),41.2,.4,.4);for(let i=0;i<14;i++)tick(T(1)+.1+i*.018,3200-i*130,.10)},
cymbal(){for(let i=0;i<4;i++)if(P[2][i])hat(T(i/4),.35,.05);add(T(0)+.2,beat-.2,u=>.16*nz()*Math.min(1,u*5));hat(T(1),.8,.07);ring(T(1),.13);add(T(1),.5,u=>.10*(Math.sin(2*Math.PI*3517*u)+Math.sin(2*Math.PI*5237*u)+Math.sin(2*Math.PI*7741*u))*Math.exp(-u*9));kick(T(1),.8);G(1.5,.1,196,.2)},
scope(){const n=[55,55,65.4,82.4,98,82.4,110,131];n.forEach((f,i)=>gate(T(i/4),.07,60,f,.28));for(const q of[0,.75,1.5])kick(T(q),1);snare(T(1),1);hat(T(.5),.4);hat(T(1.75),.4)}
}};
