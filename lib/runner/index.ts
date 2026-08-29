import { InMemoryResultCache } from "./cache";
import { InMemoryRateLimiter } from "./rate-limit";
import { PlaygroundRunner } from "./playground";

export type { RunMode, RunRequest, RunResult, RustRunner } from "./types";
export { hashRunRequest } from "./cache";
export type { RateLimiter } from "./rate-limit";
export type { ResultCache } from "./cache";

/** 現在の実行基盤。差し替える場合はここをSandboxRunner等に変える */
export const runner = new PlaygroundRunner();

/** IPごとに1分間で10回まで */
export const rateLimiter = new InMemoryRateLimiter(10, 60_000);

/** 実行結果を5分間キャッシュ */
export const resultCache = new InMemoryResultCache(5 * 60_000);

/** 受け付けるコードの最大長 */
export const MAX_CODE_LENGTH = 20_000;
