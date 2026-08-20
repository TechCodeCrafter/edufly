// Records every graded interview answer to Supabase so the learner (and the
// product) can see which topics are actually weak, based on real scores
// instead of guesswork. Silently no-ops when the learner is not signed in or
// cloud sync is not configured, since this is a bonus signal, not a gate.

import { supabase, cloudEnabled } from './supabaseClient';

export type AttemptSource = 'quick_practice' | 'mock_interview';

export interface AttemptInput {
  userId: string;
  source: AttemptSource;
  question: string;
  category: string;
  difficulty: string;
  score: number;
  covered?: string[];
  missing?: string[];
  provider?: string;
}

export async function logAttempt(input: AttemptInput): Promise<void> {
  if (!supabase || !cloudEnabled) return;
  try {
    await supabase.from('interview_attempts').insert({
      user_id: input.userId,
      source: input.source,
      question: input.question,
      category: input.category,
      difficulty: input.difficulty,
      score: Math.max(0, Math.min(100, Math.round(input.score))),
      covered: input.covered ?? [],
      missing: input.missing ?? [],
      provider: input.provider ?? null,
    });
  } catch {
    // Best-effort telemetry. Never let a logging failure interrupt practice.
  }
}

export interface TopicPerformance {
  category: string;
  avgScore: number;
  attempts: number;
}

// Aggregates every logged attempt by category and returns the weakest topics
// first, so the learner sees exactly where real practice data says they are
// thin, rather than a generic study checklist.
export async function fetchWeakTopics(userId: string, minAttempts = 1): Promise<TopicPerformance[]> {
  if (!supabase || !cloudEnabled) return [];
  const { data, error } = await supabase
    .from('interview_attempts')
    .select('category, score')
    .eq('user_id', userId)
    .limit(500);

  if (error || !data) return [];

  const byCategory = new Map<string, { total: number; count: number }>();
  for (const row of data as { category: string | null; score: number }[]) {
    const cat = (row.category || 'General').trim();
    if (!cat) continue;
    const entry = byCategory.get(cat) ?? { total: 0, count: 0 };
    entry.total += row.score;
    entry.count += 1;
    byCategory.set(cat, entry);
  }

  return [...byCategory.entries()]
    .map(([category, { total, count }]) => ({ category, avgScore: Math.round(total / count), attempts: count }))
    .filter((t) => t.attempts >= minAttempts)
    .sort((a, b) => a.avgScore - b.avgScore);
}
