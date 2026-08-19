import { Ring } from '../ui';

// Color the score by band. Uses semantic tokens already in the palette.
function band(score: number): { label: string; text: string; bg: string } {
  if (score >= 80) return { label: 'Strong', text: 'text-done', bg: 'bg-done/10' };
  if (score >= 60) return { label: 'Solid', text: 'text-accent', bg: 'bg-accent/10' };
  if (score >= 40) return { label: 'Developing', text: 'text-optional', bg: 'bg-optional/10' };
  return { label: 'Needs work', text: 'text-progress', bg: 'bg-progress/10' };
}

export function ScoreMeter({ score, size = 84 }: { score: number; size?: number }) {
  const b = band(score);
  return (
    <div className="flex items-center gap-4">
      <Ring value={score} size={size} stroke={7} />
      <div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${b.text} ${b.bg}`}>
          {b.label}
        </span>
        <p className="mt-1.5 text-xs text-fg-faint">out of 100</p>
      </div>
    </div>
  );
}
