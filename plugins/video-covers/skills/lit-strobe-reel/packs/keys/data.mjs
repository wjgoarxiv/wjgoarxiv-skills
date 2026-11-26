// a keycap, a dial and a blade
export default()=>({
 blocks:{key:2,dial:2,blade:2},
 shots:{key:24,dial:24,blade:24},                       // plates this pack renders, with their frames
 marks:['circle','square','triangle'],
 dither:[['key',12],['dial',6],['blade',11],['cols',14],['key',20],['dial',14],['blade',18],['cols',22]],
 card:'blade',                                          // the blade cuts the printed card
 hand:{x:1420,y:508},  // where the crop leaves its signal disc, and what it says
});
