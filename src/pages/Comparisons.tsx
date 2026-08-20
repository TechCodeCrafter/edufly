import { useState } from 'react';
import { Link } from 'react-router-dom';
import { comparisons, comparisonCategories } from '../data/comparisons';
import { Chip, EyebrowPill } from '../components/ui';
import { Icon } from '../components/Icon';

export default function Comparisons() {
  const [category, setCategory] = useState<string | null>(null);
  const filtered = category ? comparisons.filter((c) => c.category === category) : comparisons;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <EyebrowPill dot className="mb-3">
        {comparisons.length} comparisons
      </EyebrowPill>
      <h1 className="hero-title text-fg">
        Tech concepts,
        <br />
        <span className="gradient-text">compared</span>.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
        The pairs of concepts interviewers ask about most, TCP vs UDP, monolith vs microservices, and more,
        broken down side by side so the difference actually sticks.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Chip active={category === null} count={comparisons.length} onClick={() => setCategory(null)}>
          All
        </Chip>
        {comparisonCategories.map((cat) => (
          <Chip
            key={cat}
            active={category === cat}
            count={comparisons.filter((c) => c.category === cat).length}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <Link
            key={c.id}
            to={`/compare/${c.id}`}
            className="group glass flex flex-col rounded-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
            style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="mono rounded-full bg-accent/10 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-accent">
                {c.category}
              </span>
              <Icon name="compare" size={18} className="text-fg-faint transition-colors group-hover:text-accent" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold tracking-tight2 text-fg">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{c.tagline}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              See the breakdown
              <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
