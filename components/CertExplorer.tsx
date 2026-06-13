"use client";

import { useMemo, useState } from "react";
import type { Certification } from "@/lib/types";
import { BRAND, HYPERSCALER_ORDER, withAlpha, providerToId } from "@/lib/brand";
import CertCard from "@/components/CertCard";

export default function CertExplorer({ certs }: { certs: Certification[] }) {
  const [provider, setProvider] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  const levels = useMemo(
    () => Array.from(new Set(certs.map((c) => c.level))),
    [certs]
  );

  const filtered = certs.filter((c) => {
    const provOk = provider === "all" || providerToId(c.provider) === provider;
    const levelOk = level === "all" || c.level === level;
    return provOk && levelOk;
  });

  return (
    <div>
      {/* Provider filter */}
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

      {/* Level filter */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-body text-xs uppercase tracking-wide text-ink-500">
          Difficulty:
        </span>
        {["all", ...levels].map((lv) => {
          const active = level === lv;
          return (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className="rounded-lg border px-3 py-1.5 font-body text-xs transition-all duration-300"
              style={{
                borderColor: active ? "#00D4FF66" : "rgba(255,255,255,0.1)",
                color: active ? "#00D4FF" : "#9DA7B3",
                background: active ? "rgba(0,212,255,0.08)" : "transparent",
              }}
            >
              {lv === "all" ? "All levels" : lv}
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-body text-sm text-ink-500">
        Showing <span className="text-ink-100">{filtered.length}</span> of{" "}
        {certs.length} certifications
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cert) => (
          <CertCard key={cert.code} cert={cert} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass mt-6 p-10 text-center font-body text-ink-300">
          No certifications match those filters.
        </div>
      )}
    </div>
  );
}
