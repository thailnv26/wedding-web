/**
 * Cắt + nén ảnh dấu sáp "T&M" rồi sinh luôn bộ icon của thiệp.
 *
 * Ảnh gốc:  photos-goc/badge.png   (1254x1254, ~1.5MB, nền trong suốt)
 *
 * Ra bốn file:
 *   public/images/badge.png   dấu sáp dùng trong trang (cổng hoa + cuối thiệp)
 *   app/icon.png              icon trên tab trình duyệt
 *   app/apple-icon.png        icon khi khách lưu thiệp ra màn hình chính iPhone
 *   app/favicon.ico           cho trình duyệt cũ, gói sẵn ba cỡ 16/32/48
 *
 * Chạy lại bằng:  npm run icon
 *
 * Next tự nhặt icon.png / apple-icon.png / favicon.ico trong app/ rồi chèn thẻ
 * <link> vào <head>, không phải khai báo thêm ở đâu cả.
 *
 * Ảnh gốc thừa một vành trong suốt quanh cục sáp. Phải cắt sát (`trim`) trước khi
 * thu nhỏ, nếu không ở cỡ 16px cục sáp chỉ còn vài chấm mờ giữa khung.
 */
import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "app");

const SRC = path.join(root, "photos-goc", "badge.png");
/** Ảnh dùng trong trang. Dấu sáp hiện ~58px, để 232px cho màn hình 4x vẫn nét. */
const WEB_SIZE = 232;
/** Nền kem lấy từ app/globals.css — iOS không hiểu nền trong suốt, để trống ra nền đen. */
const CREAM = "#fdf7f4";

/**
 * Cục sáp đã cắt sát, nằm gọn trong khung vuông.
 *
 * `trim` cắt theo độ trong suốt nên ra khung chữ nhật lệch; `contain` lồng lại vào
 * khung vuông để dấu sáp không bị méo, chừa 4% mép cho bóng đổ không bị cụt.
 */
async function seal(size, { background = null } = {}) {
  const pad = Math.round(size * 0.04);
  // Nền của phần chừa mép, và cũng là nền dán dưới cục sáp khi có yêu cầu nền đặc.
  const fill = background ?? { r: 0, g: 0, b: 0, alpha: 0 };

  let img = sharp(SRC)
    .trim({ threshold: 12 })
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: fill })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: fill });

  // Chỉ gọi khi thật sự cần nền: `flatten(false)` KHÔNG tắt được lệnh, sharp vẫn
  // dán ảnh lên nền đen và dấu sáp ra một ô vuông đen.
  //
  // `resize` và `extend` ở trên cũng phải dùng đúng `fill` này, không được để
  // trong suốt: sharp chạy `flatten` TRƯỚC `extend` bất kể gọi theo thứ tự nào,
  // nên mép chừa bằng màu trong suốt sẽ mọc lại kênh alpha sau khi đã dán nền.
  if (background) img = img.flatten({ background });

  return img.png({ compressionLevel: 9 }).toBuffer();
}

/** Gói vài ảnh PNG vuông thành một file .ico — trình duyệt tự chọn cỡ hợp nhất. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); //               reserved
  header.writeUInt16LE(1, 2); //               1 = icon
  header.writeUInt16LE(images.length, 4); //   số ảnh trong file

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); //  rộng (0 nghĩa là 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); //  cao
    entry.writeUInt8(0, 2); //                      số màu bảng màu, 0 = ảnh thật
    entry.writeUInt8(0, 3); //                      reserved
    entry.writeUInt16LE(1, 4); //                   color planes
    entry.writeUInt16LE(32, 6); //                  bit mỗi pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

await fs.writeFile(path.join(root, "public", "images", "badge.png"), await seal(WEB_SIZE));

await fs.writeFile(path.join(appDir, "icon.png"), await seal(96));

// iOS tự bo góc icon rồi, nên bản này để nền kem tràn viền.
await fs.writeFile(path.join(appDir, "apple-icon.png"), await seal(180, { background: CREAM }));

await fs.writeFile(
  path.join(appDir, "favicon.ico"),
  buildIco(
    await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await seal(size) }))),
  ),
);

console.log("icon: public/images/badge.png + app/icon.png + app/apple-icon.png + app/favicon.ico");
