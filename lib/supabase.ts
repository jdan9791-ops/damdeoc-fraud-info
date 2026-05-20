import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// URL: 비공개 서버 전용 키 → NEXT_PUBLIC fallback → 하드코딩
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yrikowwhflyjafsjeomy.supabase.co";

// KEY: service_role(서버 전용, 안전) → anon 순으로 폴백
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

let _supabase: SupabaseClient | null = null;

try {
  if (supabaseUrl.startsWith("http") && supabaseKey) {
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch {
  _supabase = null;
}

export const supabase = _supabase;

export type FraudCase = {
  id: number;
  slug: string;
  title: string;
  body: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  thumbnail_url: string | null;
  image_urls: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
};
