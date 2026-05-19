"use client";

import { Phone, MapPin, ArrowUpRight } from "lucide-react";

const links = {
  "법적 고지": [
    { name: "개인정보처리방침", href: "/privacy" },
    { name: "이용약관", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-foreground/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            {/* 브랜드 */}
            <div>
              <div className="mb-6">
                <p
                  className="text-2xl mb-1"
                  style={{ fontFamily: "'BookendBatang', serif", fontWeight: 600 }}
                >
                  <span style={{ color: "#800020" }}>담덕</span>법률사무소
                </p>
                <p className="text-xs text-muted-foreground font-mono">DAMDEOC LAW OFFICE</p>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-xs text-sm">
                사기 피해 예방과 법적 대응을 돕습니다.<br />
                실제 피해 사례 정보를 공유하여 피해를 최소화합니다.
              </p>
            </div>

            {/* 연락처 */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium mb-6">직통 상담 전화번호</h3>

              {/* 메인 전화 — 크게 강조 */}
              <a
                href="tel:010-2263-9674"
                className="flex items-baseline gap-4 mb-6 hover:opacity-90 transition-opacity flex-wrap"
                style={{ color: "#800020" }}
              >
                <span className="inline-flex items-center gap-3">
                  <Phone className="w-6 h-6 shrink-0" />
                  <span className="text-2xl md:text-3xl font-medium tracking-tight font-mono">010-2263-9674</span>
                </span>
                <span className="text-sm font-normal opacity-80">법무팀 조팀장</span>
              </a>

              {/* 대표전화 + 주소 5:5 한 줄 */}
              <div className="grid grid-cols-2 gap-6 text-sm pt-6 border-t border-foreground/10">
                <a
                  href="tel:02-6951-1519"
                  className="flex items-start gap-2 text-muted-foreground hover:text-[#800020] transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    02-6951-1519
                    <span className="block text-xs text-muted-foreground/70 font-normal mt-0.5">대표 전화</span>
                  </span>
                </a>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    서울 강남구 테헤란로 406
                    <span className="block">샹제리제 A동 1813호</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 법적 고지 */}
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {items.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-[#800020] transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 담덕법률사무소. All rights reserved. 사업자등록번호: 633-13-01570 · 광고책임변호사 : 박지윤
          </p>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
              {/* 펄스 링 (ping 애니메이션) */}
              <span className="absolute inline-flex w-full h-full rounded-full bg-green-500 opacity-60 animate-ping" />
              {/* 본체 + 블러 글로우 */}
              <span
                className="relative inline-flex w-2 h-2 rounded-full bg-green-500"
                style={{
                  boxShadow: "0 0 6px rgba(34,197,94,0.9), 0 0 14px rgba(34,197,94,0.6), 0 0 22px rgba(34,197,94,0.35)",
                }}
              />
            </span>
            사기 피해 정보 센터 운영 중
          </div>
        </div>
      </div>
    </footer>
  );
}
