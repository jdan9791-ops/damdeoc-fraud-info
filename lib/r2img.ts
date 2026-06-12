// workers.dev 직접 핫링크는 Cloudflare 봇챌린지로 503 — same-origin /r2img 프록시 경유
const R2_HOST = "https://damdeoc-r2-proxy.jdan9791.workers.dev";

export function r2img(url: string | null | undefined): string {
  if (!url) return "";
  return url.startsWith(R2_HOST) ? url.replace(R2_HOST, "/r2img") : url;
}
