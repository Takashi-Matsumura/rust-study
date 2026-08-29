import type { Lesson } from "./types";

export const m5_01_structs: Lesson = {
  id: "m5-01-structs",
  milestone: "M5",
  title: "struct: 関連するデータをまとめる",
  body: `## structでデータをまとめる

\`struct\` を使うと、関連するデータをひとまとまりの型として定義できます。

\`\`\`rust
struct Rectangle {
    width: u32,
    height: u32,
}

let rect = Rectangle { width: 30, height: 50 };
println!("{}", rect.width); // フィールドには.でアクセスする
\`\`\`

### メソッドを定義する

\`impl\` ブロックを使うと、その構造体に関連する関数(メソッド)を定義できます。
第一引数の \`&self\` は「このメソッドを呼び出した構造体自身への参照」です。

\`\`\`rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

let rect = Rectangle { width: 30, height: 50 };
println!("{}", rect.area()); // メソッドは rect.area() のように呼び出す
\`\`\`

### 演習

\`Rectangle\` の面積を計算する \`area\` メソッドを完成させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch05-03-method-syntax.html",
  exercise: {
    prompt: "幅30・高さ50の長方形の面積(1500)を「面積: 1500」の形式で表示してください。",
    starterCode: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        0 // TODO: widthとheightをかけた値を返してください
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("面積: {}", rect.area());
}
`,
    checks: [{ kind: "stdout_exact", expected: "面積: 1500\n" }],
    hints: [
      "構造体のフィールドには `self.width` のように `self.` を付けてアクセスします。",
      "`self.width * self.height` を(セミコロンなしで)返り値として書きます。",
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("面積: {}", rect.area());
}
`,
  },
};
