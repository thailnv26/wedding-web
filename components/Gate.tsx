"use client";

import { useEffect, useState } from "react";
import type { ResolvedSide } from "@/lib/side";
import { Blossom } from "./Blossom";
import { WaxSeal } from "./WaxSeal";

type Props = {
  side: ResolvedSide;
  guestName: string;
  onOpen: () => void;
};

/**
 * Màn hình phủ toàn trang: cổng hoa cưới hai cánh khép lại.
 * Khách chạm -> dấu sáp bung ra, hai cánh cổng mở sang hai bên, màn hình tan đi
 * và nhạc bắt đầu. Chạm cũng chính là thao tác người dùng mà trình duyệt cần
 * để cho phép phát nhạc.
 */
export function Gate({ side, guestName, onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.dataset.locked = "true";
    return () => {
      delete document.body.dataset.locked;
    };
  }, []);

  useEffect(() => {
    if (!opening) return;
    // Nhạc + mở khoá cuộn chạy ngay theo thao tác chạm, phần nhìn thì tan dần sau đó.
    onOpen();
    const t = setTimeout(() => {
      setGone(true);
      delete document.body.dataset.locked;
    }, 1800);
    return () => clearTimeout(t);
  }, [opening, onOpen]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream px-6 transition-[opacity,transform] duration-700 ease-out ${
        opening ? "pointer-events-none scale-[1.18] opacity-0 delay-[1000ms]" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(120% 70% at 50% 0%, #fbe9ec 0%, #fdf7f4 55%, #fdf7f4 100%)",
      }}
    >
      <p className="text-[0.6rem] tracking-[0.4em] text-ink-soft uppercase">
        Trân trọng kính mời
      </p>

      <p className="mt-3 max-w-[85vw] text-center font-script text-4xl leading-tight text-wine break-words sm:text-5xl">
        {guestName}
      </p>

      <div className="divider mt-4 w-full max-w-[220px]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-petal">
          <path d="M12 21s-8-5.3-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 15.7 12 21 12 21Z" />
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setOpening(true)}
        disabled={opening}
        aria-label="Mở thiệp cưới"
        className="group mt-7 flex flex-col items-center focus:outline-none"
      >
        {/* ----- Cổng hoa ----- */}
        <div
          className="relative w-[min(76vw,286px)] transition-transform duration-500 ease-out group-active:scale-95"
          style={{ aspectRatio: "3 / 4", perspective: "1400px" }}
        >
          {/* khoảng sân sau cổng, lộ ra khi hai cánh mở */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-t-[999px] px-6 text-center"
            style={{
              background:
                "linear-gradient(180deg, #fdf7f4 0%, #fbe9ec 55%, #f6dde2 100%)",
            }}
          >
            <p className="text-[0.55rem] tracking-[0.32em] text-ink-soft uppercase">
              Lễ {side.ceremony}
            </p>
            <p className="mt-3 font-script text-3xl leading-tight text-wine">
              {side.headline[0]}
            </p>
            <p className="font-display text-xl text-petal italic">&amp;</p>
            <p className="font-script text-3xl leading-tight text-wine">{side.headline[1]}</p>
            <p className="mt-4 text-[0.55rem] tracking-[0.3em] text-ink-soft">{side.dateLine}</p>
          </div>

          {/* hai cánh cổng */}
          <div className="absolute inset-0 rounded-t-[999px]" style={{ transformStyle: "preserve-3d" }}>
            <GateLeaf leafSide="left" opening={opening} />
            <GateLeaf leafSide="right" opening={opening} />
          </div>

          {/* trụ cổng hai bên, chỉ ôm phần thân thẳng dưới vòm, đứng yên khi cánh mở */}
          <span className="pointer-events-none absolute top-[38%] -bottom-2 -left-2 w-2 rounded-full bg-blush-dark/70" />
          <span className="pointer-events-none absolute top-[38%] -bottom-2 -right-2 w-2 rounded-full bg-blush-dark/70" />
          {/* bậc thềm dưới chân cổng */}
          <span className="pointer-events-none absolute -bottom-2 -left-4 -right-4 h-2 rounded-full bg-blush-dark/55" />

          {/* dấu sáp khoá giữa hai cánh */}
          <div
            className={`absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
              opening ? "scale-150 opacity-0" : "animate-pulse-soft opacity-100"
            }`}
          >
            <WaxSeal text={side.monogram} size={58} priority />
          </div>

          {/* hoa leo trên đỉnh cổng */}
          <Blossom className="pointer-events-none absolute -top-5 -left-4 z-20 w-20 text-petal/80" />
          <Blossom className="pointer-events-none absolute -top-6 right-2 z-20 w-16 -scale-x-100 text-blush-dark" />
          <Blossom className="pointer-events-none absolute -bottom-5 -right-5 z-20 w-16 rotate-180 text-petal/70" />
        </div>

        {/* ----- Lời nhắc chạm ----- */}
        <span
          className={`mt-7 flex items-center gap-3 text-[0.6rem] tracking-[0.35em] text-ink-soft uppercase transition-opacity duration-300 ${
            opening ? "opacity-0" : "opacity-100"
          }`}
        >
          <Arrow className="animate-pulse-soft text-petal" />
          Chạm để mở cổng
          <Arrow className="rotate-180 animate-pulse-soft text-petal" />
        </span>
      </button>
    </div>
  );
}

/**
 * Một cánh cổng. Bản lề nằm ở mép ngoài nên cánh xoay ra phía trước,
 * giống cánh cổng thật mở về hai bên.
 */
function GateLeaf({ leafSide, opening }: { leafSide: "left" | "right"; opening: boolean }) {
  const isLeft = leafSide === "left";
  const angle = isLeft ? 104 : -104;

  return (
    <div
      className={`absolute inset-y-0 w-1/2 overflow-hidden border-white/60 transition-transform duration-[1100ms] ease-[cubic-bezier(.45,.05,.3,1)] ${
        isLeft
          ? "left-0 origin-left rounded-tl-[999px] border-r"
          : "right-0 origin-right rounded-tr-[999px] border-l"
      }`}
      style={{
        background: isLeft
          ? "linear-gradient(100deg, #efc9d1 0%, #f6dbe0 55%, #f9e6ea 100%)"
          : "linear-gradient(260deg, #efc9d1 0%, #f6dbe0 55%, #f9e6ea 100%)",
        boxShadow: "0 18px 40px -22px rgba(156,80,92,0.65)",
        transform: opening ? `rotateY(${angle}deg)` : "rotateY(0deg)",
        transitionDelay: opening ? "150ms" : "0ms",
        backfaceVisibility: "hidden",
      }}
    >
      {/* ô chỉ chìm trên mặt cánh */}
      <span
        className={`absolute inset-x-[14%] top-[10%] bottom-[8%] border border-white/55 ${
          isLeft ? "rounded-tl-[999px]" : "rounded-tr-[999px]"
        }`}
      />
      <span
        className={`absolute inset-x-[24%] top-[18%] bottom-[16%] border border-white/35 ${
          isLeft ? "rounded-tl-[999px]" : "rounded-tr-[999px]"
        }`}
      />
      {/* dải sáng dọc mép trong, tạo cảm giác hai cánh khép sát nhau */}
      <span
        className={`absolute inset-y-0 w-2 ${
          isLeft
            ? "right-0 bg-gradient-to-l from-white/45 to-transparent"
            : "left-0 bg-gradient-to-r from-white/45 to-transparent"
        }`}
      />
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}
