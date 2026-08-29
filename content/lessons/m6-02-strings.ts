import type { Lesson } from "./types";

export const m6_02_strings: Lesson = {
  id: "m6-02-strings",
  milestone: "M6",
  title: "文字列を組み立てる",
  body: `## Stringとformat!

M4で \`String\` (所有権を持つ文字列)と \`&str\` (文字列への参照)の違いに
触れました。ここでは文字列を組み立てる方法を学びます。

\`format!\` マクロは、\`println!\` と同じ書き方で文字列を作れます。
違いは、画面に表示する代わりに \`String\` として値を返すことです。

\`\`\`rust
let name = "Rust";
let greeting = format!("{}が好きです", name);
// greetingは"Rustが好きです"というString
\`\`\`

その他によく使う操作:

- \`.push_str(&s)\`: 末尾に文字列を追加する
- \`+\` 演算子: 2つの文字列を連結する(左辺は\`String\`である必要がある)
- \`.len()\`: 文字列のバイト数を取得する

### 演習

\`format!\` を使って、2つの文字列から挨拶文を組み立てて表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch08-02-strings.html",
  exercise: {
    prompt:
      "first(\"Rust\")とsecond(\"学習\")を使い、format!で「Rustを学習する」を組み立てて表示してください。",
    starterCode: `fn main() {
    let first = String::from("Rust");
    let second = "学習";

    // TODO: format!でgreetingを組み立ててください
    let greeting = String::new();

    println!("{}", greeting);
}
`,
    checks: [{ kind: "stdout_exact", expected: "Rustを学習する\n" }],
    hints: [
      "`format!(\"{}を{}する\", first, second)` のように書きます。",
      "`println!` と同じ \"{}\" のプレースホルダーが使えます。",
    ],
    solution: `fn main() {
    let first = String::from("Rust");
    let second = "学習";

    let greeting = format!("{}を{}する", first, second);

    println!("{}", greeting);
}
`,
  },
};
