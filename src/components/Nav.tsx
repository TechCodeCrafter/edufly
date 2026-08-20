import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { LevelBadge } from './ui';
import { AccountMenu } from './AccountMenu';
import { useProgress } from '../store/progress';
import { useTheme } from '../store/theme';

const links = [
  { to: '/', label: 'Roadmap' },
  { to: '/projects', label: 'Projects' },
  { to: '/compare', label: 'Compare' },
  { to: '/interview', label: 'Interview' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/dashboard', label: 'Dashboard' },
];

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/' || pathname.startsWith('/topic') || pathname.startsWith('/track');
  if (to === '/projects') return pathname.startsWith('/projects') || pathname.startsWith('/project/');
  if (to === '/compare') return pathname.startsWith('/compare');
  return pathname.startsWith(to);
}

export function Nav() {
  const { pathname } = useLocation();
  const { streakDays, level } = useProgress();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
    <header className="nav-frost sticky top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = isActive(pathname, l.to);
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-fg' : 'text-fg-faint hover:text-fg'
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute inset-x-3.5 -bottom-[21px] h-0.5 rounded-full gradient-bg" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="group relative hidden cursor-default items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-fg backdrop-blur sm:inline-flex">
            <Icon name="flame" size={15} className="text-streak" />
            {streakDays} <span className="font-normal text-fg-faint">day streak</span>
            <span
              role="tooltip"
              className="glass pointer-events-none absolute right-0 top-full z-30 mt-2 w-56 translate-y-1 rounded-card px-3 py-2 text-xs font-normal leading-relaxed text-fg-muted opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
              Complete at least one topic each day to keep your streak going. Miss a day and it resets to zero.
            </span>
          </span>
          <button
            onClick={toggle}
            aria-label={`Switch content to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-fg-muted backdrop-blur transition-colors hover:text-fg"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <LevelBadge level={level} className="hidden sm:inline-flex" />
          <div className="hidden md:block">
            <AccountMenu />
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-fg backdrop-blur md:hidden"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile sheet — only mounted when open so the off-screen panel can never
          add phantom horizontal scroll on small screens. Rendered outside
          <header> because its backdrop-blur creates a containing block that
          would otherwise confine this "fixed" overlay to the header's box
          instead of the full viewport. */}
      {open && (
      <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
        <div
          className="absolute inset-0 bg-black/60 animate-fade-in"
          onClick={() => setOpen(false)}
        />
        <div className="nav-frost absolute right-0 top-0 h-full w-72 max-w-[80vw] border-l border-line bg-page p-6 animate-slide-in-right">
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block rounded-full px-4 py-3 text-base font-medium ${
                    isActive(pathname, l.to) ? 'gradient-bg text-white' : 'text-fg-muted hover:bg-card-2'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3 border-t border-line pt-6">
            <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
              <Icon name="flame" size={16} className="text-streak" /> {streakDays} day streak
            </span>
            <LevelBadge level={level} />
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <AccountMenu compact />
          </div>
        </div>
      </div>
      )}
    </>
  );
}
