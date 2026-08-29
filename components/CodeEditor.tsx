"use client";

import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
}

/**
 * Rustコード用エディタ。CodeMirror 6を@uiw/react-codemirror経由で利用する。
 * CM6は日本語IMEの変換状態を内部で管理してからonChangeを発火するため、
 * 変換途中の文字が消えるといった問題は起きない設計になっている。
 */
export function CodeEditor({ value, onChange, readOnly, minHeight }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      theme={oneDark}
      extensions={[rust()]}
      height="100%"
      minHeight={minHeight ?? "200px"}
      basicSetup={{ tabSize: 4 }}
    />
  );
}
