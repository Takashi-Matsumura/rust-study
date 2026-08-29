import Link from "next/link";
import { ProgressMap } from "@/components/ProgressMap";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Rust学習</h1>
        <p className="mt-1 text-sm text-foreground/70">
          プログラミングがはじめての人のためのRust入門。環境構築は不要です。
        </p>
        <Link
          href="/playground"
          className="mt-2 inline-block text-sm text-blue-600 underline dark:text-blue-400"
        >
          自由に書いて試す →
        </Link>
      </div>
      <ProgressMap />
    </main>
  );
}
