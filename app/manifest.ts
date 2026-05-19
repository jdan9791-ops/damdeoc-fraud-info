import type { MetadataRoute } from "next";

/**
 * PWA manifest.
 * Google 검색 결과의 사이트명(sitename) 결정 시 manifest의 `name`/`short_name`을
 * 신호로 사용한다. og:site_name + JSON-LD WebSite.name + manifest.name 모두
 * "담덕법률사무소"로 통일해 Google이 Vercel이 아닌 브랜드명으로 표시하도록 유도.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "담덕법률사무소 사기 피해 정보 센터",
    short_name: "담덕법률사무소",
    description:
      "투자사기·보이스피싱·로맨스사기·코인사기 등 실제 사기 사건 정보와 대응 방법을 제공합니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f2937",
    lang: "ko-KR",
    scope: "/",
    icons: [
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
