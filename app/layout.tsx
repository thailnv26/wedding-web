import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import { config } from "@/data/config";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-bevietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/**
 * Thẻ mặc định cho mọi trang. Trang nào có nội dung riêng (thiệp nhà gái / nhà trai)
 * thì tự khai đè lên trong file page.tsx của trang đó.
 *
 * `metadataBase` là gốc để Next đổi mọi đường dẫn tương đối bên dưới thành link
 * tuyệt đối — thiếu nó thì dán link đi không ra ảnh.
 *
 * Icon tab trình duyệt thì không khai ở đây: Next tự nhặt app/icon.png,
 * app/apple-icon.png và app/favicon.ico (xem scripts/make-favicon.mjs).
 */
export const metadata: Metadata = {
  metadataBase: new URL(config.site.baseUrl),
  ...pageMetadata({
    title: config.site.title,
    description: config.site.description,
  }),
};

export const viewport: Viewport = {
  themeColor: "#fdf7f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${cormorant.variable} ${dancing.variable} ${beVietnam.variable}`}>
        {children}
      </body>
    </html>
  );
}
