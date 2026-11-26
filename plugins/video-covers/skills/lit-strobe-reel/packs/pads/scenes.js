// marks: a, b centre, s half size, f colour, h hole colour
const dia=(a,b,s,f)=>{x.fillStyle=f;x.beginPath();x.moveTo(a,b-s);x.lineTo(a+s,b);x.lineTo(a,b+s);x.lineTo(a-s,b);x.closePath();x.fill()};
const plus=(a,b,s,f)=>{x.save();x.translate(a,b);x.rotate(Math.PI/4);rect(-s,-s*.22,s*2,s*.44,f);rect(-s*.22,-s,s*.44,s*2,f);x.restore()};
MARK.disc=(a,b,s,f)=>disc(a,b,s,f);
MARK.diamond=(a,b,s,f)=>dia(a,b,s,f);
MARK.cross=(a,b,s,f)=>plus(a,b,s,f);
DRAW.page=(a,b,w)=>{const s=w/4;for(let j=0;j<4;j++)for(let i=0;i<4;i++)rect(a+i*s+6,b+j*s+6,s-12,s-12,i===1&&j===2?R:K)};
DRAW.strobe=(cx,ws,s,z,lit)=>dia(cx,540,ws*1.15,lit?L:z);
DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
// under a photographed shot: the syllable, and the row of the pattern that plays it
const lane=(n,f)=>{const now=Math.floor(f/6)%16,w=78,x0=DW-16*w-40;rect(x0-36,DH-206,DW,206,N);tx(HAN[n],28,DH-30,KOR(250,900),PH,{ls:-8});for(let i=0;i<16;i++){const on=PACK.steps[n][i],c_=i===now?(on?R:'#ffffff'):on?PH:'#ffffff40';rect(x0+i*w,DH-96,w-10,w-10,c_);if(!on&&i!==now)rect(x0+i*w+4,DH-92,w-18,w-18,'#00000090')}tx(WORD[n],x0,DH-124,HEL(64),'#ffffff',{ls:-2})};
SCENE.pad=(o,b,p,t)=>{const f=b*BF+p;plate('pad',Math.floor(f/2));lane(0,f);o.grain=.08;o.hal=1.1;o.ca=2;const h=f%6;if(PACK.steps[0][Math.floor(f/6)])o.sh=12*ex(h,4)};
SCENE.cone=(o,b,p,t)=>{const f=b*BF+p;plate('cone',b*12+Math.floor(p/2));lane(1,f);o.grain=.085;o.hal=.7;o.ca=2;if(b===1){o.sh=26*ex(p,9);o.zoom=.10*ex(p,7);if(p<6)o.inv=p%2===0?1:0}else o.sh=f*.15};
SCENE.cymbal=(o,b,p,t)=>{const f=b*BF+p;plate('cymbal',b*12+Math.floor(p/2));lane(2,f);o.grain=.08;o.hal=1;o.ca=2.4;if(b===1){o.sh=12*ex(p,6);if(p<4)o.exp=1.5;if(p>=19)o.mos=[6,10,18,32,60][p-19]}};
// the pattern: sixteen steps of six frames, three rows
SCENE.seq16=(o,b,p,t)=>{const f=b*BF+p,now=Math.floor(f/6),h=f%6,cw=DW/16,rh=DH/3;bg(N);for(let j=0;j<3;j++){const y=j*rh,row=PACK.steps[j],hitNow=row[now],fl=hitNow&&h<3,bk=fl?[B,K,PH][j]:N,fg=fl?N:K;rect(0,y,DW,rh,bk);if(fl){const z=1+.25*ex(h,3);x.save();x.beginPath();x.rect(0,y,DW,rh);x.clip();x.translate(960,y+rh/2);x.scale(z,z);x.globalAlpha=.16;ICON[j](((now+.5)/16-.5)*DW/z,0,rh*.9,fg,bk);x.restore()}
 for(let i=0;i<16;i++){const cx=i*cw+cw/2,cy=y+rh/2,on=row[i],past=i<now,cur=i===now;if(i%4===0)rect(i*cw-2,y,4,rh,fl?N:K+'55');if(on&&past&&!fl)rect(i*cw+2,y+(i?2:78),cw-4,rh-(i?4:80),[B,K,PH][j]);if(on){const k=cur?58+26*ex(h,4):past?50:26;ICON[j](cx,cy,k,cur?R:past&&!fl?N:past?fg:fg+'aa',bk)}else rect(cx-5,cy-5,10,10,fg+'66')}rect(0,y-2,DW,4,fl?N:K)}
 rect(now*cw,0,cw,DH,h<2?K+'26':K+'10');rect(now*cw,0,6,DH,R);for(let j=0;j<3;j++){const row=PACK.steps[j],fl=row[now]&&h<3;tx(WORD[j],24,j*rh+58,HEL(50),fl?N:K,{ls:-1.5});tx(HAN[j],DW-24,j*rh+58,KOR(50,900),fl?N:K,{al:'right'})}
 const any=PACK.steps.some(r=>r[now]);o.sh=any?14*ex(h,4):0;o.ca=1.4+(any?3*ex(h,4):0);o.grain=.06;o.hal=.8;o.vig=.2;if(PACK.steps[0][now]&&h<1)o.inv=1;if(now===15&&h>=3)o.mos=[10,24,60][h-3]};
