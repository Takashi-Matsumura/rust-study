import type { Lesson } from "./types";

export const m9_01_modules: Lesson = {
  id: "m9-01-modules",
  milestone: "M9",
  title: "モジュールでコードを整理する",
  body: `## modでまとめる

プログラムが大きくなってくると、関連する関数をグループ分けしたくなります。
\`mod\` を使うと、関数や型をまとめた「モジュール」を作れます。

\`\`\`rust
mod math {
    pub fn square(n: i32) -> i32 {
        n * n
    }
}
\`\`\`

モジュールの外から中の関数を使うには、\`モジュール名::関数名\` と書きます。
また、モジュールの中の関数はデフォルトでは非公開なので、外から呼び出すには
\`pub\` (public)を付ける必要があります。

\`\`\`rust
fn main() {
    println!("{}", math::square(4)); // 16
}
\`\`\`

毎回 \`math::\` と書くのが面倒なときは、\`use\` を使って名前を持ち込めます。

\`\`\`rust
use math::square;
println!("{}", square(4));
\`\`\`

実際のプロジェクトでは、モジュールは複数のファイルに分割することもできますが、
考え方は今回学んだものと同じです。

### 演習

\`math\` モジュールに \`square\` 関数を実装し、\`4\` の2乗を表示してください。`,
  bookUrl:
    "https://doc.rust-jp.rs/book-ja/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html",
  exercise: {
    prompt: "math::square(4)の結果である16を表示してください。",
    starterCode: `mod math {
    pub fn square(n: i32) -> i32 {
        0 // TODO: nの2乗を返してください
    }
}

fn main() {
    println!("{}", math::square(4));
}
`,
    checks: [{ kind: "stdout_exact", expected: "16\n" }],
    hints: ["`n * n` を(セミコロンなしで)返り値として書きます。"],
    solution: `mod math {
    pub fn square(n: i32) -> i32 {
        n * n
    }
}

fn main() {
    println!("{}", math::square(4));
}
`,
  },
};
