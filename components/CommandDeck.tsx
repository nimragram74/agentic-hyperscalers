"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";
import { withAlpha } from "@/lib/brand";

export interface DeckTile {
  id: string;
  name: string;
  glyph: string;
  color: string;
  certCount: number;
  model: string;
  newsCount: number;
}

export interface DeckTicker {
  color: string;
  label: string;
}

export default function CommandDeck({
  tiles,
  ticker,
  newsTotal,
}: {
  tiles: DeckTile[];
  ticker: DeckTicker[];
  newsTotal: number;
}) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
      className="glass relative mx-auto mt-12 w-full max-w-5xl overflow-hidden p-1.5"
      style={{ boxShadow: "0 40px 120px -40px rgba(0,212,255,0.35)" }}
    >
      {/* gradient top hairline */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00BCF2, #4285F4, #FF9900, #C4622D, transparent)",
        }}
      />

      {/* header bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="inline-flex items-center gap-2 font-body text-xs font-medium text-ink-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          LIVE · AI Cloud Command Deck
        </span>
        <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink-500">
          <Activity size={13} className="text-accent" />
          {newsTotal} stories tracked
        </span>
      </div>

      {/* tiles */}
      <div className="grid grid-cols-2 gap-1.5 px-1.5 lg:grid-cols-4">
        {tiles.map((t) => {
          const active = hover === t.id;
          return (
            <Link
              key={t.id}
              href={`/hyperscalers?tab=${t.id}`}
              onMouseEnter={() => setHover(t.id)}
              onMouseLeave={() => setHover(null)}
              className="group relative flex flex-col rounded-xl border p-4 text-left transition-all duration-300"
              style={{
                borderColor: active ? withAlpha(t.color, 0.5) : "rgba(255,255,255,0.07)",
                background: active
                  ? `linear-gradient(160deg, ${withAlpha(t.color, 0.16)}, ${withAlpha(t.color, 0.02)})`
                  : "rgba(255,255,255,0.02)",
                boxShadow: active ? `0 16px 40px -16px ${withAlpha(t.color, 0.6)}` : "none",
                transform: active ? "translateY(-3px)" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg text-sm"
                  style={{
                    color: t.color,
                    background: withAlpha(t.color, 0.14),
                    border: `1px solid ${withAlpha(t.color, 0.3)}`,
                  }}
                >
                  {t.glyph}
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-ink-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: active ? t.color : undefined }}
                />
              </div>

              <span className="mt-3 font-heading text-sm font-semibold text-ink-100">
                {t.name}
              </span>

              <div className="mt-3 flex items-end gap-1.5">
                <span
                  className="font-heading text-3xl font-bold leading-none"
                  style={{ color: t.color }}
                >
                  {t.certCount}
                </span>
                <span className="mb-0.5 font-body text-[11px] text-ink-500">
                  certs · {t.newsCount} news
                </span>
              </div>

              <span className="mt-2 truncate font-body text-[11px] text-ink-300">
                {t.model}
              </span>
            </Link>
          );
        })}
      </div>

      {/* integrated ticker */}
      <div className="relative mt-1.5 flex overflow-hidden rounded-xl border border-white/5 bg-base-900/60 py-2.5">
        <div className="flex animate-marquee">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 whitespace-nowrap px-5 font-body text-xs text-ink-300"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
              <span className="ml-5 text-ink-500/60">/</span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base-900 to-transparent" />
      </div>
    </motion.div>
  );
}
