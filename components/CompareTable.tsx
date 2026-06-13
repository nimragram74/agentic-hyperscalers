"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Hyperscaler } from "@/lib/types";
import { BRAND, withAlpha } from "@/lib/brand";

interface Row {
  key: string;
  label: string;
  render: (h: Hyperscaler) => React.ReactNode;
  highlight?: boolean;
}

export default function CompareTable({
  hyperscalers,
  certCounts,
}: {
  hyperscalers: Hyperscaler[];
  certCounts: Record<string, number>;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const rows: Row[] = [
    {
      key: "models",
      label: "Notable models",
      render: (h) => (
        <div className="flex flex-col gap-1">
          {h.notable_models.slice(0, 3).map((m) => (
            <span key={m} className="text-ink-100">
              {m}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Pricing tier",
      render: (h) => <span className="text-ink-100">{h.pricing_tier}</span>,
    },
    {
      key: "certs",
      label: "Certifications",
      render: (h) => (
        <span className="font-heading text-lg font-semibold" style={{ color: h.color }}>
          {certCounts[h.id] ?? 0}
        </span>
      ),
    },
    {
      key: "free",
      label: "Free training",
      render: (h) =>
        h.free_training ? (
          <Check size={20} className="text-emerald-400" />
        ) : (
          <X size={20} className="text-red-400" />
        ),
    },
    {
      key: "team",
      label: "Team size",
      render: (h) => <span className="text-ink-100">{h.employee_count}</span>,
    },
    {
      key: "strength",
      label: "Top strength",
      render: (h) => <span className="text-ink-300">{h.strengths[0]}</span>,
    },
    {
      key: "bestfor",
      label: "Best for",
      highlight: true,
      render: (h) => <span className="text-ink-100">{h.best_for}</span>,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0">
        {/* Sticky header */}
        <thead className="sticky top-16 z-20">
          <tr>
            <th className="w-40 rounded-tl-2xl border-b border-white/10 bg-base-800 p-4 text-left align-bottom">
              <span className="eyebrow">Compare</span>
            </th>
            {hyperscalers.map((h, i) => (
              <th
                key={h.id}
                className="border-b border-white/10 bg-base-800 p-4 text-center"
                style={{
                  borderTop: `3px solid ${h.color}`,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: i === hyperscalers.length - 1 ? "1rem" : 0,
                }}
              >
                <div
                  className="font-heading text-base font-semibold"
                  style={{ color: h.color }}
                >
                  {BRAND[h.id].glyph} {h.name}
                </div>
                <div className="mt-1 font-body text-xs font-normal text-ink-500">
                  AI since {h.founded_ai_year}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.key}
              onMouseEnter={() => setHovered(row.key)}
              onMouseLeave={() => setHovered(null)}
              className="transition-colors duration-200"
              style={{
                background:
                  hovered === row.key
                    ? "rgba(0,212,255,0.06)"
                    : rowIdx % 2 === 0
                      ? "rgba(255,255,255,0.015)"
                      : "transparent",
              }}
            >
              <td className="border-b border-white/5 p-4 align-top font-body text-sm font-medium text-ink-300">
                {row.label}
              </td>
              {hyperscalers.map((h) => (
                <td
                  key={h.id}
                  className="border-b border-white/5 p-4 text-center align-top font-body text-sm"
                  style={
                    row.highlight
                      ? {
                          background: withAlpha(h.color, 0.1),
                          boxShadow: `inset 0 0 0 1px ${withAlpha(h.color, 0.25)}`,
                        }
                      : undefined
                  }
                >
                  <div className="flex justify-center">{row.render(h)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
