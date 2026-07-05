# Simple Kakeibo

React + Vite + TypeScriptで作った、ログインなし・サーバーなしのローカル家計簿Webアプリです。取引、カテゴリ、月予算はブラウザのlocalStorageに保存されます。

## 機能

- ホーム: 今月の収入・支出・残額・月予算残り、カテゴリ別支出
- 入力: 支出/収入、金額、日付、カテゴリ、メモの登録
- 履歴: 月別一覧、カテゴリ絞り込み、編集、削除
- 分析: カテゴリ別支出グラフ、日別支出グラフ
- 設定: 月予算、カテゴリ管理、JSONエクスポート/インポート、全データ削除

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`vite.config.ts` の `base: './'` により、GitHub Pagesのサブパス配信でも動作しやすい構成です。
