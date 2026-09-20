"use client";

import { useEffect, useState } from "react";

/** Cuộn quá chừng này mới hiện nút — khách còn ở đầu thiệp thì không cần. */
const SHOW_AFTER_PX = 700;

/**
 * Nút quay lại đầu thiệp, nổi ngay trên thanh điều hướng đáy.
 *
 * Không truyền `behavior: "smooth"` — để nguyên "auto" thì trình duyệt lấy
 * `scroll-behavior` của <html>, nên khách bật "giảm chuyển động" sẽ nhảy thẳng
 * lên đầu trang đúng như khai báo trong globals.css.
 */
export function ScrollToTop({ visible }: { visible: boolean }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const onScroll = () => setShown(window.scrollY > SHOW_AFTER_PX);
    onScroll(); // khách mở lại thiệp giữa chừng thì nút có sẵn luôn
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(max(0.6rem,env(safe-area-inset-bottom))_+_4.6rem)] z-40 px-3">
      <div className="mx-auto flex max-w-[460px] justify-end">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Lên đầu thiệp"
          aria-hidden={!shown}
          tabIndex={shown ? 0 : -1}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-blush-dark/50 bg-cream/85 text-wine shadow-[0_6px_18px_-8px_rgba(156,80,92,0.7)] backdrop-blur transition duration-300 ${
            shown ? "pointer-events-auto opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V6M6 12l6-6 6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
