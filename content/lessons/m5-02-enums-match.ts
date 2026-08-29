import type { Lesson } from "./types";

export const m5_02_enums_match: Lesson = {
  id: "m5-02-enums-match",
  milestone: "M5",
  title: "enum・match・Option<T>",
  body: `## enum: いくつかの選択肢を表す型

\`enum\` は「いくつかの決まった種類のうちどれか1つ」を表す型です。

\`\`\`rust
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
\`\`\`

### matchで分岐する

\`match\` は \`enum\` の値によって処理を分けるための仕組みです。
\`if\` と大きく違うのは、**すべての可能性を網羅しないとコンパイルが通らない**ことです。
書き漏らしがあれば、実行前にコンパイラが教えてくれます。

### Option<T>: 「値があるかもしれないし、ないかもしれない」

Rustには他の言語にあるような \`null\` がありません。代わりに \`Option<T>\` という
enumを使います。

\`\`\`rust
enum Option<T> {
    Some(T), // 値がある場合
    None,    // 値がない場合
}
\`\`\`

\`match\` と組み合わせることで、値がある場合とない場合の両方を
安全に扱えます。

\`\`\`rust
fn describe(n: Option<i32>) -> String {
    match n {
        Some(x) => format!("値は{}", x),
        None => String::from("値なし"),
    }
}
\`\`\`

### 演習

\`describe\` 関数を完成させ、\`Some(5)\` と \`None\` それぞれの結果を表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch06-02-match.html",
  exercise: {
    prompt: "describe(Some(5))で「値は5」、describe(None)で「値なし」と表示してください。",
    starterCode: `fn describe(n: Option<i32>) -> String {
    match n {
        Some(x) => format!("値は{}", x),
        // TODO: Noneの場合の処理を追加してください
    }
}

fn main() {
    println!("{}", describe(Some(5)));
    println!("{}", describe(None));
}
`,
    checks: [{ kind: "stdout_exact", expected: "値は5\n値なし\n" }],
    hints: [
      "`match` はOption<T>のすべての可能性(SomeとNone)を書く必要があります。",
      "`None => String::from(\"値なし\"),` を追加してください。",
    ],
    solution: `fn describe(n: Option<i32>) -> String {
    match n {
        Some(x) => format!("値は{}", x),
        None => String::from("値なし"),
    }
}

fn main() {
    println!("{}", describe(Some(5)));
    println!("{}", describe(None));
}
`,
  },
};
