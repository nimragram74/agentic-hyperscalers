---
name: pdf-to-video
description: Convert a PDF or PowerPoint (PPTX) into a narrated, animated MP4 video with offline voice-over. Use when the user wants to turn a document or slide deck into a video presentation, explainer, or screencast with spoken narration, Ken Burns motion, transitions, and captions.
---

# PDF / PPTX → Narrated Animated Video

Turns a PDF or PPTX into an MP4 with **offline voice-over** (Windows System.Speech),
**Ken Burns** motion, **fade transitions**, and optional **on-screen captions**.
Everything runs locally — no network, no API keys, no admin rights.

## Prerequisites (one-time)

Use the working Python 3.12 interpreter (the system `python` 3.14 is broken on this box):

```
$PY = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
& $PY -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org PyMuPDF python-pptx Pillow imageio-ffmpeg
```

- **Voice-over** uses installed Windows voices (e.g. `Microsoft Zira Desktop`, `Microsoft David Desktop`).
- **ffmpeg** ships inside `imageio-ffmpeg` — no separate install.
- **PPTX visuals:** if LibreOffice (`soffice`) is installed it is used for faithful rendering; otherwise slides are rebuilt from text on a dark theme. For best fidelity, export the deck to PDF first (PowerPoint → File → Export → PDF) and feed the PDF.

## Workflow

Let `SCRIPTS = .claude/skills/pdf-to-video/scripts`, `WORK` = a scratch folder (e.g. `build/video`).

### Step 1 — Extract slides
```
& $PY "<SCRIPTS>/build_video.py" extract "<input.pdf|pptx>" "<WORK>"
```
Produces `<WORK>/slides/slide_NNN.png` and `<WORK>/slides.json` (per-slide `text` + `notes`).

### Step 2 — Write the narration (THIS IS YOUR JOB, the agent)
Read `<WORK>/slides.json`. For **each** slide, write a clear, natural, spoken-style
voice-over paragraph (2–4 sentences). Prefer the slide's `notes` if present; otherwise
summarise its `text`. Avoid reading raw bullet fragments verbatim — make it sound spoken.
Write the result to `<WORK>/narration.json`:
```json
{ "slides": [ { "index": 1, "text": "Welcome to ..." }, { "index": 2, "text": "..." } ] }
```
If you skip this step, the tool falls back to slide notes/text automatically.

### Step 3 — Synthesise voice-over (offline)
```
& $PY "<SCRIPTS>/build_video.py" synth "<WORK>" --voice "Microsoft Zira Desktop" --rate -1
```
Creates `<WORK>/audio/slide_NNN.wav` and `<WORK>/timing.json`. `--rate` is -10..10
(negative = slower/clearer). List voices: `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices().VoiceInfo.Name`.

### Step 4 — Compose the video
```
& $PY "<SCRIPTS>/build_video.py" compose "<WORK>" "<output.mp4>"
```
Add `--no-captions` to disable on-screen text. Output is 1920×1080, H.264 + AAC,
each slide held for its narration length, Ken Burns zoom, 0.4s fade transitions.

## Notes
- For a higher-quality neural voice, swap Step 3 for `edge-tts` (needs network; may be
  blocked by a corporate proxy). The offline SAPI voices always work.
- Re-running is cheap: edit `narration.json` and re-run `synth` + `compose`.
