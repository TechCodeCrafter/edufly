// Small helper for posting a pre-filled share intent to X (formerly Twitter).
// Kept framework-agnostic so it can be reused from any component.

const SITE_URL = 'https://edufly.dev';

export function buildXIntentUrl(text: string, url: string = SITE_URL) {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function openXShare(text: string, url: string = SITE_URL) {
  const intentUrl = buildXIntentUrl(text, url);
  window.open(intentUrl, '_blank', 'noopener,noreferrer,width=560,height=460');
}
