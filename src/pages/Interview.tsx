import { useMemo, useState } from 'react';
import { questions } from '../data/questions';
import { useProgress } from '../store/progress';
import { Chip, Ring, Button } from '../components/ui';
import { Icon } from '../components/Icon';
import { QuestionCard } from '../components/QuestionCard';
import { DarkHeader } from '../components/DarkHeader';
import type { Difficulty } from '../data/types';

const ALL = 'All';
const difficulties: (Difficulty | typeof ALL)[] = [ALL, 'beginner', 'intermediate', 'advanced'];
const diffDot: Record<Difficulty, string> = {
  beginner: 'bg-diff-beginner',
  intermediate: 'bg-diff-intermediate',
  advanced: 'bg-diff-advanced',
};

export default function Interview() {
  const { masteredCount, questionsTotal } = useProgress();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>(ALL);
  const [diff, setDiff] = useState<Difficulty | typeof ALL>(ALL);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.category] = (counts[q.category] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = questions.filter((q) => {
    const matchCat = cat === ALL || q.category === cat;
    const matchDiff = diff === ALL || q.difficulty === diff;
    const matchQuery =
      query.trim() === '' ||
      q.question.toLowerCase().includes(query.toLowerCase()) ||
      q.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchDiff && matchQuery;
  });

  const masteryPct = Math.round((masteredCount / questionsTotal) * 100);
  const hasFilters = query !== '' || cat !== ALL || diff !== ALL;
  const reset = () => {
    setQuery('');
    setCat(ALL);
    setDiff(ALL);
  };

  return (
    <>
      <DarkHeader>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="mono inline-block rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-white/60">
              Interview prep
            </span>
            <h1 className="mt-4 font-display text-[clamp(2rem,1rem+3vw,3.25rem)] font-bold leading-[1.06] tracking-tight2 text-white">
              {questions.length}+ questions, <span className="gradient-text">crisp answers</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55">
              Real questions sorted by topic and difficulty, each with a model answer you can actually say out loud.
              Flip a card, filter by what you are weak on, and mark the ones you have mastered.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-5 rounded-card border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm">
            <Ring value={masteryPct} size={72} stroke={6} labelClassName="text-white" trackClassName="text-white/15" />
            <div>
              <p className="font-display text-2xl font-bold text-white">
                {masteredCount}
                <span className="text-white/40">/{questionsTotal}</span>
              </p>
              <p className="mt-0.5 text-xs text-white/45">Mastered</p>
            </div>
          </div>
        </div>
      </DarkHeader>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
        {/* Search */}
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, topics, keywords"
            className="w-full rounded-btn border border-line bg-card py-3.5 pl-11 pr-4 text-sm text-fg shadow-card outline-none transition-colors placeholder:text-fg-faint focus:border-progress"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-fg-faint transition-colors hover:bg-card-2 hover:text-fg"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="no-scrollbar -mx-5 mt-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={cat === ALL} count={questions.length} onClick={() => setCat(ALL)}>
            All topics
          </Chip>
          {categories.map(([name, count]) => (
            <Chip key={name} active={cat === name} count={count} onClick={() => setCat(name)}>
              {name}
            </Chip>
          ))}
        </div>

        {/* Difficulty */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="mono mr-1 text-[10px] uppercase tracking-eyebrow text-fg-faint">Difficulty</span>
          {difficulties.map((d) => (
            <Chip
              key={d}
              active={diff === d}
              onClick={() => setDiff(d)}
              dotColor={d === ALL ? undefined : diffDot[d as Difficulty]}
            >
              <span className="capitalize">{d === ALL ? 'Any' : d}</span>
            </Chip>
          ))}
        </div>

        {/* Result count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-fg-muted">
            <span className="mono font-semibold text-fg">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'question' : 'questions'}
          </p>
          {hasFilters && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-progress transition-opacity hover:opacity-80"
            >
              <Icon name="x" size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="mt-4 space-y-3">
            {filtered.map((q, i) => (
              <QuestionCard key={q.id} question={q} num={i + 1} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid place-items-center rounded-card border border-dashed border-line bg-card py-20 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-card-2 text-fg-faint">
              <Icon name="search" size={26} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-fg">No questions found</h3>
            <p className="mt-1 max-w-sm text-sm text-fg-muted">
              Nothing matches your search and filters. Try broadening them to see more.
            </p>
            <Button variant="light" icon="x" className="mt-5" onClick={reset}>
              Reset everything
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
