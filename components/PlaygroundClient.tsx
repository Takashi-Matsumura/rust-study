"use client";

import { useCallback, useRef, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { RunPanel } from "@/components/RunPanel";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { TutorProvider, useTutorContext } from "@/components/tutor/TutorContext";
import { RobotIcon } from "@/components/tutor/RobotIcon";
import { getErrorExplanation } from "@/lib/rustc-errors";
import { PLAYGROUND_LESSON_ID } from "@/lib/tutor/config";
import type { RunResult } from "@/lib/runner/types";

const DEFAULT_CODE = `fn main() {
    println!("Hello, world!");
}
`;

const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 2;
// AIチューターAPI(lib/tutor/config.ts)側のMAX_RUN_OUTPUT_LENGTHと揃える。
// config.tsはprocess.envを参照するためクライアントからは直接importしない。
const MAX_TUTOR_OUTPUT_LENGTH = 4_000;

function truncateForTutor(text: string): string {
  return text.length <= MAX_TUTOR_OUTPUT_LENGTH ? text : text.slice(0, MAX_TUTOR_OUTPUT_LENGTH);
}

function PlaygroundBody() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [tutorDrawerOpen, setTutorDrawerOpen] = useState(false);
  const lastAutoErrorKeyRef = useRef<string | null>(null);

  const tutor = useTutorContext();

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      tutor.setCode(value);
    },
    [tutor],
  );

  const handleResult = useCallback(
    (result: RunResult) => {
      const tutorRunResult = {
        success: result.success,
        stdout: truncateForTutor(result.stdout),
        stderr: truncateForTutor(result.stderr),
        errorCodes: result.errorCodes,
      };
      tutor.setRunResult(tutorRunResult);

      if (result.success) return;

      // 辞書(lib/rustc-errors.ts)に載っているエラーはErrorHelpが即座に説明できるので、
      // そこでカバーできない失敗のときだけAIチューターに自動で解説を頼む。
      // 同じ失敗内容には1回しか送らない。
      const explainableByDict = result.errorCodes.some(
        (code) => getErrorExplanation(code) !== undefined,
      );
      const autoErrorKey = `${result.success}|${result.stdout}|${result.stderr}`;
      if (!explainableByDict && lastAutoErrorKeyRef.current !== autoErrorKey) {
        lastAutoErrorKeyRef.current = autoErrorKey;
        void tutor.send("error", undefined, tutorRunResult);
      }
    },
    [tutor],
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2 self-end text-xs text-foreground/70">
          <span>文字サイズ</span>
          <button
            type="button"
            onClick={() => setFontSize((size) => Math.max(MIN_FONT_SIZE, size - FONT_SIZE_STEP))}
            disabled={fontSize <= MIN_FONT_SIZE}
            aria-label="文字サイズを小さくする"
            className="rounded-md border border-foreground/20 px-2 py-1 disabled:opacity-30"
          >
            A-
          </button>
          <span className="w-10 text-center tabular-nums">{fontSize}px</span>
          <button
            type="button"
            onClick={() => setFontSize((size) => Math.min(MAX_FONT_SIZE, size + FONT_SIZE_STEP))}
            disabled={fontSize >= MAX_FONT_SIZE}
            aria-label="文字サイズを大きくする"
            className="rounded-md border border-foreground/20 px-2 py-1 disabled:opacity-30"
          >
            A+
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="min-h-[300px] flex-1 overflow-hidden rounded-md border border-foreground/10">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              onSelectionChange={tutor.setSelection}
              minHeight="300px"
              fontSize={fontSize}
            />
          </div>
          <div className="flex-1">
            <RunPanel code={code} mode="run" onResult={handleResult} />
          </div>
        </div>
      </div>

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
  );
}

export function PlaygroundClient() {
  return (
    <TutorProvider lessonId={PLAYGROUND_LESSON_ID}>
      <PlaygroundBody />
    </TutorProvider>
  );
}
