/** AIチューターへのリクエスト種別 */
export type TutorKind = "ask" | "selection" | "error" | "review";

export interface TutorTurn {
  role: "user" | "assistant";
  content: string;
}

export interface TutorRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  errorCodes: string[];
}

export interface TutorRequest {
  kind: TutorKind;
  lessonId: string;
  /** ask / selection のとき、学習者が入力した質問文 */
  question?: string;
  /** 学習者が現在エディタに書いているコード */
  code: string;
  /** selection のとき、エディタで選択されたコード片 */
  selection?: string;
  /** error / review のとき、直近の実行・採点結果 */
  runResult?: TutorRunResult;
  /** 直近の会話履歴(最大6件) */
  history: TutorTurn[];
}
