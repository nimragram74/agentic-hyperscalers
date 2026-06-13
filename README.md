# Agentic Hyper Scalers — The AI Cloud Command Centre

A dark, futuristic, 6-page enterprise AI intelligence portal covering **Microsoft Azure AI**, **Google Cloud AI**, **Amazon AWS AI** and **Anthropic Claude** — services, certifications, training paths, live news and a side-by-side compare tool.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Pages

| Route             | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `/`               | Animated hero, live ticker, count-up stats, hyperscaler cards, featured news, top certifications, CTA |
| `/hyperscalers`   | Tabbed deep-dive per platform — products, strengths, notable models |
| `/certifications` | Filterable directory (provider + difficulty) with "Most Popular" badges |
| `/training`       | Curated training paths, filterable by provider and free/paid       |
| `/news`           | Live AI news, filter by company, pulsing "Breaking" badges         |
| `/compare`        | Side-by-side comparison table across all four hyperscalers         |

## Design system

Dark tech / enterprise AI — _Bloomberg Terminal meets Apple Keynote_. Tokens, type, and rules live in [`docs/design/style-guide.md`](docs/design/style-guide.md). A `design-enforcer` agent (`.claude/agents/`) audits UI against it.

- Surfaces: `#0D1117` / `#161B22` / `#1C2333`
- Accent: electric cyan `#00D4FF`
- Brand colours: Microsoft `#00BCF2` · Google `#4285F4` · AWS `#FF9900` · Anthropic `#C4622D`
- Type: Space Grotesk (headings), Inter (body)

## Data

All content is data-driven from [`/data`](data):

- `certifications.csv`, `training.csv` — parsed server-side
- `hyperscalers.json`, `news.json`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Deploy

Push to GitHub, then import the repo at [vercel.com](https://vercel.com) → Deploy. Vercel auto-detects Next.js — no config needed. Images load from Pexels via `next/image` (allowed host configured in `next.config.js`).

---

Built with Claude Code · AI Agents Accelerator
