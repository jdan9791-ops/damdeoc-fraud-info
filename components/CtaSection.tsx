"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* 스포트라이트 효과 */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <p className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
                  <span className="w-8 h-px bg-foreground/30" />
                  DAMDEOC LAW OFFICE
                </p>
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  피해를 입으셨나요?
                  <br />
                  지금 바로 연락하세요.
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  법무팀장 조팀장이 직접 상담합니다.
                  빠른 초동 대응이 피해 회복의 핵심입니다.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <a
                    href="tel:010-2263-9674"
                    className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    010-2263-9674 직통 상담
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-8 font-mono">
                  24시간 · 변호사법상 비밀유지 의무
                </p>
              </div>
            </div>
          </div>

          {/* 데코 코너 */}
          <div className="absolute top-0 right-0 w-24 h-24 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
