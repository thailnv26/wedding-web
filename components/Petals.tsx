/** Cánh hoa rơi nhè nhẹ ở nền. Giá trị cố định để server và client render giống nhau. */
const PETALS = [
  { left: "6%", delay: "0s", duration: "15s", size: 14, drift: "30px", opacity: 0.55 },
  { left: "18%", delay: "3.5s", duration: "19s", size: 10, drift: "-24px", opacity: 0.45 },
  { left: "29%", delay: "7s", duration: "16s", size: 16, drift: "18px", opacity: 0.5 },
  { left: "41%", delay: "1.6s", duration: "21s", size: 11, drift: "-32px", opacity: 0.4 },
  { left: "53%", delay: "9.2s", duration: "17s", size: 15, drift: "26px", opacity: 0.55 },
  { left: "64%", delay: "5s", duration: "20s", size: 12, drift: "-20px", opacity: 0.42 },
  { left: "75%", delay: "11s", duration: "15.5s", size: 17, drift: "22px", opacity: 0.5 },
  { left: "86%", delay: "2.4s", duration: "22s", size: 10, drift: "-28px", opacity: 0.38 },
  { left: "94%", delay: "8s", duration: "18s", size: 13, drift: "16px", opacity: 0.48 },
];

export function Petals() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ["--drift" as string]: p.drift,
            opacity: p.opacity,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
            <path
              d="M10 1c4 3 8 6 8 10a8 8 0 0 1-16 0c0-4 4-7 8-10Z"
              fill="currentColor"
              className="text-blush-dark"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
