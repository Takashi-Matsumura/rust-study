import type { Lesson } from "./types";

export const m10_01_todo_cli: Lesson = {
  id: "m10-01-todo-cli",
  milestone: "M10",
  title: "総合課題: ToDo管理を作る",
  body: `## ここまでの集大成

M0からM9まで学んだ次のすべてを組み合わせて、簡単なToDo管理の仕組みを作ります。

- struct でデータをまとめる(M5)
- Vec で複数の要素を持つ(M6)
- impl でメソッドを定義する(M5)
- 借用(\`&self\` / \`&mut self\`)で所有権を保ったまま操作する(M4)

\`\`\`rust
struct Task {
    title: String,
    done: bool,
}

struct TodoList {
    tasks: Vec<Task>,
}

impl TodoList {
    fn new() -> Self {
        TodoList { tasks: Vec::new() }
    }

    fn add(&mut self, title: &str) {
        self.tasks.push(Task { title: title.to_string(), done: false });
    }
}
\`\`\`

\`fn new() -> Self\` は「この型のインスタンスを新しく作る」ための、Rustでよく使われる
決まった書き方です。\`Self\` はこの \`impl\` が対象にしている型(ここでは \`TodoList\`)を指します。

### 演習: complete と list を実装する

\`add\` はすでに実装されています。残りの2つのメソッドを完成させてください。

- \`complete(&mut self, index: usize)\`: \`index\` 番目のタスクを完了(\`done = true\`)にする
- \`list(&self) -> String\`: すべてのタスクを \`[x] タイトル\` (完了)または \`[ ] タイトル\` (未完了)の
  形式で1行ずつ並べた文字列にして返す

\`self.tasks.get_mut(index)\` は、指定した位置の要素への可変参照を \`Option\` で返します
(範囲外なら \`None\`)。\`if let Some(task) = ... { ... }\` は「\`Some\`だったときだけ処理する」
というM5の \`match\` を簡潔に書く方法です。

### この先、ブラウザの外へ

ここまで完走できたら、Rustの基礎はひと通り身につきました。おめでとうございます！
このアプリはブラウザで完結させるため、キーボード入力やファイルの読み書きは扱えませんでしたが、
実際のToDoアプリではそれらが欠かせません。次のステップとして、自分のパソコンに
\`rustup\` でRustをインストールし、The Bookの12章を参考にコマンドライン引数や
標準入力を扱うプログラムに挑戦してみてください。`,
  bookUrl: "https://doc.rust-jp.rs/book-ja/ch12-00-an-io-project.html",
  exercise: {
    prompt:
      "「牛乳を買う」「掃除する」を追加し、1つ目を完了にして一覧を表示してください。" +
      "期待する出力: \n[x] 牛乳を買う\n[ ] 掃除する",
    starterCode: `struct Task {
    title: String,
    done: bool,
}

struct TodoList {
    tasks: Vec<Task>,
}

impl TodoList {
    fn new() -> Self {
        TodoList { tasks: Vec::new() }
    }

    fn add(&mut self, title: &str) {
        self.tasks.push(Task { title: title.to_string(), done: false });
    }

    fn complete(&mut self, index: usize) {
        // TODO: index番目のタスクのdoneをtrueにしてください
    }

    fn list(&self) -> String {
        let mut result = String::new();
        // TODO: self.tasksを1つずつ処理し、
        // "[x] タイトル\\n" または "[ ] タイトル\\n" をresultに追加してください
        result
    }
}

fn main() {
    let mut todo = TodoList::new();
    todo.add("牛乳を買う");
    todo.add("掃除する");
    todo.complete(0);
    print!("{}", todo.list());
}
`,
    checks: [{ kind: "stdout_exact", expected: "[x] 牛乳を買う\n[ ] 掃除する\n" }],
    hints: [
      "`complete`: `if let Some(task) = self.tasks.get_mut(index) { task.done = true; }` と書きます。",
      "`list`: `for task in &self.tasks { ... }` でループし、`task.done` によって \"x\" か \" \" を選びます。",
      "`result.push_str(&format!(\"[{}] {}\\n\", mark, task.title));` のように文字列を追加していきます。",
    ],
    solution: `struct Task {
    title: String,
    done: bool,
}

struct TodoList {
    tasks: Vec<Task>,
}

impl TodoList {
    fn new() -> Self {
        TodoList { tasks: Vec::new() }
    }

    fn add(&mut self, title: &str) {
        self.tasks.push(Task { title: title.to_string(), done: false });
    }

    fn complete(&mut self, index: usize) {
        if let Some(task) = self.tasks.get_mut(index) {
            task.done = true;
        }
    }

    fn list(&self) -> String {
        let mut result = String::new();
        for task in &self.tasks {
            let mark = if task.done { "x" } else { " " };
            result.push_str(&format!("[{}] {}\\n", mark, task.title));
        }
        result
    }
}

fn main() {
    let mut todo = TodoList::new();
    todo.add("牛乳を買う");
    todo.add("掃除する");
    todo.complete(0);
    print!("{}", todo.list());
}
`,
  },
};
