# Thiệp cưới online

Thiệp cưới mobile-first của **Lữ Ngọc Vĩnh Thái & Lê Ngọc Minh**: chạm mở cổng hoa có
dấu niêm phong sáp, nhạc nền, tên khách mời riêng cho từng link, chuyện tình, thông tin hai
bên gia đình, lịch các buổi lễ, album ảnh, form xác nhận tham dự và hộp mừng cưới bằng
mã QR.

Thiệp có **hai phiên bản**, chọn bằng đường link:

| Link | Thiệp | Lễ | Nhà đứng trước |
| --- | --- | --- | --- |
| `/nha-gai/` | Thiệp nhà gái | VU QUY | NHÀ GÁI |
| `/nha-trai/` | Thiệp nhà trai | TÂN HÔN | NHÀ TRAI |

Mỗi bên có tên lễ, thứ tự hai họ, thứ tự tên trên trang bìa, địa điểm, giờ giấc, ngày
âm lịch, số điện thoại liên hệ và tài khoản mừng cưới riêng. Link không có tiền tố nào
(`/`) thì hiện phiên bản khai báo ở `defaultSide` trong `data/config.ts`.

Next.js 16 + Tailwind 4, xuất ra HTML tĩnh nên deploy ở đâu cũng được.

---

## 1. Chạy thử

```bash
npm install
npm run dev     # http://localhost:3000
```

Xem thử:

- Thiệp nhà gái: <http://localhost:3000/nha-gai/?to=Anh%20Nam>
- Thiệp nhà trai: <http://localhost:3000/nha-trai/?to=Anh%20Nam>

## 2. Sửa nội dung thiệp

**Toàn bộ chữ nghĩa nằm trong một file duy nhất: [`data/config.ts`](data/config.ts).**
Không cần đụng vào code giao diện.

| Mục trong file | Sửa cái gì |
| --- | --- |
| `site` | Tiêu đề, mô tả, domain sau khi deploy |
| `defaultSide` | Phiên bản hiện khi khách vào thẳng tên miền |
| `couple` | Hashtag chung |
| `groom` / `bride` | Tên, vai, thứ bậc (Trưởng nữ / Quý nam), ảnh, lời giới thiệu |
| `groomFamily` / `brideFamily` | Ông, bà và địa chỉ mỗi bên |
| `sides["nha-gai"]` | Riêng thiệp nhà gái: tên lễ, chữ lồng, lịch lễ + tiệc, tài khoản mừng cưới |
| `sides["nha-trai"]` | Riêng thiệp nhà trai, cùng cấu trúc như trên |
| `story` | Chuyện tình, ảnh kỷ niệm |
| `gallery` | Album ảnh |
| `music` | Đường dẫn file nhạc, âm lượng |
| `gift` | Tiêu đề + lời dẫn hộp mừng cưới (QR và số tài khoản nằm trong từng `sides`) |
| `rsvp` | Lời mời xác nhận, hạn chót, link Google Apps Script |
| `contact` | Số điện thoại cô dâu chú rể |

`events[].datetime` phải viết đủ múi giờ Việt Nam, ví dụ `"2026-11-29T07:30:00+07:00"`.
Mọi ngày giờ trên thiệp đều quy về giờ Việt Nam, khách ở nước ngoài xem vẫn đúng ngày.

## 3. Thay ảnh cưới

Ảnh dùng thật trên thiệp là các file `.webp` trong
[`public/images/`](public/images/) — đã cắt sẵn, nén sẵn và commit vào git. **Chạy
và deploy thiệp không cần gì thêm.**

Vì thiệp build tĩnh (`output: "export"`, `images.unoptimized`), Next **không** tự
nén ảnh — khách tải đúng file nằm trong `public/`. Nên ảnh phải được nén sẵn.

### Muốn đổi ảnh thì lấy ảnh gốc về trước

Ảnh gốc (~142MB) **không** nằm trong repo cho nhẹ. Khi nào cần đổi ảnh, chép về
thư mục `photos-goc/` rồi mới chạy script được:

```bash
mkdir -p photos-goc
cp ~/Downloads/Edited/*.JPG photos-goc/     # sửa lại đường dẫn cho đúng chỗ để ảnh
```

Script khớp tên ảnh không phân biệt chữ hoa/thường và không quan tâm đuôi file,
nên `.JPG` hay `.jpeg` đều dùng thẳng được, khỏi đổi tên.

Sửa xong bất cứ thứ gì bên dưới thì chạy:

```bash
npm run anh
```

`photos-goc/` đã nằm trong `.gitignore` — chép về rồi cứ để đó, không lo lỡ tay
commit 142MB ảnh lên git.

