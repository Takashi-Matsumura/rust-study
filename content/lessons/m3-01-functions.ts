import type { Lesson } from "./types";

export const m3_01_functions: Lesson = {
  id: "m3-01-functions",
  milestone: "M3",
  title: "関数を作る",
  body: `## 関数の定義

\`fn\` を使うと、\`main\` 以外の関数も自由に作れます。

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
\`\`\`

- 引数には必ず型注釈が必要です(\`a: i32\`)。
- 戻り値の型は \`->\` の後に書きます。
- 関数の最後の行が \`;\` (セミコロン) で終わっていなければ、その行の値がそのまま
  戻り値になります。これを「式(expression)」と呼びます。

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    a + b   // セミコロンがないので、これが戻り値になる
}
\`\`\`

もし \`a + b;\` とセミコロンを付けてしまうと、それは「文(statement)」になり
何も返さなくなってしまいます。これは初学者がよく踏む間違いです。

### 演習

2つの整数を受け取り、その和を返す関数 \`add\` を完成させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-03-how-functions-work.html",
  exercise: {
    prompt: "add(3, 4) の結果である 7 を表示してください。",
    starterCode: `fn add(a: i32, b: i32) -> i32 {
    // TODO: aとbの和を返してください
}

fn main() {
    let result = add(3, 4);
    println!("{}", result);
}
`,
    checks: [{ kind: "stdout_exact", expected: "7\n" }],
    hints: [
      "`a + b` とだけ書き、末尾にセミコロンを付けないと、その値が戻り値になります。",
      "`return a + b;` と書いても同じ意味になります(明示的にreturnする書き方)。",
    ],
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(3, 4);
    println!("{}", result);
}
`,
  },
};
