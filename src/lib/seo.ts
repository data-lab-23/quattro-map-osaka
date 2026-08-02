import type { Metadata } from "next";

export const siteName = "クアトロマップ大阪";
export const siteDescription =
  "大阪市でクアトロフォルマッジが食べられるピザ屋・イタリアンを、エリア、アクセス、公式URL、Google Mapsから探せる情報サイトです。";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-lab-23.github.io/quattro-map-osaka";

export const siteKeywords = [
  "クアトロフォルマッジ 大阪",
  "大阪 ピザ",
  "大阪 ピッツェリア",
  "大阪 イタリアン",
  "大阪 チーズピザ",
  "大阪市 ピザ屋",
  "大阪 グルメ",
];

export const ogImagePath = "/images/quattro-formaggi-hero.png";

export const absoluteUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
};

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  imagePath = ogImagePath,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName,
      title,
      description,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl(imagePath), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(imagePath)],
    },
  };
}
