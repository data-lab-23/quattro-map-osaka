import Image from "next/image";
import Link from "next/link";
import { ShopExplorer } from "@/components/ShopExplorer";
import { getPublishedShops } from "@/lib/shops";
import { siteOwnerNote } from "@/data/site";
import { wards } from "@/data/wards";

export default function Home() {
  const shops = getPublishedShops();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <section className="hero">
        <div className="hero-backdrop">
          <Image
            src={`${basePath}/images/quattro-formaggi-hero.png`}
            alt="焼きたてのクアトロフォルマッジ"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">OSAKA · QUATTRO FORMAGGI</span>
            <h1>
              大阪で出会う、
              <br />
              <em>4種のチーズ</em>の一枚。
            </h1>
            <p>
              クアトロフォルマッジが食べられる大阪市内のピザ屋・イタリアンを、地図・エリア・アクセス情報から探せる専門サイトです。
            </p>
            <a className="primary-button" href="#shops">
              近くのお店を探す
            </a>
          </div>
          <div className="hero-sign">
            <span>
              QUATTRO
              <br />
              FORMAGGI
            </span>
            <small>OSAKA CITY GUIDE</small>
          </div>
        </div>
      </section>

      <div className="founder-note">
        <div className="container">
          <span className="founder-mark">M</span>
          <div>
            <b>大阪でクアトロフォルマッジを愛する管理人が立ち上げました。</b>
            <p>{siteOwnerNote}</p>
          </div>
        </div>
      </div>

      <section className="story-section container">
        <div className="story-photo">
          <Image
            src={`${basePath}/images/osaka-pizzeria-interior.png`}
            alt="おしゃれな大阪のピッツェリア"
            fill
            sizes="(max-width: 850px) 100vw, 50vw"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">A PERFECT SLICE IN OSAKA</span>
          <h2>
            甘じょっぱい一枚に、
            <br />
            ちゃんと辿り着けるように。
          </h2>
          <p>
            ゴルゴンゾーラの個性、モッツァレラのミルキーさ、焼きたての香ばしさ。お店ごとの違いを楽しめるよう、アクセス・公式URL・地図リンクを整理しています。
          </p>
          <a href="#shops" className="text-link">
            地図と一覧から探す →
          </a>
        </div>
      </section>

      <div className="container">
        <ShopExplorer initialShops={shops} />
        <section className="wards-section">
          <span className="eyebrow">EXPLORE BY AREA</span>
          <h2>大阪市のエリアから探す</h2>
          <div className="ward-links">
            {wards.map((ward) => (
              <Link key={ward.slug} href={`/osaka/${ward.slug}`}>
                <b>{ward.name}</b>
                <span>お店を見る →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
