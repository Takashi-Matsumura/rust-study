"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TutorKind, TutorRunResult, TutorTurn } from "@/lib/tutor/types";

export interface TutorMessage extends TutorTurn {
  id: string;
  kind: TutorKind;
  pending?: boolean;
}

interface ApiErrorBody {
  error: string;
}

interface UseTutorChatParams {
  lessonId: string;
  code: string;
  selection: string;
  runResult: TutorRunResult | null;
}

/** サーバへ送る会話履歴の件数(古いものは切り捨てる) */
const MAX_SENT_HISTORY = 6;

const DEFAULT_QUESTION: Record<Exclude<TutorKind, "ask">, string> = {
  selection: "選択したコードについて質問",
  error: "このエラーについて質問",
  review: "このコードをレビューしてほしい",
};

/**
 * AIチューターとの会話状態とストリーミング送受信を管理するフック。
 * TutorProvider内で一度だけ生成され、ExerciseClient(自動送信)とTutorPanel(表示・手動送信)
 * が同じインスタンスを共有する。
 */
export function useTutorChat({ lessonId, code, selection, runResult }: UseTutorChatParams) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // sendのuseCallback依存にmessagesを含めると、ストリーミング中の1トークンごとに
  // コールバックが作り直されてしまうため、レンダー外(effect)で最新値をrefに反映する
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const send = useCallback(
    /**
     * runResultOverride: state更新(setRunResult)直後に同期的に呼ぶ場合、
     * Reactのstate反映が非同期なためこの関数のrunResultはまだ古い値のことがある。
     * その場合は呼び出し側から確定した値を明示的に渡す(ExerciseClientのエラー自動送信で使用)。
     */
    async (kind: TutorKind, question?: string, runResultOverride?: TutorRunResult) => {
      setError(null);

      const history: TutorTurn[] = messagesRef.current
        .slice(-MAX_SENT_HISTORY)
        .map(({ role, content }) => ({ role, content }));

      const userMessage: TutorMessage = {
        id: crypto.randomUUID(),
        kind,
        role: "user",
        content: question ?? DEFAULT_QUESTION[kind as Exclude<TutorKind, "ask">],
      };
      const assistantMessage: TutorMessage = {
        id: crypto.randomUUID(),
        kind,
        role: "assistant",
        content: "",
        pending: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const effectiveRunResult = runResultOverride ?? runResult;

      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            kind,
            lessonId,
            question,
            code,
            selection: kind === "selection" ? selection : undefined,
            runResult:
              kind === "error" || kind === "review" ? (effectiveRunResult ?? undefined) : undefined,
            history,
          }),
        });

        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
          throw new Error(body?.error ?? "AIチューターへの問い合わせに失敗しました。");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: m.content + text } : m)),
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : "AIチューターへの問い合わせに失敗しました。";
          setError(message);
          // トークンが1つも届いていなければ、空の吹き出しを残さず削除する
          setMessages((prev) =>
            prev.flatMap((m) => (m.id === assistantMessage.id && !m.content ? [] : [m])),
          );
        }
      } finally {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessage.id ? { ...m, pending: false } : m)),
        );
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [lessonId, code, selection, runResult],
  );

  return { messages, streaming, error, send, stop };
}
