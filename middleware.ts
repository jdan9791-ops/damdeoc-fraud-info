import { NextRequest, NextResponse } from "next/server";

/**
 * 사이트 공격 방어 미들웨어
 * - Rate Limiting (IP당 분당 60건)
 * - 의심스러운 경로 차단 (.env, .git, wp-admin 등)
 * - 보안 헤더 (XSS, Clickjacking, MIME sniffing 등)
 */

// ─── 인메모리 Rate Limit Store ────────────────────────────────────────
type Bucket = { count: number; resetAt: number };
const rateStore = new Map<string, Bucket>();
const RATE_LIMIT_WINDOW = 60_000; // 1분
const RATE_LIMIT_MAX = 60;        // 일반 페이지: 분당 60건
const API_RATE_LIMIT_MAX = 30;    // API: 분당 30건

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

function checkRateLimit(ip: string, isApi: boolean): boolean {
  const now = Date.now();
  const max = isApi ? API_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
  const key = `${ip}:${isApi ? "api" : "page"}`;
  const bucket = rateStore.get(key);

  if (!bucket || bucket.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (bucket.count >= max) return false;
  bucket.count++;
  return true;
}

// 오래된 버킷 청소 (메모리 누수 방지)
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return;
  lastCleanup = now;
  for (const [k, v] of rateStore) {
    if (v.resetAt < now) rateStore.delete(k);
  }
}

// ─── 의심스러운 경로 패턴 ─────────────────────────────────────────────
const BLOCKED_PATHS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wordpress/i,
  /^\/xmlrpc/i,
  /^\/phpmyadmin/i,
  /^\/\.aws/i,
  /^\/admin\.php/i,
  /^\/config\.php/i,
  /\/etc\/passwd/i,
  /\.\.\//, // path traversal
];

// ─── 의심스러운 쿼리/페이로드 패턴 ────────────────────────────────────
const SUSPICIOUS_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /union\s+select/i,
  /\b(select|insert|update|delete|drop|alter)\b.*\bfrom\b/i,
];

function isSuspicious(url: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(url));
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  // CSP — Next/Vercel 이미지·인라인 스타일 허용
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in",
      "frame-ancestors 'self'",
      "base-uri 'self'",
    ].join("; "),
  );
  return res;
}

export function middleware(req: NextRequest) {
  cleanup();

  const { pathname, search } = req.nextUrl;
  const fullUrl = pathname + search;

  // 1) 차단 경로
  if (BLOCKED_PATHS.some((p) => p.test(pathname))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2) XSS/SQLi 의심 패턴
  if (isSuspicious(decodeURIComponent(fullUrl))) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 3) Rate Limit
  const ip = getClientIp(req);
  const isApi = pathname.startsWith("/api/");
  if (!checkRateLimit(ip, isApi)) {
    const res = new NextResponse(
      JSON.stringify({ error: "Too Many Requests" }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } },
    );
    return res;
  }

  // 4) 보안 헤더
  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외하고 모두에 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, icon.png, apple-icon.png
     * - robots.txt, sitemap.xml
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|symbol.png|robots.txt|sitemap.xml|llms.txt|llms-full.txt|opengraph-image).*)",
  ],
};
