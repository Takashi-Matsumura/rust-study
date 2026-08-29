import type { Lesson } from "./types";

export const m2_02_loops: Lesson = {
  id: "m2-02-loops",
  milestone: "M2",
  title: "loop・while・forで繰り返す",
  body: `## 繰り返し処理

Rustには繰り返し処理を書く方法が3つあります。

- \`loop\`: 明示的に \`break\` するまで無限に繰り返す
- \`while\`: 条件がtrueの間繰り返す
- \`for\`: コレクションや範囲の要素を1つずつ処理する

初学者が最もよく使うのは \`for\` と「範囲(Range)」の組み合わせです。

\`\`\`rust
for i in 1..=5 {
    println!("{}", i);
}
\`\`\`

\`1..=5\` は1から5まで(5を含む)の範囲です。\`1..5\` のように \`=\` を付けないと、
5を含まない(1から4まで)範囲になります。この違いはよく間違えるので注意してください。

### 演習

\`for\` と範囲を使って、1から5までの合計を計算し、\`合計: 15\` と表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-05-control-flow.html",
  exercise: {
    prompt: "1から5までの合計を計算し「合計: 15」と表示してください。",
    starterCode: `fn main() {
    let mut sum = 0;

    // TODO: for i in 1..=5 でsumに加算してください

    println!("合計: {}", sum);
}
`,
    checks: [{ kind: "stdout_exact", expected: "合計: 15\n" }],
    hints: [
      "`for i in 1..=5 { sum += i; }` の形で書きます。",
      "`1..=5` は5を含む範囲です。`1..5` だと5を含まないので合計が変わってしまいます。",
    ],
    solution: `fn main() {
    let mut sum = 0;

    for i in 1..=5 {
        sum += i;
    }

    println!("合計: {}", sum);
}
`,
  },
};
