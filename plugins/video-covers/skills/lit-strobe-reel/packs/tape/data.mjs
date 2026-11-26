// a piano-key tape deck, two open reels and a level meter
export default()=>({
 blocks:{deck:2,reel:2,needle:2,wave:2,splice:2,wipe:2},
 shots:{deck:24,reel:24,needle:24},
 marks:['record','play','erase'],
 dither:[['deck',12],['reel',6],['needle',14],['reel',20],['deck',22],['needle',5],['reel',12],['deck',16]],
 signs:['20','10','+3'],  // the scale printed on the meter
 hand:{x:1420,y:508},
});
