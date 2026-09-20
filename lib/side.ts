import type { Metadata } from "next";
import { config, type Family, type Person, type Side, type SideKey, type WeddingEvent } from "@/data/config";
import { splitDate } from "./date";
import { pageMetadata } from "./metadata";

/** Thứ tự này cũng là thứ tự route được sinh ra lúc build. */
export const SIDE_KEYS = ["nha-gai", "nha-trai"] as const;

export function isSideKey(value: string): value is SideKey {
  return (SIDE_KEYS as readonly string[]).includes(value);
}

export type ResolvedSide = Side & {
  /** Nhà đứng tên mời, luôn hiện trước trên thiệp. */
  hostFamily: Family;
  /** Nhà thông gia, hiện sau. */
  otherFamily: Family;
  /** Con của nhà đứng tên mời. */
  hostPerson: Person;
  otherPerson: Person;
  /** Hai nhà theo đúng thứ tự in trên thiệp. */
  families: [Family, Family];
  /** Cô dâu chú rể theo đúng thứ tự in trên thiệp. */
  people: [Person, Person];
  /** Buổi tiệc khách được mời — mốc cho đồng hồ đếm ngược. */
  mainEvent: WeddingEvent;
  /** Hai tên ngắn ở trang bìa, nhà đứng tên mời trước. */
  headline: [string, string];
  /** "28 . 11 . 2026" */
  dateLine: string;
  /** Số điện thoại, người bên nhà đứng tên mời đứng trước. */
  contacts: [{ label: string; phone: string }, { label: string; phone: string }];
};

/**
 * Gom toàn bộ khác biệt giữa thiệp nhà gái và thiệp nhà trai về một chỗ,
 * để các component chỉ việc đọc chứ không phải tự đoán bên nào.
 */
export function resolveSide(key: SideKey): ResolvedSide {
  const side = config.sides[key];
  const brideHosts = side.host === "bride";

  const hostFamily = brideHosts ? config.brideFamily : config.groomFamily;
  const otherFamily = brideHosts ? config.groomFamily : config.brideFamily;
  const hostPerson = brideHosts ? config.bride : config.groom;
  const otherPerson = brideHosts ? config.groom : config.bride;

  const mainEvent =
    side.events.find((event) => event.id === side.mainEventId) ??
    side.events[side.events.length - 1];

  const brideContact = { label: config.bride.role, phone: config.contact.bridePhone };
  const groomContact = { label: config.groom.role, phone: config.contact.groomPhone };

  return {
    ...side,
    hostFamily,
    otherFamily,
    hostPerson,
    otherPerson,
    families: [hostFamily, otherFamily],
    people: [hostPerson, otherPerson],
    mainEvent,
    headline: [hostPerson.shortName, otherPerson.shortName],
    dateLine: splitDate(mainEvent.datetime).dateLine,
    contacts: brideHosts ? [brideContact, groomContact] : [groomContact, brideContact],
  };
}

/**
 * Thẻ <title> + thẻ preview riêng cho từng phiên bản thiệp: khách nhà gái dán link
 * đi thì hiện "Lễ Vu Quy", khách nhà trai hiện "Lễ Tân Hôn". Ảnh preview thì hai
 * bên dùng chung một tấm.
 */
export function sideMetadata(key: SideKey): Metadata {
  const side = resolveSide(key);
  return pageMetadata({
    title: `Lễ ${titleCase(side.ceremony)} · ${side.headline[0]} & ${side.headline[1]}`,
    description: `${side.hostFamily.label} trân trọng kính mời bạn đến dự ${side.mainEvent.venue} ngày ${side.dateLine}.`,
    path: `/${key}/`,
  });
}

/** "VU QUY" -> "Vu Quy" */
function titleCase(text: string): string {
  return text
    .toLocaleLowerCase("vi-VN")
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("vi-VN") + word.slice(1))
    .join(" ");
}
