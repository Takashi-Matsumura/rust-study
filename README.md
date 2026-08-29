# Rust学習

プログラミングがはじめての人のための、環境構築不要のRust学習Webアプリです。
ブラウザだけで「書く → 実行する → エラーを読む → 直す」のループを回しながら、
`fn main` から簡単なToDo管理CLIを書けるようになるまでを、M0〜M10のマイルストーンで学べます。

## スクリーンショット

|                                            学習マップ                                            |                                              レッスン画面                                              |                                             エラーの日本語解説                                             |
| :------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![学習マップ: M0〜M10のマイルストーンと進捗が並ぶトップページ](docs/screenshots/top.jpg) | ![レッスン画面: 解説・エディタ・採点結果・実行結果が並ぶ3ペイン](docs/screenshots/lesson.jpg) | ![Playground画面でrustcのエラーを日本語で解説するカード](docs/screenshots/playground-error.jpg) |

## 特徴

- **環境構築が不要** — rustup・cargoのインストールなしに、ブラウザだけでRustのコードを書いて実行できます(公式 [Rust Playground](https://play.rust-lang.org/) をサーバ経由で利用)
- **M0〜M10の学習カリキュラム** — 「Hello, world!」から所有権・構造体・トレイト・エラー処理を経て、ToDo管理CLIを書き上げるまでの22レッスン
- **演習の自動採点** — 出力の一致判定や`#[test]`ベースの単体テストで、書いたコードが正しいかその場で確認できます
- **rustcエラーの日本語解説** — `E0382`(ムーブ済みの値)のような初学者がつまずきやすいエラーを、日本語で「何が起きたか」「どう直すか」まで解説します
- **進捗の自動保存** — 完了したレッスンはブラウザの`localStorage`に保存され、次回アクセス時も続きから学習できます
- **自由に書けるPlayground** — レッスンを離れて自由にRustコードを試せる画面も用意しています

## 技術スタック

- [Next.js](https://nextjs.org/) 16 (App Router / Turbopack)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [CodeMirror 6](https://codemirror.net/)(`@uiw/react-codemirror`) — コードエディタ
- [Rust Playground API](https://play.rust-lang.org/) — コードの実行基盤

## セットアップ

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開くと学習マップが表示されます。

## ディレクトリ構成

```
app/
  page.tsx                  学習マップ(トップページ)
  learn/[lessonId]/         レッスン画面
  playground/               自由記述のPlayground
  api/run/                  コード実行を中継するAPI Route
lib/
  runner/                   Rustコード実行の抽象化とPlayground実装
  grading.ts                演習の自動採点ロジック
  rustc-errors.ts           rustcエラーコード→日本語解説
  progress.ts               学習進捗(localStorage)
content/
  curriculum.ts             M0〜M10のマイルストーン定義
  lessons/                  各レッスンの本文・演習・採点条件
components/                 UIコンポーネント
```

## ライセンス

[MIT](LICENSE)
