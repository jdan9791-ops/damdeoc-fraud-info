import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportSection from "@/components/ReportSection";

// 메인에 있던 제보 양식 — 2026-10-13 메인을 사건 목록만 남기며 따로 뺐다 (상단 메뉴 「사기사건 제보」)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-lawoffice.kr";

export const metadata: Metadata = {
  title: "사기 피해 제보",
  description:
    "투자사기·코인사기·보이스피싱·로맨스스캠 등 사기 피해 경위와 거래 내역을 남겨 주시면 내용을 검토한 뒤 상담 가능 여부를 안내드립니다. 24시간 직통 010-2263-9674.",
  alternates: { canonical: `${SITE_URL}/report` },
};

export default function ReportPage() {
  return (
    <>
      <Header />
      <main className="flex-1 relative pt-28 pb-20 lg:pt-32 lg:pb-28">
        <h1 className="sr-only">사기 피해 제보</h1>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mx-auto w-full lg:w-[70%]">
            <ReportSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
