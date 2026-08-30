"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  /** エディタの文字サイズ(px)。ブラウザの拡大縮小とは独立してエディタだけ変更できる */
  fontSize?: number;
}

/**
 * Rustコード用エディタ。CodeMirror 6を@uiw/react-codemirror経由で利用する。
 * CM6は日本語IMEの変換状態を内部で管理してからonChangeを発火するため、
 * 変換途中の文字が消えるといった問題は起きない設計になっている。
 */
export function CodeEditor({ value, onChange, readOnly, minHeight, fontSize }: CodeEditorProps) {
  // fontSizeを変えるたびにテーマ拡張を作り直す。行番号や行間もfontSizeに連動して
  // 相対単位で計算されるため、.cm-editor直下に指定するのが一番崩れにくい。
  const fontSizeTheme = useMemo(
    () =>
      EditorView.theme({
        "&": { fontSize: `${fontSize ?? 14}px` },
      }),
    [fontSize],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      theme={oneDark}
      extensions={[rust(), fontSizeTheme]}
      height="100%"
      minHeight={minHeight ?? "200px"}
      basicSetup={{ tabSize: 4 }}
    />
  );
}
