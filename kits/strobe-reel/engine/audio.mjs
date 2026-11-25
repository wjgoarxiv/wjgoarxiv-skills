import { readFileSync, writeFileSync } from "node:fs";
const [, , cfgPath, outPath] = process.argv, CFG=JSON.parse(readFileSync(cfgPath,"utf8"));CFG.order=CFG.acts.flatMap(a=>a.blocks);
const LEN={impact:1,crop:1,key:2,panels:2,crt:1,score:1,count:1,page:2,dial:2,field:2,scan:1,strobe:2,index:2,modules:2,dither:1,rest:1,slash:1,pieces:1,blade:2,copies:2,bands:1,swap:1,lock:4,print:4};
const SR=48000, BPM=150, NB=CFG.order.reduce((n,k)=>n+LEN[k],0), beat=60/BPM, N=Math.round(SR*NB*beat), o=new Float32Array(N);
let s=CFG.seed%97+7; const nz=()=>{s=(s*1664525+1013904223)>>>0;return s/2147483648-1};
const add=(t,d,fn)=>{const a=Math.round(t*SR);for(let i=0;i<d*SR&&a+i<N;i++)if(a+i>=0)o[a+i]+=fn(i/SR)};
const sat=(v,k)=>Math.tanh(v*k);
const kick=(t,g=1)=>{let ph=0;add(t,.34,u=>{ph+=2*Math.PI*(44+190*Math.exp(-u*38))/SR;return g*.82*sat(Math.sin(ph)*Math.exp(-u*8)+(u<.004?nz()*.6:0),2.4)})};
const snare=(t,g=1)=>{let lp=0;add(t,.2,u=>{const n=nz();lp+=(n-lp)*.35;return g*.42*((n-lp)*Math.exp(-u*22)+Math.sin(2*Math.PI*190*u)*Math.exp(-u*30)*.8)})};
const hat=(t,g=.12,d=.04)=>{let lp=0;add(t,d,u=>{const n=nz();lp+=(n-lp)*.6;return g*(n-lp)*Math.exp(-u/d*4)})};
const stab=(t,f,d=.22,g=.3)=>add(t,d,u=>{let v=0;for(const m of[1,1.006,.5,1.498])v+=((u*f*m)%1)*2-1;return g*sat(v*.4*Math.exp(-u*9),1.8)});
const boom=t=>{let ph=0;add(t,1.4,u=>{ph+=2*Math.PI*(30+70*Math.exp(-u*9))/SR;return .6*sat(Math.sin(ph)*Math.exp(-u*2.6),1.8)});let lp=0;add(t,.7,u=>{lp+=(nz()-lp)*.25;return .3*lp*Math.exp(-u*6)})};
const slash=t=>{let lp=0,b=0;add(t-.05,.3,u=>{const n=nz();lp+=(n-lp)*(.1+.7*Math.min(1,u/.07));return .5*(n-lp*.4)*Math.exp(-Math.abs(u-.05)*24)});add(t,.5,u=>.10*(Math.sin(2*Math.PI*2093*u)+Math.sin(2*Math.PI*3137*u)+Math.sin(2*Math.PI*4711*u))*Math.exp(-u*13))};
const tick=(t,f=2400,g=.16)=>add(t,.03,u=>g*Math.sin(2*Math.PI*f*u)*Math.exp(-u*160));
let O=0;const T=b=>(O+b)*beat;const rnd2=i=>{const v=Math.sin(i*91.7)*4375.85;return v-Math.floor(v)};
const click=(t,g=.6)=>{let lp=0;add(t,.09,u=>{const n=nz();lp+=(n-lp)*.5;return g*((n-lp)*Math.exp(-u*130)+.7*Math.sin(2*Math.PI*340*u)*Math.exp(-u*60)+.35*Math.sin(2*Math.PI*1720*u)*Math.exp(-u*90))})};
const gate=(t,d,hz,f,g=.22)=>add(t,d,u=>{const on=(u*hz%1)<.5?1:0;let v=0;for(const m of[1,1.008,2.005])v+=((u*f*m)%1)*2-1;return g*on*sat(v+nz()*.35,1.2)});
const hum=(t,d,g=.05)=>add(t,d,u=>g*(Math.sin(2*Math.PI*60*u)+.5*Math.sin(2*Math.PI*120*u)+.16*Math.sin(2*Math.PI*9800*u)));
const G=(b,d=.13,f=98,g=.2)=>gate(T(b),d,30,f,g);
const scan=(t,d)=>{let ph=0,lp=0;add(t,d,u=>{const k=u/d;ph+=2*Math.PI*(180+900*k)/SR;lp+=(nz()-lp)*.3;return .10*Math.sin(ph)*(.6+.4*Math.sin(2*Math.PI*52*u))+.10*lp})};
const ring=(t,g=.11)=>add(t,1.1,u=>g*(Math.sin(2*Math.PI*1318*u)+Math.sin(2*Math.PI*2637*u)+.6*Math.sin(2*Math.PI*4130*u))*Math.exp(-u*5));
const ten=(t,d)=>{let ph=0;add(t,d,u=>{const k=u/d;ph+=2*Math.PI*60*Math.pow(10,k)/SR;return .24*Math.pow(k,1.4)*sat(Math.sin(ph)+nz()*.6,2)})};
const CUE={
impact(){tick(T(0),1000,.3);boom(T(0)+.03);gate(T(0)+.03,.17,60,82,.34);kick(T(0)+.2,1.1);stab(T(0)+.2,55,.3,.36)},
crop(){kick(T(0));G(0,.2,110)},
key(){hum(T(0),beat);click(T(1),1);boom(T(1));kick(T(1),1.1);G(1,.13,65,.25);for(let i=0;i<6;i++)tick(T(1)+.3+i/60,2600-i*260,.2)},
panels(){const n=[...CFG.sub[0]].slice(0,4).length+2;for(let i=0;i<n;i++){const u=i*2/n;kick(T(u),i===n-1?1.1:.8);G(u,.1,[82,98,110,146,165,196][i],.22);stab(T(u),[55,65.4,73.4,82.4,98,110][i],.16)}},
crt(){hum(T(0),beat,.06);for(let i=0;i<8;i++)tick(T(0)+i*.05,1500+(i%3)*300,.16);gate(T(0)+.3,.1,30,196,.26)},
score(){kick(T(0));for(let i=0;i<8;i++){tick(T(0)+i*.05,i%2?700:1400,.26);hat(T(0)+i*.05,.2)}},
count(){for(let q=0;q<4;q++){tick(T(q/4),1200+q*500,.3);snare(T(q/4),.34+.14*q);gate(T(q/4),.05,60,98*(1+q*.25),.2)}},
page(){boom(T(0));click(T(0),.5);hum(T(0),2*beat,.02)},
dial(){for(let i=0;i<9;i++)click(T(0)+.05+i*.034+i*i*.0006,.32);click(T(1)-.03,1);kick(T(1),1.1);boom(T(1));stab(T(1),41.2,.5,.4)},
field(){for(let i=0;i<64;i++)click(T(0)+.02+i*.0078+rnd2(i)*.004,.10+.10*(i/64));{let lp=0;add(T(0),.55,u=>{lp+=(nz()-lp)*.06;return .5*lp*Math.min(1,u*3)})}boom(T(1)+.1);kick(T(1)+.1,1.1);stab(T(1)+.1,36.7,.6,.45)},
scan(){scan(T(0),.3);click(T(0)+.3,.9);kick(T(0)+.3);G(.75,.1,73,.2)},
strobe(){const seq=[8,7,6,5,4,4,3,2,2,1,1,1,1,1,1,1];let a=0;for(const n of seq){tick(T(0)+a/60,1800+a*46,.24);snare(T(0)+a/60,.3);a+=n}gate(T(0)+.7,.04,60,200,.1);ten(T(0),2*beat-.06);gate(T(1),beat-.06,30,110,.2)},
index(){for(let i=0;i<8;i++){click(T(0)+i/12,.7);stab(T(0)+i/12,[55,55,65.4,73.4,82.4,73.4,98,110][i],.1,.22);if(i%2===0)kick(T(0)+i/12,.7)}for(let i=0;i<8;i++)tick(T(0)+(40+i)/60,3200-i*300,.16)},
modules(){for(let i=0;i<24;i++){tick(T(0)+i/30,300+i*70,.12);hat(T(0)+i/30,.14)}kick(T(0));kick(T(1),1.1);boom(T(1));stab(T(1),55,.5,.36)},
dither(){for(let i=0;i<8;i++){snare(T(0)+i*.05,.34);gate(T(0)+i*.05,.04,60,130+i*30,.2);if(i%4===0)kick(T(0)+i*.05)}},
rest(){hum(T(0),beat*.9,.03);tick(T(0),1000,.16)},
slash(){slash(T(0)-.08);slash(T(0));boom(T(0));kick(T(0)+.1);G(0,.1,65,.3)},
pieces(){slash(T(0));kick(T(0));snare(T(0));G(0,.16,98,.2)},
blade(){slash(T(0)+.36);hum(T(0),beat*.9,.03);click(T(1)-.03,1);boom(T(1));kick(T(1),1.1);slash(T(1));ring(T(1))},
copies(){for(let i=0;i<6;i++){kick(T(0)+i/12,.75);scan(T(0)+i/12,.07);click(T(0)+i/12,.5)}scan(T(0)+.5,.17);for(let i=0;i<4;i++)gate(T(0)+.667+i/30,.03,60,220,.24)},
bands(){kick(T(0));snare(T(0),.8);for(let q=0;q<8;q++)hat(T(q/8),.2);stab(T(0),49,.3);slash(T(0))},
swap(){for(let i=0;i<12;i++){tick(T(0)+i/30,[900,1300,1800][i%3],.3);snare(T(0)+i/30,.16+.04*i)}},
lock(){boom(T(0));gate(T(0),.2,60,55,.36);kick(T(0)+.2,1.1);stab(T(0)+.2,41.2,.6,.46);for(let b=1;b<4;b++){kick(T(b),.95);stab(T(b),[55,65.4,82.4][b-1],.3);G(b,.13,110,.16);for(let q=0;q<4;q++)hat(T(b+q/4),.1);if(b===3)snare(T(b))}},
print(){boom(T(0));kick(T(0));click(T(0),.6);add(T(0),3*beat,u=>.05*Math.exp(-u*.9)*(Math.sin(2*Math.PI*55*u)+.6*Math.sin(2*Math.PI*82.4*u)+.35*Math.sin(2*Math.PI*110.2*u)+.2*Math.sin(2*Math.PI*164.8*u)));kick(T(1),.7);kick(T(2),.7);for(const b of[0,1,2])for(let q=0;q<4;q++)hat(T(b+q/4),.06);click(T(3)+.13,.8);let ph=0;add(T(3)+.13,.26,u=>{ph+=2*Math.PI*(9000*Math.exp(-u*18)+50)/SR;return .16*Math.sin(ph)*Math.exp(-u*9)})}};
for(const k of CFG.order){CUE[k]();O+=LEN[k]}
let pk=0;for(let i=0;i<N;i++){o[i]=Math.tanh(o[i]*.8);const r=Math.min(1,(N-i)/(SR*.05));o[i]*=r;pk=Math.max(pk,Math.abs(o[i]))}
const b=Buffer.alloc(44+N*2);b.write("RIFF",0);b.writeUInt32LE(36+N*2,4);b.write("WAVEfmt ",8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write("data",36);b.writeUInt32LE(N*2,40);
for(let i=0;i<N;i++)b.writeInt16LE(Math.round(o[i]/pk*.72*32767),44+i*2);writeFileSync(outPath,b);
