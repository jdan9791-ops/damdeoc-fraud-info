// SITE_URL 환경변수 갱신 반영 — 자동 배포 트리거용
import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";
const SITE_NAME = "담덕법률사무소 사기 피해 정보 센터";
const SITE_DESC =
  "투자사기·보이스피싱·로맨스사기·코인사기 등 실제 사기 사건 정보와 대응 방법을 제공합니다. 담덕법률사무소 법무팀이 운영하는 사기 피해 정보 공개 플랫폼.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}`,
    template: `%s | 담덕법률사무소`,
  },
  description: SITE_DESC,
  keywords: [
    "사기 피해",
    "투자사기",
    "보이스피싱",
    "로맨스사기",
    "코인사기",
    "주식리딩방 사기",
    "사기 신고",
    "사기 예방",
    "법무 상담",
    "담덕법률사무소",
    "사기 사건 정보",
    "피해 회복",
  ],
  authors: [{ name: "담덕법률사무소", url: SITE_URL }],
  creator: "담덕법률사무소",
  publisher: "담덕법률사무소",
  category: "Legal · Fraud Prevention",
  applicationName: "담덕법률사무소",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    // Google이 검색결과 사이트명 결정 시 og:site_name을 우선 사용 → 짧은 브랜드명
    siteName: "담덕법률사무소",
    title: SITE_NAME,
    description: SITE_DESC,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "담덕법률사무소 사기 피해 정보 센터 — 24시간 직통 상담 010-2263-9674",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    images: ["/og-image.png"],
  },
  alternates: {
    // canonical은 각 페이지에서 개별 설정 — 여기서 전역 설정 시 모든 하위 페이지가 홈으로 덮여 색인 오류 발생
    // canonical: SITE_URL,
    languages: { "ko-KR": SITE_URL },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    other: {
      "naver-site-verification":
        process.env.NEXT_PUBLIC_NAVER_VERIFICATION || "",
    },
  },
};

// ─── 사이트 전역 JSON-LD: Organization + WebSite ────────────────────────────
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LegalService", "Attorney", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "담덕법률사무소",
  legalName: "담덕법률사무소",
  alternateName: [
    "DAMDEOC LAW OFFICE",
    "담덕",
    "담덕 법률사무소",
    "담덕법률",
    "사기 피해 변호사",
    "코인 사기 변호사",
    "투자사기 변호사",
    "강남 사기 사건 변호사",
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/icon.png`,
  description: SITE_DESC,
  slogan: "사기 피해, 혼자 당하지 마세요. 24시간 직통 상담.",
  telephone: ["+82-10-2263-9674", "+82-2-6951-1519"],
  email: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "테헤란로 406 샹제리제 A동 1813호",
    addressLocality: "강남구",
    addressRegion: "서울",
    postalCode: "06192",
    addressCountry: "KR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.5044,
    longitude: 127.0489,
  },
  areaServed: [
    { "@type": "Country", name: "대한민국" },
    { "@type": "AdministrativeArea", name: "전국" },
  ],
  knowsAbout: [
    "사기 피해 법률 자문",
    "투자사기",
    "보이스피싱",
    "로맨스사기",
    "코인사기",
    "주식사기",
    "주식 리딩방 사기",
    "가상자산 사기",
    "해외선물 사기",
    "디파이 사기",
    "민사소송",
    "형사고소",
    "자금 추적",
    "블록체인 추적",
    "계좌 동결",
    "집단소송",
    "변호사 직통 상담",
  ],
  knowsLanguage: ["ko", "en"],
  serviceType: [
    "사기 피해 법률 상담",
    "형사 고소 대리",
    "민사 손해배상 청구",
    "집단소송 구성",
    "자금·블록체인 추적",
    "계좌 동결 신청",
    "변호인 의견서 작성",
    "24시간 긴급 법률 상담",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "담덕법률사무소 사기 피해 법률 서비스",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "코인 사기 피해 법률 자문",
          description:
            "가상자산·코인 거래소 사칭, 코인 리딩방, 디파이·NFT 사기 피해 형사 고소 및 자금 추적",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "주식 사기 피해 법률 자문",
          description:
            "주식 리딩방, 가짜 HTS·MTS, 해외선물·옵션 사기 피해 형사 고소 및 손해배상",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "보이스피싱 피해 법률 자문",
          description:
            "검사·경찰·금감원 사칭, 대출 빙자 보이스피싱 피해 신고·구제·자금 환수",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "로맨스 사기 피해 법률 자문",
          description: "SNS·메신저 연애 빙자, 해외 거주 사칭 금전 갈취 피해 추적·고소",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "24시간 긴급 직통 상담",
          description:
            "주말·야간 무관 즉시 변호사 상담 (010-2263-9674), 변호사법상 비밀유지 의무로 보호",
        },
      },
    ],
  },
  priceRange: "사건 검토 후 안내",
  taxID: "633-13-01570",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [SITE_URL],
};

// 광고책임변호사 — Person 스키마 (AI/검색이 변호사 식별)
const lawyerJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Person", "Attorney"],
  "@id": `${SITE_URL}/#lawyer-park`,
  name: "박지윤 변호사",
  jobTitle: "광고책임변호사",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  knowsAbout: [
    "사기 피해 법률 자문",
    "투자사기",
    "코인사기",
    "주식 리딩방 사기",
    "보이스피싱",
  ],
  affiliation: { "@id": `${SITE_URL}/#organization` },
  address: {
    "@type": "PostalAddress",
    streetAddress: "테헤란로 406 샹제리제 A동 1813호",
    addressLocality: "강남구",
    addressRegion: "서울",
    addressCountry: "KR",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  // Google 검색 결과에 표시되는 "사이트 이름" — 짧고 명확한 브랜드명 사용
  // (긴 SITE_NAME은 페이지 title/og:siteName으로 유지)
  name: "담덕법률사무소",
  alternateName: [SITE_NAME, "담덕법률사무소 사기 피해 정보", "DAMDEOC LAW OFFICE"],
  description: SITE_DESC,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "ko-KR",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* 외부 폰트 CDN preconnect — 핸드셰이크 시간 단축 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* BookendBatang preload — 헤딩 폰트 (LCP 후보) */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/2410-2@1.0/TTBookendBatangSB.woff2"
          crossOrigin="anonymous"
        />
        {/* Pretendard 변수 폰트 — 비동기 로드 (첫 렌더 차단 X) */}
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <link
          rel="stylesheet"
          media="print"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ onLoad: "this.media='all'" } as any)}
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
          />
        </noscript>
        {/* RSS 피드 자동 발견 — 네이버·RSS 리더용 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="담덕법률사무소 사기 피해 정보 센터 RSS"
          href="/rss.xml"
        />
        {/* JSON-LD: Organization + WebSite (모든 페이지에 공통) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lawyerJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
