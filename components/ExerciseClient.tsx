"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { ErrorHelp } from "@/components/ErrorHelp";
import { GradeResultPanel } from "@/components/GradeResultPanel";
import { HintDisclosure } from "@/components/HintDisclosure";
import { SolutionDisclosure } from "@/components/SolutionDisclosure";
import { useTutorContext } from "@/components/tutor/TutorContext";
import { buildTestHarness, grade, hasUnitTestCheck } from "@/lib/grading";
import { progressStore } from "@/lib/progress";
import { getErrorExplanation } from "@/lib/rustc-errors";
import type { Exercise } from "@/content/lessons/types";
import type { RunMode, RunResult } from "@/lib/runner/types";

interface ApiErrorBody {
  error: string;
}

const MIN_INTERVAL_MS = 1500;
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

interface ExerciseClientProps {
  lessonId: string;
  exercise: Exercise;
  /** 集中モード中はエディタの表示領域を広げる */
  focusMode?: boolean;
}

/** レッスンの演習パネル。エディタ・採点・ヒント・解答例を1つにまとめる */
export function ExerciseClient({ lessonId, exercise, focusMode }: ExerciseClientProps) {
  const [code, setCode] = useState(exercise.starterCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const lastRunAtRef = useRef(0);
  const lastAutoErrorKeyRef = useRef<string | null>(null);

  const tutor = useTutorContext();

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      tutor.setCode(value);
    },
    [tutor],
  );

  const isTestMode = useMemo(() => hasUnitTestCheck(exercise.checks), [exercise.checks]);
  const harness = useMemo(() => buildTestHarness(exercise.checks), [exercise.checks]);

  const handleRun = useCallback(async () => {
    const now = Date.now();
    if (now - lastRunAtRef.current < MIN_INTERVAL_MS) return;
    lastRunAtRef.current = now;

    setLoading(true);
    setApiError(null);

    // テスト採点の場合、ユーザーコードの「後ろ」にハーネスを連結する。
    // 前に連結するとrustcが返す行番号がユーザーの見ている行番号とずれてしまう。
    const submittedCode = isTestMode ? `${code}\n${harness}` : code;
    const mode: RunMode = isTestMode ? "test" : "run";

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: submittedCode, mode }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
        setApiError(body?.error ?? "実行に失敗しました。");
        setResult(null);
        return;
      }

      const data = (await response.json()) as RunResult;
      setResult(data);

      const tutorRunResult = {
        success: data.success,
        stdout: truncateForTutor(data.stdout),
        stderr: truncateForTutor(data.stderr),
        errorCodes: data.errorCodes,
      };
      tutor.setRunResult(tutorRunResult);

      const report = grade(exercise.checks, data);
      tutor.setPassed(report.passed);

      if (report.passed) {
        progressStore.markCompleted(lessonId);
      } else {
        // 辞書(lib/rustc-errors.ts)に載っているエラーはErrorHelpが即座に説明できるので、
        // そこでカバーできない失敗(未知のエラーコード、または出力不一致など)のときだけ
        // AIチューターに自動で解説を頼む。同じ失敗内容には1回しか送らない。
        const explainableByDict = data.errorCodes.some(
          (code) => getErrorExplanation(code) !== undefined,
        );
        const autoErrorKey = `${data.success}|${data.stdout}|${data.stderr}`;
        if (!explainableByDict && lastAutoErrorKeyRef.current !== autoErrorKey) {
          lastAutoErrorKeyRef.current = autoErrorKey;
          void tutor.send("error", undefined, tutorRunResult);
        }
      }
    } catch {
      setApiError("ネットワークエラーが発生しました。");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [code, harness, isTestMode, exercise.checks, lessonId, tutor]);

  const report = result ? grade(exercise.checks, result) : null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">{exercise.prompt}</p>

      {focusMode && (
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
      )}

      <div
        className={
          focusMode
            ? "min-h-[60vh] overflow-hidden rounded-md border border-foreground/10"
            : "min-h-[200px] overflow-hidden rounded-md border border-foreground/10"
        }
      >
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          onSelectionChange={tutor.setSelection}
          minHeight={focusMode ? "60vh" : "200px"}
          fontSize={focusMode ? fontSize : undefined}
        />
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {loading ? "採点中…" : "採点する"}
      </button>

      {apiError && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {apiError}
        </p>
      )}

      {result && result.errorCodes.length > 0 && <ErrorHelp errorCodes={result.errorCodes} />}

      {report && <GradeResultPanel report={report} />}

      {report?.passed && !isTestMode && result && (
        <div className="rounded-md border border-foreground/10 p-3">
          <p className="mb-1 text-xs font-medium text-foreground/60">実行結果</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">
            {result.stdout}
          </pre>
        </div>
      )}

      {result?.stderr && (
        <details open={!result.success}>
          <summary className="cursor-pointer text-xs text-foreground/60">
            コンパイラの出力
          </summary>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs text-foreground/70">
            {result.stderr}
          </pre>
        </details>
      )}

      <div className="flex flex-col gap-2 border-t border-foreground/10 pt-3">
        <HintDisclosure hints={exercise.hints} />
        <SolutionDisclosure solution={exercise.solution} />
      </div>
    </div>
  );
}
