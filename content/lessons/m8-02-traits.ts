import type { Lesson } from "./types";

export const m8_02_traits: Lesson = {
  id: "m8-02-traits",
  milestone: "M8",
  title: "トレイト: 型に「できること」を約束させる",
  body: `## トレイトとは

トレイトは、「この型はこういうメソッドを持っている」という約束(インターフェース)です。
前のレッスンで使った \`PartialOrd\` (大小比較ができる)もトレイトの一種です。

自分でトレイトを定義することもできます。

\`\`\`rust
trait Greet {
    fn greet(&self) -> String;
}
\`\`\`

これを構造体に実装するには \`impl トレイト名 for 型名\` と書きます。

\`\`\`rust
struct Person {
    name: String,
}

impl Greet for Person {
    fn greet(&self) -> String {
        format!("こんにちは、{}さん", self.name)
    }
}
\`\`\`

こうすることで \`Person\` 型の値は \`.greet()\` メソッドを呼び出せるようになります。

### おまけ: #[derive(...)]

\`Debug\` や \`Clone\` のようによく使うトレイトは、自分で実装しなくても
\`#[derive(Debug)]\` のように構造体の上に書くだけで自動的に実装してくれます。
これも今後よく見かけるので覚えておきましょう。

### 演習

\`Greet\` トレイトを \`Person\` に実装し、挨拶を表示してください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch10-02-traits.html",
  exercise: {
    prompt: "名前が「田中」のPersonでgreet()を呼び出し「こんにちは、田中さん」と表示してください。",
    starterCode: `trait Greet {
    fn greet(&self) -> String;
}

struct Person {
    name: String,
}

// TODO: PersonにGreetトレイトを実装してください
impl Greet for Person {
    fn greet(&self) -> String {
        String::new()
    }
}

fn main() {
    let p = Person { name: String::from("田中") };
    println!("{}", p.greet());
}
`,
    checks: [{ kind: "stdout_exact", expected: "こんにちは、田中さん\n" }],
    hints: [
      "`greet` メソッドの中身を `format!(\"こんにちは、{}さん\", self.name)` にしてください。",
    ],
    solution: `trait Greet {
    fn greet(&self) -> String;
}

struct Person {
    name: String,
}

impl Greet for Person {
    fn greet(&self) -> String {
        format!("こんにちは、{}さん", self.name)
    }
}

fn main() {
    let p = Person { name: String::from("田中") };
    println!("{}", p.greet());
}
`,
  },
};
