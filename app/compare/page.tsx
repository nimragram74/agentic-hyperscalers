import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { getCertifications, getHyperscalers, providerToId } from "@/lib/data";
import CompareTable from "@/components/CompareTable";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Side-by-side comparison of Microsoft, Google, AWS and Anthropic across models, pricing, certifications, training and strengths.",
};

export default function ComparePage() {
  const hyperscalers = getHyperscalers();
  const certs = getCertifications();

  const certCounts: Record<string, number> = {};
  for (const c of certs) {
    const id = providerToId(c.provider);
    certCounts[id] = (certCounts[id] ?? 0) + 1;
  }

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-72 grid-texture opacity-40" />
      <div className="section-pad relative pb-10 pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Decision Tool"
            title="Compare the hyperscalers"
            description="A side-by-side view of all four platforms across the metrics that matter for an enterprise AI decision."
          />
          <span className="pill-btn shrink-0 border-accent/30 bg-accent/5 text-accent">
            <Camera size={14} /> Screenshot this for your team
          </span>
        </div>

        <div className="glass mt-10 overflow-hidden p-1.5">
          <CompareTable hyperscalers={hyperscalers} certCounts={certCounts} />
        </div>

        <p className="mt-4 font-body text-xs text-ink-500">
          Highlighted “Best for” row reflects each platform’s ideal enterprise
          fit. Hover any row to scan across all four.
        </p>
      </div>
    </div>
  );
}
