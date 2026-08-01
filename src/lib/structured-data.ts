import type { Shop } from "@/types/shop";
import { absoluteUrl } from "./seo";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type ItemListInput = {
  name: string;
  description?: string;
  shops: Shop[];
};

export function buildRestaurantJsonLd(shop: Shop) {
  const pageUrl = absoluteUrl(`/shops/${shop.slug}`);
  const sameAs = [shop.googleMapsUrl, shop.websiteUrl, shop.instagramUrl].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${pageUrl}#restaurant`,
    name: shop.name,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    ...(shop.imageUrl ? { image: absoluteUrl(shop.imageUrl) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "大阪市",
      addressRegion: "大阪府",
      streetAddress: shop.address,
      addressCountry: "JP",
    },
    ...(shop.quattroPriceText ? { priceRange: shop.quattroPriceText } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd({ name, description, shops }: ItemListInput) {
  const publishedShops = shops.filter((shop) => shop.published);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description ? { description } : {}),
    numberOfItems: publishedShops.length,
    itemListElement: publishedShops.map((shop, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/shops/${shop.slug}`),
      name: shop.name,
    })),
  };
}

