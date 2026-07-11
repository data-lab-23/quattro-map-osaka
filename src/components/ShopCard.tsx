import Image from "next/image";
import Link from "next/link";
import { HoneyBadge } from "./HoneyBadge";
import { VerificationBadge } from "./VerificationBadge";
import type { Shop } from "@/types/shop";

export function ShopCard({ shop }: { shop: Shop }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const externalUrl = shop.websiteUrl ?? shop.googleMapsUrl;

  return (
    <article className="shop-card">
      {shop.imageUrl && (
        <Link className="shop-image" href={`/shops/${shop.slug}`}>
          <Image
            src={`${basePath}${shop.imageUrl}`}
            alt={`${shop.name}のイメージ写真`}
            fill
            sizes="(max-width: 560px) 100vw, 33vw"
          />
          <span>IMAGE</span>
        </Link>
      )}
      <div className="card-top">
        <span className="ward">大阪市{shop.ward}</span>
      </div>
      <h3>
        <Link href={`/shops/${shop.slug}`}>{shop.name}</Link>
      </h3>
      <p className="station">🚉 {shop.nearestStation ?? shop.address}</p>
      <p className="access">📍 {shop.accessText}</p>
      {shop.openingHoursText && <p className="access">🕒 {shop.openingHoursText}</p>}
      {shop.quattroPriceText && <p className="access">💴 {shop.quattroPriceText}</p>}
      {shop.googleRating && (
        <div className="rating">
          <strong>★ {shop.googleRating.toFixed(1)}</strong>
          <span>Googleレビュー {shop.googleReviewCount?.toLocaleString() ?? "-"}件</span>
        </div>
      )}
      <div className="badges">
        <VerificationBadge status={shop.verificationStatus} />
        <HoneyBadge status={shop.honeyStatus} />
      </div>
      <p>{shop.description}</p>
      <div className="card-links">
        <Link className="text-link" href={`/shops/${shop.slug}`}>
          詳細を見る →
        </Link>
        {externalUrl && (
          <a href={externalUrl} target="_blank" rel="noreferrer">
            店舗URL →
          </a>
        )}
        {shop.googleMapsUrl && (
          <a href={shop.googleMapsUrl} target="_blank" rel="noreferrer">
            写真・レビュー →
          </a>
        )}
      </div>
    </article>
  );
}
