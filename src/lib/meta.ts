import { useEffect } from 'react';

const ORIGIN = 'https://edufly.dev';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

/**
 * Per-route document metadata. Every page sets its own title, description,
 * canonical URL and matching OpenGraph/Twitter tags, both for the live SPA
 * and for the prerendered HTML snapshots search engines read.
 */
export function usePageMeta(opts: { title: string; description: string; path: string }) {
  const { title, description, path } = opts;
  useEffect(() => {
    const url = `${ORIGIN}${path}`;
    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setCanonical(url);
  }, [title, description, path]);
}
