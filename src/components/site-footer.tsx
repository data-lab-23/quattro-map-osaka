import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <b>クアトロマップ大阪</b>
          <p>
            大阪で“おいしい4種のチーズピザ”に出会うための、個人運営の専門マップです。
          </p>
        </div>
        <div>
          <Link href="/#shops">お店を探す</Link>
          <Link href="/about">運営・掲載基準</Link>
          <Link href="/submit">掲載・修正依頼</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
        </div>
      </div>
      <p className="copyright">
        © 2026 Quattro Map Osaka. 掲載情報は訪問前に公式情報をご確認ください。
        <span>Made by Malbon</span>
      </p>
    </footer>
  );
}
