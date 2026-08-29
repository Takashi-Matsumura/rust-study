"use client";

import { useCallback, useRef, useState } from "react";
import type { RunMode, RunResult } from "@/lib/runner/types";
import { ErrorHelp } from "@/components/ErrorHelp";

interface RunPanelProps {
  code: string;
  mode?: RunMode;
  onResult?: (result: RunResult) => void;
}

interface ApiErrorBody {
  error: string;
}

const MIN_INTERVAL_MS = 1500;

/**
 * 「実行」ボタンと結果表示。連打で公式Playgroundへの負荷を増やさないよう、
 * クライアント側でも短い間隔での再実行を抑止する（サーバ側のレート制限を補う）。
 */
export function RunPanel({ code, mode = "run", onResult }: RunPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastRunAtRef = useRef(0);

  const handleRun = useCallback(async () => {
    const now = Date.now();
    if (now - lastRunAtRef.current < MIN_INTERVAL_MS) return;
    lastRunAtRef.current = now;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, mode }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
        setError(body?.error ?? "実行に失敗しました。");
        setResult(null);
        return;
      }

      const data = (await response.json()) as RunResult;
      setResult(data);
      onResult?.(data);
    } catch {
      setError("ネットワークエラーが発生しました。");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [code, mode, onResult]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {loading ? "実行中…" : "▶ 実行"}
      </button>

      {error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-2 rounded-md border border-foreground/10 p-3">
          <p className="text-xs font-medium">
            {result.success ? "✅ 成功" : "❌ 失敗"}
            <span className="ml-2 text-foreground/50">{result.durationMs}ms</span>
          </p>
          {result.stdout && (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm">
              {result.stdout}
            </pre>
          )}
          {result.errorCodes.length > 0 && <ErrorHelp errorCodes={result.errorCodes} />}
          {result.stderr && (
            <details open={!result.success}>
              <summary className="cursor-pointer text-xs text-foreground/60">
                コンパイラの出力
              </summary>
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-foreground/70">
                {result.stderr}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
