import { useMemo, useState } from 'react';
import { questions } from '../data/questions';
import { useProgress } from '../store/progress';
import { Chip, Ring, Button, EyebrowPill, Glass } from '../components/ui';
import { Icon } from '../components/Icon';
import { QuestionCard } from '../components/QuestionCard';
import { DarkHeader } from '../components/DarkHeader';
import { QuickPractice } from '../components/ai/QuickPractice';
import { MockInterview } from '../components/ai/MockInterview';
import type { Difficulty, Question } from '../data/types';

const ALL = 'All';
const difficulties: (Difficulty | typeof ALL)[] = [ALL, 'beginner', 'intermediate', 'advanced'];
const diffDot: Record<Difficulty, string> = {
  beginner: 'bg-diff-beginner',
  intermediate: 'bg-diff-intermediate',
  advanced: 'bg-diff-advanced',
};

type AIMode = null | 'quick' | 'mock';

function randomQuestion(pool: Question[]): Question {
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Interview() {
  const { masteredCount, questionsTotal, toggleMastered, isMastered } = useProgress();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>(ALL);
  const [diff, setDiff] = useState<Difficulty | typeof ALL>(ALL);

  // AI practice state. quickQuestion holds the question being practiced.
  const [aiMode, setAiMode] = useState<AIMode>(null);
  const [quickQuestion, setQuickQuestion] = useState<Question | null>(null);

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

  // Start Quick Practice on a given question (or a random one from the filtered set).
  const startQuick = (q?: Question) => {
    setQuickQuestion(q ?? randomQuestion(filtered.length ? filtered : questions));
    setAiMode('quick');
  };
  const closeAI = () => {
    setAiMode(null);
    setQuickQuestion(null);
  };

  return (
    <>
      <DarkHeader>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <EyebrowPill dot>Interview prep</EyebrowPill>
            <h1 className="mt-4 hero-title text-fg">
              Practice for real, <span className="gradient-text">with AI</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
              Run a full mock interview that asks follow-ups and grades you, or drill single questions and get instant
              feedback on what to tighten. Plus {questions.length}+ questions with model answers to study.
            </p>
          </div>
          <Glass className="flex shrink-0 items-center gap-5 px-6 py-5">
            <Ring value={masteryPct} size={72} stroke={6} labelClassName="text-fg" />
            <div>
              <p className="font-display text-2xl font-bold text-fg">
                {masteredCount}
                <span className="text-fg-faint">/{questionsTotal}</span>
              </p>
              <p className="mt-0.5 text-xs text-fg-muted">Mastered</p>
            </div>
          </Glass>
        </div>
      </DarkHeader>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
        {/* AI practice launcher / active panel */}
        {aiMode === null && (
          <section className="grid gap-4 sm:grid-cols-2">
            <ModeCard
              icon="sparkle"
              title="Mock interview"
              desc="A back-and-forth interview that follows up on your answers, then scores you with an honest scorecard."
              cta="Start mock"
              onClick={() => setAiMode('mock')}
              accent
            />
            <ModeCard
              icon="target"
              title="Quick practice"
              desc="Pick a question, type your answer, and get an instant AI score with exactly what to improve."
              cta="Drill a question"
              onClick={() => startQuick()}
            />
          </section>
        )}

        {aiMode === 'mock' && (
          <section className="fade-up">
            <BackBar onBack={closeAI} label="Question bank" />
            <MockInterview onClose={closeAI} />
          </section>
        )}

        {aiMode === 'quick' && quickQuestion && (
          <section className="fade-up">
            <BackBar onBack={closeAI} label="Question bank" />
            <QuickPractice
              question={quickQuestion}
              onMastered={
                isMastered(quickQuestion.id)
                  ? undefined
                  : () => {
                      toggleMastered(quickQuestion.id);
                    }
              }
              onClose={closeAI}
            />
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" icon="arrow-right" onClick={() => startQuick()}>
                Practice another question
              </Button>
            </div>
          </section>
        )}

        {/* Question bank (hidden while an AI panel is open to keep focus) */}
        {aiMode === null && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Study the bank</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            {/* Search */}
            <div className="relative">
              <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, topics, keywords"
                className="glass w-full rounded-btn py-3.5 pl-11 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-accent"
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

            {/* Result count + practice-filtered shortcut */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">
                <span className="mono font-semibold text-fg">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'question' : 'questions'}
              </p>
              <div className="flex items-center gap-3">
                {filtered.length > 0 && (
                  <button
                    onClick={() => startQuick()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    <Icon name="sparkle" size={14} /> Practice these with AI
                  </button>
                )}
                {hasFilters && (
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                  >
                    <Icon name="x" size={14} /> Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            {filtered.length > 0 ? (
              <div className="mt-4 space-y-3">
                {filtered.map((q, i) => (
                  <QuestionCard key={q.id} question={q} num={i + 1} onPractice={() => startQuick(q)} />
                ))}
              </div>
            ) : (
              <div className="mt-4 grid place-items-center rounded-card border border-dashed border-line bg-card-2/40 py-20 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-card-2 text-fg-faint">
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
        )}
      </div>
    </>
  );
}

function ModeCard({
  icon,
  title,
  desc,
  cta,
  onClick,
  accent,
}: {
  icon: 'sparkle' | 'target';
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group glass flex flex-col items-start rounded-card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift ${
        accent ? 'ring-1 ring-accent/30' : ''
      }`}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl gradient-bg text-white shadow-glow-sm">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-fg">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-fg-muted">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        {cta}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function BackBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      onClick={onBack}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
    >
      <Icon name="arrow-right" size={16} className="rotate-180" />
      Back to {label}
    </button>
  );
}
