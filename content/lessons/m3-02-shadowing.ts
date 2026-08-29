import type { Lesson } from "./types";

export const m3_02_shadowing: Lesson = {
  id: "m3-02-shadowing",
  milestone: "M3",
  title: "シャドーイング: 同じ名前で変数を作り直す",
  body: `## シャドーイングとは

M1で学んだ通り、Rustの変数はデフォルトで書き換えられません。
しかし、同じ名前で \`let\` をもう一度使うことは許されています。
これを「シャドーイング(shadowing)」と呼びます。

\`\`\`rust
let x = 5;
let x = x + 1; // 新しいxが古いxを覆い隠す
println!("{}", x); // 6
\`\`\`

\`mut\` との違いは、**型を変えられる**ことです。例えば文字列を数値に
変換するときによく使われます。

\`\`\`rust
let input = "21";              // &str型
let input = input.parse::<i32>().unwrap(); // i32型に変わる
\`\`\`

\`.parse::<i32>()\` は文字列を数値に変換するメソッドです。変換に失敗する
可能性があるため \`Result\` という型を返しますが、これはM7で詳しく学びます。
今は \`.unwrap()\` を付けて「変換できた前提で値を取り出す」と理解してください。

### 演習

文字列 \`"21"\` を数値に変換し、2倍にした値を表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-01-variables-and-mutability.html",
  exercise: {
    prompt: "文字列\"21\"を数値に変換し、2倍にした42を表示してください。",
    starterCode: `fn main() {
    let input = "21";

    // TODO: シャドーイングでinputを文字列からi32に変換してください

    println!("{}", input * 2);
}
`,
    checks: [{ kind: "stdout_exact", expected: "42\n" }],
    hints: [
      "同じ名前 `input` で `let` をもう一度使うと、型を変えられます。",
      "`let input = input.parse::<i32>().unwrap();` のように書きます。",
    ],
    solution: `fn main() {
    let input = "21";
    let input = input.parse::<i32>().unwrap();

    println!("{}", input * 2);
}
`,
  },
};
