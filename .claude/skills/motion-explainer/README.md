# motion-explainer

Turn a **storyboard JSON** into an **animated, narrated explainer video** (MP4) with kinetic
typography, count-up stats, animated timelines, cascading chips, an original royalty-free music
bed, and offline voice-over. Crafted motion graphics — not a page-by-page document dump.

> **Tool-agnostic.** The `SKILL.md` makes this auto-discoverable in **Claude Code**, but the
> engine is just a Python CLI. A teammate, a **GitHub Copilot agent (terminal / agent mode)**, or
> any tool that can run a shell can use it the same way — see "Run it anywhere" below.

## Install (one-time)

```bash
python -m pip install Pillow numpy imageio-ffmpeg
# behind a corporate proxy, add: --trusted-host pypi.org --trusted-host files.pythonhosted.org
```
No admin rights, no API keys, no network at render time. ffmpeg ships inside `imageio-ffmpeg`.
Voice-over uses Windows' built-in System.Speech voices.

## Run it anywhere

```bash
# fast preview (24 fps, ultrafast)
python scripts/motion_explainer.py render examples/brew-and-co.json out.mp4 --draft

# final 1080p
python scripts/motion_explainer.py render examples/brew-and-co.json out.mp4

# options
#   --no-music                     drop the music bed
#   --voice "Microsoft David Desktop"   pick any installed SAPI voice
```

### Using it with GitHub Copilot (agent mode) or a teammate
1. Copy this `motion-explainer` folder into the project.
2. Tell the agent: *"Read &lt;source.pdf&gt;, write a storyboard JSON following
   `motion-explainer/SKILL.md`, then run `motion_explainer.py render` on it."*
3. The agent authors the JSON and runs the CLI; review the MP4 and iterate on the JSON.

## How it works

| Stage | Tech |
|---|---|
| Visuals (every frame) | Pillow — easing, count-ups, rail fills, cascades, particles |
| Voice-over | Windows System.Speech (offline); optional neural `edge-tts` where reachable |
| Music bed | numpy-synthesised pad, side-chain **ducked** under the narration |
| Encode / transitions | ffmpeg (`xfade` + `acrossfade`) bundled via imageio-ffmpeg |

Storyboard schema and scene templates are documented in **SKILL.md**. Start by copying
`examples/brew-and-co.json` and editing it.

## Themes
- `warm-editorial` — espresso/terracotta/caramel/cream, serif display (editorial, premium)
- `tech-dark` — near-black + electric cyan/blue, sans display (product/launch)

Add your own by extending the `THEMES` dict in `scripts/motion_explainer.py`.
