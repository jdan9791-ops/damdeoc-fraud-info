"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BlurTextHero from "@/components/BlurTextHero";

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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black">
      {/* ─── 히어로 배경 이미지 ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-right opacity-80"
          sizes="100vw"
        />
        {/* PC: 좌→우 그라데이션 (왼쪽 텍스트 가독성 확보) */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg," +
              "rgba(0,0,0,0.92) 0%," +
              "rgba(0,0,0,0.80) 30%," +
              "rgba(0,0,0,0.55) 55%," +
              "rgba(0,0,0,0.20) 80%," +
              "rgba(0,0,0,0.05) 100%)",
          }}
        />
        {/* 모바일: 전체 어둡게 */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "rgba(0,0,0,0.70)" }}
        />
        {/* 상→하 페이드 (상단 헤더, 하단 마퀴 가독성) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg," +
              "rgba(0,0,0,0.30) 0%," +
              "transparent 25%," +
              "transparent 70%," +
              "rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* 그리드 라인 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-[1]">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white/10"
            style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white/10"
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

        {/* 설명 + CTA */}
        <div className="flex flex-col items-center lg:items-stretch gap-8 lg:gap-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-end w-full">
            <p
              className={`text-white/70 leading-relaxed text-center lg:text-left max-w-2xl lg:max-w-xl transition-all duration-700 delay-200 text-base lg:text-xl ${
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
              {/* 직통 상담 */}
              <a
                href="tel:010-2263-9674"
                className="group flex items-center justify-center lg:justify-start px-8 lg:px-7 py-6 lg:py-4 rounded-2xl transition-transform hover:scale-[1.02] text-white shadow-lg"
                style={{ backgroundColor: "#800020" }}
              >
                <div className="flex flex-col items-center sm:items-start leading-tight w-full">
                  <span className="font-sans text-center sm:text-left opacity-75 text-[14px] lg:text-[12px] mb-1.5 lg:mb-0">
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
                className="group flex items-center justify-center lg:justify-start border border-white/20 hover:bg-white/10 px-8 lg:px-7 py-6 lg:py-4 rounded-2xl transition-colors backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex flex-col items-center sm:items-start leading-tight w-full">
                  <span className="font-sans text-center sm:text-left text-white/50 text-[14px] lg:text-[12px] mb-1.5 lg:mb-0">
                    지금 즉시 접수
                  </span>
                  <span className="font-bold lg:font-medium text-white text-[20px] lg:text-[15px]">
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
                  <span className="text-2xl lg:text-5xl font-display" style={{ color: "#c8385a" }}>{stat.value}</span>
                  <span className="text-xs lg:text-sm text-white/50">
                    {stat.label}
                    <span className="block font-mono text-[10px] lg:text-xs mt-0.5 lg:mt-1 text-white/35">{stat.company}</span>
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
