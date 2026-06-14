#!/usr/bin/env python
"""
motion-explainer — turn a storyboard JSON into an animated, narrated explainer MP4
with an original (royalty-free) music bed. Fully offline.

  python motion_explainer.py render <storyboard.json> <out.mp4> [--draft] [--no-music] [--voice NAME]

Storyboard schema: see README.md. Scene templates:
  title | statement | timeline | stat_grid | chips_grid | quote | closing

Visuals: Pillow draws every frame (easing, count-ups, rail fills, cascades, particles).
Voice:   Windows System.Speech (offline). Optional neural via edge-tts+truststore if reachable.
Music:   numpy-synthesised warm/tech pad, side-chain ducked under the narration.
Encode:  ffmpeg bundled with imageio-ffmpeg (no system install).
"""
import argparse, json, math, os, random, subprocess, sys, wave
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import numpy as np
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
TTS_PS1 = os.path.join(HERE, "tts_win.ps1")
FF = imageio_ffmpeg.get_ffmpeg_exe()

# set by mode
W, H, FPS = 1920, 1080, 30
PRESET, CRF = "medium", "19"

# ----------------------------- themes -----------------------------
THEMES = {
    "warm-editorial": {
        "dark_bg": (26, 14, 9), "dark_panel": (46, 28, 19), "glow": (74, 36, 19),
        "light_bg": (249, 244, 238), "light_panel": (236, 227, 216),
        "accent": (196, 98, 45), "accent2": (181, 135, 58),
        "ink_dark": (249, 244, 238), "muted_dark": (150, 132, 118),
        "ink_light": (26, 14, 9), "muted_light": (140, 120, 105),
        "display": "serif", "body": "sans", "music": "warm",
    },
    "tech-dark": {
        "dark_bg": (13, 17, 23), "dark_panel": (28, 35, 51), "glow": (0, 70, 100),
        "light_bg": (240, 243, 247), "light_panel": (223, 229, 238),
        "accent": (0, 212, 255), "accent2": (66, 133, 244),
        "ink_dark": (230, 237, 243), "muted_dark": (157, 167, 179),
        "ink_light": (13, 17, 23), "muted_light": (90, 100, 112),
        "display": "sans", "body": "sans", "music": "tech",
    },
}

FONTS = {}
def font(sz, fam, style=""):
    key = (sz, fam, style)
    if key in FONTS: return FONTS[key]
    table = {
        ("serif", ""): "georgia.ttf", ("serif", "b"): "georgiab.ttf",
        ("serif", "i"): "georgiai.ttf", ("serif", "bi"): "georgiaz.ttf",
        ("sans", ""): "segoeui.ttf", ("sans", "b"): "segoeuib.ttf",
        ("sans", "sb"): "seguisb.ttf",
    }
    fn = table.get((fam, style), "georgia.ttf")
    f = None
    for cand in [fn, "segoeui.ttf", "arial.ttf"]:
        try:
            f = ImageFont.truetype("C:/Windows/Fonts/" + cand, sz); break
        except OSError:
            continue
    FONTS[key] = f or ImageFont.load_default(); return FONTS[key]

def colors(theme, mode):
    return {
        "bg": theme["dark_bg"] if mode == "dark" else theme["light_bg"],
        "panel": theme["dark_panel"] if mode == "dark" else theme["light_panel"],
        "ink": theme["ink_dark"] if mode == "dark" else theme["ink_light"],
        "muted": theme["muted_dark"] if mode == "dark" else theme["muted_light"],
        "accent": theme["accent"], "accent2": theme["accent2"],
        "glow": theme["glow"] if mode == "dark" else None,
    }

# ----------------------------- helpers -----------------------------
def lerp(a, b, t): return a + (b - a) * t
def lerpc(c1, c2, t): return tuple(int(round(lerp(c1[i], c2[i], t))) for i in range(3))
def clamp01(x): return 0.0 if x < 0 else 1.0 if x > 1 else x
def ease_out(x): x = clamp01(x); return 1 - (1 - x) ** 3
def ease_io(x):
    x = clamp01(x); return 4 * x * x * x if x < 0.5 else 1 - ((-2 * x + 2) ** 3) / 2
