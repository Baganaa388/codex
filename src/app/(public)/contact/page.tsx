import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Card, SectionHeading } from '@/components/UI';
import { services } from '@/lib/services';

const DEFAULT_LOCATION = {
  location_name: 'Gem Castle',
  location_address: 'СБД, 6-р хороо СУИС-ийн урд Gem Castle 15 давхарт 1501 тоот',
  latitude: 47.9184,
  longitude: 106.9177,
} as const;

const buildMapEmbedUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=16`;

async function getLocation() {
  'use cache';
  cacheTag('contests');
  cacheLife('hours');

  const contests = await services.contestService.listContests();
  if (contests.length > 0) {
    const latest = contests[0];
    if (latest.latitude && latest.longitude) {
      return {
        location_name: latest.location_name || DEFAULT_LOCATION.location_name,
        location_address: latest.location_address || DEFAULT_LOCATION.location_address,
        latitude: latest.latitude,
        longitude: latest.longitude,
      };
    }
  }
  return DEFAULT_LOCATION;
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16">
      <SectionHeading
        title="Холбоо барих"
        subtitle=""
      />

      <Suspense fallback={<ContactSkeleton />}>
        <ContactContent />
      </Suspense>
    </div>
  );
}

async function ContactContent() {
  const location = await getLocation();
  const lat = location.latitude ?? DEFAULT_LOCATION.latitude;
  const lng = location.longitude ?? DEFAULT_LOCATION.longitude;

  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 text-[#EDAF00] group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Mail хаяг</h4>
            <p className="font-bold">system@tee.education</p>
          </Card>
          <Card className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 text-[#EDAF00] group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Утас</h4>
            <p className="font-bold">77240101</p>
          </Card>
        </div>

        <Card className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-[#EDAF00] flex-shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Хаяг</h4>
            <p className="text-lg font-bold leading-relaxed">{location.location_address}</p>
            {location.location_name && (
              <p className="text-sm text-slate-500 mt-1">{location.location_name}</p>
            )}
          </div>
        </Card>

        <div className="relative h-72 rounded-3xl overflow-hidden border border-slate-900/[0.06] shadow-lg">
          <iframe
            src={buildMapEmbedUrl(lat, lng)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={location.location_name || 'Байршил'}
          />
        </div>
      </div>
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#EDAF00]" />
    </div>
  );
}
