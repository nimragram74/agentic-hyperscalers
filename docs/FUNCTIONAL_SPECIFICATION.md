# Functional Specification — Agentic Hyper Scalers

**The AI Cloud Command Centre**

| | |
|---|---|
| **Document** | Functional Specification (FSD) |
| **Product** | Agentic Hyper Scalers — The AI Cloud Command Centre |
| **Version** | 1.0 |
| **Status** | Baselined |
| **Date** | 2026-06-14 |
| **Author** | Raghuram Nimishakavi |
| **Repository** | https://github.com/nimragram74/agentic-hyperscalers |
| **Live URL** | https://agentic-hyperscalers.vercel.app |
| **Related docs** | [Design Document](./DESIGN_DOCUMENT.md) · [Design System](./design/style-guide.md) |

---

## 1. Introduction

### 1.1 Purpose
This document defines the **functional behaviour** of the Agentic Hyper Scalers portal — a dark, enterprise-grade web application that positions itself as the definitive single-pane resource for enterprise AI decisions across the four major AI hyperscalers: **Microsoft Azure AI, Google Cloud AI, Amazon AWS AI, and Anthropic Claude**.

It describes *what* the system does (features, screens, rules, data) so that engineering, design, QA, and stakeholders share one authoritative reference. The companion [Design Document](./DESIGN_DOCUMENT.md) describes *how* it is built.

### 1.2 Scope
The portal is a **6-page, read-only intelligence hub**. It surfaces curated, data-driven content with rich filtering, comparison, and live-feel presentation. It is **content-presentation software** — there is no authentication, no write-back, and no server-side database.

**In scope**
- Six public pages: Home, Hyperscalers, Certifications, Training, News, Compare.
- Client-side filtering and tabbed navigation.
- Data-driven rendering from version-controlled CSV/JSON files.
- Outbound deep-links to official certification and training pages.
- Responsive, animated dark UI honouring a defined design system.

**Out of scope** (see §9)
- User accounts, personalisation, saved state.
- Content management UI / authoring tools.
- Real-time news ingestion / external API calls at runtime.
- Payments, e-commerce, or enrolment.

### 1.3 Intended audience
Product owners, front-end engineers, UI/UX designers, QA engineers, and leadership reviewers.

### 1.4 Definitions
| Term | Meaning |
|---|---|
| **Hyperscaler** | One of the four covered AI cloud providers. |
| **Provider / Brand** | Synonym for a hyperscaler; each owns a brand colour. |
| **Command Deck** | The live-dashboard panel in the homepage hero. |
| **Design Enforcer** | A project sub-agent that audits UI against the design system. |
| **Glassmorphism** | Translucent, blurred card surface used throughout. |

---

## 2. Product overview

### 2.1 Vision
> A Bloomberg-Terminal-meets-Apple-Keynote command centre that lets an enterprise audience understand, compare, and act on the AI offerings of every major hyperscaler — in one premium, dark, data-rich experience.

### 2.2 Coverage matrix
| Hyperscaler | Brand colour | Example products | Example certifications |
|---|---|---|---|
| Microsoft Azure AI | `#00BCF2` | Azure OpenAI, Copilot Studio, Azure AI Foundry, Azure ML | AI-900, AI-102, DP-100 |
| Google Cloud AI | `#4285F4` | Vertex AI, Gemini API, AI Studio, Agentspace | PMLE, Cloud Digital Leader, Data Engineer |
| Amazon AWS AI | `#FF9900` | Bedrock, SageMaker, Q, Rekognition | AI Practitioner, ML Engineer, Data Engineer |
| Anthropic Claude | `#C4622D` | Claude API, Claude.ai Enterprise, MCP, Academy | Anthropic Academy tracks |

### 2.3 Goals & success criteria
| # | Goal | Measure of success |
|---|---|---|
| G1 | Single source of truth for AI hyperscaler intel | All 4 providers represented on every relevant page |
| G2 | Fast, premium feel | All pages statically pre-rendered; first-load JS < 140 kB |
| G3 | Actionable | Every certification & training item links to an official page |
| G4 | Decision-enabling | Side-by-side Compare view across decision metrics |
| G5 | Brand-consistent | 100% adherence to the dark design system (Design Enforcer) |

