"use client";

import { useEffect, useState } from "react";
import { config } from "@/data/config";
import type { ResolvedSide } from "@/lib/side";
import { fetchWishes, submitRsvp, type Wish } from "@/lib/rsvp";
import { SectionHeading } from "./SectionHeading";

type Status = "idle" | "sending" | "done" | "error";

export function Rsvp({ side, guestName }: { side: ResolvedSide; guestName: string }) {
  // null = khách chưa gõ gì, lúc đó lấy tên sẵn có trên link mời.
  const [typedName, setTypedName] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);

  const name = typedName ?? (guestName === config.guest.fallback ? "" : guestName);

  useEffect(() => {
    if (!config.rsvp.showWishes) return;
    fetchWishes().then(setWishes);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Bạn cho tụi mình xin tên với nhé.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    const payload = {
      name: name.trim(),
      attending,
      guests: attending === "yes" ? guests : 0,
      wish: wish.trim(),
      side: side.label,
    };

    try {
      await submitRsvp(payload);
      setStatus("done");
      if (payload.wish) {
        setWishes((prev) => [
          { name: payload.name, wish: payload.wish, attending, time: new Date().toISOString() },
          ...prev,
        ]);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, bạn thử lại giúp mình nhé.");
    }
  };

  return (
    <section id="rsvp" className="reveal px-6 py-12">
      <SectionHeading overline={config.rsvp.deadline} script="Đôi" title="Lời Nhắn Gửi" />

      <p className="mx-auto mt-6 max-w-[380px] text-center text-[0.9rem] leading-[1.9] text-ink">
        {config.rsvp.message}
      </p>

      {status === "done" ? (
        <div className="mx-auto mt-8 max-w-[380px] rounded-3xl border border-blush-dark/60 bg-blush-light px-6 py-8 text-center">
          <p className="font-script text-3xl text-wine">Cảm ơn bạn!</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {attending === "yes"
              ? "Tụi mình đã ghi nhận, hẹn gặp bạn trong ngày vui nhé."
              : "Tiếc là chưa gặp được bạn dịp này, nhưng tụi mình rất trân trọng lời chúc của bạn."}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-[380px] space-y-5">
          <Field label="Tên của bạn">
            <input
              value={name}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Ví dụ: Anh Nam"
              maxLength={60}
              className="w-full rounded-2xl border border-blush-dark/60 bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-petal"
            />
          </Field>

          <Field label="Bạn sẽ đến chứ?">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["yes", "Có, mình sẽ đến"],
                  ["no", "Tiếc quá, mình bận"],
                ] as const
              ).map(([value, text]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAttending(value)}
                  aria-pressed={attending === value}
                  className={`rounded-2xl border px-3 py-3 text-xs transition-colors ${
                    attending === value
                      ? "border-petal bg-blush text-wine"
                      : "border-blush-dark/50 bg-cream text-ink-soft"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </Field>

          {attending === "yes" ? (
            <Field label="Số người tham dự">
              <div className="flex items-center gap-4">
                <Stepper label="Bớt một người" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                  −
                </Stepper>
                <span className="lnum min-w-8 text-center font-display text-2xl text-wine tabular-nums">
                  {guests}
                </span>
                <Stepper label="Thêm một người" onClick={() => setGuests((g) => Math.min(10, g + 1))}>
                  +
                </Stepper>
              </div>
            </Field>
          ) : null}

          <Field label="Lời chúc gửi cô dâu chú rể">
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Chúc hai bạn trăm năm hạnh phúc..."
              className="w-full resize-none rounded-2xl border border-blush-dark/60 bg-cream px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-soft/60 focus:border-petal"
            />
          </Field>

          {status === "error" ? (
            <p role="alert" className="text-center text-xs text-seal">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-wine py-4 text-[0.65rem] tracking-[0.3em] text-cream uppercase transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi..." : "Gửi lời chúc"}
          </button>

          {!config.rsvp.endpoint ? (
            <p className="text-center text-[0.65rem] text-ink-soft">
              (Chưa nối Google Sheet — xem README để lấy link webhook)
            </p>
          ) : null}
        </form>
      )}

      {config.rsvp.showWishes && wishes.length > 0 ? (
        <div className="mt-12">
          <p className="text-center font-script text-3xl text-wine">Sổ lưu bút</p>
          <ul className="mt-5 space-y-3">
            {wishes.slice(0, 30).map((w, i) => (
              <li
                key={`${w.name}-${i}`}
                className="rounded-2xl border border-blush-dark/40 bg-blush-light/60 px-5 py-4"
              >
                <p className="font-display text-base tracking-wide text-wine">{w.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">{w.wish}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stepper({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-blush-dark/60 bg-cream text-lg text-wine"
    >
      {children}
    </button>
  );
}