### 3.1. Ảnh cố định (bìa, chuyện chúng mình, ảnh share)

Sửa bảng `PICKS` trong [`scripts/optimize-photos.mjs`](scripts/optimize-photos.mjs):

| Trường  | Ý nghĩa |
| ------- | ------- |
| `src`   | Tên file trong `photos-goc/`, không cần đuôi (`"NTK_3927"`) |
| `out`   | Tên file sinh ra trong `public/images/` (`hero`, `story-1`, …) |
| `frame` | Khung ảnh: `polaroid` 4:5 · `square` 1:1 · `portrait` 4:5 · `og` 1200×630 |
| `focus` | Cắt hụt thì neo về đâu. `0` = giữ mép trên, `1` = giữ mép dưới. Mất đầu thì giảm số này |
| `zoom`  | Cắt sát vào cho người to lên. `1` = nguyên khung, `1.4` ≈ lấy 70% rồi phóng lại |

Ảnh gốc 4024×6048 nên còn rất nhiều điểm ảnh dư — chỉnh `focus` / `zoom` thoải
mái, không lo vỡ.

`og-cover.jpg` là ảnh preview khi gửi link qua Zalo/Messenger — để JPEG chứ không
WebP cho chắc ăn.

### 3.2. Album ảnh

Toàn bộ album nằm ở bảng `ALBUM` trong cùng file script — cứ liệt kê tên ảnh theo
đúng thứ tự muốn khách xem. Ảnh album **không bị cắt**, chỉ thu nhỏ, nên ảnh chụp
ngang vẫn hiện ra ngang trong khung xem phóng to.

Mỗi tấm sinh ra 2 bản trong `public/images/album/`:

- `NN.webp` — bản đầy đủ, dùng cho khung xem phóng to
- `NN-thumb.webp` — bản cắt 4:5, dùng cho lưới ảnh ngoài trang

Script cũng tự ghi ra [`data/album.ts`](data/album.ts) (kèm kích thước từng tấm).
**Đừng sửa tay file đó** — chạy lại `npm run anh` là nó ghi đè.

Ngoài trang chỉ bày sẵn vài tấm đầu cho gọn, bấm vào bất kỳ tấm nào (hoặc nút
*Xem cả N tấm*) là lật xem được cả album — bằng phím mũi tên trên máy tính, vuốt
ngang trên điện thoại. Muốn bày nhiều/ít hơn thì sửa `gallery.previewCount` trong
`data/config.ts`.

## 4. Nhạc nền

Bỏ file mp3 vào `public/audio/nhac-nen.mp3`. Xem thêm
[`public/audio/README.md`](public/audio/README.md).

Nhạc tự phát ngay khi khách chạm mở cổng (trình duyệt chỉ cho phát tiếng sau một
thao tác của người dùng, nên thao tác mở thiệp chính là lúc hợp lệ). Góc trên bên phải
luôn có nút bật/tắt. Chưa có file mp3 thì nút tự ẩn, thiệp vẫn chạy bình thường.

## 5. Tên khách mời riêng từng người

Mỗi khách một link:

```
https://ten-mien-cua-ban.com/nha-gai/?to=Anh%20Nam
https://ten-mien-cua-ban.com/nha-trai/?to=Gia%20%C4%91%C3%ACnh%20b%C3%A1c%20Tu%E1%BA%A5n
```

Phần `/nha-gai/` hay `/nha-trai/` quyết định khách nhận thiệp bên nào — **nhớ chọn đúng
trước khi gửi**, vì hai bên khác nhau cả tên lễ lẫn ngày giờ và địa điểm đãi tiệc.

Không cần tự mã hoá tay — mở trang **`/tao-link`** trên chính thiệp đã deploy:
bấm chọn thiệp nhà gái hay nhà trai, gõ tên (hoặc dán cả danh sách, mỗi dòng một tên),
bấm copy link hoặc copy kèm sẵn lời mời để dán thẳng vào Zalo. Trang này không được Google lập chỉ mục, nhưng ai
biết địa chỉ vẫn mở được — nó chỉ sinh link chứ không lộ dữ liệu gì.

Link không có `?to=` thì thiệp hiện tên mặc định trong `guest.fallback`.

## 6. Nối form xác nhận với Google Sheet

1. Tạo một Google Sheet mới.
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá code mẫu, dán toàn bộ [`scripts/apps-script.gs`](scripts/apps-script.gs) vào.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Google hỏi cấp quyền và hiện cảnh báo **"Google hasn't verified this app"** —
   đây là chuyện bình thường, xem mục bên dưới.
