import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 서버 측 Supabase 클라이언트 (service_role 키 — 환경 변수에서만 사용)
function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * 간단한 referrer 분류 (구글/네이버/다음/직접/기타)
 */
function categorizeReferrer(ref: string | null): string {
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.toLowerCase();
    if (host.includes("google.")) return "google";
    if (host.includes("naver.")) return "naver";
    if (host.includes("daum.") || host.includes("kakao.")) return "daum";
    if (host.includes("bing.")) return "bing";
    if (host.includes("yahoo.")) return "yahoo";
    if (host.includes("damdeoc-cases.vercel.app") || host.includes("damdeoc-lawoffice.kr")) return "internal";
    if (host.includes("vercel.app")) return "internal";
    return host;
  } catch {
    return "unknown";
  }
}

/**
 * IP를 단순 해시로 변환 (개인정보 보호)
 */
function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = ((h << 5) - h) + ip.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

export async function POST(req: NextRequest) {
  const client = serverClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: "Supabase 환경 변수 없음" }, { status: 503 });
  }

  let body: { slug?: string; referrer?: string } = {};
  try { body = await req.json(); } catch {}
  const slug = (body.slug || "").trim();
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug 누락" }, { status: 400 });
  }

  // 봇/크롤러 차단 (간단)
  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider|crawling|axios|curl|wget|preview/i.test(ua);
  if (isBot) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const ipRaw = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "";
  const ipHash = ipRaw ? hashIp(ipRaw) : "anon";
  const source = categorizeReferrer(body.referrer || req.headers.get("referer") || null);

  // 1) 조회수 증가 — cases.view_count + 1 (사이트2 전용 테이블)
  //    RPC increment_view_count는 fraud_cases 고정이라 미사용, cases 직접 UPDATE
  try {
    const { data: row } = await client.from("cases").select("view_count").eq("slug", slug).single();
    if (row) {
      await client.from("cases").update({ view_count: (row.view_count || 0) + 1 }).eq("slug", slug);
    }
  } catch (e) {
    // 조용히 실패 (조회수 증가 실패가 페이지 표시를 막으면 안 됨)
  }

  // 2) page_views INSERT (테이블 있으면)
  try {
    await client.from("page_views").insert({
      slug,
      source,
      ip_hash: ipHash,
      user_agent: ua.slice(0, 200),
    });
  } catch {
    // 테이블 없으면 무시
  }

  return NextResponse.json({ ok: true });
}
