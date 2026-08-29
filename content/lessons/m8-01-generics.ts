import type { Lesson } from "./types";

export const m8_01_generics: Lesson = {
  id: "m8-01-generics",
  milestone: "M8",
  title: "ジェネリクス: 型を後から決める",
  body: `## 同じロジックを複数の型で使い回す

「2つの値を比較して大きい方を返す」処理は、\`i32\` でも \`f64\` でも
本質的には同じです。型ごとに関数を書く代わりに、ジェネリクス(型引数)を
使えば1つの関数にまとめられます。

\`\`\`rust
fn larger<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
\`\`\`

\`<T: PartialOrd>\` の部分がポイントです。

- \`T\` は「まだ決まっていない型」を表す型引数です
- \`: PartialOrd\` は「\`T\`は大小比較(\`>\`や\`<\`)ができる型に限る」という制約(トレイト境界)です

この制約がないと、\`a > b\` という比較そのものがコンパイルエラーになります。
「どんな型でも受け付けるが、比較はできる型だけ」という約束をコンパイラに伝えているのです。

### 演習

\`larger\` 関数を完成させ、\`3\` と \`7\` の大きい方を表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch10-01-syntax.html",
  exercise: {
    prompt: "larger(3, 7)の結果である7を表示してください。",
    starterCode: `fn larger<T: PartialOrd>(a: T, b: T) -> T {
    a // TODO: aとbを比較して大きい方を返してください
}

fn main() {
    println!("{}", larger(3, 7));
}
`,
    checks: [{ kind: "stdout_exact", expected: "7\n" }],
    hints: [
      "`if a > b { a } else { b }` という式を(セミコロンなしで)そのまま返り値にします。",
    ],
    solution: `fn larger<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

fn main() {
    println!("{}", larger(3, 7));
}
`,
  },
};
