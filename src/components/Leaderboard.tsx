import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, cloudEnabled } from '../lib/supabaseClient';
import { Icon } from './Icon';
import { EyebrowPill } from './ui';

export interface LeaderboardRow {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  streak_days: number;
  mastered_count: number;
  topics_done: number;
  updated_at: string;
}

export function useLeaderboard(limit: number, orderBy: 'streak_days' | 'mastered_count' | 'topics_done' = 'topics_done') {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase || !cloudEnabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      // Only accounts with real progress make the board. Zero-progress rows
      // add noise and make the page read as abandoned, so they stay off.
      let query = supabase
        .from('leaderboard_entries')
        .select('*')
        .gt('topics_done', 0)
        .order(orderBy, { ascending: false });
      if (orderBy !== 'topics_done') query = query.order('topics_done', { ascending: false });
      if (orderBy !== 'streak_days') query = query.order('streak_days', { ascending: false });
      const { data, error: err } = await query.limit(limit);
      if (cancelled) return;
      if (err) {
        setError(true);
      } else {
        setRows((data as LeaderboardRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, orderBy]);

  return { rows, loading, error };
}

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function LeaderboardRowItem({ row, rank }: { row: LeaderboardRow; rank: number }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-card border border-line bg-card px-4 py-3.5 ${
        rank <= 3 ? 'shadow-card' : ''
      }`}
    >
      <span
        className={`mono grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
          rank === 1
            ? 'gradient-bg text-white'
            : rank <= 3
              ? 'border border-line bg-card-2 text-fg'
              : 'text-fg-faint'
        }`}
      >
        {rank}
      </span>
      {row.avatar_url ? (
        <img src={row.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full border border-line object-cover" />
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-bg text-sm font-bold text-white">
          {initials(row.display_name)}
        </span>
      )}
      <span className="flex-1 truncate font-display text-sm font-semibold text-fg">{row.display_name}</span>
      <span className="hidden items-center gap-1.5 text-xs text-fg-faint sm:inline-flex">
        <Icon name="flame" size={14} className="text-streak" />
        {row.streak_days}
      </span>
      <span className="hidden items-center gap-1.5 text-xs text-fg-faint sm:inline-flex">
        <Icon name="trophy" size={14} className="text-accent" />
        {row.mastered_count}
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg">
        <Icon name="check" size={14} className="text-done" />
        {row.topics_done}
      </span>
    </div>
  );
}

// Homepage teaser: top 5 by topics completed, public, works logged out.
// Renders nothing if cloud sync is disabled or there are fewer than three
// learners with real progress, so the homepage never shows a sparse section.
export function LeaderboardPreview() {
  const { rows, loading, error } = useLeaderboard(5, 'topics_done');
  if (!cloudEnabled || error) return null;
  if (!loading && rows.length < 3) return null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <EyebrowPill dot className="mb-3">Live</EyebrowPill>
          <h2 className="section-title text-fg">Top learners</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
            The learners furthest along the roadmap, ranked by topics completed.
          </p>
        </div>
        <Link to="/leaderboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:opacity-80">
          Full leaderboard
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[60px] animate-pulse rounded-card border border-line bg-card-2" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.map((row, i) => (
            <LeaderboardRowItem key={row.user_id} row={row} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
