import { Suspense } from "react";
import type { Metadata } from "next";
import { getHyperscalers } from "@/lib/data";
import HyperscalerTabs from "@/components/HyperscalerTabs";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Hyperscalers",
  description:
    "Compare AI products, strengths and notable models across Microsoft Azure, Google Cloud, AWS and Anthropic.",
};

export default function HyperscalersPage() {
  const hyperscalers = getHyperscalers();
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-72 grid-texture opacity-40" />
      <div className="section-pad relative pb-10 pt-14">
        <SectionHeading
          eyebrow="Platforms"
          title="The four AI hyperscalers"
          description="Switch between platforms to explore products, strengths, and the models that define each one."
        />
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 glass animate-pulse" />}>
            <HyperscalerTabs hyperscalers={hyperscalers} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
