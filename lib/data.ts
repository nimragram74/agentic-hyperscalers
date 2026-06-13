import fs from "node:fs";
import path from "node:path";
import type {
  Certification,
  Hyperscaler,
  NewsItem,
  Training,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

/** Minimal CSV parser supporting quoted fields and embedded commas. */
function parseCsv(raw: string): Record<string, string>[] {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);

  const [header, ...body] = rows;
  return body
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => {
        obj[h.trim()] = (r[idx] ?? "").trim();
      });
      return obj;
    });
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")) as T;
}

function readCsv(file: string): Record<string, string>[] {
  return parseCsv(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
}

export function getHyperscalers(): Hyperscaler[] {
  return readJson<Hyperscaler[]>("hyperscalers.json");
}

export function getHyperscaler(id: string): Hyperscaler | undefined {
  return getHyperscalers().find((h) => h.id === id);
}

export function getCertifications(): Certification[] {
  return readCsv("certifications.csv").map((r) => ({
    provider: r.provider,
    name: r.name,
    code: r.code,
    level: r.level,
    domain: r.domain,
    cost_usd: Number(r.cost_usd) || 0,
    validity_years: Number(r.validity_years) || 0,
    exam_format: r.exam_format,
    popular: r.popular?.toLowerCase() === "true",
    url: r.url,
  }));
}

export function getTraining(): Training[] {
  return readCsv("training.csv").map((r) => ({
    provider: r.provider,
    course_name: r.course_name,
    platform: r.platform,
    level: r.level,
    duration_hours: Number(r.duration_hours) || 0,
    cost: (r.cost as Training["cost"]) || "Free",
    url: r.url,
    rating: Number(r.rating) || 0,
    tags: (r.tags || "").split(";").map((t) => t.trim()).filter(Boolean),
  }));
}

export function getNews(): NewsItem[] {
  return readJson<NewsItem[]>("news.json").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export { providerToId } from "./brand";
