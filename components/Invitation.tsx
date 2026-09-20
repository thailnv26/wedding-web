"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SideKey } from "@/data/config";
import { BottomNav } from "@/components/BottomNav";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Gate } from "@/components/Gate";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Gift } from "@/components/Gift";
import { Hero } from "@/components/Hero";
import { MusicPlayer } from "@/components/MusicPlayer";
import { OurStory } from "@/components/OurStory";
import { Petals } from "@/components/Petals";
import { Rsvp } from "@/components/Rsvp";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useGuestName } from "@/lib/guest";
import { useReveal } from "@/lib/useReveal";
import { resolveSide } from "@/lib/side";

/** Khớp với `delay-[1000ms]` của lớp phủ trong Gate — lúc cổng bắt đầu tan. */
const CURTAIN_MS = 1000;

/**
 * Toàn bộ tấm thiệp. `sideKey` quyết định đây là thiệp nhà gái hay nhà trai;
 * mọi phần khác nhau giữa hai bên đều đi qua object `side`.
 */
export function Invitation({ sideKey }: { sideKey: SideKey }) {
  const side = useMemo(() => resolveSide(sideKey), [sideKey]);
  const guestName = useGuestName();
  const [opened, setOpened] = useState(false);
  const [curtainUp, setCurtainUp] = useState(false);
  const handleOpen = useCallback(() => setOpened(true), []);

  // Cánh cổng mất 1s mới bắt đầu tan. Bật hiệu ứng hiện sớm hơn thì màn ảnh bìa
  // trồi lên xong xuôi sau lưng cổng, khách mở ra chỉ thấy một trang đứng yên.
  // Chờ đúng lúc cổng bắt đầu mờ đi rồi mới thả -> ảnh bìa hiện ra ngay trước mắt.
  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(() => setCurtainUp(true), CURTAIN_MS);
    return () => clearTimeout(t);
  }, [opened]);

  useReveal(curtainUp);

  return (
    <>
      <Petals />
      <MusicPlayer start={opened} />
      <Gate side={side} guestName={guestName} onOpen={handleOpen} />

      <main className="relative mx-auto max-w-[480px]">
        <Hero side={side} />
        <Countdown side={side} />
        <Details side={side} guestName={guestName} />
        <OurStory />
        <Gallery />
        <Rsvp side={side} guestName={guestName} />
        <Gift side={side} />
        <Footer side={side} />
      </main>

      <ScrollToTop visible={opened} />
      <BottomNav visible={opened} />
    </>
  );
}
