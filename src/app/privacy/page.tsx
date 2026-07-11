import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "クアトロマップ大阪のアクセス解析、Cookie、アフィリエイトリンクに関する方針です。",
};

export default function PrivacyPage() {
  return (
    <div className="container policy-page">
      <span className="eyebrow">PRIVACY POLICY</span>
      <h1>プライバシーポリシー</h1>

      <section className="detail-section">
        <h2>アクセス解析について</h2>
        <p>
          クアトロマップ大阪では、サイト改善と利用状況の分析のためにGoogle Analyticsを使用する場合があります。
          Google AnalyticsはCookie等を利用して、ページ閲覧数、参照元、利用端末、クリックイベントなどの情報を収集することがあります。
        </p>
        <p>
          収集した情報は、ページ別PVの把握、人気コンテンツの確認、流入元の分析、リンククリックの改善など、サイト運営・改善の目的で利用します。
          個人を特定する目的では利用しません。
        </p>
      </section>

      <section className="detail-section">
        <h2>Cookie等の利用</h2>
        <p>
          アクセス解析や広告・アフィリエイトの効果測定のために、Cookieまたは類似技術を利用する場合があります。
          ブラウザ設定によりCookieを無効化できますが、一部機能が正しく動作しない場合があります。
        </p>
      </section>

      <section className="detail-section">
        <h2>アフィリエイトリンクについて</h2>
        <p>
          当サイトには、Amazonアソシエイトを含むアフィリエイトリンクを掲載する場合があります。
          リンクをクリックした場合、外部サイトに遷移し、遷移先の規約・プライバシーポリシーが適用されます。
        </p>
      </section>

      <section className="detail-section">
        <h2>イベント計測について</h2>
        <p>
          Amazonリンク、CTAボタン、外部リンクなどのクリックを、サイト改善のためにイベントとして計測する場合があります。
          計測する情報はクリック対象、ページパス、リンクURLなどであり、個人を特定する目的では利用しません。
        </p>
      </section>

      <section className="detail-section">
        <h2>今後の解析ツール対応</h2>
        <p>
          将来的にGoogle Search Console、Plausible Analytics、Vercel Analytics、Cloudflare Web Analytics等を導入する場合があります。
          導入時も、サイト改善・利用状況分析の目的に限って利用します。
        </p>
      </section>
    </div>
  );
}
