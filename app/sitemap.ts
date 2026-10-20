import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/collezioni', priority: 0.9, freq: 'weekly' },
    { path: '/abiti-da-cerimonia', priority: 0.9, freq: 'monthly' },
    { path: '/punto-vendita', priority: 0.8, freq: 'monthly' },
    { path: '/brand', priority: 0.7, freq: 'monthly' },
    { path: '/contatti', priority: 0.8, freq: 'monthly' },
    { path: '/privacy-policy', priority: 0.2, freq: 'yearly' },
    { path: '/cookie-policy-ue', priority: 0.2, freq: 'yearly' },
  ];
  return pages.map((p) => ({ url: `${site.url}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority }));
}
