import type { NewsItem } from "@/lib/types";
import { BRAND, withAlpha } from "@/lib/brand";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const brand = BRAND[item.provider];
  return (
    <article
      className="glass group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1"
      style={{ borderLeft: `3px solid ${brand.color}` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, ${withAlpha(
            brand.color,
            0.1
          )} 0%, transparent 60%)`,
        }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[11px] font-medium"
          style={{
            color: brand.color,
            background: withAlpha(brand.color, 0.12),
          }}
        >
          <span>{brand.glyph}</span>
          {brand.name}
        </span>

        {item.isBreaking && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 font-body text-[11px] font-semibold text-red-400 animate-pulse-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />
            Breaking
          </span>
        )}
      </div>

      <h3 className="relative mt-4 font-heading text-base font-semibold leading-snug text-ink-100">
        {item.headline}
      </h3>
      <p className="relative mt-2 font-body text-sm leading-relaxed text-ink-300">
        {item.summary}
      </p>

      <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-body text-xs text-ink-500">
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-ink-300">
          {item.category}
        </span>
        <span>{formatDate(item.date)}</span>
      </div>
    </article>
  );
}
