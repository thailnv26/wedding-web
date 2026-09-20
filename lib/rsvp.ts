"use client";

import { config } from "@/data/config";

export type RsvpPayload = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  wish: string;
  /** Khách đến từ thiệp nhà gái hay nhà trai. */
  side: string;
};

export type Wish = {
  name: string;
  wish: string;
  attending: string;
  time: string;
};

/**
 * Gửi form sang Google Apps Script.
 * Dùng Content-Type text/plain để trình duyệt bỏ qua preflight CORS —
 * Apps Script không trả header cho request OPTIONS.
 */
export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const endpoint = config.rsvp.endpoint;
  if (!endpoint) {
    // Chưa cấu hình endpoint: coi như thành công để còn demo được giao diện.
    await new Promise((r) => setTimeout(r, 600));
    return;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Gửi thất bại (${res.status})`);
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(data.error || "Máy chủ từ chối dữ liệu");
}

/**
 * Đọc danh sách lời chúc về bằng JSONP.
 * Apps Script hay thiếu header CORS khi bị redirect, JSONP thì luôn chạy.
 */
export function fetchWishes(timeoutMs = 8000): Promise<Wish[]> {
  const endpoint = config.rsvp.endpoint;
  if (!endpoint) return Promise.resolve([]);

  return new Promise((resolve) => {
    const cbName = `__wishes_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement("script");

    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[cbName];
      script.remove();
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve([]);
    }, timeoutMs);

    (window as unknown as Record<string, unknown>)[cbName] = (data: unknown) => {
      cleanup();
      resolve(Array.isArray(data) ? (data as Wish[]) : []);
    };

    script.src = `${endpoint}${endpoint.includes("?") ? "&" : "?"}action=wishes&callback=${cbName}`;
    script.onerror = () => {
      cleanup();
      resolve([]);
    };
    document.body.appendChild(script);
  });
}
