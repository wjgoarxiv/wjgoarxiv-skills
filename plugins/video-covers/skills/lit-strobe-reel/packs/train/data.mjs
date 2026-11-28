// one platform shot at 30 fps, 408 frames (13.6 s). The train is written once here: Blender moves it by these numbers,
// the reel cuts when a lit window crosses the bench and the sound clacks when a bogie does. Frames are shot frames.
const V=16,HEAD=144,PITCH=18.6,WIN=[2.8,5.8,8.8,11.8,14.8],BOG=[2.5,16.1],CARS=4,at=d=>HEAD+d*30/V;
const wins=()=>{const w=[];for(let i=0;i<CARS;i++)for(const c of WIN)w.push(+at(i*PITCH+c).toFixed(2));return w};
const joints=()=>{const j=[];for(let i=0;i<CARS-1;i++)j.push(+at(i*PITCH+18.3).toFixed(2));return j};
const bogies=()=>{const b=[];for(let i=0;i<CARS;i++)for(const c of BOG)b.push(+at(i*PITCH+c).toFixed(2));return b};
export default cfg=>({blocks:{empty:6,approach:6,pass:12,tail:2,clunk:6},shots:{plat:408},marks:['lamp','window','can'],
 dither:[['plat',30],['plat',120],['plat',160],['plat',200],['plat',260],['plat',300],['plat',350],['plat',400]],hand:{x:960,y:540},
 shot:{v:V,head:HEAD,pitch:PITCH,cars:CARS,win:WIN,bog:BOG,wins:wins(),joints:joints(),bogies:bogies(),tail:+at(CARS*PITCH-.3).toFixed(2),
  cuts:[84,98,109,118,125,131,135,138,141,143],can:350}});
