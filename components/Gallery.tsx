"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { album } from "@/data/album";
import { config } from "@/data/config";
import { SectionHeading } from "./SectionHeading";
import { ZoomHint, usePhotoViewer, type ViewerPhoto } from "./PhotoViewer";

/**
 * Cả album cho khung xem phóng to: bản `src` giữ nguyên khung ảnh gốc, không
 * phải bản `thumb` đã cắt 4:5 của lưới ảnh.
 */
const albumPhotos: ViewerPhoto[] = album.map((photo, i) => ({
  src: photo.src,
  width: photo.width,
  height: photo.height,
  alt: `Ảnh cưới ${i + 1}`,
}));

export function Gallery() {
  const preview = album.slice(0, config.gallery.previewCount);
  const openViewer = usePhotoViewer();

  return (
    // .reveal nằm ở từng tấm ảnh chứ không ở khối bọc, để ảnh hiện lần lượt khi
    // khách cuộn tới.
    //
    // Không còn là section riêng có id="album": album nằm gọn trong "Chuyện
    // tình" (xem OurStory.tsx) để thanh nav dưới màn hình bớt được một nút —
    // sáu nút thì nhãn "Chuyện tình" bị xuống dòng trên máy màn hẹp.
    // Padding ngang do section cha lo, ở đây chỉ cần khoảng cách phía trên.
    <div className="mt-14">
      <SectionHeading
        overline="Một vài khoảnh khắc"
        script="Album"
        title="Ảnh Cưới"
        className="reveal"
      />

      <div className="mt-8 grid grid-cols-2 gap-3">
        {preview.map((photo, i) => {
          const tilt = i % 2 === 0 ? -2 : 2;

          return (
            // Lớp .reveal bọc ngoài nút: gắn thẳng lên nút sẽ đè mất transition
            // của Tailwind, làm hiệu ứng nhấc ảnh khi rê chuột giật cục.
            //
            // --reveal-spin cùng dấu với --tilt: tấm nghiêng trái thì nghiêng
            // quá tay sang trái rồi lắc về, tấm nghiêng phải thì ngược lại — cả
            // lưới ảnh xoè ra như một xấp hình vừa được rải lên bàn.
            <div
              key={photo.src}
              className="reveal reveal-zoom"
              style={{ "--reveal-spin": `${tilt * 3.5}deg` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => openViewer(albumPhotos, i)}
                aria-label={`Xem ảnh ${i + 1}`}
                className="group w-full cursor-pointer rotate-[var(--tilt)] bg-white p-2 pb-3 shadow-[0_0_0_1px_rgba(156,80,92,0.13),0_12px_28px_-14px_rgba(156,80,92,0.7)] transition-[rotate,translate,scale,box-shadow] duration-500 ease-out hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(156,80,92,0.22),0_22px_44px_-16px_rgba(156,80,92,0.85)] focus-visible:rotate-0 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush-dark active:scale-95"
                style={{ "--tilt": `${tilt}deg` } as CSSProperties}
              >
                <span className="photo-sheen relative block aspect-[4/5] overflow-hidden bg-blush-light">
                  <Image
                    src={photo.thumb}
                    alt={`Ảnh cưới ${i + 1}`}
                    fill
                    sizes="45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  />
                  <ZoomHint />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Lưới chỉ bày vài tấm; cả album nằm trong khung xem phóng to. */}
      {album.length > preview.length ? (
        <div className="reveal mt-7 text-center">
          <button
            type="button"
            onClick={() => openViewer(albumPhotos, 0)}
            className="cursor-pointer rounded-full border border-blush-dark/60 bg-white/70 px-6 py-2.5 text-[0.62rem] tracking-[0.3em] text-wine uppercase transition-colors duration-300 ease-out hover:bg-blush-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-dark"
          >
            Xem cả {album.length} tấm
          </button>
        </div>
      ) : null}
    </div>
  );
}
