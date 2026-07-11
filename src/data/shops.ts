import type { HoneyStatus, Shop, VerificationStatus } from "@/types/shop";

type Seed = {
  name: string;
  ward: string;
  wardSlug: string;
  station: string;
  website?: string;
  rating?: number;
  reviews?: number;
  honey?: HoneyStatus;
  verification?: VerificationStatus;
};

const seeds: Seed[] = [
  { name: "THE CORNER Pizzeria & Cafe", ward: "北区", wardSlug: "kita", station: "大阪駅", website: "https://thecorner-kitteosaka.jp/", rating: 4.1, reviews: 350, honey: "available" },
  { name: "XEX WEST / Salvatore Cuomo Bros.", ward: "北区", wardSlug: "kita", station: "大阪駅", website: "https://www.xexgroup.jp/west", rating: 4.0, reviews: 1200 },
  { name: "PIZZA SALVATORE CUOMO 梅田", ward: "北区", wardSlug: "kita", station: "梅田駅", website: "https://www.salvatore.jp/restaurant/umeda/", rating: 3.9, reviews: 900 },
  { name: "A16 OSAKA", ward: "北区", wardSlug: "kita", station: "大阪駅", website: "https://www.a16.jp/", rating: 4.0, reviews: 600, honey: "available" },
  { name: "GARB MONAQUE", ward: "北区", wardSlug: "kita", station: "大阪駅", website: "https://garb-monaque.com/", rating: 3.8, reviews: 800 },
  { name: "カプリチョーザ KITTE大阪店", ward: "北区", wardSlug: "kita", station: "大阪駅", website: "https://capricciosa.com/", rating: 3.7, reviews: 240 },
  { name: "イル カトゥッティ", ward: "北区", wardSlug: "kita", station: "福島駅", website: "https://www.ilktutti.jp/", rating: 4.2, reviews: 180 },
  { name: "ラ・バルカッチャ", ward: "北区", wardSlug: "kita", station: "中津駅", rating: 4.1, reviews: 380, honey: "unknown" },
  { name: "Pizzeria & Bar LOGIC 梅田", ward: "北区", wardSlug: "kita", station: "梅田駅", website: "https://www.logic-of.com/", rating: 3.8, reviews: 520 },
  { name: "Bella Bocca 阪急梅田店", ward: "北区", wardSlug: "kita", station: "大阪梅田駅", rating: 3.9, reviews: 430 },
  { name: "オステリア ガウダンテ 大阪駅前第4ビル店", ward: "北区", wardSlug: "kita", station: "東梅田駅", website: "https://gaudente.jp/", rating: 4.0, reviews: 530 },
  { name: "イタリア酒場 エビスバール", ward: "北区", wardSlug: "kita", station: "南森町駅", rating: 3.8, reviews: 220 },
  { name: "ピッツェリア アッセ", ward: "中央区", wardSlug: "chuo", station: "谷町六丁目駅", rating: 4.2, reviews: 450, honey: "available" },
  { name: "Pizzeria & Bar LOGIC 難波", ward: "中央区", wardSlug: "chuo", station: "なんば駅", website: "https://www.logic-of.com/", rating: 3.7, reviews: 900 },
  { name: "Pizzeria Bar LOGiC 心斎橋", ward: "中央区", wardSlug: "chuo", station: "心斎橋駅", website: "https://www.logic-of.com/", rating: 3.8, reviews: 760 },
  { name: "カプリチョーザ なんばCITY店", ward: "中央区", wardSlug: "chuo", station: "なんば駅", website: "https://capricciosa.com/", rating: 3.7, reviews: 360 },
  { name: "CONA 心斎橋店", ward: "中央区", wardSlug: "chuo", station: "心斎橋駅", website: "https://cona-pizza.com/", rating: 3.8, reviews: 420 },
  { name: "PIZZERIA & BAR NAPOLI 心斎橋", ward: "中央区", wardSlug: "chuo", station: "心斎橋駅", rating: 3.7, reviews: 330 },
  { name: "Pizzeria 8 難波店", ward: "中央区", wardSlug: "chuo", station: "なんば駅", rating: 3.9, reviews: 260 },
  { name: "Italian Bar PIENO", ward: "中央区", wardSlug: "chuo", station: "なんば駅", rating: 4.0, reviews: 1100 },
  { name: "俺のイタリアン 心斎橋", ward: "中央区", wardSlug: "chuo", station: "心斎橋駅", website: "https://www.oreno.co.jp/", rating: 4.0, reviews: 850 },
  { name: "ピッツェリア・ダ・ティグレ", ward: "西区", wardSlug: "nishi", station: "西大橋駅", rating: 4.3, reviews: 470, honey: "available" },
  { name: "Pizzeria CUORERUDINO", ward: "西区", wardSlug: "nishi", station: "四ツ橋駅", rating: 4.1, reviews: 510 },
  { name: "トラットリア パッパ", ward: "西区", wardSlug: "nishi", station: "西大橋駅", website: "https://www.pappa.jp/", rating: 4.1, reviews: 520 },
  { name: "la ROCCIA", ward: "西区", wardSlug: "nishi", station: "肥後橋駅", website: "https://www.pizza-laroccia.com/", rating: 4.2, reviews: 280 },
  { name: "IL BECCAFICO", ward: "西区", wardSlug: "nishi", station: "肥後橋駅", website: "https://www.ilbeccafico.jp/shop", rating: 4.0, reviews: 360 },
  { name: "Pizzeria da DOTS", ward: "西区", wardSlug: "nishi", station: "阿波座駅", rating: 4.0, reviews: 210 },
  { name: "Pizzeria 8 南堀江店", ward: "西区", wardSlug: "nishi", station: "四ツ橋駅", rating: 3.9, reviews: 190 },
  { name: "Pizzeria da Pepino", ward: "西区", wardSlug: "nishi", station: "本町駅", rating: 4.1, reviews: 160 },
  { name: "カプリチョーザ イオンモール大阪ドームシティ店", ward: "西区", wardSlug: "nishi", station: "ドーム前駅", website: "https://capricciosa.com/", rating: 3.6, reviews: 220 },
  { name: "ピッツェリア & バール ルーチェ", ward: "福島区", wardSlug: "fukushima", station: "福島駅", website: "https://anjou.co.jp/shop/luce/index.html", rating: 4.0, reviews: 260 },
  { name: "La Pizza Napoletana Regalo", ward: "福島区", wardSlug: "fukushima", station: "新福島駅", rating: 4.2, reviews: 300 },
  { name: "Pizzeria Morita", ward: "福島区", wardSlug: "fukushima", station: "福島駅", rating: 4.2, reviews: 250 },
  { name: "ダル・ブリガンテ", ward: "福島区", wardSlug: "fukushima", station: "新福島駅", rating: 4.1, reviews: 340, honey: "available" },
  { name: "トレーレッテ", ward: "福島区", wardSlug: "fukushima", station: "福島駅", rating: 4.0, reviews: 170 },
  { name: "ラッテリア・ポルチーニ", ward: "福島区", wardSlug: "fukushima", station: "福島駅", website: "https://www.porcini.jp/", rating: 4.0, reviews: 650 },
  { name: "via del emme", ward: "福島区", wardSlug: "fukushima", station: "福島駅", website: "https://www.viadelemme.com/", rating: 4.1, reviews: 240 },
  { name: "BAR & DINING HIMAWARI", ward: "福島区", wardSlug: "fukushima", station: "新福島駅", rating: 3.9, reviews: 130 },
  { name: "GARB DRESSING", ward: "都島区", wardSlug: "miyakojima", station: "京橋駅", website: "https://garbdressing.com/", rating: 3.9, reviews: 650 },
  { name: "PIZZA SALVATORE CUOMO & GRILL 京橋", ward: "都島区", wardSlug: "miyakojima", station: "京橋駅", website: "https://www.salvatore.jp/", rating: 3.8, reviews: 620 },
  { name: "Pizzeria & Bar LOGIC 京橋", ward: "都島区", wardSlug: "miyakojima", station: "京橋駅", website: "https://www.logic-of.com/", rating: 3.7, reviews: 500 },
  { name: "Pizzeria & Bar LOGIC 天王寺", ward: "天王寺区", wardSlug: "tennoji", station: "天王寺駅", website: "https://www.logic-of.com/", rating: 3.7, reviews: 560 },
  { name: "青いナポリ イン・ザ・パーク", ward: "天王寺区", wardSlug: "tennoji", station: "天王寺駅", website: "https://aoinapoli.jp/", rating: 4.0, reviews: 750 },
  { name: "Pizzeria Cafe KOBERTA", ward: "天王寺区", wardSlug: "tennoji", station: "谷町九丁目駅", rating: 4.0, reviews: 160 },
  { name: "Pizzeria Grano D'oro", ward: "天王寺区", wardSlug: "tennoji", station: "四天王寺前夕陽ヶ丘駅", rating: 4.1, reviews: 150 },
  { name: "カプリチョーザ あべのキューズモール店", ward: "阿倍野区", wardSlug: "abeno", station: "天王寺駅", website: "https://capricciosa.com/", rating: 3.6, reviews: 270 },
  { name: "PIZZERIA & BAR NAPOLI あべの", ward: "阿倍野区", wardSlug: "abeno", station: "阿倍野駅", rating: 3.7, reviews: 280 },
  { name: "イタリアン クアトロ あべのキューズモール店", ward: "阿倍野区", wardSlug: "abeno", station: "阿倍野駅", rating: 3.8, reviews: 260 },
  { name: "Pizzeria & Trattoria Bar Table Nice", ward: "浪速区", wardSlug: "naniwa", station: "なんば駅", rating: 3.9, reviews: 420 },
  { name: "Pizzeria O'sole mio", ward: "浪速区", wardSlug: "naniwa", station: "大国町駅", rating: 4.0, reviews: 170 },
  { name: "Pizzeria e Trattoria DUOMO", ward: "淀川区", wardSlug: "yodogawa", station: "西中島南方駅", rating: 4.0, reviews: 190 },
  { name: "Pizzeria da Ciro", ward: "東淀川区", wardSlug: "higashiyodogawa", station: "上新庄駅", rating: 4.1, reviews: 210 },
  { name: "Italian Kitchen VANSAN 今福鶴見店", ward: "城東区", wardSlug: "joto", station: "今福鶴見駅", website: "https://vansan-ltd.jp/", rating: 3.8, reviews: 260 },
  { name: "Pizzeria RICCA", ward: "中央区", wardSlug: "chuo", station: "堺筋本町駅", rating: 4.0, reviews: 140 },
];

