import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="darkchrome border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              The free, structured path to becoming a DevOps engineer. Built for beginners, trusted by engineers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3">
            <Link to="/" className="text-sm text-white/55 transition-colors hover:text-white">Roadmap</Link>
            <Link to="/projects" className="text-sm text-white/55 transition-colors hover:text-white">Projects</Link>
            <Link to="/interview" className="text-sm text-white/55 transition-colors hover:text-white">Interview</Link>
            <Link to="/dashboard" className="text-sm text-white/55 transition-colors hover:text-white">Dashboard</Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-xs uppercase tracking-eyebrow text-white/35">© 2026 TekOps · Free &amp; open</p>
          <p className="mono text-xs uppercase tracking-eyebrow text-white/35">Made for engineers who ship</p>
        </div>
      </div>
    </footer>
  );
}
