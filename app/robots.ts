import type { MetadataRoute } from "next";

/**
 * AI 검색엔진 + 일반 크롤러 모두에게 사이트 공개.
 *
 * - Allow: 모든 페이지 (공익 정보)
 * - Disallow: API 경로, 내부 라우트
 * - 명시: 주요 AI 크롤러 (GPTBot, ClaudeBot, Google-Extended, PerplexityBot 등)
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-fraud-info.vercel.app";

  // 명시적으로 허용할 크롤러 목록 (AI / 검색엔진)
  const aiAndSearchBots = [
    // — 일반 검색엔진 —
    "Googlebot",
    "Bingbot",
    "DuckDuckBot",
    "YandexBot",
    "Baiduspider",
    "Slurp",            // Yahoo
    "Yeti",             // 네이버
    "Daumoa",           // 다음
    // — AI 모델 학습용 크롤러 —
    "GPTBot",           // OpenAI 학습
    "OAI-SearchBot",    // OpenAI 검색
    "ChatGPT-User",     // ChatGPT 브라우징
    "ClaudeBot",        // Anthropic Claude
    "Claude-Web",       // Anthropic 검색
    "Google-Extended",  // Google Gemini/Bard 학습 동의
    "PerplexityBot",    // Perplexity AI
    "Perplexity-User",  // Perplexity 검색
    "CCBot",            // Common Crawl (대부분 LLM 학습에 사용)
    "anthropic-ai",
    "Amazonbot",        // Amazon Alexa/AI
    "Applebot",
    "Applebot-Extended",// Apple Intelligence
    "FacebookBot",      // Meta AI
    "Meta-ExternalAgent",
    "Bytespider",       // ByteDance (TikTok AI)
    "Diffbot",
    "ImagesiftBot",
    "cohere-ai",
    "MistralAI-User",
  ];

  return {
    rules: [
      // 일반 규칙
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // AI/검색 크롤러 — 명시적으로 전체 허용
      ...aiAndSearchBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