def appear(t, start, length=0.6): return ease_out((t - start) / length) if t > start else 0.0

def disp_fam(theme): return theme["display"]
def body_fam(theme): return theme["body"]

def txt(d, xy, s, fnt, color, alpha, anchor, bg):
    if alpha <= 0.003: return
    d.text(xy, s, font=fnt, fill=lerpc(bg, color, clamp01(alpha)), anchor=anchor)

def txt_track(d, xy, s, fnt, color, alpha, bg, track=6, anchor="mm"):
    if alpha <= 0.003: return
    col = lerpc(bg, color, clamp01(alpha))
    widths = [d.textlength(ch, font=fnt) for ch in s]
    total = sum(widths) + track * (len(s) - 1)
    x, y = xy
    if anchor.startswith("m"): x -= total / 2
    for ch, w in zip(s, widths):
        d.text((x, y), ch, font=fnt, fill=col, anchor="lm"); x += w + track

def parse_emph(s):
    out, parts = [], s.split("||")
    for i, p in enumerate(parts):
        if p != "": out.append((p, i % 2 == 1))
    return out

def rich_line(d, cx, y, segs, base_f, emph_f, ink, accent, alpha, bg, anchor="mm"):
    widths = []
    for text_, em in segs:
        widths.append(d.textlength(text_, font=emph_f if em else base_f))
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    for (text_, em), w in zip(segs, widths):
        f = emph_f if em else base_f
        col = accent if em else ink
        txt(d, (x, y), text_, f, col, alpha, "lm", bg)
        x += w

def soft_glow_bg(color, glow):
    img = Image.new("RGB", (W, H), color)
    if not glow: return img
    gx, gy, gr, gc = glow
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(layer).ellipse([gx-gr, gy-gr, gx+gr, gy+gr], fill=gc)
    layer = layer.filter(ImageFilter.GaussianBlur(gr * 0.55))
    return Image.blend(img, ImageChops.screen(img, layer), 0.5)

# particles (deterministic, subtle "steam")
_PARTS = {}
def particles(n, seed=7):
    if (n, seed) in _PARTS: return _PARTS[(n, seed)]
    rnd = random.Random(seed)
    ps = [(rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(14, 46),
           rnd.uniform(8, 26), rnd.uniform(0, 6.28)) for _ in range(n)]
    _PARTS[(n, seed)] = ps; return ps
def draw_particles(img, t, color, n=14, strength=0.05):
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for (x0, y0, r, spd, ph) in particles(n):
        y = (y0 - t * spd) % (H + 120) - 60
        x = x0 + math.sin(t * 0.5 + ph) * 18
        a = 0.5 + 0.5 * math.sin(t * 0.8 + ph)
        c = tuple(int(v * (0.4 + 0.6 * a)) for v in color)
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    layer = layer.filter(ImageFilter.GaussianBlur(8))
    return Image.blend(img, ImageChops.screen(img, layer), strength)

