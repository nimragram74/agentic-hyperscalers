import type { Metadata } from "next";
import { getTraining } from "@/lib/data";
import TrainingExplorer from "@/components/TrainingExplorer";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Training Paths",
  description:
    "Curated learning paths across Microsoft, Google, AWS and Anthropic — filter by provider and free vs paid.",
};

export default function TrainingPage() {
  const training = getTraining();
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-72 grid-texture opacity-40" />
      <div className="section-pad relative pb-10 pt-14">
        <SectionHeading
          eyebrow="Learn"
          title="Training paths"
          description="Curated courses for every hyperscaler. Filter by provider, or show only free resources to get started fast."
        />
        <div className="mt-10">
          <TrainingExplorer training={training} />
        </div>
      </div>
    </div>
  );
}
