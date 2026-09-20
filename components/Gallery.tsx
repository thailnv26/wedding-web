"use client";

import Image from "next/image";
import { type CSSProperties, type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { album } from "@/data/album";
import { config } from "@/data/config";
import { SectionHeading } from "./SectionHeading";

/** Vuốt ngang quá ngần này (px) thì tính là lật ảnh, dưới ngưỡng coi như chạm hụt. */
const SWIPE_THRESHOLD = 48;

/** Lật `delta` tấm, chạy hết album thì vòng lại từ đầu. */
function stepIndex(current: number | null, delta: number) {
  if (current === null) return current;
  return (current + delta + album.length) % album.length;
}

export function Gallery() {
  const preview = album.slice(0, config.gallery.previewCount);
  const [index, setIndex] = useState<number | null>(null);

  return (
    // .reveal nằm ở từng tấm ảnh chứ không ở section: vừa cho ảnh hiện lần lượt
    // khi khách cuộn tới, vừa tránh transform của section biến nó thành khung
    // chứa cho khung xem ảnh phóng to (position: fixed) bên dưới.
    <section id="album" className="px-6 py-12">
      <SectionHeading
        overline="Một vài khoảnh khắc"
        script="Album"
        title="Ảnh Cưới"
        className="reveal"
      />

      <div className="mt-8 grid grid-cols-2 gap-3">
        {preview.map((photo, i) => {
          const tilt = i % 2 === 0 ? -2 : 2;

          return (
            // Lớp .reveal bọc ngoài nút: gắn thẳng lên nút sẽ đè mất transition
            // của Tailwind, làm hiệu ứng nhấc ảnh khi rê chuột giật cục.
            //
            // --reveal-spin cùng dấu với --tilt: tấm nghiêng trái thì nghiêng
            // quá tay sang trái rồi lắc về, tấm nghiêng phải thì ngược lại — cả
            // lưới ảnh xoè ra như một xấp hình vừa được rải lên bàn.
            <div
              key={photo.src}
              className="reveal reveal-zoom"
              style={{ "--reveal-spin": `${tilt * 3.5}deg` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                className="group w-full cursor-pointer rotate-[var(--tilt)] bg-white p-2 pb-3 shadow-[0_0_0_1px_rgba(156,80,92,0.13),0_12px_28px_-14px_rgba(156,80,92,0.7)] transition-[rotate,translate,scale,box-shadow] duration-500 ease-out hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(156,80,92,0.22),0_22px_44px_-16px_rgba(156,80,92,0.85)] focus-visible:rotate-0 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush-dark active:scale-95"
                style={{ "--tilt": `${tilt}deg` } as CSSProperties}
              >
                <span className="photo-sheen relative block aspect-[4/5] overflow-hidden bg-blush-light">
                  <Image
                    src={photo.thumb}
                    alt={`Ảnh cưới ${i + 1}`}
                    fill
                    sizes="45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  />

                  {/* Phủ nhẹ + kính lúp: dấu hiệu cho khách biết ảnh bấm mở được.
                      z-10 để nằm trên lớp kem và vệt sáng của .photo-sheen. */}
                  <span className="absolute inset-0 z-10 flex items-center justify-center bg-wine/25 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="translate-y-1.5 text-cream transition-transform duration-300 ease-out group-hover:translate-y-0"
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M15.9 15.9 20.5 20.5M11 8.4v5.2M8.4 11h5.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Lưới chỉ bày vài tấm; cả album nằm trong khung xem phóng to. */}
      {album.length > preview.length ? (
        <div className="reveal mt-7 text-center">
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="cursor-pointer rounded-full border border-blush-dark/60 bg-white/70 px-6 py-2.5 text-[0.62rem] tracking-[0.3em] text-wine uppercase transition-colors duration-300 ease-out hover:bg-blush-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-dark"
          >
            Xem cả {album.length} tấm
          </button>
        </div>
      ) : null}

      {index !== null ? <Lightbox index={index} setIndex={setIndex} /> : null}
    </section>
  );
}

/**
 * Khung xem ảnh phóng to — lật được cả album.
 *
 * Ảnh giữ nguyên khung gốc (data/album.ts có sẵn width/height) chứ không ép về
 * 4:5: mấy tấm chụp ngang mà ép dọc thì cụt mất hai bên. `max-h` theo vh để ảnh
 * dọc không tràn khỏi màn hình điện thoại.
 *
 * Component này chỉ tồn tại khi đang mở ảnh, nên phím tắt và khoá cuộn gắn thẳng
 * vào vòng đời của nó — không cần canh `index === null` nữa. Mọi thao tác đều đi
 * qua `setIndex` (hàm của useState, không đổi giữa các lần render).
 */
function Lightbox({
  index,
  setIndex,
}: {
  index: number;
  setIndex: Dispatch<SetStateAction<number | null>>;
}) {
  const photo = album[index];
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => stepIndex(i, 1));
      if (e.key === "ArrowLeft") setIndex((i) => stepIndex(i, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setIndex]);

  // Khoá cuộn nền khi đang xem ảnh — không thì vuốt ảnh trên điện thoại sẽ kéo
  // luôn cả trang phía sau.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const close = () => setIndex(null);
  const step = (delta: number) => setIndex((i) => stepIndex(i, delta));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 px-4 py-6 backdrop-blur-sm"
      onClick={close}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="flex w-full max-w-[460px] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={photo.src}
          src={photo.src}
          alt={`Ảnh cưới ${index + 1}`}
          width={photo.width}
          height={photo.height}
          priority
          className="h-auto max-h-[72vh] w-auto max-w-full rounded-lg object-contain"
        />

        <div className="mt-4 flex w-full items-center justify-between text-cream">
          <NavButton label="Ảnh trước" onClick={() => step(-1)} rotate />
          <span className="text-xs tracking-[0.3em]">
            {index + 1} / {album.length}
          </span>
          <NavButton label="Ảnh sau" onClick={() => step(1)} />
        </div>
      </div>

      {/* Tải sẵn tấm liền trước và liền sau để lật ảnh không phải chờ.
          `loading="eager"` là bắt buộc: khung này 0x0 nên ảnh để lazy sẽ không
          bao giờ lọt vào tầm nhìn, tức là không bao giờ tải. */}
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        {[-1, 1].map((delta) => {
          const near = album[stepIndex(index, delta) as number];
          return (
            <Image key={near.src} src={near.src} alt="" width={16} height={16} loading="eager" />
          );
        })}
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Đóng"
        className="absolute top-5 left-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-wine"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  rotate = false,
}: {
  label: string;
  onClick: () => void;
  rotate?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/40 transition-colors duration-200 hover:bg-cream/15"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={rotate ? "rotate-180" : ""}
      >
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
