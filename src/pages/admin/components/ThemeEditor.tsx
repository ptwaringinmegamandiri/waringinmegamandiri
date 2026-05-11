import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';

interface ThemeEditorProps {
  onChange?: () => void;
}

const PRESET_ACCENT = [
  '#3B82F6', '#2563EB', '#1D4ED8',
  '#EF4444', '#F59E0B', '#10B981',
  '#8B5CF6', '#EC4899', '#14B8A6',
];

const PRESET_SECONDARY = [
  '#93C5FD', '#60A5FA', '#F87171',
  '#FBBF24', '#34D399', '#A78BFA',
  '#F472B6', '#2DD4BF', '#FB923C',
];

const SECTIONS = [
  { key: 'hero', label: 'Hero Banner', icon: 'ri-image-line' },
  { key: 'stats', label: 'Stats Bar', icon: 'ri-bar-chart-2-line' },
  { key: 'services', label: 'Services', icon: 'ri-tools-line' },
  { key: 'projects', label: 'Featured Projects', icon: 'ri-building-2-line' },
  { key: 'clients', label: 'Clients', icon: 'ri-team-line' },
  { key: 'cta', label: 'CTA Section', icon: 'ri-megaphone-line' },
] as const;

function boolToStr(v: boolean | undefined): string {
  return v === false ? 'false' : 'true';
}

