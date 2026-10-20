import { activeAnnouncements } from '@/lib/announcements';
import { TLink } from '@/components/motion/PageTransition';

/** Avvisi temporanei con data di inizio e fine (content/announcements.json): scaduti, spariscono da soli. */
export function AnnouncementBar() {
  const items = activeAnnouncements();
  if (!items.length) return null;
  const a = items[0];
  return (
    <div className="announcement" data-tone={a.tone} role="status">
      <p className="wrap t-small">
        {a.href ? (
          <TLink href={a.href} className="underline decoration-dotted underline-offset-4">
            {a.text}
          </TLink>
        ) : (
          a.text
        )}
      </p>
    </div>
  );
}
