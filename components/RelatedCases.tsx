/**
 * RelatedCases — 사건 상세 페이지 하단 "관련 사건" 내부링크 섹션
 *
 * 목적: 사건끼리 촘촘히 연결해 (1) 검색엔진이 "콘텐츠가 풍부하고 잘 연결된
 * 사이트"로 인식하게 하고 (2) 방문자가 사건을 타고 다니며 체류시간을 늘린다.
 * 기존엔 사건당 내부링크가 헤더/푸터뿐(약 10개) → 관련 사건 30개를 추가로 연결.
 *
 * 텍스트 링크 위주(가벼움) + ItemList 구조화 데이터.
 */

import type { FraudCase } from "@/lib/supabase";

export type RelatedCase = Pick<
  FraudCase,
  "slug" | "title" | "thumbnail_url" | "created_at"
>;

export default function RelatedCases({ cases }: { cases: RelatedCase[] }) {
  if (!cases || cases.length === 0) return null;

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "관련 사기 사건",
    itemListElement: cases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/fraud/${encodeURIComponent(c.slug)}`,
      name: c.title,
    })),
  };

  return (
    <section className="border-t border-foreground/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-foreground/30" />
          관련 사기 사건
        </span>
        <h2 className="font-display text-2xl lg:text-4xl tracking-tight mb-3">
          이런 사건도 함께 확인하세요
        </h2>
        <p className="text-muted-foreground mb-10 text-sm lg:text-base leading-relaxed break-keep">
          비슷한 수법·키워드의 사기 피해 사례입니다. 수법을 미리 알아두면 피해를
          예방할 수 있습니다.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
          {cases.map((c) => (
            <li key={c.slug} className="border-b border-foreground/10">
              <a
                href={`/fraud/${encodeURIComponent(c.slug)}`}
                className="group flex items-start gap-3 py-3.5"
                title={c.title}
              >
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#800020", opacity: 0.45 }}
                  aria-hidden="true"
                />
                <span
                  className="text-[15px] leading-snug line-clamp-2 break-keep transition-colors group-hover:text-[#800020]"
                  style={{ color: "#1a1a1a" }}
                >
                  {c.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
