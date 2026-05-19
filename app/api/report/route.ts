import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jdan9791@gmail.com";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://damdeoc-cases.vercel.app";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function sanitize(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.replace(/[\x00-\x1F\x7F]/g, "").slice(0, max).trim();
}

function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = ((h << 5) - h) + ip.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청" }, { status: 400 });
  }

  const name = sanitize(form.get("name"), 50);
  const phone = sanitize(form.get("phone"), 30);
  const region = sanitize(form.get("region"), 100);
  const company = sanitize(form.get("company"), 100);
  const siteUrl = sanitize(form.get("site_url"), 500);
  const landingUrl = sanitize(form.get("landing_url"), 500);
  const referrer = sanitize(form.get("referrer"), 500);
  const amountStr = sanitize(form.get("amount"), 20);
  const amount = amountStr ? parseInt(amountStr.replace(/[^0-9]/g, ""), 10) : null;
  const imageFiles = (form.getAll("images") as File[]).filter(
    (f) => f && typeof f === "object" && f.size > 0,
  );

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "이름과 연락처는 필수입니다." },
      { status: 400 },
    );
  }

  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawler|spider|curl|wget/i.test(ua)) {
    return NextResponse.json({ ok: false, error: "차단됨" }, { status: 403 });
  }

  const ipRaw = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "";
  const ipHash = ipRaw ? hashIp(ipRaw) : "anon";
  const ts = Date.now();

  // ─── Storage 업로드 ─────────────────────────────────────────────────
  const client = serverClient();
  const imageUrls: string[] = [];
  const attachmentBuffers: { filename: string; content: Buffer; contentType: string }[] = [];

  if (imageFiles.length > 0) {
    const limited = imageFiles.slice(0, MAX_FILES);
    for (let i = 0; i < limited.length; i++) {
      const f = limited[i];
      if (f.size > MAX_FILE_SIZE) continue;
      if (!f.type.startsWith("image/")) continue;
      try {
        const buf = Buffer.from(await f.arrayBuffer());
        // 메일 attachment용으로도 사용
        attachmentBuffers.push({
          filename: f.name || `attachment-${i + 1}.jpg`,
          content: buf,
          contentType: f.type,
        });
        // Storage 업로드 (성공 시 URL 저장)
        if (client) {
          const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
          const safeName = `reports/${ts}-${ipHash}-${i}.${ext}`;
          const { error } = await client.storage
            .from("fraud-images")
            .upload(safeName, buf, { contentType: f.type, upsert: false });
          if (!error) {
            const { data } = client.storage.from("fraud-images").getPublicUrl(safeName);
            if (data?.publicUrl) imageUrls.push(data.publicUrl);
          }
        }
      } catch (e: any) {
        console.warn("[REPORT] image exception:", e?.message);
      }
    }
  }

  // ─── Supabase INSERT ────────────────────────────────────────────────
  if (client) {
    try {
      const { error } = await client.from("fraud_reports").insert({
        name, phone,
        region: region || null,
        company: company || null,
        site_url: siteUrl || null,
        amount,
        image_urls: imageUrls,
        ip_hash: ipHash,
        user_agent: ua.slice(0, 200),
        // 방문자 유입 경로 (제보 직전 머문 페이지 + 외부 referrer)
        landing_url: landingUrl || null,
        referrer: referrer || null,
      });
      if (error) console.warn("[REPORT] insert 실패:", error.message);
    } catch (e: any) {
      console.warn("[REPORT] insert 예외:", e?.message);
    }
  }

  // ─── Gmail SMTP 발송 ────────────────────────────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  let emailSent = false;
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      });

      const amountFmt = amountStr ? escapeHtml(amountStr) : "(미입력)";

      // 인라인 이미지: Supabase 공개 URL이 있으면 src로, 없으면 CID 첨부로 표시
      let imageListHtml: string;
      const inlineAttachments: { filename: string; content: Buffer; contentType: string; cid: string }[] = [];

      if (imageUrls.length > 0) {
        imageListHtml = `<div style="display:flex;flex-wrap:wrap;gap:8px;">${imageUrls
          .map(
            (u, i) =>
              `<a href="${u}" target="_blank" style="display:inline-block;text-decoration:none;">
                 <img src="${u}" alt="사진 ${i + 1}" style="width:160px;height:160px;object-fit:cover;border:1px solid #e5e5e5;border-radius:6px;display:block;" />
               </a>`,
          )
          .join("")}</div>`;
      } else if (attachmentBuffers.length > 0) {
        // Storage 업로드 실패한 경우 — CID 인라인 첨부로 대체
        const cids = attachmentBuffers.map((_, i) => `report-img-${i}-${ts}@damdeok`);
        inlineAttachments.push(
          ...attachmentBuffers.map((a, i) => ({ ...a, cid: cids[i] })),
        );
        imageListHtml = `<div style="display:flex;flex-wrap:wrap;gap:8px;">${cids
          .map(
            (c, i) =>
              `<img src="cid:${c}" alt="사진 ${i + 1}" style="width:160px;height:160px;object-fit:cover;border:1px solid #e5e5e5;border-radius:6px;display:block;" />`,
          )
          .join("")}</div>`;
      } else {
        imageListHtml = "<p>(첨부 없음)</p>";
      }

      const html = `
<div style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;">
  <h2 style="background:#800020;color:#fff;padding:16px;margin:0 0 16px;border-radius:8px;">
    🚨 새로운 피해 접수
  </h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px;background:#f5f5f5;width:120px;"><b>이름</b></td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>연락처</b></td><td style="padding:8px;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>지역</b></td><td style="padding:8px;">${escapeHtml(region) || "(미입력)"}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>사기 업체명</b></td><td style="padding:8px;">${escapeHtml(company) || "(미입력)"}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>사기 사이트 URL</b></td><td style="padding:8px;">${siteUrl ? `<a href="${escapeHtml(siteUrl)}" target="_blank">${escapeHtml(siteUrl)}</a>` : "(미입력)"}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>피해 금액</b></td><td style="padding:8px;"><b style="color:#800020;">${amountFmt}</b></td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>첨부 사진</b></td><td style="padding:8px;">${imageListHtml}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>접수 시각</b></td><td style="padding:8px;">${new Date().toLocaleString("ko-KR")}</td></tr>
    <tr><td style="padding:8px;background:#f5f5f5;"><b>IP 해시</b></td><td style="padding:8px;font-family:monospace;color:#888;">${ipHash}</td></tr>
  </table>
  <p style="margin-top:24px;padding:12px;background:#fffbeb;border-left:4px solid #f59e0b;font-size:13px;">
    ⏰ <b>접수자에게 24시간 이내 회신 권장.</b>
  </p>
  <p style="margin-top:16px;font-size:12px;color:#888;">
    이 메일은 ${SITE_URL} 피해 접수 폼에서 자동 발송되었습니다.
  </p>
</div>
      `.trim();

      // 메일 제목: [담덕법률사무소 사기 피해 정보 센터] [이름] [지역] [사기업체명] [url]
      const subjectParts = [
        "[담덕법률사무소 사기 피해 정보 센터]",
        `[${name}]`,
        `[${region || "지역 미입력"}]`,
        `[${company || "업체명 미입력"}]`,
        `[${siteUrl || "URL 미입력"}]`,
      ];
      const subject = subjectParts.join(" ");

      await transporter.sendMail({
        from: `"담덕법률사무소 사기 피해 접수" <${gmailUser}>`,
        to: ADMIN_EMAIL,
        subject,
        html,
        attachments:
          inlineAttachments.length > 0
            ? inlineAttachments  // CID 인라인 첨부 (Storage 업로드 실패 시)
            : undefined,
      });
      emailSent = true;
    } catch (e: any) {
      console.warn("[REPORT] gmail send error:", e?.message || e);
    }
  } else {
    console.log("[REPORT] GMAIL_USER/GMAIL_APP_PASSWORD 미설정 — 메일 발송 생략");
  }

  // ─── 텔레그램 알림 ──────────────────────────────────────────────────
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  let tgSent = false;
  if (tgToken && tgChatId) {
    try {
      const lines = [
        `🚨 <b>새로운 피해 접수</b>`,
        ``,
        `<b>이름:</b> ${escapeHtml(name)}`,
        `<b>연락처:</b> ${escapeHtml(phone)}`,
        region ? `<b>지역:</b> ${escapeHtml(region)}` : "",
        company ? `<b>업체명:</b> ${escapeHtml(company)}` : "",
        siteUrl ? `<b>사이트:</b> ${escapeHtml(siteUrl)}` : "",
        amount ? `<b>피해 금액:</b> ${amount.toLocaleString()} 원` : "",
        imageUrls.length > 0 ? `<b>첨부 사진:</b> ${imageUrls.length}장` : "",
        ``,
        `<i>${new Date().toLocaleString("ko-KR")}</i>`,
      ].filter(Boolean);

      const text = lines.join("\n");
      const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      if (res.ok) {
        tgSent = true;
        // 사진도 텔레그램에 전송 (최대 첫 3장)
        for (let i = 0; i < Math.min(imageUrls.length, 3); i++) {
          try {
            await fetch(`https://api.telegram.org/bot${tgToken}/sendPhoto`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: tgChatId,
                photo: imageUrls[i],
                caption: `사진 ${i + 1}/${imageUrls.length}`,
              }),
            });
          } catch {}
        }
      } else {
        console.warn("[REPORT] telegram send failed:", res.status, await res.text().catch(() => ""));
      }
    } catch (e: any) {
      console.warn("[REPORT] telegram error:", e?.message);
    }
  }

  return NextResponse.json({
    ok: true,
    stored: !!client,
    images: imageUrls.length,
    email_sent: emailSent,
    telegram_sent: tgSent,
  });
}
