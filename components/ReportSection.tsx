"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send, ShieldAlert, AlertCircle, Check,
  Upload, X as XIcon, ChevronDown,
} from "lucide-react";
const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// 타이핑 효과로 순환 노출되는 변동 문구
const TYPING_PHRASES = [
  "수사 진행 상황에 맞춘 대응 방향 검토가 가능합니다.",
  "피해 경위와 거래 흐름을 체계적으로 정리할 수 있습니다.",
  "핵심 자료를 정리해 사실관계 전달에 도움이 될 수 있습니다.",
];

function useTypingCycle(
  items: string[],
  { typingMs = 35, holdMs = 2000 }: { typingMs?: number; holdMs?: number } = {}
) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const current = items[index] ?? "";

    if (text.length < current.length) {
      // 타이핑 중
      timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typingMs);
    } else {
      // 완전히 타이핑 됨 → holdMs 후 한번에 비우고 다음 문구로
      timer = setTimeout(() => {
        setText("");
        setIndex((i) => (i + 1) % items.length);
      }, holdMs);
    }

    return () => clearTimeout(timer);
  }, [text, index, items, typingMs, holdMs]);

  return text;
}

export default function ReportSection() {
  const typedText = useTypingCycle(TYPING_PHRASES);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [company, setCompany] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 접수 완료 메시지 3초 후 자동 사라짐
  useEffect(() => {
    if (status === "ok") {
      const t = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_IMAGE_SIZE) {
        setErrorMsg(`${f.name}: 파일 크기 5MB 초과로 제외됨`);
        continue;
      }
      valid.push(f);
    }
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("이름과 연락처는 필수입니다.");
      return;
    }
    if (!agreed) {
      setErrorMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("phone", phone.trim());
      fd.append("region", region.trim());
      fd.append("company", company.trim());
      fd.append("site_url", siteUrl.trim());
      fd.append("amount", amount.trim());
      // 방문자 유입 경로 — 어떤 페이지에서 제보를 시작했는지 추적
      try {
        fd.append("landing_url", window.location.href);
        fd.append("referrer", document.referrer || "");
      } catch {}
      images.forEach((f) => fd.append("images", f));

      const res = await fetch("/api/report", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      setStatus("ok");
      setName(""); setPhone(""); setRegion(""); setCompany(""); setSiteUrl(""); setAmount("");
      setImages([]); setAgreed(false);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "전송 실패. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <section id="report" className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/15 p-8 md:p-12 lg:p-14"
        style={{
          backgroundColor: "#800020",
          color: "#fff",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.06) 100%)",
          boxShadow:
            "0 12px 25px rgba(0,0,0,0.12), 0 -8px 25px rgba(0,0,0,0.08), 10px 0 25px rgba(0,0,0,0.08), -10px 0 25px rgba(0,0,0,0.08)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6 animate-glow-pulse" style={{ color: "#edff00" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#edff00" }} />
            <span className="text-[12px] md:text-[13px] tracking-[0.02em] font-semibold">
              피해 내용 확인이 가능하도록 작성해주세요
            </span>
          </div>

          <h2
            className="text-center text-2xl md:text-3xl lg:text-[34px] leading-tight mb-4"
            style={{
              fontFamily: "'BookendBatang', serif",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: "#fff",
            }}
          >
            고소는 혼자도 가능하지만
            <br />
            변호인과 함께라면
            {/* 변동 문구 영역 — 가장 긴 문구 기준 2줄 높이 미리 확보 (layout shift 방지) */}
            <span
              className="block mt-1 leading-[1.35]"
              style={{
                color: "#edff00",
                letterSpacing: "-3px",
                minHeight: "calc(1.35em * 2)",
              }}
            >
              {typedText}
              <span className="typing-cursor" aria-hidden="true">|</span>
            </span>
          </h2>

          <p className="text-center text-sm md:text-base text-white/75 mb-10 leading-relaxed">
            피해 경위와 거래 내역을 남겨주시면 내용을 검토 후 상담 가능 여부를 안내드립니다.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <Field label="이름 *">
              <Input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="이름 (철저한 비밀 유지 및 신원 보장)" required />
            </Field>

            <Field label="연락처 *">
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="휴대폰 번호 (철저한 비밀 유지 및 신원 보장)" required />
            </Field>

            <Field label="지역">
              <Input value={region} onChange={(e) => setRegion(e.target.value)}
                placeholder="피해자분이 살고 있는 지역  예: 일산" />
            </Field>

            <Field label="사기 업체명">
              <Input value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="예: wXRP Network, 알파블록프로 등" />
            </Field>

            <Field label="사기 사이트 URL">
              <Input type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="예: https://wxrpnetwork.com" />
            </Field>

            <Field label="피해금액">
              <Input type="text" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="예: 5천만원 / 약 50,000,000원" />
            </Field>

            {/* 사진 첨부 */}
            <div>
              <label className="flex items-center gap-2 text-sm md:text-[15px] font-semibold mb-2" style={{ color: "#edff00" }}>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: "#edff00" }}
                />
                사진 첨부 <span className="font-normal text-white/60 text-[12px]">(최대 {MAX_IMAGES}장 · 각 5MB 이내)</span>
              </label>
              <input
                ref={fileInputRef} type="file" accept="image/*" multiple
                onChange={handleFileChange} className="hidden" id="report-images"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES}
                className={`w-full px-4 py-3.5 bg-white text-[#800020] rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  images.length >= MAX_IMAGES
                    ? "shadow-[0_2px_0_rgba(0,0,0,0.18)] cursor-not-allowed"
                    : "shadow-[0_3px_0_rgba(0,0,0,0.28)] hover:shadow-[0_5px_0_rgba(0,0,0,0.32)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(0,0,0,0.25)] cursor-pointer"
                }`}
              >
                <Upload className="w-4 h-4" />
                {images.length >= MAX_IMAGES
                  ? `최대 ${MAX_IMAGES}장 첨부됨`
                  : "이미지 선택 (사이트 캡쳐, 문자(대화) 캡쳐 등)"}
              </button>
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-2">
                  {images.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-white/10 border border-white/20 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                        aria-label="삭제"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate font-mono">
                        {(f.size / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 개인정보 동의 */}
            <div className="rounded-lg bg-black/15 border border-white/20 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <label className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer shrink-0"
                  />
                  <span className="text-[13px] md:text-[14px] font-semibold text-white">
                    개인정보 수집·이용에 동의합니다.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setPrivacyOpen((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] md:text-[12px] border border-white/30 text-white/85 hover:bg-white/10 hover:border-white/50 transition-colors shrink-0"
                  aria-expanded={privacyOpen}
                  aria-controls="privacy-detail"
                >
                  {privacyOpen ? "닫기" : "보기"}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${privacyOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div
                id="privacy-detail"
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  privacyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-0 border-t border-white/10 mt-0 text-[12px] md:text-[13px] leading-relaxed text-white/75">
                    <p className="mt-3">
                      접수된 정보(이름·연락처·피해 내용·첨부 사진)는 본인의 사건 상담 및 법률 대응 목적으로만 사용되며, 3년간 보관 후 파기됩니다.
                    </p>
                    <p className="mt-2">
                      자세한 내용은{" "}
                      <a
                        href="/privacy"
                        className="underline hover:text-white"
                        target="_blank"
                        rel="noopener"
                      >
                        개인정보처리방침
                      </a>
                      을 참고해 주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-black/25 border border-white/30 text-white text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {status === "ok" && (
              <div
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg border text-sm font-semibold animate-fade-in-out"
                style={{
                  backgroundColor: "rgba(237,255,0,0.18)",
                  borderColor: "rgba(237,255,0,0.55)",
                  color: "#edff00",
                  boxShadow: "0 0 18px rgba(237,255,0,0.35), inset 0 0 12px rgba(237,255,0,0.15)",
                }}
              >
                <Check className="w-4 h-4 shrink-0" />
                접수가 완료되었습니다. 잠시 후 법무팀장이 직접 연락드리겠습니다.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || !agreed}
              className={`w-full py-4 rounded-lg font-bold text-base md:text-[17px] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(237,255,0,0.45)] hover:shadow-[0_0_38px_rgba(237,255,0,0.7)] hover:scale-[1.01] active:scale-[0.99] ${
                !agreed
                  ? "opacity-50 cursor-not-allowed"
                  : status === "sending"
                  ? "cursor-wait"
                  : "cursor-pointer"
              }`}
              style={{ backgroundColor: "#edff00", color: "#800020" }}
            >
              {status === "sending" ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "#800020", borderTopColor: "transparent" }} />
                  전송 중…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  피해 접수하기
                </>
              )}
            </button>

            <p className="text-center text-[11px] md:text-xs text-white/55 leading-relaxed">
              제출된 내용을 확인 후 즉시 연락드리겠습니다.
            </p>
          </form>

          <a
            href="tel:010-2263-9674"
            className="block w-full p-6 md:p-7 mt-12 rounded-xl border-2 border-white/30 hover:border-white/60 transition-all text-center group hover:scale-[1.01]"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          >
            {/* 박스 내부 상단 — 안내 헤드라인 */}
            <h3
              className="text-lg md:text-xl lg:text-[22px] leading-tight mb-4 pb-4 border-b border-white/15"
              style={{
                fontFamily: "'BookendBatang', serif",
                fontWeight: 700,
                letterSpacing: "-1px",
                color: "#fff",
              }}
            >
              투자사기 피해는
              <br />
              초기 대응 방향 검토가 중요할 수 있습니다.
            </h3>

            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="font-bold text-base md:text-lg text-white">
                24시간 긴급 직통 전화 상담
              </span>
            </div>
            <div className="flex items-center justify-center text-white font-mono font-bold text-xl md:text-2xl">
              010-2263-9674
            </div>
            <p
              className="text-[12px] md:text-[13px] mt-2 font-semibold animate-lamp-blink"
              style={{ color: "#fbbf24" }}
            >
              야간·주말 무관
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm md:text-[15px] font-semibold mb-2" style={{ color: "#edff00" }}>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: "#edff00" }}
        />
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3.5 bg-white border border-white/30 rounded-lg text-[15px] md:text-base text-gray-900 placeholder:text-gray-400 font-medium focus:outline-none focus:border-white/80 focus:ring-2 focus:ring-white/20 transition-all"
      style={{
        fontFamily: "'BookendBatang', serif",
        letterSpacing: "-0.3px",
        ...(props.style || {}),
      }}
    />
  );
}
