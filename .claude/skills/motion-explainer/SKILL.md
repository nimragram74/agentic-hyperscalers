---
name: motion-explainer
description: Create an animated, narrated explainer/marketing video (MP4) from a storyboard — kinetic typography, count-up stats, animated timelines, cascading chips, an original royalty-free music bed, and offline voice-over. Use when the user wants a polished motion-graphics video from a PDF, slide deck, case study, or topic — NOT a plain page-by-page screen recording. Drives the storyboard-based engine in scripts/motion_explainer.py.
---

# Motion Explainer — storyboard → animated narrated video

Produces a **crafted motion-graphics video**, not an as-is document conversion. You (the agent)
turn the source material into a **storyboard** of animated scenes with a scripted voice-over;
the engine renders every frame, synthesises narration, lays down a music bed, and encodes the MP4.

## Prerequisites (one-time)

Use the working Python 3.12 (system `python` 3.14 is broken on this box):

```
$PY = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
& $PY -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org Pillow numpy imageio-ffmpeg
```

Offline by design: visuals (Pillow), voice (Windows System.Speech), music (numpy synth),
encoding (ffmpeg bundled in imageio-ffmpeg). No admin, no API keys, no network.

## Workflow

1. **Read the source** (PDF/deck/notes). Extract the story, key numbers, phases, and message.
2. **Author a storyboard JSON** (see `examples/brew-and-co.json` and the schema below). For each
   scene: pick a template, fill its fields, and write a **spoken-style narration** line (2–4
   sentences). Keep total narration tight — ~120–160 words ≈ 75–90 seconds.
3. **Render:**
   ```
   & $PY "<skill>/scripts/motion_explainer.py" render storyboard.json out.mp4 --draft   # fast preview
   & $PY "<skill>/scripts/motion_explainer.py" render storyboard.json out.mp4           # final 1080p
   ```
   Flags: `--draft` (fast 24fps preview), `--no-music`, `--voice "Microsoft David Desktop"`.
4. **Review** by extracting frames with ffmpeg; iterate on the JSON and re-render.

## Storyboard schema

```jsonc
{
  "theme": "warm-editorial" | "tech-dark",     // palette + fonts
  "voice": "Microsoft Zira Desktop",            // any installed SAPI voice
  "music": "warm" | "tech" | "none",
  "scenes": [ { "template": "...", "bg": "dark"|"light", "narration": "...", ...fields } ]
}
```

Use `||double pipes||` inside a headline to mark the **emphasis** segment (accent colour / italic).

### Scene templates
| template | fields | use for |
|---|---|---|
| `title` | `eyebrow`, `lines:[{text,style:normal\|emph\|muted}]`, `sub` | hook / opening |
| `statement` | `eyebrow`, `headline` (`\|\|emph\|\|`), `chips:[..]`, `footnote` | a point + supporting chips |
| `timeline` | `eyebrow`, `headline`, `nodes:[["01","Label"],...]`, `footnote` | phases / process (animated rail) |
| `stat_grid` | `eyebrow`, `headline`, `stats:[{value,prefix,suffix,label,count?}\|{text,label}]` | metrics (count-up) |
| `chips_grid` | `headline` (`\|\|emph\|\|`), `chips:[..]` | roles / features (cascade) |
| `quote` | `quote`, `attribution` | testimonial / pull quote |
| `closing` | `brand`, `headline` (`\|\|emph\|\|`), `url`, `footer` | call-to-action / close |

## Notes
- **Better voice:** offline SAPI is reliable but robotic. The engine supports neural `edge-tts`
  on networks that allow it; behind a TLS-intercepting corporate proxy it is typically blocked.
- **Reusable across topics & brands:** swap `theme` to `tech-dark` for a product/launch look.
- See `README.md` for running outside Claude Code (plain CLI / Copilot agent / a teammate).
