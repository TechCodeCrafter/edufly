import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { allTopics, tracks } from '../data/tracks';
import { useProgress } from '../store/progress';
import { Button, Ring, DifficultyBadge, Glass } from '../components/ui';
import { Icon } from '../components/Icon';
import { CodeBlock } from '../components/CodeBlock';
import { DarkHeader } from '../components/DarkHeader';

const resourceIcon: Record<string, string> = {
  Reading: 'book',
  Article: 'book',
  Tool: 'terminal',
  Video: 'play',
  Series: 'play',
  Reference: 'list',
  Cheatsheet: 'list',
  Docs: 'book',
};

export default function TopicDetail() {
  const { id } = useParams();
  const topic = allTopics.find((t) => t.id === id);
  const { topicStatus, cycleTopic, setTopicDone, trackPct, recordView } = useProgress();

  // Mark this topic as the one to resume from and add it to Recently viewed.
  useEffect(() => {
    if (topic) recordView(topic.id);
  }, [topic?.id, recordView]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-fg">Topic not found</h1>
        <p className="mt-2 text-fg-muted">That topic is not part of the roadmap.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button icon="compass">Back to roadmap</Button>
        </Link>
      </div>
    );
  }

  const track = tracks.find((t) => t.id === topic.trackId);
  const status = topicStatus(topic.id);
  const trackTopics = track?.topics ?? [];
  const idx = trackTopics.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? trackTopics[idx - 1] : undefined;
  const next = idx >= 0 && idx < trackTopics.length - 1 ? trackTopics[idx + 1] : undefined;

  const statusLabel = status === 'done' ? 'Completed' : status === 'in-progress' ? 'In progress' : 'Not started';

  return (
    <>
      <DarkHeader>
        <nav className="mb-6 flex items-center gap-2 text-sm text-fg-faint">
          <Link to="/" className="transition-colors hover:text-fg">Roadmap</Link>
          <Icon name="chevron-right" size={14} />
          <Link to="/" className="transition-colors hover:text-fg">{topic.trackName}</Link>
          <Icon name="chevron-right" size={14} />
          <span className="truncate text-fg-muted">{topic.name}</span>
        </nav>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="mono rounded-full border border-line bg-card-2 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-fg-muted">
                {topic.trackName}
              </span>
              {topic.optional && (
                <span className="mono rounded-full bg-optional/15 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-optional">
                  Optional
                </span>
              )}
            </div>
            <h1 className="hero-title text-fg">
              {topic.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">{topic.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-fg-muted">
              <span className="inline-flex items-center gap-2">
                <Icon name="clock" size={16} /> {topic.minutes} min read
              </span>
              <span className="inline-flex items-center gap-2 capitalize">
                <Icon name="gauge" size={16} /> {topic.difficulty}
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="book" size={16} /> {topic.objectives.length} objectives
              </span>
            </div>
          </div>
          <Glass className="shrink-0 p-5">
            <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Status</p>
            <p className="mt-1.5 font-display text-lg font-semibold text-fg">{statusLabel}</p>
            <button
              onClick={() => cycleTopic(topic.id)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-btn border border-line bg-card-2 px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-card"
            >
              <Icon name={status === 'done' ? 'check' : 'circle'} size={16} strokeWidth={status === 'done' ? 3 : 2} />
              {status === 'done' ? 'Mark not started' : status === 'in-progress' ? 'Mark complete' : 'Start this topic'}
            </button>
          </Glass>
        </div>
      </DarkHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px] lg:py-16">
        {/* Lesson body */}
        <article className="min-w-0">
          {/* Objectives */}
          <section className="glass rounded-card p-6">
            <p className="mono mb-4 text-xs uppercase tracking-eyebrow text-accent">What you will learn</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {topic.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-fg">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-bg text-white">
                    <Icon name="check" size={12} strokeWidth={3} />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </section>

          {/* Absolute-beginner primer */}
          {topic.basics && (
            <section className="mt-8 glass overflow-hidden rounded-card ring-1 ring-accent/25">
              <div className="flex items-center gap-2.5 border-b border-accent/15 bg-accent/[0.06] px-6 py-3.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg gradient-bg text-white">
                  <Icon name="sparkle" size={15} />
                </span>
                <div>
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-accent">New to this? Start here</p>
                  <h2 className="font-display text-base font-semibold text-fg">The basics, in plain English</h2>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-[15px] leading-relaxed text-fg-muted">{topic.basics.intro}</p>
                <dl className="mt-4 space-y-3">
                  {topic.basics.points.map((p, i) => (
                    <div key={i} className="flex flex-col gap-1 rounded-xl border border-line bg-card-2/50 p-3.5 sm:flex-row sm:gap-3">
                      <dt className="mono shrink-0 text-[13px] font-semibold text-fg sm:w-40">{p.term}</dt>
                      <dd className="text-[14px] leading-relaxed text-fg-muted">{p.plain}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* Sections */}
          <div className="mt-8 space-y-8">
            {topic.sections.map((s, i) => (
              <section key={i}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="mono grid h-7 w-7 place-items-center rounded-lg border border-line bg-card-2 text-xs font-bold text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-xl font-semibold tracking-tight2 text-fg">{s.heading}</h2>
                </div>
                <p className="pl-10 text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
              </section>
            ))}
          </div>

          {/* Code block */}
          {topic.code && (
            <section className="mt-8">
              <p className="mono mb-3 text-xs uppercase tracking-eyebrow text-accent">Try it yourself</p>
              <CodeBlock label={topic.code.label} lines={topic.code.lines} />
            </section>
          )}

          {/* Complete + nav */}
          <div className="mt-10 glass rounded-card p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-fg">Finished this topic?</h3>
                <p className="mt-1 text-sm text-fg-muted">Mark it done to earn 100 XP and keep your streak alive.</p>
              </div>
              <Button
                onClick={() => setTopicDone(topic.id)}
                disabled={status === 'done'}
                icon={status === 'done' ? 'check' : 'zap'}
                className="w-full sm:w-auto"
              >
                {status === 'done' ? 'Completed' : 'Mark complete · +100 XP'}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/topic/${prev.id}`}
                className="group glass flex items-center gap-3 rounded-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Icon name="arrow-right" size={18} className="rotate-180 text-fg-faint" />
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Previous</p>
                  <p className="truncate text-sm font-semibold text-fg">{prev.name}</p>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/topic/${next.id}`}
                className="group glass flex items-center justify-end gap-3 rounded-card p-4 text-right transition-all hover:-translate-y-0.5 hover:shadow-lift sm:col-start-2"
              >
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Next up</p>
                  <p className="truncate text-sm font-semibold text-fg">{next.name}</p>
                </div>
                <Icon name="arrow-right" size={18} className="text-accent transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </article>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5">
            {track && (
              <div className="glass rounded-card p-5">
                <div className="flex items-center justify-between">
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Track progress</p>
                  <Ring value={trackPct(track.id)} size={40} stroke={4} />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-fg">{track.name}</h3>
                <div className="mt-4 space-y-1">
                  {trackTopics.map((t) => {
                    const st = topicStatus(t.id);
                    const here = t.id === topic.id;
                    return (
                      <Link
                        key={t.id}
                        to={`/topic/${t.id}`}
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                          here ? 'bg-card-2 font-semibold text-fg' : 'text-fg-muted hover:bg-card-2 hover:text-fg'
                        }`}
                      >
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            st === 'done'
                              ? 'border-transparent gradient-bg text-white'
                              : st === 'in-progress'
                                ? 'border-progress'
                                : 'border-line'
                          }`}
                        >
                          {st === 'done' && <Icon name="check" size={9} strokeWidth={3} />}
                          {st === 'in-progress' && <span className="h-1.5 w-1.5 rounded-full bg-progress" />}
                        </span>
                        <span className="truncate">{t.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="glass rounded-card p-5">
              <p className="mono mb-3 text-[10px] uppercase tracking-eyebrow text-fg-faint">Resources</p>
              <ul className="space-y-2">
                {topic.resources.map((r, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-fg-muted">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-card-2 text-accent">
                      <Icon name={(resourceIcon[r.kind] ?? 'book') as any} size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-fg">{r.label}</span>
                      <span className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">{r.kind}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-4">
                <DifficultyBadge level={topic.difficulty} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
