// node make.mjs <film folder> [--stills 10,200,...] [--fresh]
// film.json in, out/film.mp4 out. Rendered plates are reused until a setting they depend on changes.
import { spawnSync } from "node:child_process"; import { createHash } from "node:crypto"; import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const kit=path.dirname(fileURLToPath(import.meta.url)), dir=path.resolve(process.argv[2]||""), out=path.join(dir,"out"), plates=path.join(out,"plates"), cfgPath=path.join(dir,"film.json");
const cfg=JSON.parse(readFileSync(cfgPath,"utf8")), stills=process.argv.indexOf("--stills"), fresh=process.argv.includes("--fresh");
const CHROME=process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", BLENDER=process.env.BLENDER_PATH||"/Applications/Blender.app/Contents/MacOS/Blender";
const BLOCKS=["impact","crop","key","panels","crt","score","count","page","dial","field","scan","strobe","index","modules","dither","rest","slash","pieces","blade","copies","bands","swap","lock","print"];
const bad=m=>{console.error("film.json: "+m);process.exit(2)};
for(const k of["words","sub"])if(cfg[k]?.length!==3||cfg[k].some(w=>!w))bad(`"${k}" needs exactly three entries`);
if(!/^[A-Za-z0-9]{1,8}$/.test(cfg.words[0]))bad(`the first word is drawn in pixel type: 1 to 8 letters or digits, got "${cfg.words[0]}"`);
if(!cfg.acts?.length||cfg.acts.some(a=>!a.label||!a.blocks?.length))bad('"acts" needs at least one { label, blocks }');const order=cfg.acts.flatMap(a=>a.blocks);
for(const k of["ink","paper","flood","accent","signal","phosphor"])if(!/^#[0-9a-f]{6}$/i.test(cfg.palette?.[k]||""))bad(`palette.${k} must be a #rrggbb colour`);
const unknown=order.filter(b=>!BLOCKS.includes(b));if(unknown.length)bad("unknown block: "+unknown.join(", "));
if(new Set(order).size!==order.length)bad("a block is listed twice");
mkdirSync(plates,{recursive:true});
const run=(c,a,quiet)=>{const r=spawnSync(c,a,{encoding:"utf8",maxBuffer:1<<28});if(r.status!==0||/Traceback|^Error/m.test(r.stdout+r.stderr)){console.error((r.stdout+r.stderr).split("\n").slice(-25).join("\n"));process.exit(1)}if(!quiet)process.stdout.write(r.stdout)};
const font=process.env.PRETENDARD_BLACK||spawnSync("fc-list",[":family=Pretendard","file"],{encoding:"utf8"}).stdout.split("\n").map(l=>l.replace(/:.*$/,"")).find(f=>/Pretendard-Black\.(otf|ttf)$/.test(f));
if(!font)bad("Pretendard Black is not installed; set PRETENDARD_BLACK to its file");
const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const shot=(name,w,h,body)=>{const f=path.join(out,name+".html");writeFileSync(f,`<!doctype html><meta charset="utf-8">${body}`);const png=path.join(plates,name+".png"),t0=Date.now()-1000;spawnSync(CHROME,["--headless=new","--screenshot="+png,`--window-size=${w},${h}`,"--hide-scrollbars","--force-device-scale-factor=1","file://"+f],{timeout:30000});
 // Chrome can exit non-zero after a good capture, so the fresh file decides
 if(!existsSync(png)||statSync(png).mtimeMs<t0){console.error("Chrome did not draw "+name);process.exit(1)}};
const fitjs=(id,w)=>`<script>{const e=document.getElementById('${id}');let z=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>${w}&&z>20){z-=2;e.style.fontSize=z+'px'}}</script>`;
const P=cfg.palette;
writeFileSync(path.join(out,"reel.html"),readFileSync(path.join(kit,"engine/reel.html"),"utf8").replace("/*CFG*/",()=>"const CFG="+JSON.stringify(cfg).replace(/</g,"\\u003c")));
const reel=(...a)=>run(process.execPath,[path.join(kit,"engine/render.mjs"),out,...a]);
const hw=readFileSync(path.join(kit,"engine/hw.py"));
const bake=(name,dep)=>{const key=createHash("sha256").update(hw).update(JSON.stringify(dep)).digest("hex"),mark=path.join(plates,name+".key");if(!fresh&&existsSync(mark)&&readFileSync(mark,"utf8")===key)return;console.log("plates: "+name);run(BLENDER,["-b","--factory-startup","-P",path.join(kit,"engine/hw.py"),"--",name,path.join(plates,name),"100","32","all",font,cfgPath],true);writeFileSync(mark,key)};
shot("mask",960,540,`<body style="margin:0;background:#000;width:960px;height:540px;overflow:hidden;display:flex;align-items:center;justify-content:center"><div id="m" style="font:700 372px/1 'Helvetica Neue';letter-spacing:-.037em;color:#fff;white-space:nowrap;max-width:890px">${esc(cfg.words[1])}</div>${fitjs("m",890)}`);
shot("card",860,1280,`<body style="margin:0;background:#e6e9e9;width:860px;height:1280px;overflow:hidden;font-family:'Helvetica Neue';color:#060606;position:relative"><div style="position:absolute;left:44px;top:40px;font-weight:700;font-size:26px">03</div><div style="position:absolute;right:44px;top:40px;font-weight:700;font-size:26px">${esc(cfg.words[2])}</div><div style="position:absolute;left:44px;right:44px;top:88px;height:5px;background:#060606"></div><div id="m" style="position:absolute;left:26px;top:430px;width:800px;white-space:nowrap;font:700 430px/1 'Helvetica Neue';letter-spacing:-.055em">${esc(cfg.words[2])}</div><svg style="position:absolute;left:44px;top:130px" width="300" height="270"><polygon points="0,270 300,270 0,0" fill="${P.flood}"/></svg><div style="position:absolute;left:44px;bottom:60px;font:700 30px/1.25 'Helvetica Neue'">${cfg.card.map(esc).join("<br>")}</div>${fitjs("m",800)}`);
for(const n of["key","dial","field","blade","index"])bake(n==="field"?"cols":n,[cfg.words,cfg.card,cfg.palette]);
reel("--poster"); bake("print",cfg);
run(process.execPath,[path.join(kit,"engine/audio.mjs"),cfgPath,path.join(out,"audio.wav")]);
if(stills>0)reel("--stills",process.argv[stills+1]);else reel("--film");
