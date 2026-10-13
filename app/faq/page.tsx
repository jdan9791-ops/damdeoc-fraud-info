import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 메인에 있던 「자주 묻는 질문」 — 2026-10-13 메인을 사건 목록만 남기며 따로 뺐다 (상단 메뉴 「FAQ」)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "사기 피해 신고 방법, 피해 금액 회복, 증거 보존, 가해자 추적, 익명 상담 등 자주 묻는 질문과 답변입니다. 24시간 직통 010-2263-9674.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQ = [
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

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />
      <main className="flex-1 relative pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            자주 묻는 질문
          </span>
          <h1 className="font-display tracking-tight mb-10 lg:mb-12 leading-tight">
            <span className="block text-[24px] lg:text-[40px] leading-tight">
              궁금하신 점이
            </span>
            <span className="block text-3xl lg:text-5xl leading-tight mt-1" style={{ color: "#800020" }}>
              있으신가요?
            </span>
          </h1>
          <Accordion multiple={false} className="space-y-0">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-foreground/10">
                <AccordionTrigger className="text-left text-[18px] font-medium py-5 lg:py-6 hover:no-underline hover:translate-x-1 transition-all duration-300 hover:text-[#800020]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  );
}
