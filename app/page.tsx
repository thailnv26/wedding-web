import type { Metadata } from "next";
import { Invitation } from "@/components/Invitation";
import { config } from "@/data/config";
import { sideMetadata } from "@/lib/side";

/**
 * Trang gốc: khách gõ thẳng tên miền mà không qua link mời.
 * Hiện phiên bản mặc định khai báo trong data/config.ts.
 */
export const metadata: Metadata = sideMetadata(config.defaultSide);

export default function Page() {
  return <Invitation sideKey={config.defaultSide} />;
}
