"use client";

import { useMemo, useState } from "react";
import { config, type SideKey } from "@/data/config";
import { SIDE_KEYS } from "@/lib/side";

function buildLink(base: string, side: SideKey, name: string) {
  const clean = name.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  return `${base.replace(/\/$/, "")}/${side}/?to=${encodeURIComponent(clean)}`;
}

/** Công cụ nội bộ: chọn bên, gõ tên khách -> ra link mời riêng để gửi Zalo/Messenger. */
export function LinkMaker() {
  const [base, setBase] = useState(config.site.baseUrl);
  const [side, setSide] = useState<SideKey>(config.defaultSide);
  const [single, setSingle] = useState("");
  const [bulk, setBulk] = useState("");
  const [copied, setCopied] = useState("");

  const singleLink = useMemo(() => buildLink(base, side, single), [base, side, single]);

  const bulkRows = useMemo(
    () =>
      bulk
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name) => ({ name, link: buildLink(base, side, name) })),
    [base, side, bulk],
  );

  const copy = async (text: string, tag: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("Trình duyệt chặn sao chép, bạn bôi đen rồi copy tay nhé");
      setTimeout(() => setCopied(""), 3000);
    }
  };

  const shareText = (name: string, link: string) =>
    `Thân gửi ${name},\nVợ chồng mình trân trọng kính mời bạn đến dự lễ cưới. Thiệp mời của bạn đây nhé:\n${link}`;

  return (
    <div className="mx-auto max-w-[560px] px-6 py-10">
      <h1 className="font-display text-3xl tracking-[0.15em] text-wine uppercase">Tạo link mời</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Chọn thiệp nhà gái hay nhà trai, gõ tên khách, copy link rồi gửi đi. Tên sẽ hiện ngay trên
        phong bì khi khách mở thiệp.
      </p>

      {/* Chọn phiên bản thiệp */}
      <div className="mt-8">
        <span className="mb-2 block text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase">
          Thiệp bên nào
        </span>
        <div className="grid grid-cols-2 gap-2">
          {SIDE_KEYS.map((key) => {
            const isActive = side === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSide(key)}
                aria-pressed={isActive}
                className={`rounded-2xl border px-3 py-3 text-xs transition-colors ${
                  isActive
                    ? "border-petal bg-blush text-wine"
                    : "border-blush-dark/50 bg-cream text-ink-soft"
                }`}
              >
                <span className="block">{config.sides[key].label}</span>
                <span className="mt-0.5 block text-[0.6rem] tracking-[0.2em] uppercase">
                  Lễ {config.sides[key].ceremony}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-6 block">
        <span className="mb-2 block text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase">
          Địa chỉ thiệp
        </span>
        <input
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-full rounded-2xl border border-blush-dark/60 bg-cream px-4 py-3 text-sm outline-none focus:border-petal"
        />
      </label>

      {/* Một khách */}
      <label className="mt-6 block">
        <span className="mb-2 block text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase">
          Tên khách mời
        </span>
        <input
          value={single}
          onChange={(e) => setSingle(e.target.value)}
          placeholder="Anh Nam & Chị Hoa"
          className="w-full rounded-2xl border border-blush-dark/60 bg-cream px-4 py-3 text-sm outline-none focus:border-petal"
        />
      </label>

      {singleLink ? (
        <div className="mt-4 rounded-2xl border border-blush-dark/50 bg-blush-light px-4 py-4">
          <p className="text-xs break-all text-ink">{singleLink}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(singleLink, "link")}
              className="rounded-full bg-wine px-4 py-2 text-[0.6rem] tracking-[0.2em] text-cream uppercase"
            >
              {copied === "link" ? "Đã copy" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => copy(shareText(single.trim(), singleLink), "text")}
              className="rounded-full border border-wine/40 px-4 py-2 text-[0.6rem] tracking-[0.2em] text-wine uppercase"
            >
              {copied === "text" ? "Đã copy" : "Copy kèm lời mời"}
            </button>
            <a
              href={singleLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-wine/40 px-4 py-2 text-[0.6rem] tracking-[0.2em] text-wine uppercase"
            >
              Xem thử
            </a>
          </div>
        </div>
      ) : null}

      {/* Nhiều khách */}
      <label className="mt-10 block">
        <span className="mb-2 block text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase">
          Danh sách nhiều khách — mỗi dòng một tên
        </span>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={6}
          placeholder={"Gia đình bác Tuấn\nAnh Nam\nChị Hoa"}
          className="w-full resize-y rounded-2xl border border-blush-dark/60 bg-cream px-4 py-3 text-sm outline-none focus:border-petal"
        />
      </label>

      {bulkRows.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() =>
              copy(bulkRows.map((r) => `${r.name}\t${r.link}`).join("\n"), "bulk")
            }
            className="mt-3 rounded-full bg-wine px-4 py-2 text-[0.6rem] tracking-[0.2em] text-cream uppercase"
          >
            {copied === "bulk" ? "Đã copy" : `Copy cả ${bulkRows.length} link (dán được vào Excel)`}
          </button>

          <ul className="mt-4 space-y-2">
            {bulkRows.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between gap-3 rounded-2xl border border-blush-dark/40 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-wine">{r.name}</p>
                  <p className="truncate text-[0.7rem] text-ink-soft">{r.link}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(r.link, r.name)}
                  className="shrink-0 rounded-full border border-wine/40 px-3 py-1.5 text-[0.55rem] tracking-[0.2em] text-wine uppercase"
                >
                  {copied === r.name ? "Đã copy" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {copied.startsWith("Trình duyệt") ? (
        <p className="mt-4 text-xs text-seal">{copied}</p>
      ) : null}
    </div>
  );
}
