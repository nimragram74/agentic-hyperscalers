import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  getCertifications,
  getHyperscalers,
  getNews,
  getTraining,
} from "@/lib/data";
import {
  BRAND,
  HYPERSCALER_ORDER,
  brandColor,
  providerToId,
} from "@/lib/brand";
import HyperscalerCard from "@/components/HyperscalerCard";
import NewsCard from "@/components/NewsCard";
import CertCard from "@/components/CertCard";
import CountUp from "@/components/CountUp";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AmbientGlow from "@/components/AmbientGlow";
import CommandDeck, { DeckTile, DeckTicker } from "@/components/CommandDeck";

export default function HomePage() {
  const hyperscalers = getHyperscalers();
  const certs = getCertifications();
  const training = getTraining();
  const news = getNews();

  const featuredNews = news.slice(0, 3);
  const topCerts = certs.filter((c) => c.popular).slice(0, 4);

  // Per-provider aggregates for the command deck
  const certCounts: Record<string, number> = {};
  const newsCounts: Record<string, number> = {};
  for (const c of certs) {
    const id = providerToId(c.provider);
    certCounts[id] = (certCounts[id] ?? 0) + 1;
  }
  for (const n of news) newsCounts[n.provider] = (newsCounts[n.provider] ?? 0) + 1;

  const tiles: DeckTile[] = HYPERSCALER_ORDER.map((id) => {
    const h = hyperscalers.find((x) => x.id === id)!;
    return {
      id,
      name: BRAND[id].name,
      glyph: BRAND[id].glyph,
      color: BRAND[id].color,
      certCount: certCounts[id] ?? 0,
      newsCount: newsCounts[id] ?? 0,
      model: h.notable_models[0],
    };
  });

  const ticker: DeckTicker[] = news.slice(0, 7).map((n) => ({
    color: brandColor(n.provider),
    label: n.headline,
  }));

  const stats = [
    { value: certs.length, label: "AI Certifications" },
    { value: training.length, label: "Training Resources" },
    { value: hyperscalers.length, label: "Hyperscalers Covered" },
    { value: news.length, label: "Live News Items" },
  ];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <AmbientGlow />
        <div className="absolute inset-0 grid-texture opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base-900" />

        <div className="section-pad relative flex flex-col items-center pb-20 pt-16 text-center sm:pt-24">
          <div className="pill-btn mb-6 border-accent/30 bg-accent/5 text-accent">
            <Sparkles size={14} />
            The AI Cloud Command Centre
          </div>
          <h1 className="font-heading text-5xl font-bold leading-[1.04] tracking-tight text-ink-100 sm:text-7xl">
            The New Age of{" "}
            <span className="text-gradient">Agentic AI</span>
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-ink-300">
            The definitive enterprise resource for AI services, certifications,
            training paths, and live intelligence across Microsoft Azure, Google
            Cloud, AWS &amp; Anthropic.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/compare"
              className="pill-btn border-accent/40 bg-accent/10 px-5 py-2.5 text-accent hover:bg-accent/20"
              style={{ boxShadow: "0 0 28px rgba(0,212,255,0.25)" }}
            >
              Compare all 4 <ArrowRight size={16} />
            </Link>
            <Link
              href="/certifications"
              className="pill-btn px-5 py-2.5 text-ink-100 hover:bg-white/5"
            >
              Explore certifications
            </Link>
          </div>

          {/* Live data command deck — fills the hero with substance */}
          <CommandDeck tiles={tiles} ticker={ticker} newsTotal={news.length} />
        </div>
      </section>

      {/* ---------- STATS COUNTERS ---------- */}
      <section className="section-pad py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass relative flex flex-col items-center overflow-hidden p-6 text-center">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <span className="font-heading text-4xl font-bold text-accent sm:text-5xl">
                  <CountUp end={s.value} />
                </span>
                <span className="mt-2 font-body text-sm text-ink-300">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- HYPERSCALER CARDS ---------- */}
      <section className="section-pad py-10">
        <Reveal>
          <SectionHeading
            eyebrow="The Big Four"
            title="One portal, four hyperscalers"
            description="Each platform brings a distinct strength to enterprise AI. Tap a card to dive into products, strengths, and notable models."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hyperscalers.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.07}>
              <HyperscalerCard h={h} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FEATURED NEWS ---------- */}
      <section className="section-pad py-16">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Live Intelligence"
              title="Featured AI news"
              description="The latest moves from across the four hyperscalers."
            />
            <Link
              href="/news"
              className="pill-btn hidden shrink-0 text-ink-300 hover:text-accent sm:inline-flex"
            >
              All news <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredNews.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.07}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- TOP CERTIFICATIONS ---------- */}
      <section className="section-pad py-10">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Upskill"
              title="Most popular certifications"
              description="Industry-recognised credentials to position your team for the agentic era."
            />
            <Link
              href="/certifications"
              className="pill-btn hidden shrink-0 text-ink-300 hover:text-accent sm:inline-flex"
            >
              All certs <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topCerts.map((cert, i) => (
            <Reveal key={cert.code} delay={i * 0.07}>
              <CertCard cert={cert} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section-pad py-20">
        <Reveal>
          <div className="glass relative overflow-hidden p-10 text-center sm:p-16">
            <AmbientGlow />
            <div className="absolute inset-0 grid-texture opacity-30" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
                Start your AI journey
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-base text-ink-300">
                Compare platforms, pick a certification path, and follow curated
                training — all in one command centre.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/training"
                  className="pill-btn border-accent/40 bg-accent/10 px-5 py-2.5 text-accent hover:bg-accent/20"
                  style={{ boxShadow: "0 0 24px rgba(0,212,255,0.2)" }}
                >
                  Browse training paths <ArrowRight size={16} />
                </Link>
                <Link
                  href="/hyperscalers"
                  className="pill-btn px-5 py-2.5 text-ink-100 hover:bg-white/5"
                >
                  Explore hyperscalers
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