---

## 3. User roles & personas

| Persona | Role | Primary need | Key pages |
|---|---|---|---|
| **Priya** — Enterprise Architect | Evaluates platforms for a programme | Compare capabilities & pricing posture | Compare, Hyperscalers |
| **Sam** — L&D / Capability Lead | Plans team upskilling | Find certifications & training paths | Certifications, Training |
| **Dana** — Engineering Manager | Stays current on AI moves | Scan latest news per provider | News, Home |
| **Leadership reviewer** | Sponsors the AI strategy | Quick, impressive overview | Home, Compare |

All roles are **anonymous visitors** — no login. The system serves identical content to all users.

---

## 4. Functional requirements

Requirements are grouped by screen. **Priority**: M = Must, S = Should, C = Could.

### 4.0 Global / cross-cutting

| ID | Requirement | Priority |
|---|---|---|
| FR-G1 | A persistent top navigation bar links to all 6 pages and is sticky on scroll. | M |
| FR-G2 | The active route is visually indicated with a glowing cyan underline. | M |
| FR-G3 | Navigation collapses to a hamburger menu on viewports < 768 px. | M |
| FR-G4 | A persistent footer provides secondary navigation and provider list. | M |
| FR-G5 | Route changes animate with a 300 ms fade transition. | S |
| FR-G6 | All pages render on a dark background only; no light surfaces. | M |
| FR-G7 | Headings use Space Grotesk; body copy uses Inter. | M |
| FR-G8 | The experience is fully responsive (mobile, tablet, desktop). | M |
| FR-G9 | `prefers-reduced-motion` disables non-essential animation. | S |

### 4.1 Homepage (`/`)

| ID | Requirement | Priority |
|---|---|---|
| FR-H1 | Display an animated hero with the headline "The Age of Agentic AI" (gradient accent on "Agentic AI"). | M |
| FR-H2 | Render ambient, animated brand-coloured glow orbs behind the hero. | S |
| FR-H3 | Display a **Live Command Deck**: 4 brand-coloured hyperscaler tiles, each showing live certification count, news count, and flagship model. | M |
| FR-H4 | Each Command Deck tile links to the corresponding Hyperscalers tab and lifts/glows on hover. | M |
| FR-H5 | Display an integrated, auto-scrolling headline ticker sourced from news data. | S |
| FR-H6 | Display four animated **count-up** statistics (certifications, training, hyperscalers, news) that animate from 0 on scroll-into-view. | M |
| FR-H7 | Display 4 hyperscaler summary cards with hover lift + brand glow. | M |
| FR-H8 | Display a "Featured AI news" strip (latest 3 items). | M |
| FR-H9 | Display a "Most popular certifications" widget (top 4 flagged popular). | M |
| FR-H10 | Display a "Start your AI journey" CTA linking to Training and Hyperscalers. | M |

### 4.2 Hyperscalers (`/hyperscalers`)

| ID | Requirement | Priority |
|---|---|---|
| FR-Y1 | Provide tab navigation across all 4 hyperscalers. | M |
| FR-Y2 | Honour a `?tab=<id>` query parameter to deep-link a specific provider; default to Microsoft. | M |
| FR-Y3 | For the active tab, show: overview banner image, tagline, market position, pricing tier, team size, and "best for". | M |
| FR-Y4 | Show a key-products grid, a strengths list, and notable-models chips — all in the active provider's brand colour. | M |
| FR-Y5 | Provide a CTA from each tab to the Certifications page. | S |
| FR-Y6 | Tab switching animates the panel (fade-in-up). | S |

### 4.3 Certifications (`/certifications`)

