// ⚠️ File này do scripts/optimize-photos.mjs sinh ra — đừng sửa tay.
// Muốn đổi ảnh hoặc thứ tự: sửa bảng ALBUM trong script rồi chạy `npm run anh`.

export type AlbumPhoto = {
  /** Ảnh đầy đủ, giữ nguyên khung gốc — dùng cho khung xem phóng to */
  src: string;
  /** Ảnh cắt 4:5 — dùng cho lưới ảnh ngoài trang */
  thumb: string;
  width: number;
  height: number;
};

export const album: AlbumPhoto[] = [
  { src: "/images/album/01.webp", thumb: "/images/album/01-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/02.webp", thumb: "/images/album/02-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/03.webp", thumb: "/images/album/03-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/04.webp", thumb: "/images/album/04-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/05.webp", thumb: "/images/album/05-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/06.webp", thumb: "/images/album/06-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/07.webp", thumb: "/images/album/07-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/08.webp", thumb: "/images/album/08-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/09.webp", thumb: "/images/album/09-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/10.webp", thumb: "/images/album/10-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/11.webp", thumb: "/images/album/11-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/12.webp", thumb: "/images/album/12-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/13.webp", thumb: "/images/album/13-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/14.webp", thumb: "/images/album/14-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/15.webp", thumb: "/images/album/15-thumb.webp", width: 1300, height: 865 },
  { src: "/images/album/16.webp", thumb: "/images/album/16-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/17.webp", thumb: "/images/album/17-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/18.webp", thumb: "/images/album/18-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/19.webp", thumb: "/images/album/19-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/20.webp", thumb: "/images/album/20-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/21.webp", thumb: "/images/album/21-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/22.webp", thumb: "/images/album/22-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/23.webp", thumb: "/images/album/23-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/24.webp", thumb: "/images/album/24-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/25.webp", thumb: "/images/album/25-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/26.webp", thumb: "/images/album/26-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/27.webp", thumb: "/images/album/27-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/28.webp", thumb: "/images/album/28-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/29.webp", thumb: "/images/album/29-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/30.webp", thumb: "/images/album/30-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/31.webp", thumb: "/images/album/31-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/32.webp", thumb: "/images/album/32-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/33.webp", thumb: "/images/album/33-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/34.webp", thumb: "/images/album/34-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/35.webp", thumb: "/images/album/35-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/36.webp", thumb: "/images/album/36-thumb.webp", width: 865, height: 1300 },
  { src: "/images/album/37.webp", thumb: "/images/album/37-thumb.webp", width: 865, height: 1300 },
];
