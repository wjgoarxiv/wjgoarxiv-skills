// the words a film may show. Everything drawn has to come from its own copy; production data never does.
const norm=s=>String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}+-]+/gu," ").trim();
export const copyOf=(cfg,pack)=>[[...cfg.words,...cfg.sub].join(" "),...cfg.acts.map(a=>a.label),...cfg.page||[],...cfg.card||[],...cfg.lines||[],...pack.signs||[]].map(norm);
/** a test for drawn text: a whole line of the copy, a run of whole words of one, the head of a word, or a single glyph */
export function judge(cfg,pack){const copy=copyOf(cfg,pack),heads=cfg.words.map(norm);return s=>{const t=norm(s);return[...t].length<2||copy.some(c=>(" "+c+" ").includes(" "+t+" "))||heads.some(w=>w.startsWith(t))}}
/** production data: counts with a unit, codes, timecodes, sizes, fractions */
export const slop=s=>/\d[\d.,]*\s*(stars?|points?|pts|px|f|fps|bpm|frames?|beats?|s|sec|ms|%|db|hz|cm\/s)(?![\p{L}\p{N}])|(?<!\p{L})(seed|fig|frame|step|beat|take|x|y)\.?\s*\d|\d\s*[x×]\s*\d|\d\s*\/\s*\d|\d\d:\d\d/iu.test(s);