# ----------------------------- templates -----------------------------
def t_title(s, th, t, dur):
    c = colors(th, s.get("bg", "dark"))
    img = soft_glow_bg(c["bg"], (960, 210, 700, c["glow"]) if c["glow"] else None)
    if s.get("bg", "dark") == "dark":
        img = draw_particles(img, t, c["accent2"], n=12, strength=0.045)
    d = ImageDraw.Draw(img)
    if s.get("eyebrow"):
        txt_track(d, (960, 150), s["eyebrow"].upper(), font(26, body_fam(th), "sb"),
                  c["accent2"], appear(t, 0.15, 0.6), c["bg"])
    lines = s.get("lines", [])
    n = len(lines); base_y = 540 - (n - 1) * 70
    emph_y = None
    for i, ln in enumerate(lines):
        st = 0.5 + i * 0.38
        a = appear(t, st, 0.7)
        style = ln.get("style", "normal")
        if style == "emph":
            f = font(116, disp_fam(th), "bi" if disp_fam(th) == "serif" else "b"); col = c["accent"]
            emph_y = base_y + i * 140 + 46
        elif style == "muted":
            f = font(74, disp_fam(th)); col = lerpc(c["ink"], c["muted"], 0.4)
        else:
            f = font(100, disp_fam(th)); col = c["ink"]
        txt(d, (960, base_y + i * 140 + int((1 - a) * 36)), ln["text"], f, col, a, "mm", c["bg"])
    if emph_y is not None:
        sw = ease_out((t - 1.4) / 0.7)
        if sw > 0:
            half = int(330 * sw)
            d.rounded_rectangle([960 - half, emph_y + 56, 960 + half, emph_y + 62], radius=3, fill=c["accent"])
    if s.get("sub"):
        txt_track(d, (960, 880), s["sub"].upper(), font(24, body_fam(th), "sb"),
                  c["muted"], appear(t, 1.9, 0.8), c["bg"], track=5)
    return img

def t_statement(s, th, t, dur):
    c = colors(th, s.get("bg", "light"))
    img = soft_glow_bg(c["bg"], (960, 210, 650, c["glow"]) if c["glow"] else None)
    d = ImageDraw.Draw(img)
    if s.get("eyebrow"):
        txt_track(d, (160, 150), s["eyebrow"].upper(), font(26, body_fam(th), "b"),
                  c["accent"], appear(t, 0.1, 0.5), c["bg"], anchor="lm")
    a = appear(t, 0.3, 0.7)
    segs = parse_emph(s.get("headline", ""))
    bf = font(76, disp_fam(th), "b"); ef = font(76, disp_fam(th), "bi" if disp_fam(th) == "serif" else "b")
    x = 160
    for text_, em in segs:
        f = ef if em else bf; col = c["accent"] if em else c["ink"]
        txt(d, (x, 250), text_, f, col, a, "lm", c["bg"]); x += d.textlength(text_, font=f)
    chips = s.get("chips", [])
    for i, ch in enumerate(chips):
        st = 0.9 + i * 0.28; a = appear(t, st, 0.55)
        if a <= 0: continue
        off = int((1 - ease_out((t - st) / 0.55)) * -240)
        x = 160 + off; y = 430 + i * 120
        f = font(40, body_fam(th), "sb"); w = d.textlength(ch, font=f) + 150
        pcol = lerpc(c["bg"], c["panel"], a)
        d.rounded_rectangle([x, y, x + w, y + 92], radius=46, fill=pcol,
                            outline=lerpc(c["bg"], c["accent"], a * 0.6), width=2)
        cx, cy = x + 46, y + 46; lc = lerpc(c["bg"], c["accent"], a)
        d.line([cx-13, cy-13, cx+13, cy+13], fill=lc, width=5)
        d.line([cx-13, cy+13, cx+13, cy-13], fill=lc, width=5)
        txt(d, (x + 86, y + 46), ch, f, c["ink"], a, "lm", pcol)
    if s.get("footnote"):
        txt(d, (160, 900), s["footnote"], font(40, disp_fam(th), "i"),
            c["muted"], appear(t, 1.9, 0.8), "lm", c["bg"])
    return img

