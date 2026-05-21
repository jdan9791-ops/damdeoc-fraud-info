import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getSupabase, type FraudCase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGrid from "@/components/ImageGrid";
import { Phone, ChevronRight, ArrowLeft } from "lucide-react";
import DetailHeroText from "@/components/DetailHeroText";
import ViewTracker from "@/components/ViewTracker";

// 첫 화면 이후 등장하는 섹션들은 lazy
const DetailFaq = dynamic(() => import("@/components/DetailFaq"));
const DetailCta = dynamic(() => import("@/components/DetailCta"));
const ReportSection = dynamic(() => import("@/components/ReportSection"));

export const revalidate = 3600;

async function getCase(slug: string): Promise<FraudCase | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("fraud_cases")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";
  const pageUrl = `${SITE_URL}/fraud/${slug}`;
  const c = await getCase(slug);
  if (!c) return {
    title: "사건을 찾을 수 없습니다",
    alternates: { canonical: pageUrl },
  };

  // ── 사건 제목을 키워드 검색에 직접 노출되도록 제목·설명 최적화 ──
  const baseTitle = c.meta_title || c.title;
  const titleHasFraud = /사기|피해/.test(baseTitle);
  const seoTitle = titleHasFraud
    ? baseTitle
    : `${baseTitle} - 사기 피해 사례`;

  const bodyFirst = c.body
    ? c.body.split(/\n\n+/)[0].replace(/#[^\s]+/g, "").trim().slice(0, 100)
    : "";
  const desc =
    c.meta_description ||
    [
      `${c.title} 사건의 수법, 피해 사례, 대응 방법.`,
      bodyFirst,
      `담덕법률사무소 24시간 직통 상담 010-2263-9674.`,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 200);

  const image = c.thumbnail_url || `${SITE_URL}/og-image.png`;

  const titleKeywords = (c.title || "")
    .split(/[\s,，、\-:|]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2 && s.length <= 30);
  const bodyHashtags = (c.body?.match(/#[^\s#]+/g) ?? []).map((h) => h.slice(1));
  const mergedKeywords = Array.from(
    new Set([
      ...(c.keywords ?? []),
      ...titleKeywords,
      ...bodyHashtags,
      "사기 피해",
      "사기 사례",
      "담덕법률사무소",
    ]),
  ).slice(0, 20);

  return {
    title: { absolute: seoTitle },
    description: desc,
    keywords: mergedKeywords,
    authors: [{ name: "담덕법률사무소", url: SITE_URL }],
    alternates: {
      canonical: pageUrl,
      languages: { "ko-KR": pageUrl },
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: pageUrl,
      siteName: "담덕법률사무소",
      title: seoTitle,
      description: desc,
      images: [{ url: image, alt: c.title }],
      publishedTime: c.created_at,
      modifiedTime: c.updated_at,
      authors: ["담덕법률사무소"],
      tags: mergedKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: desc,
      images: [image],
    },
    other: {
      "article:published_time": c.created_at,
      "article:modified_time": c.updated_at,
      "article:section": "사기 피해 사례",
      "article:tag": mergedKeywords.join(","),
    },
  };
}

const SAMPLE_FAQ = [
  { q: "신고는 어디에 해야 하나요?", a: "경찰청 사이버수사대(182) 또는 금융감독원(1332)에 신고하실 수 있습니다. 담덕법률사무소에 먼저 연락주시면 신고 절차를 안내해 드립니다." },
  { q: "피해 금액을 돌려받을 수 있나요?", a: "사안에 따라 다르지만, 초동 대응이 빠를수록 회수 가능성이 높아집니다. 72시간 이내 전문가 상담을 권장합니다." },
  { q: "증거는 어떻게 보존해야 하나요?", a: "대화 내용(카카오톡, 문자 등), 입금 내역, 앱 스크린샷, 상대방 연락처를 삭제하지 마시고 보존하세요." },
  { q: "상담을 하려면 어떻게 해야하나요?", a: "010-2263-9674로 연락하시면 법무팀장이 직접 안내해 드립니다." },
];

export default async function FraudDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const c = await getCase(slug).catch(() => null);

  const caseData: FraudCase = c ?? {
    id: 0,
    slug,
    title: slug.replace(/-/g, " "),
    body: `이 사건에 대한 상세 정보입니다.\n\n사기 수법과 피해 내용이 여기에 표시됩니다. Supabase 연결 후 실제 데이터가 표시됩니다.`,
    meta_title: "",
    meta_description: "",
    keywords: [],
    thumbnail_url: null,
    image_urls: [],
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 슬라이더에는 번호 이미지(1.jpg, 2.jpg ...)만 표시 — 썸네일은 목록/OG용으로만 사용
  const allImages: string[] = caseData.image_urls ?? [];

  // 본문에서 #해시태그 추출 — 한글/영문/숫자/.(점)/_(언더스코어) 허용
  const bodyHashtagMatches = caseData.body.match(/#[a-zA-Z0-9가-힣._]+/g) ?? [];
  const bodyHashtags = Array.from(new Set(bodyHashtagMatches.map((h) => h.slice(1))));
  const displayTags = bodyHashtags.length > 0
    ? bodyHashtags
    : (caseData.keywords ?? []).map((k) => k.replace(/\s+/g, ""));

  const isHashtagOnlyLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    const tokens = trimmed.split(/\s+/);
    return tokens.length > 0 && tokens.every((t) => /^#[a-zA-Z0-9가-힣._]+$/.test(t));
  };
  const bodyParagraphs = caseData.body
    .split(/\n\n+/)
    .map((para) =>
      para
        .split("\n")
        .filter((line) => !isHashtagOnlyLine(line))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);

  // ─── 구조화 데이터 (JSON-LD) ─────────────────────────────────────────
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";
  const pageUrl = `${SITE_URL}/fraud/${slug}`;

  const summary =
    bodyParagraphs[0]?.slice(0, 200) ||
    caseData.meta_description ||
    `${caseData.title} 사기 사건에 대한 정보 및 피해 대응 가이드`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: caseData.title,
    alternativeHeadline: caseData.meta_title || undefined,
    description: caseData.meta_description || summary,
    image: caseData.thumbnail_url ? [caseData.thumbnail_url] : [`${SITE_URL}/icon.png`],
    datePublished: caseData.created_at,
    dateModified: caseData.updated_at,
    author: {
      "@type": "Organization",
      name: "담덕법률사무소 법무팀",
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    inLanguage: "ko-KR",
    articleSection: "사기 피해 사례",
    keywords: caseData.keywords?.join(", ") || displayTags.join(", "),
    url: pageUrl,
    about: caseData.title,
    abstract: summary,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "최신 사기 사건", item: `${SITE_URL}/#cases` },
      { "@type": "ListItem", position: 3, name: caseData.title, item: pageUrl },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SAMPLE_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const imageObjectsJsonLd =
    allImages.length > 0
      ? allImages.map((url, i) => ({
          "@context": "https://schema.org",
          "@type": "ImageObject",
          contentUrl: url,
          url,
          name: `${caseData.title} - 사건 사진 ${i + 1}`,
          caption: `${caseData.title} 관련 자료 사진 ${i + 1}`,
        }))
      : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {imageObjectsJsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
      <ViewTracker slug={caseData.slug} />
      <Header />

      <main className="flex-1">
        {/* 히어로 헤더 */}
        <section className="pt-32 pb-16 border-b border-foreground/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <DetailHeroText />
          </div>
        </section>

        {/* 브레드크럼 */}
        <nav
          className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-5 pb-2"
          style={{
            fontSize: "12px",
            color: "#5e534a",
            fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
          }}
        >
          <div className="flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity shrink-0"
              style={{ color: "#5e534a" }}
            >
              <ArrowLeft className="w-3 h-3" />
              홈
            </a>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span
              className="truncate"
              title={caseData.title}
              style={{
                fontFamily: "'BookendBatang', serif",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              {caseData.title}
            </span>
          </div>
        </nav>

        {/* 본문 */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* ── LEFT — 본문 + FAQ */}
            <div className="w-full lg:w-[60%]">

              {/* 모바일: 이미지 슬라이더 */}
              <div className="lg:hidden mb-12 -mx-6">
                <ImageGrid images={allImages} />
              </div>

              {/* 글 제목 */}
              <header className="mb-10 pb-8 border-b border-foreground/10">
                <h1 className="font-display text-[25px] md:text-[31px] lg:text-[43px] font-light leading-tight tracking-tight break-keep" style={{ color: "#800020" }}>
                  {caseData.title}
                </h1>
              </header>

              {/* 본문 */}
              <article className="space-y-6">
                {bodyParagraphs.map((para, i) => (
                  <p key={i} className="leading-[1.85] text-lg" style={{ letterSpacing: "-0.3px", color: "#000000" }}>
                    {para}
                  </p>
                ))}
              </article>

              {/* 해시태그 */}
              {displayTags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-foreground/10">
                  <p className="label-editorial text-muted-foreground mb-4">TAGS</p>
                  <div className="flex flex-wrap gap-2">
                    {displayTags.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-full transition-colors hover:bg-[#800020] hover:text-white cursor-default"
                        style={{ backgroundColor: "rgba(128,0,32,0.08)", color: "#800020" }}
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 작성일 · 조회수 */}
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground mt-10 pt-6 border-t border-foreground/10">
                <span>{new Date(caseData.created_at).toLocaleDateString("ko-KR")}</span>
                <span className="w-px h-3 bg-foreground/20" />
                <span>조회 {caseData.view_count.toLocaleString()}</span>
              </div>

              <div className="my-16 h-px bg-foreground/10" />

              {/* 모바일: 상담 CTA */}
              <div className="lg:hidden mb-12">
                <DetailCta />
              </div>

              {/* FAQ */}
              <div className="mt-16">
                <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                  <span className="w-8 h-px bg-foreground/30" />
                  자주 묻는 질문
                </span>
                <h2 className="font-display text-3xl lg:text-4xl tracking-tight mb-10">
                  궁금하신 점이 있으신가요?
                </h2>
                <DetailFaq items={SAMPLE_FAQ} />
              </div>

              {/* 피해 접수 */}
              <div className="mt-16">
                <ReportSection />
              </div>
            </div>

            {/* ── RIGHT — 이미지 슬라이더 + 사이드 CTA (PC sticky) */}
            <div className="hidden lg:flex flex-col gap-8 w-[40%] sticky top-28">
              <div className="pt-10">
                <ImageGrid images={allImages} />
              </div>

              <div className="border border-foreground p-8 text-center" style={{ borderRadius: "35px" }}>
                <span className="font-mono text-xs tracking-[0.15em] block mb-4 text-muted-foreground">DAMDEOC LAW OFFICE</span>
                <p className="font-display text-2xl lg:text-3xl tracking-tight mb-2">
                  피해를 입으셨나요?
                </p>
                <p className="font-display text-base lg:text-lg tracking-tight leading-relaxed mb-6 text-muted-foreground">
                  지금 즉시 전문가와 상담하세요.<br />
                  <span
                    style={{
                      color: "#df0038",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    초동 대응이 피해 회복을 결정
                  </span>합니다.
                </p>
                <a
                  href="tel:010-2263-9674"
                  className="flex items-center justify-center gap-3 text-white px-6 py-4 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#800020", borderRadius: "70px" }}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="flex items-baseline gap-2 justify-center">
                    <span className="font-mono font-medium" style={{ fontSize: "17px" }}>010-2263-9674</span>
                    <span className="font-sans" style={{ fontSize: "12px" }}>직통 상담 · 법무팀 조팀장</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