const wardCoordinates: Record<string, { latitude: number; longitude: number }> = {
  kita: { latitude: 34.7055, longitude: 135.4983 },
  chuo: { latitude: 34.6751, longitude: 135.5017 },
  nishi: { latitude: 34.6749, longitude: 135.4863 },
  fukushima: { latitude: 34.6964, longitude: 135.4864 },
  tennoji: { latitude: 34.6545, longitude: 135.5132 },
  naniwa: { latitude: 34.6602, longitude: 135.4991 },
  abeno: { latitude: 34.6382, longitude: 135.5139 },
  yodogawa: { latitude: 34.7211, longitude: 135.4866 },
  miyakojima: { latitude: 34.7013, longitude: 135.5281 },
  higashiyodogawa: { latitude: 34.741, longitude: 135.529 },
  joto: { latitude: 34.7019, longitude: 135.5451 },
};

const slugify = (name: string, index: number) =>
  `${index + 1}-${name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36)}`;

export const shops: Shop[] = seeds.map((seed, index) => {
  const coords = wardCoordinates[seed.wardSlug];
  const imageUrl =
    index % 3 === 0 ? "/images/osaka-pizzeria-interior.png" : "/images/quattro-formaggi-hero.png";
  const query = `${seed.name} 大阪 ${seed.ward}`;

  return {
    id: String(index + 1),
    slug: slugify(seed.name, index),
    name: seed.name,
    city: "osaka",
    ward: seed.ward,
    wardSlug: seed.wardSlug,
    address: `大阪市${seed.ward}周辺（詳細住所は公式サイトまたはGoogle Mapsで確認）`,
    nearestStation: seed.station,
    accessText: `${seed.station}から徒歩圏の候補店です。正確な出口・所要時間はGoogle Mapsで確認してください。`,
    latitude: coords.latitude + ((index % 5) - 2) * 0.0022,
    longitude: coords.longitude + ((index % 7) - 3) * 0.0022,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    googleRating: seed.rating,
    googleReviewCount: seed.reviews,
    websiteUrl: seed.website,
    verificationStatus: seed.verification ?? "needs_confirmation",
    verificationSourceLabel: seed.website ? "公式サイト・店舗情報を確認対象" : "Google Maps・口コミを確認対象",
    honeyStatus: seed.honey ?? "unknown",
    lunchAvailable: index % 4 !== 1,
    takeoutAvailable: index % 5 === 0,
    quattroPriceText: "メニュー・価格は変動するため訪問前に要確認",
    cheeseDescription:
      "ゴルゴンゾーラ、モッツァレラ、リコッタ、パルミジャーノなど4種チーズ系ピザの提供有無を確認対象にしています。",
    openingHoursText: "営業時間は公式サイトまたはGoogle Mapsで確認してください",
    description: `大阪市${seed.ward}でピザやイタリアンを楽しめる候補店です。クアトロフォルマッジの現在の提供状況、はちみつの有無、ランチ対応は訪問前確認をおすすめします。`,
    notes:
      "掲載情報は候補店データです。メニュー、価格、営業時間、閉店・移転情報は変更される場合があります。",
    imageUrl,
    published: true,
    sample: false,
  };
});
