import { useState } from 'react';
import { Button } from '../ui';
import { Icon } from '../Icon';
import { ScoreMeter } from './ScoreMeter';
import { gradeAnswer, type GradeResult } from '../../lib/ai';
import { logAttempt } from '../../lib/attempts';
import { useAuth } from '../../store/auth';
import type { Question } from '../../data/types';
import { diffColor, diffLabel } from '../ui';

type Phase = 'answering' | 'grading' | 'graded' | 'error';

// Quick Practice: one question, type an answer, get an AI score and feedback.
// Works standalone (modal) and inline. Falls back to the heuristic grader
// on the server when no AI key is configured.
export function QuickPractice({
  question,
  onMastered,
  onClose,
}: {
  question: Question;
  onMastered?: () => void;
  onClose?: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<Phase>('answering');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const submit = async () => {
    if (!answer.trim()) return;
    setPhase('grading');
    setError('');
    try {
      const r = await gradeAnswer({
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
        modelAnswer: question.answer,
        userAnswer: answer,
      });
      setResult(r);
      setPhase('graded');
      if (user) {
        void logAttempt({
          userId: user.id,
          source: 'quick_practice',
          question: question.question,
          category: question.category,
          difficulty: question.difficulty,
          score: r.score,
          covered: r.strengths,
          missing: r.gaps,
          provider: r.provider,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setPhase('error');
    }
  };

  const retry = () => {
    setPhase('answering');
    setResult(null);
    setShowModel(false);
  };

  return (
    <div className="glass rounded-card">
      {/* Question header */}
      <div className="flex items-start justify-between gap-3 border-b border-line p-5 sm:p-6">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <span className="mono text-[10px] uppercase tracking-eyebrow text-fg-muted">{question.category}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted">
              <span className={`h-1.5 w-1.5 rounded-full bg-${diffColor[question.difficulty]}`} />
              {diffLabel[question.difficulty]}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug text-fg">{question.question}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close practice"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-fg-faint transition-colors hover:bg-card-2 hover:text-fg"
          >
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {/* Answer input */}
        {(phase === 'answering' || phase === 'grading') && (
          <>
            <label htmlFor="qp-answer" className="mono mb-2 block text-[10px] uppercase tracking-eyebrow text-accent">
              Your answer
            </label>
            <textarea
              id="qp-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={phase === 'grading'}
              placeholder="Answer out loud first, then type the version you would say in the room. The AI scores it and shows you what to tighten."
              rows={6}
              className="w-full resize-y rounded-btn border border-line bg-page p-4 text-sm leading-relaxed text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-accent disabled:opacity-60"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-fg-faint">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
              <Button
                onClick={submit}
                disabled={!answer.trim() || phase === 'grading'}
                icon={phase === 'grading' ? undefined : 'sparkle'}
              >
                {phase === 'grading' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spin inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
                    Scoring
                  </span>
                ) : (
                  'Score with AI'
                )}
              </Button>
            </div>
          </>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="rounded-btn border border-optional/30 bg-optional/10 p-4">
            <p className="text-sm font-medium text-fg">{error}</p>
            <Button variant="light" size="sm" className="mt-3" icon="arrow-right" onClick={() => setPhase('answering')}>
              Try again
            </Button>
          </div>
        )}

        {/* Graded result */}
        {phase === 'graded' && result && (
          <div className="fade-up space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ScoreMeter score={result.score} />
              <FallbackNote provider={result.provider} />
            </div>

            <p className="text-sm leading-relaxed text-fg">{result.verdict}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeedbackList title="What worked" icon="check" tone="done" items={result.strengths} />
              <FeedbackList title="What to sharpen" icon="target" tone="optional" items={result.gaps} />
            </div>

            {result.improved && (
              <div className="rounded-btn border border-line bg-page p-4">
                <button
                  onClick={() => setShowModel((s) => !s)}
                  className="flex w-full items-center justify-between text-left"
                  aria-expanded={showModel}
                >
                  <span className="mono text-[10px] uppercase tracking-eyebrow text-accent">A tighter answer to say</span>
                  <Icon name="chevron-down" size={16} className={`text-fg-faint transition-transform ${showModel ? 'rotate-180' : ''}`} />
                </button>
                <div className={`collapsible ${showModel ? 'open' : ''}`}>
                  <div className="collapsible-inner">
                    <p className="pt-3 text-sm leading-relaxed text-fg-muted">{result.improved}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <Button variant="light" icon="arrow-right" onClick={retry}>
                Answer again
              </Button>
              {onMastered && (
                <Button variant="ghost" icon="bookmark" onClick={onMastered}>
                  Mark mastered
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackList({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: 'check' | 'target';
  tone: 'done' | 'optional';
  items: string[];
}) {
  return (
    <div className="rounded-btn border border-line bg-page p-4">
      <p className={`mb-2.5 flex items-center gap-2 text-xs font-semibold ${tone === 'done' ? 'text-done' : 'text-optional'}`}>
        <Icon name={icon} size={15} strokeWidth={2.5} />
        {title}
      </p>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-fg-muted">
              <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${tone === 'done' ? 'bg-done' : 'bg-optional'}`} />
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-fg-faint">Nothing flagged here.</p>
      )}
    </div>
  );
}

// Honest, low-key note when the offline heuristic grader is in use.
export function FallbackNote({ provider }: { provider: string }) {
  if (provider !== 'fallback') return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-page px-2.5 py-1 text-[11px] text-fg-faint">
      <Icon name="activity" size={12} />
      Offline scoring
    </span>
  );
}
