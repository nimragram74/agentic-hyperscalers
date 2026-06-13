"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Hyperscaler, HyperscalerId } from "@/lib/types";
import { BRAND, HYPERSCALER_ORDER, withAlpha } from "@/lib/brand";

export default function HyperscalerTabs({
  hyperscalers,
}: {
  hyperscalers: Hyperscaler[];
}) {
  const params = useSearchParams();
  const initial = (params.get("tab") as HyperscalerId) || "microsoft";
  const [active, setActive] = useState<HyperscalerId>(
    HYPERSCALER_ORDER.includes(initial) ? initial : "microsoft"
  );

  useEffect(() => {
    const t = params.get("tab") as HyperscalerId | null;
    if (t && HYPERSCALER_ORDER.includes(t)) setActive(t);
  }, [params]);

  const h = hyperscalers.find((x) => x.id === active)!;
  const color = h.color;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-base-800/50 p-2">
        {HYPERSCALER_ORDER.map((id) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="relative flex-1 rounded-xl px-4 py-3 font-heading text-sm font-medium transition-all duration-300"
              style={{
                color: isActive ? BRAND[id].color : "#9DA7B3",
                background: isActive ? withAlpha(BRAND[id].color, 0.12) : "transparent",
                boxShadow: isActive
                  ? `inset 0 0 0 1px ${withAlpha(BRAND[id].color, 0.4)}`
                  : "none",
              }}
            >
              <span className="mr-1.5">{BRAND[id].glyph}</span>
              <span className="hidden sm:inline">{BRAND[id].name}</span>
              <span className="sm:hidden">{BRAND[id].glyph}</span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div key={h.id} className="mt-8 animate-fade-in-up">
        {/* Overview */}
        <div className="glass relative overflow-hidden">
          <div className="relative h-44 w-full sm:h-56">
            <Image
              src={h.image}
              alt={h.name}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${withAlpha(
                  color,
                  0.12
                )} 0%, rgba(13,17,23,0.95) 100%)`,
              }}
            />
            <div className="absolute inset-0 grid-texture opacity-50" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-body text-xs"
                style={{ color, background: withAlpha(color, 0.16) }}
              >
                {BRAND[h.id].glyph} AI since {h.founded_ai_year}
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-ink-100 sm:text-4xl">
                {h.name}
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="max-w-3xl font-body text-lg leading-relaxed text-ink-100">
              {h.tagline}
            </p>
            <p className="mt-3 max-w-3xl font-body text-sm leading-relaxed text-ink-300">
              {h.market_position}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 font-body text-sm">
              <div>
                <span className="block text-ink-500">Pricing tier</span>
                <span className="font-heading text-ink-100">{h.pricing_tier}</span>
              </div>
              <div>
                <span className="block text-ink-500">Team size</span>
                <span className="font-heading text-ink-100">{h.employee_count}</span>
              </div>
              <div>
                <span className="block text-ink-500">Best for</span>
                <span className="font-heading text-ink-100">{h.best_for}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Key products */}
          <div className="glass p-6">
            <h3 className="eyebrow mb-4" style={{ color }}>
              Key products
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {h.key_products.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 font-body text-sm text-ink-100 transition-colors hover:border-white/20"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="glass p-6">
            <h3 className="eyebrow mb-4" style={{ color }}>
              Strengths
            </h3>
            <ul className="space-y-3">
              {h.strengths.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 font-body text-sm text-ink-100"
                >
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notable models + CTA */}
        <div className="mt-6 glass flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="eyebrow mb-3" style={{ color }}>
              Notable models
            </h3>
            <div className="flex flex-wrap gap-2">
              {h.notable_models.map((m) => (
                <span
                  key={m}
                  className="rounded-full border px-3 py-1 font-body text-sm"
                  style={{
                    borderColor: withAlpha(color, 0.4),
                    color,
                    background: withAlpha(color, 0.08),
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/certifications"
            className="pill-btn shrink-0 px-5 py-2.5"
            style={{
              borderColor: withAlpha(color, 0.5),
              color,
              background: withAlpha(color, 0.1),
            }}
          >
            View {BRAND[h.id].name} certifications <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
