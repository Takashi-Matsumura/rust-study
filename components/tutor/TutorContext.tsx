"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { TutorRunResult } from "@/lib/tutor/types";
import { useTutorChat } from "./useTutorChat";

interface TutorContextValue extends ReturnType<typeof useTutorChat> {
  lessonId: string;
  code: string;
  runResult: TutorRunResult | null;
  passed: boolean;
  selection: string;
  setCode: (code: string) => void;
  setRunResult: (result: TutorRunResult | null) => void;
  setPassed: (passed: boolean) => void;
  setSelection: (selection: string) => void;
}

const TutorContext = createContext<TutorContextValue | null>(null);

interface TutorProviderProps {
  lessonId: string;
  children: ReactNode;
}

/**
 * 現在のレッスンID・学習者コード・実行結果・選択範囲・チャット状態をひとつにまとめ、
 * ExerciseClient(書き込み側)とTutorPanel(表示側)の両方から同じインスタンスを使えるようにする。
 * ExerciseClientがエラー時に自動でチャットへ送信する(送信APIも共有する)必要があるため、
 * useTutorChatはここで一度だけ呼び出す。
 */
export function TutorProvider({ lessonId, children }: TutorProviderProps) {
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<TutorRunResult | null>(null);
  const [passed, setPassed] = useState(false);
  const [selection, setSelection] = useState("");

  const chat = useTutorChat({ lessonId, code, selection, runResult });

  const value = useMemo(
    () => ({
      lessonId,
      code,
      runResult,
      passed,
      selection,
      setCode,
      setRunResult,
      setPassed,
      setSelection,
      ...chat,
    }),
    [lessonId, code, runResult, passed, selection, chat],
  );

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
}

export function useTutorContext(): TutorContextValue {
  const ctx = useContext(TutorContext);
  if (!ctx) throw new Error("useTutorContext must be used within TutorProvider");
  return ctx;
}
