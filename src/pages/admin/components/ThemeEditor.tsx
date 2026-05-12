import { useState, useRef, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useSiteTheme } from '@/context/SiteThemeContext';

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

const PAGE_BGS = [
  { key: 'about_bg_url' as const, label: 'About / Tentang Kami', defaultPrompt: 'dark moody construction site at dusk with massive concrete building skeleton under construction, tower crane silhouette against stormy dark charcoal sky, warm amber industrial floodlights, cinematic wide angle' },
  { key: 'karir_bg_url' as const, label: 'Karir / Careers', defaultPrompt: 'dark cinematic construction workers team meeting on site, engineers in hard hats and safety vests, industrial building site at dusk, dramatic orange floodlights, steel structure scaffolding background' },
  { key: 'kontak_bg_url' as const, label: 'Kontak / Contact', defaultPrompt: 'dark moody construction site at dusk with massive concrete building under construction, tower crane silhouette, warm amber industrial floodlights, steel scaffolding and rebar, cinematic wide angle' },
  { key: 'news_bg_url' as const, label: 'Berita / News', defaultPrompt: 'dark modern cityscape at night with construction cranes and skyscrapers under construction, dramatic moody atmosphere with warm amber lighting, cinematic urban photography' },
  { key: 'portfolio_bg_url' as const, label: 'Portofolio', defaultPrompt: 'dark moody construction site at dusk with massive concrete building skeleton under construction, tower crane silhouette against stormy sky, warm amber floodlights, cinematic wide angle' },
] as const;

function boolToStr(v: boolean | undefined): string {
  return v === false ? 'false' : 'true';
}

function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, folder: string) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('site-assets').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
      setUploading(false);
      return data.publicUrl;
    } catch {
      setUploading(false);
      return null;
    }
  };

  return { upload, uploading };
}

