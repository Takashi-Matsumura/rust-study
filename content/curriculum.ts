export interface Milestone {
  id: string;
  title: string;
  goal: string;
  /** The Book 日本語版の対応章(表示用の補足) */
  bookChapter: string;
}

/**
 * 学習ゴール: ファイルに保存されるToDo管理CLIを自分で設計して書き切る。
 * M0からM10まで順に進めることでそこへ到達する。
 */
export const MILESTONES: Milestone[] = [
  {
    id: "M0",
    title: "はじめの一歩",
    goal: "fn mainとprintln!を書いて動かす。エラーメッセージを恐れない",
    bookChapter: "1章 事始め",
  },
  {
    id: "M1",
    title: "値と型",
    goal: "let/mut、整数・浮動小数・bool・char、型注釈",
    bookChapter: "3章",
  },
  {
    id: "M2",
    title: "制御フロー",
    goal: "if / loop / while / for / 範囲",
    bookChapter: "3章",
  },
  {
    id: "M3",
    title: "関数とスコープ",
    goal: "引数・戻り値・式と文の違い・シャドーイング",
    bookChapter: "3章",
  },
  {
    id: "M4",
    title: "所有権と借用",
    goal: "ムーブ / & / &mut / スライス(最大の山)",
    bookChapter: "4章",
  },
  {
    id: "M5",
    title: "struct・enum・match",
    goal: "データを型で表現する。Option<T>とmatchの網羅性",
    bookChapter: "5・6章",
  },
  {
    id: "M6",
    title: "コレクション",
    goal: "Vec<T> / String / HashMap<K, V>",
    bookChapter: "8章",
  },
  {
    id: "M7",
    title: "エラー処理",
    goal: "Result<T, E> / ? / panic!の使い分け",
    bookChapter: "9章",
  },
  {
    id: "M8",
    title: "トレイトとジェネリクス",
    goal: "impl / トレイト境界 / derive",
    bookChapter: "10章",
  },
  {
    id: "M9",
    title: "Cargo・モジュール・テスト",
    goal: "mod / use / #[test] / プロジェクト構成",
    bookChapter: "7・11章",
  },
  {
    id: "M10",
    title: "総合課題: ToDo CLI",
    goal: "標準入力・ファイルI/O・コマンドライン引数",
    bookChapter: "12章",
  },
];
