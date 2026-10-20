// Orari di apertura e stato "Aperto ora", calcolati sull'ora di Roma.
import { site } from '@/lib/site';

type Slot = [string, string];
type Closure = { from: string; to: string; label?: string };

export type OpenState =
  | { kind: 'open'; until: string }
  | { kind: 'closed'; next?: string }
  | { kind: 'open-day'; note: string } // aperti oggi ma senza fascia oraria nota
  | { kind: 'holiday'; label: string };

const DAY_NAMES = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

/** Data e ora correnti a Roma, indipendentemente dal fuso del dispositivo. */
export function romeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.hours.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    weekday,
    iso: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (hhmm: string) => hhmm.replace(/^0/, '').replace(':00', '');

/** Fasce orarie del giorno (null = aperti ma orario non noto, [] = chiusi). */
export function slotsFor(d: { weekday: number; day: number; month: number }): Slot[] | null {
  const weekly = site.hours.weekly.find((w) => w.days.includes(d.weekday));
  if (weekly) return weekly.slots as Slot[];
  const seasonal = site.hours.seasonal.find((s) => s.month === d.month && s.days.includes(d.weekday));
  if (seasonal) return seasonal.slots as Slot[];
  if (d.weekday === 0 && d.day <= 7 && site.hours.firstSundayOfMonth.open) return null;
  return [];
}

export function openState(date = new Date()): OpenState {
  const now = romeNow(date);
  const closure = (site.hours.closures as Closure[]).find((c) => now.iso >= c.from && now.iso <= c.to);
  if (closure) return { kind: 'holiday', label: closure.label ?? 'Chiusi per ferie' };

  const slots = slotsFor(now);
  if (slots === null) return { kind: 'open-day', note: 'Oggi è la prima domenica del mese: siamo aperti' };
  for (const [a, b] of slots) {
    if (now.minutes >= toMin(a) && now.minutes < toMin(b)) return { kind: 'open', until: fmt(b) };
  }
  // prossima apertura: oggi più tardi, altrimenti nei prossimi 7 giorni
  const later = slots.find(([a]) => toMin(a) > now.minutes);
  if (later) return { kind: 'closed', next: `oggi alle ${fmt(later[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = new Date(date.getTime() + i * 86400000);
    const r = romeNow(d);
    const s = slotsFor(r);
    if (s === null) return { kind: 'closed', next: `${i === 1 ? 'domani' : DAY_NAMES[r.weekday]}` };
    if (s.length) return { kind: 'closed', next: `${i === 1 ? 'domani' : DAY_NAMES[r.weekday]} alle ${fmt(s[0][0])}` };
  }
  return { kind: 'closed' };
}

/** Righe leggibili per la tabella orari. */
export function hoursRows() {
  const rows = site.hours.weekly.map((w) => ({
    label: w.label,
    value: (w.slots as Slot[]).map(([a, b]) => `${fmt(a)}-${fmt(b)}`).join(' e '),
  }));
  rows.push({ label: 'Domenica', value: site.hours.firstSundayOfMonth.label.replace('Aperti ', 'aperti ') });
  for (const s of site.hours.seasonal) {
    rows.push({ label: 'Dicembre', value: `tutte le domeniche, ${(s.slots as Slot[]).map(([a, b]) => `${fmt(a)}-${fmt(b)}`).join(' e ')}` });
  }
  return rows;
}

/** Specifiche schema.org OpeningHoursSpecification (solo orari certi). */
export function openingHoursSpecification() {
  const dayIds = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return site.hours.weekly.flatMap((w) =>
    (w.slots as Slot[]).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: w.days.map((d) => `https://schema.org/${dayIds[d]}`),
      opens,
      closes,
    })),
  );
}