| ID | Requirement | Priority |
|---|---|---|
| FR-C1 | Render all certifications as a responsive card grid. | M |
| FR-C2 | Provide a **provider** filter (All + 4 providers). | M |
| FR-C3 | Provide a **difficulty/level** filter (All + each distinct level). | M |
| FR-C4 | Filters combine (AND) and update the result set and count live, client-side. | M |
| FR-C5 | Each card shows: provider, name, exam code, level, domain, cost, validity, exam format. | M |
| FR-C6 | Cards flagged `popular` display a "★ Most Popular" badge in the brand colour. | M |
| FR-C7 | Each card is a link that opens the **official certification page** in a new tab. | M |
| FR-C8 | An empty-state message appears when no card matches the filters. | S |

### 4.4 Training Paths (`/training`)

| ID | Requirement | Priority |
|---|---|---|
| FR-T1 | Render all training resources as a responsive card grid. | M |
| FR-T2 | Provide a **provider** filter and a **cost** filter (All / Free / Paid). | M |
| FR-T3 | Filters combine and update the result set and count live, client-side. | M |
| FR-T4 | Each card shows: provider, course name, platform, level, duration, rating, tags, and a Free/Paid badge. | M |
| FR-T5 | Each card is a link that opens the **official training resource** in a new tab. | M |

### 4.5 News & Updates (`/news`)

| ID | Requirement | Priority |
|---|---|---|
| FR-N1 | Render curated news items as a responsive card grid, newest first. | M |
| FR-N2 | Provide a **company** filter (All + 4 providers). | M |
| FR-N3 | Each card shows: provider chip, headline, summary, category tag, and date. | M |
| FR-N4 | Each card has a provider-coloured left border. | M |
| FR-N5 | Items flagged `isBreaking` display a "Breaking" badge with a pulsing red dot + glow. | M |
| FR-N6 | A running count of total and "breaking" items is displayed. | S |

### 4.6 Compare (`/compare`)

| ID | Requirement | Priority |
|---|---|---|
| FR-P1 | Render a side-by-side comparison table of all 4 hyperscalers. | M |
| FR-P2 | The header row is sticky, shows each provider name in its brand colour, and is keyed by a brand top-border. | M |
| FR-P3 | Compare across: notable models, pricing tier, certification count, free training (tick/cross), team size, top strength, and "best for". | M |
| FR-P4 | The "Best for" row is highlighted in each provider's brand colour. | M |
| FR-P5 | Rows highlight with a cyan flash on hover. | S |
| FR-P6 | Alternating row backgrounds aid scannability. | S |
| FR-P7 | An export hint ("Screenshot this for your team") is displayed. | C |
| FR-P8 | Certification counts are derived from the certifications dataset (not hard-coded). | M |

---

## 5. Data requirements

The portal is driven by four version-controlled data files in `/data`. They are the **single source of content truth**.

### 5.1 `certifications.csv`
| Field | Type | Notes |
|---|---|---|
| provider | string | Microsoft / Google / AWS / Anthropic |
| name | string | Certification title |
| code | string | Exam code (e.g., AI-102) |
| level | string | Fundamentals / Associate / Professional / etc. |
| domain | string | Subject area |
| cost_usd | number | 0 = Free |
| validity_years | number | 0 = no expiry |
| exam_format | string | Format & duration |
| popular | boolean | Drives "Most Popular" badge |
| url | string | **Official certification page** |

### 5.2 `training.csv`
| Field | Type | Notes |
|---|---|---|
| provider | string | Provider name |
| course_name | string | Course/path title |
| platform | string | Microsoft Learn, Coursera, etc. |
| level | string | Beginner / Intermediate / Advanced |
| duration_hours | number | Estimated effort |
| cost | enum | Free / Paid |
| url | string | **Official training page** |
| rating | number | Indicative rating |
| tags | string[] | `;`-delimited in source |

### 5.3 `hyperscalers.json`
`id, name, tagline, color, founded_ai_year, key_products[], strengths[], market_position, notable_models[], employee_count, pricing_tier, best_for, free_training, image`

### 5.4 `news.json`
`id, provider, headline, summary, category, date, isBreaking, tags[]`

