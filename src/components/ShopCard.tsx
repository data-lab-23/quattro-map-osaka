import Link from "next/link";
import Image from "next/image";
import type { Shop } from "@/types/shop";
import { HoneyBadge } from "./HoneyBadge";
import { VerificationBadge } from "./VerificationBadge";
export function ShopCard({ shop }: { shop: Shop }) {
  return <article className="shop-card">
    {shop.imageUrl&&<Link className="shop-image" href={`/shops/${shop.slug}`}><Image src={shop.imageUrl} alt={`${shop.name}のイメージ写真`} fill sizes="(max-width: 560px) 100vw, 33vw"/><span>IMAGE</span></Link>}
    <div className="card-top"><span className="ward">大阪市{shop.ward}</span></div>
    <h3><Link href={`/shops/${shop.slug}`}>{shop.name}</Link></h3>
    <p className="station">📍 {shop.nearestStation ?? shop.address}</p>
    <p className="access">🚉 {shop.accessText??`${shop.nearestStation}からアクセス`}</p>
    {shop.googleRating&&<div className="rating"><strong>★ {shop.googleRating.toFixed(1)}</strong><span>Google口コミ {shop.googleReviewCount?.toLocaleString() ?? "―"}件</span></div>}
    <div className="badges"><VerificationBadge status={shop.verificationStatus}/><HoneyBadge status={shop.honeyStatus}/></div>
    <p>{shop.description}</p>
    <div className="card-links"><Link className="text-link" href={`/shops/${shop.slug}`}>詳細を見る →</Link><a href={shop.websiteUrl??shop.googleMapsUrl} target="_blank" rel="noreferrer">店舗URL ↗</a></div>
  </article>;
}
