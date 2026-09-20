type Props = {
  overline?: string;
  title: string;
  script?: string;
  className?: string;
};

/** Tiêu đề section: chữ nhỏ in hoa ở trên, tên section serif to, gạch trang trí. */
export function SectionHeading({ overline, title, script, className = "" }: Props) {
  return (
    <header className={`text-center ${className}`}>
      {overline ? (
        <p className="text-[0.65rem] tracking-[0.35em] text-ink-soft uppercase">{overline}</p>
      ) : null}
      {script ? (
        <p className="font-script text-4xl leading-tight text-wine sm:text-5xl">{script}</p>
      ) : null}
      <h2 className="font-display text-3xl tracking-[0.18em] text-wine uppercase sm:text-4xl">
        {title}
      </h2>
      <div className="divider mt-3">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-petal">
          <path d="M12 21s-8-5.3-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 15.7 12 21 12 21Z" />
        </svg>
      </div>
    </header>
  );
}
