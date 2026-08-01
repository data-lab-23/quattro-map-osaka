import { shops } from "@/data/shops";
import type { Shop } from "@/types/shop";

export type GuideKind = "lunch" | "honey" | "takeout" | "verified" | "station";

export type GuideDefinition = {
  slug: string;
  title: string;
  description: string;
  kind: GuideKind;
  station?: string;
};

const purposeGuides: readonly GuideDefinition[] = [
  {
    slug: "lunch",
    title: "大阪でランチにクアトロフォルマッジを楽しめる店",
    description: "ランチ利用可として掲載している大阪市内の店舗をまとめました。営業時間や最新メニューは訪問前に各店の公式情報で確認してください。",
    kind: "lunch",
  },
  {
    slug: "with-honey",
    title: "大阪ではちみつとクアトロフォルマッジを楽しめる店",
    description: "はちみつの提供が確認できた、または提供ありとして掲載している店舗をまとめました。提供方法は変更される場合があります。",
    kind: "honey",
  },
  {
    slug: "takeout",
    title: "大阪でクアトロフォルマッジをテイクアウトできる店",
    description: "テイクアウト対応ありとして掲載している店舗をまとめました。受取方法や当日の対応は各店へ確認してください。",
    kind: "takeout",
  },
  {
    slug: "verified",
    title: "提供確認済みの大阪のクアトロフォルマッジ店",
    description: "店舗公式情報または実食・投稿で、クアトロフォルマッジの提供を確認できた掲載店です。",
    kind: "verified",
  },
];

export function getShopsForGuide(guide: GuideDefinition, source: readonly Shop[]): Shop[] {
  return source.filter((shop) => {
    if (!shop.published) return false;

    switch (guide.kind) {
      case "lunch":
        return shop.lunchAvailable === true;
      case "honey":
        return shop.honeyStatus === "included" || shop.honeyStatus === "available";
      case "takeout":
        return shop.takeoutAvailable === true;
      case "verified":
        return shop.verificationStatus === "verified_official" || shop.verificationStatus === "verified_review";
      case "station":
        return guide.station !== undefined && shop.nearestStation === guide.station;
    }
  });
}

function createStationGuides(source: readonly Shop[]): GuideDefinition[] {
  const stationCounts = source.reduce<Map<string, number>>((counts, shop) => {
    const station = shop.nearestStation?.trim();
    if (!shop.published || !station) return counts;
    counts.set(station, (counts.get(station) ?? 0) + 1);
    return counts;
  }, new Map());

  return [...stationCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort(([left], [right]) => left.localeCompare(right, "ja"))
    .map(([station]) => ({
      slug: `station-${Buffer.from(station, "utf8").toString("base64url")}`,
      title: `${station}周辺でクアトロフォルマッジを探す`,
      description: `${station}を最寄り駅とする大阪市内の掲載店をまとめました。アクセスや営業時間は訪問前に各店の公式情報で確認してください。`,
      kind: "station" as const,
      station,
    }));
}

export function createGuides(source: readonly Shop[]): GuideDefinition[] {
  const candidates = [...purposeGuides, ...createStationGuides(source)];
  return candidates.filter((guide) => getShopsForGuide(guide, source).length > 0);
}

export const guides = createGuides(shops);

export const getGuideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);

export function getGuidesForShop(shop: Shop, source: readonly GuideDefinition[] = guides): GuideDefinition[] {
  return source.filter((guide) => getShopsForGuide(guide, [shop]).length > 0);
}

export function getGuideSelectionNote(guide: GuideDefinition): string {
  switch (guide.kind) {
    case "lunch":
      return "選定基準：ランチ利用可として掲載している店舗のみを表示しています。";
    case "honey":
      return "選定基準：はちみつの提供が確認できた、または提供ありとして掲載している店舗のみを表示しています。";
    case "takeout":
      return "選定基準：テイクアウト対応ありとして掲載している店舗のみを表示しています。";
    case "verified":
      return "選定基準：店舗公式情報または実食・投稿で提供確認済みの店舗のみを表示しています。";
    case "station":
      return `選定基準：最寄り駅が${guide.station}と完全一致する掲載店のみを表示しています。`;
  }
}