// a word is on screen only while its sound plays
const HOLD=[6,6,5];
SCENE.solo=(o,b,p,t)=>{const f=b*BF+p,now=Math.floor(f/6),h=f%6,on=[0,1,2].filter(j=>PACK.steps[j][now]&&h<HOLD[j]);bg(N);const n=on.length;on.forEach((j,k)=>{const w=DW/n,a=k*w;x.save();x.beginPath();x.rect(a,0,w,DH);x.clip();const bk=[K,B,PH][j],fg=[N,N,N][j];rect(a,0,w,DH,h%2===0||h>3?bk:N);const c2=h%2===0||h>3?fg:bk,z=1+.18*ex(h,4);x.translate(a+w/2,540);x.scale(z,z);x.translate(-a-w/2,-540);{const hh=hgt(WORD[j],w-80,560);wide(WORD[j],a+40,470+hh/2,w-80,c2,HEL,-.045,560)}tx(HAN[j],a+40,1000,KOR(190,900),c2);x.restore()});
 if(!n){rect(X0,1030,CW,4,K)}o.sh=n?18*ex(h,4):0;o.zoom=n?.08*ex(h,3):0;o.ca=n?2+5*ex(h,4):1;o.grain=.07;o.inv=n&&h<1?1:0};
// the film's own waveform on a tube, with the three frames before it
SCENE.scope=(o,b,p,t)=>{bg('#010304');const W_=LEVELS.wave,top=Math.max(...LEVELS.wave.flat().map(Math.abs))||1;for(let i=1;i<12;i++)rect(i*160,60,2,960,PD);for(let i=1;i<8;i++)rect(60,i*135,1800,2,PD);rect(60,539,1800,4,PM);for(let g=3;g>=0;g--){const w=W_[t-g];if(!w)continue;x.strokeStyle=g?dim(PH,.55/g):PH;x.lineWidth=g?6:12;x.lineJoin='round';x.beginPath();w.forEach((v,i)=>{const a=60+i/95*1800,c_=540-v/top*440;i?x.lineTo(a,c_):x.moveTo(a,c_)});x.stroke()}
 tx(WORD.join(' / '),96,990,MONO(44,700),PH);o.crt=1;o.dist=.14;o.hal=1.3;o.grain=.05;o.ca=2.2;o.sh=16*LEVELS.level[t]/Math.max(...LEVELS.level);if(b===1&&p>=20)o.inv=p%2};