export default function ThemeEditor({ onChange }: ThemeEditorProps) {
  const { theme, sections, refresh, setTheme, setSections } = useSiteTheme();
  const { toggleTheme } = useThemeContext();
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const upsertSetting = async (key: string, value: string) => {
    const { data } = await supabase.from('site_settings').select('key').eq('key', key);
    if (data && data.length > 0) {
      await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('site_settings').insert({ key, value });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await upsertSetting('accent_color', theme.accent_color || '#3B82F6');
    await upsertSetting('secondary_color', theme.secondary_color || '#93C5FD');
    await upsertSetting('theme_mode', theme.theme_mode || 'dark');
    await upsertSetting('hero_title', theme.hero_title || '');
    await upsertSetting('hero_subtitle', theme.hero_subtitle || '');
    await upsertSetting('hero_tagline', theme.hero_tagline || '');
    await upsertSetting('hero_cta_primary_text', theme.hero_cta_primary_text || '');
    await upsertSetting('hero_cta_primary_url', theme.hero_cta_primary_url || '');
    await upsertSetting('hero_cta_secondary_text', theme.hero_cta_secondary_text || '');
    await upsertSetting('hero_cta_secondary_url', theme.hero_cta_secondary_url || '');
    await upsertSetting('hero_image_url', theme.hero_image_url || '');

    for (const s of SECTIONS) {
      await upsertSetting(s.key, boolToStr(sections[s.key]));
    }

    setSaving(false);
    showToast('Semua perubahan disimpan & website langsung update!');
    refresh();
    onChange?.();
  };

  const handleGenerateHeroImage = async (prompt: string) => {
    setGenerating(true);
    const safePrompt = encodeURIComponent(prompt);
    const seq = Date.now() + Math.floor(Math.random() * 1000);
    const imageUrl = `https://readdy.ai/api/search-image?query=$%7BsafePrompt%7D&width=1920&height=1080&seq=${seq}&orientation=landscape`;
    await upsertSetting('hero_image_url', imageUrl);
    setTheme({ ...theme, hero_image_url: imageUrl });
    setGenerating(false);
    showToast('Gambar hero baru berhasil di-generate dan langsung tersimpan!');
    onChange?.();
  };

  const updateHeroField = (field: keyof typeof theme, value: string) => {
    setTheme({ ...theme, [field]: value });
  };

  const updateSection = (key: keyof typeof sections, value: boolean) => {
    const next = { ...sections, [key]: value };
    setSections(next);
    upsertSetting(key, boolToStr(value));
    refresh();
    onChange?.();
  };

  const updateColor = (key: 'accent_color' | 'secondary_color', value: string) => {
    setTheme({ ...theme, [key]: value });
    upsertSetting(key, value);
    refresh();
    onChange?.();
    showToast(`${key === 'accent_color' ? 'Accent' : 'Secondary'} langsung berubah!`);
  };

  const handleToggleMode = (mode: 'dark' | 'light') => {
    setTheme({ ...theme, theme_mode: mode });
    upsertSetting('theme_mode', mode);
    if ((theme.theme_mode || 'dark') !== mode) {
      toggleTheme();
    }
    refresh();
    onChange?.();
    showToast(`Mode ${mode} langsung berubah!`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <i className="ri-checkbox-circle-line text-base" />{toast}
        </div>
      )}

      {/* Section Visibility */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
          <i className="ri-layout-masonry-line text-amber-400" /> Susunan Halaman
        </h3>
        <p className="text-slate-500 text-xs mb-4">Aktifkan / nonaktifkan section di homepage</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SECTIONS.map((s) => (
            <label
              key={s.key}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                sections[s.key] !== false
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-slate-700/50 bg-slate-800/30 opacity-60'
              }`}
            >
              <input
                type="checkbox"
                checked={sections[s.key] !== false}
                onChange={(e) => updateSection(s.key, e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer shrink-0"
              />
              <div className="flex items-center gap-2">
                <i className={`${s.icon} text-sm ${sections[s.key] !== false ? 'text-green-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-semibold ${sections[s.key] !== false ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
          <i className="ri-image-line text-amber-400" /> Hero Banner
        </h3>
        <p className="text-slate-500 text-xs mb-4">Ubah judul, deskripsi, gambar, dan tombol hero</p>

        <div className="space-y-4">
          {/* Hero Image preview */}
          <div className="rounded-xl overflow-hidden border border-slate-700">
            <div className="h-48 w-full bg-slate-800 flex items-center justify-center relative">
              {theme.hero_image_url ? (
                <img src={theme.hero_image_url} alt="Hero preview" className="w-full h-full object-cover object-top" />
              ) : (
                <span className="text-slate-600 text-xs">Belum ada gambar hero</span>
              )}
            </div>
            <div className="p-3 bg-slate-900 flex items-center justify-between">
              <span className="text-slate-500 text-xs truncate max-w-[70%]">{theme.hero_image_url || 'Gambar default'}</span>
              <button
                onClick={() => {
                  const prompt = window.prompt('Deskripsikan gambar hero yang mau dibuat (misal: modern construction site Jakarta, golden hour, wide angle):');
                  if (prompt) handleGenerateHeroImage(prompt);
                }}
                disabled={generating}
                className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><i className="ri-magic-line" /> Generate Gambar</>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-500 text-xs mb-1 block">Tagline Atas</label>
            <input
              type="text"
              value={theme.hero_tagline || ''}
              onChange={(e) => updateHeroField('hero_tagline', e.target.value)}
              placeholder="PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022"
              className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
            />
            <p className="text-slate-600 text-[10px] mt-1">Gunakan AI Copilot dengan perintah: "Ubah tagline hero jadi ..."</p>
          </div>

          <div>
            <label className="text-slate-500 text-xs mb-1 block">Judul (tiap baris baru = enter)</label>
            <textarea
              rows={3}
              value={theme.hero_title || ''}
              onChange={(e) => updateHeroField('hero_title', e.target.value)}
              placeholder="Baris 1\nBaris 2\nBaris 3 (warna accent)"
              className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
            />
            <p className="text-slate-600 text-[10px] mt-1">Baris terakhir otomatis pakai warna accent. Gunakan AI Copilot: "Ubah judul hero jadi ..."</p>
          </div>

          <div>
            <label className="text-slate-500 text-xs mb-1 block">Deskripsi</label>
            <textarea
              rows={3}
              value={theme.hero_subtitle || ''}
              onChange={(e) => updateHeroField('hero_subtitle', e.target.value)}
              placeholder="Deskripsi singkat company..."
              className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs mb-1 block">CTA Primary</label>
              <input
                type="text"
                value={theme.hero_cta_primary_text || ''}
                onChange={(e) => updateHeroField('hero_cta_primary_text', e.target.value)}
                placeholder="Lihat Portofolio"
                className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">CTA Secondary</label>
              <input
                type="text"
                value={theme.hero_cta_secondary_text || ''}
                onChange={(e) => updateHeroField('hero_cta_secondary_text', e.target.value)}
                placeholder="Hubungi Kami"
                className="w-full bg-[#070C17] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
          <i className="ri-palette-line text-amber-400" /> Warna
        </h3>
        <p className="text-slate-500 text-xs mb-4">Ganti warna utama website secara instan</p>

        <div className="mb-4">
          <label className="text-slate-500 text-xs mb-2 block">Accent Color (tombol, link, highlight)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_ACCENT.map((c) => (
              <button
                key={c}
                onClick={() => updateColor('accent_color', c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                  (theme.accent_color || '#3B82F6') === c ? 'border-white ring-2 ring-amber-400' : 'border-white/20'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            <div className="flex items-center gap-2 ml-2">
              <input
                type="color"
                value={theme.accent_color || '#3B82F6'}
                onChange={(e) => updateColor('accent_color', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-slate-400 text-xs">{theme.accent_color || '#3B82F6'}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-500 text-xs mb-2 block">Secondary Color (judul terakhir hero, tagline)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_SECONDARY.map((c) => (
              <button
                key={c}
                onClick={() => updateColor('secondary_color', c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                  (theme.secondary_color || '#93C5FD') === c ? 'border-white ring-2 ring-amber-400' : 'border-white/20'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            <div className="flex items-center gap-2 ml-2">
              <input
                type="color"
                value={theme.secondary_color || '#93C5FD'}
                onChange={(e) => updateColor('secondary_color', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-slate-400 text-xs">{theme.secondary_color || '#93C5FD'}</span>
            </div>
          </div>
        </div>

        {/* Theme mode toggle */}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-slate-500 text-xs">Mode:</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            <button
              onClick={() => handleToggleMode('dark')}
              className={`px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                (theme.theme_mode || 'dark') === 'dark' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <i className="ri-moon-line mr-1" /> Dark
            </button>
            <button
              onClick={() => handleToggleMode('light')}
              className={`px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                (theme.theme_mode || 'dark') === 'light' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <i className="ri-sun-line mr-1" /> Light
            </button>
          </div>
        </div>
      </div>

      {/* Save all */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-8 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <><i className="ri-save-3-line" /> Simpan Semua</>
          )}
        </button>
      </div>
    </div>
  );
}