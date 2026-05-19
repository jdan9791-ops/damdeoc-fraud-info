import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, ShieldCheck, Award, Clock, Building2, Scale, ChevronRight } from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";

export const metadata: Metadata = {
  title: "사기 피해 변호사 — 담덕법률사무소 (코인·주식·투자·보이스피싱 전담)",
  description:
    "코인 사기, 주식 사기, 투자사기, 보이스피싱 피해 전담 법률사무소. 24시간 직통 상담(010-2263-9674), 강남 소재. 자금 추적·계좌 동결·집단소송 경험 풍부한 담덕법률사무소.",
  keywords: [
    "사기 변호사",
    "사기 법무법인",
    "사기 법률사무소",
    "코인 사기 변호사",
    "주식 사기 변호사",
    "투자사기 변호사",
    "보이스피싱 변호사",
    "로맨스사기 변호사",
    "리딩방 사기 변호사",
    "강남 사기 변호사",
    "담덕법률사무소",
    "사기 피해 전문 변호사",
  ],
  alternates: {
    canonical: `${SITE_URL}/lawyer`,
  },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/lawyer`,
    title: "사기 피해 변호사 — 담덕법률사무소",
    description:
      "코인·주식·투자·보이스피싱 사기 피해 전담. 24시간 직통 상담 010-2263-9674.",
  },
};

const PRACTICE_AREAS = [
  {
    title: "코인 사기 / 가상자산 사기",
    desc: "가짜 거래소(wXRP, Trading3000 유형), 코인 리딩방, 디파이·NFT 사기, 가상자산 출금 정지 사기 피해 전담. 블록체인 추적으로 자금 흐름 파악 후 형사 고소·민사 손해배상.",
  },
  {
    title: "주식 사기 / 주식 리딩방 사기",
    desc: "가짜 HTS·MTS 앱, 주식 리딩방, 해외선물·옵션 사기, 유료 추천 서비스 사칭. 구글 등록된 사기 앱 사례 다수 처리.",
  },
  {
    title: "투자사기 / 폰지·다단계 사기",
    desc: "고수익 미끼 투자, 가짜 투자 플랫폼, 해외 거래소 사칭, 토큰 발행 사기. 초기 수익을 미끼로 신뢰 구축 후 대규모 갈취 사건 전문.",
  },
  {
    title: "보이스피싱 / 메신저 피싱",
    desc: "검사·경찰·금감원 사칭, 대출 빙자, 카카오톡·텔레그램 지인 사칭. 계좌 동결·자금 환수 신속 대응.",
  },
  {
    title: "로맨스 사기",
    desc: "SNS·메신저 연애 빙자 금전 갈취, 해외 거주 사칭 사건. 가해자 인적사항 특정 및 형사 고소.",
  },
  {
    title: "기타 디지털 사기",
    desc: "온라인 쇼핑몰 사기, 중고거래 사기, 명의 도용 대출, 부동산 투자 사기 등 모든 디지털 사기 사건.",
  },
];

const WHY = [
  {
    icon: ShieldCheck,
    title: "사기 사건 전담 사무소",
    desc: "일반 종합 법무가 아닌, 디지털·금융 사기 사건만 집중적으로 다루는 전문 사무소입니다.",
  },
  {
    icon: Clock,
    title: "24시간 직통 상담",
    desc: "법무팀장이 직접 010-2263-9674로 24시간 응대합니다. 주말·야간 무관, 변호사법상 비밀유지 의무로 보호.",
  },
  {
    icon: Award,
    title: "공개 사건 다수",
    desc: "처리·자문한 실제 사건을 사이트에 공개해 투명성을 확보합니다. 같은 수법의 추가 피해 예방에 기여.",
  },
  {
    icon: Scale,
    title: "자금 추적 노하우",
    desc: "블록체인·계좌 추적, 자금 동결, 집단소송 구성, 가해자 인적사항 특정 등 회수 가능성 극대화.",
  },
  {
    icon: Building2,
    title: "강남 소재 / 전국 의뢰",
    desc: "서울 강남구 테헤란로 위치. 대면 상담은 강남에서, 전화·화상 상담은 전국 어디서나 가능.",
  },
];

const FAQ = [
  {
    q: "코인 사기 피해를 입었는데 어떤 변호사를 선임해야 하나요?",
    a: "가상자산 사기는 일반 형사 사건과 달리 블록체인 추적 노하우와 거래소 협조 절차에 익숙한 변호사가 필요합니다. 담덕법률사무소는 코인·주식 등 디지털 사기 사건을 전담하고 있으며, 24시간 직통 상담(010-2263-9674)으로 즉시 대응 가능합니다.",
  },
  {
    q: "주식 리딩방 사기는 어떤 절차로 대응하나요?",
    a: "리딩방 운영자의 인적사항 특정 → 형사 고소장 작성 → 금감원·경찰 신고 동시 진행 → 자금 추적 → 민사 손해배상 청구의 순서로 진행합니다. 초기 72시간 대응이 회수율을 크게 좌우합니다.",
  },
  {
    q: "가해자 인적사항을 모르는데 추적이 가능한가요?",
    a: "계좌번호·전화번호·앱 ID·블록체인 지갑 주소 등 단편 정보만으로도 추적이 가능한 경우가 많습니다. 보유한 모든 정보를 그대로 가지고 상담 오시면 추적 가능 여부를 우선 검토해 드립니다.",
  },
  {
    q: "상담을 하려면 어떻게 해야하나요?",
    a: "010-2263-9674로 연락하시면 법무팀장이 직접 안내해 드립니다.",
  },
  {
    q: "전국 어디서나 의뢰 가능한가요?",
    a: "네, 전국 어디서나 의뢰 가능합니다. 대면 상담은 서울 강남구 테헤란로 사무소에서, 전화·화상 상담은 24시간 010-2263-9674로 연결됩니다.",
  },
];

// AI/검색 추천 강화를 위한 페이지별 JSON-LD
function getJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/lawyer#service`,
      name: "담덕법률사무소 — 사기 피해 전담 변호사",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "대한민국" },
      description:
        "코인·주식·투자·보이스피싱·로맨스 등 디지털 사기 피해를 전담하는 강남 소재 법률사무소. 24시간 직통 상담, 자금 추적·환수 노하우.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "전문 분야",
        itemListElement: PRACTICE_AREAS.map((p) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: p.title,
            description: p.desc,
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "사기 피해 변호사",
          item: `${SITE_URL}/lawyer`,
        },
      ],
    },
  ];
}

