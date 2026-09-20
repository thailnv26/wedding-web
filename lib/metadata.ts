import type { Metadata } from "next";
import { config } from "@/data/config";

/**
 * Thẻ preview khi khách copy link thiệp dán vào Zalo, Messenger, Facebook,
 * iMessage, Telegram...
 *
 * Mọi trang đều đi qua hàm này để không trang nào bị sót thẻ — dán link trang nào
 * cũng phải ra đúng ảnh cưới, đúng tiêu đề.
 *
 * Đường dẫn để tương đối ("/images/..." , "/nha-trai/") là cố ý: Next tự ghép với
 * `metadataBase` trong app/layout.tsx thành link tuyệt đối, vì các app chat không
 * đọc được đường dẫn tương đối.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  /** Đường dẫn của chính trang này, để khai báo link gốc. */
  path?: string;
}): Metadata {
  const { siteName, ogImage, ogImageWidth, ogImageHeight, ogImageAlt } = config.site;

  const images = [
    {
      url: ogImage,
      width: ogImageWidth,
      height: ogImageHeight,
      alt: ogImageAlt,
      type: ogImage.endsWith(".png") ? "image/png" : "image/jpeg",
    },
  ];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      siteName,
      url: path,
      type: "website",
      locale: "vi_VN",
      images,
    },
    // Thẻ riêng của X/Twitter. Vài app chat cũng đọc thẻ này trước khi đọc og:.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
