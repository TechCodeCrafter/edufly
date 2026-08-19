import { Link } from 'react-router-dom';
import { tracks, allTopics } from '../data/tracks';
import { useProgress } from '../store/progress';
import { Ring, Bar, Button, EyebrowPill, Glass } from '../components/ui';
import { Icon } from '../components/Icon';
import { StatCard, WeekStrip } from '../components/cards';
import { DarkHeader } from '../components/DarkHeader';
import type { IconName } from '../components/Icon';

interface Achievement {
  id: string;
  icon: IconName;
  title: string;
  desc: string;
  earned: (p: ReturnType<typeof useProgress>) => boolean;
}

const achievements: Achievement[] = [
  { id: 'first-step', icon: 'play', title: 'First Steps', desc: 'Complete your first topic', earned: (p) => p.topicsDone >= 1 },
  { id: 'streak-7', icon: 'flame', title: 'Week Warrior', desc: 'Keep a 7-day streak', earned: (p) => p.streakDays >= 7 },
  { id: 'ten-topics', icon: 'book', title: 'Bookworm', desc: 'Finish 10 topics', earned: (p) => p.topicsDone >= 10 },
  { id: 'level-2', icon: 'trending-up', title: 'Level Up', desc: 'Reach level 2', earned: (p) => p.level >= 2 },
  { id: 'first-project', icon: 'box', title: 'Builder', desc: 'Ship your first project', earned: (p) => p.projectsDone >= 1 },
  { id: 'master-5', icon: 'target', title: 'Sharp Mind', desc: 'Master 5 questions', earned: (p) => p.masteredCount >= 5 },
  { id: 'half-track', icon: 'gauge', title: 'Halfway There', desc: 'Finish any track 50%', earned: (p) => tracks.some((t) => p.trackPct(t.id) >= 50) },
  { id: 'full-track', icon: 'trophy', title: 'Track Master', desc: 'Complete a full track', earned: (p) => tracks.some((t) => !t.locked && p.trackPct(t.id) === 100) },
];

