"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ExerciseClient } from "@/components/ExerciseClient";
import { HintDisclosure } from "@/components/HintDisclosure";
import { SolutionDisclosure } from "@/components/SolutionDisclosure";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { TutorProvider } from "@/components/tutor/TutorContext";
import { RobotIcon } from "@/components/tutor/RobotIcon";
import { BackIcon } from "@/components/icons/BackIcon";
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

/** ヘッダーで使う「集中モードを終了」の閉じるアイコン */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

/** ヘッダーで使う「集中モードに入る」の拡大アイコン */
function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

interface LessonHeaderProps {
  lessonTitle: string;
  milestone: string;
  /** 演習があるレッスンのみ集中モードの切り替えを表示する */
  showFocusToggle: boolean;
  focusMode: boolean;
  onToggleFocus: () => void;
}

/**
 * 「← 学習マップ / マイルストーン / レッスン名」と集中モードの切り替えを1行にまとめたヘッダー。
 * 通常モード・集中モードの両方でこのコンポーネントを使い、見た目を統一する。
 */
function LessonHeader({
  lessonTitle,
  milestone,
  showFocusToggle,
  focusMode,
  onToggleFocus,
}: LessonHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          aria-label="学習マップに戻る"
          title="学習マップに戻る"
          className="rounded-md p-1.5 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
        >
          <BackIcon className="h-4 w-4" />
        </Link>
        <span className="rounded bg-foreground/10 px-2 py-0.5 font-mono text-xs">
          {milestone}
        </span>
        <h1 className="font-bold">{lessonTitle}</h1>
      </div>
      {showFocusToggle && (
        <button
          type="button"
          onClick={onToggleFocus}
          aria-label={focusMode ? "集中モードを終了" : "集中モードに入る"}
          title={focusMode ? "集中モードを終了" : "集中モードに入る"}
          className="rounded-md border border-foreground/20 p-1.5 text-foreground/70 hover:bg-foreground/5"
        >
          {focusMode ? <CloseIcon className="h-4 w-4" /> : <ExpandIcon className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

/**
 * レッスン画面のヘッダー・2カラムレイアウト・「集中モード」の切り替えを管理する。
 * ヘッダー(← 学習マップ / マイルストーン / レッスン名 / 集中モード切り替え)は
 * 通常モード・集中モードで共通のLessonHeaderを使い、見た目を揃える。
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
          <LessonHeader
            lessonTitle={lessonTitle}
            milestone={milestone}
            showFocusToggle={Boolean(exercise)}
            focusMode
            onToggleFocus={() => setFocusMode(false)}
          />

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
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <LessonHeader
            lessonTitle={lessonTitle}
            milestone={milestone}
            showFocusToggle={Boolean(exercise)}
            focusMode={false}
            onToggleFocus={() => setFocusMode(true)}
          />

          {/* md以上では左右をそれぞれ内部スクロールさせ、ページ全体の縦スクロールと
              二重にならないようにする。md未満では従来どおり画面全体でスクロールする */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-row md:overflow-hidden">
            <div className="lesson-body flex-1 md:min-h-0 md:overflow-y-auto">{explanation}</div>

            <div className="flex-1 md:min-h-0 md:overflow-y-auto">
              {exercise && <ExerciseClient lessonId={lessonId} exercise={exercise} />}
            </div>
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
