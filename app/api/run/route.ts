import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  MAX_CODE_LENGTH,
  hashRunRequest,
  rateLimiter,
  resultCache,
  runner,
} from "@/lib/runner";

const requestSchema = z.object({
  code: z.string().min(1).max(MAX_CODE_LENGTH),
  mode: z.enum(["run", "test"]).default("run"),
});

function getClientKey(request: NextRequest): string {
  // Vercel/多くのプロキシ環境ではx-forwarded-forの先頭が実クライアントIP
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const clientKey = getClientKey(request);
  if (!rateLimiter.tryConsume(clientKey)) {
    return NextResponse.json(
      { error: "実行回数の上限に達しました。しばらく待ってから再度お試しください。" },
      { status: 429 },
    );
  }

  const { code, mode } = parsed.data;
  const cacheKey = await hashRunRequest(code, mode);

  const cached = resultCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const result = await runner.run({ code, mode });
    resultCache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "コードの実行に失敗しました。しばらく待ってから再度お試しください。" },
      { status: 502 },
    );
  }
}
