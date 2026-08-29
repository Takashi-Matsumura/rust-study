/**
 * Rustコードの実行基盤を抽象化するインターフェース。
 * 今は公式Playground(PlaygroundRunner)を使うが、将来Vercel Sandbox等の
 * 自前実行環境(SandboxRunner)に差し替えられるよう、実行部分をここで切り出す。
 */

export type RunMode = "run" | "test";

export interface RunRequest {
  /** 学習者が書いたRustコード全体 */
  code: string;
  /** "run": 通常実行 / "test": #[test] を含めて実行し採点に使う */
  mode: RunMode;
}

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  /** stderrから抽出したrustcのエラーコード一覧 (例: ["E0382"]) */
  errorCodes: string[];
  durationMs: number;
}

export interface RustRunner {
  run(request: RunRequest): Promise<RunResult>;
}
