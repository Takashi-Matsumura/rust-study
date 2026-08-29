import type { Lesson } from "./types";
import { m0_01_hello } from "./m0-01-hello";
import { m1_01_variables } from "./m1-01-variables";
import { m1_02_numeric_types } from "./m1-02-numeric-types";
import { m2_01_if } from "./m2-01-if";
import { m2_02_loops } from "./m2-02-loops";
import { m3_01_functions } from "./m3-01-functions";
import { m3_02_shadowing } from "./m3-02-shadowing";
import { m4_01_ownership } from "./m4-01-ownership";
import { m4_02_references } from "./m4-02-references";
import { m4_03_slices } from "./m4-03-slices";
import { m5_01_structs } from "./m5-01-structs";
import { m5_02_enums_match } from "./m5-02-enums-match";
import { m6_01_vectors } from "./m6-01-vectors";
import { m6_02_strings } from "./m6-02-strings";
import { m6_03_hashmap } from "./m6-03-hashmap";
import { m7_01_result } from "./m7-01-result";
import { m7_02_question_mark } from "./m7-02-question-mark";
import { m8_01_generics } from "./m8-01-generics";
import { m8_02_traits } from "./m8-02-traits";
import { m9_01_modules } from "./m9-01-modules";
import { m9_02_testing } from "./m9-02-testing";
import { m10_01_todo_cli } from "./m10-01-todo-cli";

export type { Lesson, Exercise, Check } from "./types";

/** 全レッスンの唯一の登録場所。マイルストーン順・レッスン順に並べる */
export const LESSONS: Lesson[] = [
  m0_01_hello,
  m1_01_variables,
  m1_02_numeric_types,
  m2_01_if,
  m2_02_loops,
  m3_01_functions,
  m3_02_shadowing,
  m4_01_ownership,
  m4_02_references,
  m4_03_slices,
  m5_01_structs,
  m5_02_enums_match,
  m6_01_vectors,
  m6_02_strings,
  m6_03_hashmap,
  m7_01_result,
  m7_02_question_mark,
  m8_01_generics,
  m8_02_traits,
  m9_01_modules,
  m9_02_testing,
  m10_01_todo_cli,
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonsByMilestone(milestone: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.milestone === milestone);
}
