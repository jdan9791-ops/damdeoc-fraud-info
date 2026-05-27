import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

/**
 * POST /api/phone-click
 * Body: { slug?: string }
 *
 * 전화번호(tel:) 링크 클릭 트래킹.
 * page_views 테이블에 source="phone_click" 으로 INSERT.
 * 분석은 fraud_uploader 분석탭에서 page_views.source 필터로 집계.
 */
export async function POST(req: NextRequest) {
  const client = serverClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: "Supabase 환경 변수 없음" },
      { status: 503 },
    );
  }

  let body: { slug?: string } = {};
  try {
    body = await req.json();
  } catch {}
  const slug = (body.slug || "_root").trim();

  // 봇 차단
  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider|crawling|axios|curl|wget|preview/i.test(ua);
  if (isBot) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  const ipRaw =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "";
  const ipHash = ipRaw ? hashIp(ipRaw) : "anon";

  try {
    await client.from("page_views").insert({
      slug,
      source: "phone_click",
      ip_hash: ipHash,
      user_agent: ua.slice(0, 200),
    });
  } catch {
    // page_views 없으면 무시
  }

  return NextResponse.json({ ok: true });
}
