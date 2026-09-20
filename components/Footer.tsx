import type { ResolvedSide } from "@/lib/side";
import { WaxSeal } from "./WaxSeal";

export function Footer({ side }: { side: ResolvedSide }) {
  return (
    <footer className="reveal px-6 pt-8 pb-32 text-center">
      <div className="flex justify-center">
        <WaxSeal text={side.monogram} size={54} />
      </div>

      <p className="mt-5 font-script text-3xl leading-tight text-wine">
        Hẹn gặp bạn trong ngày vui!
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 text-xs text-ink-soft">
        <p>Mọi thắc mắc xin liên hệ</p>
        <div className="flex gap-3">
          {side.contacts.map((contact) => (
            <a
              key={contact.label}
              href={`tel:${contact.phone}`}
              className="rounded-full border border-blush-dark/60 px-4 py-2 text-wine"
            >
              {contact.label} · {contact.phone}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-8 text-[0.55rem] tracking-[0.3em] text-ink-soft/70 uppercase">
        {side.dateLine}
      </p>
    </footer>
  );
}
