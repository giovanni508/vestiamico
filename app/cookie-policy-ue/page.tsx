import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Cookie Policy (UE)',
  description: 'Come il sito Vestiamico usa cookie e tecnologie simili, e come gestire il consenso.',
  alternates: { canonical: '/cookie-policy-ue' },
};

export default function CookiePage() {
  return (
    <>
      <LegalPage file="legal/cookie-policy.md" title="Cookie Policy" />
      <BreadcrumbJsonLd items={[{ name: 'Cookie Policy', path: '/cookie-policy-ue' }]} />
    </>
  );
}
