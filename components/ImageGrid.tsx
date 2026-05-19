"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ImageGrid({ images }: { images: string[] }) {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // 스와이프 추적 (touch + mouse pointer)
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchActive = useRef<boolean>(false);

  const close = useCallback(() => {
    setZoomIndex(null);
    // 닫기 시 hover 정지 강제 해제 — 마퀴가 즉시 재개됨
    setHoverPaused(false);
  }, []);
  const zoomPrev = useCallback(() => {
    setZoomIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const zoomNext = useCallback(() => {
    setZoomIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  // 키보드 ESC / 화살표 ← →
  useEffect(() => {
    if (zoomIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") zoomPrev();
      else if (e.key === "ArrowRight") zoomNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIndex, close, zoomPrev, zoomNext]);

  // ── 스와이프 핸들러 (zoom + marquee 공용) ─────────────────────────
  const SWIPE_THRESHOLD = 50; // px
  const VERTICAL_TOLERANCE = 60; // 세로 스와이프 무시

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchActive.current = true;
  }

  function handleTouchMove(e: React.TouchEvent) {
    // 줌 모드일 때만 가로 스와이프 시 페이지 스크롤 방지
    if (zoomIndex !== null && touchActive.current && e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dx > dy && dx > 10) {
        // 가로 스와이프 의도 → 페이지 스크롤 차단
        try { e.preventDefault(); } catch {}
      }
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchActive.current) return;
    touchActive.current = false;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;
    // 세로 스와이프이거나 미세 이동이면 무시 (탭 동작 보존)
    if (Math.abs(dy) > VERTICAL_TOLERANCE) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx > 0) {
      // → 오른쪽 스와이프 = 이전 사진
      if (zoomIndex !== null) {
        zoomPrev();
      } else if (isMarquee) {
        // 마퀴 모드: 마지막 사진부터 줌 진입
        setZoomIndex(images.length - 1);
      }
    } else {
      // ← 왼쪽 스와이프 = 다음 사진
      if (zoomIndex !== null) {
        zoomNext();
      } else if (isMarquee) {
        setZoomIndex(0);
      }
    }
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center rounded-md">
        <span className="font-heading text-6xl text-muted-foreground/30">⚠</span>
      </div>
    );
  }

  const isMarquee = images.length >= 2;
  const isPaused = hoverPaused || userPaused || zoomIndex !== null;
  const duration = `${images.length * 5}s`;
  const trackImages = isMarquee ? [...images, ...images] : images;

  return (
    <div
      className="relative w-full touch-pan-y"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 상단 컨트롤 바 — 줌 모드: [X 닫기 왼쪽] ... [카운터 오른쪽] / 마퀴 모드: [좌] [총 N장] [우] [재생] */}
      <div className="absolute -top-10 left-0 right-0 z-30 flex items-center justify-between gap-2">
        {zoomIndex === null ? (
          <>
            {/* 좌측 — 빈 공간 (정렬 유지) */}
            <div />
            {/* 우측 — 총 N장 + 좌 화살표 + 우 화살표 + 재생/일시정지 */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-1 h-7 text-foreground text-[11px] font-mono tabular-nums">
                <span className="text-foreground/60">총</span>
                <span className="font-semibold">{images.length}</span>
                <span className="text-foreground/60">장</span>
              </div>
              {isMarquee && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 마지막 사진부터 큰 이미지 보기 진입
                    setZoomIndex(images.length - 1);
                  }}
                  title="이전 사진 크게 보기"
                  className="w-8 h-8 rounded-full bg-foreground/8 hover:bg-[#800020] hover:text-white border border-foreground/15 hover:border-[#800020] text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="이전 사진 크게 보기"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                </button>
              )}
              {isMarquee && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 첫 사진부터 큰 이미지 보기 진입
                    setZoomIndex(0);
                  }}
                  title="다음 사진 크게 보기"
                  className="w-8 h-8 rounded-full bg-foreground/8 hover:bg-[#800020] hover:text-white border border-foreground/15 hover:border-[#800020] text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="다음 사진 크게 보기"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
              )}
              {isMarquee && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserPaused((p) => !p);
                  }}
                  title={userPaused ? "재생" : "일시정지"}
                  className="relative w-8 h-8 rounded-full bg-foreground/8 hover:bg-foreground/15 border border-foreground/15 hover:border-foreground/30 text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label={userPaused ? "자동 재생 시작" : "자동 재생 일시정지"}
                >
                  {userPaused ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 좌측 — 빈 공간 (정렬 유지) */}
            <div />
            {/* 우측 상단 — 카운터 + 좌 화살표 + 우 화살표 + X 닫기 (마퀴 모드와 동일 구성) */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 h-7 text-foreground/70 text-[11px] font-mono tabular-nums">
                {zoomIndex + 1} / {images.length}
              </span>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomPrev();
                    }}
                    title="이전 사진"
                    className="w-8 h-8 rounded-full bg-foreground/8 hover:bg-[#800020] hover:text-white border border-foreground/15 hover:border-[#800020] text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="이전 사진"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomNext();
                    }}
                    title="다음 사진"
                    className="w-8 h-8 rounded-full bg-foreground/8 hover:bg-[#800020] hover:text-white border border-foreground/15 hover:border-[#800020] text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="다음 사진"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </>
              )}
              {/* X 닫기 — 포인트 컬러 강조 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  close();
                }}
                title="닫기"
                className="w-9 h-9 flex items-center justify-center rounded-full text-white border transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: "#800020",
                  borderColor: "#800020",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5e0a1a";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 14px rgba(128,0,32,0.55), 0 0 28px rgba(128,0,32,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#800020";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                }}
                aria-label="확대 닫기"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 본체: 줌 모드 OR 마퀴 모드 */}
      {zoomIndex !== null ? (
        // ─── 줌 모드 — 슬라이더 영역 내 큰 이미지 ───────────────────────
        <div className="relative w-full rounded-md overflow-hidden bg-black/5">
          {/* key로 강제 재마운트 → 화살표 클릭 시 즉시 새 이미지 표시 + fade-in */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`zoom-${zoomIndex}`}
            src={images[zoomIndex]}
            alt={`사건 사진 ${zoomIndex + 1}`}
            className="w-full h-auto block select-none animate-fade-in"
            draggable={false}
          />

          {/* 좌우 네비는 상단 컨트롤 바로 이동 (마퀴 모드와 동일 구성) */}
          {/* 모바일 스와이프 좌우는 그대로 작동 */}

          {/* 번호 배지 — 회색 투명, 작은 숫자 */}
          <span
            className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-mono font-semibold tabular-nums"
          >
            {zoomIndex + 1}
          </span>
        </div>
      ) : (
        // ─── 마퀴 모드 — 자동 좌측 슬라이드 ─────────────────────────────
        <div className="overflow-hidden">
          <div
            className={isMarquee ? "flex animate-marquee-left" : "grid grid-cols-1 gap-3"}
            style={
              isMarquee
                ? {
                    width: `${images.length * 100}%`,
                    animationDuration: duration,
                    animationPlayState: isPaused ? "paused" : "running",
                  }
                : undefined
            }
          >
            {trackImages.map((src, i) => {
              const realIdx = i % images.length;
              return (
                <button
                  key={`${realIdx}-${i}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomIndex(realIdx);
                  }}
                  className="group relative cursor-zoom-in shrink-0 px-1.5"
                  style={
                    isMarquee
                      ? { width: `${100 / (images.length * 2)}%` }
                      : { width: "100%" }
                  }
                  aria-label={`사진 ${realIdx + 1} 크게 보기`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`사건 사진 ${realIdx + 1}`}
                    className="w-full h-auto block rounded-md"
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="pointer-events-none absolute inset-x-1.5 inset-y-0 rounded-md bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <span
                    className="absolute top-2 left-3.5 w-7 h-7 flex items-center justify-center rounded-full text-white text-[12px] font-mono font-bold tabular-nums shadow-md"
                    style={{ backgroundColor: "#800020" }}
                  >
                    {realIdx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
