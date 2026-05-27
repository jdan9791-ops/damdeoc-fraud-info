"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { name: "최신 사기 사건", href: "/#cases" },
  { name: "사기사건 제보", href: "/#report" },
  { name: "사기 유형", href: "/#fraud-types" },
  { name: "변호사 소개", href: "/lawyer" },
  { name: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full border-b transition-colors duration-200 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white border-foreground/10 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 h-20">
          {/* 로고 */}
          <Link href="/" className="flex flex-col leading-none">
            <span
              className="tracking-tight text-2xl"
              style={{ fontFamily: "'BookendBatang', serif", fontWeight: 600 }}
            >
              <span style={{ color: "#800020" }}>담덕</span>법률사무소
            </span>
            <span
              className="text-muted-foreground text-left font-sans"
              style={{ fontSize: "12px" }}
            >
              사기 사례 데이터베이스
            </span>
          </Link>

          {/* 데스크탑 네비 — 호버 시 버건디 pill */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 px-4 py-2 rounded-full hover:text-white"
                style={{
                  // 트랜지션 0 — 즉시 색상 변경
                  transition: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transition = "none";
                  el.style.backgroundColor = "#800020";
                  el.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transition = "none";
                  el.style.backgroundColor = "";
                  el.style.color = "";
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 데스크탑 CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:010-2263-9674"
              className="flex items-center text-white rounded-full px-6 h-12"
              style={{ backgroundColor: "#800020" }}
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="inline-flex items-center gap-1.5 font-normal opacity-80 text-[11px]">
                  <Phone className="shrink-0 w-3.5 h-3.5" />
                  24시 직통상담
                </span>
                <span className="font-bold tracking-tight font-mono text-[17px]">
                  010-2263-9674
                </span>
              </div>
            </a>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* 모바일 풀스크린 메뉴 */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-[60] transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 닫기 X 버튼 — 우측 상단 명확하게 */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="메뉴 닫기"
          className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#800020" }}
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div
            className={`pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <a
              href="tel:010-2263-9674"
              className="flex items-center justify-center gap-3 w-full bg-foreground text-background rounded-full h-14 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone className="w-4 h-4" />
              010-2263-9674 상담 전화
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
