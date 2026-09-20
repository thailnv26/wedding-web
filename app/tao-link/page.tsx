import type { Metadata } from "next";
import { LinkMaker } from "@/components/LinkMaker";

export const metadata: Metadata = {
  title: "Tạo link mời",
  robots: { index: false, follow: false },
};

export default function TaoLinkPage() {
  return <LinkMaker />;
}
