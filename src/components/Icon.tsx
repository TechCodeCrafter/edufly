// Lucide-style inline stroke icon set. No brand logos — abstract marks only.
type IconProps = { name: IconName; size?: number; className?: string; strokeWidth?: number };

export type IconName =
  | 'terminal' | 'network' | 'code' | 'branch' | 'box' | 'kubernetes' | 'pipeline'
  | 'layers' | 'cloud' | 'activity' | 'shield' | 'gitops' | 'gauge' | 'grid'
  | 'compass' | 'book' | 'flame' | 'zap' | 'check' | 'clock' | 'chevron-down'
  | 'arrow-right' | 'play' | 'lock' | 'search' | 'sun' | 'moon' | 'menu' | 'x'
  | 'bookmark' | 'trophy' | 'circle' | 'trending-up' | 'external' | 'chevron-right'
  | 'list' | 'spine' | 'path' | 'sparkle' | 'target' | 'mic' | 'mic-off' | 'volume' | 'volume-off' | 'log-out';

const paths: Record<IconName, React.ReactNode> = {
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>,
  network: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><line x1="12" y1="7.5" x2="6.5" y2="16.5" /><line x1="12" y1="7.5" x2="17.5" y2="16.5" /></>,
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  branch: <><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.3 7 12 12 20.7 7" /><line x1="12" y1="22" x2="12" y2="12" /></>,
  kubernetes: <><path d="M12 2 3.5 6v8L12 18l8.5-4V6L12 2z" /><circle cx="12" cy="10" r="3" /></>,
  pipeline: <><polyline points="4 7 9 12 4 17" /><line x1="13" y1="17" x2="20" y2="17" /></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  cloud: <><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7 1.5A4 4 0 0 0 6 19z" /></>,
  activity: <><polyline points="3 12 7 12 10 4 14 20 17 12 21 12" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3z" /><polyline points="9 12 11 14 15 10" /></>,
  gitops: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="12" r="3" /><path d="M9 6h4a2 2 0 0 1 2 2v1" /><path d="M9 18h4a2 2 0 0 0 2-2v-1" /></>,
  gauge: <><path d="M12 14 16 9" /><path d="M3.5 18a9 9 0 1 1 17 0" /><circle cx="12" cy="14" r="1.2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><polygon points="16 8 10.5 10.5 8 16 13.5 13.5 16 8" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  flame: <><path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.2.4-2 1-2.8C8.5 9 9 7 12 2z" /><path d="M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2-4.5.2 2.5-1.5 3.5-2.5 3.5 .5-1.5 0-3.5-1.5-5-.5 3-4 3.5-4 6a6 6 0 0 0 6 6z" /></>,
  zap: <><polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" /></>,
  check: <><polyline points="20 6 9 17 4 12" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></>,
  'chevron-down': <><polyline points="6 9 12 15 18 9" /></>,
  'chevron-right': <><polyline points="9 6 15 12 9 18" /></>,
  'arrow-right': <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></>,
  play: <><polygon points="6 4 20 12 6 20 6 4" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></>,
  sun: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4" /></>,
  moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  x: <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>,
  bookmark: <><path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></>,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /></>,
  circle: <><circle cx="12" cy="12" r="9" /></>,
  'trending-up': <><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></>,
  external: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
  list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></>,
  spine: <><line x1="12" y1="3" x2="12" y2="21" /><circle cx="12" cy="6" r="2.2" /><circle cx="12" cy="12" r="2.2" /><circle cx="12" cy="18" r="2.2" /></>,
  path: <><path d="M5 5h8a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h11" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></>,
  'mic-off': <><line x1="3" y1="3" x2="21" y2="21" /><path d="M9 9v2a3 3 0 0 0 5.1 2.1" /><path d="M15 10.5V5a3 3 0 0 0-5.9-.7" /><path d="M5 11a7 7 0 0 0 10.3 6.2" /><path d="M19 11a7 7 0 0 1-.6 2.8" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /></>,
  volume: <><polygon points="4 9 8 9 13 5 13 19 8 15 4 15 4 9" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a8 8 0 0 1 0 11" /></>,
  'volume-off': <><polygon points="4 9 8 9 13 5 13 19 8 15 4 15 4 9" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>,
  'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
};

export function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
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
      {paths[name]}
    </svg>
  );
}
