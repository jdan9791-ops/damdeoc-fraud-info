"use client";

import { useEffect } from "react";

/**
 * 사이트 전역 전화번호 클릭 추적.
 * 모든 <a href="tel:..."> 클릭을 잡아 /api/phone-click 으로 POST.
 * layout.tsx 에 1회만 마운트.
 *
 * 사건 페이지(/fraud/{slug})에서 클릭 시 slug 기록, 그 외 페이지는 "_root".
 * 같은 세션 내 5초 이내 중복 클릭은 무시 (실수 더블탭 방지).
 */
export default function PhoneClickTracker() {
  useEffect(() => {
    let lastFired = 0;
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest?.(
        "a[href^='tel:']",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const now = Date.now();
      if (now - lastFired < 5000) return; // 5초 이내 중복 무시
      lastFired = now;

      // 현재 URL에서 사건 slug 추출
      const m = window.location.pathname.match(/^\/fraud\/(.+?)\/?$/);
      const slug = m ? decodeURIComponent(m[1]) : "_root";

      const payload = JSON.stringify({ slug });
      try {
        if (typeof navigator.sendBeacon === "function") {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/phone-click", blob);
        } else {
          fetch("/api/phone-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // 추적 실패는 무시 (전화 걸기는 정상 작동)
      }
    }
    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
