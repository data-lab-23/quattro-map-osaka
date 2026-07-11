export const siteName = "クアトロマップ大阪";
export const siteDescription =
  "大阪市でクアトロフォルマッジが食べられるピザ屋・イタリアンを、エリア、アクセス、公式URL、Google Mapsから探せる情報サイトです。";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arsenal23vm-netizen.github.io/quattro-map-osaka";

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
