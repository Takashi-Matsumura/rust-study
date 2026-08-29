import type { Lesson } from "./types";

export const m6_03_hashmap: Lesson = {
  id: "m6-03-hashmap",
  milestone: "M6",
  title: "HashMap<K, V>: キーと値の組を保存する",
  body: `## HashMapとは

\`HashMap<K, V>\` は、「キー」と「値」の組を保存するコレクションです。
他の言語の「辞書」や「連想配列」に近いものです。

\`\`\`rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Alice"), 90);
scores.insert(String::from("Bob"), 80);
\`\`\`

### 値を取り出す

\`.get(&key)\` で値を取り出せますが、そのキーが存在しない可能性があるため、
戻り値は \`Option<&V>\` になります。M5で学んだ \`match\` と組み合わせて、
「見つかった場合」と「見つからなかった場合」の両方を扱います。

\`\`\`rust
match scores.get("Alice") {
    Some(score) => println!("得点: {}", score),
    None => println!("見つかりません"),
}
\`\`\`

### 演習

\`HashMap\` に2人分の得点を保存し、\`Alice\` の得点を取り出して表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch08-03-hash-maps.html",
  exercise: {
    prompt: "AliceのHashMapを作成し、Aliceの得点(90)を「Aliceの得点: 90」の形式で表示してください。",
    starterCode: `use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Alice"), 90);
    scores.insert(String::from("Bob"), 80);

    // TODO: scores.get("Alice")の結果をmatchで処理してください
}
`,
    checks: [{ kind: "stdout_exact", expected: "Aliceの得点: 90\n" }],
    hints: [
      "`.get(\"Alice\")` は `Option<&i32>` を返します。`match` で `Some`/`None` を処理します。",
      "`Some(score) => println!(\"Aliceの得点: {}\", score),` と `None => println!(\"見つかりません\"),` を書きます。",
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Alice"), 90);
    scores.insert(String::from("Bob"), 80);

    match scores.get("Alice") {
        Some(score) => println!("Aliceの得点: {}", score),
        None => println!("見つかりません"),
    }
}
`,
  },
};
