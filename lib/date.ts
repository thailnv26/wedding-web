import type { WeddingEvent } from "@/data/config";

/**
 * Mọi mốc thời gian đều quy về giờ Việt Nam.
 * Không dùng giờ máy khách, nếu không khách ở múi giờ khác sẽ thấy lệch ngày.
 */
const TZ = "Asia/Ho_Chi_Minh";

const WEEKDAY_VI: Record<string, string> = {
  Sun: "Chủ Nhật",
  Mon: "Thứ Hai",
  Tue: "Thứ Ba",
  Wed: "Thứ Tư",
  Thu: "Thứ Năm",
  Fri: "Thứ Sáu",
  Sat: "Thứ Bảy",
};

/** Dùng en-GB + tự dịch thứ để kết quả giống hệt nhau giữa lúc build và lúc chạy. */
const vnParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** 2026-11-21T11:00:00+07:00 -> 20261121T040000Z (định dạng Google Calendar) */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link "Thêm vào Google Lịch", mặc định kéo dài 3 tiếng. */
export function googleCalendarUrl(event: WeddingEvent, hours = 3): string {
  const start = new Date(event.datetime);
  const end = new Date(start.getTime() + hours * 3600_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${event.venue}`,
    dates: `${toCalendarStamp(event.datetime)}/${toCalendarStamp(end.toISOString())}`,
    details: [event.lunarLabel, event.note].filter(Boolean).join(" · "),
    location: event.address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Link chỉ đường: ưu tiên link tự đặt trong config, không có thì tra theo địa chỉ. */
export function mapUrl(event: WeddingEvent): string {
  if (event.mapUrl) return event.mapUrl;
  const query = encodeURIComponent(event.address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Tách ngày tháng (theo giờ VN) để hiển thị trên tấm thiệp hình vòm. */
export function splitDate(iso: string) {
  const p = Object.fromEntries(
    vnParts.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );

  return {
    weekday: WEEKDAY_VI[p.weekday] ?? p.weekday,
    day: p.day,
    month: `Tháng ${Number(p.month)}`,
    year: p.year,
    time: `${p.hour}:${p.minute}`,
    /** Dòng ngày kiểu "29 . 11 . 2026" in trên phong bì và chân trang. */
    dateLine: `${p.day} . ${p.month} . ${p.year}`,
  };
}
