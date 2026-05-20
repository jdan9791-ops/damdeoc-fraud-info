import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── 이미지 최적화 ──
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.workers.dev" },
    ],
    // 최신 포맷 자동 변환 (브라우저 지원 시)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ── 컴파일러 최적화 ──
  compiler: {
    // 프로덕션에서 console.log 자동 제거 (error/warn은 유지)
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ── React 엄격 모드 ──
  reactStrictMode: true,

  // ── 응답 압축 ──
  compress: true,

  // ── 패키지 가져오기 최적화 (lucide-react 트리쉐이킹, framer-motion) ──
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ── 정적 자산 캐시 헤더 (장기 캐시) ──
  async headers() {
    return [
      {
        source: "/og-image.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icon.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // 모든 _next/static 자산 1년 immutable
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
