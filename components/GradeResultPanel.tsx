import type { GradeReport } from "@/lib/grading";

const CHECK_LABEL: Record<string, string> = {
  stdout_exact: "出力が一致するか",
  stdout_match: "出力がパターンに一致するか",
  unit_test: "テストに合格するか",
  compiles: "コンパイルが通るか",
};

export function GradeResultPanel({ report }: { report: GradeReport }) {
  return (
    <div
      className={`rounded-md border p-3 text-sm ${
        report.passed
          ? "border-green-500/30 bg-green-500/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <p className="font-semibold">
        {report.passed ? "🎉 合格です！" : "まだ合格していません"}
      </p>
      <ul className="mt-2 flex flex-col gap-1">
        {report.items.map((item, i) => (
          <li key={i}>
            <p>
              {item.passed ? "✅" : "❌"} {CHECK_LABEL[item.check.kind] ?? item.check.kind}
            </p>
            {!item.passed && item.message && (
              <pre className="mt-1 whitespace-pre-wrap break-words rounded bg-black/5 p-2 font-mono text-xs dark:bg-white/5">
                {item.message}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
