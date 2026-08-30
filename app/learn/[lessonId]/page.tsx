import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getLesson, LESSONS } from "@/content/lessons";
import { LessonWorkspace } from "@/components/LessonWorkspace";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  return { title: lesson ? `${lesson.title} | Rust学習` : "レッスン | Rust学習" };
}

export default async function LessonPage({ params }: PageProps<"/learn/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);

  if (!lesson) notFound();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:h-[100dvh] md:flex-none md:overflow-hidden">
      <LessonWorkspace
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        milestone={lesson.milestone}
        exercise={lesson.exercise}
        explanation={
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
            {lesson.bookUrl && (
              <a
                href={lesson.bookUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-blue-600 underline dark:text-blue-400"
              >
                The Book で詳しく読む →
              </a>
            )}
          </>
        }
      />
    </main>
  );
}
