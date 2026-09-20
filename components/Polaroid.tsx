"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ZoomHint, usePhotoViewer } from "./PhotoViewer";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  className?: string;
  /** tỉ lệ khung ảnh, mặc định 4/5 giống ảnh polaroid */
  ratio?: string;
  priority?: boolean;
  /** Bọc thêm một lớp .reveal để tấm ảnh hiện dần khi khách cuộn tới */
  reveal?: boolean;
};

/**
 * Số đo ảnh đưa cho khung xem phóng to. Chỉ cần đúng tỉ lệ (xem `ViewerPhoto`),
 * nên suy ra từ `ratio` của khung — không phải khai tay số đo từng file ảnh.
 */
function viewerSize(ratio: string) {
  const [w, h] = ratio.split("/").map((n) => Number(n.trim()));
  if (!w || !h) return { width: 1000, height: 1000 };
  return w >= h
    ? { width: 1000, height: Math.round((1000 * h) / w) }
    : { width: Math.round((1000 * w) / h), height: 1000 };
}

/**
 * Khung ảnh kiểu polaroid: viền trắng dày, bóng đổ mềm, hơi nghiêng. Bấm vào ảnh
 * là xem được bản phóng to (xem components/PhotoViewer.tsx).
 *
 * Bóng đổ có thêm một vạch 1px ôm sát mép khung: nền thiệp là màu kem, khung
 * ảnh màu trắng — không có vạch này thì mép khung tan vào nền và mọi hiệu ứng
 * hiện ra đều không thấy gì.
 *
 * Rê chuột: khung được "nhấc khỏi mặt bàn" và xoay ngay ngắn lại, ảnh bên trong
 * zoom chậm, kèm một vệt sáng lướt qua (.photo-sheen trong globals.css).
 * Độ nghiêng đi qua biến --tilt chứ không set thẳng `transform`/`rotate` inline:
 * inline style luôn thắng class, nên `hover:rotate-0` sẽ không có tác dụng.
 *
 * Nút bấm là chính cái khung ảnh bên trong, không phải cả <figure>: nội dung của
 * <button> chỉ được phép là chữ và ảnh, nhồi <figure>/<figcaption> vào đó là HTML
 * sai. Cả <figure> và nút đều mang class `group` — figure lo hiệu ứng rê chuột
 * (kể cả vệt sáng, xem `.group:hover` trong globals.css), nút lo lớp phủ kính lúp
 * khi bàn phím nhảy tới.
 *
 * `reveal` bọc thêm một thẻ div bên ngoài thay vì gắn .reveal thẳng lên <figure>:
 * .reveal khai trong globals.css (ngoài @layer) sẽ đè mất `transition-[...]` của
 * Tailwind trên figure, làm hiệu ứng rê chuột giật cục. Lớp bọc cũng là chỗ nhận
 * `className` bố cục, nên figure bên trong luôn rộng hết lớp bọc.
 *
 * Lúc hiện ra, lớp bọc xoay từ `--reveal-spin` về 0 — khung nghiêng quá tay rồi
 * lắc về đúng độ nghiêng của nó, như tấm ảnh vừa được thả xuống mặt bàn. Cùng
 * dấu với --tilt để nó "rơi rồi đứng lại" chứ không quét qua phương thẳng.
 */
export function Polaroid({
  src,
  alt,
  caption,
  rotate = 0,
  className = "",
  ratio = "4 / 5",
  priority = false,
  reveal = false,
}: Props) {
  const openViewer = usePhotoViewer();

  const frame = (
    <figure
      className={`group rotate-[var(--tilt)] bg-white p-2.5 pb-3 shadow-[0_0_0_1px_rgba(156,80,92,0.13),0_12px_32px_-12px_rgba(156,80,92,0.4)] transition-[rotate,translate,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_0_0_1px_rgba(156,80,92,0.22),0_26px_50px_-16px_rgba(156,80,92,0.6)] has-[:focus-visible]:-translate-y-1.5 has-[:focus-visible]:rotate-0 ${reveal ? "w-full" : className}`}
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      <button
        type="button"
        onClick={() => openViewer([{ src, alt, ...viewerSize(ratio) }])}
        aria-label={`Xem ảnh lớn: ${alt}`}
        className="photo-sheen group relative block w-full cursor-pointer overflow-hidden bg-blush-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-dark"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 90vw, 420px"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />
        <ZoomHint />
      </button>
      {caption ? (
        <figcaption className="pt-2 text-center font-script text-lg text-wine transition-colors duration-500 group-hover:text-seal">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );

  if (!reveal) return frame;

  return (
    <div
      className={`reveal reveal-zoom ${className}`}
      style={{ "--reveal-spin": `${rotate < 0 ? -7 : 7}deg` } as CSSProperties}
    >
      {frame}
    </div>
  );
}
