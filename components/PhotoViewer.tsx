"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Một tấm ảnh xem phóng to được. `width`/`height` chỉ để giữ đúng khung ảnh —
 * khung xem để `w-auto h-auto` nên ảnh luôn hiện theo số đo thật của file, hai
 * số này chỉ cần đúng TỈ LỆ là đủ.
 */
export type ViewerPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

/** Vuốt ngang quá ngần này (px) thì tính là lật ảnh, dưới ngưỡng coi như chạm hụt. */
const SWIPE_THRESHOLD = 48;

type OpenViewer = (photos: ViewerPhoto[], index?: number) => void;

const PhotoViewerContext = createContext<OpenViewer | null>(null);

/**
 * Mở khung xem ảnh phóng to. Đưa vào cả bộ ảnh + vị trí tấm được bấm: bộ có
 * nhiều tấm thì khách lật qua lại được, bộ một tấm thì khung chỉ hiện tấm đó.
 */
export function usePhotoViewer(): OpenViewer {
  const open = useContext(PhotoViewerContext);
  if (!open) throw new Error("usePhotoViewer phải nằm trong <PhotoViewerProvider>");
  return open;
}

type Viewing = { photos: ViewerPhoto[]; index: number };

/** Lật `delta` tấm, chạy hết bộ ảnh thì vòng lại từ đầu. */
function stepIndex(current: number, delta: number, total: number) {
  return (current + delta + total) % total;
}

/**
 * Giữ khung xem ảnh phóng to cho cả tấm thiệp — mọi ảnh trong trang đều bấm mở
 * được qua `usePhotoViewer()`.
 *
 * Khung xem nằm ở đây, ngoài mọi khu vực của thiệp, chứ không nằm trong từng
 * component: mấy khu vực đó có `transform` (hiệu ứng hiện dần, ảnh nghiêng) mà
 * phần tử có transform lại thành khung chứa cho `position: fixed` bên trong —
 * khung xem sẽ không phủ kín màn hình nữa.
 */
export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const [viewing, setViewing] = useState<Viewing | null>(null);

  const open = useCallback<OpenViewer>((photos, index = 0) => {
    if (photos.length > 0) setViewing({ photos, index });
  }, []);

  const close = useCallback(() => setViewing(null), []);

  const step = useCallback((delta: number) => {
    setViewing((v) =>
      v ? { ...v, index: stepIndex(v.index, delta, v.photos.length) } : v,
    );
  }, []);

  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      {viewing ? (
        <Lightbox photos={viewing.photos} index={viewing.index} onClose={close} onStep={step} />
      ) : null}
    </PhotoViewerContext.Provider>
  );
}

/**
 * Lớp phủ mờ dùng chung cho mọi ảnh bấm mở được: phủ nhẹ màu rượu + kính lúp,
 * để khách biết tấm ảnh này chạm vào được.
 *
 * Hiện khi rê chuột hoặc khi bàn phím nhảy tới, nên phải nằm trong một phần tử
 * mang class `group`. z-10 để đứng trên lớp kem và vệt sáng của `.photo-sheen`.
 */
export function ZoomHint() {
  return (
    <span className="absolute inset-0 z-10 flex items-center justify-center bg-wine/25 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="translate-y-1.5 text-cream transition-transform duration-300 ease-out group-hover:translate-y-0"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="M15.9 15.9 20.5 20.5M11 8.4v5.2M8.4 11h5.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Khung xem ảnh phóng to — lật được cả bộ ảnh.
 *
 * Ảnh giữ nguyên khung gốc chứ không ép về 4:5: mấy tấm chụp ngang mà ép dọc
 * thì cụt mất hai bên. `max-h` theo vh để ảnh dọc không tràn khỏi màn hình
 * điện thoại.
 *
 * Component này chỉ tồn tại khi đang mở ảnh, nên phím tắt và khoá cuộn gắn thẳng
 * vào vòng đời của nó. Bộ chỉ có một tấm thì bỏ hết phần lật ảnh: không mũi tên,
 * không số đếm, vuốt ngang cũng không làm gì.
 */
function Lightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: ViewerPhoto[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const photo = photos[index];
  const many = photos.length > 1;
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!many) return;
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [many, onClose, onStep]);

  // Khoá cuộn nền khi đang xem ảnh — không thì vuốt ảnh trên điện thoại sẽ kéo
  // luôn cả trang phía sau.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (many && Math.abs(dx) > SWIPE_THRESHOLD) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="flex w-full max-w-[460px] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority
          className="h-auto max-h-[72vh] w-auto max-w-full rounded-lg object-contain"
        />

        {many ? (
          <div className="mt-4 flex w-full items-center justify-between text-cream">
            <NavButton label="Ảnh trước" onClick={() => onStep(-1)} rotate />
            <span className="text-xs tracking-[0.3em]">
              {index + 1} / {photos.length}
            </span>
            <NavButton label="Ảnh sau" onClick={() => onStep(1)} />
          </div>
        ) : null}
      </div>

      {/* Tải sẵn tấm liền trước và liền sau để lật ảnh không phải chờ.
          `loading="eager"` là bắt buộc: khung này 0x0 nên ảnh để lazy sẽ không
          bao giờ lọt vào tầm nhìn, tức là không bao giờ tải. */}
      {many ? (
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
          {[-1, 1].map((delta) => {
            const near = photos[stepIndex(index, delta, photos.length)];
            return (
              <Image key={near.src} src={near.src} alt="" width={16} height={16} loading="eager" />
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-5 left-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-wine"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  rotate = false,
}: {
  label: string;
  onClick: () => void;
  rotate?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/40 transition-colors duration-200 hover:bg-cream/15"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={rotate ? "rotate-180" : ""}
      >
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
