import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLesson } from "@/content/lessons";
import {
  MAX_CODE_LENGTH,
  MAX_HISTORY_TURNS,
  MAX_QUESTION_LENGTH,
  MAX_RUN_OUTPUT_LENGTH,
  MAX_SELECTION_LENGTH,
  PLAYGROUND_LESSON_ID,
  tutorRateLimiter,
} from "@/lib/tutor/config";
import { streamTutorReply, TutorUnavailableError, type ChatMessage } from "@/lib/tutor/client";
import { buildSystemPrompt, buildUserContent } from "@/lib/tutor/prompt";
import type { TutorRequest } from "@/lib/tutor/types";

const runResultSchema = z.object({
  success: z.boolean(),
  stdout: z.string().max(MAX_RUN_OUTPUT_LENGTH),
  stderr: z.string().max(MAX_RUN_OUTPUT_LENGTH),
  errorCodes: z.array(z.string()).max(20),
});

const requestSchema = z
  .object({
    kind: z.enum(["ask", "selection", "error", "review"]),
    lessonId: z.string().min(1),
    question: z.string().min(1).max(MAX_QUESTION_LENGTH).optional(),
    code: z.string().max(MAX_CODE_LENGTH),
    selection: z.string().min(1).max(MAX_SELECTION_LENGTH).optional(),
    runResult: runResultSchema.optional(),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().max(4_000),
        }),
      )
      .max(MAX_HISTORY_TURNS),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "ask" && !value.question) {
      ctx.addIssue({ code: "custom", message: "askにはquestionが必要です。", path: ["question"] });
    }
    if (value.kind === "selection" && !value.selection) {
      ctx.addIssue({
        code: "custom",
        message: "selectionにはselectionが必要です。",
        path: ["selection"],
      });
    }
    if ((value.kind === "error" || value.kind === "review") && !value.runResult) {
      ctx.addIssue({
        code: "custom",
        message: "error/reviewにはrunResultが必要です。",
        path: ["runResult"],
      });
    }
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
  if (!tutorRateLimiter.tryConsume(clientKey)) {
    return NextResponse.json(
      { error: "質問できる回数の上限に達しました。しばらく待ってから再度お試しください。" },
      { status: 429 },
    );
  }

  const tutorRequest = parsed.data as TutorRequest;
  const isPlayground = tutorRequest.lessonId === PLAYGROUND_LESSON_ID;
  const lesson = isPlayground ? null : (getLesson(tutorRequest.lessonId) ?? null);
  if (!isPlayground && !lesson) {
    return NextResponse.json({ error: "レッスンが見つかりません。" }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(tutorRequest.kind, lesson) },
    ...tutorRequest.history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: "user", content: buildUserContent(tutorRequest) },
  ];

  const generator = streamTutorReply(messages, request.signal);

  let first: IteratorResult<string>;
  try {
    first = await generator.next();
  } catch (error) {
    if (error instanceof TutorUnavailableError) {
      return NextResponse.json(
        {
          error:
            "ローカルLLM (127.0.0.1:8080) に接続できません。llama-server が起動しているか確認してください。",
        },
        { status: 503 },
      );
    }
    throw error;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      if (!first.done && first.value) controller.enqueue(encoder.encode(first.value));
      try {
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch {
        // ストリーム途中の切断。ここまで届いた内容はクライアントに残す。
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
