"use client";

import { useState } from "react";

export function SolutionDisclosure({ solution }: { solution: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-blue-600 underline dark:text-blue-400"
      >
        {open ? "解答例を隠す" : "解答例を見る"}
      </button>
      {open && (
        <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-foreground/5 p-3 font-mono text-xs">
          {solution}
        </pre>
      )}
    </div>
  );
}
