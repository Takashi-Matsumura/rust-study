import type { Check } from "@/content/lessons/types";
import type { RunResult } from "@/lib/runner/types";

export interface CheckResult {
  check: Check;
  passed: boolean;
  /** 不合格のときに表示する日本語メッセージ */
  message?: string;
}

export interface GradeReport {
  passed: boolean;
  items: CheckResult[];
}

/** unit_testチェックが1つでも含まれるか(含まれるならtestモードで実行する) */
export function hasUnitTestCheck(checks: Check[]): boolean {
  return checks.some((check) => check.kind === "unit_test");
}

/**
 * 学習者コードに結合するテストハーネス。
 * ユーザーコードの「後ろ」に連結することで、rustcが返す行番号が
 * ユーザーの見ている行番号とずれないようにする。
 */
export function buildTestHarness(checks: Check[]): string {
  return checks
    .filter((check): check is Extract<Check, { kind: "unit_test" }> => check.kind === "unit_test")
    .map((check) => check.testCode)
    .join("\n");
}

function extractTestFailureSummary(stdout: string): string {
  const match = stdout.match(/test result: FAILED\. (\d+) passed; (\d+) failed/);
  if (!match) return "テストに失敗しました。";
  return `${match[1]}件成功、${match[2]}件失敗しました。`;
}

function gradeCheck(check: Check, result: RunResult): CheckResult {
  switch (check.kind) {
    case "compiles":
      return {
        check,
        passed: result.success,
        message: result.success ? undefined : "コンパイルが通りませんでした。",
      };

    case "stdout_exact": {
      const passed = result.success && result.stdout === check.expected;
      return {
        check,
        passed,
        message: passed
          ? undefined
          : `期待する出力:\n${JSON.stringify(check.expected)}\n実際の出力:\n${JSON.stringify(result.stdout)}`,
      };
    }

    case "stdout_match": {
      const passed = result.success && new RegExp(check.pattern).test(result.stdout);
      return {
        check,
        passed,
        message: passed ? undefined : "出力が期待するパターンと一致しませんでした。",
      };
    }

    case "unit_test": {
      const passed = result.success && /test result: ok/.test(result.stdout);
      return {
        check,
        passed,
        message: passed ? undefined : extractTestFailureSummary(result.stdout),
      };
    }
  }
}

export function grade(checks: Check[], result: RunResult): GradeReport {
  const items = checks.map((check) => gradeCheck(check, result));
  return { passed: items.every((item) => item.passed), items };
}
