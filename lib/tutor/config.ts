import { InMemoryRateLimiter } from "@/lib/runner/rate-limit";

/**
 * ローカルLLM(llama-server等、OpenAI互換API)への接続設定。
 * クライアントからベースURLを指定させるとSSRFの入口になるため、
 * 環境変数(サーバ側)からのみ決定する。
 */
export const TUTOR_BASE_URL = process.env.TUTOR_BASE_URL ?? "http://127.0.0.1:8080/v1";

/** llama-serverは省略可能(ロード中の1モデルが使われる) */
export const TUTOR_MODEL = process.env.TUTOR_MODEL;

/** IPごとに1分間で20回まで(採点より緩め。会話のやり取りは往復が多いため) */
export const tutorRateLimiter = new InMemoryRateLimiter(20, 60_000);

/** 質問文として受け付ける最大文字数 */
export const MAX_QUESTION_LENGTH = 2_000;

/** 学習者コードとして受け付ける最大文字数(採点APIと揃える) */
export const MAX_CODE_LENGTH = 20_000;

/** 選択範囲として受け付ける最大文字数 */
export const MAX_SELECTION_LENGTH = 4_000;

/** コンパイラ出力(stdout/stderr)として受け付ける最大文字数 */
export const MAX_RUN_OUTPUT_LENGTH = 4_000;

/** レッスン本文をプロンプトに注入する際の上限文字数 */
export const MAX_LESSON_BODY_CHARS = 2_000;

/** 会話履歴として受け付ける最大件数 */
export const MAX_HISTORY_TURNS = 6;
