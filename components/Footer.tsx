import Link from "next/link";
import { BRAND, HYPERSCALER_ORDER } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-base-800/40">
      <div className="section-pad grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg border border-accent/40 text-sm font-bold text-accent"
              style={{ boxShadow: "0 0 18px rgba(0,212,255,0.25)" }}
            >
              ⬡
            </span>
            <span className="font-heading text-[15px] font-semibold text-ink-100">
              Agentic<span className="text-accent">HyperScalers</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-ink-300">
            The AI Cloud Command Centre — the definitive enterprise resource for
            AI services, certifications, training paths, and live news across the
            four hyperscalers.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Portal</h4>
          <ul className="space-y-2.5 font-body text-sm">
            {[
              ["/hyperscalers", "Hyperscalers"],
              ["/certifications", "Certifications"],
              ["/training", "Training Paths"],
              ["/news", "News & Updates"],
              ["/compare", "Compare Tool"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-ink-300 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Hyperscalers</h4>
          <ul className="space-y-2.5 font-body text-sm">
            {HYPERSCALER_ORDER.map((id) => (
              <li key={id} className="flex items-center gap-2 text-ink-300">
                <span style={{ color: BRAND[id].color }}>{BRAND[id].glyph}</span>
                {BRAND[id].name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-pad flex flex-col items-center justify-between gap-3 py-5 font-body text-xs text-ink-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Agentic Hyper Scalers · AI Agents
            Accelerator
          </span>
          <span>
            Built with <span className="text-accent">Claude Code</span> · Next.js
            + Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
