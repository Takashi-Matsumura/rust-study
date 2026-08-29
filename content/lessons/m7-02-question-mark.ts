import type { Lesson } from "./types";

export const m7_02_question_mark: Lesson = {
  id: "m7-02-question-mark",
  milestone: "M7",
  title: "?演算子でエラーを伝播する",
  body: `## 毎回matchを書くのは大変

前のレッスンで \`Result\` を \`match\` で処理する方法を学びましたが、
1つの関数の中で失敗しうる処理が何度もあると、\`match\` だらけになってしまいます。

\`?\` 演算子を使うと、「成功していれば中身を取り出して次に進み、失敗していれば
その場でこの関数からErrを返す」という処理を1文字で書けます。

\`\`\`rust
fn parse_and_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?; // 失敗したらここで関数がErrを返す
    Ok(n * 2)
}
\`\`\`

\`?\` を使う関数自身も \`Result\` を返す必要があります。呼び出す側では、
これまで通り \`match\` で成功・失敗を処理します。

\`\`\`rust
match parse_and_double("21") {
    Ok(n) => println!("結果: {}", n),
    Err(_) => println!("エラーが発生しました"),
}
\`\`\`

### 演習

\`?\` 演算子を使って \`parse_and_double\` を完成させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch09-02-recoverable-errors-with-result.html",
  exercise: {
    prompt: "parse_and_double(\"21\")の結果である「結果: 42」を表示してください。",
    starterCode: `fn parse_and_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>(); // TODO: ?を使ってi32を取り出してください
    Ok(n * 2)
}

fn main() {
    match parse_and_double("21") {
        Ok(n) => println!("結果: {}", n),
        Err(_) => println!("エラーが発生しました"),
    }
}
`,
    checks: [{ kind: "stdout_exact", expected: "結果: 42\n" }],
    hints: [
      "`s.parse::<i32>()` の戻り値は `Result<i32, _>` なので、そのままでは `* 2` できません。",
      "`let n = s.parse::<i32>()?;` のように末尾に `?` を付けてください。",
    ],
    solution: `fn parse_and_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n * 2)
}

fn main() {
    match parse_and_double("21") {
        Ok(n) => println!("結果: {}", n),
        Err(_) => println!("エラーが発生しました"),
    }
}
`,
  },
};
