"use client";

import { useMemo, useState } from "react";
import { wards } from "@/data/wards";
import { MapView } from "./MapView";
import { ShopCard } from "./ShopCard";
import type { HoneyStatus, Shop, VerificationStatus } from "@/types/shop";

export function ShopExplorer({ initialShops }: { initialShops: Shop[] }) {
  const [ward, setWard] = useState("");
  const [verification, setVerification] = useState("");
  const [honey, setHoney] = useState("");
  const [lunch, setLunch] = useState(false);
  const [takeout, setTakeout] = useState(false);
  const [sort, setSort] = useState("recommended");

  const filtered = useMemo(
    () =>
      initialShops
        .filter(
          (shop) =>
            (!ward || shop.wardSlug === ward) &&
            (!verification || shop.verificationStatus === verification) &&
            (!honey || shop.honeyStatus === honey) &&
            (!lunch || shop.lunchAvailable) &&
            (!takeout || shop.takeoutAvailable),
        )
        .sort((a, b) =>
          sort === "rating"
            ? (b.googleRating ?? 0) - (a.googleRating ?? 0)
            : sort === "reviews"
              ? (b.googleReviewCount ?? 0) - (a.googleReviewCount ?? 0)
              : 0,
        ),
    [initialShops, honey, lunch, sort, takeout, verification, ward],
  );

  return (
    <>
      <section className="map-shell">
        <MapView shops={filtered} />
      </section>
      <section className="explorer" id="shops">
        <div className="filters" aria-label="店舗の絞り込み">
          <select aria-label="区" value={ward} onChange={(event) => setWard(event.target.value)}>
            <option value="">すべての区</option>
            {wards.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            aria-label="確認状況"
            value={verification}
            onChange={(event) => setVerification(event.target.value as VerificationStatus | "")}
          >
            <option value="">すべての確認状況</option>
            <option value="needs_confirmation">提供状況を確認中</option>
            <option value="verified_official">公式情報で確認済み</option>
            <option value="verified_review">口コミ・投稿で確認</option>
          </select>
          <select
            aria-label="はちみつ"
            value={honey}
            onChange={(event) => setHoney(event.target.value as HoneyStatus | "")}
          >
            <option value="">はちみつ：すべて</option>
            <option value="included">はちみつ付き</option>
            <option value="available">はちみつあり</option>
            <option value="unknown">未確認</option>
            <option value="not_available">なし</option>
          </select>
          <label>
            <input checked={lunch} type="checkbox" onChange={(event) => setLunch(event.target.checked)} />{" "}
            ランチあり
          </label>
          <label>
            <input
              checked={takeout}
              type="checkbox"
              onChange={(event) => setTakeout(event.target.checked)}
            />{" "}
            テイクアウト
          </label>
        </div>

        <div className="list-heading">
          <div>
            <span className="eyebrow">PIZZERIA LIST</span>
            <h2>{filtered.length}件のお店</h2>
          </div>
          <select aria-label="並び替え" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">おすすめ順</option>
            <option value="rating">評価順</option>
            <option value="reviews">口コミ数順</option>
          </select>
        </div>

        <div className="shop-grid">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
        {!filtered.length && <p className="empty">条件に合うお店がありません。絞り込みを変更してください。</p>}
      </section>
    </>
  );
}
