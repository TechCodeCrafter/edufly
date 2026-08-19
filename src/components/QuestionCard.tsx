import { useState } from 'react';
import { Icon } from './Icon';
import { useProgress } from '../store/progress';
import type { Question } from '../data/types';
import { diffColor, diffLabel } from './ui';

export function QuestionCard({
  question,
  num,
  onPractice,
}: {
  question: Question;
  num: number;
  onPractice?: () => void;
}) {
  const { isMastered, toggleMastered } = useProgress();
  const [open, setOpen] = useState(false);
  const mastered = isMastered(question.id);

  return (
    <div
      className={`glass rounded-card transition-colors ${
        mastered ? 'ring-1 ring-done/40' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-start gap-4 text-left"
          aria-expanded={open}
        >
          <span className="mono mt-0.5 hidden text-xs text-fg-faint sm:block">
            {String(num).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <span className="mono text-[10px] uppercase tracking-eyebrow text-fg-muted">
                {question.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted">
                <span className={`h-1.5 w-1.5 rounded-full bg-${diffColor[question.difficulty]}`} />
                {diffLabel[question.difficulty]}
              </span>
            </div>
            <p className="text-[15px] font-semibold leading-snug text-fg">{question.question}</p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => toggleMastered(question.id)}
            aria-label={mastered ? 'Unmark as mastered' : 'Mark as mastered'}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
              mastered ? 'gradient-bg text-white shadow-glow-sm' : 'text-fg-faint hover:bg-card-2 hover:text-fg'
            }`}
          >
            <Icon name={mastered ? 'check' : 'bookmark'} size={16} strokeWidth={mastered ? 3 : 2} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Collapse answer' : 'Expand answer'}
            className="grid h-8 w-8 place-items-center rounded-lg text-fg-faint transition-colors hover:bg-card-2 hover:text-fg"
          >
            <Icon name="chevron-down" size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className={`collapsible ${open ? 'open' : ''}`}>
        <div className="collapsible-inner">
          <div className="border-t border-line px-4 pb-5 pt-4 sm:px-5 sm:pl-14">
            <p className="mono mb-2 text-[10px] uppercase tracking-eyebrow text-accent">Model answer</p>
            <p className="text-sm leading-relaxed text-fg-muted">{question.answer}</p>
            {onPractice && (
              <button
                onClick={onPractice}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                <Icon name="sparkle" size={13} />
                Test yourself with AI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
