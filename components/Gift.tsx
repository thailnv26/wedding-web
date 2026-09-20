"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { config } from "@/data/config";
import type { ResolvedSide } from "@/lib/side";
import { SectionHeading } from "./SectionHeading";

/** Mỗi bên thiệp dẫn về tài khoản của nhà mình. */
export function Gift({ side }: { side: ResolvedSide }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const gift = { ...config.gift, ...side.gift };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(gift.accountNumber);
    } catch {
      // Trình duyệt cũ / không chạy https: chọn sẵn text để khách tự copy.
      const el = document.getElementById("so-tai-khoan");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="mung-cuoi" className="reveal px-6 py-12">
      <SectionHeading script="Hộp" title="Mừng Cưới" />

      <p className="mx-auto mt-6 max-w-[380px] text-center text-[0.9rem] leading-[1.9] text-ink">
        {gift.message}
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mt-8 flex w-[min(80vw,300px)] flex-col items-center rounded-3xl border border-blush-dark/60 bg-blush-light px-6 py-8 shadow-[0_16px_36px_-24px_rgba(156,80,92,0.7)] transition-transform active:scale-95"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-wine">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M3 12h18M12 8v13" />
            <path d="M12 8S9.5 3 7 4.5 8.5 8 12 8Zm0 0s2.5-5 5-3.5S15.5 8 12 8Z" />
          </svg>
        </span>
        <span className="mt-4 font-script text-2xl text-wine">{gift.heading}</span>
        <span className="mt-1 text-[0.58rem] tracking-[0.3em] text-ink-soft uppercase">
          Chạm để mở mã QR
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gift.heading}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-6 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[300px] rounded-3xl bg-cream px-6 pt-7 pb-6 text-center shadow-[0_24px_60px_-20px_rgba(90,40,50,0.6)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <p className="font-script text-2xl text-wine">{gift.heading}</p>

            <div className="mx-auto mt-4 w-[190px] rounded-2xl border border-blush-dark/50 bg-white p-3">
              <div className="relative aspect-square w-full">
                <Image src={gift.qrImage} alt="Mã QR chuyển khoản" fill sizes="190px" className="object-contain" />
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-ink">
              <p className="text-[0.58rem] tracking-[0.3em] text-ink-soft uppercase">
                {gift.bankName}
              </p>
              <p className="font-display text-lg tracking-wide text-wine">{gift.accountName}</p>
              <p id="so-tai-khoan" className="font-body text-base tracking-[0.12em] tabular-nums">
                {gift.accountNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={copyAccount}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-blush px-5 py-2.5 text-[0.6rem] tracking-[0.25em] text-wine uppercase"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              {copied ? "Đã sao chép!" : "Sao chép số tài khoản"}
            </button>

            <p className="mt-3 text-xs text-ink-soft">
              Nội dung gợi ý: <span className="text-wine">{gift.note}</span>
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
