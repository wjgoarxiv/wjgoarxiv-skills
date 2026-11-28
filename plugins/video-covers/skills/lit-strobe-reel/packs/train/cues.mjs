// the platform's own sound: the tubes hum, the rails rumble louder as the train nears, each bogie clacks over the
// joint by the bench, the windows whoosh past, the tail goes quiet and the can drops
export default({SR,T,add,nz,tick,boom,click})=>{
const V=16,HEAD=144,PITCH=18.6,WIN=[2.8,5.8,8.8,11.8,14.8],BOG=[2.5,16.1],at=d=>(HEAD+d*30/V)/30;
const wins=[],bogs=[];for(let i=0;i<4;i++){for(const c of WIN)wins.push(at(i*PITCH+c));for(const c of BOG)bogs.push(at(i*PITCH+c))}
const cuts=[84,98,109,118,125,131,135,138,141,143].map(f=>f/30);
const hum=(t,d,g)=>add(t,d,u=>g*(.5*Math.sin(2*Math.PI*100*u)+.25*Math.sin(2*Math.PI*200*u+1)+.06*nz()*Math.max(0,Math.sin(2*Math.PI*100*u))));
const roar=(t,d,g,env)=>{let a=0,b=0;add(t,d,u=>{a+=(nz()-a)*.03;b+=(a-b)*.08;return g*env(u)*(b*5+.15*Math.sin(2*Math.PI*48*u))})};
const clack=(t,g)=>{for(const dt of[0,.085]){click(t+dt,g);add(t+dt,.12,u=>g*.5*Math.sin(2*Math.PI*170*u)*Math.exp(-u*40))}};
const whoosh=(t,g)=>add(t,.16,u=>g*nz()*Math.sin(Math.PI*u/.16));
const s0=b=>({empty:0,approach:2.4,pass:4.8,tail:9.6,clunk:11.2})[b];
const ev=(list,b,len,fn)=>{for(const e of list)if(e>=s0(b)&&e<s0(b)+len)fn(T(0)+e-s0(b))};
return{
empty(){hum(T(0),2.4,.05);roar(T(0),2.4,.05,u=>.2+.2*u/2.4)},
approach(){hum(T(0),2.4,.05);roar(T(0),2.4,.28,u=>.25+.9*(u/2.4)**2);ev(cuts,'approach',2.4,t=>tick(t,2600,.25))},
pass(){roar(T(0),4.8,.42,u=>1-.15*u/4.8);ev(bogs,'pass',4.8,t=>clack(t,.5));ev(wins,'pass',4.8,t=>whoosh(t,.09))},
tail(){roar(T(0),1.6,.32,u=>Math.exp(-u*1.6));hum(T(0),1.6,.04)},
clunk(){hum(T(0),2.4,.05);const t=T(0)+(350/30-11.2);boom(t);click(t,.6);add(t,.5,u=>.10*Math.sin(2*Math.PI*1750*u)*Math.exp(-u*9));add(t+.18,.08,u=>.05*nz()*Math.exp(-u*60))}}};
