import Link from "next/link";
import { ProgressMap } from "@/components/ProgressMap";
import { PlaygroundIcon } from "@/components/icons/PlaygroundIcon";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Rust学習</h1>
          <p className="mt-1 text-sm text-foreground/70">
            プログラミングがはじめての人のためのRust入門。環境構築は不要です。
          </p>
        </div>
        <Link
          href="/playground"
          aria-label="自由に書いて試す"
          title="自由に書いて試す"
          className="flex-none rounded-md border border-foreground/20 p-1.5 text-foreground/70 hover:bg-foreground/5"
        >
          <PlaygroundIcon className="h-5 w-5" />
        </Link>
      </div>
      <ProgressMap />
    </main>
  );
}
