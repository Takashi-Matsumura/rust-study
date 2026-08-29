"use client";

import { useState } from "react";

export function HintDisclosure({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {hints.slice(0, revealed).map((hint, i) => (
        <p key={i} className="rounded-md bg-foreground/5 p-2 text-sm">
          💡 {hint}
        </p>
      ))}
      {revealed < hints.length && (
        <button
          type="button"
          onClick={() => setRevealed((n) => n + 1)}
          className="self-start text-sm text-blue-600 underline dark:text-blue-400"
        >
          {revealed === 0 ? "ヒントを見る" : "次のヒントを見る"}
        </button>
      )}
    </div>
  );
}
