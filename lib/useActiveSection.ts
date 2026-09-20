"use client";

import { useEffect, useState } from "react";

/**
 * Tìm section đang chiếm phần giữa màn hình, trả id về cho thanh nav tô sáng
 * đúng tab.
 *
 * Hiệu ứng của ảnh không đi qua đây: mỗi tấm ảnh tự theo dõi vị trí của chính
 * nó (`data-inview` trong lib/useReveal.ts). Bám theo section thì cả trang chỉ
 * có đúng một section "đang xem", ảnh của section kế bên nằm ngay trước mắt
 * khách vẫn đứng im.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (shown) setActive(shown.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.05, 0.3, 0.6] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
