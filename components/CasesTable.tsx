"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import type { FraudCase } from "@/lib/supabase";

type SortKey = "index" | "title" | "created_at" | "view_count";
type SortDir = "asc" | "desc";
type PageSize = number | "ALL";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
  return dir === "desc"
    ? <ChevronDown className="w-3 h-3" />
    : <ChevronUp className="w-3 h-3" />;
}

export default function CasesTable({ cases, totalCount }: { cases: FraudCase[]; totalCount?: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("index");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>(10);

  const filtered = useMemo(() => {
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter((c) => c.title.toLowerCase().includes(q));
  }, [cases, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === "title") {
        av = a.title; bv = b.title;
      } else if (sortKey === "view_count") {
        av = a.view_count; bv = b.view_count;
      } else {
        av = a.created_at; bv = b.created_at;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const effectiveSize = pageSize === "ALL" ? sorted.length : pageSize;
  const totalPages = Math.max(1, Math.ceil(sorted.length / effectiveSize));
  const startIndex = (page - 1) * effectiveSize;
  const paginated = pageSize === "ALL" ? sorted : sorted.slice(startIndex, startIndex + effectiveSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const pageNums = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return [page - 2, page - 1, page, page + 1, page + 2];
  }, [totalPages, page]);

  const displayTotal = totalCount ?? cases.length;

  return (
    <div className="space-y-6">
      {/* 헤더: 좌측 (FRAUD CASES + 최신 사기 사건 목록) / 우측 (검색바 + 총 건수) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        {/* 좌측 — 제목 그룹 */}
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

        {/* 우측 — 총 건수(위) + 검색바(아래) */}
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
              className="w-full pl-11 pr-4 py-3 bg-white border border-white/30 rounded-full text-sm font-semibold text-black placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-white/60 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 화이트 카드 — 사방 그림자 (넓이 절반) */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 10px 25px rgba(0,0,0,0.22), 0 -5px 20px rgba(0,0,0,0.14), 7px 0 20px rgba(0,0,0,0.14), -7px 0 20px rgba(0,0,0,0.14)",
        }}
      >
        {/* 정렬바 (PC만) — 모든 헤더 가운데 정렬 */}
        <div
          className="hidden md:flex items-center gap-4 px-7 py-4"
          style={{
            backgroundColor: "#080503",
            color: "#fff",
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <span className="w-[90px] shrink-0 font-semibold text-center">
            썸네일
          </span>
          <button
            onClick={() => handleSort("index")}
            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-[#df0038] transition-colors w-12"
          >
            번호 <SortIcon active={sortKey === "index"} dir={sortDir} />
          </button>
          <button
            onClick={() => handleSort("title")}
            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-[#df0038] transition-colors flex-1 text-center"
          >
            사건 정보 <SortIcon active={sortKey === "title"} dir={sortDir} />
          </button>
          <span className="w-20 text-center font-semibold">
            상황
          </span>
          <button
            onClick={() => handleSort("created_at")}
            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-[#df0038] transition-colors w-24"
          >
            등록일 <SortIcon active={sortKey === "created_at"} dir={sortDir} />
          </button>
          <button
            onClick={() => handleSort("view_count")}
            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-[#df0038] transition-colors w-16"
          >
            조회수 <SortIcon active={sortKey === "view_count"} dir={sortDir} />
          </button>
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
            paginated.map((c, i) => {
              const rowNum = sortKey === "index" && sortDir === "desc"
                ? filtered.length - startIndex - i
                : startIndex + i + 1;
              return (
                <Link
                  key={c.id}
                  href={`/fraud/${c.slug}`}
                  className="group flex items-center gap-4 md:gap-5 px-7 md:px-10 py-1.5 hover:bg-gray-50/70 transition-colors"
                >
                  {/* 썸네일 — 70x70 통일 (next/image: AVIF/WebP 자동 변환 + 지연 로드) */}
                  <div className="relative w-[70px] h-[70px] shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    {c.thumbnail_url ? (
                      <Image
                        src={c.thumbnail_url}
                        alt={c.title}
                        width={70}
                        height={70}
                        sizes="70px"
                        // 처음 5건만 priority (LCP 후보), 나머지는 lazy
                        loading={i < 5 ? undefined : "lazy"}
                        priority={i < 3}
                        className="w-full h-full object-cover transition-[filter] duration-300 [filter:grayscale(0.5)] group-hover:[filter:grayscale(0)]"
                      />
                    ) : (
                      <span className="text-xl text-gray-300">⚠</span>
                    )}
                  </div>

                  {/* 번호 (PC) — 가운데 정렬 */}
                  <span className="hidden md:flex w-12 items-center justify-center text-xs font-mono text-gray-400 tabular-nums">
                    {String(rowNum).padStart(2, "0")}
                  </span>

                  {/* 사건 정보 — 제목(바탕체) + 모바일 메타 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-gray-900 group-hover:text-[#800020] transition-colors line-clamp-2 md:line-clamp-1"
                      style={{
                        fontFamily: "'BookendBatang', serif",
                        fontSize: "17px",
                      }}
                    >
                      {c.title}
                    </p>
                    <p className="md:hidden text-xs text-gray-500 mt-1 tabular-nums flex items-center gap-1.5">
                      <span
                        className="animate-case-badge inline-flex items-center gap-1 px-2 py-[3px] text-[9px] font-semibold tracking-[0.02em] rounded-full whitespace-nowrap"
                        style={{
                          color: "#fff",
                          background:
                            "linear-gradient(135deg, #8b0020 0%, #b3002d 60%, #8b0020 100%)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        <span className="case-badge-dot" />
                        사건진행중
                      </span>
                      {new Date(c.created_at).toISOString().slice(0, 10)} · 조회 {c.view_count.toLocaleString()}
                    </p>
                  </div>

                  {/* 상황 (PC) — 사건진행중 배지 (절제된 와인 그라데이션 + 부드러운 호흡) */}
                  <span className="hidden md:flex w-24 justify-center">
                    <span
                      className="animate-case-badge inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-[0.04em] rounded-full whitespace-nowrap"
                      style={{
                        color: "#fff",
                        // 깊은 와인 → 메인 → 깊은 와인 (3단 그라데이션) — 입체감
                        background:
                          "linear-gradient(135deg, #8b0020 0%, #b3002d 55%, #8b0020 100%)",
                        // 미세한 내부 보더 + 외부 흐릿한 경계 (글래스 느낌)
                        border: "1px solid rgba(255,255,255,0.18)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
                      }}
                    >
                      <span className="case-badge-dot" />
                      사건진행중
                    </span>
                  </span>

                  {/* 등록일 (PC) — YYYY-MM-DD 형식 */}
                  <span className="hidden md:flex w-24 items-center justify-center text-xs font-mono text-gray-500 tabular-nums">
                    {new Date(c.created_at).toISOString().slice(0, 10)}
                  </span>

                  {/* 조회수 (PC) — 가운데 정렬 */}
                  <span className="hidden md:flex w-16 items-center justify-center text-xs font-mono text-gray-500 tabular-nums">
                    {c.view_count.toLocaleString()}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* 카드 푸터 — 페이지네이션 (가운데 정렬) + 페이지 크기 토글 */}
        {(pageSize === "ALL" || totalPages > 1) && (
          <div className="flex flex-col items-center gap-4 px-5 md:px-7 py-5 border-t border-gray-100 bg-gray-50/30">
            {/* 1행: 좌측 카운터 + 중앙 페이지 번호 + 우측 공백 (시각 대칭) */}
            {pageSize !== "ALL" && totalPages > 1 && (
              <div className="w-full grid grid-cols-3 items-center gap-3">
                {/* 좌측 카운터 */}
                <span className="text-xs font-mono text-gray-500 tabular-nums justify-self-start">
                  {startIndex + 1}–{Math.min(startIndex + effectiveSize, filtered.length)} / {filtered.length.toLocaleString()}
                </span>
                {/* 중앙 페이지 번호 */}
                <div className="flex items-center gap-1 justify-self-center">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2.5 py-1 text-xs font-mono text-gray-600 hover:bg-white border border-gray-200 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="이전 페이지"
                  >
                    ‹
                  </button>
                  {pageNums.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 text-xs font-mono rounded-md transition-colors ${
                        page === p
                          ? "bg-[#800020] text-white"
                          : "text-gray-600 hover:bg-white border border-gray-200"
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
                {/* 우측 — 페이지 카운트 텍스트 (밸런스용) */}
                <span className="text-xs font-mono text-gray-400 tabular-nums justify-self-end">
                  {page} / {totalPages}
                </span>
              </div>
            )}

            {/* 2행: 페이지 크기 토글 (카드 안쪽, 가운데 정렬, 흰색 배경 위) */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[10, 20, 50, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => { setPageSize(n); setPage(1); }}
                  className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                    pageSize === n
                      ? "bg-[#800020] text-white border border-[#800020]"
                      : "text-gray-600 hover:text-[#800020] hover:border-[#800020] border border-gray-300 bg-white"
                  }`}
                >
                  {n}개
                </button>
              ))}
              <button
                onClick={() => { setPageSize("ALL"); setPage(1); }}
                className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                  pageSize === "ALL"
                    ? "bg-[#800020] text-white border border-[#800020]"
                    : "text-gray-600 hover:text-[#800020] hover:border-[#800020] border border-gray-300 bg-white"
                }`}
              >
                ALL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
