export type HyperscalerId = "microsoft" | "google" | "aws" | "anthropic";

export interface Hyperscaler {
  id: HyperscalerId;
  name: string;
  tagline: string;
  color: string;
  founded_ai_year: number;
  key_products: string[];
  strengths: string[];
  market_position: string;
  notable_models: string[];
  employee_count: string;
  pricing_tier: string;
  best_for: string;
  free_training: boolean;
  image: string;
}

export interface Certification {
  provider: string;
  name: string;
  code: string;
  level: string;
  domain: string;
  cost_usd: number;
  validity_years: number;
  exam_format: string;
  popular: boolean;
}

export interface Training {
  provider: string;
  course_name: string;
  platform: string;
  level: string;
  duration_hours: number;
  cost: "Free" | "Paid";
  url_placeholder: string;
  rating: number;
  tags: string[];
}

export interface NewsItem {
  id: string;
  provider: HyperscalerId;
  headline: string;
  summary: string;
  category: string;
  date: string;
  isBreaking: boolean;
  tags: string[];
}
