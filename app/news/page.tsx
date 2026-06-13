import type { Metadata } from "next";
import { getNews } from "@/lib/data";
import NewsExplorer from "@/components/NewsExplorer";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "The latest AI news across Microsoft, Google, AWS and Anthropic. Filter by company and spot breaking stories.",
};

export default function NewsPage() {
  const news = getNews();
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-72 grid-texture opacity-40" />
      <div className="section-pad relative pb-10 pt-14">
        <SectionHeading
          eyebrow="Live Intelligence"
          title="AI news & updates"
          description="Curated headlines from across the four hyperscalers. Breaking stories are flagged with a pulsing badge."
        />
        <div className="mt-10">
          <NewsExplorer news={news} />
        </div>
      </div>
    </div>
  );
}
