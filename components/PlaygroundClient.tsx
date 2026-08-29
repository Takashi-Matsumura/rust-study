"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { RunPanel } from "@/components/RunPanel";

const DEFAULT_CODE = `fn main() {
    println!("Hello, world!");
}
`;

export function PlaygroundClient() {
  const [code, setCode] = useState(DEFAULT_CODE);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
      <div className="min-h-[300px] flex-1 overflow-hidden rounded-md border border-foreground/10">
        <CodeEditor value={code} onChange={setCode} minHeight="300px" />
      </div>
      <div className="flex-1">
        <RunPanel code={code} mode="run" />
      </div>
    </div>
  );
}
