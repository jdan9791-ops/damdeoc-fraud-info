"use client";

import { useEffect, useState } from "react";
import BlurTextHero from "@/components/BlurTextHero";
import StaticHeroChart from "@/components/StaticHeroChart";

export default function HeroSection({ caseCount }: { caseCount: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: `${caseCount.toLocaleString()}건`, label: "등록된 사기 사건", company: "담덕법률사무소" },
    { value: "24시간", label: "법무팀장 직통 상담", company: "010-2263-9674" },
    { value: "72시간", label: "초동 대응 권장", company: "피해 최소화" },
    { value: "100%", label: "비밀 보장 상담", company: "개인정보 보호" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* ─── 히어로 영역 배경 — 코인/주식 거래소 차트 ─────────────────── */}
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <StaticHeroChart main="#6e0c2e" soft="#b06079" seed={2007} />
        {/* 데스크탑 — 좌→우 (왼쪽 글자, 오른쪽 글리치) */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, " +
              "rgba(250,250,248,0.95) 0%, " +
              "rgba(250,250,248,0.92) 30%, " +
              "rgba(250,250,248,0.80) 50%, " +
              "rgba(250,250,248,0.58) 75%, " +
              "rgba(250,250,248,0.35) 100%)",
          }}
        />
        {/* 데스크탑 — 위→아래 미세 페이드 (하단 글리치 거의 안 보이도록 추가 톤다운) */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              "linear-gradient(180deg, " +
              "rgba(250,250,248,0.25) 0%, " +
              "rgba(250,250,248,0.30) 40%, " +
              "rgba(250,250,248,0.50) 70%, " +
              "rgba(250,250,248,0.80) 100%)",
          }}
        />
        {/* 모바일 — 하단도 거의 화이트 (글리치 매우 은은하게만 비침) */}
        <div
          className="absolute inset-0 pointer-events-none lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, " +
              "rgba(250,250,248,0.98) 0%, " +
              "rgba(250,250,248,0.95) 30%, " +
              "rgba(250,250,248,0.90) 55%, " +
              "rgba(250,250,248,0.82) 80%, " +
              "rgba(250,250,248,0.78) 100%)",
          }}
        />
      </div>


      {/* 그리드 라인 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 pt-28 pb-40 lg:pt-36 lg:pb-40">
        {/* BlurText 헤드라인 */}
        <div
          className={`mb-10 lg:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BlurTextHero />
        </div>

        {/* 설명 + CTA — 모바일: 가운데 정렬 / PC: 좌측 정렬 그리드 */}
        <div className="flex flex-col items-center lg:items-stretch gap-8 lg:gap-10">
          {/* PC: 2컬럼 그리드, 모바일: 가운데 정렬 스택 */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-end w-full">
            <p
              className={`text-muted-foreground leading-relaxed text-center lg:text-left max-w-2xl lg:max-w-xl transition-all duration-700 delay-200 text-base lg:text-xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              담덕법률사무소가 수집한 실제 사기 사건 정보를 공유합니다.<br />
              투자사기·보이스피싱·로맨스사기 피해 수법과 예방 정보를 확인하세요.
            </p>

            <div
              className={`mt-8 lg:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-xl lg:max-w-none transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* 직통 상담 — 모바일 크게 강조 / PC 원래 크기 */}
              <a
                href="tel:010-2263-9674"
                className="group flex items-center justify-center lg:justify-start px-8 lg:px-7 py-6 lg:py-4 rounded-2xl transition-transform hover:scale-[1.02] text-white shadow-lg lg:shadow-none"
                style={{ backgroundColor: "#800020" }}
              >
                <div className="flex flex-col items-center sm:items-start leading-tight w-full">
                  <span className="font-sans text-center sm:text-left opacity-80 lg:opacity-70 text-[14px] lg:text-[12px] mb-1.5 lg:mb-0">
                    직통 상담 · 법무팀 조팀장
                  </span>
                  <span className="font-bold font-mono tracking-tight text-[28px] lg:text-[16px] lg:font-medium lg:font-sans">
                    010-2263-9674
                  </span>
                </div>
              </a>

              {/* 피해 제보 */}
              <a
                href="#report"
                className="group flex items-center justify-center lg:justify-start border border-foreground/20 hover:bg-white/50 px-8 lg:px-7 py-6 lg:py-4 rounded-2xl transition-colors backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <div className="flex flex-col items-center sm:items-start leading-tight w-full">
                  <span className="font-sans text-center sm:text-left text-muted-foreground text-[14px] lg:text-[12px] mb-1.5 lg:mb-0">
                    지금 즉시 접수
                  </span>
                  <span className="font-bold lg:font-medium text-[20px] lg:text-[15px]">
                    내가 당한 사기사건 제보 하기
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 마퀴 */}
      <div
        className={`absolute bottom-16 lg:bottom-24 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-8 lg:gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 lg:gap-16">
              {stats.map((stat) => (
                <div key={`${stat.company}-${i}`} className="flex items-baseline gap-2 lg:gap-4">
                  <span className="text-2xl lg:text-5xl font-display" style={{ color: "#800020" }}>{stat.value}</span>
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    {stat.label}
                    <span className="block font-mono text-[10px] lg:text-xs mt-0.5 lg:mt-1">{stat.company}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