def t_timeline(s, th, t, dur):
    c = colors(th, s.get("bg", "dark"))
    img = soft_glow_bg(c["bg"], (960, 560, 640, c["glow"]) if c["glow"] else None)
    d = ImageDraw.Draw(img)
    if s.get("eyebrow"):
        txt_track(d, (960, 150), s["eyebrow"].upper(), font(26, body_fam(th), "b"),
                  c["accent2"], appear(t, 0.1, 0.5), c["bg"])
    txt(d, (960, 300), s.get("headline", ""), font(84, disp_fam(th), "b"),
        c["ink"], appear(t, 0.3, 0.7), "mm", c["bg"])
    nodes = s.get("nodes", []); x0, x1, y = 260, 1660, 600
    d.line([x0, y, x1, y], fill=c["panel"], width=6)
    prog = ease_io((t - 1.0) / max(dur - 1.8, 1))
    fx = int(lerp(x0, x1, clamp01(prog)))
    if t > 1.0: d.line([x0, y, fx, y], fill=c["accent"], width=6)
    for i, node in enumerate(nodes):
        num, label = (node if isinstance(node, list) else [f"{i+1:02d}", node])
        nx = int(lerp(x0, x1, i / max(len(nodes) - 1, 1)))
        active = fx >= nx - 4; r = 26 if active else 18
        d.ellipse([nx-r, y-r, nx+r, y+r], fill=c["bg"],
                  outline=c["accent2"] if active else c["panel"], width=5)
        if active: d.ellipse([nx-9, y-9, nx+9, y+9], fill=c["accent"])
        ca = 1.0 if active else 0.35
        txt(d, (nx, y - 70), num, font(34, disp_fam(th), "b"), c["accent2"], ca, "mm", c["bg"])
        txt(d, (nx, y + 70), label, font(36, body_fam(th), "sb"), c["ink"], ca, "mm", c["bg"])
    if s.get("footnote"):
        txt(d, (960, 820), s["footnote"], font(34, disp_fam(th), "i"),
            c["muted"], appear(t, dur - 2.0, 0.8), "mm", c["bg"])
    return img

def t_stat_grid(s, th, t, dur):
    c = colors(th, s.get("bg", "light"))
    img = soft_glow_bg(c["bg"], (960, 200, 600, c["glow"]) if c["glow"] else None)
    d = ImageDraw.Draw(img)
    if s.get("eyebrow"):
        txt_track(d, (960, 130), s["eyebrow"].upper(), font(26, body_fam(th), "b"),
                  c["accent"], appear(t, 0.1, 0.5), c["bg"])
    txt(d, (960, 235), s.get("headline", ""), font(72, disp_fam(th), "b"),
        c["ink"], appear(t, 0.25, 0.6), "mm", c["bg"])
    stats = s.get("stats", []); cols = min(3, max(1, len(stats)))
    rows = math.ceil(len(stats) / cols); cw = 520
    gx = (W - cols * cw) // 2; gy = 360
    for i, st_ in enumerate(stats):
        r, col_ = divmod(i, cols)
        cx = gx + col_ * cw + cw // 2; cy = gy + r * 300 + 40
        start = 0.5 + i * 0.16; a = appear(t, start, 0.5)
        if a <= 0: continue
        cnt = ease_out((t - start) / 0.9)
        if "text" in st_:
            disp = st_["text"]
        else:
            val = int(round(st_.get("value", 0) * (clamp01(cnt) if st_.get("count", True) else 1)))
            disp = f"{st_.get('prefix','')}{val}{st_.get('suffix','')}"
        txt(d, (cx, cy + int((1 - a) * 24)), disp, font(132, disp_fam(th), "b"),
            c["accent"], a, "mm", c["bg"])
        bw = 150
        d.rounded_rectangle([cx-bw, cy+92, cx-bw + int(2*bw*clamp01(cnt)), cy+100],
                            radius=4, fill=lerpc(c["bg"], c["accent2"], a))
        txt(d, (cx, cy + 145), st_.get("label", ""), font(36, body_fam(th), "sb"),
            c["ink"], a, "mm", c["bg"])
    return img