### 5.5 Data rules
- **DR1** — Provider values map case-insensitively to one of the four canonical IDs.
- **DR2** — Every certification and training row **must** have a working `url`.
- **DR3** — News is sorted by `date` descending at load time.
- **DR4** — Certification counts on Home/Compare are computed from `certifications.csv`.

---

## 6. Business rules

| ID | Rule |
|---|---|
| BR1 | A hyperscaler is always rendered in its assigned brand colour; the primary UI accent is electric cyan `#00D4FF`. |
| BR2 | "Most Popular" badge appears **iff** `popular = true`. |
| BR3 | "Breaking" treatment appears **iff** `isBreaking = true`. |
| BR4 | Cost displays as "Free" when `cost_usd = 0`; validity displays "No expiry" when `validity_years = 0`. |
| BR5 | All outbound links open in a new tab with `rel="noopener noreferrer"`. |
| BR6 | No light theme is ever rendered (enforced by the Design Enforcer agent). |

---

## 7. Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR1 | **Performance** | All routes statically pre-rendered; shared first-load JS ≈ 87 kB; per-page first load < 140 kB. |
| NFR2 | **Responsiveness** | Usable from 360 px to 1920 px+ widths. |
| NFR3 | **Accessibility** | Semantic landmarks, keyboard-navigable links/buttons, `aria` labels on icon controls, reduced-motion support, AA-oriented contrast on dark surfaces. |
| NFR4 | **SEO** | Per-page `<title>`/description metadata via the Next.js Metadata API. |
| NFR5 | **Maintainability** | Content editable via data files without code changes; typed data layer. |
| NFR6 | **Portability** | Zero-config deploy on Vercel; no runtime secrets or env vars. |
| NFR7 | **Browser support** | Evergreen Chromium, Firefox, Safari, Edge. |
| NFR8 | **Reliability** | No runtime external dependencies; content shipped with the build. |

---

## 8. Acceptance criteria (representative)

| Scenario | Given / When / Then |
|---|---|
| AC1 — Filter certifications | **Given** the Certifications page, **when** I select "AWS" and "Associate", **then** only AWS Associate certs show and the count updates. |
| AC2 — Open official cert page | **When** I click a certification card, **then** the official provider page opens in a new browser tab. |
| AC3 — Deep-link a provider | **When** I open `/hyperscalers?tab=anthropic`, **then** the Anthropic tab is active on load. |
| AC4 — Breaking news | **Given** a news item with `isBreaking=true`, **then** a pulsing red "Breaking" badge is shown. |
| AC5 — Compare counts | **Then** the certification count per provider on Compare equals the number of rows for that provider in the dataset. |
| AC6 — Count-up | **When** the stats section scrolls into view, **then** each number animates from 0 to its final value once. |
| AC7 — Dark only | **Then** no page renders any white/light background surface. |

---

## 9. Assumptions, constraints & out-of-scope

**Assumptions**
- Content is curated and refreshed manually via data files.
- News items are representative/curated, not a live feed.

**Constraints**
- Static-first architecture; no server database or auth.
- Imagery served from Pexels via `next/image` (allowed host configured).

**Out of scope (this release)**
- Authentication, user accounts, saved comparisons/bookmarks.
- A CMS / admin authoring interface.
- Live news ingestion or provider APIs at runtime.
- Multi-language / localisation.
- Analytics & A/B testing.

---

## 10. Future enhancements (backlog)

| # | Enhancement |
|---|---|
| FE1 | Live news ingestion via RSS/provider APIs with ISR (incremental revalidation). |
| FE2 | Full-text search across certs, training, and news. |
| FE3 | Saved/compare shortlist with shareable URL state. |
| FE4 | News cards link to source articles. |
| FE5 | Cost & duration sliders, sort controls. |
| FE6 | Export Compare table to PDF/PNG. |
| FE7 | Analytics + event tracking for popular paths. |

---

## 11. Traceability

Each functional requirement maps to implementing components/files in the [Design Document → §8 Solution Mapping](./DESIGN_DOCUMENT.md#8-solution-mapping--requirements-traceability).
