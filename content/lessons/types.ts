/** 演習の採点方法 */
export type Check =
  | { kind: "stdout_exact"; expected: string }
  | { kind: "stdout_match"; pattern: string }
  /** 学習者コードの後ろに#[test]群を連結し、tests:trueで実行して判定する */
  | { kind: "unit_test"; testCode: string }
  | { kind: "compiles" };

export interface Exercise {
  prompt: string;
  starterCode: string;
  checks: Check[];
  /** 段階的に開示するヒント */
  hints: string[];
  solution: string;
}

export interface Lesson {
  id: string;
  milestone: string;
  title: string;
  /** Markdown形式の解説本文 */
  body: string;
  bookUrl?: string;
  exercise?: Exercise;
}
