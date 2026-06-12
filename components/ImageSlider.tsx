"use client";

import { useState } from "react";
import Image from "next/image";
import { r2img } from "@/lib/r2img";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="font-heading text-6xl text-muted-foreground/30">⚠</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="relative w-full select-none">
      {/* 이미지 */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Image
          src={r2img(images[current])}
          alt={`사건 사진 ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={current === 0}
        />
      </div>

      {/* 화살표 — 이미지 위에 절대 위치 */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="slider-arrow absolute top-1/2 left-4 -translate-y-1/2 z-10"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-8 h-8 text-foreground" />
          </button>
          <button
            onClick={next}
            className="slider-arrow absolute top-1/2 right-4 -translate-y-1/2 z-10"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-8 h-8 text-foreground" />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`사진 ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
