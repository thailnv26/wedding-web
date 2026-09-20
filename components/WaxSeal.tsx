import Image from "next/image";

/**
 * Con dấu sáp của cô dâu chú rể — ảnh chụp cục sáp thật in chữ lồng "T&M",
 * sinh ra từ `npm run icon` (xem scripts/make-favicon.mjs).
 *
 * `text` là chữ lồng của bên thiệp đang mở, dùng làm lời thay ảnh cho trình đọc
 * màn hình. Ảnh chỉ có một bản T&M nên chữ lồng không đổi theo bên thiệp: dấu sáp
 * là dấu chung của hai người, không phải dấu riêng từng nhà.
 *
 * Ảnh đã có sẵn nền trong suốt và viền sáp lượn sóng, nên không bo tròn, không tô nền.
 */
export function WaxSeal({
  text,
  size = 64,
  priority = false,
}: {
  text: string;
  size?: number;
  /** Bật cho dấu sáp hiện ngay màn đầu (cổng hoa) để trình duyệt tải ảnh sớm. */
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/badge.png"
      alt={`Dấu sáp ${text}`}
      width={size}
      height={size}
      priority={priority}
      draggable={false}
      className="select-none drop-shadow-[0_6px_14px_rgba(120,45,55,0.45)]"
    />
  );
}
