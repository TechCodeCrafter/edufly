import { Link } from 'react-router-dom';
import { Button, EyebrowPill } from '../components/ui';
import { Icon } from '../components/Icon';
import { usePageMeta } from '../lib/meta';

export default function NotFound() {
  usePageMeta({
    title: 'Page not found | Edufly',
    description:
      'That page does not exist. Head back to the DevOps roadmap.',
    path: '/',
  });
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 hero-glow" />
      <div className="relative mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
        <div className="flex justify-center">
          <EyebrowPill dot>Error 404</EyebrowPill>
        </div>
        <h1 className="mt-6 hero-title text-fg">
          <span className="gradient-text">Off</span> the path
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-fg-muted">
          This route does not exist on the roadmap. Head back to the start and pick up where you left off.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button size="lg" icon="compass">Back to roadmap</Button>
          </Link>
          <Link to="/interview">
            <Button size="lg" variant="light" icon="book">Interview guide</Button>
          </Link>
        </div>
        <div className="mt-10 inline-flex items-center gap-2 text-sm text-fg-faint">
          <Icon name="terminal" size={16} />
          <span className="mono">cd ~/devops-roadmap</span>
        </div>
      </div>
    </section>
  );
}
