// marks: a, b centre, s half size, f colour, h hole colour
const shaft=(a,b,s,f)=>{x.fillStyle=f;x.beginPath();x.moveTo(a-s,b-s*.26);x.lineTo(a+s*.1,b-s*.26);x.lineTo(a+s*.1,b-s*.8);x.lineTo(a+s,b);x.lineTo(a+s*.1,b+s*.8);x.lineTo(a+s*.1,b+s*.26);x.lineTo(a-s,b+s*.26);x.closePath();x.fill()};
MARK.arrow=(a,b,s,f,h)=>{disc(a,b,s,f);shaft(a,b,s*.62,h)};
MARK.rails=(a,b,s,f,h)=>{for(let i=0;i<4;i++)rect(a-s,b-s*.86+i*s*.5,s*2,s*.2,f);for(const k of[-1,1])rect(a+k*s*.52-s*.13,b-s,s*.26,s*2,f)};
MARK.door=(a,b,s,f,h)=>{rect(a-s,b-s,s*2,s*2,f);rect(a-s*.72,b-s*.76,s*1.44,s*1.76,h);x.fillStyle=f;x.beginPath();x.moveTo(a-s*.72,b-s*.76);x.lineTo(a+s*.2,b-s*.42);x.lineTo(a+s*.2,b+s);x.lineTo(a-s*.72,b+s);x.closePath();x.fill();rect(a,b+s*.12,s*.11,s*.22,h)};
DRAW.page=(a,b,w)=>{rect(a,b,w,w,B);MARK.door(a+w/2,b+w/2,w*.34,K,B)};
DRAW.strobe=(cx,ws,s,z,lit)=>{shaft(cx,540,ws,lit?R:z)};
DRAW.flash=(i,a,h)=>ICON[i](DW/2,540,200,a,h);
// signage strip over a photographed shot
const sign=(n,w,y=952,f=B)=>{rect(0,y,DW,128,f);ICON[n](118,y+64,42,K,f);tx(w,196,y+92,HEL(78),K,{ls:-3});tx(HAN[n],X1,y+88,KOR(64,800),K,{al:'right'})};
SCENE.flap=(o,b,p,t)=>{plate('flap',b*12+Math.floor(p/2));sign(0,WORD[0]);o.grain=.085;o.hal=.9;o.ca=1.8;if(b===1){o.sh=14*ex(p,8);if(p<6)o.inv=p%2===0?1:0}else o.sh=5};
SCENE.gate=(o,b,p,t)=>{plate('gate',b*12+Math.floor(p/2));sign(1,WORD[1],0);o.grain=.085;o.hal=.8;o.ca=2;if(b===1){o.sh=20*ex(p,7);o.zoom=.08*ex(p,6);if(p>=19)o.mos=[6,10,18,32,60][p-19]}};
SCENE.doors=(o,b,p,t)=>{plate('doors',b*12+Math.floor(p/2));sign(2,WORD[2],952,b&&p<8&&st(p,2)?R:B);o.grain=.08;o.hal=1.1;o.ca=2;if(b===1){o.exp=1+.5*ex(p,10);o.sh=10*ex(p,8);o.zoom=-.04*ex(p,12)}};
// a wall of split flaps: 12 x 5 cells that land column by column
const FWG='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',FWR=[WORD[0].toUpperCase(),WORD[1].toUpperCase(),WORD[2].toUpperCase(),HAN[0],HAN[2]];
const fchar=(s,cx,cy,f)=>{const z=s==='W'||s==='M'?148:176;x.font=HEL(z);x.textAlign='center';x.fillStyle=f;x.fillText(s,cx,cy+z*.357);x.textAlign='left'};
function fcell(cx,cy,w,h,from,to,u,bk,fg){const half=(s,top,f,k)=>{x.save();x.beginPath();x.rect(cx-w/2,top?cy-h/2:cy,w,h/2);x.clip();rect(cx-w/2,cy-h/2,w,h,f);fchar(s,cx,cy,fg);if(k){x.fillStyle=`rgba(0,0,0,${k})`;x.fillRect(cx-w/2,cy-h/2,w,h)}x.restore()};
 half(to,true,bk);half(from,false,bk);if(u<1){const k=Math.cos(u*Math.PI);x.save();x.translate(0,cy);x.scale(1,Math.abs(k));x.translate(0,-cy);k>0?half(from,true,bk,.45*(1-k)):half(to,false,bk,.45*(1+k));x.restore()}else half(to,false,bk);
 rect(cx-w/2,cy-3,w,6,'#000');rect(cx-w/2-3,cy-18,7,36,'#000');rect(cx+w/2-4,cy-18,7,36,'#000')}
