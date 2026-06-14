# Installing the team skills

Two Claude Code skills live here:
- **motion-explainer** — storyboard → animated, narrated explainer video (with music)
- **pdf-to-video** — PDF/PPTX → narrated slide video

## Fastest path (Windows, one command)

From a clone of this repo:

```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\install.ps1
```

This finds your Python, installs the dependencies, and copies both skills into
`%USERPROFILE%\.claude\skills\` (user-level = available in **every** project).
**Restart Claude Code** afterwards.

## Manual path (any OS)

1. **Get the files** — clone the repo, or copy the `motion-explainer` / `pdf-to-video`
   folders out of `.claude/skills/`.
2. **Place them** in one of:
   - **User-level (recommended):** `~/.claude/skills/<skill>`
     (Windows: `C:\Users\<you>\.claude\skills\<skill>`) → every project sees it.
   - **Project-level:** `<project>/.claude/skills/<skill>` → that project only
     (you already have this if you cloned the repo).
3. **Install Python deps** (Python 3.10–3.12):
   ```bash
   python -m pip install Pillow numpy imageio-ffmpeg python-pptx PyMuPDF
   # corporate proxy? add: --trusted-host pypi.org --trusted-host files.pythonhosted.org
   ```
4. **Restart Claude Code.** Confirm with `/` — the skills should appear, or ask
   Claude to "use the motion-explainer skill".

## Requirements & caveats

| Need | Notes |
|---|---|
| **Claude Code** | CLI or IDE extension. (The Claude.ai *web/desktop chat* "Skills" feature is separate and cannot run these — they need your local machine.) |
| **Python 3.10–3.12** | A working interpreter. ffmpeg is bundled via `imageio-ffmpeg` — no admin install. |
| **Voice-over** | Uses **Windows** System.Speech (offline). On macOS/Linux every step works *except* the VO — swap in `say` (mac) or another TTS, or run `--no-music` and add VO later. |
| **Neural voice (optional)** | `pip install edge-tts truststore` for natural voices; blocked by some corporate proxies. |

## Run without Claude Code (CLI / GitHub Copilot agent)

The engines are plain Python CLIs — usable by a teammate or a Copilot agent in a terminal:

```bash
python motion-explainer/scripts/motion_explainer.py render storyboard.json out.mp4
python pdf-to-video/scripts/build_video.py extract deck.pdf work/
```

See each skill's `README.md` / `SKILL.md` for full usage.
