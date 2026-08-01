import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MapView } from "@/components/MapView";
import { ShopCard } from "@/components/ShopCard";
import { guides, getShopsForGuide } from "@/data/guides";
import { wards } from "@/data/wards";
import { getShopsByWard } from "@/lib/shops";
import { absoluteUrl, siteName } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ wardSlug: string }> };

export function generateStaticParams() {
  return wards.map((ward) => ({ wardSlug: ward.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wardSlug } = await params;
  const ward = wards.find((item) => item.slug === wardSlug);
  return ward
    ? {
        title: `大阪市${ward.name}のクアトロフォルマッジ店`,
        description: `大阪市${ward.name}でクアトロフォルマッジが食べられるピザ屋・イタリアン候補を、地図、Google評価、アクセス情報から探せます。`,
        alternates: {
          canonical: `/osaka/${ward.slug}`,
        },
        openGraph: {
          title: `大阪市${ward.name}のクアトロフォルマッジ店`,
          description: `大阪市${ward.name}でクアトロフォルマッジが食べられる候補店を地図と一覧から探せます。`,
          url: absoluteUrl(`/osaka/${ward.slug}`),
        },
      }
    : {};
}

export default async function WardPage({ params }: Props) {
  const { wardSlug } = await params;
  const ward = wards.find((item) => item.slug === wardSlug);
  if (!ward) notFound();

  const list = getShopsByWard(ward.slug);
  const verified = list.filter((shop) => shop.verificationStatus.startsWith("verified")).length;
  const breadcrumbItems = [
    { name: siteName, path: "/" },
    { name: `大阪市${ward.name}`, path: `/osaka/${ward.slug}` },
  ];
  const itemList = buildItemListJsonLd({ name: ward.name, shops: list });
  const relatedGuides = guides.filter((guide) => getShopsForGuide(guide, list).length > 0);
  const relatedWards = wards.filter(
    (candidate) => candidate.slug !== ward.slug && getShopsByWard(candidate.slug).length > 0,
  );
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: itemList.name,
      url: absoluteUrl(`/osaka/${ward.slug}`),
      description: itemList.description,
      inLanguage: "ja-JP",
      mainEntity: {
        "@type": itemList["@type"],
        numberOfItems: itemList.numberOfItems,
        itemListElement: itemList.itemListElement,
      },
    },
    buildBreadcrumbJsonLd(breadcrumbItems),
  ];

  return (
    <div className="container ward-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />
      <span className="eyebrow">OSAKA / {ward.slug.toUpperCase()}</span>
      <h1>
        大阪市{ward.name}で
        <br />
        クアトロフォルマッジを探す
      </h1>
      <p className="lead">{ward.summary}</p>
      <div className="stats">
        <div>
          <strong>{list.length}</strong>
          <span>掲載店舗</span>
        </div>
        <div>
          <strong>{verified}</strong>
          <span>確認済み</span>
        </div>
      </div>
      <MapView shops={list} />
      <div className="shop-grid ward-grid">
        {list.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      {relatedGuides.length > 0 && (
        <section className="related-links" aria-labelledby="ward-guide-links">
          <h2 id="ward-guide-links">目的・駅から探す</h2>
          <div>
            {relatedGuides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                {guide.title}
              </Link>
            ))}
          </div>
        </section>
      )}
      {relatedWards.length > 0 && (
        <section className="related-links" aria-labelledby="nearby-ward-links">
          <h2 id="nearby-ward-links">大阪市のほかの区から探す</h2>
          <div>
            {relatedWards.map((candidate) => (
              <Link key={candidate.slug} href={`/osaka/${candidate.slug}`}>
                大阪市{candidate.name}
              </Link>
            ))}
          </div>
        </section>
      )}
      {!list.length && <p className="empty">現在、この区の掲載店舗はありません。情報を募集中です。</p>}
    </div>
  );
}