SCENE.flapwall=(o,b,p,t)=>{const f=b*BF+p,w=160,h=216;bg('#000');for(let j=0;j<5;j++)for(let i=0;i<12;i++){const s=FWR[j].padEnd(12).slice(0,12),land=8+i*2+j*3,n=Math.floor(f/3),k=i+j*12,done=f>=land,pick=q=>q*3+2>=land?s[i]:FWG[Math.floor(rnd(k*31+q)*36)],lit=j<3&&b===1&&Math.floor(p/8)===j&&s[i]!==' ',full=f>=44;
 fcell(i*w+w/2,j*h+h/2,w-10,h-10,pick(n-1),pick(n),done?1:(f%3+.5)/3,full||lit?(full&&j%2?K:B):'#17171a',full||lit?(full&&j%2?B:K):j<3?N:B)}
 o.sh=b===0?4:f>=44?14:6*ex(p%8,4);o.grain=.07;o.ca=1.5;o.hal=.6;if(f>=44)o.inv=f%2;o.blur=b===0?5*ex(p,14):0;o.band=.25};
// the route: every stop is a block of this film, and the first of a chapter carries its name
SCENE.linemap=(o,b,p,t)=>{const f=b*BF+p,me=PACK.stops.indexOf('linemap'),P=PACK.route,n=P.length;bg(B);const go=f<26?Math.min(me,f*me/22):me,seg=(q,w,c)=>{x.strokeStyle=c;x.lineWidth=w;x.lineJoin='round';x.lineCap='butt';x.beginPath();x.moveTo(...P[0]);for(let i=1;i<n&&i-1<q;i++){const k=Math.min(1,q-i+1);x.lineTo(P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k)}x.stroke()};
 const cam=1.06+.05*ex(f,26);x.save();x.translate(P[me][0],P[me][1]);x.scale(cam,cam);x.translate(-P[me][0],-P[me][1]);seg(n-1,52,'#00000024');if(f>=26)seg(me+(n-1-me)*(1-ex(f-26,16)),52,K);seg(go,52,K);
 for(let i=0;i<n;i++){const on=i<=go+.2,[a,c]=P[i],hot=i===Math.round(go)||(f>=26&&i===me);if(!on&&f<26+Math.max(0,i-me)*1.2)continue;disc(a,c,hot?62:27,hot?R:N);if(!hot)ringS(a,c,27,K,11);else{ringS(a,c,62,N,12);}
  const low=i<n-1&&P[i+1][1]<c-9;x.save();x.translate(a+(hot?34:16),low?c+(hot?96:66):c-(hot?64:44));x.rotate(low?Math.PI/4:-Math.PI/4);tx(PACK.names[i],0,0,HEL(hot?70:44,hot?700:500),K,{ls:-1});x.restore()}x.restore();
 rect(0,0,DW,92,K);tx(WORD[1],X0,70,HEL(64),B,{ls:-2});tx(HAN[1],X1,70,KOR(56,800),N,{al:'right'});
 o.ca=1.4;o.grain=.04;o.vig=.15;o.hal=.15;o.sh=f<26?3:12*ex(f-26,8);if(f>=26&&f<32)o.inv=f%2;if(f>=42)o.zoom=(f-41)*.05};
// passing windows that shorten by the beat
SCENE.tunnel=(o,b,p,t)=>{const f=b*BF+p;bg(K);if(b===0){const v=20+f*9,off=f*(26+f*5.2),w=900-f*22,g=w*.28;for(let r=0;r<2;r++)for(let i=-3;i<14;i++){let a=((i*(w+g)-off*(r?1:.82))%((w+g)*10)+(w+g)*10)%((w+g)*10)-(w+g)*2,y=r?150:640,h=r?430:290,c=(i+20)%5===0?B:N;rect(a,y,w,h,c);rect(a+w*.62,y,12,h,K);if((i+20)%3===0){disc(a+w*.3,y+h*.62,h*.2,K);rect(a+w*.3-h*.26,y+h*.74,h*.52,h*.26,K)}}rect(0,600,DW,16,R);o.sh=8+f*.4;o.ca=2+f*.12;o.zoom=0;o.blur=8+f*.3;o.band=.05;if(f%6<1)o.inv=1}
 else{const q=p,s=(q*q*.032+q*.22)%1;for(let i=0;i<=12;i++){const z=(i+1-s),k=1/(z*.5),hw=900*k,hh=620*k,c=(i+Math.floor(q*q*.032+q*.22))%2?K:[N,B,N,N][(i+Math.floor(q*.5))%4];rect(960-hw,540-hh,hw*2,hh*2,c)}
  x.strokeStyle=R;x.lineWidth=14;for(const k of[-1,1]){x.beginPath();x.moveTo(960,560);x.lineTo(960+k*900,1300);x.stroke()}if(q>=21){bg(K);disc(960,540,[90,40,12][q-21],N)}o.zoom=.05+q*.012;o.sh=12+q;o.ca=4+q*.2;o.inv=q<18&&q%[6,6,5,4,3,2][Math.floor(q/3)]===0?1:0}
 o.grain=.08;o.hal=.9};
