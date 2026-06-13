"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";
import { BRAND, HYPERSCALER_ORDER, withAlpha } from "@/lib/brand";
import NewsCard from "@/components/NewsCard";

export default function NewsExplorer({ news }: { news: NewsItem[] }) {
  const [provider, setProvider] = useState<string>("all");

  const filtered =
    provider === "all" ? news : news.filter((n) => n.provider === provider);

  const breakingCount = news.filter((n) => n.isBreaking).length;

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
          All companies
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

      <p className="mt-6 font-body text-sm text-ink-500">
        Showing <span className="text-ink-100">{filtered.length}</span> items
        {" · "}
        <span className="inline-flex items-center gap-1.5 text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />
          {breakingCount} breaking
        </span>
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
