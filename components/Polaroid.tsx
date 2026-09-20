import type { CSSProperties } from "react";
import Image from "next/image";

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
 * Khung ảnh kiểu polaroid: viền trắng dày, bóng đổ mềm, hơi nghiêng.
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
  const frame = (
    <figure
      className={`group rotate-[var(--tilt)] bg-white p-2.5 pb-3 shadow-[0_0_0_1px_rgba(156,80,92,0.13),0_12px_32px_-12px_rgba(156,80,92,0.4)] transition-[rotate,translate,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_0_0_1px_rgba(156,80,92,0.22),0_26px_50px_-16px_rgba(156,80,92,0.6)] ${reveal ? "w-full" : className}`}
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      <div
        className="photo-sheen relative w-full overflow-hidden bg-blush-light"
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
      </div>
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
