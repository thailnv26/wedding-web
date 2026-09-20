import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/Invitation";
import { config } from "@/data/config";
import { SIDE_KEYS, isSideKey, sideMetadata } from "@/lib/side";

type Props = { params: Promise<{ ben: string }> };

/** Chỉ có đúng hai phiên bản thiệp, đường dẫn khác thì 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SIDE_KEYS.map((ben) => ({ ben }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ben } = await params;
  if (!isSideKey(ben)) return {};

  const { title, description } = sideMetadata(ben);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "vi_VN",
      images: [{ url: config.site.ogImage }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { ben } = await params;
  if (!isSideKey(ben)) notFound();

  return <Invitation sideKey={ben} />;
}
