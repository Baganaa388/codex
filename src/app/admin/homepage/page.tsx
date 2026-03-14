import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { HomepageAdmin } from '@/components/admin/HomepageAdmin';

async function getSlides() {
  'use cache';
  cacheTag('slides');
  cacheLife('seconds');
  return services.slideRepo.findAll();
}

async function getSponsors() {
  'use cache';
  cacheTag('sponsors');
  cacheLife('seconds');
  return services.sponsorRepo.findAll();
}

export default async function HomepagePage() {
  const [slides, sponsors] = await Promise.all([getSlides(), getSponsors()]);

  return (
    <HomepageAdmin
      initialSlides={[...slides]}
      initialSponsors={[...sponsors]}
    />
  );
}
