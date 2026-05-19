"use client";

/**
 * TradingChart — 코인/주식 거래소 차트 배경 컴포넌트
 *
 * 사기 정보 사이트 주제에 맞는 시각적 메타포:
 * - 캔들스틱(봉) 차트 — 빨강(상승) / 파랑(하락)
 * - 20봉 이동평균선 (얇은 곡선)
 * - 하단 거래량 막대
 * - 좌측 가격 축 + 상단 티커 정보
 * - 우→좌 천천히 자동 스크롤 (새 봉이 우측에서 추가되는 느낌)
 * - IntersectionObserver로 화면 밖이면 자동 정지 (성능)
 *
 * Canvas API + requestAnimationFrame 기반 (DOM 부담 없음)
 */
import { useEffect, useRef } from "react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

interface Props {
  opacity?: number;
  speed?: number; // 봉당 진행 ms (낮을수록 빠름)
  bullColor?: string; // 상승 봉
  bearColor?: string; // 하락 봉
  maColor?: string; // 이평선
  axisColor?: string; // 축·격자
  className?: string;
}

const TICKERS = [
  "BTC/USDT",
  "ETH/USDT",
  "XRP/USDT",
  "DOGE/USDT",
  "SOL/USDT",
  "삼성전자",
  "KOSPI",
  "S&P500",
];

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D"];

