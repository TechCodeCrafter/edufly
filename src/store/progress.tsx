import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeStorage } from './storage';
import { tracks, allTopics, totalTopics } from '../data/tracks';
import { projects } from '../data/projects';
import { questions } from '../data/questions';

export type TopicStatus = 'todo' | 'in-progress' | 'done';

export const XP_PER_TOPIC = 100;
export const XP_PER_PROJECT = 250;
export const XP_PER_LEVEL = 500;

export interface PersistShape {
  topics: Record<string, TopicStatus>;
  projectSteps: Record<string, string[]>; // projectId -> completed step indices (as strings)
  mastered: string[]; // question ids
  lastTopicId?: string;
  recentTopics: string[]; // topic ids, most recent first (for the "Recently viewed" rail)
  streakDays: number;
  streakDates: string[]; // ISO date strings, most recent last
}

// How many topics to remember for the "Recently viewed" rail.
const RECENT_LIMIT = 6;

// v2: start everyone at a true zero state. No seeded/demo progress.
// (v1 pre-marked topics as done, which made the app look like the user had
// completed things they never touched.) Bumping the key gives old visitors a
// clean slate automatically.
const KEY = 'edufly.progress.v2';

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultState(): PersistShape {
  return {
    topics: {},
    projectSteps: {},
    mastered: [],
    lastTopicId: undefined,
    recentTopics: [],
    streakDays: 0,
    streakDates: [],
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
      recentTopics: parsed.recentTopics ?? [],
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
  tracksCompleted: number;
  tracksTotal: number;
}

interface Ctx extends PersistShape, Derived {
  topicStatus: (id: string) => TopicStatus;
  cycleTopic: (id: string) => void;
  setTopicDone: (id: string) => void;
  recordView: (id: string) => void;
  toggleProjectStep: (projectId: string, idx: number) => void;
  projectStepDone: (projectId: string, idx: number) => boolean;
  projectPct: (projectId: string) => number;
  isMastered: (qid: string) => boolean;
  toggleMastered: (qid: string) => void;
  trackPct: (trackId: string) => number;
  trackDone: (trackId: string) => number;
  // Required-topic-aware counts so the UI can speak honestly about what is
  // needed for the badge vs what is optional enrichment.
  trackRequiredDone: (trackId: string) => number;
  trackRequiredTotal: (trackId: string) => number;
  // Whole-roadmap track-completion progress, used for transparent unlocking.
  tracksCompleted: number;
  tracksTotal: number;
  isTrackComplete: (trackId: string) => boolean;
  reset: () => void;
  // Overwrites local state wholesale, used once by cloud sync to apply a
  // merged local+cloud snapshot right after Google sign in.
  hydrate: (next: PersistShape) => void;
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
    // Count the streak as the run of consecutive days ending today.
    const set = new Set(dates);
    let streak = 0;
    const cursor = new Date();
    while (set.has(isoDate(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return { ...s, streakDates: dates, streakDays: streak };
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

  // Remember that the learner opened a topic, without changing its status.
  // Powers the Resume banner and the Recently viewed rail. We do NOT count a
  // mere view toward the streak, so streaks stay tied to real completions.
  const recordView = useCallback((id: string) => {
    setState((s) => {
      const recent = [id, ...s.recentTopics.filter((x) => x !== id)].slice(0, RECENT_LIMIT);
      if (s.lastTopicId === id && s.recentTopics[0] === id) return s;
      return { ...s, lastTopicId: id, recentTopics: recent };
    });
  }, []);

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

  // Count only the required (non-optional) topics, so a track can be "complete"
  // for badge purposes even if a learner skips the optional deep-dives.
  const trackRequiredTotal = useCallback((trackId: string) => {
    const tk = tracks.find((t) => t.id === trackId);
    if (!tk) return 0;
    return tk.topics.filter((tp) => !tp.optional).length;
  }, []);

  const trackRequiredDone = useCallback(
    (trackId: string) => {
      const tk = tracks.find((t) => t.id === trackId);
      if (!tk) return 0;
      return tk.topics.filter((tp) => !tp.optional && state.topics[tp.id] === 'done').length;
    },
    [state.topics]
  );

  // A track counts as complete once every required topic is done.
  const isTrackComplete = useCallback(
    (trackId: string) => {
      const total = trackRequiredTotal(trackId);
      return total > 0 && trackRequiredDone(trackId) >= total;
    },
    [trackRequiredTotal, trackRequiredDone]
  );

  const reset = useCallback(() => {
    setState({
      topics: {},
      projectSteps: {},
      mastered: [],
      lastTopicId: undefined,
      recentTopics: [],
      streakDays: 0,
      streakDates: [],
    });
  }, []);

  const hydrate = useCallback((next: PersistShape) => {
    setState(next);
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
    // Track-level completion across the whole roadmap (required topics only).
    const tracksCompleted = tracks.filter((tk) => {
      const req = tk.topics.filter((tp) => !tp.optional);
      return req.length > 0 && req.every((tp) => state.topics[tp.id] === 'done');
    }).length;
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
      tracksCompleted,
      tracksTotal: tracks.length,
    };
  }, [state.topics, state.mastered, projectPct]);

  const value: Ctx = {
    ...state,
    ...derived,
    topicStatus,
    cycleTopic,
    setTopicDone,
    recordView,
    toggleProjectStep,
    projectStepDone,
    projectPct,
    isMastered,
    toggleMastered,
    trackPct,
    trackDone,
    trackRequiredDone,
    trackRequiredTotal,
    isTrackComplete,
    reset,
    hydrate,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
