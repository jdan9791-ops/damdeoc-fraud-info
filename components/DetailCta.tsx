"use client"

import { Phone } from "lucide-react";

export default function DetailCta() {
  return (
    <div className="border border-foreground p-8 text-center" style={{ borderRadius: "35px" }}>
      <span className="font-mono text-xs tracking-[0.15em] block mb-4 text-muted-foreground">DAMDEOC LAW OFFICE</span>
      <p className="font-display text-2xl tracking-tight mb-2">피해를 입으셨나요?</p>
      <p className="font-display text-base tracking-tight leading-relaxed mb-6 text-muted-foreground">
        지금 즉시 전문가와 상담하세요.<br />
        <span
          style={{
            color: "#df0038",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontWeight: 600,
          }}
        >
          초동 대응이 피해 회복을 결정
        </span>합니다.
      </p>
      <a
        href="tel:010-2263-9674"
        className="flex items-center justify-center gap-3 text-white px-6 py-4 transition-colors hover:opacity-90"
        style={{ backgroundColor: "#800020", borderRadius: "70px" }}
      >
        <Phone className="w-4 h-4 shrink-0" />
        <span className="flex items-baseline gap-2 flex-wrap justify-center">
          <span className="font-mono font-medium" style={{ fontSize: "17px" }}>010-2263-9674</span>
          <span className="font-sans" style={{ fontSize: "12px" }}>직통 상담 · 법무팀 조팀장</span>
        </span>
      </a>
    </div>
  );
}