export default function ThemeEditor({ onChange }: ThemeEditorProps) {
  const { theme, sections, refresh, setTheme, setSections } = useSiteTheme();
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const { upload, uploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadKey, setPendingUploadKey] = useState<string | null>(null);

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
    // Core
    await upsertSetting('accent_color', theme.accent_color || '#3B82F6');
    await upsertSetting('secondary_color', theme.secondary_color || '#93C5FD');
    await upsertSetting('theme_mode', theme.theme_mode || 'dark');
    // Hero
    await upsertSetting('hero_title', theme.hero_title || '');
    await upsertSetting('hero_subtitle', theme.hero_subtitle || '');
    await upsertSetting('hero_tagline', theme.hero_tagline || '');
    await upsertSetting('hero_cta_primary_text', theme.hero_cta_primary_text || '');
    await upsertSetting('hero_cta_primary_url', theme.hero_cta_primary_url || '');
    await upsertSetting('hero_cta_secondary_text', theme.hero_cta_secondary_text || '');
    await upsertSetting('hero_cta_secondary_url', theme.hero_cta_secondary_url || '');
    await upsertSetting('hero_image_url', theme.hero_image_url || '');
    // Page backgrounds
    for (const pg of PAGE_BGS) {
      await upsertSetting(pg.key, theme[pg.key] || '');
    }
    // Global assets
    await upsertSetting('favicon_url', theme.favicon_url || '');
    await upsertSetting('navbar_logo_url', theme.navbar_logo_url || '');
    await upsertSetting('footer_logo_url', theme.footer_logo_url || '');
    // Navbar & Footer sizes
    await upsertSetting('navbar_logo_width', theme.navbar_logo_width || '140');
    await upsertSetting('navbar_logo_height', theme.navbar_logo_height || '50');
    await upsertSetting('footer_logo_width', theme.footer_logo_width || '120');
    await upsertSetting('footer_logo_height', theme.footer_logo_height || '40');
    // Brand colors
    await upsertSetting('navbar_brand_color', theme.navbar_brand_color || '');
    await upsertSetting('navbar_sub_brand_color', theme.navbar_sub_brand_color || '');

    for (const s of SECTIONS) {
      await upsertSetting(s.key, boolToStr(sections[s.key]));
    }

    setSaving(false);
    showToast('Semua perubahan disimpan & website langsung update!');
    refresh();
    onChange?.();
  };

  const handleGenerateImage = async (key: string, prompt: string, width = 1920, height = 700) => {
    setGenerating(key);
    const safePrompt = encodeURIComponent(prompt);
    const seq = Date.now() + Math.floor(Math.random() * 1000);
    const imageUrl = `https://readdy.ai/api/search-image?query=${safePrompt}&width=${width}&height=${height}&seq=${seq}&orientation=landscape`;
    await upsertSetting(key, imageUrl);
    setTheme({ ...theme, [key]: imageUrl });
    setGenerating(null);
    showToast(`Gambar ${key.replace('_bg_url', '')} baru berhasil di-generate!`);
    onChange?.();
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingUploadKey) return;
    const url = await upload(file, 'backgrounds');
    if (url) {
      setTheme({ ...theme, [pendingUploadKey]: url });
      upsertSetting(pendingUploadKey, url);
      showToast('Gambar berhasil di-upload!');
      onChange?.();
    } else {
      showToast('Upload gagal, coba lagi.');
    }
    setPendingUploadKey(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (key: string) => {
    setPendingUploadKey(key);
    fileInputRef.current?.click();
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

  const updateColor = async (key: 'accent_color' | 'secondary_color' | 'navbar_brand_color' | 'navbar_sub_brand_color', value: string) => {
    const next = { ...theme, [key]: value };
    setTheme(next);
    await upsertSetting(key, value);
    refresh();
    onChange?.();
    showToast('Warna langsung berubah!');
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

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
            <div className="p-3 bg-slate-900 flex items-center justify-between gap-3">
              <span className="text-slate-500 text-xs truncate max-w-[50%]">{theme.hero_image_url || 'Gambar default'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerUpload('hero_image_url')}
                  disabled={uploading}
                  className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {uploading && pendingUploadKey === 'hero_image_url' ? (
                    <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Uploading...</>
                  ) : (
                    <><i className="ri-upload-cloud-2-line" /> Upload</>
                  )}
                </button>
                <button
                  onClick={() => {
                    const prompt = window.prompt('Deskripsikan gambar hero yang mau dibuat (misal: modern construction site Jakarta, golden hour, wide angle):');
                    if (prompt) handleGenerateImage('hero_image_url', prompt, 1920, 1080);
                  }}
                  disabled={!!generating}
                  className="flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {generating === 'hero_image_url' ? (
                    <><div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /> Generating...</>
                  ) : (
                    <><i className="ri-magic-line" /> Generate</>
                  )}
                </button>
              </div>
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

      {/* Page Backgrounds */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
          <i className="ri-gallery-line text-amber-400" /> Background Halaman
        </h3>
        <p className="text-slate-500 text-xs mb-4">Atur gambar background untuk setiap halaman. Kosongkan untuk pakai default.</p>

        <div className="space-y-4">
          {PAGE_BGS.map((pg) => (
            <div key={pg.key} className="rounded-xl border border-slate-700 overflow-hidden">
              <div className="h-36 w-full bg-slate-800 relative">
                {(theme[pg.key] as string | undefined) ? (
                  <img src={theme[pg.key] as string} alt={pg.label} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-600 text-xs">Default background</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-white text-xs font-semibold block">{pg.label}</span>
                  <span className="text-slate-600 text-[10px] truncate block max-w-[200px]">{theme[pg.key] || 'Default'}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => triggerUpload(pg.key)}
                    disabled={uploading}
                    className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    {uploading && pendingUploadKey === pg.key ? (
                      <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Upload...</>
                    ) : (
                      <><i className="ri-upload-cloud-2-line" /> Upload</>
                    )}
                  </button>
                  <button
                    onClick={() => handleGenerateImage(pg.key, pg.defaultPrompt, 1920, 700)}
                    disabled={!!generating}
                    className="flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    {generating === pg.key ? (
                      <><div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /> Generate...</>
                    ) : (
                      <><i className="ri-magic-line" /> Generate</>
                    )}
                  </button>
                  {(theme[pg.key] as string | undefined) && (
                    <button
                      onClick={() => {
                        setTheme({ ...theme, [pg.key]: '' });
                        upsertSetting(pg.key, '');
                        showToast('Background direset ke default');
                      }}
                      className="text-slate-500 hover:text-red-400 text-xs px-2 py-1.5 cursor-pointer whitespace-nowrap transition-colors"
                      title="Reset ke default"
                    >
                      <i className="ri-close-line" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Assets: Logo + Favicon */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
          <i className="ri-vip-diamond-line text-amber-400" /> Logo & Favicon
        </h3>
        <p className="text-slate-500 text-xs mb-4">Atur favicon, logo navbar, dan logo footer</p>

        <div className="space-y-4">
          {/* Favicon */}
          <div className="rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700">
                {theme.favicon_url ? (
                  <img src={theme.favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                ) : (
                  <i className="ri-image-line text-slate-600 text-xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white text-xs font-semibold block">Favicon</span>
                <span className="text-slate-600 text-[10px] truncate block">{theme.favicon_url || 'Default SVG'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerUpload('favicon_url')}
                  disabled={uploading}
                  className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {uploading && pendingUploadKey === 'favicon_url' ? (
                    <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Upload...</>
                  ) : (
                    <><i className="ri-upload-cloud-2-line" /> Upload</>
                  )}
                </button>
                {theme.favicon_url && (
                  <button
                    onClick={() => { setTheme({ ...theme, favicon_url: '' }); upsertSetting('favicon_url', ''); showToast('Favicon direset'); }}
                    className="text-slate-500 hover:text-red-400 text-xs px-2 py-1.5 cursor-pointer transition-colors"
                  >
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navbar Logo */}
          <div className="rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700">
                {theme.navbar_logo_url ? (
                  <img src={theme.navbar_logo_url} alt="Navbar Logo" className="w-full h-full object-contain" />
                ) : (
                  <i className="ri-image-line text-slate-600 text-xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white text-xs font-semibold block">Logo Navbar</span>
                <span className="text-slate-600 text-[10px] truncate block">{theme.navbar_logo_url || 'Default text logo'}</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[10px]">W</span>
                    <input
                      type="text"
                      value={theme.navbar_logo_width || '140'}
                      onChange={(e) => { setTheme({ ...theme, navbar_logo_width: e.target.value }); upsertSetting('navbar_logo_width', e.target.value); }}
                      className="w-12 bg-[#070C17] border border-slate-700 rounded px-2 py-0.5 text-[10px] text-white text-center focus:outline-none focus:border-amber-400/60"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[10px]">H</span>
                    <input
                      type="text"
                      value={theme.navbar_logo_height || '50'}
                      onChange={(e) => { setTheme({ ...theme, navbar_logo_height: e.target.value }); upsertSetting('navbar_logo_height', e.target.value); }}
                      className="w-12 bg-[#070C17] border border-slate-700 rounded px-2 py-0.5 text-[10px] text-white text-center focus:outline-none focus:border-amber-400/60"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerUpload('navbar_logo_url')}
                  disabled={uploading}
                  className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {uploading && pendingUploadKey === 'navbar_logo_url' ? (
                    <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Upload...</>
                  ) : (
                    <><i className="ri-upload-cloud-2-line" /> Upload</>
                  )}
                </button>
                {theme.navbar_logo_url && (
                  <button
                    onClick={() => { setTheme({ ...theme, navbar_logo_url: '' }); upsertSetting('navbar_logo_url', ''); showToast('Logo navbar direset'); }}
                    className="text-slate-500 hover:text-red-400 text-xs px-2 py-1.5 cursor-pointer transition-colors"
                  >
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700">
                {theme.footer_logo_url ? (
                  <img src={theme.footer_logo_url} alt="Footer Logo" className="w-full h-full object-contain" />
                ) : (
                  <i className="ri-image-line text-slate-600 text-xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white text-xs font-semibold block">Logo Footer</span>
                <span className="text-slate-600 text-[10px] truncate block">{theme.footer_logo_url || 'Default text logo'}</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[10px]">W</span>
                    <input
                      type="text"
                      value={theme.footer_logo_width || '120'}
                      onChange={(e) => { setTheme({ ...theme, footer_logo_width: e.target.value }); upsertSetting('footer_logo_width', e.target.value); }}
                      className="w-12 bg-[#070C17] border border-slate-700 rounded px-2 py-0.5 text-[10px] text-white text-center focus:outline-none focus:border-amber-400/60"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[10px]">H</span>
                    <input
                      type="text"
                      value={theme.footer_logo_height || '40'}
                      onChange={(e) => { setTheme({ ...theme, footer_logo_height: e.target.value }); upsertSetting('footer_logo_height', e.target.value); }}
                      className="w-12 bg-[#070C17] border border-slate-700 rounded px-2 py-0.5 text-[10px] text-white text-center focus:outline-none focus:border-amber-400/60"
                    />
                    <span className="text-slate-500 text-[10px]">px</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerUpload('footer_logo_url')}
                  disabled={uploading}
                  className="flex items-center gap-1.5 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {uploading && pendingUploadKey === 'footer_logo_url' ? (
                    <><div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /> Upload...</>
                  ) : (
                    <><i className="ri-upload-cloud-2-line" /> Upload</>
                  )}
                </button>
                {theme.footer_logo_url && (
                  <button
                    onClick={() => { setTheme({ ...theme, footer_logo_url: '' }); upsertSetting('footer_logo_url', ''); showToast('Logo footer direset'); }}
                    className="text-slate-500 hover:text-red-400 text-xs px-2 py-1.5 cursor-pointer transition-colors"
                  >
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>
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

        <div className="mb-4">
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

        <div className="mb-4">
          <label className="text-slate-500 text-xs mb-2 block">Warna Tulisan &quot;WARINGIN&quot; (Brand)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.navbar_brand_color || '#FFFFFF'}
              onChange={(e) => updateColor('navbar_brand_color', e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-slate-400 text-xs">{theme.navbar_brand_color || '#FFFFFF'}</span>
          </div>
        </div>

        <div>
          <label className="text-slate-500 text-xs mb-2 block">Warna Tulisan &quot;MEGA MANDIRI&quot; (Sub Brand)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.navbar_sub_brand_color || '#2563EB'}
              onChange={(e) => updateColor('navbar_sub_brand_color', e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-slate-400 text-xs">{theme.navbar_sub_brand_color || '#2563EB'}</span>
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