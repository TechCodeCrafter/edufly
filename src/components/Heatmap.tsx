import { useMemo } from 'react';

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

interface Cell {
  iso: string;
  active: boolean;
  future: boolean;
  date: Date;
}

/**
 * GitHub-style contribution grid built entirely from real streakDates data
 * (no synthetic activity). Monday-anchored weeks, oldest week on the left.
 */
export function Heatmap({
  streakDates,
  weeks = 14,
  cellSize = 10,
  gap = 3,
  className = '',
}: {
  streakDates: string[];
  weeks?: number;
  cellSize?: number;
  gap?: number;
  className?: string;
}) {
  const set = useMemo(() => new Set(streakDates), [streakDates]);

  const columns = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = (today.getDay() + 6) % 7; // 0 = Monday
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - dow);
    const firstMonday = new Date(thisMonday);
    firstMonday.setDate(thisMonday.getDate() - (weeks - 1) * 7);

    const cols: Cell[][] = [];
    for (let w = 0; w < weeks; w++) {
      const col: Cell[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(firstMonday);
        day.setDate(firstMonday.getDate() + w * 7 + d);
        const iso = isoDate(day);
        col.push({ iso, active: set.has(iso), future: day > today, date: day });
      }
      cols.push(col);
    }
    return cols;
  }, [set, weeks]);

  return (
    <div
      className={`flex overflow-x-auto pb-0.5 ${className}`}
      style={{ gap }}
      role="img"
      aria-label={`Activity heatmap over the last ${weeks} weeks, ${streakDates.length} active days total`}
    >
      {columns.map((col, wi) => (
        <div key={wi} className="flex flex-col" style={{ gap }}>
          {col.map((cell) => (
            <span
              key={cell.iso}
              title={
                cell.future
                  ? undefined
                  : `${cell.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}${cell.active ? ' \u00b7 active' : ''}`
              }
              className={`block shrink-0 rounded-[3px] ${
                cell.future
                  ? 'opacity-0'
                  : cell.active
                    ? 'gradient-bg'
                    : 'border border-line bg-card-2'
              }`}
              style={{ width: cellSize, height: cellSize }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
