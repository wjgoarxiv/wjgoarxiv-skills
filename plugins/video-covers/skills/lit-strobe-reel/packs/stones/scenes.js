// marks: a, b centre, s half size, f colour, h hole colour
MARK.solid=(a,b,s,f)=>disc(a,b,s,f);
MARK.open=(a,b,s,f)=>ringS(a,b,s*.86,f,s*.28);
MARK.taken=(a,b,s,f,h)=>{for(const[u,v]of[[0,-1],[1,0],[0,1],[-1,0]])disc(a+u*s*.7,b+v*s*.7,s*.33,f);ringS(a,b,s*.28,f,s*.09)};
const lines=(x0,y0,cell,n,f,w=3)=>{for(let i=0;i<n;i++){rect(x0+i*cell-w/2,y0-w/2,w,cell*(n-1)+w,f);rect(x0-w/2,y0+i*cell-w/2,cell*(n-1)+w,w,f)}};
const star=(x0,y0,cell,f)=>{for(const i of[3,9,15])for(const j of[3,9,15])disc(x0+i*cell,y0+j*cell,cell*.1,f)};
const stoneAt=(a,b,r,black,k=1)=>{if(black)disc(a,b,r*k,K);else{disc(a,b,r*k,N);ringS(a,b,r*k-2,K,4)}};
DRAW.page=(a,b,w)=>{rect(a,b,w,w,K);const s=w/5;for(let i=1;i<5;i++){rect(a+i*s-2,b,4,w,G);rect(a,b+i*s-2,w,4,G)}disc(a+s*3,b+s*2,s*.46,N);disc(a+s*3,b+s*2,s*.12,R)};
DRAW.strobe=(cx,ws,s,z,lit)=>{lit?ringS(cx,540,ws*.8,z,ws*.22):disc(cx,540,ws*.9,z)};
DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
// a caption block in the corner of a photographed shot: the mark, the word, the point
const plaque=(n,right)=>{const w=470,a=right?DW-w:0;rect(a,0,w,210,K);ICON[n](a+96,105,58,N,K);tx(WORD[n],a+190,100,HEL(72),N,{ls:-3});tx(HAN[n],a+190,160,KOR(44,800),N);};
SCENE.stone=(o,b,p,t)=>{plate('stone',b*12+Math.floor(p/2));plaque(0,true);o.grain=.075;o.hal=.5;o.vig=.35;if(b===1){o.sh=20*ex(p,8);if(p<4)o.exp=1.5}if(b===0&&p<2)o.inv=1};
SCENE.board=(o,b,p,t)=>{const f=b*BF+p;plate('board',Math.floor(f/2));plaque(1,false);o.grain=.075;o.hal=.4;o.vig=.4;o.sh=2};
SCENE.bowl=(o,b,p,t)=>{const f=b*BF+p;plate('bowl',Math.floor(f/2));plaque(2,true);o.grain=.075;o.hal=.4;o.vig=.35;o.sh=4+3*(f%5<1);if(f>=44)o.dith=[2,3,4,6][f-44]};
// word 1 in stones on a 19 x 19 grid
const G19=(()=>{const s=[],t=[PIXW.slice(0,5),PIXW.slice(5)].filter(Boolean),h=t.length*6-1;t.forEach((line,r)=>{let o=Math.floor((19-(line.length*4-1))/2);for(const g of line){GLY[g].forEach((v,j)=>[...v].forEach((q,i)=>{if(q==='1')s.push([o+i,Math.floor((19-h)/2)+r*6+j])}));o+=4}});return s})();
SCENE.grid19=(o,b,p,t)=>{const f=b*BF+p,cell=DW/19.2,x0=DW/2-cell*9,y0=540-cell*9,inW=new Set(G19.map(q=>q+''));bg(N);x.save();if(f<40){const z=1+.06*ex(f,20);x.translate(960,540);x.scale(z,z);x.translate(-960,-540)}
 lines(x0,y0,cell,19,K,4);star(x0,y0,cell,K);const n=f<26?Math.floor(G19.length*Math.pow(f/26,1.5)):G19.length;G19.slice(0,n+1).forEach(([i,j],q)=>{const k=q===n?1.35:1;stoneAt(x0+i*cell,y0+j*cell,cell*.48,true,k)});
 if(f>=26)for(let j=0;j<19;j++)for(let i=0;i<19;i++)if(!inW.has([i,j]+'')){const d=f-26-Math.hypot(i-9,(j-9)*1.4)*.9;if(d>=0)stoneAt(x0+i*cell,y0+j*cell,cell*.48,false,1+.3*ex(d,5))}
 if(f<26&&n<G19.length){const[i,j]=G19[n];disc(x0+i*cell,y0+j*cell,cell*.13,R)}x.restore();
 o.sh=f<26?5:12*ex(f-26,9);o.grain=.04;o.hal=.2;o.vig=.18;if(f>=40)o.inv=Math.floor((f-40)/2)%2===0?1:0};
