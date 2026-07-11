"use client";

import { useState } from "react";
import { wards } from "@/data/wards";

export function SubmitShopForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="success">
        <span>✓</span>
        <h2>情報を受け付けました</h2>
        <p>内容を確認し、掲載データの更新に役立てます。ご協力ありがとうございます。</p>
      </div>
    );
  }

  return (
    <form
      className="submit-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label>
        店名<span>必須</span>
        <input name="name" required placeholder="例：Pizzeria Osaka" />
      </label>
      <label>
        エリア・区<span>必須</span>
        <select name="ward" required defaultValue="">
          <option value="" disabled>
            区を選択
          </option>
          {wards.map((ward) => (
            <option key={ward.slug}>{ward.name}</option>
          ))}
        </select>
      </label>
      <label>
        Google Maps URL
        <input name="mapsUrl" type="url" placeholder="https://maps.google.com/..." />
      </label>
      <label>
        クアトロフォルマッジ提供情報<span>必須</span>
        <textarea name="info" required rows={4} placeholder="メニュー名、価格、はちみつの有無など" />
      </label>
      <label>
        確認できるURL
        <input name="sourceUrl" type="url" placeholder="公式メニューやSNS投稿のURL" />
      </label>
      <label>
        コメント
        <textarea name="comment" rows={4} placeholder="補足や修正してほしい内容" />
      </label>
      <label>
        投稿者メールアドレス <small>任意・公開されません</small>
        <input name="email" type="email" placeholder="you@example.com" />
      </label>
      <button className="primary-button" type="submit">
        情報を送信する
      </button>
      <p className="form-note">
        このMVPではブラウザ内で受付完了を表示します。実運用ではフォーム送信先やデータベース連携を追加できます。
      </p>
    </form>
  );
}
