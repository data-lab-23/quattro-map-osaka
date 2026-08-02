import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "運営者情報・掲載基準",
  description: "クアトロマップ大阪の運営目的、掲載と確認の方法、訂正・更新の方針です。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container about-page">
      <span className="eyebrow">EDITORIAL STANDARDS</span>
      <h1>クアトロマップ大阪について</h1>

      <section>
        <h2>このサイトの目的</h2>
        <p>大阪でクアトロフォルマッジを食べたい人が、提供店と確認状況を比較しやすくするための個人運営サイトです。</p>
      </section>
      <section>
        <h2>掲載と確認の方法</h2>
        <p>店舗公式サイト、公式メニュー、店舗公式SNS、Google Mapsの所在地情報を確認し、確認日と情報源を記録します。</p>
      </section>
      <section>
        <h2>確認済みの定義</h2>
        <p>「公式情報で確認」は店舗公式のメニュー等で提供を確認できた状態、「実食・投稿で確認」は管理人の訪問記録または提供を示す一次資料を確認できた状態です。</p>
      </section>
      <section>
        <h2>外部評価の扱い</h2>
        <p>Googleの評価と口コミ件数は出典を明示した参考情報です。クアトロマップ大阪が収集した評価ではありません。</p>
      </section>
      <section>
        <h2>実食レビューとAI利用</h2>
        <p>実食レビューは訪問日と内容が揃う場合だけ掲載します。整理や実装にAIを利用しても、未確認情報を実体験として生成しません。</p>
      </section>
      <section>
        <h2>訂正・更新</h2>
        <p>メニューや営業情報は変わるため、訪問前に店舗公式情報をご確認ください。訂正は掲載・修正依頼ページから受け付けます。</p>
      </section>
    </div>
  );
}
