import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";
const SITE_NAME = "담덕 사기 사례 데이터베이스";
const SITE_DESC =
  "투자사기·보이스피싱·로맨스사기·코인사기 등 실제 사기 사건 정보와 대응 방법을 제공합니다.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  try {
    return new Date(iso).toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * RSS 2.0 피드 — 최신 사기 사건 50건.
 * 네이버 서치어드바이저의 RSS 제출용 및 일반 RSS 리더 지원.
 */
export async function GET() {
  type Row = {
    slug: string;
    title: string;
    body: string;
    meta_description: string | null;
    thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
  };

  let cases: Row[] = [];
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("cases")
        .select("slug,title,body,meta_description,thumbnail_url,created_at,updated_at")
        .order("created_at", { ascending: false })
        .limit(50);
      cases = (data as Row[]) ?? [];
    }
  } catch {
    // 빈 피드 반환
  }

  const lastBuildDate = toRfc822(
    cases[0]?.updated_at || cases[0]?.created_at || new Date().toISOString(),
  );

  const items = cases
    .map((c) => {
      const link = `${SITE_URL}/fraud/${c.slug}`;
      const desc =
        c.meta_description ||
        c.body?.slice(0, 200).replace(/\s+/g, " ").trim() ||
        c.title;
      const pubDate = toRfc822(c.created_at);
      const enclosure = c.thumbnail_url
        ? `<enclosure url="${escapeXml(c.thumbnail_url)}" type="image/jpeg" />`
        : "";

      return `    <item>
      <title>${escapeXml(c.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
      ${enclosure}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESC)}</description>
    <language>ko-KR</language>
    <copyright>담덕법률사무소</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
