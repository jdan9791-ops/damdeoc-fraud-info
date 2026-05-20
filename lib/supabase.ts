import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL_FALLBACK = "https://yrikowwhflyjafsjeomy.supabase.co";

/**
 * ISR-safe factory: env 변수를 호출 시점에 읽음.
 * 모듈 로드 시점(빌드) 에 key가 없어도 런타임 ISR 재렌더에서 정상 작동.
 */
export function getSupabase(): SupabaseClient | null {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    SUPABASE_URL_FALLBACK;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url.startsWith("http") || !key) return null;

  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

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
