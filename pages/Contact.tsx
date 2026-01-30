import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, SectionHeading } from '../components/UI';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16">
      <SectionHeading
        title="Холбоо барих"
        subtitle="Холбоо барих хэсэгт таны санал, сэтгэгдэл, асуулт бүхий хүсэлтийг илгээж болно."
      />

      <div className="grid grid-cols-1 gap-12">
        {/* Contact Info */}
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Mail хаяг</h4>
              <p className="font-bold">system@tee.education</p>
            </Card>
            <Card className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Утас</h4>
              <p className="font-bold">80582004</p>
            </Card>
          </div>

          <Card className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-yellow-500 flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">Хаяг</h4>
              <p className="text-lg font-bold leading-relaxed">
                СБД, 6-р хороо СУИC-uйн уpg Gem Castle 15 gaвxaρm 1501 moom
              </p>
            </div>
          </Card>

          {/* Map Placeholder */}
          <div className="relative h-64 rounded-3xl overflow-hidden glass border border-white/10 group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-8 h-8 bg-cyan-500 rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center relative">
                  <MapPin size={16} className="text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-lg text-xs font-bold text-slate-400">
              UB City Center
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
