import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/PlaygroundClient";
import { BackIcon } from "@/components/icons/BackIcon";

export const metadata: Metadata = {
  title: "Playground | Rust学習",
};

export default function PlaygroundPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 text-sm">
        <Link
          href="/"
          aria-label="学習マップに戻る"
          title="学習マップに戻る"
          className="rounded-md p-1.5 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
        >
          <BackIcon className="h-4 w-4" />
        </Link>
        <h1 className="font-bold">自由に書いて試す</h1>
      </div>
      <PlaygroundClient />
    </main>
  );
}
