// marks: a, b centre, s half size, f colour, h hole colour
MARK.circle=(a,b,s,f,h)=>{disc(a,b,s,f);disc(a,b,s*.26,h)};
MARK.square=(a,b,s,f,h)=>{rect(a-s,b-s,s*2,s*2,f);rect(a-s*.17,b-s,s*.34,s*2,h)};
MARK.triangle=(a,b,s,f,h)=>{tri(a,b,s,f);x.save();x.beginPath();x.moveTo(a-s,b+s);x.lineTo(a+s,b+s);x.lineTo(a-s,b-s);x.closePath();x.clip();x.translate(a,b);x.rotate(-Math.PI/4);rect(-s*1.6,-s*.11,s*2.2,s*.22,h);x.restore()};
DRAW.page=(a,b,w)=>{rect(a,b,w,w,K);disc(a+w-60,b+w-60,36,R)};
DRAW.strobe=(cx,ws,s,z,lit)=>{rect(cx-ws,540-s,ws*.83,s*2,z);rect(cx+ws*.17,540-s,ws*.83,s*2,z);if(lit)rect(cx-ws*.17,540-s,ws*.34,s*2,L)};
DRAW.flash=(i,a)=>[()=>disc(DW/2,540,200,a),()=>rect(DW/2-180,360,360,360,a),()=>tri(DW/2,540,190,a)][i]();
SCENE.key=(o,b,p,t)=>{plate('key',b===0?4+Math.floor(p/4):11+Math.floor(p/2));rect(X0,66,CW,4,N);o.grain=.085;o.hal=.8;o.ca=2+(b===1?6*ex(p,8):0);o.sh=b===1?24*ex(p,10):0;o.zoom=b===1?.10*ex(p,8):0;if(b===1&&p>=18){o.dith=[0,2,3,4,6,8][p-18]||8}}
SCENE.dial=(o,b,p,t)=>{plate('dial',b===0?Math.floor(p/2):12+Math.floor(p/2));rect(X0,66,CW,4,K);o.grain=.085;o.hal=.7;o.ca=1.8;if(b===1){o.sh=16*ex(p,7);o.inv=p<6&&p%2===0?1:0}}
SCENE.blade=(o,b,p,t)=>{plate('blade',b===0?Math.floor(p/2):12+Math.floor(p/2));rect(X0,66,CW,4,N);o.grain=.085;o.hal=.8;o.ca=2;if(b===0&&p>=22)o.inv=1;if(b===1){o.sh=20*ex(p,8);o.inv=p<6&&p%2===0?1:0;o.zoom=.08*ex(p,7)}}
