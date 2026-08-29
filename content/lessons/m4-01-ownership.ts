import type { Lesson } from "./types";

export const m4_01_ownership: Lesson = {
  id: "m4-01-ownership",
  milestone: "M4",
  title: "所有権: 値には持ち主が1人だけいる",
  body: `## Rust最大の特徴: 所有権

ここからがRust学習で一番難しく、そして一番大事なところです。焦らず読み進めてください。

Rustでは、\`String\` のようにヒープ(メモリの動的な領域)にデータを持つ値には、
「所有権(ownership)」という考え方があります。ルールはたった3つです。

1. それぞれの値には、所有者(持ち主)と呼ばれる変数がただ1つ存在する
2. 所有者がスコープ(\`{ }\`の範囲)を抜けると、値は破棄される
3. 値を別の変数に代入したり、関数に渡したりすると、所有権が「移動(move)」する

3番目が特に重要です。

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1; // 所有権がs1からs2に移動する
println!("{}", s1); // エラー！s1はもう使えない
\`\`\`

これは値をコピーしているわけではなく、「持ち主が変わった」という意味です。
古い持ち主(\`s1\`)は無効になります。関数に値を渡すときも同じことが起こります。

\`\`\`rust
fn takes_ownership(s: String) {
    println!("{}", s);
} // ここでsはスコープを抜けて破棄される

let name = String::from("Ferris");
takes_ownership(name); // nameの所有権がtakes_ownershipに移動する
println!("{}", name);  // エラー！nameはもう使えない
\`\`\`

### 複製したいときは.clone()

どうしても同じ値を2つの場所で使いたい場合は、\`.clone()\` で複製できます。
ただし複製にはコストがかかるので、本当に必要なときだけ使いましょう。
(次のレッスンで学ぶ「借用」を使えば、複製せずに済むことも多くあります)

### 演習

下のコードは \`name\` をtakes_ownershipに渡した後、もう一度使おうとしてエラーになります。
\`.clone()\` を使って、関数呼び出しの後でも \`name\` を使えるように直してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch04-01-what-is-ownership.html",
  exercise: {
    prompt: "「Ferris」が2回表示されるように、所有権のエラーを直してください。",
    starterCode: `fn takes_ownership(s: String) {
    println!("{}", s);
}

fn main() {
    let name = String::from("Ferris");
    takes_ownership(name);
    println!("{}", name); // ここでエラーになる
}
`,
    checks: [{ kind: "stdout_exact", expected: "Ferris\nFerris\n" }],
    hints: [
      "エラーメッセージに `value moved here` とあるはずです。これがM1で見たE0382と同じ種類のエラーです。",
      "`takes_ownership(name);` を `takes_ownership(name.clone());` に変えてみましょう。",
    ],
    solution: `fn takes_ownership(s: String) {
    println!("{}", s);
}

fn main() {
    let name = String::from("Ferris");
    takes_ownership(name.clone());
    println!("{}", name);
}
`,
  },
};
