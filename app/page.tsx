import { supabase, type FraudCase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CasesTable from "@/components/CasesTable";
import Footer from "@/components/Footer";

// 첫 화면(LCP) 이후에 보이는 섹션들은 lazy 로드 (JS 번들 분리)
const FraudTypesSection = dynamic(() => import("@/components/FraudTypesSection"));
const ReportSection = dynamic(() => import("@/components/ReportSection"));
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const revalidate = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-fraud-info.vercel.app";

async function getCases(): Promise<FraudCase[]> {
  if (!supabase) return [];
  // limit 5000 — Supabase 기본 1000 한도 우회 (range 사용 시 더 큰 값 가능)
  const { data } = await supabase
    .from("fraud_cases")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 4999);
  return data ?? [];
}

async function getCaseCount(): Promise<number> {
  if (!supabase) return 0;
  const { count } = await supabase
    .from("fraud_cases")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

// 메인 페이지 FAQ — 사이드 컴포넌트와 동기화
const HOME_FAQ = [
  {
    q: "신고는 어디에 해야 하나요?",
    a: "경찰청 사이버수사대(182) 또는 금융감독원(1332)에 신고하실 수 있습니다. 담덕법률사무소에 먼저 연락주시면 신고 절차를 안내해 드립니다.",
  },
  {
    q: "피해 금액을 돌려받을 수 있나요?",
    a: "사안에 따라 다르지만, 초동 대응이 빠를수록 회수 가능성이 높아집니다. 72시간 이내 전문가 상담을 권장합니다.",
  },
  {
    q: "증거는 어떻게 보존해야 하나요?",
    a: "대화 내용(카카오톡, 문자 등), 입금 내역, 앱 스크린샷, 상대방 연락처를 삭제하지 마시고 보존하세요.",
  },
  {
    q: "가해자의 인적사항을 모르는데 추적이 가능한가요?",
    a: "계좌번호·전화번호·앱 ID·블록체인 지갑 주소 등 단편 정보만으로도 추적이 가능한 경우가 많습니다. 보유한 모든 정보를 그대로 가지고 오시면 추적 가능 여부를 검토해 드립니다.",
  },
  {
    q: "익명 상담도 가능한가요?",
    a: "가능합니다. 모든 상담 내용은 변호사법상 비밀유지 의무로 보호되며, 상담 후 의뢰 여부와 관계없이 외부에 일절 공개되지 않습니다.",
  },
  {
    q: "상담을 하려면 어떻게 해야하나요?",
    a: "010-2263-9674로 연락하시면 법무팀장이 직접 안내해 드립니다.",
  },
];

export default async function HomePage() {
  let cases: FraudCase[] = [];
  let count = 0;

  try {
    [cases, count] = await Promise.all([getCases(), getCaseCount()]);
  } catch {
    cases = [];
    count = 0;
  }

  const displayCases = cases;
  const displayCount = count;

  // ─── 메인 페이지 JSON-LD: ItemList + FAQPage ──────────────────────────
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Header />
      <main className="flex-1 relative">
        <HeroSection caseCount={displayCount} />

        {/* 사건 목록 — 버건디 배경 */}
        <section id="cases" className="relative py-40 lg:py-48" style={{ backgroundColor: "#800020" }}>
          <div className="relative max-w-7xl mx-auto px-6">
            <CasesTable cases={displayCases} totalCount={displayCount} />
          </div>
        </section>

        {/* 주요 사기 유형 6 : 자주 묻는 질문 4 — 가로 배치 */}
        <section id="fraud-types-faq" className="py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16">
              {/* 주요 사기 유형 60% */}
              <div className="lg:col-span-6">
                <FraudTypesSection embedded />
              </div>

              {/* 자주 묻는 질문 40% — 좌측과 세로 길이 동일 */}
              <div id="faq" className="lg:col-span-4 flex flex-col">
                <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                  <span className="w-8 h-px bg-foreground/30" />
                  자주 묻는 질문
                </span>
                <h2 className="font-display tracking-tight mb-10 lg:mb-12 leading-tight">
                  <span className="block text-[24px] lg:text-[40px] leading-tight">
                    궁금하신 점이
                  </span>
                  <span className="block text-3xl lg:text-5xl leading-tight mt-1" style={{ color: "#800020" }}>
                    있으신가요?
                  </span>
                </h2>
                <Accordion multiple={false} className="space-y-0 flex-1 flex flex-col justify-between">
                  {HOME_FAQ.map((item, i) => (
                    <AccordionItem key={i} value={`home-faq-${i}`} className="border-b border-foreground/10 flex-1 flex flex-col justify-center">
                      <AccordionTrigger className="text-left text-[18px] font-medium py-5 lg:py-6 hover:no-underline hover:translate-x-1 transition-all duration-300 hover:text-[#800020]">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] pb-5">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* 제보 문의 — 70% 폭 (가운데 정렬) */}
        <section id="report" className="pb-20 lg:pb-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="mx-auto w-full lg:w-[70%]">
              <ReportSection />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
