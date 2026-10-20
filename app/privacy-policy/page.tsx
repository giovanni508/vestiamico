import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali del sito Vestiamico (Ingromoda s.r.l.), ai sensi degli artt. 13 e 14 del GDPR.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPage() {
  return (
    <>
      <LegalPage file="legal/privacy-policy.md" title="Privacy Policy" />
      <BreadcrumbJsonLd items={[{ name: 'Privacy Policy', path: '/privacy-policy' }]} />
    </>
  );
}
