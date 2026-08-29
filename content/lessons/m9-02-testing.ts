import type { Lesson } from "./types";

export const m9_02_testing: Lesson = {
  id: "m9-02-testing",
  milestone: "M9",
  title: "#[test]で自動テストを書く",
  body: `## ここまでの演習はどう採点されていたのか

実は、これまでの演習の一部は \`#[test]\` という仕組みを裏側で使って
自動採点していました。ここでその仕組み自体を学びます。

Rustでは、関数の上に \`#[test]\` と書くだけで、その関数を「テスト」として
実行できます。テストの中では \`assert_eq!(実際の値, 期待する値)\` を使い、
2つの値が一致するかどうかを確認します。一致しなければテストは失敗します。

\`\`\`rust
pub fn is_even(n: i32) -> bool {
    n % 2 == 0
}

#[cfg(test)]
mod tests {
    use super::*; // 外側(このファイル)の関数を使えるようにする

    #[test]
    fn four_is_even() {
        assert_eq!(is_even(4), true);
    }
}
\`\`\`

普段の開発では \`cargo test\` コマンドでこれらのテストをまとめて実行します。
テストを書いておくことで、後からコードを変更したときに
「以前動いていた部分が壊れていないか」をすぐ確認できます。

### 演習

\`is_even\` 関数を完成させてください。右側の「採点する」を押すと、
見えないところで複数のテストが実行され、すべて合格するかどうかが判定されます。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch11-01-writing-tests.html",
  exercise: {
    prompt: "is_even(4)がtrue、is_even(3)がfalseになるように実装してください。",
    starterCode: `pub fn is_even(n: i32) -> bool {
    false // TODO: nが偶数ならtrue、奇数ならfalseを返してください
}
`,
    checks: [
      {
        kind: "unit_test",
        testCode: `
#[cfg(test)]
mod grader {
    use super::*;

    #[test]
    fn even_true() {
        assert_eq!(is_even(4), true);
    }

    #[test]
    fn even_false() {
        assert_eq!(is_even(3), false);
    }
}
`,
      },
    ],
    hints: [
      "「割り切れる」は剰余(あまり)演算子 `%` で判定できます。",
      "`n % 2 == 0` はnが偶数のときtrueになります。",
    ],
    solution: `pub fn is_even(n: i32) -> bool {
    n % 2 == 0
}
`,
  },
};
