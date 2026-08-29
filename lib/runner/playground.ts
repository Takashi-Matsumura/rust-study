import type { RunRequest, RunResult, RustRunner } from "./types";

const PLAYGROUND_EXECUTE_URL = "https://play.rust-lang.org/execute";

interface PlaygroundExecuteResponse {
  success: boolean;
  stdout: string;
  stderr: string;
}

function extractErrorCodes(stderr: string): string[] {
  const matches = stderr.matchAll(/error\[(E\d{4})\]/g);
  const codes = new Set<string>();
  for (const match of matches) {
    codes.add(match[1]);
  }
  return Array.from(codes);
}

/** 公式 Rust Playground (play.rust-lang.org) を実行基盤として使うRunner */
export class PlaygroundRunner implements RustRunner {
  async run({ code, mode }: RunRequest): Promise<RunResult> {
    const isTest = mode === "test";
    const started = Date.now();

    const response = await fetch(PLAYGROUND_EXECUTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "stable",
        mode: "debug",
        edition: "2024",
        // #[test] を実行するにはlibクレートである必要がある
        crateType: isTest ? "lib" : "bin",
        tests: isTest,
        backtrace: false,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Playgroundへのリクエストに失敗しました (HTTP ${response.status})`);
    }

    const data = (await response.json()) as PlaygroundExecuteResponse;

    return {
      success: data.success,
      stdout: data.stdout,
      stderr: data.stderr,
      errorCodes: extractErrorCodes(data.stderr),
      durationMs: Date.now() - started,
    };
  }
}
