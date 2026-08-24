import { useMemo, useState } from 'react';
import { projects } from '../data/projects';
import { useProgress } from '../store/progress';
import { Chip, Button, EyebrowPill, Glass } from '../components/ui';
import { Icon } from '../components/Icon';
import { ProjectCard } from '../components/cards';
import { DarkHeader } from '../components/DarkHeader';
import type { Difficulty } from '../data/types';
import { usePageMeta } from '../lib/meta';

const ALL = 'All';
const difficulties: (Difficulty | typeof ALL)[] = [ALL, 'beginner', 'intermediate', 'advanced'];

const diffDot: Record<Difficulty, string> = {
  beginner: 'bg-diff-beginner',
  intermediate: 'bg-diff-intermediate',
  advanced: 'bg-diff-advanced',
};

export default function Projects() {
  usePageMeta({
    title: 'Hands-on DevOps projects | Edufly',
    description:
      '22 real DevOps projects with step-by-step briefs, from a hardened home server to a full platform engineering capstone.',
    path: '/projects',
  });
  const { projectsDone, projectsTotal } = useProgress();
  const [area, setArea] = useState<string>(ALL);
  const [diff, setDiff] = useState<Difficulty | typeof ALL>(ALL);

  const areas = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.area] = (counts[p.area] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = projects.filter(
    (p) => (area === ALL || p.area === area) && (diff === ALL || p.difficulty === diff)
  );

  return (
    <>
      <DarkHeader>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <EyebrowPill dot>Hands-on practice</EyebrowPill>
            <h1 className="mt-4 hero-title text-fg">
              Build <span className="gradient-text">22 real projects</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
              Reading is not enough. Each project mirrors a task you would actually own on the job, from a first
              CI/CD pipeline to a full GitOps cluster. Ship them, then put them in your portfolio.
            </p>
          </div>
          <Glass className="flex items-center gap-5 px-6 py-5">
            <div>
              <p className="font-display text-3xl font-bold text-fg">
                {projectsDone}
                <span className="text-fg-faint">/{projectsTotal}</span>
              </p>
              <p className="mt-0.5 text-xs text-fg-muted">Shipped</p>
            </div>
            <span className="h-12 w-px bg-line" />
            <div>
              <p className="font-display text-3xl font-bold text-fg">{projectsTotal * 250}</p>
              <p className="mt-0.5 text-xs text-fg-muted">XP on offer</p>
            </div>
          </Glass>
        </div>
      </DarkHeader>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        {/* Category chips */}
        <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={area === ALL} count={projects.length} onClick={() => setArea(ALL)}>
            All areas
          </Chip>
          {areas.map(([name, count]) => (
            <Chip key={name} active={area === name} count={count} onClick={() => setArea(name)}>
              {name}
            </Chip>
          ))}
        </div>

        {/* Difficulty filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="mono mr-1 text-[10px] uppercase tracking-eyebrow text-fg-faint">Difficulty</span>
          {difficulties.map((d) => (
            <Chip
              key={d}
              active={diff === d}
              onClick={() => setDiff(d)}
              dotColor={d === ALL ? undefined : diffDot[d as Difficulty]}
            >
              <span className="capitalize">{d === ALL ? 'Any' : d}</span>
            </Chip>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid place-items-center rounded-card border border-dashed border-line bg-card-2/40 py-20 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-card-2 text-fg-faint">
              <Icon name="box" size={26} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-fg">No projects match those filters</h3>
            <p className="mt-1 max-w-sm text-sm text-fg-muted">
              Try a different area or difficulty to find your next build.
            </p>
            <Button
              variant="light"
              icon="x"
              className="mt-5"
              onClick={() => {
                setArea(ALL);
                setDiff(ALL);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
