// Stroke only, 1.5px, outlined icons in currentColor. Hand rolled so we do not
// depend on a specific lucide version. Geometric and minimal, per the reference.

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Svg({
  size = 24,
  className,
  strokeWidth = 1.5,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconMonitoring(props: IconProps) {
  // an activity pulse, echoing the signal
  return (
    <Svg {...props}>
      <polyline points="2 12 6 12 9 4 15 20 18 12 22 12" />
    </Svg>
  );
}

export function IconUpdates(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <polyline points="21 3 21 9 15 9" />
    </Svg>
  );
}

export function IconEndpoints(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <line x1="2" y1="20.5" x2="22" y2="20.5" />
    </Svg>
  );
}

export function IconBackups(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="9 6 15 12 9 18" />
    </Svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z" />
    </Svg>
  );
}
