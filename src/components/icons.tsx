import type { ReactNode } from "react";

const STAR_D =
  "M530.2 224.5L660.8 224.5M549.4 178.4L641.6 270.6M595.5 159.2L595.5 289.8M641.6 178.4L549.4 270.6";

export function Star({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 12.5,
}: {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={`star ${className}`}
      width={size}
      height={size}
      viewBox="517.75 146.75 155.5 155.5"
      aria-hidden="true"
    >
      <path d={STAR_D} stroke={color} strokeWidth={strokeWidth} fill="none" />
    </svg>
  );
}

export function Arrow({
  size = 18,
  className = "",
  strokeWidth = 2.5,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M8 6h10v10" />
    </svg>
  );
}

export function ArrowRight({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={`arrow-r ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function DotGrid({
  cols = 4,
  rows = 4,
  gap = 22,
  r = 2.2,
  className = "",
  color = "currentColor",
}: {
  cols?: number;
  rows?: number;
  gap?: number;
  r?: number;
  className?: string;
  color?: string;
}) {
  const w = (cols - 1) * gap + r * 2;
  const h = (rows - 1) * gap + r * 2;
  const dots = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push(
        <circle key={`${x}-${y}`} cx={r + x * gap} cy={r + y * gap} r={r} />,
      );
    }
  }
  return (
    <svg
      className={`dot-grid ${className}`}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill={color}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

function Outline({
  size = 44,
  children,
}: {
  size?: number;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type OutlineProps = { size?: number };

export const OutlineIcons: Record<string, (props: OutlineProps) => ReactNode> =
  {
    teamup: (props) => (
      <Outline {...props}>
        <circle cx="16" cy="16" r="6" />
        <circle cx="32" cy="16" r="6" />
        <path d="M4 40c0-7 5-12 12-12s12 5 12 12M20 40c0-7 5-12 12-12s12 5 12 12" />
      </Outline>
    ),
    learn: (props) => (
      <Outline {...props}>
        <path d="M4 12l20-6 20 6-20 6-20-6z" />
        <path d="M12 15v12c0 3 5 6 12 6s12-3 12-6V15M44 12v14" />
      </Outline>
    ),
    build: (props) => (
      <Outline {...props}>
        <rect x="4" y="8" width="40" height="30" />
        <path d="M4 16h40M18 24l-5 5 5 5M30 24l5 5-5 5M26 22l-4 14" />
      </Outline>
    ),
    test: (props) => (
      <Outline {...props}>
        <path d="M18 4h12M20 4v14L8 40h32L28 18V4" />
        <path d="M13 31h22" />
      </Outline>
    ),
    ship: (props) => (
      <Outline {...props}>
        <path d="M24 4c8 6 10 16 8 26H16C14 20 16 10 24 4z" />
        <circle cx="24" cy="17" r="4" />
        <path d="M16 30l-6 6v6h8M32 30l6 6v6h-8M20 36h8v8h-8z" />
      </Outline>
    ),
    "product-manager": (props) => (
      <Outline {...props}>
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="10" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <path d="M24 2v8M24 38v8M2 24h8M38 24h8" />
      </Outline>
    ),
    "interaction-designer": (props) => (
      <Outline {...props}>
        <path d="M6 42l4-12L34 6l8 8-24 24-12 4z" />
        <path d="M28 12l8 8M10 30l8 8" />
      </Outline>
    ),
    "software-engineer": (props) => (
      <Outline {...props}>
        <path d="M16 12L4 24l12 12M32 12l12 12-12 12M28 6l-8 36" />
      </Outline>
    ),
    workshop: (props) => (
      <Outline {...props}>
        <rect x="4" y="6" width="40" height="26" />
        <path d="M24 32v10M14 42h20M12 24l8-8 6 6 10-10" />
      </Outline>
    ),
    mentor: (props) => (
      <Outline {...props}>
        <circle cx="18" cy="14" r="7" />
        <path d="M4 42c0-8 6-14 14-14 4 0 7 1 9 3M30 30l4 4 10-10" />
      </Outline>
    ),
    demo: (props) => (
      <Outline {...props}>
        <path d="M8 40h32M24 40V28M12 28h24V8H12z" />
        <path d="M20 14l8 4-8 4z" />
      </Outline>
    ),
  };
