import { Award, Clock, DollarSign, ExternalLink } from "lucide-react";
import type { Certification } from "@/lib/types";
import { brandColor, withAlpha, BRAND, providerToId } from "@/lib/brand";

export default function CertCard({ cert }: { cert: Certification }) {
  const id = providerToId(cert.provider);
  const color = brandColor(id);
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass group relative flex flex-col p-5 transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: undefined }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="inline-flex items-center gap-1.5 font-body text-xs font-medium"
            style={{ color }}
          >
            {BRAND[id]?.glyph} {cert.provider}
          </span>
          <h3 className="mt-2 inline-flex items-start gap-1.5 font-heading text-base font-semibold leading-snug text-ink-100">
            {cert.name}
            <ExternalLink
              size={13}
              className="mt-0.5 shrink-0 text-ink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color }}
            />
          </h3>
        </div>
        {cert.popular && (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide"
            style={{
              color,
              background: withAlpha(color, 0.14),
              border: `1px solid ${withAlpha(color, 0.35)}`,
            }}
          >
            ★ Most Popular
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 font-body text-[11px]">
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-ink-300">
          {cert.code}
        </span>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-ink-300">
          {cert.level}
        </span>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-ink-300">
          {cert.domain}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/10 pt-4 font-body text-xs">
        <div className="flex flex-col items-center gap-1 text-ink-300">
          <DollarSign size={14} style={{ color }} />
          <span>{cert.cost_usd === 0 ? "Free" : `$${cert.cost_usd}`}</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-ink-300">
          <Clock size={14} style={{ color }} />
          <span>
            {cert.validity_years === 0
              ? "No expiry"
              : `${cert.validity_years} yr`}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center text-ink-300">
          <Award size={14} style={{ color }} />
          <span className="line-clamp-1">{cert.exam_format.split("(")[0]}</span>
        </div>
      </div>
    </a>
  );
}
