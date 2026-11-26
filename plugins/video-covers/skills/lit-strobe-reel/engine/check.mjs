// loads film.json with its pack and refuses wrong settings by name
import { existsSync, readFileSync, readdirSync } from "node:fs"; import path from "node:path"; import { fileURLToPath, pathToFileURL } from "node:url"; import { CORE } from "./blocks.mjs"; import { blockCues } from "./audio.mjs"; import { slop } from "./copy.mjs";
export class Bad extends Error{}
const PACKS=path.join(path.dirname(fileURLToPath(import.meta.url)),"../packs");
export async function loadFilm(dir){
 const bad=m=>{throw new Bad("film.json: "+m)},file=path.join(dir,"film.json");if(!existsSync(file))throw new Bad("no film.json in "+dir);let cfg;try{cfg=JSON.parse(readFileSync(file,"utf8"))}catch{bad("not valid JSON")}if(!cfg||typeof cfg!=="object")bad("not valid JSON");
 if(!Number.isFinite(cfg.seed))bad('"seed" must be a number');
 for(const k of["words","sub"])if(!Array.isArray(cfg[k])||cfg[k].length!==3||cfg[k].some(w=>typeof w!=="string"||!w))bad(`"${k}" needs exactly three entries`);
 if(!/^[A-Za-z0-9]{1,8}$/.test(cfg.words[0]))bad(`the first word is drawn in pixel type: 1 to 8 letters or digits, got "${cfg.words[0]}"`);
 if(!cfg.acts?.length||cfg.acts.some(a=>!a?.label||!Array.isArray(a.blocks)||!a.blocks.length))bad('"acts" needs at least one { label, blocks }');const order=cfg.acts.flatMap(a=>a.blocks);
 for(const k of["ink","paper","flood","accent","signal","phosphor"])if(!/^#[0-9a-f]{6}$/i.test(cfg.palette?.[k]||""))bad(`palette.${k} must be a #rrggbb colour`);
 const own=existsSync(path.join(dir,"pack")),name=own?"own":String(cfg.pack||"keys"),pdir=own?path.join(dir,"pack"):path.join(PACKS,name);if(!own&&(!/^[a-z0-9-]+$/.test(name)||!existsSync(path.join(pdir,"data.mjs"))))bad(`no pack "${name}" (have ${readdirSync(PACKS).join(", ")}, or put the film's own in pack/)`);
 for(const f of["data.mjs","scenes.js","shots.py","cues.mjs"])if(!existsSync(path.join(pdir,f)))throw new Bad(`pack ${name}: no ${f}`);
 const load=f=>import(pathToFileURL(path.join(pdir,f))),{default:data,check}=await load("data.mjs"),cues=await load("cues.mjs");
 const err=check?.(cfg);if(err)bad(err);const pack=data(cfg),broken=m=>{throw new Bad(`pack ${name}: ${m}`)};
 if(pack.marks?.filter(Boolean).length!==3)broken("three marks are needed");
 const len={...CORE,...pack.blocks},unknown=order.filter(b=>!Object.hasOwn(len,b)),twice=Object.keys(pack.blocks).find(b=>Object.hasOwn(CORE,b));if(twice)broken(twice+" is a block of every pack");if(unknown.length)bad("unknown block: "+unknown.join(", "));
 if(new Set(order).size!==order.length)bad("a block is listed twice");
 if(cfg.lines!==undefined&&(!Array.isArray(cfg.lines)||cfg.lines.some(l=>typeof l!=="string"||!l)))bad('"lines" must be a list of texts');
 for(const l of[...cfg.acts.map(a=>a.label),...cfg.page||[],...cfg.card||[],...cfg.lines||[],...pack.signs||[]])if(slop(l))bad(`production data is not copy: "${l}"`);
 if(order.includes("page")&&!cfg.page?.length)bad('"page" needs its lines');
 const js=readFileSync(path.join(pdir,"scenes.js"),"utf8");for(const m of pack.marks)if(!js.includes(`MARK.${m}=`))broken("no mark "+m);for(const b of Object.keys(pack.blocks))if(!js.includes(`SCENE.${b}=`))broken("no scene for "+b);
 const py=readFileSync(path.join(pdir,"shots.py"),"utf8");for(const k of Object.keys(pack.shots))if(!py.includes(`def ${k}()`))broken("no shot "+k);
 const need=new Set([...Object.keys(pack.shots).filter(k=>order.includes(k)),...order.includes("dither")?pack.dither.map(d=>d[0]):[],...order.includes("field")?["cols"]:[],...order.filter(b=>b==="index"||b==="print")]);
 const plates={};for(const[k,n]of Object.entries({...pack.shots,cols:24,index:8,print:36}))if(need.has(k))plates[k]=n;if(plates[pack.card]&&!cfg.card?.length)bad('"card" needs the lines of the card');
 const film={cfg,name,pdir,pack,cues,order,len,plates,js};const has=blockCues(film);for(const b of Object.keys(len))if(!has[b])broken("no sound for "+b);
 film.map=[];cfg.acts.forEach((a,i)=>a.blocks.forEach(b=>{for(let k=0;k<len[b];k++)film.map.push({beat:film.map.length,block:b,act:i,at:k})}));
 return film}
