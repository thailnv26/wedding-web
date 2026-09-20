# Nhạc nền

Đặt file nhạc vào đúng thư mục này, đặt tên `nhac-nen.mp3`
(hoặc tên khác rồi sửa `music.src` trong `data/config.ts`).

Gợi ý:
- Nén còn khoảng 2–4 MB để khách dùng 4G mở không bị chờ lâu.
  Ví dụ: `ffmpeg -i goc.mp3 -b:a 96k -ac 1 nhac-nen.mp3`
- Nhạc tự phát ngay khi khách chạm mở phong bì, và có nút bật/tắt ở góc trên phải.
- Chưa bỏ file vào thì nút nhạc tự ẩn, thiệp vẫn chạy bình thường.
