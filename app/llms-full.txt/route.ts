import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";

/**
 * llms-full.txt — AI가 사이트 전체 본문을 한 번에 학습/인용할 수 있도록
 * 모든 사건의 제목 + 본문을 마크다운으로 직렬화.
 */
export async function GET() {
  let cases: {
    slug: string;
    title: string;
    body: string;
    keywords: string[] | null;
    created_at: string;
    updated_at: string;
  }[] = [];
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("fraud_cases")
        .select("slug,title,body,keywords,created_at,updated_at")
        .order("created_at", { ascending: false })
        .limit(500);
      cases = (data as any[]) ?? [];
    }
  } catch {
    // 실패 시 빈 목록
  }

  const lines: string[] = [];
  lines.push(`# 담덕법률사무소 사기 피해 정보 — 전체 사건 모음`);
  lines.push("");
  lines.push(`> ${SITE_URL}`);
  lines.push(`> 운영: 담덕법률사무소 · 직통 상담 010-2263-9674`);
  lines.push(`> 총 ${cases.length}건 · 마지막 갱신 ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`---`);
  lines.push("");

  for (const c of cases) {
    lines.push(`## ${c.title}`);
    lines.push("");
    lines.push(`- **URL:** ${SITE_URL}/fraud/${c.slug}`);
    lines.push(`- **등록일:** ${c.created_at?.slice(0, 10) || "-"}`);
    if (c.keywords && c.keywords.length > 0) {
      lines.push(`- **키워드:** ${c.keywords.join(", ")}`);
    }
    lines.push("");
    if (c.body) {
      lines.push(c.body.trim());
    }
    lines.push("");
    lines.push(`---`);
    lines.push("");
  }

  if (cases.length === 0) {
    lines.push(`> 현재 등록된 사건이 없습니다.`);
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
