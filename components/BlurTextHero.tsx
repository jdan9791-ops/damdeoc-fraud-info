"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

const WORDS = ["상담하세요.", "확보하세요.", "대응하세요."]
const INTERVAL = 2800
const ease = [0.76, 0, 0.24, 1] as const

export default function BlurTextHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  // 모바일에선 자간을 거의 정상으로, 데스크탑에선 -10px 타이트하게 / 메인 카피 1.25배 확대
  const size = "text-[clamp(2.625rem,8.125vw,6.25rem)]"
  const common = `font-display leading-[1.15] lg:leading-[1.1] tracking-[-2.5px] lg:tracking-[-10px]`

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      {/* 고정 1줄 */}
      <div className={`${common} ${size} text-foreground`}>
        현재 피해를 입었다면
      </div>

      {/* 고정 "지금" + 롤링 단어 — 모바일 가운데 / PC 좌측 */}
      <div className={`${common} ${size} flex items-baseline justify-center lg:justify-start`}>
        <span className="mr-[0.2em]">지금</span>

        {/* 롤링 컨테이너 — 슬라이드 클리핑은 세로만 (가로는 visible) */}
        <div
          className="leading-[1.15] lg:leading-[1.1] pr-3"
          style={{ overflowY: "hidden", overflowX: "visible" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              className="block border-b-[5px] lg:border-b-[10px] border-foreground/20 pr-2"
              style={{ color: "#800020" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.5, ease }}
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* 인디케이터 — 모바일 가운데 / PC 좌측 */}
      <div className="flex gap-1.5 mt-6 lg:mt-8 justify-center lg:justify-start">
        {WORDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-foreground" : "w-2 bg-foreground/20"
            }`}
            aria-label={`${WORDS[i]} 보기`}
          />
        ))}
      </div>
    </div>
  )
}
