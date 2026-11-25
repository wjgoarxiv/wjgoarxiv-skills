# strobe-reel

A 16:9 typographic reel (1280x720, 60 fps, 150 bpm, with sound) made from one settings file.

**Strobe warning.** Films made here invert the whole frame up to 30 times a second. They are outside the WCAG 2.3.1
flash limit and no flash check runs. Put a warning in front of any film you publish. This kit is kept apart from
`lit-typographic-motion`, whose flash audit stays as it is.

## Make a film

```bash
node make.mjs films/<name>                      # out/film.mp4
node make.mjs films/<name> --stills 20,200,640  # a few frames only
node make.mjs films/<name> --fresh              # render every Blender plate again
```

Needs Node 22+, ffmpeg, Google Chrome, Blender, Helvetica Neue, Pretendard and JetBrainsMono NF. `CHROME_PATH`,
`BLENDER_PATH` and `PRETENDARD_BLACK` point at them when they are not in the usual place. The first build renders
the Blender plates (several minutes); later builds reuse them until a setting they depend on changes.

## film.json

| Key | What it sets |
| --- | --- |
| `tag`, `seed` | The printed code, and the number every random choice comes from |
| `words` | Three words: the key, the dial and the blade. The first is also pixel type, so 1 to 8 letters or digits |
| `sub` | Three Hangul lines, two to four syllables each. Hangul is scaled, never condensed |
| `acts` | The chapters, in order: a label and its blocks. Leave a block out to shorten the film |
| `page`, `card` | Lines on the silent page, and on the card the blade cuts |
| `palette` | `ink`, `paper`, `flood`, `accent`, `signal` (one small mark per frame), `phosphor` (terminal) |

Blocks and their length in beats (one beat is 0.4 s): `impact` 1, `crop` 1, `key` 2, `panels` 2, `crt` 1, `score` 1,
`count` 1, `page` 2, `dial` 2, `field` 2, `scan` 1, `strobe` 2, `index` 2, `modules` 2, `dither` 1, `rest` 1, `slash` 1,
`pieces` 1, `blade` 2, `copies` 2, `bands` 1, `swap` 1, `lock` 4, `print` 4. Sound is written per block and follows the
order. `impact` first and `print` last makes the film loop on one dot; `crop` leads into `key` on the signal mark.

## Files

`engine/reel.html` holds the scenes and the lens, `engine/hw.py` the Blender shots, `engine/audio.mjs` the sound and
`engine/render.mjs` the capture. Everything built lands in `films/<name>/out/`, which git ignores.
