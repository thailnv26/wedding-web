import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import { config } from "@/data/config";
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

export const metadata: Metadata = {
  metadataBase: new URL(config.site.baseUrl),
  title: config.site.title,
  description: config.site.description,
  openGraph: {
    title: config.site.title,
    description: config.site.description,
    type: "website",
    locale: "vi_VN",
    images: [{ url: config.site.ogImage }],
  },
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
