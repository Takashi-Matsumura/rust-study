interface RobotIconProps {
  className?: string;
}

/** AIチューターを表すロボットの線画アイコン */
export function RobotIcon({ className }: RobotIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v3" />
      <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none" />
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M2 13v3" />
      <path d="M22 13v3" />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9 17.5h6" />
    </svg>
  );
}
