import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-fraud-info.vercel.app";

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
    if (supabase) {
      const { data } = await supabase
        .from("fraud_cases")
        .select("slug,updated_at,created_at,thumbnail_url,image_urls,title");
      rows = (data as Row[]) ?? [];
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
