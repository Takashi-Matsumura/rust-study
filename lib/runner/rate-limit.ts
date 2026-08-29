/**
 * IP単位のレート制限。
 *
 * 注意: サーバレス環境ではインスタンスが使い回されないため、
 * このインメモリ実装はインスタンスをまたいで共有されない
 * (=実質的な上限は緩くなる)。個人の学習用途としてはまず動く状態を
 * 優先し、負荷が問題になった時点で Vercel Runtime Cache API や
 * Upstash Redis 等の外部ストアに差し替える。差し替えやすいよう
 * RateLimiter を小さなインターフェースとして切り出している。
 */

export interface RateLimiter {
  /** 許可されればtrue、制限中ならfalseを返す */
  tryConsume(key: string): boolean;
}

interface Bucket {
  count: number;
  windowStartMs: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  tryConsume(key: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now - bucket.windowStartMs >= this.windowMs) {
      this.buckets.set(key, { count: 1, windowStartMs: now });
      return true;
    }

    if (bucket.count >= this.limit) {
      return false;
    }

    bucket.count += 1;
    return true;
  }
}
