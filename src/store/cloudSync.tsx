import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './auth';
import { useProgress, type PersistShape, type TopicStatus } from './progress';
import { useSyncStatus } from './sync';
import { useWelcome } from './welcome';

// Shape of the row in the `user_progress` table (snake_case columns).
interface ProgressRow {
  user_id: string;
  topics: Record<string, TopicStatus>;
  project_steps: Record<string, string[]>;
  mastered: string[];
  recent_topics: string[];
  streak_days: number;
  streak_dates: string[];
  last_topic_id: string | null;
}

function toRow(userId: string, s: PersistShape): ProgressRow {
  return {
    user_id: userId,
    topics: s.topics,
    project_steps: s.projectSteps,
    mastered: s.mastered,
    recent_topics: s.recentTopics,
    streak_days: s.streakDays,
    streak_dates: s.streakDates,
    last_topic_id: s.lastTopicId ?? null,
  };
}

function fromRow(r: ProgressRow): PersistShape {
  return {
    topics: r.topics ?? {},
    projectSteps: r.project_steps ?? {},
    mastered: r.mastered ?? [],
    recentTopics: r.recent_topics ?? [],
    streakDays: r.streak_days ?? 0,
    streakDates: r.streak_dates ?? [],
    lastTopicId: r.last_topic_id ?? undefined,
  };
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Consecutive-days-ending-today streak, same rule progress.tsx uses.
function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  while (set.has(isoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const statusRank: Record<TopicStatus, number> = { todo: 0, 'in-progress': 1, done: 2 };

// Combine a device's local progress with whatever is already saved to the
// cloud. Never lose work either side: a topic marked done anywhere stays
// done, project steps union, streak recomputes from the union of days.
function mergeProgress(local: PersistShape, cloud: PersistShape): PersistShape {
  const topics: Record<string, TopicStatus> = { ...local.topics };
  for (const [id, status] of Object.entries(cloud.topics)) {
    if (!topics[id] || statusRank[status] > statusRank[topics[id]]) topics[id] = status;
  }

  const projectSteps: Record<string, string[]> = {};
  const allProjectIds = new Set([...Object.keys(local.projectSteps), ...Object.keys(cloud.projectSteps)]);
  for (const pid of allProjectIds) {
    const set = new Set([...(local.projectSteps[pid] ?? []), ...(cloud.projectSteps[pid] ?? [])]);
    projectSteps[pid] = [...set];
  }

  const mastered = [...new Set([...local.mastered, ...cloud.mastered])];
  const streakDates = [...new Set([...local.streakDates, ...cloud.streakDates])].sort();
  const recentTopics = [...local.recentTopics, ...cloud.recentTopics.filter((id) => !local.recentTopics.includes(id))].slice(0, 6);
  const lastTopicId = local.lastTopicId ?? cloud.lastTopicId;

  return {
    topics,
    projectSteps,
    mastered,
    recentTopics,
    streakDays: computeStreak(streakDates),
    streakDates,
    lastTopicId,
  };
}

function isEmptyProgress(s: PersistShape): boolean {
  return (
    Object.keys(s.topics).length === 0 &&
    Object.keys(s.projectSteps).length === 0 &&
    s.mastered.length === 0 &&
    s.streakDates.length === 0
  );
}

/**
 * Invisible bridge between auth and progress. On sign in, merges this
 * device's local progress with whatever is saved under the account (so
 * neither side loses data), then keeps pushing local changes to the cloud
 * for as long as the learner stays signed in. Renders nothing.
 */
export function CloudSync() {
  const { user, cloudEnabled, justSignedIn, clearJustSignedIn } = useAuth();
  const progress = useProgress();
  const { setStatus } = useSyncStatus();
  const welcome = useWelcome();
  const mergedForUser = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPush = useRef(false);
  const wasSignedIn = useRef(false);

  const local: PersistShape = {
    topics: progress.topics,
    projectSteps: progress.projectSteps,
    mastered: progress.mastered,
    recentTopics: progress.recentTopics,
    streakDays: progress.streakDays,
    streakDates: progress.streakDates,
    lastTopicId: progress.lastTopicId,
  };

  // One-time merge whenever a new user session appears.
  useEffect(() => {
    if (!supabase || !cloudEnabled || !user) return;
    if (mergedForUser.current === user.id) return;
    mergedForUser.current = user.id;

    let cancelled = false;
    (async () => {
      setStatus('syncing');
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setStatus('error');
        return;
      }

      const cloud = data ? fromRow(data as ProgressRow) : null;
      const hadCloudProgress = Boolean(cloud && !isEmptyProgress(cloud));
      const merged = hadCloudProgress ? mergeProgress(local, cloud as PersistShape) : local;

      skipNextPush.current = true;
      progress.hydrate(merged);

      await supabase.from('user_progress').upsert(toRow(user.id, merged), { onConflict: 'user_id' });
      if (cancelled) return;
      setStatus('synced');

      // Only greet the learner right after a real sign-in action, not on
      // every page load where a session simply gets restored.
      if (justSignedIn) {
        const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'there';
        welcome.show({
          name,
          avatar: user.user_metadata?.avatar_url as string | undefined,
          topicsDone: Object.values(merged.topics).filter((s) => s === 'done').length,
          masteredCount: merged.mastered.length,
          streakDays: merged.streakDays,
          hadCloudProgress,
        });
        clearJustSignedIn();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cloudEnabled]);

  // Reset the merge guard on sign out so a later sign-in (possibly a
  // different account) merges again instead of being skipped. Also clear
  // this device's local progress: it has already been backed up to the
  // account that just signed out, so leaving it visible on this device
  // would let the next person to use this browser see the previous
  // learner's topics, mastered questions, and streak.
  useEffect(() => {
    if (user) {
      wasSignedIn.current = true;
      return;
    }
    mergedForUser.current = null;
    if (wasSignedIn.current) {
      wasSignedIn.current = false;
      progress.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Debounced push of every subsequent local change while signed in.
  useEffect(() => {
    const client = supabase;
    if (!client || !cloudEnabled || !user) return;
    if (mergedForUser.current !== user.id) return; // wait for initial merge
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }

    setStatus('syncing');
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      const { error } = await client
        .from('user_progress')
        .upsert(toRow(user.id, local), { onConflict: 'user_id' });
      setStatus(error ? 'error' : 'synced');
    }, 1200);

    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    cloudEnabled,
    progress.topics,
    progress.projectSteps,
    progress.mastered,
    progress.recentTopics,
    progress.streakDays,
    progress.streakDates,
    progress.lastTopicId,
  ]);

  return null;
}
