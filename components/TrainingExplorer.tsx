"use client";

import { useState } from "react";
import { Clock, Star, ExternalLink } from "lucide-react";
import type { Training } from "@/lib/types";
import {
  BRAND,
  HYPERSCALER_ORDER,
  brandColor,
  withAlpha,
  providerToId,
} from "@/lib/brand";

function TrainingCard({ t }: { t: Training }) {
  const id = providerToId(t.provider);
  const color = brandColor(id);
  return (
    <article
      className="glass group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 font-body text-xs font-medium"
          style={{ color }}
        >
          {BRAND[id]?.glyph} {t.provider}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold"
          style={
            t.cost === "Free"
              ? { color: "#34d399", background: "rgba(52,211,153,0.12)" }
              : { color: "#fbbf24", background: "rgba(251,191,36,0.12)" }
          }
        >
          {t.cost}
        </span>
      </div>

      <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-ink-100">
        {t.course_name}
      </h3>
      <p className="mt-1 font-body text-xs text-ink-500">{t.platform}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {t.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-body text-[11px] text-ink-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 font-body text-xs text-ink-300">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} style={{ color }} /> {t.duration_hours}h
        </span>
        <span className="inline-flex items-center gap-1">
          <Star size={13} className="fill-amber-400 text-amber-400" /> {t.rating}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-body text-[11px]"
          style={{ color, background: withAlpha(color, 0.1) }}
        >
          {t.level} <ExternalLink size={11} />
        </span>
      </div>
    </article>
  );
}

export default function TrainingExplorer({ training }: { training: Training[] }) {
  const [provider, setProvider] = useState<string>("all");
  const [cost, setCost] = useState<string>("all");

  const filtered = training.filter((t) => {
    const provOk = provider === "all" || providerToId(t.provider) === provider;
    const costOk = cost === "all" || t.cost === cost;
    return provOk && costOk;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setProvider("all")}
          className="rounded-full border px-4 py-2 font-body text-sm transition-all duration-300"
          style={{
            borderColor: provider === "all" ? "#00D4FF66" : "rgba(255,255,255,0.1)",
            color: provider === "all" ? "#00D4FF" : "#9DA7B3",
            background: provider === "all" ? "rgba(0,212,255,0.1)" : "transparent",
          }}
        >
          All providers
        </button>
        {HYPERSCALER_ORDER.map((id) => {
          const active = provider === id;
          return (
            <button
              key={id}
              onClick={() => setProvider(id)}
              className="rounded-full border px-4 py-2 font-body text-sm transition-all duration-300"
              style={{
                borderColor: active ? withAlpha(BRAND[id].color, 0.5) : "rgba(255,255,255,0.1)",
                color: active ? BRAND[id].color : "#9DA7B3",
                background: active ? withAlpha(BRAND[id].color, 0.12) : "transparent",
              }}
            >
              {BRAND[id].glyph} {BRAND[id].name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-body text-xs uppercase tracking-wide text-ink-500">
          Cost:
        </span>
        {["all", "Free", "Paid"].map((c) => {
          const active = cost === c;
          return (
            <button
              key={c}
              onClick={() => setCost(c)}
              className="rounded-lg border px-3 py-1.5 font-body text-xs transition-all duration-300"
              style={{
                borderColor: active ? "#00D4FF66" : "rgba(255,255,255,0.1)",
                color: active ? "#00D4FF" : "#9DA7B3",
                background: active ? "rgba(0,212,255,0.08)" : "transparent",
              }}
            >
              {c === "all" ? "All" : c}
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-body text-sm text-ink-500">
        Showing <span className="text-ink-100">{filtered.length}</span> of{" "}
        {training.length} resources
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TrainingCard key={`${t.provider}-${t.course_name}`} t={t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass mt-6 p-10 text-center font-body text-ink-300">
          No training resources match those filters.
        </div>
      )}
    </div>
  );
}
