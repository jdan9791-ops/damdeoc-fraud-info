import { NextRequest, NextResponse } from "next/server";
import { pingIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/indexnow
 *
 * Body: { urls: string[] }  또는  { slugs: string[] }
 *
 * fraud_uploader 같은 외부 도구에서 사건 발행 직후 호출하면
 * 해당 URL들을 IndexNow에 전달해 Bing·Yandex 색인을 가속한다.
 *
 * 인증: x-indexnow-secret 헤더에 INDEXNOW_SECRET 환경변수와 일치하는 값.
 *   설정 안 되어 있으면(개발/임시) 인증 생략.
 */
export async function POST(req: NextRequest) {
  // 간단한 시크릿 인증
  const secret = process.env.INDEXNOW_SECRET;
  if (secret) {
    const provided = req.headers.get("x-indexnow-secret");
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  let body: { urls?: string[]; slugs?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-fraud-info.vercel.app";

  // urls 우선, 없으면 slugs로 URL 조립
  const urls = Array.isArray(body.urls) && body.urls.length > 0
    ? body.urls
    : Array.isArray(body.slugs)
      ? body.slugs.map((s) => `${SITE_URL}/fraud/${s}`)
      : [];

  if (urls.length === 0) {
    return NextResponse.json(
      { ok: false, error: "urls 또는 slugs 배열이 필요합니다" },
      { status: 400 },
    );
  }

  // 최대 10,000개 (IndexNow 사양) — 안전하게 1,000으로 제한
  const limited = urls.slice(0, 1000);

  const result = await pingIndexNow(limited);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

/**
 * GET /api/indexnow — 헬스 체크
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "IndexNow proxy",
    docs: "POST { urls: string[] } 또는 { slugs: string[] }",
  });
}
