/** Chùm hoa trang trí vẽ bằng SVG, không cần ảnh. */
export function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden className={className}>
      {[
        { cx: 30, cy: 34, r: 15 },
        { cx: 62, cy: 22, r: 11 },
        { cx: 78, cy: 48, r: 13 },
        { cx: 44, cy: 62, r: 9 },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.cx} ${f.cy})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              rx={f.r * 0.42}
              ry={f.r * 0.62}
              cy={-f.r * 0.5}
              transform={`rotate(${a})`}
              fill="currentColor"
              opacity="0.85"
            />
          ))}
          <circle r={f.r * 0.22} fill="#fdf7f4" />
        </g>
      ))}
    </svg>
  );
}
