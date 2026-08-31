"use client";

import { useEffect, useState } from "react";

/**
 * 스크롤 시 스르륵 등장하는 플로팅 문의 CTA (레이어 팝업).
 * - 첫 화면에서 약 1스크롤 내리면 하단에서 슬라이드 인 (모바일 터치 스크롤 포함)
 * - 버튼 2개: 전화 문의(tel: PhoneClickTracker가 자동 추적) / 온라인 문의(#report 폼으로 스크롤)
 * - 닫기(×) 시 해당 세션 동안 다시 뜨지 않음
 * - 사건 상세 페이지(/fraud/[slug])에만 마운트 (#report 폼 존재)
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

  const goReport = () => {
    const el = document.getElementById("report");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const close = () => {
    setShow(false);
    setTimeout(() => setClosed(true), 450);
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

  return (
    <div
      aria-hidden={!show}
      className={`fixed z-[60] left-1/2 -translate-x-1/2 bottom-4 w-[min(94vw,460px)] transition-all duration-500 ease-out ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <div
        className="relative rounded-2xl px-3.5 pt-3.5 pb-3.5 shadow-2xl border border-white/10"
        style={{
          background: "linear-gradient(135deg, #7a0b1e 0%, #4a0713 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
      >
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-black/70 text-white text-base leading-none flex items-center justify-center hover:bg-black"
        >
          ×
        </button>
        <p className="text-center text-white text-[13.5px] font-semibold mb-2.5 leading-snug">
          피해를 입으셨나요? <span style={{ color: "#f6e05e" }}>지금 바로 문의하세요</span>
        </p>
        <div className="flex gap-2">
          <a
            href="tel:010-2263-9674"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-[#7a0b1e] font-bold py-3 text-[14.5px] active:scale-[0.97] transition-transform"
          >
            <span aria-hidden>📞</span>
            {/* 모바일: 탭하면 통화 / PC: 전화번호 노출 */}
            <span className="sm:hidden">내 피해 전화 문의</span>
            <span className="hidden sm:inline font-mono tracking-tight">010-2263-9674</span>
          </a>
          <button
            onClick={goReport}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl font-bold py-3 text-[14.5px] active:scale-[0.97] transition-transform"
            style={{ background: "#f6e05e", color: "#4a0713" }}
          >
            <span aria-hidden>💬</span> 내 피해 온라인 문의
          </button>
        </div>
        <button
          onClick={hideToday}
          className="mt-2 w-full text-center text-white/60 hover:text-white/90 text-[12px] underline underline-offset-2"
        >
          오늘 하루 안 보기
        </button>
      </div>
    </div>
  );
}
