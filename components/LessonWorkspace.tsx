"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ExerciseClient } from "@/components/ExerciseClient";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { TutorProvider } from "@/components/tutor/TutorContext";
import type { Exercise } from "@/content/lessons/types";

interface LessonWorkspaceProps {
  lessonId: string;
  exercise?: Exercise;
  /** 解説Markdown + The Bookリンク。サーバー側で描画済みのReactNodeを受け取る */
  explanation: ReactNode;
}

function isTextInput(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.tagName === "TEXTAREA" || target.tagName === "INPUT");
}

/**
 * レッスン画面の2カラムレイアウトと「集中モード」の切り替えを管理する。
 * 集中モードでは解説パネルを隠し、代わりにAIチューターパネルをエディタの右に常設する。
 * 通常モードでは右下のフローティングボタンからAIチューターをドロワーで開閉する。
 */
export function LessonWorkspace({ lessonId, exercise, explanation }: LessonWorkspaceProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [tutorDrawerOpen, setTutorDrawerOpen] = useState(false);

  useEffect(() => {
    if (!focusMode) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      // AIチューターの入力欄に文字を打っている最中のEscapeでは集中モードを解除しない
      if (event.key === "Escape" && !isTextInput(event.target)) setFocusMode(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);

  return (
    <TutorProvider lessonId={lessonId}>
      <div className="flex flex-1 flex-col gap-6 md:flex-row">
        {!focusMode && <div className="lesson-body flex-1">{explanation}</div>}

        <div className={focusMode ? "flex flex-1 flex-col gap-4 md:flex-row" : "flex-1"}>
          <div className={focusMode ? "flex-[3]" : undefined}>
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

          {focusMode && (
            <div className="min-w-[320px] flex-[2]">
              <TutorPanel />
            </div>
          )}
        </div>
      </div>

      {!focusMode && (
        <>
          <button
            type="button"
            onClick={() => setTutorDrawerOpen(true)}
            aria-label="AIチューターを開く"
            // bottom-4 right-4は開発時にNext.jsのDevツールインジケータと重なりクリックを奪われるため、
            // その上(bottom-20)に配置してずらす
            className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-xl text-background shadow-lg"
          >
            🦀
          </button>

          {tutorDrawerOpen && (
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-foreground/10 bg-background p-3 shadow-lg">
              <TutorPanel onClose={() => setTutorDrawerOpen(false)} />
            </div>
          )}
        </>
      )}
    </TutorProvider>
  );
}
