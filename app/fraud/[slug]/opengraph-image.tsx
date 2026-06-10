import { ImageResponse } from "next/og";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = false;

export const alt = "담덕법률사무소 사기 피해 정보 센터";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 상세 페이지 동적 OG 이미지 — 트위터/페이스북/카카오톡 공유 카드용.
 * 사건 제목 + 사이트 브랜드를 큰 글자로 렌더링.
 */
export default async function og({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  let title = slug.replace(/-/g, " ");
  let createdAt = "";
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("cases")
        .select("title,created_at")
        .eq("slug", slug)
        .single();
      if (data) {
        title = data.title || title;
        createdAt = (data.created_at || "").slice(0, 10);
      }
    }
  } catch {
    // fall through with slug
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#800020",
          color: "#fff",
          padding: "70px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 — 브랜드 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fff",
              color: "#800020",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>담덕법률사무소</div>
            <div style={{ display: "flex", fontSize: 16, opacity: 0.7, marginTop: 4, letterSpacing: 2 }}>
              DAMDEOC LAW OFFICE
            </div>
          </div>
        </div>

        {/* 메인 — 사건 제목 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, opacity: 0.7, marginBottom: 20 }}>
            최신 사기 사건
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 48 : title.length > 40 ? 56 : 64,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -1.5,
              wordBreak: "keep-all",
            }}
          >
            {title.length > 120 ? title.slice(0, 120) + "…" : title}
          </div>
        </div>

        {/* 하단 — 메타 + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(255,255,255,0.2)",
            paddingTop: 24,
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", opacity: 0.85 }}>
            사기 피해 정보 · 24시 직통 010-2263-9674
          </div>
          <div style={{ display: "flex", opacity: 0.6 }}>{createdAt}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