def t_chips_grid(s, th, t, dur):
    c = colors(th, s.get("bg", "dark"))
    img = soft_glow_bg(c["bg"], (960, 300, 620, c["glow"]) if c["glow"] else None)
    if s.get("bg", "dark") == "dark":
        img = draw_particles(img, t, c["accent2"], n=10, strength=0.04)
    d = ImageDraw.Draw(img)
    segs = parse_emph(s.get("headline", ""))
    bf = font(96, disp_fam(th), "b"); ef = font(104, disp_fam(th), "bi" if disp_fam(th) == "serif" else "b")
    rich_line(d, 960, 320, segs, bf, ef, c["ink"], c["accent"], appear(t, 0.2, 0.7), c["bg"])
    chips = s.get("chips", []); cols = 3
    cw, chh = 460, 130; gx = (W - cols * cw) // 2; gy = 560
    for i, ch in enumerate(chips):
        r, col_ = divmod(i, cols); st = 1.0 + i * 0.16; a = appear(t, st, 0.5)
        if a <= 0: continue
        x = gx + col_ * cw + 30
        y = gy + r * chh + int((1 - ease_out((t - st) / 0.5)) * 30); w = cw - 60
        pcol = lerpc(c["bg"], c["panel"], a)
        d.rounded_rectangle([x, y, x + w, y + 96], radius=20, fill=pcol,
                            outline=lerpc(c["bg"], c["accent2"], a), width=2)
        d.ellipse([x+30, y+40, x+46, y+56], fill=lerpc(c["bg"], c["accent"], a))
        txt(d, (x + 78, y + 48), ch, font(42, body_fam(th), "sb"), c["ink"], a, "lm", pcol)
    return img

def t_quote(s, th, t, dur):
    c = colors(th, s.get("bg", "dark"))
    img = soft_glow_bg(c["bg"], (960, 400, 700, c["glow"]) if c["glow"] else None)
    d = ImageDraw.Draw(img)
    txt(d, (300, 250), "“", font(220, disp_fam(th), "b"), c["accent"], appear(t, 0.1, 0.6), "mm", c["bg"])
    words = s.get("quote", "").split()
    # progressive word reveal
    shown = int(clamp01((t - 0.4) / max(dur - 1.6, 1)) * len(words))
    line = " ".join(words[:max(shown, 1)])
    # wrap
    f = font(58, disp_fam(th), "i")
    import textwrap
    wrapped = textwrap.fill(line, width=42).split("\n")
    for i, ln in enumerate(wrapped[:6]):
        txt(d, (960, 380 + i * 80), ln, f, c["ink"], 1.0, "mm", c["bg"])
    if s.get("attribution"):
        txt(d, (960, 880), "— " + s["attribution"], font(34, body_fam(th), "sb"),
            c["accent2"], appear(t, dur - 1.5, 0.8), "mm", c["bg"])
    return img

def t_closing(s, th, t, dur):
    c = colors(th, s.get("bg", "dark"))
    img = soft_glow_bg(c["bg"], (960, 540, 760, c["glow"]) if c["glow"] else None)
    img = draw_particles(img, t, c["accent2"], n=12, strength=0.05)
    d = ImageDraw.Draw(img)
    if s.get("brand"):
        txt(d, (960, 300), s["brand"], font(72, disp_fam(th), "i"), c["accent2"],
            appear(t, 0.2, 0.7), "mm", c["bg"])
    segs = parse_emph(s.get("headline", ""))
    bf = font(104, disp_fam(th), "b"); ef = font(104, disp_fam(th), "bi" if disp_fam(th) == "serif" else "b")
    rich_line(d, 960, 450, segs, bf, ef, c["ink"], c["accent"], appear(t, 0.6, 0.7), c["bg"])
    if s.get("url"):
        a3 = appear(t, 1.1, 0.6)
        if a3 > 0:
            f = font(44, body_fam(th), "sb"); w = d.textlength(s["url"], font=f) + 120
            x0 = 960 - w // 2; pulse = 0.5 + 0.5 * math.sin((t - 1.1) * 3.0)
            col = lerpc(c["bg"], c["accent"], a3)
            d.rounded_rectangle([x0, 600, x0 + w, 690], radius=45, fill=col)
            d.ellipse([x0+34, 636, x0+52, 654], fill=lerpc(col, (255, 255, 255), 0.3 + 0.7 * pulse))
            txt(d, (960 + 16, 645), s["url"], f, (255, 255, 255), a3, "mm", col)
    if s.get("footer"):
        txt_track(d, (960, 820), s["footer"].upper(), font(22, body_fam(th), "sb"),
                  c["muted"], appear(t, 1.7, 0.8), c["bg"], track=5)
    return img

