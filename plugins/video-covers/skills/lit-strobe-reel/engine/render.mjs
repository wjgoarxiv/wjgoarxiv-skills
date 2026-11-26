import { spawn } from "node:child_process"; import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import path from "node:path";
const here=path.resolve(process.argv[2]), mode=process.argv[3], arg=process.argv[4];
const still=mode==="--stills", W=1280,H=720, prof=mkdtempSync(path.join(tmpdir(),"reel-"));
const ch=spawn(process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",["--headless=new","--remote-debugging-port=0","--user-data-dir="+prof,`--window-size=${W},${H}`,"--force-device-scale-factor=1","--force-color-profile=srgb","--hide-scrollbars","--no-first-run","--use-mock-keychain","--password-store=basic","--use-angle=metal","--ignore-gpu-blocklist","--allow-file-access-from-files","file://"+here+"/reel.html"],{stdio:["ignore","ignore","pipe"]});
const ws=await new Promise(r=>{let t="";ch.stderr.on("data",d=>{t+=d;const m=t.match(/ws:\/\/[^\s]+/);if(m)r(m[0])})});
const port=new URL(ws).port; let tgt; for(let i=0;i<50&&!tgt;i++){tgt=(await(await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t=>t.url.includes("reel.html"));await new Promise(r=>setTimeout(r,100))}
const sock=new WebSocket(tgt.webSocketDebuggerUrl);await new Promise(r=>sock.onopen=r);let id=0;const pend=new Map();const bad=[];sock.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown'){const d=m.params.exceptionDetails;bad.push((d.exception?.description||d.text)+' at '+(d.url||'')+':'+d.lineNumber)}if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')bad.push('console.error: '+m.params.args.map(a=>a.value||a.description).join(' '));if(pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}};
const send=(method,params={})=>new Promise(r=>{pend.set(++id,r);sock.send(JSON.stringify({id,method,params}))});
const ev=async e=>{const r=await send("Runtime.evaluate",{expression:e,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw new Error(r.result.exceptionDetails.exception?.description||r.result.exceptionDetails.text);return r.result.result.value};
await send("Emulation.setDeviceMetricsOverride",{width:W,height:H,deviceScaleFactor:1,mobile:false});
await send('Runtime.enable');const stop=async m=>{console.error('Error: '+m);ch.kill();await new Promise(r=>ch.on('close',r));rmSync(prof,{recursive:true,force:true,maxRetries:5});process.exit(1)};
const loaded=await ev('window.ready').catch(e=>bad.push(e.message)&&0);if(bad.length||!loaded)await stop('page: '+(bad.join(' | ')||'it did not finish loading'));console.log(loaded);const FR=await ev('window.FR');
const grab=async f=>Buffer.from((await ev(`draw(${f});document.getElementById('g').toDataURL('image/jpeg',1).slice(23)`)),"base64");
try{
 if(mode==="--poster"){writeFileSync(here+"/plates/poster.png",Buffer.from(await ev("flat()"),"base64"))}
 else if(mode==="--texts")writeFileSync(here+"/texts.json",JSON.stringify(await ev("texts()")))
 else if(still){mkdirSync(here+"/stills",{recursive:true});let i=0;for(const f of arg.split(","))writeFileSync(`${here}/stills/${String(i++).padStart(3,"0")}.jpg`,await grab(+f))}
 else{const ff=spawn("ffmpeg",["-y","-loglevel","error","-f","image2pipe","-c:v","mjpeg","-r","60","-i","-","-i",here+"/audio.wav","-c:v","libx264","-preset","fast","-crf","21","-tune","grain","-maxrate","14M","-bufsize","20M","-pix_fmt","yuv420p","-vf","scale=in_range=pc:out_range=tv:out_color_matrix=bt709","-colorspace","bt709","-color_primaries","bt709","-color_trc","bt709","-color_range","tv","-c:a","aac","-b:a","256k","-movflags","+faststart","-shortest",here+"/film.mp4"],{stdio:["pipe","inherit","inherit"]});
  for(let f=0;f<FR;f++)if(!ff.stdin.write(await grab(f)))await new Promise(r=>ff.stdin.once("drain",r));ff.stdin.end();await new Promise(r=>ff.on("close",r));console.log("rendered",FR)}
 if(bad.length){console.error('Error: page: '+bad.join(' | '));process.exitCode=1}
}catch(e){console.error('Error: page: '+[...bad,e.message].join(' | '));process.exitCode=1}finally{ch.kill();await new Promise(r=>ch.on("close",r));rmSync(prof,{recursive:true,force:true,maxRetries:5})}
