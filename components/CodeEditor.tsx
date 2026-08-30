"use client";

import { useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import type { Statistics } from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

/**
 * @uiw/react-codemirrorが自動で足すheight:100%は、内側の.cm-scroller(実際に
 * 高さを持つべき領域)がcm-editor(display:flexのflexコンテナ)の中で
 * flex-grow:0のままなので効かず、コードが短いとエディタ下部に大きな空白ができる。
 * .cm-scrollerを明示的にflex-growさせ、cm-editorの高さいっぱいまで広げる。
 */
const fillHeightTheme = EditorView.theme({
  "&": { display: "flex", flexDirection: "column" },
  ".cm-scroller": { flexGrow: 1, minHeight: 0 },
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  /** エディタの文字サイズ(px)。ブラウザの拡大縮小とは独立してエディタだけ変更できる */
  fontSize?: number;
  /** 選択範囲が変わるたびに選択中のテキストを通知する(AIチューターへの質問用) */
  onSelectionChange?: (selectedText: string) => void;
}

/**
 * Rustコード用エディタ。CodeMirror 6を@uiw/react-codemirror経由で利用する。
 * CM6は日本語IMEの変換状態を内部で管理してからonChangeを発火するため、
 * 変換途中の文字が消えるといった問題は起きない設計になっている。
 */
export function CodeEditor({
  value,
  onChange,
  readOnly,
  minHeight,
  fontSize,
  onSelectionChange,
}: CodeEditorProps) {
  // 直前に通知した選択テキストを覚えておき、同じ内容での再通知(無駄な再レンダー)を防ぐ
  const lastSelectionRef = useRef("");
  // fontSizeを変えるたびにテーマ拡張を作り直す。行番号や行間もfontSizeに連動して
  // 相対単位で計算されるため、.cm-editor直下に指定するのが一番崩れにくい。
  const fontSizeTheme = useMemo(
    () =>
      EditorView.theme({
        "&": { fontSize: `${fontSize ?? 14}px` },
      }),
    [fontSize],
  );

  const handleStatistics = (stats: Statistics) => {
    if (!onSelectionChange) return;
    const selected = stats.selectedText ? stats.selectionCode : "";
    if (selected === lastSelectionRef.current) return;
    lastSelectionRef.current = selected;
    onSelectionChange(selected);
  };

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      onStatistics={onSelectionChange ? handleStatistics : undefined}
      readOnly={readOnly}
      theme={oneDark}
      extensions={[rust(), fontSizeTheme, fillHeightTheme]}
      height="100%"
      minHeight={minHeight ?? "200px"}
      basicSetup={{ tabSize: 4 }}
    />
  );
}
