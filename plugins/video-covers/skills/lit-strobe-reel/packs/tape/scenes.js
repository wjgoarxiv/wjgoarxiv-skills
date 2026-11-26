// marks: a, b centre, s half size, f colour, h hole colour
const tri3=(a,b,s,f)=>{x.fillStyle=f;x.beginPath();x.moveTo(a-s*.8,b-s);x.lineTo(a+s,b);x.lineTo(a-s*.8,b+s);x.closePath();x.fill()};
MARK.record=(a,b,s,f)=>disc(a,b,s,f);
MARK.play=(a,b,s,f)=>tri3(a,b,s,f);
MARK.erase=(a,b,s,f,h)=>{rect(a-s,b-s,s*2,s*2,f);x.save();x.beginPath();x.rect(a-s,b-s,s*2,s*2);x.clip();x.translate(a,b);x.rotate(-Math.PI/4);rect(-s*2,-s*.16,s*4,s*.32,h);x.restore()};
const spool=(a,b,r,f,h,rot=0)=>{disc(a,b,r,f);for(let i=0;i<5;i++){const q=rot+i*1.2566;x.fillStyle=h;x.beginPath();x.arc(a,b,r*.84,q,q+.7);x.arc(a,b,r*.42,q+.56,q+.14,true);x.closePath();x.fill()}disc(a,b,r*.12,h)};
DRAW.page=(a,b,w)=>{rect(a,b,w,w,B);spool(a+w/2,b+w/2,w*.44,L,B,.4)};
DRAW.strobe=(cx,ws,s,z,lit)=>{tri3(cx-ws*.5,540,ws*.6,z);tri3(cx+ws*.5,540,ws*.6,lit?R:z)};
DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
// a printed tape label down the left edge of a photographed shot
const spine=(n,c=L)=>{rect(0,0,150,DH,c);x.save();x.translate(112,DH-40);x.rotate(-Math.PI/2);tx(WORD[n],0,0,HEL(112),K,{ls:-5});x.restore();ICON[n](75,96,44,K,c);rect(150,0,6,DH,K)};
SCENE.deck=(o,b,p,t)=>{plate('deck',b*12+Math.floor(p/2));spine(0,b&&p<8&&st(p,2)?R:L);o.grain=.09;o.hal=.9;o.ca=1.6;if(b===1){o.sh=20*ex(p,8);o.exp=1+.4*ex(p,6)}};
SCENE.reel=(o,b,p,t)=>{const f=b*BF+p;plate('reel',Math.floor(f/2));spine(1);o.grain=.09;o.hal=.7;o.ca=1.6;o.sh=3+f*.15;if(f%12<1)o.inv=1};
SCENE.needle=(o,b,p,t)=>{plate('needle',b*12+Math.floor(p/2));spine(2,b?R:L);o.grain=.09;o.hal=.7;o.ca=1.8;if(b===1){o.sh=26*ex(p,9);o.zoom=.1*ex(p,7);if(p<8)o.inv=p%2===0?1:0;if(p>=19)o.dith=[2,3,4,6,8][p-19]}};
// the film's own loudness, one bar per frame
const LMAX=Math.max(...LEVELS.level),lv=i=>(LEVELS.level[i]||0)/LMAX;
SCENE.wave=(o,b,p,t)=>{const f=b*BF+p;if(b===0){const inv=p%12<2;bg(inv?L:B);const n=40,w=DW/n;for(let i=0;i<n;i++){const q=t-Math.floor(n/2)+i,h=lv(q)*1010+8,now=i===n/2;rect(i*w+5,540-h/2,w-10,h,now?R:inv?B:q<t?N:L)}o.sh=14*lv(t)}
 else{const N_=LEVELS.level.length,head=Math.floor(N_*Math.min(1,(1-ex(p,16))*1.002)),rows=3,per=Math.ceil(N_/rows),rh=DH/rows;bg(K);for(let r=0;r<rows;r++){if(r%2)rect(0,r*rh,DW,rh,B);for(let i=0;i<per;i++){const q=r*per+i;if(q>=N_)break;const h=lv(q)*(rh-30)+3,on=q<=head;rect(i*DW/per,r*rh+rh/2-h/2,DW/per-1.5,h,on?(r%2?L:N):'#ffffff22')}const hq=head-r*per;if(hq>=0&&hq<per)rect(hq*DW/per-7,r*rh,14,rh,R)}o.sh=8*ex(p,8);if(p>=20)o.inv=p%2;o.ca=2.4}
 o.grain=.07;o.hal=.7};
