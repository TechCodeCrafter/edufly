import { Icon, type IconName } from './Icon';
import type { Difficulty } from '../data/types';

/* ----------------------------- Button ----------------------------- */
type ButtonVariant = 'primary' | 'light' | 'dark' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const sizeCls: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center rounded-btn font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<ButtonVariant, string> = {
    primary: 'gradient-bg text-white shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5',
    light: 'bg-white text-ink-900 border border-line hover:bg-card-2 hover:-translate-y-0.5 shadow-card',
    dark: 'bg-white/5 text-white border border-white/15 hover:bg-white/10 backdrop-blur',
    ghost: 'text-fg-muted hover:text-fg hover:bg-card-2',
  };
  const iconSize = size === 'lg' ? 20 : 18;
  return (
    <button className={`${base} ${sizeCls[size]} ${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

/* ----------------------------- Ring (progress) ----------------------------- */
export function Ring({
  value,
  size = 44,
  stroke = 4,
  showLabel = true,
  label,
  className = '',
  animate = true,
}: {
  value: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const id = `ring-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`relative inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--grad-from)" />
            <stop offset="100%" stopColor="var(--grad-to)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={animate ? { transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' } : undefined}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute mono font-semibold text-fg"
          style={{ fontSize: Math.max(10, size * 0.24) }}
        >
          {label ?? `${pct}%`}
        </span>
      )}
    </div>
  );
}

/* ----------------------------- Bar (progress) ----------------------------- */
export function Bar({ value, className = '', height = 6 }: { value: number; className?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-ringtrack ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full gradient-bg rounded-full"
        style={{ width: `${pct}%`, transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </div>
  );
}

/* ----------------------------- LevelBadge ----------------------------- */
export function LevelBadge({ level, className = '' }: { level: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 py-1 text-xs font-semibold text-white ${className}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full gradient-bg text-[11px] font-bold">TK</span>
      Lvl {level}
    </span>
  );
}

/* ----------------------------- StatusBadge ----------------------------- */
export type StatusKind = 'completed' | 'in-progress' | 'optional' | 'locked';
export function StatusBadge({ kind, className = '' }: { kind: StatusKind; className?: string }) {
  const map: Record<StatusKind, { label: string; cls: string; dot: string }> = {
    completed: { label: 'Completed', cls: 'text-done bg-done/10', dot: 'bg-done' },
    'in-progress': { label: 'In progress', cls: 'text-progress bg-progress/10', dot: 'bg-progress' },
    optional: { label: 'Optional', cls: 'text-optional bg-optional/10', dot: 'bg-optional' },
    locked: { label: 'Locked', cls: 'text-locked bg-locked/10', dot: 'bg-locked' },
  };
  const m = map[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${m.cls} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

/* ----------------------------- DifficultyBadge ----------------------------- */
const diffColor: Record<Difficulty, string> = {
  beginner: 'diff-beginner',
  intermediate: 'diff-intermediate',
  advanced: 'diff-advanced',
};
const diffLabel: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function DifficultyBadge({ level, className = '' }: { level: Difficulty; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted ${className}`}>
      <span className={`h-2 w-2 rounded-full bg-${diffColor[level]}`} />
      {diffLabel[level]}
    </span>
  );
}

// Three dots representing the difficulty mix of a track (beginner+ etc.)
export function DifficultyDots({ levels }: { levels: Difficulty[] }) {
  const has = (l: Difficulty) => levels.includes(l);
  const order: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
  const top = order.find((l) => has(l)) ?? 'beginner';
  return (
    <span className="inline-flex items-center gap-2 text-xs text-fg-faint">
      <span className="flex items-center gap-1">
        {order.map((l) => (
          <span
            key={l}
            className={`h-1.5 w-1.5 rounded-full ${has(l) ? `bg-${diffColor[l]}` : 'bg-ringtrack'}`}
          />
        ))}
      </span>
      <span className="font-medium">{diffLabel[top]}+</span>
    </span>
  );
}

/* ----------------------------- Chip ----------------------------- */
export function Chip({
  active,
  count,
  children,
  onClick,
  dotColor,
}: {
  active?: boolean;
  count?: number;
  children: React.ReactNode;
  onClick?: () => void;
  dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
        active
          ? 'gradient-bg border-transparent text-white shadow-glow-sm'
          : 'border-line bg-card text-fg-muted hover:border-fg-faint hover:text-fg'
      }`}
    >
      {dotColor && <span className={`h-2 w-2 rounded-full ${dotColor}`} />}
      {children}
      {count !== undefined && (
        <span className={`mono text-xs ${active ? 'text-white/80' : 'text-fg-faint'}`}>{count}</span>
      )}
    </button>
  );
}

/* ----------------------------- IconTile (gradient) ----------------------------- */
export function IconTile({ name, size = 'md' }: { name: IconName; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-9 w-9 rounded-[10px]', md: 'h-11 w-11 rounded-xl', lg: 'h-14 w-14 rounded-2xl' };
  const icon = { sm: 18, md: 22, lg: 28 };
  return (
    <span className={`grid place-items-center gradient-bg text-white shadow-glow-sm ${dims[size]}`}>
      <Icon name={name} size={icon[size]} />
    </span>
  );
}

export { diffColor, diffLabel };
