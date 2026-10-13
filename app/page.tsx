import { getSupabase, type ListCase } from "@/lib/supabase";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CasesTable from "@/components/CasesTable";
import Footer from "@/components/Footer";

export const revalidate = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";

// 홈페이지 canonical 명시 (layout에서 제거됐으므로 여기서 직접 설정)
export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: { "ko-KR": SITE_URL },
  },
};

async function getCases(): Promise<ListCase[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  // Supabase는 요청당 최대 1000행만 반환한다. 1000건씩 페이지네이션으로 전부 가져온다.
  const PAGE = 1000;
  const all: ListCase[] = [];
  for (let start = 0; ; start += PAGE) {
    const { data } = await supabase
      .from("cases")
      .select("id,slug,title,thumbnail_url")   // 목록에 쓰는 4칸만 — 본문·이미지 목록까지 받던 것(메인 HTML 4.8MB) 줄임 (2026-10-13)
      .order("created_at", { ascending: false })
      .range(start, start + PAGE - 1);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
  }
  return all;
}

async function getCaseCount(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("cases")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function HomePage() {
  let cases: ListCase[] = [];
  let count = 0;

  try {
    [cases, count] = await Promise.all([getCases(), getCaseCount()]);
  } catch {
    cases = [];
    count = 0;
  }

  const displayCases = cases;
  const displayCount = count;

  // ─── 메인 페이지 JSON-LD: ItemList (FAQPage 는 /faq 로 옮김) ──────────────────────────
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "최신 사기 사건 목록",
    description:
      "담덕법률사무소가 수집한 실제 사기 사건 정보 목록. 투자사기, 보이스피싱, 로맨스사기, 코인사기 등 다양한 유형의 피해 사례를 제공합니다.",
    numberOfItems: displayCases.length,
    itemListElement: displayCases.slice(0, 50).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/fraud/${c.slug}`,
      name: c.title,
      image: c.thumbnail_url || undefined,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <Header />
      {/* 메인은 사건 목록만 (2026-10-13 이실장) — 상단 비주얼·사기 유형·FAQ·제보는 메인에서 빼고 /fraud-types · /faq · /report 로 */}
      <main className="flex-1 relative pt-20">
        {/* 사건 목록 — 버건디 배경 */}
        <section id="cases" className="relative py-14 lg:py-20 scroll-mt-20" style={{ backgroundColor: "#800020" }}>
          <div className="relative max-w-7xl mx-auto px-6">
            <CasesTable cases={displayCases} totalCount={displayCount} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
