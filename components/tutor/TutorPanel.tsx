"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTutorContext } from "./TutorContext";
import { RobotIcon } from "./RobotIcon";

interface TutorPanelProps {
  /** ドロワー表示のときだけ渡す。閉じるボタンを表示する */
  onClose?: () => void;
}

/** 集中モードの常設パネル、通常モードのドロワーの両方で使うAIチューター本体 */
export function TutorPanel({ onClose }: TutorPanelProps) {
  const { selection, passed, messages, streaming, error, send, stop } = useTutorContext();
  const [input, setInput] = useState("");
  const composingRef = useRef(false);

  const handleSend = () => {
    const question = input.trim();
    if (!question || streaming) return;
    setInput("");
    void send("ask", question);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    // 日本語IMEの変換確定Enterでは送信しない
    if (composingRef.current) return;
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="flex h-full flex-col rounded-md border border-foreground/10">
      <div className="flex items-center justify-between border-b border-foreground/10 px-3 py-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <RobotIcon className="h-4 w-4" />
          AIチューター
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="AIチューターを閉じる"
            className="text-xs text-foreground/60 hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 text-sm">
        {messages.length === 0 && (
          <p className="text-foreground/50">
            コードや課題について質問できます。完成コードはお渡しできませんが、考え方やヒントをお伝えします。
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "self-end rounded-md bg-foreground/10 px-3 py-2"
                : "rounded-md bg-foreground/5 px-3 py-2"
            }
          >
            {message.role === "assistant" ? (
              <div className="tutor-message">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content || (message.pending ? "…" : "")}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        ))}

        {error && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-foreground/10 p-3">
        {selection && (
          <button
            type="button"
            onClick={() => void send("selection")}
            disabled={streaming}
            className="self-start rounded-full border border-foreground/20 px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/5 disabled:opacity-50"
          >
            選択中の {selection.split("\n").length} 行について質問する
          </button>
        )}

        {passed && (
          <button
            type="button"
            onClick={() => void send("review")}
            disabled={streaming}
            className="self-start rounded-full border border-foreground/20 px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/5 disabled:opacity-50"
          >
            このコードをレビューしてもらう
          </button>
        )}

        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={() => {
              composingRef.current = false;
            }}
            rows={2}
            placeholder="質問を入力(Enterで送信、Shift+Enterで改行)"
            className="flex-1 resize-none rounded-md border border-foreground/20 bg-transparent p-2 text-sm outline-none"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              className="rounded-md bg-foreground/10 px-3 py-2 text-sm font-medium"
            >
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              送信
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
