---
name: agentvfx
description: Agent-directed, music-reactive VFX clips from an FX score. WebGL2 shader templates (psychedelic, spectrum, scope, impact, light, glitch, neo-brutalist collage and lattice), optional Blender background plates, a flash audit on every render, silent ping-pong loops, and a web export for live use in apps and sites. Use when someone asks for a VFX clip, a visualizer, a festival or stage loop, a music-reactive background, or a live shader effect for a web page.
license: Apache-2.0. See LICENSE and NOTICE.
---

# agentvfx

You direct; the engine renders. You never write shader code for a clip. You pick a template, a preset and a few typed parameters, write them into an FX score (JSON), and the engine renders it in headless Chrome (WebGL2), encodes H.264 with ffmpeg, and audits it for flashes.

The engine is the npm package `agentvfx`. It is downloaded on first use, and needs Node.js 20 or later. Every command below runs from the user's working folder; paths inside a score resolve against that folder. Ask before the first download if the user hasn't installed it yet.

## 1. Check the machine

    npx -y agentvfx@0.3.6 doctor

`ok: true` means Chrome with GPU WebGL2 and ffmpeg were found. Otherwise read `blockers` and tell the user what to install (`CHROME_PATH`, `FFMPEG_PATH`). Blender 5.x is needed only for plates (`BLENDER_PATH`).

## 2. Pick a look

    npx -y agentvfx@0.3.6 list            # family, template id, input kind, presets
    npx -y agentvfx@0.3.6 list --json     # with descriptions

`input` says what a template needs: `generative` (nothing), `footage` (`input.video`), or `either`. Start from a preset; change two or three parameters at most per round. Show the user the result before inventing more.

## 3. Write the score

Schema: [fx-score.schema.json](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/schemas/fx-score.schema.json). Minimal, with the user's own clip and track:

```json
{ "version": 1, "template": "lattice", "preset": "vermilion-fine",
  "input": { "video": "my-clip.mp4", "audio": "my-track.mp3" },
  "durationSec": 4, "seed": 47, "out": "my-lattice" }
```

A generative template needs no input at all:

```json
{ "version": 1, "template": "boot-log", "preset": "phosphor", "durationSec": 3, "seed": 7, "out": "my-boot-log" }
```

- `durationSec` is 3–5. `seed` makes the render repeatable.
- `params` override the preset (names and ranges come from the template's `fx.json`).
- `bindings` tie a parameter to an audio feature (`bass`, `onset`, `beat`, `bands.N`, …) with `gain`, `offset`, `attackMs`, `releaseMs`. Keep attack on the onset frame and release short (about 60 ms): snappy reads as professional, heavy smoothing reads as a demo.
- `hits` fire an extra template on an onset or beat; `cuts` hard-cut the stack on a beat; `stack` layers up to two templates over the base.
- `labels` and `textStyle` set the engine's text layer (installed fonts by name; generic fallback when missing).

Check it without rendering:

    npx -y agentvfx@0.3.6 validate my-score.json

## 4. Render and look

    npx -y agentvfx@0.3.6 render my-score.json --out out/my-lattice --width 640 --height 360

Preview small first (640x360), then raise the size for the final. The command prints JSON with the film path, the flash result and the stills. Open `stills/sheet.png` and every strip before you describe the clip to anyone. A render you have not looked at is not done.

Every render burns a small `agentvfx` credit into a corner of the frame (switch it off with `"credit": { "overlay": false }` in the score), writes `CREDIT.txt` and puts the credit line in the MP4 metadata. A credit is appreciated but not required. When you report a finished clip, give the user the line in case they want to paste it:

    Made with agentvfx by Woojin Go - https://github.com/wjgoarxiv/agentvfx

agentvfx is licensed under the Apache License 2.0 (see LICENSE and NOTICE): any use, including commercial use, is allowed under its terms.

## 5. Flash safety

Every render carries a flash audit (general and red flashes per second, WCAG 2.3.1 style). Default mode `stage` keeps full intensity and writes `SAFETY.txt` when limits are exceeded. `"safety": { "mode": "broadcast-safe" }` enforces the limits; `"safeVariant": true` adds `film.safe.mp4` beside the full version. Tell the user plainly when a clip exceeds the limits.

## 6. Background plates (optional, Blender)

    npx -y -p agentvfx@0.3.6 agentvfx-plate --scene terminalcore --shot gallery --out out/plate --width 640 --height 360 --seconds 4

Procedural scenes, no downloaded assets. Use the plate's `film.mp4` as `input.video`. `--quality final` is slow (about 2 minutes per 1080p frame); ask before starting one. See [plates.md](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/references/plates.md).

## 7. Silent loops

    npx -y -p agentvfx@0.3.6 agentvfx-loop out/my-lattice/film.mp4 reels/my-lattice.mp4 --preview reels/preview/my-lattice.webp --audit out/my-lattice/loop-flash.json

Plays the clip forward then backward (no seam, no audio track) and flash-audits the loop played twice. Exit code 3 means the loop exceeds the flash limits. Reversing can double the flashes around a turn; `--hold 6` pauses six frames at each turn, which often brings such a loop back inside the limit. A red change that becomes a red flash when reversed cannot be fixed this way — say so and let the user decide.

## 8. Live on a web page

    npx -y agentvfx@0.3.6 export-web lattice collage --out out/web

Writes a self-contained runtime, the chosen templates and a demo page. Respects `prefers-reduced-motion`. See [web.md](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/references/web.md).

## Rules

- Never ship or commit music you do not have the rights to redistribute. A render's motion may come from a track while the published loop stays silent.
- References inspire; they are not copied. Do not reproduce a frame, logo, mark or font file from someone else's work.
- Do not bundle font files. Name installed fonts; they fall back when absent.

## More

- [template-format.md](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/references/template-format.md): how a template is built (`fx.json`, passes, presets, text layer).
- [plates.md](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/references/plates.md): Blender plates.
- [web.md](https://github.com/wjgoarxiv/agentvfx/blob/v0.3.6/skills/agentvfx/references/web.md): web runtime API.
- Source, tests and templates: https://github.com/wjgoarxiv/agentvfx
