"use client";

import { useEffect, useRef, useState } from "react";
import { config } from "@/data/config";

/**
 * Nhạc nền. Bắt đầu phát đúng lúc khách chạm mở phong bì (`start` chuyển sang true)
 * vì trình duyệt chỉ cho phát tiếng sau một thao tác của người dùng.
 * Nếu file mp3 chưa có thì nút tự ẩn đi, không báo lỗi cho khách.
 */
export function MusicPlayer({ start }: { start: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = config.music.volume;
  }, []);

  useEffect(() => {
    if (!start || !config.music.autoPlayOnOpen) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)); // trình duyệt chặn thì khách bấm nút là được
  }, [start]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setAvailable(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={config.music.src}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      {available && start ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
          aria-pressed={playing}
          className="fixed top-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-blush-dark/50 bg-cream/85 text-wine shadow-[0_6px_18px_-8px_rgba(156,80,92,0.7)] backdrop-blur"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={playing ? "animate-[spin_5s_linear_infinite]" : ""}
          >
            <path d="M9 18V6l10-2v12" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
          </svg>
          {!playing ? (
            <span className="absolute h-[1.6rem] w-px rotate-45 bg-wine/70" aria-hidden />
          ) : null}
        </button>
      ) : null}
    </>
  );
}
