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
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 85],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  async redirects() {
    return [
      // slug e alias del vecchio sito WordPress
      { source: '/home', destination: '/', permanent: true },
      { source: '/cerimonia', destination: '/abiti-da-cerimonia', permanent: true },
      { source: '/abiti-cerimonia', destination: '/abiti-da-cerimonia', permanent: true },
      { source: '/negozio', destination: '/punto-vendita', permanent: true },
      { source: '/chi-siamo', destination: '/punto-vendita', permanent: true },
      { source: '/dove-siamo', destination: '/contatti', permanent: true },
      { source: '/contattaci', destination: '/contatti', permanent: true },
      { source: '/brands', destination: '/brand', permanent: true },
      { source: '/collezione', destination: '/collezioni', permanent: true },
      { source: '/collezioni/donna', destination: '/collezioni#donna', permanent: true },
      { source: '/collezioni/uomo', destination: '/collezioni#uomo', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/cookie', destination: '/cookie-policy-ue', permanent: true },
      { source: '/cookie-policy', destination: '/cookie-policy-ue', permanent: true },
      // URL tecnici di WordPress
      ...Object.entries(WP_PAGE_IDS).map(([id, destination]) => ({
        source: '/',
        has: [{ type: 'query' as const, key: 'page_id', value: id }],
        destination,
        permanent: true,
      })),
      { source: '/feed', destination: '/', permanent: true },
      { source: '/comments/feed', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: false },
      { source: '/wp-admin/:path*', destination: '/', permanent: false },
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
