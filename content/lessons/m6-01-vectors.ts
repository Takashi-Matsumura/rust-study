import type { Lesson } from "./types";

export const m6_01_vectors: Lesson = {
  id: "m6-01-vectors",
  milestone: "M6",
  title: "Vec<T>: 複数の値をまとめて持つ",
  body: `## Vec<T>とは

\`Vec<T>\` (ベクタ)は、同じ型の値を複数並べて持てるコレクションです。
配列と違い、後から要素を追加・削除して大きさを変えられます。

\`\`\`rust
let mut numbers = Vec::new();
numbers.push(10);
numbers.push(20);
numbers.push(30);
\`\`\`

\`vec![10, 20, 30]\` というマクロを使えば、最初から値を入れて作ることもできます。

### for でVecを1つずつ処理する

M2で学んだ \`for\` は、\`Vec\` の要素を1つずつ取り出すのにも使えます。

\`\`\`rust
let mut sum = 0;
for n in &numbers {
    sum += n;
}
\`\`\`

\`&numbers\` と \`&\` を付けているのは、M4で学んだ「借用」です。もし \`&\` を
付けずに \`for n in numbers\` と書くと、\`numbers\` の所有権がループに移動してしまい、
ループの後で \`numbers\` を使おうとするとエラーになります。

### 演習

\`push\` で3つの数値を追加し、\`for\` で合計を計算して表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch08-01-vectors.html",
  exercise: {
    prompt: "10, 20, 30をpushし、forループで合計(60)を計算して「合計: 60」と表示してください。",
    starterCode: `fn main() {
    let mut numbers = Vec::new();
    // TODO: 10, 20, 30をpushしてください

    let mut sum = 0;
    // TODO: forループでsumに加算してください

    println!("合計: {}", sum);
}
`,
    checks: [{ kind: "stdout_exact", expected: "合計: 60\n" }],
    hints: [
      "`numbers.push(10);` のように3回pushします。",
      "`for n in &numbers { sum += n; }` のように書きます。",
    ],
    solution: `fn main() {
    let mut numbers = Vec::new();
    numbers.push(10);
    numbers.push(20);
    numbers.push(30);

    let mut sum = 0;
    for n in &numbers {
        sum += n;
    }

    println!("合計: {}", sum);
}
`,
  },
};
