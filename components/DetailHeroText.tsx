"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

const ROTATING = ["상담하세요.", "확보하세요.", "대응하세요."]
const INTERVAL = 2800

export default function DetailHeroText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <h1 className="font-display tracking-tight leading-[1.1] text-3xl md:text-4xl lg:text-5xl flex items-baseline flex-wrap justify-center gap-x-3 text-center">
      <span className="text-muted-foreground">현재 피해를 입었다면 지금</span>

      {/* 회전 단어 */}
      <span className="relative inline-block overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            className="inline-block"
            style={{ color: "#800020" }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(8px)", y: -16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {ROTATING[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  )
}
