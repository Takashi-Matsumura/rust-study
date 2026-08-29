import type { Lesson } from "./types";

export const m4_02_references: Lesson = {
  id: "m4-02-references",
  milestone: "M4",
  title: "参照と借用: 持ち主を変えずに値を使う",
  body: `## 借用(borrowing)という考え方

前のレッスンで、値を関数に渡すと所有権が移動してしまうことを学びました。
毎回 \`.clone()\` するのは無駄が多いので、Rustには「借用(borrowing)」という
仕組みがあります。値の持ち主を変えずに、一時的に「参照(reference)」を貸し出すのです。

参照には \`&\` を付けます。

\`\`\`rust
fn print_len(s: &String) {
    println!("{}", s.len());
} // sはただの参照なので、ここでも元の値は破棄されない

let name = String::from("Ferris");
print_len(&name);      // 参照を貸すだけ。所有権は移動しない
println!("{}", name);  // 引き続き使える！
\`\`\`

### 値を書き換えたいときは&mut

参照は基本的に「読み取り専用」です。値を書き換えたい場合は
\`&mut\` (可変参照)を使い、値を取り出すときは \`*\` (デリファレンス)を付けます。

\`\`\`rust
fn add_one(n: &mut i32) {
    *n += 1; // *を付けて中身を書き換える
}

let mut x = 5;
add_one(&mut x); // &mutで可変参照を渡す
println!("{}", x); // 6
\`\`\`

なお、ある値への可変参照(\`&mut\`)は同時に1つまでしか作れません。
これは「書き込み中に他の場所から読み書きされる」事故を防ぐルールで、
M1で扱ったエラー以外にも \`E0502\`・\`E0499\` のようなエラーコードとして現れます。
遭遇したら日本語解説を読んでみてください。

### 演習

\`add_one\` 関数を、可変参照を使って \`x\` を1増やせるように直してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch04-02-references-and-borrowing.html",
  exercise: {
    prompt: "xに1を加えた6を表示してください。",
    starterCode: `fn add_one(n: i32) {
    n += 1; // TODO: 可変参照を使って書き換えられるようにしてください
}

fn main() {
    let mut x = 5;
    add_one(x); // TODO: &mut xを渡すようにしてください
    println!("{}", x);
}
`,
    checks: [{ kind: "stdout_exact", expected: "6\n" }],
    hints: [
      "コンパイラは `mut n: i32` にすることを提案してきますが、それだけでは`x`は変わりません。i32は値がコピーされて渡されるため、関数の中だけで完結してしまいます。",
      "関数の引数を `n: &mut i32` に変え、関数の中では `*n += 1;` と書きます。",
      "呼び出し側は `add_one(&mut x);` のように `&mut` を付けて渡します。",
    ],
    solution: `fn add_one(n: &mut i32) {
    *n += 1;
}

fn main() {
    let mut x = 5;
    add_one(&mut x);
    println!("{}", x);
}
`,
  },
};
