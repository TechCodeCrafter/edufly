// Bundled by scripts/postbuild.mjs (via esbuild) to enumerate every real
// route on the site from the actual content data. Single source of truth for
// the sitemap and the prerenderer.
import { allTopics } from '../src/data/tracks';
import { projects } from '../src/data/projects';
import { comparisons } from '../src/data/comparisons';
import { questionCategories } from '../src/data/questions';

const staticRoutes = ['/', '/projects', '/interview', '/compare', '/leaderboard'];

// Indexable routes: everything a search engine should crawl.
export const sitemapRoutes: string[] = [
  ...staticRoutes,
  ...questionCategories.map((c) => `/interview/${c.slug}`),
  ...allTopics.map((t) => `/topic/${t.id}`),
  ...projects.map((p) => `/project/${p.id}`),
  ...comparisons.map((c) => `/compare/${c.id}`),
];

// Prerendered routes: sitemap routes plus per-user pages that still deserve
// a fast, non-blank first paint.
export const prerenderRoutes: string[] = [...sitemapRoutes, '/dashboard'];
