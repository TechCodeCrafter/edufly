import { Link } from 'react-router-dom';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="TekOps home">
      <span className="grid h-8 w-8 place-items-center rounded-[9px] gradient-bg shadow-glow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7" stroke="#06080f" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="2.4" fill="#06080f" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight2 text-white">
        Tek<span className="gradient-text">Ops</span>
      </span>
    </Link>
  );
}
