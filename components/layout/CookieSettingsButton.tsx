'use client';
import { COOKIE_OPEN_EVENT } from './cookie-events';

/** Pulsante del footer per riaprire le preferenze cookie. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(COOKIE_OPEN_EVENT))}>
      Gestisci cookie
    </button>
  );
}