TEMPLATES = {"title": t_title, "statement": t_statement, "timeline": t_timeline,
             "stat_grid": t_stat_grid, "chips_grid": t_chips_grid, "quote": t_quote,
             "closing": t_closing}

# ----------------------------- music -----------------------------
def make_music(path, dur, style):
    sr = 44100
    n = int(dur * sr)
    buf = np.zeros(n, dtype=np.float64)
    # progressions (semitone offsets from a root)
    if style == "tech":
        root = 110.0  # A2
        prog = [[0, 7, 10, 15], [-2, 5, 8, 12], [3, 10, 14, 19], [-2, 5, 8, 14]]
    else:  # warm
        root = 87.31  # F2
        prog = [[0, 4, 7, 11], [-3, 0, 5, 9], [-7, -2, 2, 5], [-5, 0, 4, 7]]
    hop = 3.6; blk = 4.8
    blk_n = int(blk * sr)
    env = np.sin(np.linspace(0, math.pi, blk_n)) ** 1.4  # smooth attack/release
    k = 0; start = 0.0
    while start < dur:
        chord = prog[k % len(prog)]
        seg = np.zeros(blk_n, dtype=np.float64)
        tt = np.arange(blk_n) / sr
        for j, semi in enumerate(chord):
            f = root * (2 ** (semi / 12.0))
            amp = 0.5 / (j + 1)
            seg += amp * np.sin(2 * math.pi * f * tt)
            seg += 0.18 * amp * np.sin(2 * math.pi * 2 * f * tt)  # soft octave
        # gentle shimmer an octave+fifth up
        seg += 0.06 * np.sin(2 * math.pi * root * 3 * tt) * np.sin(tt * 0.7)
        seg *= env
        s0 = int(start * sr); s1 = min(s0 + blk_n, n)
        buf[s0:s1] += seg[:s1 - s0]
        start += hop; k += 1
    peak = np.max(np.abs(buf)) or 1.0
    buf = (buf / peak) * 0.5
    data = (buf * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(data.tobytes())

# ----------------------------- tts -----------------------------
def synth(text, idx, audio_dir, voice):
    txt_path = os.path.join(audio_dir, f"s{idx}.txt")
    wav_path = os.path.join(audio_dir, f"s{idx}.wav")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File",
                    TTS_PS1, "-TextFile", txt_path, "-OutWav", wav_path,
                    "-Voice", voice, "-Rate", "-1"], check=True)
    with wave.open(wav_path, "rb") as w:
        return wav_path, w.getnframes() / float(w.getframerate())

