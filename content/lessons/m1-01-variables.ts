import type { Lesson } from "./types";

export const m1_01_variables: Lesson = {
  id: "m1-01-variables",
  milestone: "M1",
  title: "変数と可変性: letとmut",
  body: `## 変数を作る

Rustでは \`let\` で変数を作ります。

\`\`\`rust
let x = 5;
\`\`\`

他の多くの言語と違い、Rustの変数は**デフォルトで不変**(immutable)です。
つまり、一度 \`let\` で値を決めたら、後から書き換えることはできません。

\`\`\`rust
let x = 5;
x = 6; // エラーになる！
\`\`\`

これは不便に思えるかもしれませんが、「この変数はどこかで書き換えられているのでは」
と疑う必要がなくなるという利点があります。バグの温床を減らすためのRustの設計です。

### 書き換えたいときは mut

もし値を後から変更したいなら、\`mut\` (mutableの略) を付けて宣言します。

\`\`\`rust
let mut x = 5;
x = 6; // OK
\`\`\`

### 演習

下のコードは、\`x\` を書き換えようとしてコンパイルエラーになります。
エラーメッセージを読んで、\`mut\` を正しい場所に追加し、\`10\` と \`20\` が
順番に表示されるように直してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-01-variables-and-mutability.html",
  exercise: {
    prompt: "コンパイルが通り、10と20が順番に表示されるように直してください。",
    starterCode: `fn main() {
    let x = 10;
    println!("{}", x);
    x = 20;
    println!("{}", x);
}
`,
    checks: [{ kind: "stdout_exact", expected: "10\n20\n" }],
    hints: [
      "エラーメッセージに `cannot assign twice to immutable variable` のようなことが書かれているはずです。",
      "`let x = 10;` を `let mut x = 10;` に変えてみましょう。",
    ],
    solution: `fn main() {
    let mut x = 10;
    println!("{}", x);
    x = 20;
    println!("{}", x);
}
`,
  },
};
