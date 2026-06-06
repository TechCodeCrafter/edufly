import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { LevelBadge } from './ui';
import { useProgress } from '../store/progress';
import { useTheme } from '../store/theme';

const links = [
  { to: '/', label: 'Roadmap' },
  { to: '/projects', label: 'Projects' },
  { to: '/interview', label: 'Interview' },
  { to: '/dashboard', label: 'Dashboard' },
];

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/' || pathname.startsWith('/topic') || pathname.startsWith('/track');
  if (to === '/projects') return pathname.startsWith('/projects') || pathname.startsWith('/project/');
  return pathname.startsWith(to);
}

export function Nav() {
  const { pathname } = useLocation();
  const { streakDays, level } = useProgress();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 darkchrome border-b border-white/[0.06]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = isActive(pathname, l.to);
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-white/55 hover:text-white/90'
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full gradient-bg" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex">
            <Icon name="flame" size={15} className="text-streak" />
            {streakDays} <span className="font-normal text-white/55">day streak</span>
          </span>
          <button
            onClick={toggle}
            aria-label={`Switch content to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <LevelBadge level={level} className="hidden sm:inline-flex" />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 darkchrome border-l border-white/10 p-6 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white"
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
                  className={`block rounded-xl px-4 py-3 text-base font-medium ${
                    isActive(pathname, l.to) ? 'gradient-bg text-white' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
            <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
              <Icon name="flame" size={16} className="text-streak" /> {streakDays} day streak
            </span>
            <LevelBadge level={level} />
          </div>
        </div>
      </div>
    </header>
  );
}
