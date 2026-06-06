import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tracks } from '../data/tracks';
import { allTopics } from '../data/tracks';
import { projects } from '../data/projects';
import { questions } from '../data/questions';
import { useProgress } from '../store/progress';
import { Button, Ring, Bar } from '../components/ui';
import { Icon } from '../components/Icon';
import { ModuleCard } from '../components/cards';

type ViewMode = 'grid' | 'spine' | 'path';

export default function Roadmap() {
  const [view, setView] = useState<ViewMode>('grid');
  const { totalXP, streakDays, trackPct, lastTopicId, overallPct } = useProgress();

  const resumeTopic = allTopics.find((t) => t.id === lastTopicId) ?? allTopics.find((t) => t.id === 'linux-systemd');

  // Top 3 tracks with progress for the floating "your path" card
  const pathTracks = tracks
    .filter((t) => !t.locked)
    .map((t) => ({ t, pct: trackPct(t.id) }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  return (
    <>
      {/* ---------- DARK HERO ---------- */}
      <section className="darkchrome relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-70" />
        <div className="absolute inset-0 hero-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3.5 text-sm text-white/70">
              <span className="rounded-full gradient-bg px-2.5 py-0.5 text-[11px] font-bold text-white">FREE</span>
              Open-source DevOps roadmap · updated for 2026
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,1rem+5vw,4.5rem)] font-bold leading-[1.04] tracking-tight2 text-white">
              Become a DevOps
              <br />
              engineer, the
              <br />
              <span className="gradient-text">structured</span> way.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
              One clear path from Linux to Platform Engineering. 95 topics, 22 hands-on projects and 60+
              interview questions, with progress that actually sticks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/topic/linux-shell">
                <Button size="lg" icon="zap">Start the roadmap</Button>
              </Link>
              <Link to="/interview">
                <Button size="lg" variant="dark" icon="book">Interview prep</Button>
              </Link>
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
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60">
                    <Icon name={s.icon as any} size={18} />
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold leading-none text-white">{s.value}</p>
                    <p className="mt-1 text-xs text-white/45">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating progress card */}
          <div className="animate-fade-up rounded-card border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm" style={{ animationDelay: '120ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="mono text-xs uppercase tracking-eyebrow text-progress">Your path</p>
                <h2 className="mt-1.5 font-display text-xl font-semibold text-white">Keep the streak alive</h2>
              </div>
              <Ring value={overallPct} size={64} stroke={5} labelClassName="text-white" trackClassName="text-white/15" />
            </div>
            <div className="mt-6 space-y-4">
              {(pathTracks.length ? pathTracks : tracks.slice(0, 3).map((t) => ({ t, pct: trackPct(t.id) }))).map(
                ({ t, pct }) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-bg text-white">
                      <Icon name={t.icon as any} size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-white/85">{t.name}</span>
                        <span className="mono shrink-0 text-xs text-white/50">{pct}%</span>
                      </div>
                      <Bar value={pct} height={5} />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <Icon name="flame" size={16} className="text-streak" /> {streakDays} days
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <Icon name="zap" size={16} className="text-progress" />
                <span className="mono font-semibold text-white">{totalXP.toLocaleString()} XP</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LIGHT CONTENT ---------- */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        {/* Resume strip */}
        {resumeTopic && (
          <div className="mb-12 gradient-border rounded-card bg-card p-1 shadow-card">
            <div className="flex flex-col items-start gap-4 rounded-[18px] bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-bg text-white shadow-glow-sm">
                  <Icon name="play" size={20} />
                </span>
                <div>
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-progress">Continue where you left off</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-fg">{resumeTopic.name}</h3>
                  <p className="mt-0.5 text-sm text-fg-muted">
                    {resumeTopic.trackName} · {resumeTopic.minutes} min ·{' '}
                    <span className="capitalize text-progress">{resumeTopic.difficulty}</span>
                  </p>
                </div>
              </div>
              <Link to={`/topic/${resumeTopic.id}`} className="w-full sm:w-auto">
                <Button icon="play" className="w-full sm:w-auto">Resume</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Section heading + view switcher */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono mb-2 text-xs uppercase tracking-eyebrow text-progress">The roadmap</p>
            <h2 className="font-display text-[clamp(1.75rem,1rem+2vw,2.5rem)] font-bold tracking-tight2 text-fg">
              Your end-to-end DevOps path
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Fourteen tracks, ordered so each one builds on the last. Tick topics as you go, your progress
              saves automatically.
            </p>
          </div>
          <ViewSwitcher view={view} setView={setView} />
        </div>

        {/* Views */}
        {view === 'grid' && <GridView />}
        {view === 'spine' && <SpineView />}
        {view === 'path' && <PathView />}

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

function GridView() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map((t, i) => (
        <ModuleCard key={t.id} track={t} index={i} />
      ))}
    </div>
  );
}

function SpineView() {
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
              <ModuleCard track={t} index={i} />
            </div>
            <div className="hidden md:block md:w-[calc(50%-1.5rem)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PathView() {
  // Serpentine path: rows of up to 3, alternating direction, with connectors.
  const rows: typeof tracks[] = [];
  for (let i = 0; i < tracks.length; i += 3) rows.push(tracks.slice(i, i + 3));
  return (
    <div className="space-y-5">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={`grid gap-5 md:grid-cols-3 ${ri % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
        >
          {row.map((t, i) => (
            <div key={t.id} className="relative [direction:ltr]">
              <span className="mono absolute -top-3 left-4 z-10 rounded-full gradient-bg px-2.5 py-0.5 text-[11px] font-bold text-white shadow-glow-sm">
                {String(ri * 3 + i + 1).padStart(2, '0')}
              </span>
              <ModuleCard track={t} index={ri * 3 + i} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CtaCard({ to, icon, title, body, cta }: { to: string; icon: any; title: string; body: string; cta: string }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-card border border-line bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-card-2 text-progress">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight2 text-fg">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{body}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-progress">
        {cta}
        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
