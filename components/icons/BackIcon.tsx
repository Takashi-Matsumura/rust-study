interface BackIconProps {
  className?: string;
}

/** ヘッダーで使う「学習マップへ戻る」の矢印アイコン */
export function BackIcon({ className }: BackIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
