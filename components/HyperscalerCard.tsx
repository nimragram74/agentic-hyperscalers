"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Hyperscaler } from "@/lib/types";
import { BRAND, withAlpha } from "@/lib/brand";

export default function HyperscalerCard({ h }: { h: Hyperscaler }) {
  const [hover, setHover] = useState(false);
  const color = h.color;

  return (
    <Link
      href={`/hyperscalers?tab=${h.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass group relative flex flex-col overflow-hidden p-6 transition-all duration-300"
      style={{
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        borderColor: hover ? withAlpha(color, 0.5) : undefined,
        boxShadow: hover
          ? `0 22px 60px -18px ${withAlpha(color, 0.55)}, inset 0 1px 0 0 rgba(255,255,255,0.06)`
          : undefined,
      }}
    >
      {/* top accent line */}
      <span
        className="absolute inset-x-0 top-0 h-[2px] origin-left transition-transform duration-300"
        style={{
          background: color,
          transform: hover ? "scaleX(1)" : "scaleX(0.25)",
        }}
      />
      <div className="flex items-center justify-between">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl text-lg"
          style={{
            color,
            background: withAlpha(color, 0.12),
            border: `1px solid ${withAlpha(color, 0.3)}`,
          }}
        >
          {BRAND[h.id].glyph}
        </span>
        <ArrowUpRight
          size={18}
          className="text-ink-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: hover ? color : undefined }}
        />
      </div>

      <h3 className="mt-5 font-heading text-lg font-semibold text-ink-100">
        {h.name}
      </h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-ink-300">
        {h.tagline}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {h.key_products.slice(0, 3).map((p) => (
          <span
            key={p}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-body text-[11px] text-ink-300"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-body text-xs text-ink-500">
        <span>AI since {h.founded_ai_year}</span>
        <span style={{ color }}>{h.notable_models[0]}</span>
      </div>
    </Link>
  );
}
