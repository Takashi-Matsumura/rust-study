import type { Lesson } from "./types";

export const m1_02_numeric_types: Lesson = {
  id: "m1-02-numeric-types",
  milestone: "M1",
  title: "数値・真偽値・文字の型と型注釈",
  body: `## 基本的な型

Rustにはいくつかの基本の型(プリミティブ型)があります。

| 種類 | 例 | 型名 |
|---|---|---|
| 整数 | \`20\` | \`i32\`(符号あり) / \`u32\`(符号なし) など |
| 浮動小数点数 | \`172.5\` | \`f64\` |
| 真偽値 | \`true\` / \`false\` | \`bool\` |
| 文字 | \`'A'\` (1文字) | \`char\` |

文字列 \`"..."\` と文字 \`'...'\` は別物です。文字列は二重引用符、
1文字だけを表す文字は一重引用符で書きます。

### 型注釈

Rustは代入する値から型を推論してくれるので、多くの場合は型を省略できます。
それでも、変数の意図を明確にしたいときや、推論できない場面では
\`: 型名\` という形で型注釈を書きます。

\`\`\`rust
let age: u32 = 20;
let height: f64 = 172.5;
\`\`\`

### 演習

型注釈を使って4つの変数(整数・浮動小数点数・真偽値・文字)を宣言し、
まとめて表示するプログラムを完成させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch03-02-data-types.html",
  exercise: {
    prompt:
      "型注釈を付けて、ageをu32型で20、heightをf64型で172.5、is_studentをbool型でtrue、" +
      "gradeをchar型で'A'として宣言し、「age=20 height=172.5 is_student=true grade=A」と表示してください。",
    starterCode: `fn main() {
    // TODO: 型注釈付きで4つの変数を宣言してください
    let age = 20;
    let height = 172.5;
    let is_student = true;
    let grade = 'A';

    println!("age={} height={} is_student={} grade={}", age, height, is_student, grade);
}
`,
    checks: [
      { kind: "stdout_exact", expected: "age=20 height=172.5 is_student=true grade=A\n" },
    ],
    hints: [
      "型注釈は `let 変数名: 型名 = 値;` の形です。例: `let age: u32 = 20;`",
      "文字は一重引用符で囲みます。例: `let grade: char = 'A';`",
    ],
    solution: `fn main() {
    let age: u32 = 20;
    let height: f64 = 172.5;
    let is_student: bool = true;
    let grade: char = 'A';

    println!("age={} height={} is_student={} grade={}", age, height, is_student, grade);
}
`,
  },
};
