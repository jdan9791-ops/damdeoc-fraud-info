import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FraudTypesSection from "@/components/FraudTypesSection";

// 메인에 있던 「주요 사기 유형」 — 2026-10-13 메인을 사건 목록만 남기며 따로 뺐다 (상단 메뉴 「사기 유형」)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";

export const metadata: Metadata = {
  title: "주요 사기 유형 6가지",
  description:
    "투자사기, 보이스피싱, 로맨스 사기, 코인 사기, 리딩방 사기, 온라인 쇼핑 사기 — 자주 일어나는 사기 수법 6가지와 특징을 정리했습니다.",
  alternates: { canonical: `${SITE_URL}/fraud-types` },
};

export default function FraudTypesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 relative pt-20">
        <h1 className="sr-only">주요 사기 유형 6가지</h1>
        <FraudTypesSection />
      </main>
      <Footer />
    </>
  );
}
