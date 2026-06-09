import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.damdeoc-lawoffice.kr";

  type Row = {
    slug: string;
    updated_at: string;
    created_at: string;
    thumbnail_url: string | null;
    image_urls: string[] | null;
    title: string;
  };
  let rows: Row[] = [];
  try {
    const supabase = getSupabase();
    if (supabase) {
      for (let from = 0; ; from += 1000) {
        const { data } = await supabase
          .from("cases")
          .select("slug,updated_at,created_at,thumbnail_url,image_urls,title")
          .order("created_at", { ascending: false })
          .range(from, from + 999);
        if (!data || data.length === 0) break;
        rows.push(...(data as Row[]));
        if (data.length < 1000) break;
      }
    }
  } catch {
    // ignore
  }

  const casePaths: MetadataRoute.Sitemap = rows.map((r) => ({
    url: `${baseUrl}/fraud/${r.slug}`,
    lastModified: new Date(r.updated_at || r.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
    // Image sitemap 확장
    images: [
      ...(r.thumbnail_url ? [r.thumbnail_url] : []),
      ...((r.image_urls ?? []).slice(0, 10)),
    ],
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lawyer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...casePaths,
  ];
}
