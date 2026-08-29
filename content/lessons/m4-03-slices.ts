import type { Lesson } from "./types";

export const m4_03_slices: Lesson = {
  id: "m4-03-slices",
  milestone: "M4",
  title: "スライス: 値の一部を借用する",
  body: `## スライスとは

スライスは、コレクション(文字列や配列など)の**一部分への参照**です。
所有権を持たず、あくまで「借用」の一種です。

文字列の一部を取り出したいときは、\`&s[開始..終了]\` という書き方をします。

\`\`\`rust
let s = String::from("Hello Rust");
let word = &s[0..5]; // "Hello"
\`\`\`

\`0..5\` は「0文字目から5文字目の手前まで」という意味です(終了位置は含みません)。
これはM2で学んだ範囲(Range)と同じ書き方です。

文字列全体を指す型としては \`&str\` があります。実は文字列リテラル
(\`"Hello"\` のように直接書いた文字列)は、すべて \`&str\` 型です。
\`String\` が「所有権を持つ文字列」、\`&str\` が「文字列への参照」と
覚えておくとよいでしょう。

### 演習

\`"Hello Rust"\` という文字列から、\`Rust\` の部分だけをスライスで取り出して表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch04-03-slices.html",
  exercise: {
    prompt: "「Hello Rust」から「Rust」の部分だけをスライスで取り出して表示してください。",
    starterCode: `fn main() {
    let s = String::from("Hello Rust");

    // TODO: sから"Rust"の部分をスライスで取り出してください
    let word = "";

    println!("{}", word);
}
`,
    checks: [{ kind: "stdout_exact", expected: "Rust\n" }],
    hints: [
      "\"Hello Rust\" は H(0) e(1) l(2) l(3) o(4) (5) R(6) u(7) s(8) t(9) と数えます。",
      "`&s[6..10]` のように書くと、6文字目から10文字目の手前まで(つまり\"Rust\")を取り出せます。",
    ],
    solution: `fn main() {
    let s = String::from("Hello Rust");
    let word = &s[6..10];

    println!("{}", word);
}
`,
  },
};
