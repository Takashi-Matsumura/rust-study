import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/PlaygroundClient";

export const metadata: Metadata = {
  title: "Playground | Rust学習",
};

export default function PlaygroundPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="px-4 pt-4">
        <Link href="/" className="text-sm text-foreground/60 hover:underline">
          ← 学習マップ
        </Link>
      </div>
      <h1 className="px-4 pt-2 text-lg font-bold">自由に書いて試す</h1>
      <PlaygroundClient />
    </main>
  );
}