export default function TradingChart({
  opacity = 0.7,
  speed = 1200,
  bullColor = "#e6364a", // 한국식: 빨강 = 상승
  bearColor = "#2769e6", // 파랑 = 하락
  maColor = "#f3c34a", // 이평선 = 노란
  axisColor = "rgba(120,120,120,0.18)",
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // 캔들 데이터 (rolling window)
  const candlesRef = useRef<Candle[]>([]);
  const lastTickRef = useRef<number>(0);
  // 현재 가격 시뮬레이션
  const priceRef = useRef<number>(60000);
  const trendRef = useRef<number>(1); // 1=상승추세, -1=하락
  const trendCountRef = useRef<number>(0);

  // 티커/타임프레임 회전
  const tickerIdxRef = useRef<number>(0);
  const lastTickerSwapRef = useRef<number>(0);

  // 가짜 캔들 생성 (랜덤 워크 + 추세 변화)
  function generateCandle(): Candle {
    // 추세 변화 (가끔)
    trendCountRef.current++;
    if (trendCountRef.current > 15 + Math.random() * 25) {
      trendRef.current = Math.random() > 0.5 ? 1 : -1;
      trendCountRef.current = 0;
    }
    const base = priceRef.current;
    const volatility = base * 0.008; // 0.8% 변동성
    const drift = trendRef.current * volatility * 0.3 * Math.random();
    const open = base;
    const close = base + drift + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 0.6 + 0.2;
    priceRef.current = Math.max(close, base * 0.7); // 너무 낮아지지 않게
    return { open, close, high, low, volume };
  }

  function ensureSize() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const w = Math.max(rect.width, 100);
    const h = Math.max(rect.height, 100);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, W, H);

    const padLeft = 64;
    const padRight = 12;
    const padTop = 36;
    const padBottom = 50; // 거래량 영역
    const chartW = W - padLeft - padRight;
    const chartH = H - padTop - padBottom;
    const volTop = H - padBottom + 6;
    const volH = padBottom - 14;

    // 캔들 개수 동적 결정
    const candleW = Math.max(4, Math.min(10, chartW / 70));
    const candleGap = Math.max(2, candleW * 0.35);
    const totalCW = candleW + candleGap;
    const maxCandles = Math.floor(chartW / totalCW) + 2;
    // 부족하면 채우기
    while (candlesRef.current.length < maxCandles) {
      candlesRef.current.unshift(generateCandle());
    }
    if (candlesRef.current.length > maxCandles + 2) {
      candlesRef.current.length = maxCandles + 2;
    }
    const candles = candlesRef.current;

    // 가격 범위
    let priceMin = Infinity;
    let priceMax = -Infinity;
    for (const c of candles) {
      if (c.low < priceMin) priceMin = c.low;
      if (c.high > priceMax) priceMax = c.high;
    }
    if (!isFinite(priceMin) || !isFinite(priceMax) || priceMin === priceMax) {
      priceMin = priceRef.current * 0.95;
      priceMax = priceRef.current * 1.05;
    }
    const pricePad = (priceMax - priceMin) * 0.1;
    priceMin -= pricePad;
    priceMax += pricePad;
    const priceRange = priceMax - priceMin;

    function priceToY(p: number): number {
      return padTop + chartH - ((p - priceMin) / priceRange) * chartH;
    }

    // 부드러운 스크롤 오프셋 (마지막 봉이 추가된 후 경과 비율)
    const now = performance.now();
    const elapsed = now - lastTickRef.current;
    const scrollOffset = Math.min(1, elapsed / speed) * totalCW;

    // ── 격자 (가로 4줄) ──
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = padTop + (chartH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();
    }

    // ── 가격 축 라벨 ──
    ctx.fillStyle = "rgba(140,140,140,0.55)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const p = priceMin + (priceRange * (5 - i)) / 5;
      const y = padTop + (chartH * i) / 5;
      const label = p > 1000 ? p.toFixed(0) : p.toFixed(2);
      ctx.fillText(label, padLeft - 6, y);
    }

    // ── 이동평균선 (20봉) ──
    const MA_PERIOD = 20;
    ctx.strokeStyle = maColor;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < candles.length; i++) {
      if (i < MA_PERIOD - 1) continue;
      let sum = 0;
      for (let k = 0; k < MA_PERIOD; k++) sum += candles[i - k].close;
      const ma = sum / MA_PERIOD;
      const x =
        padLeft + chartW - (candles.length - 1 - i) * totalCW + scrollOffset;
      const y = priceToY(ma);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── 캔들스틱 (우측부터 그림) ──
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const x =
        padLeft + chartW - (candles.length - 1 - i) * totalCW + scrollOffset;
      if (x < padLeft - candleW || x > W - padRight + candleW) continue;
      const isBull = c.close >= c.open;
      const color = isBull ? bullColor : bearColor;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // 심지 (high~low)
      const yHigh = priceToY(c.high);
      const yLow = priceToY(c.low);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(x + candleW / 2, yHigh);
      ctx.lineTo(x + candleW / 2, yLow);
      ctx.stroke();

      // 몸통
      const yOpen = priceToY(c.open);
      const yClose = priceToY(c.close);
      const bodyTop = Math.min(yOpen, yClose);
      const bodyH = Math.max(1, Math.abs(yClose - yOpen));
      ctx.fillRect(x, bodyTop, candleW, bodyH);

      // ── 거래량 막대 ──
      const vH = c.volume * volH;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x, volTop + (volH - vH), candleW, vH);
      ctx.globalAlpha = 1;
    }

    // ── 상단 티커/타임프레임 정보 ──
    if (now - lastTickerSwapRef.current > 4000) {
      tickerIdxRef.current = (tickerIdxRef.current + 1) % TICKERS.length;
      lastTickerSwapRef.current = now;
    }
    const ticker = TICKERS[tickerIdxRef.current];
    const tf = TIMEFRAMES[tickerIdxRef.current % TIMEFRAMES.length];
    const lastClose = candles[candles.length - 1]?.close ?? priceRef.current;
    const prevClose =
      candles[candles.length - 2]?.close ?? lastClose;
    const changePct = ((lastClose - prevClose) / prevClose) * 100;
    const changeColor = changePct >= 0 ? bullColor : bearColor;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillStyle = "rgba(70,70,70,0.7)";
    ctx.fillText(ticker, padLeft, 10);
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillStyle = "rgba(120,120,120,0.55)";
    ctx.fillText(`· ${tf}`, padLeft + ticker.length * 8.5 + 6, 13);

    // 우측 상단 — 현재가 + 변동률
    ctx.textAlign = "right";
    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillStyle = changeColor;
    ctx.fillText(lastClose.toFixed(2), W - padRight, 10);
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText(
      `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`,
      W - padRight,
      26,
    );

    // 다음 봉 추가 타이밍
    if (elapsed >= speed) {
      candlesRef.current.push(generateCandle());
      // 화면 밖 봉 제거
      if (candlesRef.current.length > maxCandles + 5) {
        candlesRef.current.shift();
      }
      lastTickRef.current = now;
    }
  }

  function loop() {
    if (isVisibleRef.current) {
      ensureSize();
      draw();
    }
    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    // 초기 데이터 시드
    candlesRef.current = [];
    priceRef.current = 60000 + (Math.random() - 0.5) * 5000;
    lastTickRef.current = performance.now();
    lastTickerSwapRef.current = performance.now();

    // reduce-motion 사용자 보호
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      isVisibleRef.current = false;
    }

    ensureSize();
    rafRef.current = requestAnimationFrame(loop);

    // IntersectionObserver — 화면 밖이면 정지 (성능)
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

    // ResizeObserver — 윈도우 크기 변화 대응
    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => ensureSize());
      ro.observe(containerRef.current);
    }

    const onVisibility = () => {
      if (document.hidden) isVisibleRef.current = false;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
