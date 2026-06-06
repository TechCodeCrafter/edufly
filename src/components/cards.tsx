import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Ring, Bar, DifficultyDots, IconTile } from './ui';
import { useProgress, type TopicStatus } from '../store/progress';
import type { Track, Topic, Project } from '../data/types';
import { diffColor } from './ui';

/* ----------------------------- TopicRow ----------------------------- */
const statusRing: Record<TopicStatus, string> = {
  todo: 'border-line text-transparent',
  'in-progress': 'border-progress text-progress',
  done: 'border-transparent gradient-bg text-white',
};

export function TopicRow({ topic }: { topic: Topic; trackId?: string }) {
  const { topicStatus, cycleTopic } = useProgress();
  const status = topicStatus(topic.id);
  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-card-2">
      <button
        onClick={() => cycleTopic(topic.id)}
        aria-label={`Cycle status for ${topic.name}`}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${statusRing[status]}`}
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
      {topic.optional && (
        <span className="mono hidden text-[10px] uppercase tracking-eyebrow text-optional sm:inline">Optional</span>
      )}
      <span className="hidden items-center gap-1 text-xs text-fg-faint sm:flex">
        <Icon name="clock" size={13} /> {topic.minutes}m
      </span>
      <span className={`h-2 w-2 shrink-0 rounded-full bg-${diffColor[topic.difficulty]}`} title={topic.difficulty} />
    </div>
  );
}

/* ----------------------------- ModuleCard ----------------------------- */
export function ModuleCard({ track, index = 0 }: { track: Track; index?: number }) {
  const { trackPct, trackDone } = useProgress();
  const [open, setOpen] = useState(false);
  const pct = trackPct(track.id);
  const done = trackDone(track.id);
  const levels = [...new Set(track.topics.map((t) => t.difficulty))];

  if (track.locked) {
    return (
      <div className="relative overflow-hidden rounded-card border border-line bg-card p-5 shadow-card">
        <div className="pointer-events-none select-none opacity-60 blur-[1.5px]">
          <ModuleCardInner track={track} pct={0} done={0} levels={levels} open={false} setOpen={() => {}} locked />
        </div>
        <div className="absolute inset-0 grid place-items-center rounded-card bg-card/40 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-card text-locked shadow-card">
              <Icon name="lock" size={20} />
            </span>
            <p className="text-sm font-semibold text-fg">Complete earlier tracks to unlock</p>
            <p className="text-xs text-fg-muted">Finish SRE to open Platform Engineering</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-card border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
    >
      <ModuleCardInner track={track} pct={pct} done={done} levels={levels} open={open} setOpen={setOpen} />
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
  locked,
}: {
  track: Track;
  pct: number;
  done: number;
  levels: Track['topics'][number]['difficulty'][];
  open: boolean;
  setOpen: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <>
      <div className="flex items-start gap-3.5">
        <IconTile name={track.icon as any} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-fg">{track.name}</h3>
            {track.popular && (
              <span className="mono shrink-0 rounded-full bg-progress/10 px-2 py-0.5 text-[10px] uppercase tracking-eyebrow text-progress">
                Popular
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-fg-muted">{track.blurb}</p>
        </div>
        <Ring value={pct} size={42} stroke={4} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted">
            <Icon name="book" size={14} />
            <span className="mono">{done} / {track.topics.length}</span> topics
          </span>
          <DifficultyDots levels={levels} />
        </div>
        {!locked && (
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-progress transition-colors hover:opacity-80"
          >
            Explore
            <Icon name="chevron-down" size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <div className="mt-3">
        <Bar value={pct} />
      </div>

      <div className={`collapsible ${open ? 'open mt-2' : ''}`}>
        <div className="collapsible-inner">
          <div className="border-t border-line pt-2">
            {track.topics.map((tp) => (
              <TopicRow key={tp.id} topic={tp} trackId={track.id} />
            ))}
          </div>
        </div>
      </div>
    </>
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
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
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
            className="text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-progress"
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
    <div className="rounded-card border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-card-2 text-fg-muted">
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
                    ? 'border-progress/40 bg-card text-fg-faint'
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
