import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Icon } from '../components/Icon';

export default function NotFound() {
  return (
    <section className="darkchrome relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute inset-0 hero-glow" />
      <div className="relative mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
        <span className="mono inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-eyebrow text-white/55">
          Error 404
        </span>
        <h1 className="mt-6 font-display text-[clamp(3rem,2rem+6vw,5rem)] font-bold leading-none tracking-tight2 text-white">
          <span className="gradient-text">Off</span> the path
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/55">
          This route does not exist on the roadmap. Head back to the start and pick up where you left off.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button size="lg" icon="compass">Back to roadmap</Button>
          </Link>
          <Link to="/interview">
            <Button size="lg" variant="dark" icon="book">Interview guide</Button>
          </Link>
        </div>
        <div className="mt-10 inline-flex items-center gap-2 text-sm text-white/40">
          <Icon name="terminal" size={16} />
          <span className="mono">cd ~/devops-roadmap</span>
        </div>
      </div>
    </section>
  );
}
