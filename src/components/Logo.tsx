import { Link } from 'react-router-dom';
import markUrl from '../assets/edufly-mark.png';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Edufly home">
      <img
        src={markUrl}
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 object-contain"
      />
      <span className="font-display text-lg font-bold tracking-tight2 text-fg">
        Edu<span className="gradient-text">fly</span>
      </span>
    </Link>
  );
}
