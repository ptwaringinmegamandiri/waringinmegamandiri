import { useState } from 'react';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { supabase } from '@/lib/supabase';

interface Preset {
  name: string;
  icon: string;
  description: string;
  theme: Record<string, string>;
  sections: Record<string, boolean>;
}

const PRESETS: Preset[] = [
  {
    name: 'Default Dark',
    icon: 'ri-moon-line',
    description: 'Tema gelap profesional dengan aksen biru',
    theme: {
      accent_color: '#3B82F6',
      secondary_color: '#93C5FD',
      theme_mode: 'dark',
      hero_title: 'Kontraktor Gedung\nTerpercaya\nSkala Nasional',
      hero_subtitle:
        'PT Waringin Mega Mandiri adalah anak perusahaan yang tergabung dalam Waringin Group dan telah membangun ruko, pabrik, gudang, hotel, apartemen, restoran, sekolah, kantor, bangunan bertingkat, rumah tinggal hingga kawasan industri.',
      hero_tagline: 'PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022',
      hero_cta_primary_text: 'Lihat Portofolio',
      hero_cta_secondary_text: 'Hubungi Kami',
    },
    sections: { hero: true, stats: true, services: true, projects: true, clients: true, cta: true },
  },
  {
    name: 'Clean Light',
    icon: 'ri-sun-line',
    description: 'Tema terang modern dengan aksen biru tua',
    theme: {
      accent_color: '#2563EB',
      secondary_color: '#3B82F6',
      theme_mode: 'light',
      hero_title: 'Kontraktor Gedung\nTerpercaya\nSkala Nasional',
      hero_subtitle:
        'PT Waringin Mega Mandiri adalah anak perusahaan yang tergabung dalam Waringin Group dan telah membangun ruko, pabrik, gudang, hotel, apartemen, restoran, sekolah, kantor, bangunan bertingkat, rumah tinggal hingga kawasan industri.',
      hero_tagline: 'PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022',
      hero_cta_primary_text: 'Lihat Portofolio',
      hero_cta_secondary_text: 'Hubungi Kami',
    },
    sections: { hero: true, stats: true, services: true, projects: true, clients: true, cta: true },
  },
  {
    name: 'Bold Minimal',
    icon: 'ri-layout-masonry-line',
    description: 'Fokus pada proyek, sembunyikan clients & stats',
    theme: {
      accent_color: '#1D4ED8',
      secondary_color: '#60A5FA',
      theme_mode: 'light',
      hero_title: 'Membangun Masa Depan\nIndonesia\nBersama Anda',
      hero_subtitle:
        'General Contractor profesional dengan pengalaman 35+ tahun di bidang konstruksi gedung komersial, hunian, dan fasilitas publik.',
      hero_tagline: 'SOLUSI KONSTRUKSI TERPERCAYA',
      hero_cta_primary_text: 'Jelajahi Proyek',
      hero_cta_secondary_text: 'Konsultasi Gratis',
    },
    sections: { hero: true, stats: false, services: true, projects: true, clients: false, cta: true },
  },
  {
    name: 'Corporate Dark',
    icon: 'ri-briefcase-line',
    description: 'Tema korporat gelap, fokus pada keahlian & mitra',
    theme: {
      accent_color: '#0ea5e9',
      secondary_color: '#38bdf8',
      theme_mode: 'dark',
      hero_title: 'Solusi Konstruksi\nKorporat\nBerkelas Dunia',
      hero_subtitle:
        'Mitra terpercaya untuk proyek konstruksi skala besar dengan standar internasional ISO 9001:2015 dan sertifikasi LPJK.',
      hero_tagline: 'ISO 9001:2015 CERTIFIED · LPJK REGISTERED',
      hero_cta_primary_text: 'Portofolio Kami',
      hero_cta_secondary_text: 'Ajukan Penawaran',
    },
    sections: { hero: true, stats: true, services: true, projects: false, clients: true, cta: true },
  },
  {
    name: 'Landing Page',
    icon: 'ri-rocket-line',
    description: 'Minimalis: hero + CTA saja, ideal untuk campaign',
    theme: {
      accent_color: '#F59E0B',
      secondary_color: '#FBBF24',
      theme_mode: 'dark',
      hero_title: 'Bangun Impian Anda\nBersama Kami\nSekarang',
      hero_subtitle:
        'Konsultasi gratis untuk proyek konstruksi Anda. Tim ahli siap membantu dari perencanaan hingga serah terima.',
      hero_tagline: 'PROMO AKHIR TAHUN · KONSULTASI GRATIS',
      hero_cta_primary_text: 'Hubungi Sekarang',
      hero_cta_secondary_text: 'Lihat Detail',
    },
    sections: { hero: true, stats: false, services: false, projects: false, clients: false, cta: true },
  },
  {
    name: 'Showcase Full',
    icon: 'ri-gallery-line',
    description: 'Tampilkan SEMUA section untuk company profile lengkap',
    theme: {
      accent_color: '#10B981',
      secondary_color: '#34D399',
      theme_mode: 'light',
      hero_title: 'General Contractor\nTerbaik\nIndonesia',
      hero_subtitle:
        'Dengan 200+ proyek selesai dan 98% tingkat kepuasan klien, kami adalah pilihan tepat untuk proyek konstruksi Anda.',
      hero_tagline: '200+ PROYEK · 98% KEPUASAN · ISO CERTIFIED',
      hero_cta_primary_text: 'Lihat Semua Proyek',
      hero_cta_secondary_text: 'Ajukan Penawaran',
    },
    sections: { hero: true, stats: true, services: true, projects: true, clients: true, cta: true },
  },
];

export default function TemplatePresets() {
  const { setTheme, setSections, refresh } = useSiteTheme();
  const [applying, setApplying] = useState<string | null>(null);

  const upsert = async (key: string, value: string) => {
    const { data } = await supabase.from('site_settings').select('key').eq('key', key);
    if (data && data.length > 0) {
      await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('site_settings').insert({ key, value });
    }
  };

  const applyPreset = async (preset: Preset) => {
    setApplying(preset.name);
    const t = preset.theme;
    for (const [key, value] of Object.entries(t)) {
      await upsert(key, value);
    }
    const s = preset.sections;
    for (const [key, value] of Object.entries(s)) {
      await upsert(key, value ? 'true' : 'false');
    }
    setTheme(t as any);
    setSections(s as any);
    refresh();
    setTimeout(() => setApplying(null), 800);
  };

  return (
    <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
      <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
        <i className="ri-layout-4-line text-amber-400" /> Template Layout
      </h3>
      <p className="text-slate-500 text-xs mb-4">
        Pilih preset tema & layout siap pakai. Klik untuk langsung menerapkan ke website.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            disabled={applying === preset.name}
            className="text-left p-4 rounded-xl border border-slate-700/50 bg-gradient-to-br from-[#0D1628] to-[#0B1424] hover:border-amber-400/40 transition-all duration-300 cursor-pointer group disabled:opacity-60"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 group-hover:bg-amber-400/20 transition-colors">
                <i className={`${preset.icon} text-sm text-amber-400`} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white group-hover:text-amber-400 transition-colors">
                  {preset.name}
                </h4>
              </div>
              {applying === preset.name && (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin ml-auto shrink-0" />
              )}
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">{preset.description}</p>
            <div className="flex flex-wrap gap-1 mt-2.5">
              {Object.entries(preset.sections)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium uppercase">
                    {k}
                  </span>
                ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
