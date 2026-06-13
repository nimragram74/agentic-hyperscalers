# Agentic Hyper Scalers — Design System

**Aesthetic:** Dark tech / enterprise AI. _Bloomberg Terminal meets Apple Keynote_ — dark, data-rich, premium. No light modes, no generic purple-gradient "AI" clichés.

## 1. Colour Tokens

### Surfaces (near-black)

| Token       | Hex       | Use                              |
| ----------- | --------- | -------------------------------- |
| `base-900`  | `#0D1117` | Page background                  |
| `base-800`  | `#161B22` | Raised panels / nav              |
| `base-700`  | `#1C2333` | Cards, table header rows         |
| `base-600`  | `#222B3A` | Hover / active fills             |

### Accents

| Token       | Hex       | Use                              |
| ----------- | --------- | -------------------------------- |
| `accent`    | `#00D4FF` | Primary electric-cyan accent     |
| `microsoft` | `#00BCF2` | Microsoft Azure sections         |
| `google`    | `#4285F4` | Google Cloud sections            |
| `aws`       | `#FF9900` | Amazon AWS sections              |
| `anthropic` | `#C4622D` | Anthropic Claude sections        |

### Text

| Token     | Hex       | Use            |
| --------- | --------- | -------------- |
| `ink-100` | `#E6EDF3` | Primary text   |
| `ink-300` | `#9DA7B3` | Secondary text |
| `ink-500` | `#6B7685` | Muted / labels |

## 2. Typography

- **Headings:** `Space Grotesk` (`font-heading`) — 500/600/700.
- **Body:** `Inter` (`font-body`) — 400/500.
- Eyebrow labels: uppercase, `tracking-[0.22em]`, `text-ink-500`.

## 3. Components

- **Glass card** (`.glass`): `bg-white/[0.03]`, `backdrop-blur-xl`, 1px rgba-white border, inner top highlight.
- **Grid texture** (`.grid-texture`): 44px subtle grid overlay on hero / section backgrounds.
- **Radial glow** (`.glow-radial`): cyan radial behind hero headings.
- **Pill button** (`.pill-btn`): rounded-full, rgba border, 300ms transitions.

## 4. Motion

- Hover transitions: 250–350ms ease.
- Cards lift + emit a brand-coloured glow shadow on hover.
- Stats counters animate up from 0 on scroll-into-view.
- Page transitions: 300ms fade.
- "Breaking" badge: pulsing red dot + glow.

## 5. Rules (enforced by the `design-enforcer` agent)

1. Dark backgrounds only (`#0D1117`, `#161B22`, `#1C2333`). No white/light surfaces.
2. Each hyperscaler section uses its correct brand colour.
3. Space Grotesk for all headings, Inter for body.
4. Glassmorphism cards: rgba white border + backdrop-blur.
5. Glow effects on hover using each hyperscaler's colour.
6. No purple gradients, no white backgrounds, no generic AI aesthetics.
