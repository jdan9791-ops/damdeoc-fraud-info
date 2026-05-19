"use client";

import { useEffect, useRef } from "react";

interface Props {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  fontSize?: number;
  opacity?: number;
  className?: string;
}

/**
 * LetterGlitch — 캔버스 기반 글리치 효과 배경.
 * https://reactbits.dev/backgrounds/letter-glitch 참고하여 재구현.
 */
export default function LetterGlitch({
  glitchColors = ["#5e0a1a", "#8a1530", "#b03050", "#d04060"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = false,
  smooth = true,
  fontSize = 16,
  opacity = 0.2,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lettersRef = useRef<
    { char: string; color: string; targetColor: string; colorProgress: number }[]
  >([]);
  const gridRef = useRef<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const lastGlitchRef = useRef<number>(0);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const charWidth = fontSize * 0.62;
  const charHeight = fontSize * 1.05;

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }
  function randomColor() {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function rgbStr([r, g, b]: number[]) {
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }

  function interpolate(a: string, b: string, t: number) {
    const ar = a.startsWith("rgb") ? a.match(/\d+/g)!.map(Number) : hexToRgb(a);
    const br = b.startsWith("rgb") ? b.match(/\d+/g)!.map(Number) : hexToRgb(b);
    return rgbStr([
      ar[0] + (br[0] - ar[0]) * t,
      ar[1] + (br[1] - ar[1]) * t,
      ar[2] + (br[2] - ar[2]) * t,
    ]);
  }

  function initGrid(width: number, height: number) {
    const cols = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    gridRef.current = { cols, rows };
    const total = cols * rows;
    lettersRef.current = Array.from({ length: total }, () => {
      const c = randomColor();
      return { char: randomChar(), color: c, targetColor: c, colorProgress: 1 };
    });
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { cols } = gridRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px ui-monospace, "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lettersRef.current.forEach((letter, i) => {
      const x = (i % cols) * charWidth;
      const y = Math.floor(i / cols) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  }

  function tickGlitch() {
    const numUpdate = Math.max(1, Math.floor(lettersRef.current.length * 0.04));
    for (let i = 0; i < numUpdate; i++) {
      const idx = Math.floor(Math.random() * lettersRef.current.length);
      const l = lettersRef.current[idx];
      l.char = randomChar();
      const next = randomColor();
      if (smooth) {
        l.targetColor = next;
        l.colorProgress = 0;
      } else {
        l.color = next;
        l.targetColor = next;
        l.colorProgress = 1;
      }
    }
  }

  function smoothColors() {
    if (!smooth) return;
    lettersRef.current.forEach((l) => {
      if (l.colorProgress < 1) {
        l.colorProgress = Math.min(1, l.colorProgress + 0.06);
        l.color = interpolate(l.color, l.targetColor, 0.06);
      }
    });
  }

  function animate() {
    const now = performance.now();
    if (now - lastGlitchRef.current >= glitchSpeed) {
      tickGlitch();
      lastGlitchRef.current = now;
    }
    smoothColors();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }

  function resize() {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    initGrid(w, h);
  }

  const isVisibleRef = useRef<boolean>(true);
  const prefersReducedMotionRef = useRef<boolean>(false);

  function loop() {
    if (isVisibleRef.current && !prefersReducedMotionRef.current) {
      const now = performance.now();
      if (now - lastGlitchRef.current >= glitchSpeed) {
        tickGlitch();
        lastGlitchRef.current = now;
      }
      smoothColors();
      draw();
    }
    animationRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    // 사용자가 모션 감소 설정했으면 글리치 정지 (접근성 + 성능)
    if (typeof window !== "undefined" && window.matchMedia) {
      prefersReducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }

    resize();
    // 화면에 보이지 않으면 처음엔 일단 정지 상태로 시작
    isVisibleRef.current = true;
    animationRef.current = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => resize());
    if (containerRef.current) ro.observe(containerRef.current);

    // IntersectionObserver — 화면에 보일 때만 글리치 작동 (성능 최적화)
    let io: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
        },
        { rootMargin: "100px", threshold: 0.01 },
      );
      io.observe(containerRef.current);
    }

    // 탭 비활성화(다른 탭으로 전환) 시 글리치 정지
    const onVisibility = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      }
      // 탭 복귀 시는 IntersectionObserver가 알아서 처리
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ""}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 100px 20px rgba(0,0,0,0.65)" }}
        />
      )}
      {centerVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
