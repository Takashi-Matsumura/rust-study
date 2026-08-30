"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ExerciseClient } from "@/components/ExerciseClient";
import type { Exercise } from "@/content/lessons/types";

interface LessonWorkspaceProps {
  lessonId: string;
  exercise?: Exercise;
  /** 解説Markdown + The Bookリンク。サーバー側で描画済みのReactNodeを受け取る */
  explanation: ReactNode;
}

/**
 * レッスン画面の2カラムレイアウトと「集中モード」の切り替えを管理する。
 * 集中モードでは解説パネルを隠し、エディタの表示領域を広げる。
 */
export function LessonWorkspace({ lessonId, exercise, explanation }: LessonWorkspaceProps) {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (!focusMode) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);

  return (
    <div className="flex flex-1 flex-col gap-6 md:flex-row">
      {!focusMode && <div className="lesson-body flex-1">{explanation}</div>}

      <div className="flex-1">
        {exercise && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setFocusMode((v) => !v)}
              className="rounded-md border border-foreground/20 px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/5"
            >
              {focusMode ? "✕ 集中モードを終了" : "🖥 集中モード"}
            </button>
          </div>
        )}
        {exercise && (
          <ExerciseClient lessonId={lessonId} exercise={exercise} focusMode={focusMode} />
        )}
      </div>
    </div>
  );
}
