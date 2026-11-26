MARK.glass=(a,b,s,f)=>ringS(a,b,s*.8,f,s*.16);MARK.ice=(a,b,s,f)=>{x.save();x.translate(a,b);x.rotate(.3);rect(-s*.62,-s*.62,s*1.24,s*1.24,f);x.restore()};MARK.sun=(a,b,s,f)=>disc(a,b,s*.8,f);
DRAW.page=(a,b,w)=>rect(a,b,w,w,K);DRAW.strobe=(cx,ws,s,z,lit)=>ICON[lit?1:0](cx,540,ws,z,K);DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
const D=f=>plate('day',Math.round(Math.min(959,Math.max(0,f))),959);
const grid=(f,a)=>{x.globalAlpha=a;for(let i=0;i<=12;i++)rect(X0+i*COL-1,0,2,DH,f);for(let j=1;j<6;j++)rect(0,j*180-1,DW,2,f);x.globalAlpha=1};
const diff=fn=>{x.save();x.globalCompositeOperation='difference';fn();x.restore()};
// TWO: dawn to morning in eight hard jumps under a giant cropped syllable
SCENE.two=(o,b,p,t)=>{const T_=[24,70,112,150,178,204,228,252][b];D(T_+p/3);grid(N,.22);diff(()=>cap(HAN[0],X0-60-b*14,-120,1380,N,KOR,-.02));hud(b,p,N,{full:true,bottom:false});
 o.grain=.07;o.hal=.6;o.vig=.35;o.dust=0;o.dith=b<4?[3,3,4,5][b]:0;o.sh=10*ex(p,6);o.ca=1.2+5*ex(p,5);if(p<1)o.exp=1.6};
// WAIT: the day as a contact sheet, the cells coming faster and faster
const CELL=i=>250+i*36;
SCENE.wait=(o,b,p,t)=>{const f=b*BF+p,n=Math.min(12,Math.floor(12*Math.pow(f/250,.62))+1),cw=480,ch=272,y0=40;bg(K);
 const last=n-1,ent=Math.floor(250*Math.pow(last/12,1/.62)),age=f-ent;
 if(age<2&&f<250){D(CELL(last)+f*.2);o.sh=14;o.ca=6;return}
 for(let i=0;i<12;i++){const a=(i%4)*cw,y=y0+Math.floor(i/4)*ch;if(i<n){x.save();x.beginPath();x.rect(a+6,y+6,cw-12,ch-12);x.clip();x.drawImage(IMG['day-'+String(Math.min(959,Math.round(CELL(i)+(f>250?(f-250)*1.5:0))))],a+6,y+6,cw-12,(cw-12)*9/16);x.restore();if(i===last&&f<250)bracket(a+6,y+6,cw-12,ch-12,L,30,5)}else{rect(a+6,y+6,cw-12,ch-12,'#0d0f12');cross(a+cw/2,y+ch/2,'#2a2d31',10)}}
 rect(0,y0+3*ch+8,DW,DH,K);diff(()=>wide(WORD[2],X0,DH-40,CW,N,HEL,-.05,130));
 o.grain=.05;o.hal=.4;o.vig=.2;o.dust=0;o.sh=age<6?8*ex(age,5):1;if(f>=264)o.inv=(f>>1)%2};
// the ice settles: black, one white impact, three freeze frames, then it lies still
SCENE.clink=(o,b,p,t)=>{const f=b*BF+p;o.dust=0;o.grain=.06;
 if(f<8){bg(K);return}if(f<10){bg(N);o.zoom=.12;o.ca=9;o.sh=24;return}
 if(f<34){const k=Math.floor((f-10)/8),q=(f-10)%8;D([503,507,511][k]);if(q<1){o.inv=1;o.sh=20}bracket(DW/2-330,170,660,560,N,50,6);ICON[1](X1-70,140,34,L,K);o.zoom=.04*k;o.ca=2+k*2;o.dith=k===2?4:0;return}
 D(511+(f-34)*.6);bracket(DW/2-330,170,660,560,N,50,6);o.hal=.6;o.vig=.35};
// GLASSES: the late sun, the syllable sliding behind the glass, the copy wearing out
SCENE.glasses=(o,b,p,t)=>{const f=b*BF+p,u=f/288;D(640+f*.75);diff(()=>cap(HAN[1],X1-760-u*520,40,1000,N,KOR,-.02));grid(N,.12);
 o.grain=.06+u*.08;o.hal=.6;o.vig=.35+u*.2;o.dust=0;o.ton=u*.8;o.sh=b===0?14*ex(p,8):1.5;if(f>=228)o.dith=[6,5,4,4,3,3,2][Math.min(6,(f-228)>>3)]};
// night: the strobe stops; only the rules are left
SCENE.night=(o,b,p,t)=>{const f=b*BF+p;D(848+f*.15);grid(N,.16*(1-f/96));o.grain=.05;o.hal=.8;o.vig=.5;o.dust=0;o.exp=2.2};
// the car light: one amber flash, then dark
SCENE.light=(o,b,p,t)=>{const f=b*BF+p;D(872+f*.55);if(f>=26&&f<28){bg(L);o.zoom=.1;o.sh=20}else if(f>=28&&f<44){x.globalAlpha=.6*ex(f-28,10);rect(0,0,DW,DH,L);x.globalAlpha=1}
 if(f>=76){x.globalAlpha=Math.min(1,(f-76)/16);rect(0,0,DW,DH,K);x.globalAlpha=1}o.grain=.05;o.hal=1;o.vig=.4;o.dust=0;o.exp=1.3};
// TAKE: the day in one shot, played through
SCENE.take=(o,b,p)=>{plate('day',b*12+Math.floor(p/2),959);Object.assign(o,{ca:.35,dist:0,grain:.04,hal:.45,vig:.3,dust:0})};
