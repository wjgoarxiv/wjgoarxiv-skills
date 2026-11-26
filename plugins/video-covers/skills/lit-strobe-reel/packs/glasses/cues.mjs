// the room's own sound: take() keeps the day's sound whole; the reel blocks hit only on the cuts the story makes
export default({SR,T,add,nz,kick,boom,tick,click,hum})=>{
const S=(a,b,v)=>{v=Math.min(1,Math.max(0,(v-a)/(b-a)));return v*v*(3-2*v)};
const fridge=(t,d,g)=>{let a=0;add(t,d,u=>{a+=(nz()-a)*.004;return g*(.5*Math.sin(2*Math.PI*50*u)+.35*Math.sin(2*Math.PI*100*u+1)+3*a)*Math.min(1,u*4)*Math.min(1,(d-u)*4)})};
const bird=(t,g,f=3200,n=3)=>{for(let i=0;i<n;i++)add(t+i*.16,.13,u=>g*Math.sin(2*Math.PI*(f+900*Math.sin(u*38))*u+2*Math.sin(u*90))*Math.sin(Math.PI*u/.13)**2)};
const clink=(t,g)=>{add(t,1.4,u=>g*(Math.sin(2*Math.PI*2870*u)*Math.exp(-u*6)+.6*Math.sin(2*Math.PI*4410*u)*Math.exp(-u*10)+.3*Math.sin(2*Math.PI*6650*u)*Math.exp(-u*16)+nz()*Math.exp(-u*300)))};
const cicada=(t,d,g)=>add(t,d,u=>{const n=nz();return g*n*(.55+.45*Math.sin(2*Math.PI*95*u))*Math.sin(2*Math.PI*4600*u+n*.3)*Math.min(1,u)*Math.min(1,(d-u)*2)});
const cricket=(t,d,g)=>add(t,d,u=>{const c=(u*3.2)%1<.35?1:0;return g*c*Math.sin(2*Math.PI*4300*u)*(.5+.5*Math.sin(2*Math.PI*30*u))*Math.min(1,u)});
const car=(t,d,g)=>{let a=0,b=0;add(t,d,u=>{a+=(nz()-a)*.06;b+=(a-b)*.1;const k=Math.exp(-Math.pow((u-d*.4)/(d*.22),2));return g*k*(b*5+.08*Math.sin(2*Math.PI*(95-30*Math.tanh((u-d*.4)*3))*u))})};
const drip=(t,g)=>add(t,.25,u=>g*Math.sin(2*Math.PI*(1100+1400*Math.exp(-u*40))*u)*Math.exp(-u*28));
return{
two(){fridge(T(0),3.3,.05);for(let b=0;b<8;b++){kick(T(b),.55);tick(T(b),1400,.12)}bird(T(2)+.1,.03,2900,2);bird(T(5)+.2,.035,3400,3)},
wait(){fridge(T(0),4.9,.04);for(let i=0;i<12;i++){const f=250*Math.pow(i/12,1/.62);click(T(0)+f/60,.35+.02*i)}for(let i=0;i<10;i++)bird(T(0)+.3+i*.45,.025,2600+((i*.71)%1)*1800,2);for(let i=0;i<12;i++)tick(T(11)+i*.033,2400-i*100,.14)},
clink(){clink(T(0)+8/60,.5);boom(T(0)+8/60);for(const k of[0,1,2])tick(T(0)+(10+k*8)/60,1800,.25);drip(T(1)+.6,.1)},
glasses(){cicada(T(0),4.8,.025);fridge(T(0),4.8,.04);drip(T(3)+.2,.08);drip(T(7)+.4,.06);kick(T(0),.7)},
night(){fridge(T(0),1.6,.045);cricket(T(0),1.6,.03)},
light(){car(T(0)-.2,1.7,.55);boom(T(0)+26/60);fridge(T(0),1.6,.04)},
take(){
const S=(a,b,v)=>{v=Math.min(1,Math.max(0,(v-a)/(b-a)));return v*v*(3-2*v)},bell=(u,a,b,c,d)=>S(a,b,u)*(1-S(c,d,u));
const fridge=(t,d,g)=>{let a=0;add(t,d,u=>{a+=(nz()-a)*.004;return g(u)*(.5*Math.sin(2*Math.PI*50*u)+.35*Math.sin(2*Math.PI*100*u+1)+.12*Math.sin(2*Math.PI*150*u)+3*a)*(1+.1*Math.sin(u*.7))})};
const bird=(t,g,f=3200,n=3)=>{for(let i=0;i<n;i++){const s=t+i*.16;add(s,.13,u=>g*Math.sin(2*Math.PI*(f+900*Math.sin(u*38))*u+2*Math.sin(u*90))*Math.sin(Math.PI*u/.13)**2)}};
const air=(t,d,g)=>{let a=0,b=0;add(t,d,u=>{a+=(nz()-a)*.02;b+=(a-b)*.02;return g(u)*b*4})};
const bus=(t,d,g)=>{let a=0;add(t,d,u=>{a+=(nz()-a)*.01;const k=Math.sin(Math.PI*u/d)**2;return g*k*(a*3+.3*Math.sin(2*Math.PI*(62-8*u/d)*u))})};
const cicada=(t,d,g)=>add(t,d,u=>{const n=nz();return g(u)*n*(.55+.45*Math.sin(2*Math.PI*95*u))*(.6+.4*Math.sin(u*1.7))*Math.sin(2*Math.PI*4600*u+n*.3)});
const clink=(t,g)=>{add(t,.9,u=>g*(Math.sin(2*Math.PI*2870*u)*Math.exp(-u*9)+.6*Math.sin(2*Math.PI*4410*u)*Math.exp(-u*14)+.3*Math.sin(2*Math.PI*6650*u)*Math.exp(-u*22)+nz()*Math.exp(-u*300)));add(t+.02,.25,u=>g*.5*Math.sin(2*Math.PI*(900-500*u)*u)*Math.exp(-u*30))};
const drip=(t,g)=>add(t,.25,u=>g*Math.sin(2*Math.PI*(1100+1400*Math.exp(-u*40))*u)*Math.exp(-u*28));
const cricket=(t,d,g)=>add(t,d,u=>{const c=(u*3.2)%1<.35?1:0;return g(u)*c*Math.sin(2*Math.PI*4300*u)*(.5+.5*Math.sin(2*Math.PI*30*u))});
const car=(t,d,g)=>{let a=0,b=0;add(t,d,u=>{a+=(nz()-a)*(.03+.05*Math.sin(Math.PI*u/d));b+=(a-b)*.1;const k=Math.exp(-Math.pow((u-d*.45)/(d*.22),2));return g*k*(b*5+.08*Math.sin(2*Math.PI*(95-30*Math.tanh((u-d*.45)*3))*u))})};
const t=T(0),D=32;
fridge(t,D,u=>.05*(1-.45*bell(u,9,12,20,23)));
air(t,D,u=>.10*bell(u,4,9,22,27)+.03);
bird(t+2.2,.018,2900,2);bird(t+4.6,.02,3300,3);
for(let i=0;i<14;i++)bird(t+6.5+i*.9+((i*.618)%1)*.5,.03+.02*((i*.37)%1),2600+((i*.71)%1)*1800,2+i%3);
bus(t+10,4.5,.05);
cicada(t+13,10,u=>.022*bell(u,0,3,6,9.5));
clink(t+16.95,.32);drip(t+19.2,.12);drip(t+21.6,.07);
cricket(t+25,7,u=>.025*bell(u,0,2,5,6.9));
car(t+29.25,2.6,.5)}}};
