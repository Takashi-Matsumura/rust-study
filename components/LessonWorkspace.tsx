"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ExerciseClient } from "@/components/ExerciseClient";
import { HintDisclosure } from "@/components/HintDisclosure";
import { SolutionDisclosure } from "@/components/SolutionDisclosure";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { TutorProvider } from "@/components/tutor/TutorContext";
import { RobotIcon } from "@/components/tutor/RobotIcon";
import type { Exercise } from "@/content/lessons/types";

interface LessonWorkspaceProps {
  lessonId: string;
  lessonTitle: string;
  milestone: string;
  exercise?: Exercise;
  /** 解説Markdown + The Bookリンク。サーバー側で描画済みのReactNodeを受け取る */
  explanation: ReactNode;
}

function isTextInput(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.tagName === "TEXTAREA" || target.tagName === "INPUT");
}

/**
 * レッスン画面の2カラムレイアウトと「集中モード」の切り替えを管理する。
 * 集中モードは画面全体を覆う固定オーバーレイになり、左列をコードエディタ、
 * 右列をヒント・解答例・AIチューターのサポート情報に分ける。両列とも内部で
 * スクロールする(ウィンドウの高さが変わっても常にチャット入力欄まで手が届く)。
 * 通常モードでは右下のフローティングボタンからAIチューターをドロワーで開閉する。
 */
export function LessonWorkspace({
  lessonId,
  lessonTitle,
  milestone,
  exercise,
  explanation,
}: LessonWorkspaceProps) {
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
      {focusMode ? (
        // fixed inset-0はウィンドウサイズの変更にそのまま追従するため、JSでの
        // 高さ計算なしに常にビューポートいっぱいのレイアウトを保てる。
        <div className="fixed inset-0 z-30 flex flex-col gap-4 bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-foreground/60 hover:underline">
                ← 学習マップ
              </Link>
              <span className="rounded bg-foreground/10 px-2 py-0.5 font-mono text-xs">
                {milestone}
              </span>
              <span className="font-bold">{lessonTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setFocusMode(false)}
              className="rounded-md border border-foreground/20 px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/5"
            >
              ✕ 集中モードを終了
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden md:flex-row">
            {/* 左: コードを書いて実行することに専念する列 */}
            <div className="min-h-0 flex-[3] overflow-y-auto">
              {exercise && (
                <ExerciseClient
                  lessonId={lessonId}
                  exercise={exercise}
                  focusMode
                  showHints={false}
                />
              )}
            </div>

            {/* 右: ヒント・解答例・AIチューターをまとめたサポート列 */}
            <div className="flex min-h-0 min-w-[320px] flex-[2] flex-col gap-3 overflow-hidden">
              {exercise && (exercise.hints.length > 0 || exercise.solution) && (
                <div className="max-h-[35vh] flex-none overflow-y-auto rounded-md border border-foreground/10 p-3">
                  <div className="flex flex-col gap-2">
                    <HintDisclosure hints={exercise.hints} />
                    <SolutionDisclosure solution={exercise.solution} />
                  </div>
                </div>
              )}
              <div className="min-h-0 flex-1 overflow-hidden">
                <TutorPanel />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 md:flex-row">
          <div className="lesson-body flex-1">{explanation}</div>

          <div className="flex-1">
            {exercise && (
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFocusMode(true)}
                  className="rounded-md border border-foreground/20 px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/5"
                >
                  🖥 集中モード
                </button>
              </div>
            )}
            {exercise && <ExerciseClient lessonId={lessonId} exercise={exercise} />}
          </div>
        </div>
      )}

      {!focusMode && (
        <>
          <button
            type="button"
            onClick={() => setTutorDrawerOpen(true)}
            aria-label="AIチューターを開く"
            // bottom-4 right-4は開発時にNext.jsのDevツールインジケータと重なりクリックを奪われるため、
            // その上(bottom-20)に配置してずらす
            className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
          >
            <RobotIcon className="h-6 w-6" />
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
