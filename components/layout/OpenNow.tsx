'use client';
// Indicatore "Aperto ora / Chiuso", calcolato sull'ora di Roma e aggiornato ogni minuto.
// Lato server non si conosce l'ora del visitatore: lo spazio è riservato per evitare spostamenti.
import { useSyncExternalStore } from 'react';
import { openState, type OpenState } from '@/lib/hours';

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}
let cache: { minute: number; state: OpenState } | null = null;
function snapshot(): OpenState {
  const minute = Math.floor(Date.now() / 60_000);
  if (!cache || cache.minute !== minute) cache = { minute, state: openState() };
  return cache.state;
}

export function OpenNow({ className = '' }: { className?: string }) {
  const state = useSyncExternalStore(subscribe, snapshot, () => null);

  let text = '';
  let open = false;
  if (state) {
    if (state.kind === 'open') {
      open = true;
      text = `Aperto ora, fino alle ${state.until}`;
    } else if (state.kind === 'open-day') {
      open = true;
      text = state.note;
    } else if (state.kind === 'holiday') {
      text = state.label;
    } else {
      text = state.next ? `Chiuso ora, riapriamo ${state.next}` : 'Chiuso ora';
    }
  }

  return (
    <p className={`open-now ${className}`} data-open={state ? String(open) : undefined} aria-live="polite">
      <span className="open-now-mark" aria-hidden="true" />
      <span>{text || ' '}</span>
    </p>
  );
}
