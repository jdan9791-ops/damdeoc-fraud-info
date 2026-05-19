"use client"

import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  PhoneCall,
  HeartCrack,
  Bitcoin,
  BarChart2,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FRAUD_TYPES: {
  number: string;
  type: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
  {
    number: "01",
    type: "투자사기",
    desc: "가짜 HTS·MTS 앱, 위조 투자 플랫폼을 통한 고수익 미끼 사기. 초기 수익을 돌려주며 신뢰를 쌓은 뒤 대규모 피해를 입힙니다.",
    Icon: TrendingUp,
  },
  {
    number: "02",
    type: "보이스피싱",
    desc: "검사·경찰·금융기관 사칭 전화로 금전 이체를 유도하는 사기. '계좌 동결'과 '수사' 명목으로 피해자를 압박합니다.",
    Icon: PhoneCall,
  },
  {
    number: "03",
    type: "로맨스 사기",
    desc: "온라인 교제 후 신뢰를 쌓은 뒤 투자·금전을 요구하는 사기. 해외 거주 사칭, 감정 조종이 주요 수법입니다.",
    Icon: HeartCrack,
  },
  {
    number: "04",
    type: "코인 사기",
    desc: "가상자산 투자를 빌미로 피해자의 자산을 탈취하는 사기. 가짜 거래소와 토큰 발행으로 피해를 유발합니다.",
    Icon: Bitcoin,
  },
  {
    number: "05",
    type: "리딩방 사기",
    desc: "주식·코인 리딩방에서 허위 정보 제공 후 수수료를 편취하는 사기. 유명인 사칭과 허위 수익 인증이 특징입니다.",
    Icon: BarChart2,
  },
  {
    number: "06",
    type: "온라인 쇼핑 사기",
    desc: "가짜 쇼핑몰 운영 또는 직거래를 통해 대금만 받고 잠적하는 사기. SNS 광고와 허위 후기를 활용합니다.",
    Icon: ShoppingBag,
  },
];

function FraudCard({
  item,
  index,
}: {
  item: (typeof FRAUD_TYPES)[0];
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { Icon } = item;

  return (
    <div
      ref={ref}
      className={`group flex flex-col gap-3 p-5 lg:p-6 border border-foreground/10 rounded-xl hover:border-[#800020] hover:shadow-lg transition-all duration-500 bg-card ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* 상단: 큰 번호 + 아이콘 (번호는 보더와 같은 컬러, 호버 시 버건디) */}
      <div className="flex items-start justify-between">
        <span
          className="font-mono font-bold leading-none text-foreground/10 group-hover:text-[#800020] transition-colors duration-500"
          style={{ fontSize: "44px" }}
        >
          {item.number}
        </span>
        <Icon
          strokeWidth={1.4}
          className="w-7 h-7 text-foreground/30 group-hover:text-[#800020] group-hover:scale-110 transition-all duration-500"
        />
      </div>

      {/* 제목 */}
      <h3
        className="text-base lg:text-lg font-bold leading-tight mt-2"
        style={{ color: "#800020" }}
      >
        {item.type}
      </h3>

      {/* 설명 */}
      <p className="text-[12px] lg:text-[13px] text-muted-foreground leading-relaxed flex-1">
        {item.desc}
      </p>
    </div>
  );
}

export default function FraudTypesSection({ embedded = false }: { embedded?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 임베디드 모드 — 좌측 60% 컬럼 안에 들어갈 때 (헤딩 좌측 정렬 + 3컬럼 그리드)
  if (embedded) {
    return (
      <div id="fraud-types" ref={sectionRef} className="relative">
        {/* 헤딩 — 좌측 정렬 */}
        <div className="mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            주요 사기 유형
          </span>
          <h2
            className={`font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="block text-[24px] lg:text-[40px] leading-tight">
              알아야 막을 수 있습니다.
            </span>
            <span className="block text-3xl lg:text-5xl leading-tight mt-1" style={{ color: "#800020" }}>
              주요 사기 수법 6가지.
            </span>
          </h2>
        </div>

        {/* 3컬럼 그리드 — 좁아진 폭에 맞춰 2행 3열 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {FRAUD_TYPES.map((item, index) => (
            <FraudCard key={item.number} item={item} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="fraud-types" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* 헤딩 — 중앙 정렬 */}
        <div className="mb-16 lg:mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            주요 사기 유형
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2
            className={`font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* 1번 줄: -5px (4xl → 3xl, 6xl → 5xl 효과) */}
            <span className="block text-[27px] lg:text-[51px] leading-tight">
              알아야 막을 수 있습니다.
            </span>
            {/* 2번 줄: 기존 크기 + 포인트 컬러 */}
            <span className="block text-4xl lg:text-6xl leading-tight mt-1" style={{ color: "#800020" }}>
              주요 사기 수법 6가지.
            </span>
          </h2>
        </div>

        {/* 6컬럼 그리드 — [번호] · 아이콘 / 제목 / 설명 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {FRAUD_TYPES.map((item, index) => (
            <FraudCard key={item.number} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
