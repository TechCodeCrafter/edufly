import { Link, useParams } from 'react-router-dom';
import { comparisonById, comparisons } from '../data/comparisons';
import { tracks } from '../data/tracks';
import { Glass, EyebrowPill, Button } from '../components/ui';
import { Icon } from '../components/Icon';
import NotFound from './NotFound';

export default function ComparisonDetail() {
  const { id } = useParams<{ id: string }>();
  const comparison = id ? comparisonById(id) : undefined;

  if (!comparison) return <NotFound />;

  const track = comparison.trackId ? tracks.find((t) => t.id === comparison.trackId) : undefined;
  const firstTopicId = track?.topics[0]?.id;
  const more = comparisons.filter((c) => c.id !== comparison.id && c.category === comparison.category).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <Link to="/compare" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg">
        <Icon name="arrow-right" size={15} className="rotate-180" />
        All comparisons
      </Link>

      <EyebrowPill dot className="mt-6 mb-3">{comparison.category}</EyebrowPill>
      <h1 className="hero-title text-fg">{comparison.title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted">{comparison.summary}</p>

      {/* Side by side names */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="glass rounded-card p-5 text-center">
          <span className="mono text-[10px] uppercase tracking-eyebrow text-accent">Left</span>
          <h2 className="mt-1.5 font-display text-lg font-bold text-fg">{comparison.leftName}</h2>
        </div>
        <div className="glass rounded-card p-5 text-center">
          <span className="mono text-[10px] uppercase tracking-eyebrow text-accent">Right</span>
          <h2 className="mt-1.5 font-display text-lg font-bold text-fg">{comparison.rightName}</h2>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-6 overflow-hidden rounded-card border border-line">
        {comparison.rows.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-[1fr_1.4fr_1.4fr] gap-3 px-4 py-4 sm:grid-cols-[0.9fr_1.4fr_1.4fr] ${
              i > 0 ? 'border-t border-line' : ''
            } ${i % 2 === 1 ? 'bg-card-2/40' : ''}`}
          >
            <span className="mono self-center text-xs font-semibold uppercase tracking-eyebrow text-fg-faint">
              {row.label}
            </span>
            <span className="text-sm leading-snug text-fg">{row.left}</span>
            <span className="text-sm leading-snug text-fg">{row.right}</span>
          </div>
        ))}
      </div>

      {/* When to use each */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Glass className="p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card-2 text-accent">
            <Icon name="check" size={18} />
          </span>
          <h3 className="mt-4 font-display text-base font-bold text-fg">{`Use ${comparison.leftName} when`}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{comparison.useLeftWhen}</p>
        </Glass>
        <Glass className="p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card-2 text-accent">
            <Icon name="check" size={18} />
          </span>
          <h3 className="mt-4 font-display text-base font-bold text-fg">{`Use ${comparison.rightName} when`}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{comparison.useRightWhen}</p>
        </Glass>
      </div>

      {/* Verdict */}
      <div className="mt-8 gradient-border rounded-card bg-card p-1 shadow-card">
        <div className="rounded-[18px] bg-card px-6 py-6">
          <span className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-eyebrow text-accent">
            <Icon name="target" size={13} />
            The verdict
          </span>
          <p className="mt-2.5 text-sm leading-relaxed text-fg">{comparison.verdict}</p>
        </div>
      </div>

      {/* Related track */}
      {track && firstTopicId && (
        <Link
          to={`/topic/${firstTopicId}`}
          className="mt-8 group glass flex items-center justify-between gap-4 rounded-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-bg text-white">
              <Icon name={track.icon as any} size={20} />
            </span>
            <div>
              <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Study this on the roadmap</p>
              <h3 className="mt-0.5 font-display text-base font-semibold text-fg">{track.name}</h3>
            </div>
          </div>
          <Icon name="arrow-right" size={18} className="shrink-0 text-fg-faint transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* More in this category */}
      {more.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 font-display text-lg font-bold tracking-tight2 text-fg">More in {comparison.category}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {more.map((c) => (
              <Link
                key={c.id}
                to={`/compare/${c.id}`}
                className="group glass flex flex-col rounded-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <h4 className="font-display text-sm font-bold text-fg">{c.title}</h4>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-fg-muted">{c.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  Compare <Icon name="arrow-right" size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link to="/compare">
          <Button variant="light" icon="compare">All comparisons</Button>
        </Link>
        <Link to="/interview">
          <Button icon="sparkle">Test this in a mock interview</Button>
        </Link>
      </div>
    </div>
  );
}
