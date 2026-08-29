"use client";

import Link from "next/link";
import { MILESTONES } from "@/content/curriculum";
import { getLessonsByMilestone, LESSONS } from "@/content/lessons";
import { useProgress } from "@/lib/progress";

export function ProgressMap() {
  const progress = useProgress();

  const nextLesson = LESSONS.find(
    (lesson) => !progress.completedLessonIds.includes(lesson.id),
  );

  return (
    <div className="flex flex-col gap-6">
      {nextLesson ? (
        <Link
          href={`/learn/${nextLesson.id}`}
          className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          次にやる: {nextLesson.title} →
        </Link>
      ) : (
        <p className="rounded-md bg-green-500/10 px-4 py-2 text-sm text-green-700 dark:text-green-400">
          🎉 用意されているレッスンをすべて完了しました！
        </p>
      )}

      <ol className="flex flex-col gap-3">
        {MILESTONES.map((milestone) => {
          const lessons = getLessonsByMilestone(milestone.id);
          const completedCount = lessons.filter((lesson) =>
            progress.completedLessonIds.includes(lesson.id),
          ).length;

          return (
            <li
              key={milestone.id}
              className="rounded-md border border-foreground/10 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-foreground/10 px-2 py-0.5 font-mono text-xs">
                  {milestone.id}
                </span>
                <h2 className="font-semibold">{milestone.title}</h2>
                {lessons.length > 0 && (
                  <span className="ml-auto text-xs text-foreground/50">
                    {completedCount}/{lessons.length}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground/70">{milestone.goal}</p>

              {milestone.id === "M4" && (
                <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  ここが最大の山です。時間をかけて取り組みましょう。
                </p>
              )}

              {lessons.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {lessons.map((lesson) => {
                    const done = progress.completedLessonIds.includes(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.id}`}
                        className={`rounded-full px-3 py-1 text-xs ${
                          done
                            ? "bg-green-500/15 text-green-700 dark:text-green-400"
                            : "bg-foreground/5 text-foreground/70"
                        }`}
                      >
                        {done ? "✅" : "○"} {lesson.title}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-xs text-foreground/40">準備中</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
