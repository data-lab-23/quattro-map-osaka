import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShopCard } from "@/components/ShopCard";
import {
  getGuideBySlug,
  getGuideSelectionNote,
  getShopsForGuide,
  guides,
} from "@/data/guides";
import { shops } from "@/data/shops";
import { wards } from "@/data/wards";
import { absoluteUrl, siteName } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ guideSlug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ guideSlug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug((await params).guideSlug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuideBySlug((await params).guideSlug);
  if (!guide) notFound();

  const matched = getShopsForGuide(guide, shops);
  if (matched.length === 0) notFound();

  const breadcrumbItems = [
    { name: siteName, path: "/" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];
  const itemList = buildItemListJsonLd({ name: guide.title, description: guide.description, shops: matched });
  const matchedShopSlugs = new Set(matched.map((shop) => shop.slug));
  const relatedGuides = guides.filter(
    (candidate) =>
      candidate.slug !== guide.slug && getShopsForGuide(candidate, shops).some((shop) => matchedShopSlugs.has(shop.slug)),
  );
  const relatedWards = wards.filter((ward) => matched.some((shop) => shop.wardSlug === ward.slug));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: itemList.name,
      description: itemList.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
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
    <div className="guide-page container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />
      <span className="eyebrow">QUATTRO GUIDE</span>
      <h1>{guide.title}</h1>
      <p className="lead">{guide.description}</p>
      <p className="guide-selection-note">{getGuideSelectionNote(guide)}</p>
      <div className="guide-meta">
        <strong>{matched.length}店</strong>
        <span>掲載店は確認状況や営業時間などを個別にご確認ください。</span>
      </div>
      <div className="shop-grid guide-grid">
        {matched.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      {relatedWards.length > 0 && (
        <section className="related-links" aria-labelledby="guide-ward-links">
          <h2 id="guide-ward-links">区から探す</h2>
          <div>
            {relatedWards.map((ward) => (
              <Link key={ward.slug} href={`/osaka/${ward.slug}`}>
                大阪市{ward.name}
              </Link>
            ))}
          </div>
        </section>
      )}
      {relatedGuides.length > 0 && (
        <section className="related-links" aria-labelledby="related-guide-links">
          <h2 id="related-guide-links">関連ガイド</h2>
          <div>
            {relatedGuides.map((candidate) => (
              <Link key={candidate.slug} href={`/guides/${candidate.slug}`}>
                {candidate.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
