import type { RunResult } from "./types";

/**
 * 実行結果のキャッシュ。同じコード・同じmodeであれば
 * 公式Playgroundへ再度問い合わせず、公式サーバへの負荷を減らす。
 *
 * rate-limit.ts と同様、インメモリなのでサーバレスのインスタンス間では
 * 共有されない既知の制約がある。ResultCache インターフェースとして
 * 切り出しているので、外部ストアへの差し替えは実装を入れ替えるだけでよい。
 */

export interface ResultCache {
  get(key: string): RunResult | undefined;
  set(key: string, value: RunResult): void;
}

export class InMemoryResultCache implements ResultCache {
  private readonly store = new Map<string, { value: RunResult; expiresAtMs: number }>();

  constructor(private readonly ttlMs: number) {}

  get(key: string): RunResult | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAtMs) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: RunResult): void {
    this.store.set(key, { value, expiresAtMs: Date.now() + this.ttlMs });
  }
}

/** codeとmodeからキャッシュ・レート制限で使うキーを作る */
export async function hashRunRequest(code: string, mode: string): Promise<string> {
  const data = new TextEncoder().encode(`${mode}:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
