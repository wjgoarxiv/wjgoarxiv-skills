export default({T,add,nz,beat,hum,boom,kick,G,stab,snare,rnd2})=>{
// one stone on a board: a hard tap with a short wooden body, at any pitch
const tap=(t,f=1,g=.8)=>{let lp=0;add(t,.16,u=>{const n=nz();lp+=(n-lp)*.6;return g*((n-lp)*Math.exp(-u*260)+.8*Math.sin(2*Math.PI*520*f*u)*Math.exp(-u*70)+.5*Math.sin(2*Math.PI*1290*f*u)*Math.exp(-u*110)+.35*Math.sin(2*Math.PI*170*f*u)*Math.exp(-u*38))})};
const pour=(t,d,n,g)=>{for(let i=0;i<n;i++)tap(t+d*Math.pow((i+rnd2(i))/n,.8),.9+rnd2(i+50)*1.1,g*(.4+.6*rnd2(i+9)))};
return{
stone(){hum(T(0),beat,.015);tap(T(1)-.015,1,1.3);boom(T(1));kick(T(1),1);for(let i=0;i<6;i++)tap(T(1)+.12+i*.045*Math.pow(.88,i),1.7,.4*Math.pow(.75,i))},
board(){for(const q of[0,.5,1,1.5])tap(T(q),[1,.84,1.12,.75][q*2],1.0);boom(T(0));hum(T(0),2*beat,.02);add(T(0),2*beat,u=>.05*Math.sin(2*Math.PI*65*u)*Math.min(1,u*4))},
bowl(){kick(T(0),.9);pour(T(0)+.02,2*beat-.1,64,.62);boom(T(1));stab(T(1),49,.4,.26)},
grid19(){const n=24;for(let i=0;i<n;i++)tap(T(0)+.43*Math.pow(i/n,1/1.5),.8+i*.03,.75);kick(T(0),1);kick(T(1)+.03,1.1);boom(T(1)+.03);pour(T(1)+.03,.22,40,.5);G(1.1,.1,82,.2);for(let i=0;i<4;i++)snare(T(1)+.27+i*.033,.4)},
ladder(){let a=0;for(let i=0;i<35;i++){tap(T(0)+a/60,i%2?.8:1.12+i*.012,.95);if(i<4)kick(T(0)+a/60,.8);a+=[8,4,2,2][i]||1}for(let q=1;q<2;q+=.25)kick(T(q),.75);snare(T(1.75),.6)},
capture(){for(let i=0;i<20;i++)tap(T(0)+.46*Math.pow(i/20,1/.8),1+i*.02,.8);kick(T(0),.9);const t=T(1)+.2;tap(t,.7,1.5);boom(t);kick(t,1.2);snare(t,.8);stab(t,36.7,.4,.44);G(1.5,.14,73,.3);pour(t+.03,.16,24,.5)}
}};
