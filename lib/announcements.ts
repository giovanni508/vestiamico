import { announcements } from '@/lib/content';
import { romeNow } from '@/lib/hours';

export type Announcement = { id: string; text: string; start: string; end: string; tone: string; href?: string };

/** Avvisi attivi oggi (ora di Roma). Gli avvisi scaduti spariscono da soli. */
export function activeAnnouncements(date = new Date()): Announcement[] {
  const today = romeNow(date).iso;
  return (announcements.items as Announcement[]).filter((a) => today >= a.start && today <= a.end);
}
