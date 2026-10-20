import { site, fullAddress } from '@/lib/content';
import { openingHoursSpecification } from '@/lib/hours';

/** Dati strutturati ClothingStore (LocalBusiness) con indirizzo, telefoni e orari certi. */
export function StoreJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${site.url}/#negozio`,
    name: site.name,
    legalName: site.legalName,
    vatID: `IT${site.vat}`,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/logo-oro.png`,
    image: [`${site.url}/og.jpg`, `${site.url}/media/img/mg-1800.jpg`],
    telephone: site.phones[0].href.replace('tel:', ''),
    email: site.email,
    foundingDate: String(site.since),
    paymentAccepted: 'Klarna',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.address.geo.lat, longitude: site.address.geo.lng },
    hasMap: site.address.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    contactPoint: site.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.href.replace('tel:', ''),
      contactType: 'customer service',
      areaServed: 'IT',
      availableLanguage: ['Italian'],
    })),
    sameAs: site.social.map((s) => s.href),
    areaServed: ['Palermo', 'Sicilia', 'Europa'],
    slogan: 'Dalle passerelle al tuo armadio',
    keywords: `abbigliamento uomo donna Palermo, abiti da cerimonia Palermo, ${fullAddress}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path === '/' ? '' : it.path}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
