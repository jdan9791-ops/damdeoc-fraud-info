"use client"

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  { q: "신고는 어디에 해야 하나요?", a: "경찰청 사이버수사대(182) 또는 금융감독원(1332)에 신고하실 수 있습니다. 담덕법률사무소에 먼저 연락주시면 신고 절차를 안내해 드립니다." },
  { q: "피해 금액을 돌려받을 수 있나요?", a: "사안에 따라 다르지만, 초동 대응이 빠를수록 회수 가능성이 높아집니다. 72시간 이내 전문가 상담을 권장합니다." },
  { q: "증거는 어떻게 보존해야 하나요?", a: "대화 내용(카카오톡, 문자 등), 입금 내역, 앱 스크린샷, 상대방 연락처를 삭제하지 마시고 보존하세요." },
  { q: "상담을 하려면 어떻게 해야하나요?", a: "010-2263-9674로 연락하시면 법무팀장이 직접 안내해 드립니다." },
];

export default function FaqSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            자주 묻는 질문
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            궁금하신 점이 있으신가요?
          </h2>
        </div>

        <div className="max-w-3xl">
          <Accordion multiple={false} className="space-y-0">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-foreground/10">
                <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline hover:translate-x-2 transition-all duration-300 hover:text-[#800020]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
