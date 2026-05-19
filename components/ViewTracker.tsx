"use client";

import { useEffect } from "react";

/**
 * 페이지 로드 시 1회 view API 호출.
 * 같은 세션에서 같은 slug 재방문은 skip (sessionStorage).
 */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return; // 세션 내 중복 카운트 방지
      sessionStorage.setItem(key, "1");
    } catch {}

    // Beacon 우선 (페이지 닫혀도 전송 보장)
    const payload = JSON.stringify({
      slug,
      referrer: document.referrer || null,
    });

    const blob = new Blob([payload], { type: "application/json" });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/view", blob);
    } else {
      fetch("/api/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [slug]);

  return null;
}
