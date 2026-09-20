/**
 * Cắt + nén ảnh cưới cho web.
 *
 * Ảnh gốc từ thợ chụp rất nặng (4024x6048, 2-6MB mỗi tấm). Site này build bằng
 * `output: "export"` + `images.unoptimized`, nghĩa là Next KHÔNG tự nén ảnh —
 * trình duyệt tải đúng file trong public/. Nên ảnh phải được cắt sẵn đúng tỉ lệ
 * và nén sẵn ở đây.
 *
 * Script làm hai việc:
 *   A. PICKS  -> vài tấm ảnh "cố định" của thiệp (bìa, chuyện chúng mình, ảnh share)
 *                cắt đúng tỉ lệ từng khung.
 *   B. ALBUM  -> toàn bộ ảnh cưới cho mục Album. Giữ nguyên khung ảnh gốc (không
 *                cắt), chỉ thu nhỏ + nén. Mỗi tấm ra 2 bản: bản `-thumb` cho lưới
 *                ngoài trang, bản đầy đủ cho khung xem phóng to.
 *                Kèm theo là data/album.ts (script tự sinh, không sửa tay).
 *
 * Cách dùng:
 *   1. Để ảnh gốc trong  photos-goc/
 *   2. Sửa bảng PICKS / ALBUM bên dưới
 *   3. npm run anh
 *
 * `focus` = neo điểm nhìn khi cắt, 0 = sát mép trên/trái, 1 = sát mép dưới/phải.
 * Ảnh dọc cắt sang khung thấp hơn thì bị hụt chiều cao -> giảm focus để giữ mặt.
 *
 * `zoom` = cắt sát vào thêm cho người to lên trong khung. 1 = giữ nguyên,
 * 1.4 = lấy khoảng 70% khung rồi phóng lại cho đầy. Ảnh gốc 4024x6048 nên còn
 * thừa rất nhiều điểm ảnh, zoom tới ~1.6 vẫn chưa hụt nét.
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "photos-goc");
const OUT_DIR = path.join(root, "public", "images");

/** Khung ảnh dùng trong giao diện — phải khớp tỉ lệ của component. */
const FRAME = {
  polaroid: { w: 900, h: 1125 }, // Polaroid 4/5 (Hero, Chuyện chúng mình)
  square: { w: 640, h: 640 }, //  Polaroid 1/1 (ảnh nhỏ nghiêng bên cạnh)
  portrait: { w: 800, h: 1000 }, // Ảnh cô dâu / chú rể 4/5
  og: { w: 1200, h: 630 }, //     Ảnh preview khi gửi link Zalo/Messenger
};

/** Album: bản đầy đủ thu theo cạnh dài, bản thumb cắt 4:5 cho lưới ảnh đều nhau. */
const ALBUM_FULL_EDGE = 1300; // cạnh dài — khung xem phóng to rộng nhất ~420px CSS
const ALBUM_THUMB = { w: 600, h: 750 };

const PICKS = [
  // --- Trang bìa -------------------------------------------------------
  { src: "NTK_3927", out: "hero", frame: "polaroid", focus: 0.08 },
  { src: "NTK_4804", out: "hero-2", frame: "square", focus: 0.08 },

  // --- Chuyện chúng mình ----------------------------------------------
  { src: "NTK_3013", out: "story-1", frame: "polaroid", focus: 0.05 },
  { src: "NTK_4876", out: "story-2", frame: "square", focus: 0.2 },
  { src: "NTK_4342", out: "story-3", frame: "square", focus: 0.16 },

  // --- Cô dâu / chú rể --------------------------------------------------
  { src: "NTK_4064", out: "groom", frame: "portrait", focus: 0.12, zoom: 1.35 },
  { src: "NTK_4005", out: "bride", frame: "portrait", focus: 0.16, zoom: 1.45 },

  // --- Ảnh preview khi share link --------------------------------------
  // JPEG chứ không WebP: Zalo/Messenger/Facebook đọc JPEG chắc ăn nhất.
  { src: "NTK_4412", out: "og-cover", frame: "og", focus: 0.14, format: "jpeg" },
];

