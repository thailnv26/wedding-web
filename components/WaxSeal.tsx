/** Con dấu sáp tròn có chữ lồng ở giữa. */
export function WaxSeal({ text, size = 64 }: { text: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-cream shadow-[0_6px_14px_-4px_rgba(120,45,55,0.6)]"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 34% 28%, #d1808b 0%, #b75e6a 45%, #97434f 100%)",
      }}
    >
      <span
        className="font-display tracking-wide"
        style={{ fontSize: size * 0.3, lineHeight: 1 }}
      >
        {text}
      </span>
    </div>
  );
}
