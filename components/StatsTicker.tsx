"use client";

const ITEMS = [
  { label: "Claude Opus 4.8 tops agentic coding benchmarks", provider: "#C4622D" },
  { label: "Gemini 2.5 Pro leads long-context retrieval", provider: "#4285F4" },
  { label: "Amazon Bedrock ships cross-model agent runtime", provider: "#FF9900" },
  { label: "Azure AI Foundry adds agent orchestration", provider: "#00BCF2" },
  { label: "MCP becomes the de-facto tool-integration standard", provider: "#C4622D" },
  { label: "Vertex AI adds one-click model evaluation", provider: "#4285F4" },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-2 whitespace-nowrap px-6 font-body text-sm text-ink-300"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: item.provider }}
          />
          {item.label}
          <span className="ml-6 text-ink-500">/</span>
        </span>
      ))}
    </div>
  );
}

export default function StatsTicker() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-base-800/50 py-3">
      <div className="flex animate-marquee">
        <Row />
        <Row />
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-base-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-base-900 to-transparent" />
    </div>
  );
}
