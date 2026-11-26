export default({T,beat,hum,click,boom,kick,G,tick,stab,slash,ring})=>({
key(){hum(T(0),beat);click(T(1),1);boom(T(1));kick(T(1),1.1);G(1,.13,65,.25);for(let i=0;i<6;i++)tick(T(1)+.3+i/60,2600-i*260,.2)},
dial(){for(let i=0;i<9;i++)click(T(0)+.05+i*.034+i*i*.0006,.32);click(T(1)-.03,1);kick(T(1),1.1);boom(T(1));stab(T(1),41.2,.5,.4)},
blade(){slash(T(0)+.36);hum(T(0),beat*.9,.03);click(T(1)-.03,1);boom(T(1));kick(T(1),1.1);slash(T(1));ring(T(1))}
});
