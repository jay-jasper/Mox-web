// Prefix internal links with the site base path (e.g. "/Mox-web/" on GitHub Pages),
// so absolute links don't break on a project page. Hash and external links pass through.
const BASE = import.meta.env.BASE_URL; // always ends with "/"

export function withBase(path: string): string {
  if (path.startsWith('#') || /^https?:/.test(path) || path.startsWith('mailto:')) return path;
  return BASE + path.replace(/^\//, '');
}
