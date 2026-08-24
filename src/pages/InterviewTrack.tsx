import { Link, useNavigate, useParams } from 'react-router-dom';
import { categoryBySlug, categoryTrackId, questionCategories } from '../data/questions';
import { tracks } from '../data/tracks';
import { useProgress } from '../store/progress';
import { Ring, Button, Glass, Bar } from '../components/ui';
import { Icon } from '../components/Icon';
import { QuestionCard } from '../components/QuestionCard';
import { DarkHeader } from '../components/DarkHeader';
import { usePageMeta } from '../lib/meta';
import NotFound from './NotFound';

export default function InterviewTrack() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? categoryBySlug(slug) : undefined;
  const { isMastered } = useProgress();
  const navigate = useNavigate();

  usePageMeta({
    title: category
      ? `${category.questions.length} ${category.name} interview questions with answers | Edufly`
      : 'Interview questions | Edufly',
    description: category
      ? `${category.questions.length} real ${category.name} interview questions with model answers, free to study. Practice each one against an AI interviewer that grades your response.`
      : 'DevOps interview questions with model answers.',
    path: category ? `/interview/${category.slug}` : '/interview',
  });

  if (!category) return <NotFound />;

  const mastered = category.questions.filter((q) => isMastered(q.id)).length;
  const pct = Math.round((mastered / category.questions.length) * 100);
  const trackId = categoryTrackId[category.name];
  const track = trackId ? tracks.find((t) => t.id === trackId) : undefined;
  const firstTopic = track?.topics[0];
  const others = questionCategories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <DarkHeader>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Link
              to="/interview"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg"
            >
              <Icon name="arrow-right" size={15} className="rotate-180" />
              All interview questions
            </Link>
            <h1 className="mt-5 hero-title text-fg">
              {category.name} <span className="gradient-text">interview questions</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
              {category.questions.length} questions interviewers actually ask, each with a model answer you can study
              and an AI drill that grades how you would say it out loud.
            </p>
          </div>
          <Glass className="flex shrink-0 items-center gap-5 px-6 py-5">
            <Ring value={pct} size={72} stroke={6} labelClassName="text-fg" />
            <div>
              <p className="font-display text-2xl font-bold text-fg">
                {mastered}
                <span className="text-fg-faint">/{category.questions.length}</span>
              </p>
              <p className="mt-0.5 text-xs text-fg-muted">Mastered</p>
            </div>
          </Glass>
        </div>
      </DarkHeader>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-base font-bold text-fg">Questions and answers</h2>
          <span className="h-px flex-1 bg-line" />
          <span className="hidden w-20 sm:block">
            <Bar value={pct} height={4} />
          </span>
          <span className="mono shrink-0 text-xs text-fg-faint">
            {mastered}/{category.questions.length} mastered
          </span>
        </div>
        <div className="space-y-3">
          {category.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              num={i + 1}
              onPractice={() => navigate(`/interview?practice=${q.id}`)}
            />
          ))}
        </div>

        {(firstTopic || track) && (
          <Glass className="mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-base font-bold text-fg">Shaky on any of these?</p>
              <p className="mt-1 text-sm text-fg-muted">
                The {track?.name} track on the roadmap teaches every concept behind them, from the ground up.
              </p>
            </div>
            {firstTopic && (
              <Link to={`/topic/${firstTopic.id}`} className="shrink-0">
                <Button icon="compass">Learn {track?.name}</Button>
              </Link>
            )}
          </Glass>
        )}

        <div className="mt-10">
          <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-muted">More question sets</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                to={`/interview/${c.slug}`}
                className="rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
              >
                {c.name}
                <span className="ml-1.5 text-fg-faint">{c.questions.length}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