# ----------------------------- encode -----------------------------
def encode_scene(idx, render_fn, scene, theme, dur, wav, seg_dir):
    nframes = int(round(dur * FPS))
    seg = os.path.join(seg_dir, f"seg_{idx}.mp4")
    cmd = [FF, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", wav,
           "-map", "0:v", "-map", "1:a", "-af", "apad", "-t", f"{nframes/FPS:.4f}",
           "-c:v", "libx264", "-preset", PRESET, "-crf", CRF, "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "160k", "-ar", "44100", seg]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for fi in range(nframes):
        img = render_fn(scene, theme, fi / FPS, nframes / FPS)
        p.stdin.write(img.tobytes())
    p.stdin.close(); p.wait()
    return seg, nframes / FPS

def compose_body(segs, durs, out):
    T = 0.4
    inputs = []
    for s in segs: inputs += ["-i", s]
    filt = []; prev = "[0:v]"; off = durs[0] - T
    for k in range(1, len(segs)):
        o = f"[vx{k}]"; filt.append(f"{prev}[{k}:v]xfade=transition=fade:duration={T}:offset={off:.4f}{o}")
        prev = o; off += durs[k] - T
    vfinal = prev; preva = "[0:a]"
    for k in range(1, len(segs)):
        o = f"[ax{k}]"; filt.append(f"{preva}[{k}:a]acrossfade=d={T}{o}"); preva = o
    if len(segs) == 1: vfinal, preva = "[0:v]", "[0:a]"
    cmd = [FF, "-y"] + inputs + (["-filter_complex", ";".join(filt)] if filt else []) + \
          ["-map", vfinal, "-map", preva, "-c:v", "libx264", "-preset", PRESET, "-crf", CRF,
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out]
    subprocess.run(cmd, check=True, capture_output=True)
    return sum(durs) - (len(segs) - 1) * T

def mix_music(body, music, out, body_dur):
    fo = max(body_dur - 2.0, 0.1)
    fc = (f"[1:a]volume=0.22,afade=t=in:st=0:d=1.5,afade=t=out:st={fo:.2f}:d=2[mus];"
          f"[mus][0:a]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=400[duck];"
          f"[0:a][duck]amix=inputs=2:normalize=0:duration=first[aout]")
    cmd = [FF, "-y", "-i", body, "-i", music, "-filter_complex", fc,
           "-map", "0:v", "-map", "[aout]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", out]
    subprocess.run(cmd, check=True, capture_output=True)

# ----------------------------- orchestrate -----------------------------
def render(args):
    global W, H, FPS, PRESET, CRF
    if args.draft:
        FPS, PRESET, CRF = 24, "ultrafast", "28"
    with open(args.storyboard, encoding="utf-8-sig") as f:
        sb = json.load(f)
    theme = dict(THEMES[sb.get("theme", "warm-editorial")])
    voice = args.voice or sb.get("voice", "Microsoft Zira Desktop")
    work = os.path.splitext(args.output)[0] + "_work"
    audio_dir = os.path.join(work, "audio"); seg_dir = os.path.join(work, "segments")
    os.makedirs(audio_dir, exist_ok=True); os.makedirs(seg_dir, exist_ok=True)

    segs, durs = [], []
    for i, scene in enumerate(sb["scenes"]):
        tmpl = TEMPLATES[scene["template"]]
        wav, adur = synth(scene.get("narration", f"Section {i+1}."), i, audio_dir, voice)
        dur = max(adur + 0.8, 3.5)
        print(f"  scene {i+1}/{len(sb['scenes'])} [{scene['template']}]: VO {adur:.1f}s -> {dur:.1f}s")
        seg, d = encode_scene(i, tmpl, scene, theme, dur, wav, seg_dir)
        segs.append(seg); durs.append(d)

    body = os.path.join(work, "body.mp4")
    print("composing scenes (crossfade)...")
    body_dur = compose_body(segs, durs, body)

    use_music = (not args.no_music) and sb.get("music", theme.get("music")) != "none"
    if use_music:
        print("synthesising music bed + ducking under narration...")
        music = os.path.join(work, "music.wav")
        make_music(music, body_dur + 1.0, sb.get("music", theme.get("music")))
        mix_music(body, music, args.output, body_dur)
    else:
        os.replace(body, args.output)
    print("DONE ->", args.output)

def main():
    p = argparse.ArgumentParser(description="Storyboard JSON -> animated narrated explainer MP4")
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("render")
    r.add_argument("storyboard"); r.add_argument("output")
    r.add_argument("--draft", action="store_true", help="fast low-fps preview")
    r.add_argument("--no-music", action="store_true")
    r.add_argument("--voice", default=None)
    r.set_defaults(func=render)
    args = p.parse_args(); args.func(args)

if __name__ == "__main__":
    main()
