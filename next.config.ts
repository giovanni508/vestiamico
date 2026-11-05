import type { NextConfig } from 'next';

// ID delle pagine WordPress del vecchio sito (wp-json/wp/v2/pages): servono per i link ?page_id=
const WP_PAGE_IDS: Record<string, string> = {
  '11': '/',
  '129': '/collezioni',
  '196': '/privacy-policy',
  '204': '/cookie-policy-ue',
  '234': '/punto-vendita',
  '254': '/contatti',
  '271': '/brand',
  '301': '/abiti-da-cerimonia',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // hosting condiviso (Hostinger): il numero di worker della build segue i core del server, che possono
  // essere decine con limiti stretti su processi e memoria. Due bastano per 17 pagine statiche.
  experimental: { cpus: 2 },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 85],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  async redirects() {
    return [
      // slug e alias del vecchio sito WordPress
      { source: '/home', destination: '/', statusCode: 301 },
      { source: '/cerimonia', destination: '/abiti-da-cerimonia', statusCode: 301 },
      { source: '/abiti-cerimonia', destination: '/abiti-da-cerimonia', statusCode: 301 },
      { source: '/negozio', destination: '/punto-vendita', statusCode: 301 },
      { source: '/chi-siamo', destination: '/punto-vendita', statusCode: 301 },
      { source: '/dove-siamo', destination: '/contatti', statusCode: 301 },
      { source: '/contattaci', destination: '/contatti', statusCode: 301 },
      { source: '/brands', destination: '/brand', statusCode: 301 },
      { source: '/collezione', destination: '/collezioni', statusCode: 301 },
      { source: '/collezioni/donna', destination: '/collezioni#donna', statusCode: 301 },
      { source: '/collezioni/uomo', destination: '/collezioni#uomo', statusCode: 301 },
      { source: '/privacy', destination: '/privacy-policy', statusCode: 301 },
      { source: '/cookie', destination: '/cookie-policy-ue', statusCode: 301 },
      { source: '/cookie-policy', destination: '/cookie-policy-ue', statusCode: 301 },
      // URL tecnici di WordPress
      ...Object.entries(WP_PAGE_IDS).map(([id, destination]) => ({
        source: '/',
        has: [{ type: 'query' as const, key: 'page_id', value: id }],
        destination,
        statusCode: 301,
      })),
      { source: '/feed', destination: '/', statusCode: 301 },
      { source: '/comments/feed', destination: '/', statusCode: 301 },
      { source: '/wp-login.php', destination: '/', statusCode: 302 },
      { source: '/wp-admin/:path*', destination: '/', statusCode: 302 },
    ];
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