export default function Dashboard() {
  const p = useProgress();
  const {
    level,
    totalXP,
    xpIntoLevel,
    xpForNextLevel,
    topicsDone,
    topicsTotal,
    projectsDone,
    projectsTotal,
    masteredCount,
    questionsTotal,
    streakDays,
    streakDates,
    overallPct,
    trackPct,
    trackDone,
  } = p;

  // Up-next: first not-done topic across the roadmap (skip locked tracks)
  const upNext = allTopics
    .filter((t) => {
      const tk = tracks.find((x) => x.id === t.trackId);
      return !tk?.locked && p.topicStatus(t.id) !== 'done';
    })
    .slice(0, 4);

  const xpPct = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return (
    <>
      <DarkHeader>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <Ring value={overallPct} size={104} stroke={8} labelClassName="text-fg" />
            <div>
              <EyebrowPill dot>Your progress</EyebrowPill>
              <h1 className="mt-3 hero-title text-fg">
                Level {level} engineer
              </h1>
              <p className="mt-2 text-base text-fg-muted">
                {topicsDone} of {topicsTotal} topics done {'\u00b7'} {overallPct}% of the roadmap
              </p>
            </div>
          </div>
          <Glass className="w-full max-w-sm p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <Icon name="zap" size={16} className="text-accent" /> Level {level}
              </span>
              <span className="mono text-fg-muted">{xpIntoLevel} / {xpForNextLevel} XP</span>
            </div>
            <div className="mt-3">
              <Bar value={xpPct} height={8} />
            </div>
            <p className="mt-2.5 text-xs text-fg-faint">
              {xpForNextLevel - xpIntoLevel} XP to level {level + 1} {'\u00b7'} {totalXP.toLocaleString()} XP total
            </p>
          </Glass>
        </div>
      </DarkHeader>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="book" value={topicsDone} label="Topics completed" meta={`of ${topicsTotal}`} metaColor="text-fg-faint" />
          <StatCard icon="box" value={projectsDone} label="Projects shipped" meta={`of ${projectsTotal}`} metaColor="text-fg-faint" />
          <StatCard icon="target" value={masteredCount} label="Questions mastered" meta={`of ${questionsTotal}`} metaColor="text-fg-faint" />
          <StatCard icon="flame" value={streakDays} label="Day streak" meta="days" metaColor="text-streak" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Track progress list */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold tracking-tight2 text-fg">Track progress</h2>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:opacity-80">
                View roadmap <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {tracks.map((t) => {
                const pct = t.locked ? 0 : trackPct(t.id);
                const done = t.locked ? 0 : trackDone(t.id);
                return (
                  <div
                    key={t.id}
                    className="glass flex items-center gap-4 rounded-card p-4"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        t.locked ? 'border border-line bg-card-2 text-locked' : 'gradient-bg text-white'
                      }`}
                    >
                      <Icon name={(t.locked ? 'lock' : t.icon) as any} size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-fg">{t.name}</span>
                        <span className="mono shrink-0 text-xs text-fg-faint">
                          {t.locked ? 'Locked' : `${done}/${t.topics.length}`}
                        </span>
                      </div>
                      <Bar value={pct} height={6} />
                    </div>
                    <span className="mono w-10 shrink-0 text-right text-sm font-semibold text-fg">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="space-y-8">
            {/* Streak strip */}
            <section className="glass rounded-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-fg">This week</h2>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-streak">
                  <Icon name="flame" size={16} /> {streakDays} days
                </span>
              </div>
              <WeekStrip streakDates={streakDates} />
            </section>

            {/* Up next */}
            <section>
              <h2 className="mb-4 font-display text-base font-bold text-fg">Up next</h2>
              {upNext.length > 0 ? (
                <div className="space-y-2.5">
                  {upNext.map((t) => (
                    <Link
                      key={t.id}
                      to={`/topic/${t.id}`}
                      className="group glass flex items-center gap-3 rounded-card p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-card-2 text-accent">
                        <Icon name="play" size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-fg">{t.name}</p>
                        <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">
                          {t.trackName} · {t.minutes}m
                        </p>
                      </div>
                      <Icon name="arrow-right" size={16} className="text-fg-faint transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-card p-6 text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl gradient-bg text-white">
                    <Icon name="trophy" size={20} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-fg">Roadmap complete</p>
                  <p className="mt-1 text-xs text-fg-muted">You finished every available topic. Outstanding.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Achievements */}
        <section className="mt-12">
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight2 text-fg">Achievements</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a) => {
              const earned = a.earned(p);
              return (
                <div
                  key={a.id}
                  className={`rounded-card p-5 text-center transition-all ${
                    earned ? 'glass' : 'border border-dashed border-line bg-card-2/30'
                  }`}
                >
                  <span
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${
                      earned ? 'gradient-bg text-white shadow-glow-sm' : 'border border-line bg-card-2 text-fg-faint'
                    }`}
                  >
                    <Icon name={a.icon} size={22} />
                  </span>
                  <h3 className={`mt-3 font-display text-sm font-bold ${earned ? 'text-fg' : 'text-fg-faint'}`}>
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-fg-muted">{a.desc}</p>
                  {earned && (
                    <span className="mono mt-2.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-eyebrow text-done">
                      <Icon name="check" size={11} strokeWidth={3} /> Earned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Reset */}
        <div className="mt-12 glass flex flex-col items-start justify-between gap-4 rounded-card p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-base font-semibold text-fg">Start fresh?</h3>
            <p className="mt-1 text-sm text-fg-muted">Reset all progress, streaks and mastered questions. This cannot be undone.</p>
          </div>
          <Button
            variant="light"
            icon="x"
            className="w-full sm:w-auto"
            onClick={() => {
              if (confirm('Reset all your progress? This cannot be undone.')) p.reset();
            }}
          >
            Reset progress
          </Button>
        </div>
      </div>
    </>
  );
}
