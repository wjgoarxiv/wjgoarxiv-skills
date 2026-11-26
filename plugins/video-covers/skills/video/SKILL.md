---
name: video
description: The front door for video requests in video-covers. Reads the request, picks the one skill that makes that kind of film (lit-typographic-motion, lit-strobe-reel, agentvfx or readme-studio), says which in one line and loads it. Use when someone asks for a video, film, clip, reel, loop, visualizer or README cover without naming a skill, or asks which video skill to use. A request that already names a skill goes straight to that skill.
---

# video

This skill makes nothing itself. It picks the skill, loads it with the Skill tool, and hands it the request word for
word. The chosen skill then runs its own steps, checks and questions.

## Pick the skill

Go down the table and take the first row that fits.

| The request asks for | Load |
| --- | --- |
| A README to write or rewrite, with or without its animated cover | `video-covers:readme-studio` |
| A cover loop on its own for a README or a hero, or a film with a flash limit: accessible, an ad, broadcast, a public screen | `video-covers:lit-typographic-motion` |
| A music-reactive clip: a visualizer, a festival or stage loop, a shader background, a live effect for a web page | `video-covers:agentvfx` |
| A strobe reel: hard flashing type, a brutalist, Swiss or Bauhaus type reel, three words cut to a beat | `video-covers:lit-strobe-reel` |
| A photoreal scene cut as a strobe reel, where a light, machine or signal in the scene makes the flashing | `video-covers:lit-strobe-reel` (the hybrid: a Blender shot and the reel cut on one schedule) |
| Any other short film: kinetic type, a lyric or quote video, a title sequence, a product or story film | `video-covers:lit-typographic-motion` |

These belong elsewhere; say so in one line and load nothing here:

| The request asks for | Where it goes |
| --- | --- |
| Editing, trimming or captioning footage the user already has | No skill in this plugin |
| Slides or a report with no video noun | `decks:lit-pptx` or `documents:lit-docx` |
| A web page, a video inside a page, UI motion | `design:frontend-ui-ux` |

## How the four differ

| | lit-typographic-motion | lit-strobe-reel | agentvfx | readme-studio |
| --- | --- | --- | --- | --- |
| Makes | A finished short film or a silent cover loop | A 16:9 strobing type reel with sound | A 3-5 s shader clip, a loop or a web effect | A README and its cover |
| Flash check | A flash audit that withholds a failing film | None | A flash audit; it enforces the limit only in `broadcast-safe` mode | A loop seam and reduced-motion check |
| Harness | Every harness | Claude Code only | Claude Code only | Every harness |

## When two rows fit

- A flash limit wins: take lit-typographic-motion, or agentvfx with `broadcast-safe` mode, never lit-strobe-reel.
- A user who is present gets one question naming the two skills and what each would make. Under a bare `lit`, or in a
  non-interactive run, take the higher row and say so in one line.

## Hand-off

1. Say in one line which skill was picked and why, in the user's language.
2. For lit-strobe-reel, put this first: **Strobe warning.** The film inverts the whole frame up to 30 times a second and
   no flash check runs.
3. Load the skill with the Skill tool and pass the request unchanged. Follow that skill from then on; this file has
   no further steps.
