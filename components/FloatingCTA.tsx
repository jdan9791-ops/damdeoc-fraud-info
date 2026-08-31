"use client";

import { useEffect, useState } from "react";

/**
 * 스크롤 시 화면 중앙에 스르륵 등장하는 플로팅 문의 CTA (레이어 팝업).
 * - 첫 화면에서 약 1스크롤 내리면 등장 (모바일 터치 스크롤 포함)
 * - PC: 크게 · 버튼 가로 2개 / 모바일: 버튼 세로 2단
 * - 전화(tel:, 녹색) · 온라인 문의(#report 스크롤, 파랑) — 온라인 클릭 시 자동 닫힘
 * - × 닫기(세션) · 오늘 하루 안 보기(그날 하루)
 */
export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("cta_closed") === "1") {
        setClosed(true);
        return;
      }
      if (localStorage.getItem("cta_hide_date") === todayKey()) {
        setClosed(true);
        return;
      }
    } catch {}
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setShow(y > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed) return null;

  const close = () => {
    setShow(false);
    setTimeout(() => setClosed(true), 400);
    try {
      sessionStorage.setItem("cta_closed", "1");
    } catch {}
  };
  const hideToday = () => {
    try {
      localStorage.setItem("cta_hide_date", todayKey());
    } catch {}
    close();
  };
  // 온라인 문의: 폼으로 이동 후 자동으로 사라짐
  const goReport = () => {
    const el = document.getElementById("report");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    close();
  };

  return (
    <div
      aria-hidden={!show}
      className={`fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[380px] sm:max-w-[600px] transition-all duration-500 ease-out ${
        show
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        className="relative rounded-2xl px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5 border border-white/15"
        style={{
          background: "linear-gradient(135deg, #e11d2a 0%, #c00d1a 100%)",
          boxShadow: "0 18px 60px rgba(200,0,20,0.45)",
        }}
      >
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black/70 text-white text-lg leading-none flex items-center justify-center hover:bg-black"
        >
          ×
        </button>

        <p className="text-center text-white text-[16px] sm:text-[19px] font-extrabold mb-3.5 sm:mb-4 leading-snug">
          피해를 입으셨나요?{" "}
          <span style={{ color: "#ffe27a" }}>지금 바로 문의하세요</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <a
            href="tel:010-2263-9674"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 sm:py-4 text-[16px] sm:text-[18px] font-bold text-white bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.97] transition"
          >
            <span aria-hidden>📞</span>
            <span className="font-mono tracking-tight">010-2263-9674</span>
          </a>
          <button
            onClick={goReport}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 sm:py-4 text-[16px] sm:text-[18px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.97] transition"
          >
            <span aria-hidden>💬</span> 내 피해 온라인 문의
          </button>
        </div>

        <button
          onClick={hideToday}
          className="mt-3 w-full text-center text-white/70 hover:text-white text-[13px] underline underline-offset-2"
        >
          오늘 하루 안 보기
        </button>
      </div>
    </div>
  );
}
