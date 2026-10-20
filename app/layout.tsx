import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Archivo } from 'next/font/google';
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

// Font self-hosted (next/font scarica e serve i file dal dominio del sito)
const bodoni = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-bodoni',
  display: 'swap',
  fallback: ['Didot', 'Georgia', 'serif'],
});
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
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
    <html lang="it" className={`${bodoni.variable} ${archivo.variable}`} suppressHydrationWarning>
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
