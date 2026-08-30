interface PlaygroundIconProps {
  className?: string;
}

/** 「自由に書いて試す(Playground)」への導線で使うコード片(&lt;&gt;)アイコン */
export function PlaygroundIcon({ className }: PlaygroundIconProps) {
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
      <path d="m8 6-6 6 6 6" />
      <path d="m16 6 6 6-6 6" />
    </svg>
  );
}
