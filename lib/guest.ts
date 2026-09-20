"use client";

import { useMemo, useSyncExternalStore } from "react";
import { config } from "@/data/config";

/** Query string chỉ đọc một lần, không đổi trong suốt phiên xem thiệp. */
const subscribe = () => () => {};
const getSearch = () => window.location.search;
const getServerSearch = () => "";

/**
 * Đọc tên khách mời từ query string: /?to=Anh%20Nam
 * Hỗ trợ cả ?to= và ?guest= cho tiện.
 * Trả về tên mặc định trong config nếu link không có tham số.
 */
export function useGuestName(): string {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);

  return useMemo(() => {
    const raw = new URLSearchParams(search).get("to") ?? new URLSearchParams(search).get("guest");
    const clean = raw?.trim().replace(/\s+/g, " ").slice(0, 60);
    return clean || config.guest.fallback;
  }, [search]);
}
