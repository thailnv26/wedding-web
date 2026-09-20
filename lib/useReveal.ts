"use client";

import { useEffect } from "react";

/** Khoảng lệch giữa hai phần tử cùng lọt vào khung hình một lượt. */
const STAGGER_MS = 110;
/** Trần độ trễ: cuộn thật nhanh qua album cũng không để khách chờ quá lâu. */
const MAX_DELAY_MS = 520;

/**
 * Hướng zoom của Ken Burns, rải lần lượt cho từng tấm ảnh trong trang.
 * Tấm zoom lên, tấm trôi sang trái, tấm chếch xuống — cả lưới ảnh không cùng
 * phồng lên một nhịp. Giá trị nhỏ vì ảnh chỉ phóng 13%, trôi quá tay sẽ hở mép.
 */
const KEN_BURNS = [
  { x: "0%", y: "-2.2%", delay: "0s" },
  { x: "-2%", y: "1.6%", delay: "-2.4s" },
  { x: "1.8%", y: "-1.4%", delay: "-4.8s" },
  { x: "-1.4%", y: "-2%", delay: "-1.2s" },
  { x: "2%", y: "1.8%", delay: "-3.6s" },
  { x: "-1.8%", y: "-1.2%", delay: "-6s" },
];

/** Chỉ quan sát phần tử chưa hiện — hiện rồi thì thôi, không bắt lại. */
const HIDDEN = ".reveal:not([data-shown])";

/**
 * Bật toàn bộ hiệu ứng cuộn của tấm thiệp. Xem app/globals.css để biết mỗi
 * attribute dưới đây kéo theo hiệu ứng gì.
 *
 * Hai lớp quan sát, cố tình tách riêng vì vòng đời khác hẳn nhau:
 *
 *  1. `.reveal` -> `data-shown`: một lần rồi thôi. Khách cuộn ngược lên thì
 *     ảnh vẫn ở đó chứ không biến mất rồi hiện lại — cuộn lên cuộn xuống mà
 *     nội dung cứ nhấp nháy thì rất khó chịu.
 *
 *  2. `.photo-sheen` -> `data-inview`: bật tắt liên tục theo vị trí cuộn. Ảnh
 *     ra khỏi màn hình thì dừng Ken Burns, đỡ tốn pin điện thoại.
 *
 * Độ trễ xếp lớp tính lúc phần tử lọt vào khung hình chứ không viết cứng theo
 * chỉ số:
 * - Cuộn chậm, mỗi lần chỉ một tấm ảnh vào khung hình -> delay 0, ảnh hiện ngay.
 * - Cuộn nhanh, cả lưới ảnh vào cùng lúc -> xếp theo thứ tự từ trên xuống rồi
 *   hiện lần lượt, thành gợn sóng thay vì bật lên một cục.
 *
 * Độ trễ đi qua biến `--reveal-delay` chứ không phải `style.transitionDelay`:
 * biến kế thừa xuống con, nên lớp kem phủ mặt ảnh và vệt sáng quét ngang trễ
 * đúng bằng khung bọc chúng.
 *
 * Chạy lại mỗi khi `enabled` đổi (sau khi mở cổng hoa) để bắt các node vừa render.
 */
export function useReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // Khách đã tắt hiệu ứng chuyển động trong cài đặt máy: hiện thẳng, không quan sát.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of document.querySelectorAll<HTMLElement>(HIDDEN)) {
        el.dataset.shown = "true";
      }
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        const arrived = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        arrived.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          revealObserver.unobserve(el);
          const delay = Math.min(i * STAGGER_MS, MAX_DELAY_MS);
          if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.dataset.shown = "true";
        });
      },
      // threshold thấp + chừa 8% đáy: ảnh bắt đầu hiện khi vừa nhô lên khỏi mép
      // dưới màn hình, đúng lúc mắt khách nhìn tới. threshold cao sẽ hỏng với
      // những section dài hơn màn hình (tỉ lệ hiển thị không bao giờ đạt tới).
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    // Ken Burns chỉ chạy cho ảnh đang thật sự nằm trong màn hình. rootMargin
    // dương: ảnh đã chuyển động sẵn trước khi trôi vào, khách không bắt được
    // khoảnh khắc nó khởi động.
    const driftObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.dataset.inview = "true";
          else delete el.dataset.inview;
        }
      },
      { rootMargin: "15% 0px 15% 0px", threshold: 0 },
    );

    /** Đếm dồn qua mọi lần quét để ảnh render muộn vẫn nối tiếp bảng hướng zoom. */
    let photoCount = 0;

    /** Phát hướng zoom cho một tấm ảnh rồi theo dõi nó. `data-kb` chống phát hai lần. */
    const armPhoto = (el: HTMLElement) => {
      if (el.dataset.kb !== undefined) return;
      const kb = KEN_BURNS[photoCount++ % KEN_BURNS.length];
      el.dataset.kb = "";
      el.style.setProperty("--kb-x", kb.x);
      el.style.setProperty("--kb-y", kb.y);
      el.style.setProperty("--kb-delay", kb.delay);
      driftObserver.observe(el);
    };

    const scan = (root: ParentNode) => {
      for (const el of root.querySelectorAll<HTMLElement>(HIDDEN)) revealObserver.observe(el);
      for (const el of root.querySelectorAll<HTMLElement>(".photo-sheen")) armPhoto(el);
    };

    /** querySelectorAll bỏ qua chính node gốc, nên phải xét nó riêng. */
    const scanSelf = (el: HTMLElement) => {
      if (el.classList.contains("reveal") && !el.dataset.shown) revealObserver.observe(el);
      if (el.classList.contains("photo-sheen")) armPhoto(el);
    };

    scan(document);

    // Node render muộn (mở hộp quà, danh sách RSVP cập nhật) cũng phải được bắt.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          scanSelf(node);
          scan(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      driftObserver.disconnect();
      mutations.disconnect();
    };
  }, [enabled]);
}
