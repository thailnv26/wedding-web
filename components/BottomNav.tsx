"use client";

import { useActiveSection } from "@/lib/useActiveSection";

/**
 * Năm mục, không hơn. Thêm mục thứ sáu là nhãn "Chuyện tình" xuống dòng trên
 * máy màn hẹp (Galaxy A55 và các máy ~360px) — album vì vậy nằm chung section
 * với chuyện tình thay vì có nút riêng.
 */
const ITEMS = [
  { id: "ngay-cuoi", label: "Ngày cưới", icon: IconCalendar },
  { id: "thong-tin", label: "Thông tin", icon: IconRings },
  { id: "chuyen-tinh", label: "Chuyện tình", icon: IconHeart },
  { id: "rsvp", label: "RSVP", icon: IconEnvelope },
  { id: "mung-cuoi", label: "Mừng cưới", icon: IconGift },
];

/** Mảng hằng, khai ngoài component để hook không chạy lại mỗi lần render. */
const IDS = ITEMS.map((item) => item.id);

/** Thanh điều hướng cố định ở đáy màn hình, tô sáng mục đang xem. */
export function BottomNav({ visible }: { visible: boolean }) {
  const active = useActiveSection(IDS, visible);

  if (!visible) return null;

  return (
    <nav
      aria-label="Điều hướng thiệp"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <ul className="mx-auto flex max-w-[460px] items-stretch justify-between rounded-3xl border border-blush-dark/50 bg-blush/95 px-1.5 py-2 shadow-[0_-8px_28px_-18px_rgba(120,60,70,0.8)] backdrop-blur">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors ${
                  isActive ? "bg-cream/80 text-wine" : "text-wine/65"
                }`}
              >
                <Icon />
                <span className="text-[0.55rem] leading-none tracking-[0.04em] whitespace-nowrap">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function IconCalendar() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg {...iconProps}>
      <path d="M12 20s-7.5-4.9-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.1-7.5 10-7.5 10Z" />
    </svg>
  );
}
function IconRings() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="15" r="5.5" />
      <circle cx="15.5" cy="15" r="5.5" />
      <path d="M12 3.5 14 6h-4l2-2.5Z" />
    </svg>
  );
}
function IconEnvelope() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconGift() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12" />
      <path d="M12 9S10 5 8 6s.5 3 4 3Zm0 0s2-4 4-3-.5 3-4 3Z" />
    </svg>
  );
}
