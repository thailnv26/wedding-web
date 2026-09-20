import type { Family, WeddingEvent } from "@/data/config";
import type { ResolvedSide } from "@/lib/side";
import { googleCalendarUrl, mapUrl, splitDate } from "@/lib/date";
import { Blossom } from "./Blossom";
import { SectionHeading } from "./SectionHeading";

type Props = {
  side: ResolvedSide;
  guestName: string;
};

/**
 * Ruột của tấm thiệp, xếp đúng thứ tự thiệp giấy:
 * hai nhà -> báo tin lễ -> hôn lễ -> kính mời dự tiệc.
 * Nhà đứng tên mời (gái hay trai) luôn nằm trên.
 */
export function Details({ side, guestName }: Props) {
  const [ceremony, ...parties] = side.events;
  const [first, second] = side.people;

  return (
    <section id="thong-tin" className="px-6 py-12">
      <SectionHeading
        overline="Ngày vui đã rất gần"
        script="Thông Tin"
        title="Buổi Lễ"
        className="reveal"
      />

      {/* Hai bên gia đình đứng song song như thiệp giấy — nhà đứng tên mời bên trái.
          Tấm thiệp trồi lên, hai nhà trôi vào từ hai phía rồi gặp nhau ở vạch
          ngăn giữa. Hai lớp .reveal lồng nhau ở đây là cố ý: chúng hiện cùng
          lúc nên transform cộng dồn thành một chuyển động, khác với trường hợp
          các <li> bên dưới cần hiện lần lượt. */}
      <div className="reveal card-paper relative mt-8 overflow-hidden rounded-[2rem] border border-blush-dark/50 px-3 py-8 shadow-[0_18px_44px_-30px_rgba(156,80,92,0.7)]">
        {/* Khung chỉ chìm chạy vòng trong mép giấy + hai chùm hoa mờ tràn ra góc:
            mặt thiệp có lớp lang chứ không phẳng lì một mảng hồng. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[7px] rounded-[1.62rem] border border-blush-dark/30"
        />
        <Blossom className="pointer-events-none absolute -top-5 -left-6 w-24 text-blush-dark/25" />
        <Blossom className="pointer-events-none absolute -right-6 -bottom-6 w-20 rotate-180 text-blush-dark/20" />

        <div className="relative grid grid-cols-2">
          {/* Vạch ngăn giữa hai nhà: mảnh dần về hai đầu, viên thoi nhỏ ở chính
              giữa là điểm hai nhà gặp nhau khi hai cột trôi vào. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blush-dark to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-blush-dark bg-cream"
          />

          <FamilyColumn family={side.families[0]} className="reveal reveal-left" />
          <FamilyColumn family={side.families[1]} className="reveal reveal-right" />
        </div>
      </div>

      {/* Sợi chỉ nối hai nhà xuống lời báo tin — mắt đọc liền một mạch
          "hai nhà" -> "nên buổi lễ này" thay vì thấy hai tấm rời nhau. */}
      <Thread className="reveal" />

      {/* Báo tin lễ Vu Quy / Tân Hôn + tên cô dâu chú rể. Đây là tấm quan trọng
          nhất của cả section nên được đóng khung kép, tên lễ có vệt sáng quét
          ngang và vòng tròn quanh chữ "&" tự vẽ khi tấm thiệp hiện ra. */}
      <div className="reveal card-paper relative overflow-hidden rounded-[2rem] border border-blush-dark/60 px-5 py-9 text-center shadow-[0_24px_54px_-30px_rgba(156,80,92,0.75)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[7px] rounded-[1.62rem] border border-blush-dark/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[12px] rounded-[1.4rem] border border-white/70"
        />
        <Blossom className="pointer-events-none absolute -top-6 -left-7 w-28 text-petal/25" />
        <Blossom className="pointer-events-none absolute -right-7 -bottom-7 w-24 rotate-180 text-petal/20" />

        <div className="relative">
          <p className="text-[0.62rem] tracking-[0.3em] text-ink-soft uppercase">
            Trân trọng báo tin lễ
          </p>

          {/* clamp theo bề ngang màn hình: máy nhỏ chữ vẫn nằm gọn một dòng,
              máy lớn thì tên lễ được phóng hết cỡ. pl bù đúng khoảng giãn chữ
              thừa ở cuối dòng để chữ nằm chính giữa thật. */}
          <p className="gilt mt-2 pl-[0.3em] font-display text-[clamp(1.9rem,8.5vw,2.5rem)] leading-none font-medium tracking-[0.3em] uppercase">
            {side.ceremony}
          </p>

          <p className="mt-2 font-script text-lg text-seal">của con chúng tôi</p>

          <div className="divider my-6">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-petal">
              <path d="M12 21s-8-5.3-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 15.7 12 21 12 21Z" />
            </svg>
          </div>

          {/* Tên trên - tên dưới, thứ bậc hai bên ôm lấy chữ & ở giữa */}
          <p className="font-display text-[clamp(1.5rem,7vw,1.95rem)] leading-tight tracking-wide text-wine">
            {first.name}
          </p>

          <div className="my-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.2em] text-ink-soft uppercase">
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-blush-dark" />
              {first.birthOrder}
            </p>

            <span className="relative flex h-12 w-12 items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden
                className="amp-ring absolute inset-0 h-full w-full text-blush-dark"
              >
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="font-script text-[2.1rem] leading-none text-seal">&amp;</span>
            </span>

            <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.2em] text-ink-soft uppercase">
              {second.birthOrder}
              <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-blush-dark" />
            </p>
          </div>

          <p className="font-display text-[clamp(1.5rem,7vw,1.95rem)] leading-tight tracking-wide text-wine">
            {second.name}
          </p>
        </div>
      </div>

      {/* Hôn lễ. Câu dẫn chạy thẳng vào tên địa điểm in to trên tấm thiệp bên
          dưới: "Hôn lễ được cử hành tại" -> "Tư gia". Vì thế EventCard ở đây
          không in lại tên lễ — chen "Lễ Tân Hôn" vào giữa là cắt câu làm đôi.
          Sợi chỉ giữ câu dẫn dính lấy tấm thiệp để mắt đọc liền một mạch. */}
      <div className="reveal mt-12">
        <Lead>Hôn lễ được cử hành tại</Lead>
        <Thread />
        <EventCard event={ceremony} />
      </div>

      {/* Kính mời dự tiệc — cũng là một câu liền mạch, chạy từ tên khách xuống
          thẳng tên nơi đãi tiệc: "Trân trọng kính mời / <tên khách> / đến dự
          buổi tiệc ... tại" -> "Homestay Về Nhà".

          Lời mời hiện thành một mảng, rồi từng tiệc hiện tiếp phía sau.
          Không đặt .reveal ở thẻ bọc ngoài: .reveal lồng nhau thì lớp cha còn
          trong suốt đã che mất nhịp hiện lần lượt của các <li> bên trong. */}
      <div className="mt-14">
        <div className="reveal">
          <Lead>Trân trọng kính mời</Lead>

          {/* Tên khách là chữ riêng cho từng người nên được viết to nhất trong
              khối, chữ viết tay như người ta chấp bút điền vào thiệp giấy. */}
          <p className="mt-3 text-center font-script text-[clamp(1.9rem,8.5vw,2.5rem)] leading-tight text-wine break-words">
            {guestName}
          </p>

          <div aria-hidden className="mx-auto mt-3 flex w-28 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blush-dark" />
            <span className="h-1 w-1 rotate-45 bg-blush-dark" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-blush-dark" />
          </div>

          <p className="mx-auto mt-3 max-w-[19rem] text-center text-[0.92rem] leading-[1.9] text-ink">
            {side.partyInvite}
          </p>

          <Thread />
        </div>

        <ol className="space-y-5">
          {parties.map((event) => (
            <li key={event.id} className="reveal">
              {/* Chỉ gọi tên buổi tiệc khi có từ hai tiệc trở lên. Một tiệc thì
                  câu dẫn ngay phía trên đã gọi tên rồi. */}
              <EventCard
                event={event}
                eyebrow={parties.length > 1 ? event.title : undefined}
                featured
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Một cột nhà: tên nhà, ông bà, địa chỉ.
 * Hai cột đứng cạnh nhau nên chữ phải nhỏ hơn thiệp một cột — bù lại tên ông bà
 * dùng chữ serif của thiệp cho ra dáng chữ in, thay vì chữ thường như phần thân.
 */
function FamilyColumn({
  family,
  className = "",
}: {
  family: Family;
  className?: string;
}) {
  return (
    <article className={`px-2.5 text-center ${className}`}>
      {/* Hai vạch kẹp hai bên tên nhà co lại trước khi tên nhà chịu xuống dòng —
          máy nhỏ thì vạch ngắn đi chứ "NHÀ GÁI" không bị bẻ làm đôi. */}
      <p className="flex items-center justify-center gap-2 text-[0.55rem] tracking-[0.28em] text-ink-soft uppercase">
        <span aria-hidden className="h-px w-4 min-w-0 bg-blush-dark/70" />
        <span className="whitespace-nowrap">{family.label}</span>
        <span aria-hidden className="h-px w-4 min-w-0 bg-blush-dark/70" />
      </p>

      <div className="mt-2.5 space-y-0.5 font-display text-[0.88rem] leading-[1.4] text-wine">
        <p>{family.father}</p>
        <p>{family.mother}</p>
      </div>

      <p className="mt-2 text-[0.66rem] leading-relaxed text-ink-soft">{family.address}</p>
    </article>
  );
}

/**
 * Một buổi lễ / buổi tiệc. Địa điểm là thứ khách phải nhớ nên được nhấc hẳn
 * lên một tấm nền hồng riêng và viết to nhất thẻ; giờ giấc đứng dưới vạch ngăn.
 *
 * Thẻ KHÔNG tự in tên buổi: câu dẫn ngay phía trên đã gọi tên rồi, in lại là
 * cắt câu "... cử hành tại" / "... chung vui tại" làm đôi. Chỉ khi một bên có
 * từ hai tiệc trở lên thì mới truyền `eyebrow` vào cho khách phân biệt.
 */
function EventCard({
  event,
  eyebrow,
  featured = false,
}: {
  event: WeddingEvent;
  eyebrow?: string;
  featured?: boolean;
}) {
  const date = splitDate(event.datetime);

  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-blush-dark/45 bg-cream px-5 py-7 shadow-[0_16px_40px_-28px_rgba(156,80,92,0.75)]">
      {/* Cùng ngôn ngữ trang trí với hai tấm thiệp phía trên: khung chỉ chìm
          trong mép giấy + hai chùm hoa mờ tràn ra góc. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[6px] rounded-[1.4rem] border border-blush-dark/25"
      />
      <Blossom className="pointer-events-none absolute -top-6 -right-7 w-24 text-blush-dark/20" />
      <Blossom className="pointer-events-none absolute -bottom-7 -left-7 w-20 rotate-180 text-blush-dark/15" />

      <div className="relative">
        {eyebrow ? (
          <p className="mb-3 text-center text-[0.55rem] tracking-[0.28em] text-ink-soft uppercase">
            {eyebrow}
          </p>
        ) : null}

        <dl className="rounded-2xl bg-blush-light/70 px-4 py-5 text-center">
          <dt className="sr-only">Địa điểm</dt>
          {/* text-balance: tên dài như "Homestay Về Nhà" được bẻ thành hai dòng
              cân nhau thay vì bỏ trơ một chữ ở dòng dưới. */}
          <dd className="font-display text-[clamp(1.5rem,6.6vw,1.95rem)] leading-tight tracking-[0.12em] text-balance text-wine uppercase">
            {event.venue}
          </dd>
          <dt className="sr-only">Địa chỉ</dt>
          <dd className="mx-auto mt-2 max-w-[17rem] text-[0.78rem] leading-[1.8] text-balance text-ink-soft">
            {event.address}
          </dd>
        </dl>

        <div className="divider my-5">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-petal">
            <path d="M12 21s-8-5.3-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 15.7 12 21 12 21Z" />
          </svg>
        </div>

        {featured ? (
          <DatePlaque event={event} date={date} />
        ) : (
          <dl className="text-center">
            <dt className="sr-only">Thời gian</dt>
            <dd className="lnum font-display text-[1.15rem] leading-tight tracking-[0.06em] text-wine">
              Vào lúc {event.timeLabel}
            </dd>
            <dt className="sr-only">Ngày dương lịch</dt>
            <dd className="lnum mt-1.5 text-[0.82rem] tracking-[0.14em] text-wine/90">
              <span className="sr-only">{date.longDate}</span>
              <span aria-hidden>Ngày {date.dateLine}</span>
            </dd>
            <dt className="sr-only">Ngày âm lịch</dt>
            <dd className="mt-1.5 text-[0.7rem] text-ink-soft italic">({event.lunarLabel})</dd>
          </dl>
        )}

        {event.note ? (
          <p className="mx-auto mt-3 max-w-[19rem] text-center font-script text-lg text-balance text-seal">
            {event.note}
          </p>
        ) : null}

        <div className="mt-6 flex justify-center gap-2">
          <a
            href={mapUrl(event)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blush px-4 py-2 text-[0.58rem] tracking-[0.22em] text-wine uppercase"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Chỉ đường
          </a>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-wine/25 px-4 py-2 text-[0.58rem] tracking-[0.22em] text-wine uppercase"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 11h18" strokeLinecap="round" />
            </svg>
            Lưu lịch
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Tấm khắc ngày của buổi tiệc. Đây là thứ khách phải nhớ ngang với địa điểm —
 * nhất là thiệp nhà gái, nơi tiệc đãi hôm trước còn lễ mới là Chủ Nhật — nên
 * ngày dương lịch được dựng hẳn thành một khối riêng thay cho một dòng chữ
 * nhỏ: thứ nằm trên, số ngày to đứng giữa hai vạch dọc, tháng và năm đứng hai
 * bên. Ngày âm lịch vẫn đi kèm ngay dưới để các bác tra theo lịch nhà.
 *
 * Phần nhìn để `aria-hidden` và kèm một dòng sr-only đọc trọn câu ngày: tách ô
 * ra cho đẹp thì trình đọc màn hình sẽ đọc rời rạc "Tháng 11, 29, 2026".
 */
function DatePlaque({
  event,
  date,
}: {
  event: WeddingEvent;
  date: ReturnType<typeof splitDate>;
}) {
  // "11 giờ · Chủ Nhật" -> "11 giờ". Thứ đã đứng riêng một dòng ngay trên rồi.
  const hour = event.timeLabel.split("·")[0].trim();

  return (
    <dl className="relative overflow-hidden rounded-2xl border border-blush-dark/55 bg-blush-light/70 px-4 py-5 text-center">
      {/* Khung chỉ trắng chìm trong mép — cùng ngôn ngữ với tấm thiệp bọc ngoài,
          để khối ngày trông như được khắc lên giấy chứ không phải dán đè lên. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[5px] rounded-[0.95rem] border border-white/70"
      />

      <dt className="sr-only">Ngày dương lịch</dt>
      <dd className="sr-only">{date.longDate}</dd>

      <div aria-hidden className="relative">
        <p className="flex items-center justify-center gap-2 text-[0.58rem] tracking-[0.3em] text-seal uppercase">
          <span className="h-px w-5 bg-gradient-to-r from-transparent to-blush-dark" />
          {date.weekday}
          <span className="h-px w-5 bg-gradient-to-l from-transparent to-blush-dark" />
        </p>

        {/* Tháng | NGÀY | năm — số ngày in to nhất, hai vạch dọc kẹp hai bên
            đúng kiểu con dấu ngày trên thiệp giấy. Hai cột hai bên chia đều
            nên số ngày luôn nằm chính giữa dù "Tháng 11" dài hơn "2026". */}
        <div className="mt-2.5 grid grid-cols-[1fr_auto_1fr] items-center">
          <p className="text-[0.63rem] tracking-[0.22em] text-ink-soft uppercase">{date.month}</p>
          <p className="lnum border-x border-blush-dark/70 px-4 font-display text-[clamp(2.7rem,13vw,3.5rem)] leading-none font-medium text-wine sm:px-5">
            {date.day}
          </p>
          <p className="lnum text-[0.63rem] tracking-[0.22em] text-ink-soft uppercase">
            {date.year}
          </p>
        </div>
      </div>

      <dt className="sr-only">Thời gian</dt>
      <dd className="lnum relative mt-3.5 font-display text-[1.12rem] leading-tight tracking-[0.06em] text-wine">
        Vào lúc {hour}
      </dd>

      <dt className="sr-only">Ngày âm lịch</dt>
      <dd className="relative mt-1.5 text-[0.7rem] text-ink-soft italic">({event.lunarLabel})</dd>
    </dl>
  );
}

/**
 * Câu dẫn in hoa, hai vạch mảnh kẹp hai bên.
 * Câu để whitespace-nowrap còn hai vạch được phép co: máy hẹp thì vạch ngắn lại
 * chứ câu dẫn không bị bẻ làm đôi.
 */
function Lead({ children }: { children: string }) {
  return (
    <p className="flex items-center justify-center gap-3 text-[0.6rem] tracking-[0.26em] text-ink-soft uppercase">
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-blush-dark" />
      <span className="whitespace-nowrap">{children}</span>
      <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-blush-dark" />
    </p>
  );
}

/**
 * Sợi chỉ nối hai khối đứng kề nhau: vạch - viên thoi - vạch.
 * Dùng mỗi khi hai khối phải đọc liền một mạch (hai nhà -> lời báo tin,
 * câu dẫn -> tên địa điểm) chứ không phải là hai tấm rời nhau.
 */
function Thread({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`mx-auto flex h-11 w-4 flex-col items-center justify-center ${className}`}
    >
      <span className="h-3.5 w-px bg-gradient-to-b from-transparent to-blush-dark" />
      <span className="my-1 h-1.5 w-1.5 rotate-45 border border-blush-dark bg-cream" />
      <span className="h-3.5 w-px bg-gradient-to-t from-transparent to-blush-dark" />
    </div>
  );
}
