import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import { tracks } from '../data/tracks';
import { useProgress } from '../store/progress';
import { Button, Ring } from '../components/ui';
import { Icon } from '../components/Icon';
import { DarkHeader } from '../components/DarkHeader';

const diffPill: Record<string, string> = {
  beginner: 'text-diff-beginner bg-diff-beginner/10',
  intermediate: 'text-diff-intermediate bg-diff-intermediate/10',
  advanced: 'text-diff-advanced bg-diff-advanced/10',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const { projectPct, projectStepDone, toggleProjectStep } = useProgress();

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-fg">Project not found</h1>
        <p className="mt-2 text-fg-muted">That project is not in the catalog.</p>
        <Link to="/projects" className="mt-6 inline-block">
          <Button icon="box">Browse projects</Button>
        </Link>
      </div>
    );
  }

  const pct = projectPct(project.id);
  const complete = pct === 100;
  const doneCount = project.steps.filter((_, i) => projectStepDone(project.id, i)).length;
  const track = tracks.find((t) => t.id === project.trackId);

  return (
    <>
      <DarkHeader>
        <nav className="mb-6 flex items-center gap-2 text-sm text-white/45">
          <Link to="/projects" className="transition-colors hover:text-white/80">Projects</Link>
          <Icon name="chevron-right" size={14} />
          <span className="text-white/70">{project.area}</span>
        </nav>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-bg text-white shadow-glow-sm">
                <Icon name={project.icon as any} size={24} />
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${diffPill[project.difficulty]}`}>
                {project.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/55">
                <Icon name="clock" size={15} /> {project.time}
              </span>
            </div>
            <h1 className="font-display text-[clamp(1.9rem,1rem+3vw,3rem)] font-bold leading-[1.08] tracking-tight2 text-white">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55">{project.blurb}</p>
          </div>
          <div className="shrink-0 rounded-card border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-sm">
            <Ring value={pct} size={88} stroke={7} labelClassName="text-white" trackClassName="text-white/15" />
            <p className="mt-3 text-sm text-white/55">
              {doneCount} of {project.steps.length} steps
            </p>
          </div>
        </div>
      </DarkHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px] lg:py-16">
        <div className="min-w-0">
          {/* Outcomes */}
          <section>
            <p className="mono mb-4 text-xs uppercase tracking-eyebrow text-progress">What you will end up with</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {project.outcomes.map((o, i) => (
                <div key={i} className="rounded-card border border-line bg-card p-4 shadow-card">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-card-2 text-progress">
                    <Icon name="sparkle" size={18} />
                  </span>
                  <p className="mt-3 text-sm font-medium leading-snug text-fg">{o}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Build steps */}
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="mono text-xs uppercase tracking-eyebrow text-progress">Build steps</p>
              <span className="mono text-xs text-fg-faint">{doneCount}/{project.steps.length}</span>
            </div>
            <div className="overflow-hidden rounded-card border border-line bg-card shadow-card">
              {project.steps.map((step, i) => {
                const done = projectStepDone(project.id, i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleProjectStep(project.id, i)}
                    className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-card-2 ${
                      i > 0 ? 'border-t border-line' : ''
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all ${
                        done ? 'border-transparent gradient-bg text-white' : 'border-line text-transparent'
                      }`}
                    >
                      {done && <Icon name="check" size={14} strokeWidth={3} />}
                    </span>
                    <span className="mono text-xs text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`flex-1 text-[15px] transition-colors ${
                        done ? 'text-fg-muted line-through decoration-fg-faint/40' : 'font-medium text-fg'
                      }`}
                    >
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Prerequisites */}
          <section className="mt-10">
            <p className="mono mb-3 text-xs uppercase tracking-eyebrow text-progress">Before you start</p>
            <div className="flex flex-wrap gap-2.5">
              {project.prerequisites.map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-card px-3 py-1.5 text-sm text-fg-muted"
                >
                  <Icon name="circle" size={12} className="text-progress" />
                  {p}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5">
            <div
              className={`rounded-card border p-6 text-center shadow-card transition-colors ${
                complete ? 'border-done/40 bg-done/[0.04]' : 'border-line bg-card'
              }`}
            >
              {complete ? (
                <>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-bg text-white shadow-glow animate-fade-up">
                    <Icon name="trophy" size={30} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-fg">Project shipped</h3>
                  <p className="mt-1 text-sm text-fg-muted">You earned 250 XP. Add this to your portfolio.</p>
                </>
              ) : (
                <>
                  <Ring value={pct} size={76} stroke={6} className="mx-auto" />
                  <h3 className="mt-4 font-display text-base font-semibold text-fg">Keep building</h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    Finish all {project.steps.length} steps to ship this project and earn 250 XP.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-card border border-line bg-card p-5 shadow-card">
              <p className="mono mb-3 text-[10px] uppercase tracking-eyebrow text-fg-faint">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s, i) => (
                  <span
                    key={i}
                    className="mono rounded-chip bg-card-2 px-2.5 py-1.5 text-xs font-medium text-fg-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {track && (
              <Link
                to="/"
                className="group flex items-center gap-3 rounded-card border border-line bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-bg text-white">
                  <Icon name={track.icon as any} size={19} />
                </span>
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-eyebrow text-fg-faint">Related track</p>
                  <p className="truncate text-sm font-semibold text-fg">{track.name}</p>
                </div>
                <Icon name="arrow-right" size={16} className="ml-auto text-fg-faint transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
