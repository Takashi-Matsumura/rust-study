import { TUTOR_BASE_URL, TUTOR_MODEL } from "./config";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** ローカルLLM(llama-server)に接続できない場合に投げるエラー */
export class TutorUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("ローカルLLMに接続できませんでした。");
    this.name = "TutorUnavailableError";
    this.cause = cause;
  }
}

interface ChatCompletionChunk {
  choices?: Array<{ delta?: { content?: string | null } }>;
}

/**
 * llama-server(OpenAI互換API)にストリーミングでチャット補完をリクエストし、
 * 到着したテキスト断片を順番に返す。
 *
 * enable_thinking:false は必須。gemma系の推論モデルはデフォルトで
 * reasoning_content(数百トークンの下書き思考)を先に吐き、体感が
 * 大きく悪化するため明示的に無効化する。
 */
export async function* streamTutorReply(
  messages: ChatMessage[],
  signal: AbortSignal,
): AsyncGenerator<string> {
  let response: Response;
  try {
    response = await fetch(`${TUTOR_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        ...(TUTOR_MODEL ? { model: TUTOR_MODEL } : {}),
        messages,
        stream: true,
        temperature: 0.3,
        max_tokens: 800,
        chat_template_kwargs: { enable_thinking: false },
      }),
    });
  } catch (error) {
    if (signal.aborted) return;
    throw new TutorUnavailableError(error);
  }

  if (!response.ok || !response.body) {
    throw new TutorUnavailableError(
      new Error(`ローカルLLMがHTTP ${response.status}を返しました`),
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // 最後の行は次チャンクへ続く可能性があるので保持しておく
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice("data:".length).trim();
        if (payload === "[DONE]") return;

        let chunk: ChatCompletionChunk;
        try {
          chunk = JSON.parse(payload) as ChatCompletionChunk;
        } catch {
          continue;
        }

        const content = chunk.choices?.[0]?.delta?.content;
        if (content) yield content;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
