MARK.lamp=(a,b,s,f)=>{disc(a-s*.42,b,s*.3,f);disc(a+s*.42,b,s*.3,f)};MARK.window=(a,b,s,f)=>{const w=s*1.5,h=s,t=s*.14;rect(a-w/2,b-h/2,w,t,f);rect(a-w/2,b+h/2-t,w,t,f);rect(a-w/2,b-h/2,t,h,f);rect(a+w/2-t,b-h/2,t,h,f)};MARK.can=(a,b,s,f)=>{rect(a-s*.38,b-s*.62,s*.76,s*1.24,f);rect(a-s*.28,b-s*.78,s*.56,s*.1,f)};
DRAW.page=(a,b,w)=>rect(a,b,w,w,K);DRAW.strobe=(cx,ws,s,z,lit)=>ICON[lit?1:0](cx,540,ws,z,K);DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
// the train, the same numbers Blender moves it by (shot frames, 30 a second): a lit window over the bench is a cut
const SH=PACK.shot,WIN=f=>SH.wins.findIndex(w=>Math.abs(f-w)<1.4),JNT=f=>SH.joints.some(j=>Math.abs(f-j)<1),CUT=f=>SH.cuts.findIndex(c=>f>=c&&f<c+2);
const SF=p=>Math.min(407,Math.floor((FB*BF+p)/2)),D=f=>plate('plat',Math.max(0,Math.min(407,f)),407);
const grid=(f,a)=>{x.globalAlpha=a;for(let i=0;i<=12;i++)rect(X0+i*COL-1,0,2,DH,f);for(let j=1;j<6;j++)rect(0,j*180-1,DW,2,f);x.globalAlpha=1};
const crop=(f,k,fx,fy)=>{const im=IMG['plat-'+Math.max(0,Math.min(407,f))],w=im.width/k,h=im.height/k,cx=Math.max(w/2,Math.min(im.width-w/2,im.width*fx)),cy=Math.max(h/2,Math.min(im.height-h/2,im.height*fy));x.drawImage(im,cx-w/2,cy-h/2,w,h,0,0,DW,DH)};
const SYL=[...HAN[0]],PW='PASS';
// EMPTY: the empty platform, the signal at the far end, nothing cut
SCENE.empty=(o,b,p,t)=>{D(SF(p));Object.assign(o,{grain:.05,hal:.5,vig:.35,dust:0,ca:.4})};
// APPROACH: light floods in from behind; the cuts come closer together as the train does
SCENE.approach=(o,b,p,t)=>{const f=SF(p),u=(b*BF+p)/144,c=CUT(f);Object.assign(o,{grain:.06,hal:.55+.5*u,vig:.35,dust:0,ca:.5+2*u,sh:4*u*u});
 if(c<0){D(f);grid(N,.06+.08*u);return}
 const m=c%3;if(m===0){bg(N);const s=SYL[(c/3|0)%SYL.length],h=1200;cap(s,mid(s,0,DW,h,KOR,-.02)-40,-80,h,K,KOR,-.02);o.zoom=.06;o.ca=5;o.sh=12}
 else if(m===1){crop(f,3,.78,.86);o.inv=1;o.ca=6;o.sh=10}else{D(f);o.exp=2.6;o.zoom=.05;o.sh=14}};
// PASS: every lit window crossing the bench is a cut; a car joint is black
SCENE.pass=(o,b,p,t)=>{const f=SF(p),u=(b*BF+p)/288,k=WIN(f);Object.assign(o,{grain:.07,hal:.7+.5*u,vig:.4,dust:0,ca:1+3*u,dist:.04*u});
 if(JNT(f)){bg(K);o.sh=6;return}
 if(k<0){D(f);grid(N,.06+.1*u);o.crt=u>.4?Math.min(1,(u-.4)*2):0;o.dith=u>.75?[0,6,5,4][Math.min(3,Math.floor((u-.75)*16))]:0;return}
 const m=k%4;if(m===0||m===2){D(f);x.globalAlpha=.55;rect(0,0,DW,DH,K);x.globalAlpha=1;const g=PW[(k>>1)%4],cw=150;bits(g,DW/2-1.5*cw,DH/2-2.5*cw,cw,N);o.sh=12;o.ca=6}
 else if(m===1){D(f);o.inv=1;o.sh=10;o.ca=7}else{crop(f,2.2,.8,.5);o.exp=1.8;o.dith=5;o.sh=8}};
// TAIL: two red lamps going away down the platform
SCENE.tail=(o,b,p,t)=>{const f=SF(p),u=(b*BF+p)/48;crop(f,1+.8*u,.56,.52);Object.assign(o,{grain:.06,hal:1.1,vig:.5,dust:0,ca:1.5*(1-u),sh:3*(1-u)})};
// CLUNK: quiet again; the can drops and that is the only cut
SCENE.clunk=(o,b,p,t)=>{const f=SF(p),u=(b*BF+p)/144,c=f-SH.can;Object.assign(o,{grain:.05,hal:.5,vig:.4,dust:0,ca:.4});
 if(c>=0&&c<4){crop(f,2.6,.33,.58);o.sh=14*(1-c/4);o.zoom=.05;return}D(f);grid(N,.04*(1-u))};
