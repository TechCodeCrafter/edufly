import { useState } from 'react';
import { useLeaderboard, LeaderboardRowItem } from '../components/Leaderboard';
import { cloudEnabled } from '../lib/supabaseClient';
import { EyebrowPill, Chip } from '../components/ui';
import { Icon } from '../components/Icon';
import { usePageMeta } from '../lib/meta';

type SortKey = 'streak_days' | 'mastered_count' | 'topics_done';

const sorts: { key: SortKey; label: string; icon: 'flame' | 'trophy' | 'check' }[] = [
  { key: 'topics_done', label: 'Topics done', icon: 'check' },
  { key: 'mastered_count', label: 'Mastered', icon: 'trophy' },
  { key: 'streak_days', label: 'Streak', icon: 'flame' },
];

// The board stays gated until enough learners have real progress that the
// top of the table looks like a leaderboard, not an empty room.
const MIN_ENTRIES = 5;

export default function Leaderboard() {
  usePageMeta({
    title: 'Leaderboard | Edufly',
    description:
      'Learners ranked by real progress across the DevOps roadmap. Sign in with Google to claim your spot.',
    path: '/leaderboard',
  });
  const [sort, setSort] = useState<SortKey>('topics_done');
  const { rows, loading, error } = useLeaderboard(50, sort);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <EyebrowPill dot className="mb-3">Public</EyebrowPill>
      <h1 className="hero-title text-fg">
        The <span className="gradient-text">leaderboard</span>.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
        Learners ranked by progress through the roadmap. Finish a topic while signed in and you{'\u2019'}re on the board.
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
        ) : rows.length < MIN_ENTRIES ? (
          <div className="glass rounded-card p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-bg text-white shadow-glow-sm">
              <Icon name="trophy" size={22} />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-fg">The board is warming up</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-fg-muted">
              Rankings go live once {MIN_ENTRIES} learners have completed topics. Sign in, finish your first topic, and claim an early spot.
            </p>
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
