'use client';
// Il banner cookie non disegna nulla sul server: lo carichiamo come modulo a parte dopo l'idratazione,
// così non pesa sul JS della prima schermata.
import dynamic from 'next/dynamic';

export const CookieBannerLazy = dynamic(() => import('./CookieBanner').then((m) => m.CookieBanner), { ssr: false });
