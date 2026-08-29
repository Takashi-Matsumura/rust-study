import { getErrorExplanation } from "@/lib/rustc-errors";

interface ErrorHelpProps {
  errorCodes: string[];
}

/** rustcのエラーコードに対応する日本語解説カードを並べる */
export function ErrorHelp({ errorCodes }: ErrorHelpProps) {
  const explanations = errorCodes
    .map((code) => ({ code, explanation: getErrorExplanation(code) }))
    .filter((entry) => entry.explanation !== undefined);

  if (explanations.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {explanations.map(({ code, explanation }) => (
        <div
          key={code}
          className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm"
        >
          <p className="font-semibold">
            <span className="mr-2 rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-xs">
              {code}
            </span>
            {explanation!.title}
          </p>
          <p className="mt-1 text-foreground/80">{explanation!.summary}</p>
          <p className="mt-2 text-xs text-foreground/60">{explanation!.why}</p>
          <ul className="mt-2 list-disc pl-5 text-foreground/80">
            {explanation!.howToFix.map((fix, i) => (
              <li key={i}>{fix}</li>
            ))}
          </ul>
          {explanation!.bookUrl && (
            <a
              href={explanation!.bookUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-blue-600 underline dark:text-blue-400"
            >
              The Book で詳しく読む →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
