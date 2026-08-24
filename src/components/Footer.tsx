import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { XIcon } from './XIcon';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-fg-faint">
              The free, structured path to becoming a DevOps engineer. Built for beginners, trusted by engineers.
            </p>
            <a
              href="https://x.com/uday_devops"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on X"
              className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:text-fg"
            >
              <XIcon size={15} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            <Link to="/" className="text-sm text-fg-muted transition-colors hover:text-fg">Roadmap</Link>
            <Link to="/projects" className="text-sm text-fg-muted transition-colors hover:text-fg">Projects</Link>
            <Link to="/interview" className="text-sm text-fg-muted transition-colors hover:text-fg">Interview</Link>
            <Link to="/dashboard" className="text-sm text-fg-muted transition-colors hover:text-fg">Dashboard</Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-xs uppercase tracking-eyebrow text-fg-faint">{'\u00a9 2026 Edufly \u00b7 Free forever'}</p>
          <p className="mono text-xs uppercase tracking-eyebrow text-fg-faint">Made for engineers who ship</p>
        </div>
      </div>
    </footer>
  );
}
