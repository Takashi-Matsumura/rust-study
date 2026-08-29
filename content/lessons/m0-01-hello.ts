import type { Lesson } from "./types";

export const m0_01_hello: Lesson = {
  id: "m0-01-hello",
  milestone: "M0",
  title: "はじめの一歩: Hello, world!",
  body: `## プログラムの入口

Rustのプログラムは必ず \`fn main() { ... }\` という関数から実行が始まります。
\`fn\` は「関数を作りますよ」というキーワード、\`main\` はその関数の名前です。
プログラムを実行すると、まずこの \`main\` 関数の中身が上から順に実行されます。

\`println!\` は画面に文字を表示する命令です。末尾に \`!\` が付いているのは、
これが「マクロ」と呼ばれる特別な仕組みだからですが、今は
「文字を表示する呪文」くらいの理解で構いません。

行の終わりには \`;\` (セミコロン) を付けます。これを忘れるとエラーになります。
初学者のうちはこの手のエラーによく出会いますが、Rustのエラーメッセージは
「どこが」「なぜ」問題なのかを具体的に教えてくれます。焦らず読めば大丈夫です。

### 演習

右のエディタに用意された雛形を直し、\`Hello, Rust!\` と表示させてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch01-02-hello-world.html",
  exercise: {
    prompt: "`Hello, Rust!` と表示するプログラムを完成させてください。",
    starterCode: `fn main() {
    // ここに println! を使って "Hello, Rust!" を表示してみましょう
}
`,
    checks: [{ kind: "stdout_exact", expected: "Hello, Rust!\n" }],
    hints: [
      "`println!(\"表示したい文字列\");` という形で書きます。",
      "文字列は二重引用符 `\"` で囲みます。例: `println!(\"Hello, Rust!\");`",
    ],
    solution: `fn main() {
    println!("Hello, Rust!");
}
`,
  },
};
