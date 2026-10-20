import type { Metadata } from 'next';
import { home } from '@/lib/content';
import { Hero } from '@/components/home/Hero';
import { Since } from '@/components/home/Since';
import { Split } from '@/components/home/Split';
import { Sizes } from '@/components/home/Sizes';
import { Ceremony } from '@/components/home/Ceremony';
import { Brands } from '@/components/home/Brands';
import { Reviews } from '@/components/home/Reviews';
import { Visit } from '@/components/home/Visit';

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Since />
      <Split />
      <Sizes />
      <Ceremony />
      <Brands />
      <Reviews />
      <Visit />
    </>
  );
}
