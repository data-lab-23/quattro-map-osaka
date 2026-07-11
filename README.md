# クアトロマップ大阪

大阪市でクアトロフォルマッジが食べられるピザ屋・イタリアンを探すためのWebサイトです。

## 主な編集ファイル

- `src/app/page.tsx` - トップページ
- `src/data/shops.ts` - 店舗データ
- `src/data/wards.ts` - エリアデータ
- `src/components/ShopExplorer.tsx` - 検索・絞り込み
- `src/components/ShopCard.tsx` - 店舗カード
- `src/components/MapView.tsx` - Google Map表示
- `public/images/` - トップページ・店舗カード画像

## 開発

```bash
npm run dev
```

## Google Analytics 4 の設定

GA4でアクセス解析を有効にする場合は、`.env.local` に測定IDを設定します。

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

実装済みの計測:

- `page_view` 相当のページビュー計測
- `amazon_click`
- `cta_click`
- `outbound_click`

主な実装ファイル:

- `src/lib/analytics.ts` - GA4イベント送信用の共通関数
- `src/components/Analytics.tsx` - Googleタグ設置とページビュー計測
- `src/components/AmazonButton.tsx` - Amazonアフィリエイトクリック計測
- `src/components/CtaLink.tsx` - CTAクリック計測
- `src/app/privacy/page.tsx` - プライバシーポリシー

`NEXT_PUBLIC_GA_ID` が未設定の場合、Googleタグは読み込まれず、クリック計測関数も何もしません。

## 公開URL

https://arsenal23vm-netizen.github.io/quattro-map-osaka/

Made by Malbon
