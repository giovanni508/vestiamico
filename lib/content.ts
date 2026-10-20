// Punto unico di accesso ai contenuti. Oggi legge i file locali in content/;
// domani può leggere la REST API di WordPress mantenendo le stesse forme (vedi README).
import home from '@/content/home.json';
import collezioni from '@/content/collezioni.json';
import cerimonia from '@/content/cerimonia.json';
import puntoVendita from '@/content/punto-vendita.json';
import brand from '@/content/brand.json';
import contatti from '@/content/contatti.json';
import reviews from '@/content/reviews.json';
import announcements from '@/content/announcements.json';
import media from '@/content/media.json';
import map from '@/content/map.json';

export { home, collezioni, cerimonia, puntoVendita, brand, contatti, reviews, announcements, map };

export type ImageAsset = { src: string; width: number; height: number; blur: string };
export type VideoAsset = { mp4: string; webm: string; poster: string; width: number; height: number };

const images = media.images as Record<string, ImageAsset & { source: string }>;
const videos = media.videos as Record<string, VideoAsset & { source: string; sizeKb: number }>;

export function img(key: string): ImageAsset {
  const asset = images[key];
  if (!asset) throw new Error(`Immagine "${key}" non trovata in content/media.json`);
  return asset;
}

export function video(key: string): VideoAsset {
  const asset = videos[key];
  if (!asset) throw new Error(`Video "${key}" non trovato in content/media.json`);
  return asset;
}

export { site, whatsappHref, nav, fullAddress, type Site } from '@/lib/site';
