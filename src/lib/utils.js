export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getReadTime(content) {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export const CATEGORY_META = {
  'venue-marketing':    { label: 'Venue Marketing',     color: '#3B82F6' },
  'platform-comparison':{ label: 'Platform Comparison', color: '#EF4444' },
  'operator-insights':  { label: 'Operator Insights',   color: '#10B981' },
  'off-peak':           { label: 'Off-Peak Strategy',   color: '#8B5CF6' },
  'local-seo':          { label: 'Local Discovery',     color: '#E57B3C' },
};
