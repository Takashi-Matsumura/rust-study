import type { Lesson } from "./types";

export const m2_01_if: Lesson = {
  id: "m2-01-if",
  milestone: "M2",
  title: "if式で条件分岐する",
  body: `## 条件によって処理を分ける

\`if\` を使うと、条件によって実行する処理を変えられます。

\`\`\`rust
if 条件 {
    // 条件がtrueのときの処理
} else {
    // それ以外のときの処理
}
\`\`\`

他の言語と違う点として、条件は必ず \`bool\` (true/false) でなければなりません。
\`if score { ... }\` のように数値をそのまま条件に使うことはできません。

\`else if\` を挟めば、3つ以上の分岐も書けます。

\`\`\`rust
if score >= 80 {
    println!("優");
} else if score >= 60 {
    println!("良");
} else {
    println!("不可");
}
\`\`\`

### 演習

\`score\` が60以上なら \`合格\`、そうでなければ \`不合格\` と表示するプログラムを完成させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-05-control-flow.html",
  exercise: {
    prompt: "scoreが60以上なら「合格」、そうでなければ「不合格」と表示してください。",
    starterCode: `fn main() {
    let score = 82;

    // TODO: if/elseでscoreを判定してください
}
`,
    checks: [{ kind: "stdout_exact", expected: "合格\n" }],
    hints: [
      "`if score >= 60 { ... } else { ... }` の形で書きます。",
      "分岐の中では `println!(\"合格\");` や `println!(\"不合格\");` を書きます。",
    ],
    solution: `fn main() {
    let score = 82;

    if score >= 60 {
        println!("合格");
    } else {
        println!("不合格");
    }
}
`,
  },
};
