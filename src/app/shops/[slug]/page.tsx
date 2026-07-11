import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HoneyBadge } from "@/components/HoneyBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { getShopBySlug } from "@/lib/shops";
import { shops } from "@/data/shops";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return shops.map((shop) => ({ slug: shop.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = getShopBySlug((await params).slug);
  if (!shop) return {};

  const description = `大阪市${shop.ward}の${shop.name}。クアトロフォルマッジ候補、アクセス、地図、店舗URLを確認できます。`;
  return { title: shop.name, description, openGraph: { title: shop.name, description } };
}

const yesNo = (value?: boolean) => (value === true ? "あり" : value === false ? "なし" : "未確認");

export default async function ShopPage({ params }: Props) {
  const shop = getShopBySlug((await params).slug);
  if (!shop) notFound();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: shop.name,
    address: shop.address,
    geo:
      shop.latitude !== undefined && shop.longitude !== undefined
        ? { "@type": "GeoCoordinates", latitude: shop.latitude, longitude: shop.longitude }
        : undefined,
    aggregateRating: shop.googleRating
      ? { "@type": "AggregateRating", ratingValue: shop.googleRating, reviewCount: shop.googleReviewCount }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="detail-hero">
        <div className="container">
          <Link className="back" href="/">
            ← お店一覧に戻る
          </Link>
          <div className="card-top">
            <span className="ward">大阪市{shop.ward}</span>
          </div>
          <h1>{shop.name}</h1>
          <p>
            🚉 {shop.nearestStation} · {shop.address}
          </p>
        </div>
      </section>

      <div className="container detail-grid">
        <article>
          {shop.imageUrl && (
            <div className="detail-image">
              <Image
                src={`${basePath}${shop.imageUrl}`}
                alt={`${shop.name}のイメージ写真`}
                fill
                sizes="(max-width: 850px) 100vw, 65vw"
              />
              <span>店舗選びのためのイメージ写真</span>
            </div>
          )}

          <section className="detail-section">
            <h2>アクセス</h2>
            <p>{shop.accessText}</p>
          </section>

          {shop.googleRating && (
            <div className="detail-rating">
              <div>
                <strong>★ {shop.googleRating.toFixed(1)}</strong>
                <span>Google評価</span>
              </div>
              <div>
                <strong>{shop.googleReviewCount?.toLocaleString()}件</strong>
                <span>Google口コミ</span>
              </div>
            </div>
          )}

          <section className="detail-section">
            <h2>クアトロフォルマッジ情報</h2>
            <VerificationBadge status={shop.verificationStatus} />
            <dl>
              <div>
                <dt>確認ソース</dt>
                <dd>{shop.verificationSourceLabel ?? "確認できるソースを調査中"}</dd>
              </div>
              <div>
                <dt>価格</dt>
                <dd>{shop.quattroPriceText ?? "未確認"}</dd>
              </div>
              <div>
                <dt>はちみつ</dt>
                <dd>
                  <HoneyBadge status={shop.honeyStatus} />
                </dd>
              </div>
              <div>
                <dt>チーズ構成</dt>
                <dd>{shop.cheeseDescription ?? "未確認"}</dd>
              </div>
            </dl>
          </section>

          <section className="detail-section">
            <h2>お店の紹介</h2>
            {shop.googleRating && (
              <p className="review-summary">
                Google Mapsレビューは
                <strong> ★ {shop.googleRating.toFixed(1)}</strong>
                、レビュー件数は
                <strong> {shop.googleReviewCount?.toLocaleString() ?? "-"}件</strong>
                です。訪問前に最新の口コミや写真もあわせて確認するのがおすすめです。
              </p>
            )}
            <p>{shop.description}</p>
            <dl>
              <div>
                <dt>ランチ</dt>
                <dd>{yesNo(shop.lunchAvailable)}</dd>
              </div>
              <div>
                <dt>テイクアウト</dt>
                <dd>{yesNo(shop.takeoutAvailable)}</dd>
              </div>
              <div>
                <dt>営業時間</dt>
                <dd>{shop.openingHoursText ?? "未確認"}</dd>
              </div>
            </dl>
          </section>

          <div className="caution">
            メニューや所在地は変更される場合があります。訪問前に店舗URL・Google Maps・公式情報をご確認ください。
          </div>
        </article>

        <aside className="side-card">
          <h2>店舗情報</h2>
          <p>{shop.address}</p>
          <a className="primary-button" href={shop.googleMapsUrl} target="_blank" rel="noreferrer">
            Google Mapsで開く
          </a>
          <div className="side-links">
            {shop.googleMapsUrl && (
              <a href={shop.googleMapsUrl} target="_blank" rel="noreferrer">
                Google Mapsの写真・レビュー →
              </a>
            )}
            {shop.websiteUrl && (
              <a href={shop.websiteUrl} target="_blank" rel="noreferrer">
                店舗URL →
              </a>
            )}
            {shop.instagramUrl && (
              <a href={shop.instagramUrl} target="_blank" rel="noreferrer">
                Instagram →
              </a>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