// a ladder: the moves come 8, 4, 2 and then 1 frame apart
const LAD=(()=>{let a=0;return PACK.ladder.steps.map((s,i)=>{const at=a;a+=[8,4,2,2][i]||1;return{...s,at}})})();
const posAt=(set,steps,n)=>{const m=new Map();for(const[c_,i,j]of set)m.set(i+','+j,c_);for(const s of steps.slice(0,n)){m.set(s.m[1]+','+s.m[2],s.m[0]);for(const k of s.out)m.delete(k)}return m};
SCENE.ladder=(o,b,p,t)=>{const f=b*BF+p,n=LAD.filter(s=>s.at<=f).length,now=LAD[n-1];bg(K);const cell=150,u=ss(0,44,f),cx=10+u*5.2,cy=9.4+u*5.4,a=-.16+u*.1,z=1.15-.35*u;x.save();x.translate(960,540);x.rotate(a);x.scale(z,z);x.translate(-cx*cell,-cy*cell);rect(-cell*.6,-cell*.6,cell*19.2,cell*19.2,N);lines(0,0,cell,19,K,5);star(0,0,cell,K);
 const m=posAt(PACK.ladder.set,LAD,n);for(const[k,v]of m){const[i,j]=k.split(',').map(Number),hot=now.m[1]===i&&now.m[2]===j;stoneAt(i*cell,j*cell,cell*.475,v==='B',hot?1+.25*ex(f-now.at,4):1)}disc(now.m[1]*cell,now.m[2]*cell,cell*.15,R);if(now.out.length)for(const k of now.out){const[i,j]=k.split(',').map(Number);ringS(i*cell,j*cell,cell*.3,R,14)}x.restore();
 rect(0,0,300,DH,K);x.save();x.translate(214,DH-50);x.rotate(-Math.PI/2);tx(WORD[1],0,0,HEL(150),N,{ls:-6});x.restore();tx(HAN[1],44,96,KOR(64,800),N);
 o.sh=f<16?10*ex(f%8,5):5+u*8;o.grain=.05;o.hal=.2;o.vig=.2;if(f>=44)o.inv=f%2};
// twenty stones close a diamond of forty-one, and it leaves the board
SCENE.capture=(o,b,p,t)=>{const f=b*BF+p,S_=PACK.capture.steps,last=S_.length-1,done=f>=36,n=done?S_.length:Math.min(last,Math.floor(last*Math.pow(f/28,.8))),cell=84,x0=960-cell*9,y0=465-cell*9;const inv=done&&f<42?f%2:0;bg(K);x.save();x.translate(960,540);const z=done?1+.12*ex(f-36,8):1.0-.02*Math.min(1,f/30);x.scale(z,z);x.translate(-960,-540);rect(x0-cell*.6,y0-cell*.6,cell*19.2,cell*19.2,N);lines(x0,y0,cell,19,K,4);star(x0,y0,cell,K);
 const m=posAt(PACK.capture.set,S_,n),now=S_[n-1]?.m;for(const[k,v]of m){const[i,j]=k.split(',').map(Number);stoneAt(x0+i*cell,y0+j*cell,cell*.475,v==='B')}
 if(done){const g=(f-36)/11;for(const k of S_[last].out){const[i,j]=k.split(',').map(Number),r=1+g*g*7,k2=1-g*.5;if(g<1)disc(960+(x0+i*cell-960)*r,465+(y0+j*cell-465)*r-g*60,cell*.475*k2,K)}}
 else if(now)disc(x0+now[1]*cell,y0+now[2]*cell,cell*.15,R);x.restore();
 rect(0,DH-150,DW,150,K);tx(WORD[2],X0,DH-46,HEL(100),N,{ls:-4});tx(HAN[2],X1,DH-50,KOR(82,900),N,{al:'right'});
 o.inv=inv;o.sh=done?22*ex(f-36,9):f<28?4:0;o.zoom=done?.14*ex(f-36,9):0;o.grain=.05;o.hal=.2;o.vig=.2};
