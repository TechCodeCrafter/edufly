import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeStorage } from './storage';
import { tracks, allTopics, totalTopics } from '../data/tracks';
import { projects } from '../data/projects';
import { questions } from '../data/questions';

export type TopicStatus = 'todo' | 'in-progress' | 'done';

export const XP_PER_TOPIC = 100;
export const XP_PER_PROJECT = 250;
export const XP_PER_LEVEL = 500;

interface PersistShape {
  topics: Record<string, TopicStatus>;
  projectSteps: Record<string, string[]>; // projectId -> completed step indices (as strings)
  mastered: string[]; // question ids
  lastTopicId?: string;
  streakDays: number;
  streakDates: string[]; // ISO date strings, most recent last
}

const KEY = 'tekops.progress.v1';

// Seed a realistic demo state so the app feels alive on first load,
// matching the design mockups (level 2, 12-day streak, ~9 topics done).
const SEED_TOPICS: Record<string, TopicStatus> = {
  'linux-shell': 'done',
  'linux-perms': 'done',
  'linux-processes': 'done',
  'linux-users': 'done',
  'linux-systemd': 'in-progress',
  'script-bash': 'done',
  'script-vars': 'done',
  'script-python': 'done',
  'git-basics': 'done',
  'git-branching': 'done',
  'docker-what': 'done',
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function seedStreakDates(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(isoDate(d));
  }
  return out;
}

function defaultState(): PersistShape {
  return {
    topics: { ...SEED_TOPICS },
    projectSteps: {},
    mastered: [],
    lastTopicId: 'linux-systemd',
    streakDays: 12,
    streakDates: seedStreakDates(12),
  };
}

function load(): PersistShape {
  const raw = safeStorage.get(KEY);
  if (!raw) return defaultState();
  try {
    const parsed = JSON.parse(raw) as PersistShape;
    return {
      topics: parsed.topics ?? {},
      projectSteps: parsed.projectSteps ?? {},
      mastered: parsed.mastered ?? [],
      lastTopicId: parsed.lastTopicId,
      streakDays: parsed.streakDays ?? 0,
      streakDates: parsed.streakDates ?? [],
    };
  } catch {
    return defaultState();
  }
}

interface Derived {
  topicXP: number;
  projectXP: number;
  totalXP: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  topicsDone: number;
  topicsTotal: number;
  projectsDone: number;
  projectsTotal: number;
  masteredCount: number;
  questionsTotal: number;
  overallPct: number;
}

interface Ctx extends PersistShape, Derived {
  topicStatus: (id: string) => TopicStatus;
  cycleTopic: (id: string) => void;
  setTopicDone: (id: string) => void;
  toggleProjectStep: (projectId: string, idx: number) => void;
  projectStepDone: (projectId: string, idx: number) => boolean;
  projectPct: (projectId: string) => number;
  isMastered: (qid: string) => boolean;
  toggleMastered: (qid: string) => void;
  trackPct: (trackId: string) => number;
  trackDone: (trackId: string) => number;
  reset: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

const PROJECT_STEP_COUNT: Record<string, number> = Object.fromEntries(
  projects.map((p) => [p.id, p.steps.length])
);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistShape>(() => load());

  useEffect(() => {
    safeStorage.set(KEY, JSON.stringify(state));
  }, [state]);

  const recordActivity = useCallback((s: PersistShape): PersistShape => {
    const today = isoDate(new Date());
    if (s.streakDates.includes(today)) return s;
    const dates = [...s.streakDates, today];
    return { ...s, streakDates: dates, streakDays: Math.max(s.streakDays, dates.length) };
  }, []);

  const topicStatus = useCallback((id: string): TopicStatus => state.topics[id] ?? 'todo', [state.topics]);

  const cycleTopic = useCallback((id: string) => {
    setState((s) => {
      const cur = s.topics[id] ?? 'todo';
      const next: TopicStatus = cur === 'todo' ? 'in-progress' : cur === 'in-progress' ? 'done' : 'todo';
      return recordActivity({ ...s, topics: { ...s.topics, [id]: next }, lastTopicId: id });
    });
  }, [recordActivity]);

  const setTopicDone = useCallback((id: string) => {
    setState((s) => recordActivity({ ...s, topics: { ...s.topics, [id]: 'done' }, lastTopicId: id }));
  }, [recordActivity]);

  const toggleProjectStep = useCallback((projectId: string, idx: number) => {
    setState((s) => {
      const cur = new Set(s.projectSteps[projectId] ?? []);
      const key = String(idx);
      if (cur.has(key)) cur.delete(key);
      else cur.add(key);
      return recordActivity({ ...s, projectSteps: { ...s.projectSteps, [projectId]: [...cur] } });
    });
  }, [recordActivity]);

  const projectStepDone = useCallback(
    (projectId: string, idx: number) => (state.projectSteps[projectId] ?? []).includes(String(idx)),
    [state.projectSteps]
  );

  const projectPct = useCallback(
    (projectId: string) => {
      const total = PROJECT_STEP_COUNT[projectId] ?? 1;
      const done = (state.projectSteps[projectId] ?? []).length;
      return Math.round((done / total) * 100);
    },
    [state.projectSteps]
  );

  const isMastered = useCallback((qid: string) => state.mastered.includes(qid), [state.mastered]);

  const toggleMastered = useCallback((qid: string) => {
    setState((s) => {
      const set = new Set(s.mastered);
      if (set.has(qid)) set.delete(qid);
      else set.add(qid);
      return recordActivity({ ...s, mastered: [...set] });
    });
  }, [recordActivity]);

  const trackDone = useCallback(
    (trackId: string) => {
      const tk = tracks.find((t) => t.id === trackId);
      if (!tk) return 0;
      return tk.topics.filter((tp) => state.topics[tp.id] === 'done').length;
    },
    [state.topics]
  );

  const trackPct = useCallback(
    (trackId: string) => {
      const tk = tracks.find((t) => t.id === trackId);
      if (!tk || tk.topics.length === 0) return 0;
      return Math.round((trackDone(trackId) / tk.topics.length) * 100);
    },
    [trackDone]
  );

  const reset = useCallback(() => {
    setState({
      topics: {},
      projectSteps: {},
      mastered: [],
      lastTopicId: undefined,
      streakDays: 0,
      streakDates: [],
    });
  }, []);

  const derived = useMemo<Derived>(() => {
    const topicsDone = allTopics.filter((tp) => state.topics[tp.id] === 'done').length;
    const projectsDone = projects.filter((p) => projectPct(p.id) === 100).length;
    const topicXP = topicsDone * XP_PER_TOPIC;
    const projectXP = projectsDone * XP_PER_PROJECT;
    const totalXP = topicXP + projectXP;
    const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
    const xpIntoLevel = totalXP % XP_PER_LEVEL;
    const masteredCount = state.mastered.length;
    const overallPct = Math.round((topicsDone / totalTopics) * 100);
    return {
      topicXP,
      projectXP,
      totalXP,
      level,
      xpIntoLevel,
      xpForNextLevel: XP_PER_LEVEL,
      topicsDone,
      topicsTotal: totalTopics,
      projectsDone,
      projectsTotal: projects.length,
      masteredCount,
      questionsTotal: questions.length,
      overallPct,
    };
  }, [state.topics, state.mastered, projectPct]);

  const value: Ctx = {
    ...state,
    ...derived,
    topicStatus,
    cycleTopic,
    setTopicDone,
    toggleProjectStep,
    projectStepDone,
    projectPct,
    isMastered,
    toggleMastered,
    trackPct,
    trackDone,
    reset,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
