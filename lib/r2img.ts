// workers.dev 직접 핫링크는 Cloudflare 봇챌린지로 503 — same-origin /r2img 프록시 경유
const R2_HOST = "https://damdeoc-r2-proxy.jdan9791.workers.dev";

export function r2img(url: string | null | undefined): string {
  if (!url) return "";
  return url.startsWith(R2_HOST) ? url.replace(R2_HOST, "/r2img") : url;
}

/** 메인 목록용 작은 썸네일(140px WebP) — 원본 옆에 「원본이름.list.webp」로 따로 만들어 둔다 (2026-10-13).
 *  원본 썸네일은 그대로(검색엔진·카톡 미리보기·사이트맵이 쓰는 것). 목록용이 없으면 화면이 원본으로 바꿔 보여 준다. */
export function listThumb(url: string | null | undefined): string {
  if (!url || !url.startsWith(R2_HOST)) return r2img(url);
  return r2img(url.replace(/\.(jpe?g|png|webp)$/i, ".list.webp"));
}
