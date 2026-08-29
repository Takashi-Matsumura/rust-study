import type { Lesson } from "./types";

export const m7_01_result: Lesson = {
  id: "m7-01-result",
  milestone: "M7",
  title: "Result<T, E>: 失敗するかもしれない処理を表す",
  body: `## Result<T, E>とは

M5で「値があるかもしれないし、ないかもしれない」ことを表す \`Option<T>\` を学びました。
\`Result<T, E>\` は似ていますが、「成功したか、失敗したか」を表します。

\`\`\`rust
enum Result<T, E> {
    Ok(T),  // 成功。中身は成功時の値
    Err(E), // 失敗。中身はエラーの情報
}
\`\`\`

文字列を数値に変換する \`.parse()\` は、変換に失敗するかもしれないため
\`Result\` を返します。

\`\`\`rust
let input = "42";
match input.parse::<i32>() {
    Ok(n) => println!("成功: {}", n),
    Err(_) => println!("失敗しました"),
}
\`\`\`

M3で \`.unwrap()\` を使いましたが、これは「失敗したらそこでプログラムを
異常終了(panic)させる」という荒っぽい方法です。\`match\` を使えば、
失敗したときにも適切な処理を書くことができます。

### 演習

\`"42"\` を数値に変換し、成功した場合は \`成功: 42\` と表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch09-02-recoverable-errors-with-result.html",
  exercise: {
    prompt: "\"42\"のparseに成功した場合「成功: 42」と表示してください。",
    starterCode: `fn main() {
    let input = "42";

    // TODO: input.parse::<i32>()の結果をmatchで処理してください
}
`,
    checks: [{ kind: "stdout_exact", expected: "成功: 42\n" }],
    hints: [
      "`match input.parse::<i32>() { ... }` の形で書きます。",
      "`Ok(n) => println!(\"成功: {}\", n),` と `Err(_) => println!(\"失敗しました\"),` の2つの腕が必要です。",
    ],
    solution: `fn main() {
    let input = "42";

    match input.parse::<i32>() {
        Ok(n) => println!("成功: {}", n),
        Err(_) => println!("失敗しました"),
    }
}
`,
  },
};
