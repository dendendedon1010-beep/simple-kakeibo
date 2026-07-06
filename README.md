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
npm run preview
```

## GitHub Pagesで公開する手順

このリポジトリ名は `simple-kakeibo` なので、`vite.config.ts` の `base` は `/simple-kakeibo/` に設定しています。リポジトリ名を変更した場合は、`repositoryName` も同じ名前に変更してください。リポジトリが `ユーザー名.github.io` または `組織名.github.io` の形式なら、`base` は `/` になります。

1. GitHubにこのリポジトリをpushします。
2. GitHubのリポジトリ画面で `Settings` → `Pages` を開きます。
3. `Build and deployment` の `Source` で `GitHub Actions` を選びます。
4. `main` ブランチにpushすると、`.github/workflows/deploy.yml` が `npm ci` → `npm run build` → `dist` のアップロード → GitHub Pagesへのデプロイを自動実行します。
5. `Actions` タブで `Deploy to GitHub Pages` ワークフローが成功していることを確認します。
6. 成功後、`Settings` → `Pages` に表示されるURL、またはActionsのデプロイ結果に表示されるURLを開きます。

公開URLは通常、通常リポジトリなら `https://<ユーザー名>.github.io/simple-kakeibo/`、ユーザー/組織Pagesリポジトリなら `https://<ユーザー名>.github.io/` です。

## GitHub Pagesで真っ白になる場合の確認ポイント

- `vite.config.ts` の `base` がリポジトリ名と一致しているか確認してください。
- `Settings` → `Pages` → `Source` が `GitHub Actions` になっているか確認してください。
- `Actions` タブでビルドとデプロイが成功しているか確認してください。
- このアプリはReact Routerを使っていないため、GitHub PagesのSPAルーティング404対策は不要です。