6. Copy URL dạng `https://script.google.com/macros/s/..../exec`
7. Dán vào `rsvp.endpoint` trong `data/config.ts`, deploy lại thiệp.

### Gặp màn hình "Google hasn't verified this app"?

Không phải lỗi. Script này do chính bạn viết nên Google chưa (và không cần) duyệt.
Ở màn hình cảnh báo: bấm **Advanced** (góc dưới bên trái) → **Go to … (unsafe)** →
**Allow**. Chỉ chủ Sheet thấy màn hình này một lần lúc deploy; khách mời vào thiệp
không bao giờ gặp, vì web app chạy dưới quyền của bạn (*Execute as: Me*).

Lưu ý tài khoản đang đăng nhập phải đúng là tài khoản sở hữu Sheet — email hiện trong
cảnh báo chính là tài khoản đó.

Sau đó mỗi lượt xác nhận rơi thẳng vào Sheet (thời gian, tên, có/không đi, số người,
lời chúc, và **bên nào** — nhà gái hay nhà trai). Lời chúc cũng được đọc ngược về hiển thị ở mục **Sổ lưu bút** dưới form —
tắt bằng `rsvp.showWishes: false`.

Để trống `endpoint` thì form vẫn bấm được và hiện lời cảm ơn, nhưng không gửi đi đâu
(tiện lúc đang chỉnh giao diện).

## 7. Mã QR mừng cưới

Mỗi bên thiệp dẫn về tài khoản của nhà mình, nên có **hai khối `gift`** — một trong
`sides["nha-gai"]`, một trong `sides["nha-trai"]`. Số tài khoản hiện là `0000000000`,
nhớ thay trước khi gửi thiệp.

Mở app ngân hàng → tạo mã QR (nên kèm sẵn nội dung chuyển khoản) → chụp hoặc tải ảnh
về, lưu thành `public/images/qr-co-dau.png` / `qr-chu-re.png`, rồi sửa trong
`data/config.ts`:

```ts
sides: {
  "nha-gai": {
    gift: {
      qrImage: "/images/qr-co-dau.png",
      bankName: "Vietcombank",
      accountName: "LE NGOC MINH",
      accountNumber: "1234567890",
      note: "Mung cuoi Thai Minh",
    },
  },
},
```

Khách chạm vào thẻ "Hộp Mừng Cưới" là hiện popup nhỏ có mã QR, tên chủ tài khoản và
nút sao chép số tài khoản.

## 8. Deploy

```bash
npm run build      # kết quả nằm trong thư mục out/
```

- **Vercel**: import repo, để nguyên mặc định là xong.
- **Netlify / Cloudflare Pages**: build command `npm run build`, thư mục publish `out`.
- **Hosting thường**: chép nguyên thư mục `out/` lên.

Deploy xong nhớ sửa `site.baseUrl` trong `data/config.ts` thành domain thật, vì trang
`/tao-link` lấy giá trị đó để sinh link mời.

## 9. Cấu trúc thư mục

```
app/
  page.tsx           / -> thiệp phiên bản mặc định
  [ben]/page.tsx     /nha-gai/ và /nha-trai/
  tao-link/          trang nội bộ sinh link mời
  globals.css        bảng màu, font, hiệu ứng
components/
  Invitation.tsx     ghép các section, nhận vào "bên nào"
  Gate.tsx           màn hình cổng hoa hai cánh, chạm để mở
  WaxSeal.tsx        dấu niêm phong sáp có chữ lồng
  Hero.tsx           tên cô dâu chú rể
  Countdown.tsx      tấm thiệp hình vòm + đồng hồ đếm ngược
  OurStory.tsx       chuyện chúng mình
  Details.tsx        hai họ + báo tin lễ + hôn lễ + lời mời dự tiệc
  Gallery.tsx        album ảnh + xem phóng to
  Rsvp.tsx           form xác nhận + sổ lưu bút
  Gift.tsx           hộp mừng cưới, popup mã QR
  BottomNav.tsx      thanh điều hướng dưới màn hình
  MusicPlayer.tsx    nhạc nền
data/config.ts       ★ toàn bộ nội dung thiệp, gồm cả hai phiên bản
data/album.ts        danh sách ảnh album — script tự sinh, đừng sửa tay
lib/side.ts          gom mọi khác biệt giữa thiệp nhà gái và nhà trai
photos-goc/          ảnh gốc từ thợ chụp — chỉ cần khi đổi ảnh, không có sẵn trong repo
scripts/optimize-photos.mjs  cắt + nén ảnh -> public/images/  (npm run anh)
scripts/apps-script.gs       code dán vào Google Apps Script
```