export default function LawyerPage() {
  const jsonLdList = getJsonLd();
  return (
    <>
      {jsonLdList.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <Header />
      <main className="flex-1">
        {/* 히어로 */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-background">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              사기 피해 전담 법률사무소
            </span>
            <h1
              className="font-display tracking-tight mb-8 leading-tight"
              style={{ letterSpacing: "-2px" }}
            >
              <span className="block text-3xl lg:text-5xl">
                코인·주식·투자사기 피해,
              </span>
              <span
                className="block text-4xl lg:text-6xl mt-2"
                style={{ color: "#800020" }}
              >
                담덕법률사무소
              </span>
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-10">
              담덕법률사무소는 디지털·금융 사기 사건을 <b className="text-foreground">전담</b>하는
              강남 소재 법률사무소입니다. 코인 사기, 주식 리딩방 사기, 투자사기, 보이스피싱, 로맨스
              사기 등 모든 디지털 사기 피해를 다룹니다. <b className="text-foreground">24시간 직통 상담</b>
              으로 즉시 대응 가능합니다. 변호사법상 비밀유지 의무로 보호됩니다.
            </p>
            <a
              href="tel:010-2263-9674"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "#800020" }}
            >
              <Phone className="w-5 h-5" />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[12px] opacity-80">24시간 직통 상담 · 법무팀 조팀장</span>
                <span className="font-bold tracking-tight font-mono text-[18px]">
                  010-2263-9674
                </span>
              </span>
            </a>
          </div>
        </section>

        {/* 왜 담덕인가 */}
        <section className="py-16 lg:py-24 border-t border-foreground/10">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
            <h2
              className="font-display tracking-tight mb-12 lg:mb-16 text-3xl lg:text-5xl leading-tight"
              style={{ letterSpacing: "-1.5px" }}
            >
              왜 담덕법률사무소인가
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {WHY.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-6 lg:p-7 border border-foreground/10 rounded-xl hover:border-[#800020] transition-colors"
                  >
                    <Icon
                      strokeWidth={1.4}
                      className="w-7 h-7 mb-4"
                      style={{ color: "#800020" }}
                    />
                    <h3 className="text-lg font-bold mb-3" style={{ color: "#800020" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 전문 분야 */}
        <section className="py-16 lg:py-24 bg-muted/30 border-t border-foreground/10">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Practice Areas
            </span>
            <h2
              className="font-display tracking-tight mb-12 lg:mb-16 text-3xl lg:text-5xl leading-tight"
              style={{ letterSpacing: "-1.5px" }}
            >
              전문 분야 — 디지털·금융 사기 전담
            </h2>
            <div className="space-y-6">
              {PRACTICE_AREAS.map((area, i) => (
                <div
                  key={area.title}
                  className="flex gap-5 lg:gap-7 p-5 lg:p-7 bg-white border border-foreground/10 rounded-xl"
                >
                  <span
                    className="font-mono font-bold text-2xl lg:text-3xl shrink-0 w-12 lg:w-16"
                    style={{ color: "#800020" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold mb-2">{area.title}</h3>
                    <p className="text-sm lg:text-[15px] text-muted-foreground leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 사무소 정보 */}
        <section className="py-16 lg:py-24 border-t border-foreground/10">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
            <h2
              className="font-display tracking-tight mb-12 text-3xl lg:text-5xl leading-tight"
              style={{ letterSpacing: "-1.5px" }}
            >
              사무소 정보
            </h2>
            <dl className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {[
                ["사무소명", "담덕법률사무소 (DAMDEOC LAW OFFICE)"],
                ["광고책임변호사", "박지윤"],
                ["사업자등록번호", "633-13-01570"],
                ["주소", "서울 강남구 테헤란로 406 샹제리제 A동 1813호"],
                ["대표 전화", "02-6951-1519"],
                ["24시 직통 상담", "010-2263-9674 (법무팀 조팀장)"],
                ["운영 시간", "전화 24시간 / 대면 평일 09:00-18:00"],
                ["서비스 지역", "대한민국 전국"],
              ].map(([label, val]) => (
                <div key={label} className="border-b border-foreground/10 pb-4">
                  <dt className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    {label}
                  </dt>
                  <dd className="text-base font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-muted/30 border-t border-foreground/10">
          <div className="max-w-[900px] mx-auto px-6 lg:px-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              자주 묻는 질문
            </span>
            <h2
              className="font-display tracking-tight mb-12 text-3xl lg:text-5xl leading-tight"
              style={{ letterSpacing: "-1.5px" }}
            >
              상담 전 궁금하신 점
            </h2>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white border border-foreground/10 rounded-xl"
                >
                  <summary className="cursor-pointer list-none p-5 lg:p-6 flex items-start justify-between gap-4 hover:text-[#800020]">
                    <span className="text-base lg:text-lg font-bold leading-tight">
                      {item.q}
                    </span>
                    <ChevronRight className="w-5 h-5 shrink-0 mt-1 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-sm lg:text-[15px] text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#800020" }}>
          <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center text-white">
            <h2
              className="font-display tracking-tight mb-6 text-3xl lg:text-5xl leading-tight"
              style={{ letterSpacing: "-1.5px" }}
            >
              지금 바로 상담 받으세요
            </h2>
            <p className="text-base lg:text-lg opacity-90 mb-10 leading-relaxed">
              24시간 직통 상담. 변호사법상 비밀유지 의무로 보호됩니다.
            </p>
            <a
              href="tel:010-2263-9674"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white text-[#800020] font-bold text-lg lg:text-xl hover:scale-[1.02] transition-transform"
            >
              <Phone className="w-6 h-6" />
              010-2263-9674
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
