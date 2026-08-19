import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tracks, PHASES, tracksByPhase } from '../data/tracks';
import { allTopics } from '../data/tracks';
import { projects } from '../data/projects';
import { questions } from '../data/questions';
import { useProgress } from '../store/progress';
import { Button, Ring, Bar, Glass, EyebrowPill } from '../components/ui';
import { Icon } from '../components/Icon';
import { ModuleCard, type RecKind } from '../components/cards';

type ViewMode = 'grid' | 'spine' | 'path';
type RoadMode = 'guided' | 'browse';

// The first track the learner should tackle, surfaced with a recommendation pill.
const REC_BY_TRACK: Record<string, RecKind> = { linux: 'start' };

export default function Roadmap() {
  const [view, setView] = useState<ViewMode>('grid');
  const [mode, setMode] = useState<RoadMode>('guided');
  const { totalXP, streakDays, trackPct, lastTopicId, recentTopics, topicStatus, overallPct } = useProgress();

  // Only resume from a topic the user has actually opened. No fake fallback.
  const resumeTopic = lastTopicId ? allTopics.find((t) => t.id === lastTopicId) : undefined;
  const started = totalXP > 0 || !!lastTopicId || streakDays > 0;

  // Recently viewed rail: skip the one already shown in the Resume banner so we
  // never repeat it. Resolve ids to full topic records.
  const recentViewed = recentTopics
    .filter((id) => id !== resumeTopic?.id)
    .map((id) => allTopics.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .slice(0, 4);

  // Top 3 tracks with progress for the floating "your path" card. Nothing is
  // gated anymore, so every track is eligible to show momentum.
  const pathTracks = tracks
    .map((t) => ({ t, pct: trackPct(t.id) }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="edge-fade-y relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-glow opacity-80" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div className="animate-fade-up">
            <EyebrowPill live>Free &amp; open-source</EyebrowPill>
            <h1 className="hero-title mt-6 text-fg">
              Become a DevOps
              <br />
              engineer, the
              <br />
              <span className="gradient-text">structured</span> way.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted">
              {`One clear path from Linux to Platform Engineering. ${allTopics.length} topics, ${projects.length} hands-on projects and ${questions.length}+ interview questions, with progress that actually sticks.`}
            </p>
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/topic/linux-shell">
                  <Button size="lg" icon="zap">Start the roadmap</Button>
                </Link>
                <Link to="/interview">
                  <Button size="lg" variant="light" icon="book">
                    Interview prep
                  </Button>
                </Link>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-fg-faint">
                <Icon name="check" size={14} className="text-accent" />
                {'No login required \u00b7 free and open-source'}
              </p>
            </div>

            {/* Stat row */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
              {[
                { icon: 'compass', value: allTopics.length, label: 'Topics' },
                { icon: 'box', value: projects.length, label: 'Projects' },
                { icon: 'book', value: `${questions.length}+`, label: 'Questions' },
                { icon: 'layers', value: tracks.length, label: 'Tracks' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-card text-fg-muted">
                    <Icon name={s.icon as any} size={18} />
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold leading-none text-fg">{s.value}</p>
                    <p className="mt-1 text-xs text-fg-faint">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Outcome line + community / GitHub framing */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="inline-flex items-center gap-2 text-sm text-fg-muted">
                <Icon name="target" size={16} className="text-accent" />
                Everything you need from zero to hire-ready DevOps.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="eyebrow-pill normal-case tracking-normal text-fg-muted transition-colors hover:text-fg"
                style={{ fontFamily: 'inherit', fontSize: '0.8125rem' }}
              >
                <Icon name="branch" size={15} />
                {'Built by engineers \u00b7 star it on GitHub'}
              </a>
            </div>
          </div>

          {/* Floating progress card */}
          <Glass className="animate-fade-up p-6" style={{ animationDelay: '120ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="mono text-xs uppercase tracking-eyebrow text-accent">Your path</p>
                <h2 className="mt-1.5 font-display text-xl font-semibold text-fg">{started ? 'Keep the streak alive' : 'Start your journey'}</h2>
                {!started && (
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    <Icon name="play" size={12} />
                    {`Step 1 of ${tracks.length} \u00b7 Get started`}
                  </span>
                )}
              </div>
              {started ? (
                <Ring value={overallPct} size={64} stroke={5} />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-dashed border-line bg-card-2 text-accent">
                  <Icon name="compass" size={26} />
                </span>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {(pathTracks.length ? pathTracks : tracks.slice(0, 3).map((t) => ({ t, pct: trackPct(t.id) }))).map(
                ({ t, pct }, i) => {
                  // In guided mode before any progress, spotlight the very first step as the next action.
                  const isNextStep = mode === 'guided' && !started && i === 0;
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 ${isNextStep ? '-mx-3 rounded-xl bg-accent/10 px-3 py-2 ring-1 ring-accent/25' : ''}`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-bg text-white">
                        <Icon name={t.icon as any} size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-fg">
                            {isNextStep && <span className="mono mr-1.5 text-accent">Step 1:</span>}
                            {t.name}
                          </span>
                          {isNextStep ? (
                            <span className="mono shrink-0 text-xs font-semibold text-accent">Start</span>
                          ) : (
                            <span className="mono shrink-0 text-xs text-fg-faint">{pct}%</span>
                          )}
                        </div>
                        <Bar value={pct} height={5} />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            {!started && (
              <Link
                to="/interview"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-fg"
              >
                <Icon name="sparkle" size={12} className="text-accent" />
                Or jump straight into an AI mock interview.
              </Link>
            )}
            <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
              <StreakChip streakDays={streakDays} />
              <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                <Icon name="zap" size={16} className="text-accent" />
                <span className="mono font-semibold text-fg">{totalXP.toLocaleString()} XP</span>
              </span>
            </div>
          </Glass>
        </div>

        {/* Honest marquee: the 14 roadmap track names, looping. */}
        <TrackMarquee />
      </section>

      {/* ---------- CONTENT ---------- */}
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        {/* Resume strip */}
        {resumeTopic && (
          <div className="mb-12 gradient-border rounded-card bg-card p-1 shadow-card">
            <div className="flex flex-col items-start gap-4 rounded-[18px] bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-bg text-white shadow-glow-sm">
                  <Icon name="play" size={20} />
                </span>
                <div>
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-accent">Continue where you left off</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-fg">{resumeTopic.name}</h3>
                  <p className="mt-0.5 text-sm text-fg-muted">
                    {resumeTopic.trackName} · {resumeTopic.minutes} min ·{' '}
                    <span className="capitalize text-accent">{resumeTopic.difficulty}</span>
                  </p>
                </div>
              </div>
              <Link to={`/topic/${resumeTopic.id}`} className="w-full sm:w-auto">
                <Button icon="play" className="w-full sm:w-auto">Resume</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Recently viewed rail */}
        {recentViewed.length > 0 && (
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="clock" size={15} className="text-accent" />
              <span className="mono text-[11px] uppercase tracking-eyebrow text-fg-muted">Recently viewed</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentViewed.map((tp) => {
                const st = topicStatus(tp.id);
                return (
                  <Link
                    key={tp.id}
                    to={`/topic/${tp.id}`}
                    className="group glass flex items-center gap-3 rounded-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        st === 'done'
                          ? 'gradient-bg text-white'
                          : 'border border-line bg-card-2 text-fg-muted'
                      }`}
                    >
                      <Icon name={st === 'done' ? 'check' : 'book'} size={16} strokeWidth={st === 'done' ? 3 : 2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{tp.name}</p>
                      <p className="truncate text-xs text-fg-faint">
                        {tp.trackName} {'\u00b7'} {tp.minutes} min
                      </p>
                    </div>
                    <Icon
                      name="arrow-right"
                      size={16}
                      className="shrink-0 text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Section heading + view switcher */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <EyebrowPill dot className="mb-3">The roadmap</EyebrowPill>
            <h2 className="section-title text-fg">
              Your end-to-end DevOps path
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Fourteen tracks, ordered so each one builds on the last. Tick topics as you go, your progress
              saves automatically.
            </p>
          </div>
          <ViewSwitcher view={view} setView={setView} />
        </div>

        {/* Mode toggle: guided highlights the recommended linear path; browse is freeform */}
        <ModeToggle mode={mode} setMode={setMode} />

        {/* Views */}
        {view === 'grid' && <GridView mode={mode} />}
        {view === 'spine' && <SpineView mode={mode} />}
        {view === 'path' && <PathView mode={mode} />}

        {/* Completion badge / mock certificate preview */}
        <CertificatePreview />

        {/* Dual CTAs */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <CtaCard
            to="/projects"
            icon="box"
            title="22 hands-on projects"
            body="Apply each track with real, portfolio-ready builds, from a CI/CD pipeline to a full GitOps cluster."
            cta="Browse projects"
          />
          <CtaCard
            to="/interview"
            icon="book"
            title="60+ interview questions"
            body="Curated by topic and difficulty, with crisp model answers. Flip, filter and mark the ones you've mastered."
            cta="Open the guide"
            teaser="Mock interviews with live AI feedback"
          />
        </div>
      </div>
    </>
  );
}

function ViewSwitcher({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const opts: { id: ViewMode; label: string; icon: any }[] = [
    { id: 'grid', label: 'Grid', icon: 'grid' },
    { id: 'spine', label: 'Spine', icon: 'spine' },
    { id: 'path', label: 'Path', icon: 'path' },
  ];
  return (
    <div className="inline-flex shrink-0 self-start rounded-full border border-line bg-card p-1 shadow-card">
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => setView(o.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
            view === o.id ? 'gradient-bg text-white shadow-glow-sm' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <Icon name={o.icon} size={15} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

function GridView({ mode }: { mode: RoadMode }) {
  const guided = mode === 'guided';
  let idx = -1;
  return (
    <div className="space-y-10">
      {PHASES.map((phase, pi) => {
        const phaseTracks = tracksByPhase(phase.id);
        return (
          <div key={phase.id}>
            {/* Phase label row */}
            <div className="mb-4 flex items-baseline gap-3">
              <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-bg text-xs font-bold text-white shadow-glow-sm">
                {pi + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight2 text-fg">{phase.label}</h3>
                <p className="text-sm text-fg-muted">{phase.tagline}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {phaseTracks.map((t) => {
                idx += 1;
                return (
                  <ModuleCard
                    key={t.id}
                    track={t}
                    index={idx}
                    rec={REC_BY_TRACK[t.id]}
                    guided={guided}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpineView({ mode }: { mode: RoadMode }) {
  const guided = mode === 'guided';
  return (
    <div className="relative">
      {/* center line on desktop, left rail on mobile */}
      <div className="absolute bottom-0 left-[19px] top-2 w-0.5 bg-line md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-6">
        {tracks.map((t, i) => (
          <div
            key={t.id}
            className={`relative flex items-stretch gap-6 pl-12 md:pl-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* node dot */}
            <span className="absolute left-[13px] top-7 z-10 grid h-3.5 w-3.5 -translate-x-px place-items-center rounded-full gradient-bg ring-4 ring-page md:left-1/2 md:-translate-x-1/2">
            </span>
            <div className="w-full md:w-[calc(50%-1.5rem)]">
              <ModuleCard track={t} index={i} rec={REC_BY_TRACK[t.id]} guided={guided} />
            </div>
            <div className="hidden md:block md:w-[calc(50%-1.5rem)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PathView({ mode }: { mode: RoadMode }) {
  const guided = mode === 'guided';
  // Serpentine path: rows of up to 3, alternating direction, with connectors.
  const rows: typeof tracks[] = [];
  for (let i = 0; i < tracks.length; i += 3) rows.push(tracks.slice(i, i + 3));
  return (
    <div className="space-y-5">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={`grid grid-cols-1 gap-5 md:grid-cols-3 ${ri % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
        >
          {row.map((t, i) => (
            <div key={t.id} className="relative [direction:ltr]">
              <span className="mono absolute -top-3 left-4 z-10 rounded-full gradient-bg px-2.5 py-0.5 text-[11px] font-bold text-white shadow-glow-sm">
                {String(ri * 3 + i + 1).padStart(2, '0')}
              </span>
              <ModuleCard track={t} index={ri * 3 + i} rec={REC_BY_TRACK[t.id]} guided={guided} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CtaCard({
  to,
  icon,
  title,
  body,
  cta,
  teaser,
}: {
  to: string;
  icon: any;
  title: string;
  body: string;
  cta: string;
  teaser?: string;
}) {
  return (
    <Link
      to={to}
      className="group glass relative block overflow-hidden rounded-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-card-2 text-accent">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight2 text-fg">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{body}</p>
      {teaser && (
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <Icon name="sparkle" size={13} />
          {teaser}
          <span className="mono rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] uppercase tracking-eyebrow">New</span>
        </span>
      )}
      <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-accent">
        {cta}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/* ----------------------------- TrackMarquee ----------------------------- */
function TrackMarquee() {
  // Honest content only: the real 14 roadmap track names, looped seamlessly.
  const items = tracks.map((t) => ({ name: t.name, icon: t.icon as any }));
  const row = [...items, ...items];
  return (
    <div className="marquee-mask marquee-pause relative border-t border-line py-6">
      <div
        className="marquee-track gap-3"
        style={{ ['--marquee-duration' as any]: '40s' }}
      >
        {row.map((it, i) => (
          <span
            key={`${it.name}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm text-fg-muted"
          >
            <Icon name={it.icon} size={15} className="text-accent" />
            {it.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- ModeToggle ----------------------------- */
function ModeToggle({ mode, setMode }: { mode: RoadMode; setMode: (m: RoadMode) => void }) {
  const opts: { id: RoadMode; label: string; icon: any; hint: string }[] = [
    { id: 'guided', label: 'Guided', icon: 'target', hint: 'We highlight the next step to take' },
    { id: 'browse', label: 'Free browse', icon: 'compass', hint: 'Jump into any track in any order' },
  ];
  const active = opts.find((o) => o.id === mode)!;
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-full border border-line bg-card p-1 shadow-card">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => setMode(o.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
              mode === o.id ? 'gradient-bg text-white shadow-glow-sm' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <Icon name={o.icon} size={14} />
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-fg-muted">{active.hint}.</p>
    </div>
  );
}

/* ----------------------------- StreakChip ----------------------------- */
function StreakChip({ streakDays }: { streakDays: number }) {
  return (
    <span className="group relative inline-flex cursor-default items-center gap-1.5 text-sm text-fg-muted">
      <Icon name="flame" size={16} className="text-streak" />
      {streakDays} {streakDays === 1 ? 'day' : 'days'}
      <span
        role="tooltip"
        className="glass pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-56 translate-y-1 rounded-xl px-3 py-2 text-xs leading-relaxed text-fg-muted opacity-0 shadow-lift transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        Complete at least one topic each day to keep your streak going. Miss a day and it resets to zero.
      </span>
    </span>
  );
}

/* ----------------------------- CertificatePreview ----------------------------- */
function CertificatePreview() {
  const { tracksCompleted, tracksTotal, projectsDone, projectsTotal } = useProgress();
  const earned = tracksCompleted >= tracksTotal && projectsDone >= projectsTotal;
  // Honest blended progress toward the badge (tracks + projects).
  const badgePct = Math.round(
    ((tracksCompleted + projectsDone) / (tracksTotal + projectsTotal)) * 100
  );
  return (
    <div className="mt-16">
      <Glass className="relative overflow-hidden p-7 sm:p-9">
        <div className="hero-grid absolute inset-0 opacity-[0.35]" />
        <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <EyebrowPill dot>{earned ? 'Unlocked' : 'On completion'}</EyebrowPill>
            <h3 className="mt-4 section-title text-fg">
              {earned ? 'Your Edufly badge is ready' : 'Earn your Edufly completion badge'}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
              Finish all fourteen tracks and the twenty-two projects to unlock a shareable badge that proves
              you can run modern infrastructure end to end.
            </p>
            {/* Live, honest progress toward the badge */}
            <div className="mt-5 max-w-md">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-fg-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="layers" size={13} className="text-accent" />
                  <span className="mono">{tracksCompleted}/{tracksTotal}</span> tracks
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="box" size={13} className="text-accent" />
                  <span className="mono">{projectsDone}/{projectsTotal}</span> projects
                </span>
                <span className="mono font-semibold text-fg">{badgePct}%</span>
              </div>
              <Bar value={badgePct} height={8} />
            </div>
          </div>

          {/* Mock certificate */}
          <div className="w-full max-w-sm shrink-0 lg:w-80">
            <div className="gradient-border rounded-card p-1 shadow-lift">
              <div className="rounded-[20px] bg-card px-6 py-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-bg text-white shadow-glow-sm">
                  <Icon name="trophy" size={26} />
                </span>
                <p className="mono mt-4 text-[10px] uppercase tracking-eyebrow text-fg-faint">Certificate of completion</p>
                <p className="mt-1.5 font-display text-lg font-bold tracking-tight2 text-fg">DevOps Engineer Path</p>
                <p className="mt-1 text-xs text-fg-muted">{'95 topics \u00b7 22 projects \u00b7 14 tracks'}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="mono text-[10px] text-fg-faint">Edufly</span>
                  {earned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-done">
                      <Icon name="check" size={11} strokeWidth={3} /> Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-locked">
                      <Icon name="lock" size={11} /> {badgePct}% there
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Glass>
    </div>
  );
}
