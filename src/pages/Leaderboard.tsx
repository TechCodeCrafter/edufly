import { useState } from 'react';
import { useLeaderboard, LeaderboardRowItem } from '../components/Leaderboard';
import { cloudEnabled } from '../lib/supabaseClient';
import { EyebrowPill, Chip } from '../components/ui';
import { Icon } from '../components/Icon';

type SortKey = 'streak_days' | 'mastered_count' | 'topics_done';

const sorts: { key: SortKey; label: string; icon: 'flame' | 'trophy' | 'check' }[] = [
  { key: 'streak_days', label: 'Streak', icon: 'flame' },
  { key: 'mastered_count', label: 'Mastered', icon: 'trophy' },
  { key: 'topics_done', label: 'Topics done', icon: 'check' },
];

export default function Leaderboard() {
  const [sort, setSort] = useState<SortKey>('streak_days');
  const { rows, loading, error } = useLeaderboard(50, sort);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <EyebrowPill dot className="mb-3">Public</EyebrowPill>
      <h1 className="hero-title text-fg">
        The <span className="gradient-text">leaderboard</span>.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
        Every entry here is a real signed-in account, ranked by real progress. No points are fabricated.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {sorts.map((s) => (
          <Chip key={s.key} active={sort === s.key} onClick={() => setSort(s.key)}>
            <span className="inline-flex items-center gap-1.5">
              <Icon name={s.icon} size={14} />
              {s.label}
            </span>
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {!cloudEnabled ? (
          <div className="glass rounded-card p-8 text-center">
            <p className="text-sm text-fg-muted">Cloud sync is not configured, so the leaderboard is unavailable right now.</p>
          </div>
        ) : error ? (
          <div className="glass rounded-card p-8 text-center">
            <p className="text-sm text-fg-muted">Could not load the leaderboard. Try refreshing the page.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[60px] animate-pulse rounded-card border border-line bg-card-2" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="glass rounded-card p-8 text-center">
            <p className="text-sm text-fg-muted">No entries yet. Sign in and complete a topic to claim the first spot.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rows.map((row, i) => (
              <LeaderboardRowItem key={row.user_id} row={row} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
