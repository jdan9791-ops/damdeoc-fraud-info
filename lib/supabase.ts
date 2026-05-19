import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _supabase: SupabaseClient | null = null;

try {
  if (supabaseUrl.startsWith("http") && supabaseAnonKey) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
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
