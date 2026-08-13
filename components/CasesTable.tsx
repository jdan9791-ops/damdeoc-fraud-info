"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { r2img } from "@/lib/r2img";
import { Search, X } from "lucide-react";
import type { FraudCase } from "@/lib/supabase";

const PAGE_SIZE = 10; // 기본 10개 고정(선택 토글 없음)

export default function CasesTable({ cases, totalCount }: { cases: FraudCase[]; totalCount?: number }) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter((c) => c.title.toLowerCase().includes(q));
  }, [cases, query]);

  // 정렬 없음 — 서버에서 온 순서(랜덤) 그대로. 경쟁사가 최신을 집어내지 못하도록.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const pageNums = useMemo(() => {
    const make = (count: number) => {
      if (totalPages <= count) return Array.from({ length: totalPages }, (_, i) => i + 1);
      const left = Math.floor((count - 1) / 2);
      const right = count - 1 - left;
      if (page <= left + 1) return Array.from({ length: count }, (_, i) => i + 1);
      if (page >= totalPages - right) return Array.from({ length: count }, (_, i) => totalPages - count + 1 + i);
      return Array.from({ length: count }, (_, i) => page - left + i);
    };
    return { mobile: make(5), desktop: make(10) };
  }, [totalPages, page]);

  const displayTotal = totalCount ?? cases.length;

  return (
    <div className="space-y-6">
      {/* 헤더: 좌측 (FRAUD CASES + 최신 사기 사건 목록) / 우측 (검색바 + 총 건수) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        <div className="flex flex-col items-start">
          <p className="label-editorial mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
            FRAUD CASES
          </p>
          <h2
            className="text-3xl md:text-4xl leading-tight"
            style={{
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "-2px",
              fontFamily: "'BookendBatang', serif",
            }}
          >
            최신 사기 사건 목록
          </h2>
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto md:max-w-md md:min-w-[360px]">
          <p className="text-xs font-mono tabular-nums text-right" style={{ color: "rgba(255,255,255,0.7)" }}>
            총 {displayTotal.toLocaleString()}건
          </p>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="사건 제목 검색..."
              className="w-full pl-11 pr-11 py-3 bg-white border border-white/30 rounded-full text-sm font-semibold text-black placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-white/60 transition-all"
            />
            {query && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => { setQuery(""); setPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-[#800020] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 10px 25px rgba(0,0,0,0.22), 0 -5px 20px rgba(0,0,0,0.14), 7px 0 20px rgba(0,0,0,0.14), -7px 0 20px rgba(0,0,0,0.14)",
        }}
      >
        {/* 헤더바 (PC만) — 정렬 없음(라벨만). 번호·등록일 컬럼 제거 */}
        <div
          className="hidden md:flex items-center gap-4 px-7 py-4"
          style={{
            backgroundColor: "#080503",
            color: "#fff",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <span className="w-[90px] shrink-0 font-semibold text-center">썸네일</span>
          <span className="flex-1 text-center font-semibold">사건 정보</span>
          <span className="w-20 text-center font-semibold">상황</span>
        </div>

        {/* 리스트 */}
        <div className="divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <div className="px-7 py-20 text-center">
              <div className="text-4xl mb-3 opacity-30">📂</div>
              <p className="text-sm text-gray-500 mb-1">
                {cases.length === 0 ? "등록된 사건이 아직 없습니다." : "검색 결과가 없습니다."}
              </p>
              {cases.length === 0 && (
                <p className="text-xs text-gray-400">
                  관리자 도구에서 사건을 업로드하면 이곳에 표시됩니다.
                </p>
              )}
            </div>
          ) : (
            paginated.map((c, i) => (
              <Link
                key={c.id}
                href={`/fraud/${c.slug}`}
                className="group flex items-center gap-4 md:gap-5 px-7 md:px-10 py-1.5 hover:bg-gray-50/70 transition-colors"
              >
                {/* 썸네일 — 70x70 */}
                <div className="relative w-[70px] h-[70px] shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {c.thumbnail_url ? (
                    <Image
                      src={r2img(c.thumbnail_url)}
                      alt={c.title}
                      width={70}
                      height={70}
                      sizes="70px"
                      loading={i < 5 ? undefined : "lazy"}
                      priority={i < 3}
                      className="w-full h-full object-cover transition-[filter] duration-300 [filter:grayscale(0.5)] group-hover:[filter:grayscale(0)]"
                    />
                  ) : (
                    <span className="text-xl text-gray-300">⚠</span>
                  )}
                </div>

                {/* 사건 정보 — 제목 + 모바일 상태배지(날짜 제거) */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-gray-900 group-hover:text-[#800020] transition-colors line-clamp-2 md:line-clamp-1"
                    style={{ fontFamily: "'BookendBatang', serif", fontSize: "17px" }}
                  >
                    {c.title}
                  </p>
                  <p className="md:hidden text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <span
                      className="animate-case-badge inline-flex items-center gap-1 px-2 py-[3px] text-[9px] font-semibold tracking-[0.02em] rounded-full whitespace-nowrap"
                      style={{
                        color: "#fff",
                        background: "linear-gradient(135deg, #8b0020 0%, #b3002d 60%, #8b0020 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span className="case-badge-dot" />
                      사건진행중
                    </span>
                  </p>
                </div>

                {/* 상황 (PC) — 사건진행중 배지 */}
                <span className="hidden md:flex w-24 justify-center">
                  <span
                    className="animate-case-badge inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] rounded-full whitespace-nowrap"
                    style={{
                      color: "#fff",
                      background: "linear-gradient(135deg, #8b0020 0%, #b3002d 55%, #8b0020 100%)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
                    }}
                  >
                    <span className="case-badge-dot" />
                    사건진행중
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>

        {/* 카드 푸터 — 페이지네이션만 (페이지 크기 토글 제거) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center px-5 md:px-7 py-5 border-t border-gray-100 bg-gray-50/30">
            <div className="w-full grid grid-cols-3 items-center gap-3">
              <span className="text-xs font-mono text-gray-500 tabular-nums justify-self-start">
                {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filtered.length)} / {filtered.length.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 justify-self-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1 text-xs font-mono text-gray-600 hover:bg-white border border-gray-200 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="이전 페이지"
                >
                  ‹
                </button>
                {pageNums.mobile.map((p) => (
                  <button
                    key={`m-${p}`}
                    onClick={() => setPage(p)}
                    className={`sm:hidden w-7 h-7 text-xs font-mono rounded-md transition-colors ${
                      page === p ? "bg-[#800020] text-white" : "text-gray-600 hover:bg-white border border-gray-200"
                    }`}
                    aria-current={page === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                {pageNums.desktop.map((p) => (
                  <button
                    key={`d-${p}`}
                    onClick={() => setPage(p)}
                    className={`hidden sm:inline-flex items-center justify-center w-7 h-7 text-xs font-mono rounded-md transition-colors ${
                      page === p ? "bg-[#800020] text-white" : "text-gray-600 hover:bg-white border border-gray-200"
                    }`}
                    aria-current={page === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2.5 py-1 text-xs font-mono text-gray-600 hover:bg-white border border-gray-200 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="다음 페이지"
                >
                  ›
                </button>
              </div>
              <span className="text-xs font-mono text-gray-400 tabular-nums justify-self-end">
                {page} / {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
