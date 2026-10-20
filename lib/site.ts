// Dati leggeri del negozio, sicuri da importare nei componenti client
// (non trascinano nel bundle i contenuti delle pagine né il manifest dei media).
import site from '@/content/site.json';

export { site };
export type Site = typeof site;

export function whatsappHref(message: string = site.whatsapp.defaultMessage): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/collezioni', label: 'Collezioni' },
  { href: '/abiti-da-cerimonia', label: 'Cerimonia' },
  { href: '/punto-vendita', label: 'Punto vendita' },
  { href: '/brand', label: 'Brand' },
  { href: '/contatti', label: 'Contatti' },
] as const;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
