import type { HyperscalerId } from "./types";

export const BRAND: Record<
  HyperscalerId,
  { name: string; color: string; glyph: string }
> = {
  microsoft: { name: "Microsoft", color: "#00BCF2", glyph: "⬡" },
  google: { name: "Google", color: "#4285F4", glyph: "◆" },
  aws: { name: "AWS", color: "#FF9900", glyph: "▲" },
  anthropic: { name: "Anthropic", color: "#C4622D", glyph: "◉" },
};

export const ACCENT = "#00D4FF";

export const HYPERSCALER_ORDER: HyperscalerId[] = [
  "microsoft",
  "google",
  "aws",
  "anthropic",
];

export function brandColor(id: string): string {
  return BRAND[id as HyperscalerId]?.color ?? ACCENT;
}

/** Maps a provider label ("Microsoft" or "microsoft") to a HyperscalerId. */
export function providerToId(provider: string): HyperscalerId {
  return provider.toLowerCase() as HyperscalerId;
}

/** rgba helper from a hex string. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
