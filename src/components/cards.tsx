import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Bar, IconTile } from './ui';
import { useProgress } from '../store/progress';
import type { Track, Topic, Project } from '../data/types';
import { projects } from '../data/projects';
import { diffColor } from './ui';

// How many hands-on projects reinforce each track. Used for the "projects" pill.
const projectCountByTrack: Record<string, number> = projects.reduce((acc, p) => {
  acc[p.trackId] = (acc[p.trackId] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Recommendation pill shown on the first track the learner should tackle.
export type RecKind = 'start';

/* ----------------------------- TopicRow ----------------------------- */
export function TopicRow({ topic }: { topic: Topic; trackId?: string }) {
  const { topicStatus, cycleTopic } = useProgress();
  const status = topicStatus(topic.id);
  const opt = !!topic.optional;
  // Optional topics get a dashed, amber-tinted check ring so they read as
  // "nice to have" rather than "required". Required topics keep the solid ring.
  const ring = status === 'done'
    ? 'border-transparent gradient-bg text-white'
    : status === 'in-progress'
      ? 'border-progress text-progress'
      : opt
        ? 'border-dashed border-optional/60 text-transparent'
        : 'border-line text-transparent';
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-card-2 ${opt ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      <button
        onClick={() => cycleTopic(topic.id)}
        aria-label={`Cycle status for ${topic.name}`}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${ring}`}
      >
        {status === 'done' && <Icon name="check" size={13} strokeWidth={3} />}
        {status === 'in-progress' && <span className="h-2 w-2 rounded-full bg-progress" />}
      </button>
      <Link
        to={`/topic/${topic.id}`}
        className={`flex-1 truncate text-sm font-medium transition-colors hover:text-fg ${
          status === 'done' ? 'text-fg-muted line-through decoration-fg-faint/50' : 'text-fg'
        }`}
      >
        {topic.name}
      </Link>
      {opt && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-optional/50 bg-optional/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-eyebrow text-optional">
          Optional
        </span>
      )}
      <span className="hidden items-center gap-1 text-xs text-fg-faint sm:flex">
        <Icon name="clock" size={13} /> {topic.minutes}m
      </span>
      <span className={`h-2 w-2 shrink-0 rounded-full bg-${diffColor[topic.difficulty]}`} title={topic.difficulty} />
    </div>
  );
}

/* ----------------------------- ModuleCard ----------------------------- */
const recStyle: Record<RecKind, { label: string; cls: string; icon: 'target' }> = {
  start: { label: 'Start here', cls: 'gradient-bg text-white shadow-glow-sm', icon: 'target' },
};

export function ModuleCard({
  track,
  index = 0,
  rec,
  guided,
}: {
  track: Track;
  index?: number;
  rec?: RecKind;
  guided?: boolean;
}) {
  const { trackPct, trackDone, tracksCompleted, tracksTotal } = useProgress();
  const [open, setOpen] = useState(false);
  const pct = trackPct(track.id);
  const done = trackDone(track.id);
  const levels = [...new Set(track.topics.map((t) => t.difficulty))];
  const complete = pct === 100;

  // "Recommended last" tracks (formerly hard-locked) stay fully open and
  // explorable. We just surface a transparent, friendly recommendation instead
  // of a wall: nothing is gated, the learner can dive in whenever they want.
  const recommendLast = !!track.locked;
  const tracksToGo = Math.max(0, tracksTotal - 1 - tracksCompleted);

  // Guided mode lifts the recommended next steps with a glowing ring.
  const highlight = guided && rec ? 'ring-2 ring-accent/60 shadow-glow-sm' : '';
  const completeRing = complete ? 'ring-1 ring-done/40' : '';

  return (
    <div
      className={`group relative glass rounded-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up ${highlight} ${completeRing}`}
      style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
    >
      {rec && !complete && (
        <span
          className={`mono absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow ${recStyle[rec].cls}`}
        >
          <Icon name={recStyle[rec].icon} size={11} strokeWidth={3} />
          {recStyle[rec].label}
        </span>
      )}
      {recommendLast && !complete && (
        <span className="mono absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1 rounded-full border border-line bg-card px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-fg-muted shadow-card">
          <Icon name="target" size={11} strokeWidth={3} className="text-accent" />
          Best saved for last
        </span>
      )}
      {complete && (
        <span className="mono absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-done px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-white shadow-glow-sm">
          <Icon name="check" size={11} strokeWidth={3} />
          Track complete
        </span>
      )}
      <ModuleCardInner
        track={track}
        pct={pct}
        done={done}
        levels={levels}
        open={open}
        setOpen={setOpen}
        recommendLast={recommendLast}
        tracksToGo={tracksToGo}
      />
    </div>
  );
}

function ModuleCardInner({
  track,
  pct,
  done,
  levels,
  open,
  setOpen,
  recommendLast,
  tracksToGo,
}: {
  track: Track;
  pct: number;
  done: number;
  levels: Track['topics'][number]['difficulty'][];
  open: boolean;
  setOpen: (v: boolean) => void;
  recommendLast?: boolean;
  tracksToGo?: number;
}) {
  const projectCount = projectCountByTrack[track.id] ?? 0;
  // Split topics so the card can speak honestly about what is required for the
  // badge vs what is optional enrichment.
  const requiredTopics = track.topics.filter((t) => !t.optional);
  const optionalTopics = track.topics.filter((t) => t.optional);
  // Estimated time to finish the whole track.
  const totalMin = track.topics.reduce((sum, t) => sum + t.minutes, 0);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeLabel = hrs > 0 ? `${hrs}h${mins ? ` ${mins}m` : ''}` : `${mins}m`;
  // First few topic names, surfaced on hover for a quick scan of what's inside.
  const previewTopics = track.topics.slice(0, 3).map((t) => t.name);
  return (
    <>
      <div className="flex items-start gap-3.5">
        <IconTile name={track.icon as any} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {/* Titles wrap to two lines instead of truncating mid-word. */}
            <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight2 text-fg">{track.name}</h3>
            {track.popular && (
              <span className="mono mt-1 shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-eyebrow text-accent">
                Popular
              </span>
            )}
          </div>
          {track.action && (
            <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-fg-muted">{track.action}</p>
          )}
        </div>
      </div>

      {/* Badge row: difficulty + topic count + estimated time + projects */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <DifficultyBadgePill levels={levels} />
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2.5 py-1 text-xs font-medium text-fg-muted">
          <Icon name="book" size={13} className="text-accent" />
          {track.topics.length} topics
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2.5 py-1 text-xs font-medium text-fg-muted">
          <Icon name="clock" size={13} className="text-accent" />
          ~{timeLabel}
        </span>
        {projectCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2.5 py-1 text-xs font-medium text-fg-muted">
            <Icon name="box" size={13} className="text-accent" />
            {projectCount} {projectCount === 1 ? 'project' : 'projects'}
          </span>
        )}
      </div>

      {/* Transparent recommendation for the capstone track (no hard lock) */}
      {recommendLast && (
        <p className="mt-3 inline-flex items-start gap-1.5 rounded-xl border border-line bg-card-2 px-3 py-2 text-xs leading-relaxed text-fg-muted">
          <Icon name="target" size={14} className="mt-0.5 shrink-0 text-accent" />
          <span>
            Capstone track. It builds on everything else, so it lands best near the end{typeof tracksToGo === 'number' && tracksToGo > 0 ? ` (about ${tracksToGo} more ${tracksToGo === 1 ? 'track' : 'tracks'} to go)` : ''}. Nothing is locked though, jump in whenever you like.
          </span>
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted">
          <Icon name="check" size={14} className={done > 0 ? 'text-done' : ''} />
          <span className="mono">{done} / {track.topics.length}</span> done
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:opacity-80"
          aria-expanded={open}
        >
          {open ? 'Hide syllabus' : 'View syllabus'}
          <Icon name="chevron-down" size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="mt-3">
        <Bar value={pct} />
      </div>

      {/* Hover-reveal: quick peek at the first few subtopics (collapses when syllabus is open) */}
      {!open && previewTopics.length > 0 && (
        <div className="hover-peek mt-0 overflow-hidden text-xs text-fg-faint">
          <div className="hover-peek-inner border-t border-line pt-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="mono uppercase tracking-eyebrow text-fg-faint/80">Inside</span>
              {/* Live link to AI interview practice, only on hover so the default card stays clean */}
              <Link
                to="/interview"
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                <Icon name="sparkle" size={11} />
                Test with AI
              </Link>
            </div>
            <p className="mt-1 truncate text-fg-muted">{previewTopics.join(' \u00b7 ') + '\u2026'}</p>
          </div>
        </div>
      )}

      {/* Full syllabus: required topics first, optional enrichment clearly grouped */}
      <div className={`collapsible ${open ? 'open mt-2' : ''}`}>
        <div className="collapsible-inner">
          <div className="border-t border-line pt-2">
            {requiredTopics.map((tp) => (
              <TopicRow key={tp.id} topic={tp} trackId={track.id} />
            ))}
            {optionalTopics.length > 0 && (
              <>
                <div className="mt-2 flex items-center gap-2 px-2 pt-2">
                  <span className="mono text-[10px] uppercase tracking-eyebrow text-optional">Optional deep-dives</span>
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[11px] text-fg-faint">not needed for the badge</span>
                </div>
                {optionalTopics.map((tp) => (
                  <TopicRow key={tp.id} topic={tp} trackId={track.id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Difficulty pill, shown only when it carries real information. 13 of 14
// tracks start at beginner, so labeling them all was noise. Starting at
// beginner is the norm and stays unlabeled; a track that assumes prior
// ground gets a clear "Starts at intermediate/advanced" heads-up.
function DifficultyBadgePill({ levels }: { levels: Track['topics'][number]['difficulty'][] }) {
  const order = ['beginner', 'intermediate', 'advanced'] as const;
  const top = order.find((l) => levels.includes(l)) ?? 'beginner';
  if (top === 'beginner') return null;
  const span = `Starts at ${top}`;
  const cls: Record<string, string> = {
    beginner: 'text-diff-beginner bg-diff-beginner/10',
    intermediate: 'text-diff-intermediate bg-diff-intermediate/10',
    advanced: 'text-diff-advanced bg-diff-advanced/10',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls[top]}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-${diffColor[top]}`} />
      {span}
    </span>
  );
}

/* ----------------------------- ProjectCard ----------------------------- */
const diffPill: Record<string, string> = {
  beginner: 'text-diff-beginner bg-diff-beginner/10',
  intermediate: 'text-diff-intermediate bg-diff-intermediate/10',
  advanced: 'text-diff-advanced bg-diff-advanced/10',
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { projectPct } = useProgress();
  const pct = projectPct(project.id);
  const complete = pct === 100;
  return (
    <Link
      to={`/project/${project.id}`}
      className="group glass flex flex-col overflow-hidden rounded-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="relative h-[88px] bg-gradient-to-br from-card-2 to-card px-5 pt-4">
        <span className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">{project.area}</span>
        <div className="absolute -bottom-5 left-5">
          <IconTile name={project.icon as any} />
        </div>
        {complete && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-done/10 px-2 py-0.5 text-[10px] font-semibold text-done">
            <Icon name="check" size={11} strokeWidth={3} /> Shipped
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-8">
        <h3 className="font-display text-base font-semibold text-fg">{project.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-snug text-fg-muted">{project.blurb}</p>
        {pct > 0 && !complete && (
          <div className="mt-3">
            <Bar value={pct} height={5} />
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${diffPill[project.difficulty]}`}>
              {project.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
              <Icon name="clock" size={13} /> {project.time}
            </span>
          </div>
          <Icon
            name="arrow-right"
            size={18}
            className="text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- StatCard ----------------------------- */
export function StatCard({
  icon,
  value,
  label,
  meta,
  metaColor,
}: {
  icon: any;
  value: string | number;
  label: string;
  meta?: string;
  metaColor?: string;
}) {
  return (
    <div className="glass rounded-card p-5">
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card-2 text-fg-muted">
          <Icon name={icon} size={20} />
        </span>
        {meta && <span className={`text-xs font-semibold ${metaColor ?? 'text-done'}`}>{meta}</span>}
      </div>
      <p className="mt-4 font-display text-3xl font-bold tracking-tight2 text-fg">{value}</p>
      <p className="mt-0.5 text-sm text-fg-muted">{label}</p>
    </div>
  );
}

/* ----------------------------- WeekStrip ----------------------------- */
export function WeekStrip({ streakDates }: { streakDates: string[] }) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  // Build the current week (Mon..Sun) and check which days are active.
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  const set = new Set(streakDates);
  return (
    <div className="flex items-center justify-between gap-2">
      {labels.map((lab, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const iso = d.toISOString().slice(0, 10);
        const active = set.has(iso);
        const isToday = i === dow;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`grid h-11 w-full place-items-center rounded-xl border transition-all ${
                active
                  ? 'gradient-bg border-transparent text-white shadow-glow-sm'
                  : isToday
                    ? 'border-accent/40 bg-card text-fg-faint'
                    : 'border-line bg-card-2 text-fg-faint'
              }`}
            >
              <Icon name="flame" size={16} className={active ? 'text-white' : ''} />
            </div>
            <span className={`mono text-[11px] ${isToday ? 'font-bold text-fg' : 'text-fg-faint'}`}>{lab}</span>
          </div>
        );
      })}
    </div>
  );
}
