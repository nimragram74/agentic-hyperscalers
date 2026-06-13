import type { Metadata } from "next";
import { getCertifications } from "@/lib/data";
import CertExplorer from "@/components/CertExplorer";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Filterable directory of AI certifications across Microsoft, Google, AWS and Anthropic — codes, cost, validity and domains.",
};

export default function CertificationsPage() {
  const certs = getCertifications();
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-72 grid-texture opacity-40" />
      <div className="section-pad relative pb-10 pt-14">
        <SectionHeading
          eyebrow="Upskill"
          title="AI certifications directory"
          description="Filter by provider and difficulty to find the right credential for your team. Top credentials carry a Most Popular badge."
        />
        <div className="mt-10">
          <CertExplorer certs={certs} />
        </div>
      </div>
    </div>
  );
}