/**
 * Thứ tự ảnh trong album. `previewCount` tấm đầu là những tấm hiện sẵn ngoài
 * lưới ảnh (xem data/config.ts) — nên để 6 tấm đẹp nhất lên đầu. Phần còn lại
 * xếp theo từng buổi chụp cho khách lướt xem đỡ nhảy cóc.
 *
 * Thêm / bớt / đổi thứ tự ở đây rồi chạy lại `npm run anh` là xong.
 */
const ALBUM = [
  // 6 tấm hiện sẵn ngoài lưới
  "NTK_3939", "NTK_3110", "NTK_4412", "NTK_4138", "NTK_4607", "NTK_5164",

  // Ngoài vườn — vest trắng, hoa vàng
  "NTK_2982", "NTK_3013", "NTK_3172", "NTK_3328", "NTK_3352",
  "NTK_3374", "NTK_3509", "NTK_3532", "NTK_3537", "NTK_3779",

  // Phông trắng — vest trắng, hoa rum
  "NTK_3890", "NTK_3901", "NTK_3927", "NTK_3986",

  // Áo dài truyền thống — phông đỏ chữ Hỷ
  "NTK_4005", "NTK_4064", "NTK_4186", "NTK_4252", "NTK_4342",

  // Phông đỏ — vest đen, váy satin
  "NTK_4472", "NTK_4478", "NTK_4555", "NTK_4591",
  "NTK_4746", "NTK_4761", "NTK_4781",

  // Sảnh vàng — đèn chùm, voan, nến
  "NTK_4804", "NTK_4851", "NTK_4876", "NTK_5079", "NTK_5181",
];

/**
 * Cắt ảnh về đúng tỉ lệ khung, neo theo `focus` thay vì luôn lấy chính giữa.
 * Giữ nguyên cạnh ngắn, chỉ cắt bớt cạnh dài -> không bao giờ phóng to ảnh gốc.
 */
function cropBox(srcW, srcH, targetW, targetH, focus, zoom = 1) {
  const target = targetW / targetH;
  let width, height;
  if (srcW / srcH > target) {
    height = Math.round(srcH / zoom);
    width = Math.round(height * target);
  } else {
    width = Math.round(srcW / zoom);
    height = Math.round(width / target);
  }
  // Cạnh nào còn dư thì neo theo `focus`, cạnh nào vừa khít thì canh giữa.
  const spareX = srcW - width;
  const spareY = srcH - height;
  return {
    width,
    height,
    left: Math.round(spareX * (srcW / srcH > target || zoom > 1 ? focus : 0.5)),
    top: Math.round(spareY * (srcW / srcH > target && zoom === 1 ? 0.5 : focus)),
  };
}

/**
 * Ảnh gốc không nằm trong repo (nặng ~142MB). Thiếu thì báo cho rõ chỗ chép về,
 * chứ để readdir quăng ENOENT ra thì đọc không hiểu gì.
 */
async function listSources() {
  try {
    return await readdir(SRC_DIR);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    throw new Error(
      "Chưa có thư mục photos-goc/ — đây là kho ảnh gốc, không nằm trong repo.\n" +
        "Chép ảnh gốc về rồi chạy lại:\n\n" +
        "  mkdir -p photos-goc\n" +
        "  cp ~/Downloads/Edited/*.JPG photos-goc/\n\n" +
        "(Ảnh .webp đang dùng trên thiệp vẫn còn nguyên trong public/images/,\n" +
        " chỉ khi muốn đổi ảnh mới cần bước này.)",
    );
  }
}

async function findSource(name) {
  const files = await listSources();
  const hit = files.find((f) => path.parse(f).name.toLowerCase() === name.toLowerCase());
  if (!hit) throw new Error(`Không tìm thấy ảnh gốc "${name}" trong photos-goc/`);
  return path.join(SRC_DIR, hit);
}

await mkdir(OUT_DIR, { recursive: true });

