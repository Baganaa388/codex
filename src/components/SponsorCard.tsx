'use client';

import { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

export interface Sponsor {
  readonly logo: string;
  readonly name: string;
  readonly desc: string;
  readonly detail: string;
  readonly website: string;
  readonly founded: string;
  readonly focus: string;
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.12)] cursor-pointer transition-all duration-300 hover:shadow-[0_24px_50px_rgba(15,23,42,0.16)] hover:border-[#EDAF00]/30"
    >
      <div className="flex items-center justify-between">
        <div className="h-16 w-16 rounded-2xl bg-[#EDAF00] flex items-center justify-center">
          <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="h-8 w-8 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-[#866300]">
            АЛТ
          </span>
          <ChevronRight
            size={18}
            className={`text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </div>
      <h4 className="mt-6 text-2xl font-bold text-slate-900">{sponsor.name}</h4>
      <p className="mt-2 text-slate-600">{sponsor.desc}</p>

      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: expanded ? '300px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">{sponsor.detail}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-[#E5E7EB]">
              Үүсгэсэн: {sponsor.founded}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-[#E5E7EB]">
              {sponsor.focus}
            </span>
          </div>
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#866300] hover:text-[#EDAF00] transition-colors"
          >
            Вэбсайт үзэх <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {!expanded && <div className="mt-6 h-px w-full bg-[#E5E7EB]" />}
    </div>
  );
}
