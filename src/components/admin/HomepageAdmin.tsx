'use client';

import { useState, useRef, useCallback } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Trash2, Plus, Upload, Image, Building2, ExternalLink } from 'lucide-react';
import type { Slide } from '@/lib/repositories/slide.repository';
import type { SponsorRow } from '@/lib/repositories/sponsor.repository';

interface Props {
  readonly initialSlides: Slide[];
  readonly initialSponsors: SponsorRow[];
}

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.8;

function compressImage(file: File, maxW = MAX_WIDTH, maxH = MAX_HEIGHT): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', QUALITY));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function HomepageAdmin({ initialSlides, initialSponsors }: Props) {
  const { token } = useAdmin();
  const [slides, setSlides] = useState(initialSlides);
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [uploading, setUploading] = useState(false);
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);
  const [deletingSponsorId, setDeletingSponsorId] = useState<number | null>(null);
  const slideFileRef = useRef<HTMLInputElement>(null);
  const sponsorFileRef = useRef<HTMLInputElement>(null);

  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    description: '',
    detail: '',
    website: '',
    founded: '',
    focus: '',
    tier: 'gold' as 'gold' | 'silver' | 'bronze',
  });
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState('');

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  async function handleSlideUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ image_url: dataUrl, title: file.name, sort_order: slides.length }),
      });
      const json = await res.json();
      if (json.success) {
        setSlides(prev => [...prev, json.data]);
      }
    } finally {
      setUploading(false);
      if (slideFileRef.current) slideFileRef.current.value = '';
    }
  }

  async function handleDeleteSlide(id: number) {
    setDeletingSlideId(id);
    try {
      await fetch(`/api/slides/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlides(prev => prev.filter(s => s.id !== id));
    } finally {
      setDeletingSlideId(null);
    }
  }

  async function handleSponsorLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImage(file, 256, 256);
      setSponsorLogoUrl(dataUrl);
    } finally {
      setUploading(false);
      if (sponsorFileRef.current) sponsorFileRef.current.value = '';
    }
  }

  async function handleAddSponsor() {
    if (!sponsorForm.name || !sponsorLogoUrl) return;
    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...sponsorForm,
          logo_url: sponsorLogoUrl,
          sort_order: sponsors.length,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSponsors(prev => [...prev, json.data]);
        setSponsorForm({ name: '', description: '', detail: '', website: '', founded: '', focus: '', tier: 'gold' });
        setSponsorLogoUrl('');
        setShowSponsorForm(false);
      }
    } catch {
      // handled by UI state
    }
  }

  async function handleDeleteSponsor(id: number) {
    setDeletingSponsorId(id);
    try {
      await fetch(`/api/sponsors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSponsors(prev => prev.filter(s => s.id !== id));
    } finally {
      setDeletingSponsorId(null);
    }
  }

  const TIER_LABELS: Record<string, string> = { gold: 'Алт', silver: 'Мөнгө', bronze: 'Хүрэл' };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Нүүр хуудас</h1>
        <p className="text-sm text-slate-500 mt-1">Hero зураг болон ивээн тэтгэгчдийг удирдах</p>
      </div>

      {/* Hero Slides */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Image size={20} className="text-cyan-400" />
            Hero зургууд
          </h2>
          <label className="cursor-pointer">
            <input
              ref={slideFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSlideUpload}
              disabled={uploading}
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-colors">
              <Upload size={16} />
              {uploading ? 'Хуулж байна...' : 'Зураг нэмэх'}
            </span>
          </label>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <Image size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Hero зураг байхгүй байна</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map(slide => (
              <div
                key={slide.id}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
              >
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 truncate">{slide.title}</span>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    disabled={deletingSlideId === slide.id}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sponsors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 size={20} className="text-cyan-400" />
            Ивээн тэтгэгчид
          </h2>
          <button
            onClick={() => setShowSponsorForm(!showSponsorForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-colors"
          >
            <Plus size={16} />
            Тэтгэгч нэмэх
          </button>
        </div>

        {showSponsorForm && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Нэр *</label>
                <input
                  value={sponsorForm.name}
                  onChange={e => setSponsorForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Байгууллагын нэр"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Вэбсайт</label>
                <input
                  value={sponsorForm.website}
                  onChange={e => setSponsorForm(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="https://example.mn"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Үүсгэсэн он</label>
                <input
                  value={sponsorForm.founded}
                  onChange={e => setSponsorForm(prev => ({ ...prev, founded: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Чиглэл</label>
                <input
                  value={sponsorForm.focus}
                  onChange={e => setSponsorForm(prev => ({ ...prev, focus: e.target.value }))}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Технологи, боловсрол"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Зэрэг</label>
                <select
                  value={sponsorForm.tier}
                  onChange={e => setSponsorForm(prev => ({ ...prev, tier: e.target.value as 'gold' | 'silver' | 'bronze' }))}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="gold">Алт</option>
                  <option value="silver">Мөнгө</option>
                  <option value="bronze">Хүрэл</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Лого *</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      ref={sponsorFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSponsorLogoSelect}
                      disabled={uploading}
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-slate-400 hover:border-cyan-500/50 transition-colors cursor-pointer">
                      <Upload size={14} />
                      {uploading ? 'Хуулж байна...' : 'Лого сонгох'}
                    </span>
                  </label>
                  {sponsorLogoUrl && (
                    <img src={sponsorLogoUrl} alt="Logo preview" className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Товч тайлбар</label>
              <input
                value={sponsorForm.description}
                onChange={e => setSponsorForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none"
                placeholder="Нэг мөр тайлбар"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Дэлгэрэнгүй</label>
              <textarea
                value={sponsorForm.detail}
                onChange={e => setSponsorForm(prev => ({ ...prev, detail: e.target.value }))}
                rows={3}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none resize-none"
                placeholder="Дэлгэрэнгүй мэдээлэл"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddSponsor}
                disabled={!sponsorForm.name || !sponsorLogoUrl}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-bold hover:bg-cyan-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Нэмэх
              </button>
              <button
                onClick={() => setShowSponsorForm(false)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] text-slate-400 text-sm font-bold hover:bg-white/[0.1] transition-colors"
              >
                Болих
              </button>
            </div>
          </div>
        )}

        {sponsors.length === 0 && !showSponsorForm ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <Building2 size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Ивээн тэтгэгч байхгүй байна</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sponsors.map(sponsor => (
              <div
                key={sponsor.id}
                className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 hover:border-white/[0.15] transition-colors"
              >
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{sponsor.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      sponsor.tier === 'gold' ? 'bg-amber-500/10 text-amber-400' :
                      sponsor.tier === 'silver' ? 'bg-slate-400/10 text-slate-300' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      {TIER_LABELS[sponsor.tier] ?? sponsor.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{sponsor.description}</p>
                </div>
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleDeleteSponsor(sponsor.id)}
                  disabled={deletingSponsorId === sponsor.id}
                  className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
