"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  tag?: keyof React.JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current as HTMLElement & {
        _rbsplitInstance?: InstanceType<typeof GSAPSplitText>;
        _rbObserver?: IntersectionObserver;
      };

      // cleanup previous
      if (el._rbObserver) { el._rbObserver.disconnect(); el._rbObserver = undefined; }
      if (el._rbsplitInstance) {
        try { el._rbsplitInstance.revert(); } catch (_) {}
        el._rbsplitInstance = undefined;
      }

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });

      // 분리 대상 결정
      let targets: Element[] = [];
      if (splitType.includes("chars") && splitInstance.chars.length) targets = splitInstance.chars;
      else if (splitType.includes("words") && splitInstance.words.length) targets = splitInstance.words;
      else if (splitType.includes("lines") && splitInstance.lines.length) targets = splitInstance.lines;
      if (!targets.length) targets = splitInstance.chars || splitInstance.words || splitInstance.lines;

      // 초기 상태 즉시 설정
      gsap.set(targets, { ...from });

      // IntersectionObserver로 뷰포트 진입 감지 → 애니메이션 실행
      const playAnimation = () => {
        gsap.to(targets, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          willChange: "transform, opacity",
          force3D: true,
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            playAnimation();
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(el);
      el._rbsplitInstance = splitInstance;
      el._rbObserver = observer;

      return () => {
        observer.disconnect();
        gsap.killTweensOf(targets);
        try { splitInstance.revert(); } catch (_) {}
        el._rbsplitInstance = undefined;
        el._rbObserver = undefined;
      };
    },
    {
      dependencies: [
        text, delay, duration, ease, splitType,
        JSON.stringify(from), JSON.stringify(to),
        threshold, rootMargin, fontsLoaded,
      ],
      scope: ref,
    }
  );

  const style: React.CSSProperties = {
    textAlign,
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const Tag = tag as React.ElementType;
  return (
    <Tag ref={ref} style={style} className={`split-parent ${className}`}>
      {text}
    </Tag>
  );
};

export default SplitText;