for (const pick of PICKS) {
  const { w, h } = FRAME[pick.frame];
  const file = await findSource(pick.src);
  const image = sharp(file).rotate(); // .rotate() = tôn trọng hướng xoay trong EXIF
  const meta = await image.metadata();
  const box = cropBox(meta.width, meta.height, w, h, pick.focus, pick.zoom);
  const format = pick.format ?? "webp";
  const outPath = path.join(OUT_DIR, `${pick.out}.${format === "jpeg" ? "jpg" : format}`);

  const pipeline = image.extract(box).resize(w, h);
  await (format === "jpeg"
    ? pipeline.jpeg({ quality: 86, mozjpeg: true })
    : pipeline.webp({ quality: 82 })
  ).toFile(outPath);

  console.log(`${pick.src} -> ${path.relative(root, outPath)}  (${w}x${h})`);
}

/* ---------------- Album ---------------- */

const ALBUM_DIR = path.join(OUT_DIR, "album");

// Tìm đủ ảnh gốc TRƯỚC khi dọn thư mục. Dọn trước rồi mới phát hiện thiếu một
// tấm thì album nằm dở dang, thiệp mất ảnh — mà ảnh cũ thì đã xoá mất rồi.
const albumSources = [];
for (const name of ALBUM) albumSources.push(await findSource(name));

// Xoá sạch rồi sinh lại: bỏ bớt ảnh thì album đánh số lại từ đầu, không dọn thì
// mấy file cuối của lần chạy trước còn nằm đó và vẫn bị đẩy lên host.
await rm(ALBUM_DIR, { recursive: true, force: true });
await mkdir(ALBUM_DIR, { recursive: true });

const manifest = [];

for (const [i, file] of albumSources.entries()) {
  const id = String(i + 1).padStart(2, "0");
  const meta = await sharp(file).rotate().metadata();

  // Bản đầy đủ: giữ nguyên khung ảnh gốc (ảnh ngang vẫn ngang), chỉ thu cạnh dài.
  const scale = Math.min(1, ALBUM_FULL_EDGE / Math.max(meta.width, meta.height));
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);
  await sharp(file).rotate().resize(width, height).webp({ quality: 80 })
    .toFile(path.join(ALBUM_DIR, `${id}.webp`));

  // Bản thumb: cắt 4:5 cho lưới ảnh ngoài trang thẳng hàng.
  const box = cropBox(meta.width, meta.height, ALBUM_THUMB.w, ALBUM_THUMB.h, 0.22);
  await sharp(file).rotate().extract(box).resize(ALBUM_THUMB.w, ALBUM_THUMB.h)
    .webp({ quality: 78 })
    .toFile(path.join(ALBUM_DIR, `${id}-thumb.webp`));

  manifest.push({ id, width, height });
}

// data/album.ts — Gallery.tsx đọc file này. Có sẵn width/height nên khung xem
// phóng to hiện đúng khung ảnh gốc, ảnh ngang không bị cắt cụt hai bên.
const ts = `// ⚠️ File này do scripts/optimize-photos.mjs sinh ra — đừng sửa tay.
// Muốn đổi ảnh hoặc thứ tự: sửa bảng ALBUM trong script rồi chạy \`npm run anh\`.

export type AlbumPhoto = {
  /** Ảnh đầy đủ, giữ nguyên khung gốc — dùng cho khung xem phóng to */
  src: string;
  /** Ảnh cắt 4:5 — dùng cho lưới ảnh ngoài trang */
  thumb: string;
  width: number;
  height: number;
};

export const album: AlbumPhoto[] = [
${manifest
  .map(
    (m) =>
      `  { src: "/images/album/${m.id}.webp", thumb: "/images/album/${m.id}-thumb.webp", width: ${m.width}, height: ${m.height} },`,
  )
  .join("\n")}
];
`;

await writeFile(path.join(root, "data", "album.ts"), ts, "utf8");
console.log(`album: ${manifest.length} ảnh -> public/images/album/ + data/album.ts`);
