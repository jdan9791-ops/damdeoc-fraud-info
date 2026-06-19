/**
 * StaticHeroChart — 히어로 배경용 "정적" 캔들차트 (애니메이션 없음)
 *
 * 기존 TradingChart(Canvas + requestAnimationFrame)를 대체한다.
 * - 움직이지 않는 고정 SVG → 모바일 CPU/배터리 부담 0
 * - 서버에서 렌더 → LCP 개선, 하이드레이션 부담 적음
 * - 결정적(deterministic) 시드 → SSR/CSR 동일, 사이트별 seed로 구도 차별화
 * - 은은한 버건디 모노톤 + 우상단 그라데이션 (stripe 느낌, 고정)
 *
 * 색은 props로 주입 → 6개 사이트가 같은 컴포넌트로 색조만 다르게.
 */

interface Props {
  /** 메인 버건디 (상승 봉·라인) */
  main: string;
  /** 연한 톤 (하락 봉) */
  soft: string;
  /** 구도 시드 — 사이트마다 다르게 주면 캔들 패턴이 달라짐 */
  seed?: number;
}

interface Candle {
  x: number;
  o: number;
  c: number;
  hi: number;
  lo: number;
  w: number;
}

function buildCandles(seed: number, count: number): Candle[] {
  let s = ((seed % 233280) + 233280) % 233280;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out: Candle[] = [];
  const top = 130;
  const bottom = 470;
  const slope = (bottom - top) / count; // 좌상단 → 우하단 하락 추세
  const x0 = 470;
  const gap = 30;
  const w = 15;
  for (let i = 0; i < count; i++) {
    const mid = top + slope * i + (rand() - 0.5) * 64;
    const o = mid + (rand() - 0.5) * 34;
    const c = mid + (rand() - 0.5) * 46;
    const hi = Math.min(o, c) - (10 + rand() * 24);
    const lo = Math.max(o, c) + (10 + rand() * 24);
    out.push({ x: x0 + i * gap, o, c, hi, lo, w });
  }
  return out;
}

export default function StaticHeroChart({ main, soft, seed = 1007 }: Props) {
  const candles = buildCandles(seed, 24);
  const gid = `shg-${seed}`;
  const bid = `shb-${seed}`;

  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gid} cx="80%" cy="28%" r="62%">
          <stop offset="0%" stopColor={main} stopOpacity="0.34" />
          <stop offset="100%" stopColor={main} stopOpacity="0" />
        </radialGradient>
        <filter id={bid} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="72" />
        </filter>
      </defs>

      {/* 우상단 은은한 버건디 그라데이션 (blur) */}
      <ellipse
        cx="950"
        cy="150"
        rx="430"
        ry="310"
        fill={`url(#${gid})`}
        filter={`url(#${bid})`}
      />

      {/* 정적 캔들 — 은은하게 */}
      <g opacity="0.16">
        {candles.map((k, i) => {
          const down = k.c > k.o; // y가 클수록 아래(하락)
          const col = down ? soft : main;
          const bodyTop = Math.min(k.o, k.c);
          const bodyH = Math.max(3, Math.abs(k.c - k.o));
          return (
            <g key={i} stroke={col} fill={col}>
              <line
                x1={k.x + k.w / 2}
                y1={k.hi}
                x2={k.x + k.w / 2}
                y2={k.lo}
                strokeWidth="1.5"
              />
              <rect x={k.x} y={bodyTop} width={k.w} height={bodyH} />
            </g>
          );
        })}
      </g>

      {/* 미세 격자 */}
      <g stroke={main} strokeWidth="0.5" opacity="0.06">
        <line x1="0" y1="140" x2="1200" y2="140" />
        <line x1="0" y1="280" x2="1200" y2="280" />
        <line x1="0" y1="420" x2="1200" y2="420" />
      </g>
    </svg>
  );
}
