export default({T,add,nz,SR,sat,beat,hum,click,boom,kick,G,tick,stab,snare,hat,gate,slash,ten})=>{
const clunk=(t,g=1)=>{click(t,g);add(t,.22,u=>g*.55*Math.sin(2*Math.PI*(95-120*u)*u)*Math.exp(-u*18));click(t+.028,g*.5)};
const motor=(t,d,f0,f1,g)=>{let ph=0;add(t,d,u=>{const k=Math.min(1,u/d);ph+=2*Math.PI*(f0+(f1-f0)*k*k)/SR;return g*sat(Math.sin(ph)+.5*Math.sin(ph*2.02)+.2*nz(),1.4)*Math.min(1,u*20)*Math.min(1,(d-u)*30)})};
const stop=(t,d,f,g=.3)=>motor(t,d,f,f*.08,g);
const hiss=(t,d,g,dir=1)=>{let lp=0;add(t,d,u=>{const n=nz();lp+=(n-lp)*.7;const k=u/d;return g*(n-lp)*(dir>0?k:1-k)})};
return{
deck(){hum(T(0),beat,.04);hiss(T(0),beat,.10);clunk(T(1)-.02,1.2);kick(T(1),1.1);boom(T(1));motor(T(1)+.04,.32,40,180,.16);tick(T(1),880,.3)},
reel(){motor(T(0),2*beat-.02,90,210,.15);for(let i=0;i<8;i++){tick(T(i/4),i%2?640:980,.14);hat(T(i/4),.2,.03)}for(const q of[0,.5,1,1.5])kick(T(q),.95);stab(T(0),55,.3,.28);stab(T(1),65.4,.3,.28)},
needle(){ten(T(0),beat-.02);for(let i=0;i<8;i++)tick(T(i/8),400+i*180,.12);kick(T(1),1.2);boom(T(1));snare(T(1),.9);gate(T(1),.16,30,73,.34);stab(T(1),36.7,.5,.42)},
wave(){for(let i=0;i<4;i++){kick(T(i/4),i%2?.75:1.1);hat(T(i/4+.125),.2)}gate(T(0),.2,60,55,.3);for(let i=0;i<12;i++)tick(T(1)+i*.026,300+i*140,.2);slash(T(1));kick(T(1),1.1);snare(T(1.5),.7);G(1.5,.14,82,.24);hiss(T(1),beat,.2)},
splice(){motor(T(0),beat,120,240,.16);for(let i=0;i<8;i++)hat(T(i/8),.16);for(let i=0;i<3;i++){const t=T(1)+i*.1;slash(t);click(t,.9);stop(t,.11,300,.34);clunk(t+.15,.8);kick(t+.15,.9)}},
wipe(){stop(T(0),.3,420,.4);kick(T(0),1.1);hiss(T(0)+.06,2*beat-.16,.55,-1);hiss(T(0),beat,.25);for(let i=0;i<16;i++)click(T(0)+.1+i*.042,.16*(1-i/20));motor(T(1),beat*.9,160,30,.14)}
}};
