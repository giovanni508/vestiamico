import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { home, site } from '@/lib/content';
import { INTRO_SCRIPT } from '@/lib/intro';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { TransitionProvider } from '@/components/motion/PageTransition';
import { Cursor } from '@/components/motion/Cursor';
import { Preloader } from '@/components/layout/Preloader';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { WhatsAppSticky } from '@/components/layout/WhatsAppSticky';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { StoreJsonLd } from '@/components/seo/JsonLd';

// Font self-hosted e ridotti ai soli caratteri del sito (scripts/subset-fonts.mjs, licenza SIL OFL):
// Bodoni Moda (asse ottico, peso 500) per i titoli, come il wordmark Didone del logo; Archivo per il testo.
// Il corsivo non è precaricato: si attiva dopo il load (classe fonts-late, vedi lib/intro.ts).
const bodoni = localFont({
  src: [{ path: './fonts/bodoni-moda.woff2', weight: '500', style: 'normal' }],
  variable: '--font-bodoni',
  display: 'swap',
  fallback: ['Didot', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});
const bodoniItalic = localFont({
  src: [{ path: './fonts/bodoni-moda-italic.woff2', weight: '500', style: 'italic' }],
  variable: '--font-bodoni-italic',
  display: 'swap',
  preload: false,
  fallback: ['Didot', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});
const archivo = localFont({
  src: [{ path: './fonts/archivo.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-archivo',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

// gli avvisi a scadenza e l'anno nel footer si aggiornano almeno ogni ora
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: home.meta.title, template: '%s | Vestiamico Palermo' },
  description: home.meta.description,
  applicationName: 'Vestiamico',
  authors: [{ name: site.legalName }],
  keywords: ['abbigliamento Palermo', 'abbigliamento uomo donna Palermo', 'abiti da cerimonia Palermo', 'boutique Palermo', 'taglie comode Palermo', 'Vestiamico'],
  alternates: { canonical: '/' },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: site.url,
    siteName: 'Vestiamico',
    title: home.meta.title,
    description: home.meta.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Vestiamico, boutique di abbigliamento uomo e donna a Palermo dal 1960' }],
  },
  twitter: { card: 'summary_large_image', title: home.meta.title, description: home.meta.description, images: ['/og.jpg'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0d1730',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bodoni.variable} ${bodoniItalic.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <a href="#contenuto" className="skip-link">
          Vai al contenuto
        </a>
        <Preloader />
        <TransitionProvider>
          <SmoothScroll />
          <Header>
            <AnnouncementBar />
          </Header>
          <main id="contenuto" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppSticky />
          <CookieBanner />
          <Cursor />
        </TransitionProvider>
        <StoreJsonLd />
      </body>
    </html>
  );
}
