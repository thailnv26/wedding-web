"use client";

import { useEffect, useState } from "react";
import type { ResolvedSide } from "@/lib/side";
import { googleCalendarUrl, splitDate } from "@/lib/date";

type Remaining = { days: number; hours: number; minutes: number; seconds: number } | null;

function remainingUntil(target: number): Remaining {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Tấm thiệp hình vòm + đồng hồ đếm ngược.
 * Mốc là buổi tiệc mà khách của bên này được mời, không phải ngày cưới chung.
 */
export function Countdown({ side }: { side: ResolvedSide }) {
  const mainEvent = side.mainEvent;
  const target = new Date(mainEvent.datetime).getTime();
  const [left, setLeft] = useState<Remaining>(null); // null ở lần render đầu để khớp server

  useEffect(() => {
    const tick = () => setLeft(remainingUntil(target));
    const frame = requestAnimationFrame(tick); // lần đầu ngay sau khi hydrate xong
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, [target]);

  const d = splitDate(mainEvent.datetime);
  const passed = left !== null && left.days + left.hours + left.minutes + left.seconds === 0;

  return (
    <section id="ngay-cuoi" className="reveal px-6 py-10">
      <div className="relative mx-auto max-w-[330px]">
        {/* tấm thiệp hình vòm */}
        <div className="rounded-t-[999px] border border-blush-dark/60 bg-blush-light px-7 pt-12 pb-9 text-center shadow-[0_18px_40px_-24px_rgba(156,80,92,0.55)]">
          <p className="text-[0.62rem] tracking-[0.35em] text-ink-soft uppercase">{d.weekday}</p>

          <p className="lnum mt-2 font-display text-7xl leading-none text-wine">{d.day}</p>

          <p className="mt-2 text-[0.68rem] tracking-[0.3em] text-ink-soft uppercase">
            {d.month} · {d.year}
          </p>
          <p className="mt-1 text-[0.68rem] tracking-[0.3em] text-ink-soft uppercase">
            Vào lúc {d.time}
          </p>
          <p className="mt-1 text-[0.68rem] text-ink-soft italic">({mainEvent.lunarLabel})</p>

          <div className="divider my-5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-petal">
              <path d="M12 21s-8-5.3-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 15.7 12 21 12 21Z" />
            </svg>
          </div>

          <p className="font-display text-lg tracking-wide text-wine">{mainEvent.venue}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{mainEvent.address}</p>

          <a
            href={googleCalendarUrl(mainEvent)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-wine/30 px-4 py-2 text-[0.6rem] tracking-[0.25em] text-wine uppercase"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 11h18" strokeLinecap="round" />
            </svg>
            Lưu vào lịch
          </a>
        </div>

        {/* đồng hồ đếm ngược */}
        <div className="mt-6">
          {passed ? (
            <p className="text-center font-script text-2xl text-wine">
              Hôm nay là ngày của chúng mình!
            </p>
          ) : (
            <ul className="grid grid-cols-4 gap-2">
              {(
                [
                  ["Ngày", left?.days],
                  ["Giờ", left?.hours],
                  ["Phút", left?.minutes],
                  ["Giây", left?.seconds],
                ] as const
              ).map(([label, value]) => (
                <li
                  key={label}
                  className="rounded-2xl border border-blush-dark/40 bg-cream py-3 text-center"
                >
                  <span className="lnum block font-display text-2xl text-wine tabular-nums">
                    {value === undefined ? "--" : String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[0.55rem] tracking-[0.2em] text-ink-soft uppercase">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
