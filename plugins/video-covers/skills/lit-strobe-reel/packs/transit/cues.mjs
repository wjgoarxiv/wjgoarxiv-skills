const CHIME=[784,622,523];
export default({T,add,nz,beat,hum,click,boom,kick,G,tick,stab,snare,gate,ten,hat})=>{
const rail=(t,g=.5)=>{for(const d of[0,.075]){click(t+d,g);add(t+d,.16,u=>g*.5*Math.sin(2*Math.PI*(120-200*u)*u)*Math.exp(-u*26))}};
const rattle=(t,d,hz,g)=>{for(let i=0;i<d*hz;i++)click(t+i/hz,g*(.5+.5*((i*7)%3)/2))};
const chime=(t,g=.16)=>CHIME.forEach((f,i)=>add(t+i*.11,.5,u=>g*(Math.sin(2*Math.PI*f*u)+.35*Math.sin(2*Math.PI*f*2.01*u))*Math.exp(-u*6)));
const hiss=(t,d,g)=>{let lp=0;add(t,d,u=>{const n=nz();lp+=(n-lp)*.55;return g*(n-lp)*Math.sin(Math.PI*Math.min(1,u/d))})};
return{
flap(){rattle(T(0),.36,44,.34);hum(T(0),beat,.03);click(T(1),1);kick(T(1),1.1);stab(T(1),65.4,.3,.3);G(1,.1,98,.2)},
gate(){for(let i=0;i<7;i++)click(T(0)+.06+i*.045,.4);hum(T(0),beat,.03);click(T(1)-.02,1.1);boom(T(1));kick(T(1),1.1);rail(T(1)+.2,.5);tick(T(1)+.05,1760,.22)},
doors(){chime(T(0),.17);hiss(T(0)+.2,.5,.4);boom(T(1));kick(T(1),1);stab(T(1),49,.4,.34);hiss(T(1),.3,.25)},
flapwall(){rattle(T(0),.62,60,.22);for(let i=0;i<12;i++){click(T(0)+(8+i*2)/60,.5);if(i%3===0)kick(T(0)+(8+i*2)/60,.7)}for(let j=0;j<3;j++){kick(T(1)+j*8/60,.95);G(1+j/3,.1,[82,98,131][j],.22);snare(T(1)+j*8/60,.3)}rattle(T(1)+.33,.07,60,.5)},
linemap(){for(let i=0;i<10;i++){tick(T(0)+i*i*.0042,900+i*90,.2);hat(T(0)+i*.04,.12)}rail(T(0),.5);rail(T(.5),.4);kick(T(1)+.03,1.1);boom(T(1)+.03);chime(T(1)+.03,.12);stab(T(1)+.03,55,.4,.34);hiss(T(1)+.3,.1,.5)},
tunnel(){let a=0;for(let i=0;i<14&&a<.8;i++){rail(T(0)+a,.7);kick(T(0)+a,.55);a+=.16*Math.pow(.86,i)}ten(T(0),2*beat-.06);gate(T(1),beat-.06,30,82,.2);for(let i=0;i<9;i++)snare(T(1)+i*.04,.22)}
}};