// three printed ribbons; the beat cuts them and they rejoin one step off
SCENE.splice=(o,b,p,t)=>{const f=b*BF+p;bg(N);const h=300,gap=45,cut=[24,30,36],txt=[...WORD,SUBLINE].join('   ');for(let r=0;r<3;r++){const y=gap+r*(h+gap),dir=r%2?1:-1,v=34+r*8,u=f-cut[r],cx=960+(r-1)*210,off=dir*f*v,joined=u>=9,open=u<0?0:joined?0:90*(1-ex(u,4)),step=u<0?0:joined?(r%2?-1:1)*44:(r%2?-1:1)*44*Math.min(1,u/8);
 for(const k of[-1,1]){x.save();x.beginPath();const a=k<0?-100:cx;x.moveTo(k<0?-200:cx-150,y-200);x.lineTo(k<0?cx-150:2200,y-200);x.lineTo(k<0?cx+150:2200,y+h+200);x.lineTo(k<0?-200:cx+150,y+h+200);x.closePath();if(u<0){x.beginPath();x.rect(k<0?-200:960,-200,k<0?1160:1300,1500)}x.translate(k*open,k>0?step:0);x.clip();rect(-400,y,2800,h,r===1?K:B);rect(-400,y+14,2800,6,L);rect(-400,y+h-20,2800,6,L);
 const z=190;x.font=HEL(z);x.letterSpacing='-8px';const tl=x.measureText(txt+'   ').width;x.letterSpacing='0px';for(let q=-2;q<4;q++)tx(txt,((off%tl)+tl)%tl-tl+q*tl,y+h/2+68,r===1?HEL(z):HEL(z),r===1?L:N,{ls:-8});for(let q=-2;q<36;q++)rect((((off%80)+80)%80)+q*80-80,y+32,q%4?4:10,22,L);x.restore()}
 if(joined){x.save();x.translate(cx,y+h/2+step/2);x.rotate(.0);const k=1+.5*ex(u-9,5);x.scale(k,k);x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.moveTo(-230,-178);x.lineTo(-70,-178);x.lineTo(230,178);x.lineTo(70,178);x.closePath();x.fill();x.strokeStyle=R;x.lineWidth=8;x.stroke();x.restore()}else if(u>=0){x.strokeStyle=R;x.lineWidth=10;x.beginPath();x.moveTo(cx-168,y-40);x.lineTo(cx+168,y+h+40);x.stroke()}}
 const near=cut.map(q=>f-q).filter(q=>q>=0&&q<6)[0];o.sh=near!==undefined?20*ex(near,6):5;if(near!==undefined&&near<3)o.inv=near%2===0?1:0;o.ca=1.4;o.grain=.05;o.hal=.2;o.vig=.18;o.blur=b===0?6:0;o.band=.3};
// the erase head crosses the word; what it leaves is dropout and hiss
SCENE.wipe=(o,b,p,t)=>{const f=b*BF+p,u=ss(6,44,f),hx=-40+u*2000;bg(N);{const h=hgt(WORD[2],CW,820);wide(WORD[2],X0,540+h/2,CW,K,HEL,-.045,820)}tx(HAN[2],X1,150,KOR(92,900),K,{al:'right'});
 x.save();x.beginPath();x.rect(0,0,Math.max(0,hx),DH);x.clip();for(let j=0;j<90;j++){const y=j*12,q=rnd(j*7+Math.floor(f/2)*91),keep=Math.max(.16,1-u*.75),sh=(rnd(j+f*13)-.5)*260*u;if(q<.55+.3*u)rect(0,y,DW,12,N);else if(q<.8)x.drawImage(c,0,y*2/3,W,8,sh,y,DW,12);for(let i=0;i<9;i++){const r=rnd(j*57+i*131+f*17);if(r<keep*.5)rect(rnd(j*13+i*7+f*29)*DW,y+2,4+r*r*260,rnd(i+j+f)*8+2,r<.03?R:K)}}x.restore();rect(hx-26,0,52,DH,R);rect(hx+26,0,8,DH,K);
 o.sh=4+10*u;o.ca=2+3*u;o.grain=.08+.06*u;o.hal=.3;o.vig=.2;if(f<6)o.inv=f%2;if(f>=44){o.slit=0;o.mos=[4,8,14,24][f-44]}};
