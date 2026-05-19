/**
 * IndexNow 색인 알림 헬퍼.
 *
 * 새 사기 사건이 업로드되거나 갱신되면 Bing/Yandex/Seznam 등에
 * 즉시 색인 요청을 보낼 수 있다. 보통 수 분 내 색인된다.
 *
 * 사용 예 (서버 라우트에서):
 *   await pingIndexNow([`${SITE_URL}/fraud/${slug}`]);
 *
 * 참조: https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = "damdeok-indexnow-167700f328544cf6";

function siteHost(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";
  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export interface IndexNowResult {
  ok: boolean;
  status: number;
  endpoint: string;
  notified: number;
  error?: string;
}

/**
 * URL 목록을 IndexNow에 제출.
 * Bing 엔드포인트 사용 → Bing + Yandex + Seznam 등 IndexNow 협력사 전체 동기화.
 *
 * @param urls 최대 10,000개의 절대 URL 배열
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (!urls.length) {
    return { ok: false, status: 0, endpoint: "", notified: 0, error: "URL이 비어있습니다" };
  }

  const host = siteHost();
  const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;
  const endpoint = "https://api.indexnow.org/IndexNow";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: urls,
      }),
    });

    return {
      ok: res.ok,
      status: res.status,
      endpoint,
      notified: urls.length,
      error: res.ok ? undefined : await res.text().catch(() => `HTTP ${res.status}`),
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, endpoint, notified: 0, error: msg };
  }
}
