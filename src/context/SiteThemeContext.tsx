import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, SiteThemeConfig, SectionsVisibility } from '@/lib/supabase';

const DEFAULT_THEME: SiteThemeConfig = {
  accent_color: '#3B82F6',
  secondary_color: '#93C5FD',
  theme_mode: 'dark',
  hero_image_url: '',
  hero_title: 'Kontraktor Gedung\nTerpercaya\nSkala Nasional',
  hero_subtitle: 'PT Waringin Mega Mandiri adalah anak perusahaan yang tergabung dalam Waringin Group dan telah membangun ruko, pabrik, gudang, hotel, apartemen, restoran, sekolah, kantor, bangunan bertingkat, rumah tinggal hingga kawasan industri.',
  hero_tagline: 'PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022',
  stats_text: '35+ tahun pengalaman di bidang konstruksi',
  services_title: 'Layanan Kami',
  services_desc: 'Kami menyediakan solusi konstruksi komprehensif dengan teknologi terdepan untuk memenuhi setiap kebutuhan proyek Anda.',
  projects_title: 'Proyek Ongoing',
  clients_title: 'Dipercaya oleh Perusahaan Terkemuka',
  clients_desc: 'Kami telah dipercaya oleh berbagai perusahaan dan institusi terkemuka di Indonesia untuk menangani proyek konstruksi skala besar dengan standar kualitas internasional.',
  cta_title: 'Siap Membangun\nMasa Depan Anda?',
  cta_desc: 'Tim ahli kami siap membantu mewujudkan visi konstruksi Anda — mulai dari perencanaan hingga serah terima proyek.',
  cta_primary_text: 'Konsultasi Gratis',
  cta_secondary_text: 'Telepon Kami',
  hero_cta_primary_text: 'Lihat Portofolio',
  hero_cta_primary_url: '/portofolio',
  hero_cta_secondary_text: 'Hubungi Kami',
  hero_cta_secondary_url: 'mailto:info@waringinmegamandiri.com',
  // About page
  about_title: 'Tentang Kami',
  about_subtitle: 'Mengenal lebih dekat PT Waringin Mega Mandiri — perusahaan konstruksi terpercaya dengan pengalaman lebih dari 35 tahun di industri bangunan Indonesia.',
  about_profile_text: '',
  about_vision: '',
  about_mission: '',
  about_bg_url: '',
  // Karir page
  karir_title: 'Bergabung dengan Tim Terbaik',
  karir_subtitle: 'Kami selalu mencari talenta berbakat yang bersemangat untuk berkembang bersama dalam dunia konstruksi.',
  karir_cta_title: 'Tidak Menemukan Posisi yang Sesuai?',
  karir_cta_desc: 'Kirimkan lamaran spontan Anda — kami akan meninjau profil Anda untuk posisi yang relevan di masa depan.',
  karir_bg_url: '',
  // News page
  news_title: 'Berita & Artikel',
  news_subtitle: 'Update terbaru seputar proyek, inovasi teknologi, dan perkembangan industri konstruksi dari PT Waringin Mega Mandiri.',
  news_newsletter_title: 'Berlangganan Newsletter',
  news_newsletter_desc: 'Dapatkan update proyek terbaru, tips konstruksi, dan berita industri langsung ke inbox Anda.',
  news_bg_url: '',
  // Portfolio page
  portfolio_title: 'Portofolio Proyek',
  portfolio_subtitle: 'Jelajahi berbagai proyek konstruksi yang telah kami selesaikan dan yang sedang berjalan — dari gedung komersial hingga infrastruktur.',
  portfolio_cta_text: 'Punya proyek konstruksi dalam pikiran? Tim ahli kami siap membantu mewujudkan visi Anda.',
  portfolio_bg_url: '',
  // Kontak page
  kontak_title: 'Hubungi Kami',
  kontak_subtitle: 'Tim kami siap membantu menjawab pertanyaan dan memberikan solusi konstruksi terbaik untuk kebutuhan proyek Anda.',
  kontak_cta_text: 'Punya proyek konstruksi dalam pikiran? Tim ahli kami siap membantu mewujudkan visi Anda.',
  kontak_bg_url: '',
  // Navbar
  navbar_brand_text: 'WMM',
  navbar_brand_color: '',
  navbar_sub_brand_color: '',
  navbar_cta_text: 'Konsultasi',
  navbar_logo_url: '',
  navbar_logo_width: '140',
  navbar_logo_height: '50',
  // Footer
  footer_tagline: 'Built to Perfection — PT Waringin Mega Mandiri',
  footer_copyright: 'PT Waringin Mega Mandiri. Hak Cipta Dilindungi.',
  footer_logo_url: '',
  footer_logo_width: '120',
  footer_logo_height: '40',
  // Global assets
  favicon_url: '',
  // Styling defaults
  hero_title_color: '#FFFFFF',
  hero_subtitle_color: '#94A3B8',
  hero_title_size: '56',
  hero_subtitle_size: '18',
  section_title_color: '#1E293B',
  section_title_size: '36',
  body_text_color: '#475569',
  body_text_size: '16',
  cta_title_color: '#FFFFFF',
  cta_title_size: '42',
  cta_desc_color: '#CBD5E1',
  cta_desc_size: '18',
  navbar_text_color: '#1E293B',
  navbar_brand_size: '20',
  footer_text_color: '#94A3B8',
  footer_text_size: '14',
};

const DEFAULT_SECTIONS: SectionsVisibility = {
  hero: true,
  stats: true,
  services: true,
  projects: true,
  clients: true,
  cta: true,
};

interface SiteThemeContextType {
  theme: SiteThemeConfig;
  sections: SectionsVisibility;
  loading: boolean;
  refresh: () => void;
  setTheme: (t: SiteThemeConfig) => void;
  setSections: (s: SectionsVisibility) => void;
}

const SiteThemeContext = createContext<SiteThemeContextType>({
  theme: DEFAULT_THEME,
  sections: DEFAULT_SECTIONS,
  loading: true,
  refresh: () => {},
  setTheme: () => {},
  setSections: () => {},
});

const ALL_THEME_KEYS = [
  'accent_color','secondary_color','theme_mode','hero_image_url',
  'hero_title','hero_subtitle','hero_tagline',
  'hero_cta_primary_text','hero_cta_primary_url','hero_cta_secondary_text','hero_cta_secondary_url',
  'stats_text','services_title','services_desc',
  'projects_title','clients_title','clients_desc',
  'cta_title','cta_desc','cta_primary_text','cta_secondary_text',
  // About
  'about_title','about_subtitle','about_profile_text','about_vision','about_mission','about_bg_url',
  // Karir
  'karir_title','karir_subtitle','karir_cta_title','karir_cta_desc','karir_bg_url',
  // News
  'news_title','news_subtitle','news_newsletter_title','news_newsletter_desc','news_bg_url',
  // Portfolio
  'portfolio_title','portfolio_subtitle','portfolio_cta_text','portfolio_bg_url',
  // Kontak
  'kontak_title','kontak_subtitle','kontak_cta_text','kontak_bg_url',
  // Navbar
  'navbar_brand_text','navbar_brand_color','navbar_sub_brand_color','navbar_cta_text','navbar_logo_url','navbar_logo_width','navbar_logo_height',
  // Footer
  'footer_tagline','footer_copyright','footer_logo_url','footer_logo_width','footer_logo_height',
  // Global assets
  'favicon_url',
  // Styling
  'hero_title_color','hero_subtitle_color','hero_title_size','hero_subtitle_size',
  'section_title_color','section_title_size','body_text_color','body_text_size',
  'cta_title_color','cta_title_size','cta_desc_color','cta_desc_size',
  'navbar_text_color','navbar_brand_size','footer_text_color','footer_text_size',
];

const ALL_SECTION_KEYS = ['hero','stats','services','projects','clients','cta'];

function isSiteThemeKey(key: string): key is keyof SiteThemeConfig {
  return ALL_THEME_KEYS.includes(key);
}

function isSectionKey(key: string): key is keyof SectionsVisibility {
  return ALL_SECTION_KEYS.includes(key);
}

function parseBool(v: string): boolean {
  return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteThemeConfig>(DEFAULT_THEME);
  const [sections, setSectionsState] = useState<SectionsVisibility>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  const fetchTheme = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && data && data.length > 0) {
      const nextTheme: Partial<SiteThemeConfig> = {};
      const nextSections: Partial<SectionsVisibility> = {};

      data.forEach((row: { key: string; value: string }) => {
        if (isSiteThemeKey(row.key)) {
          (nextTheme as Record<string, string>)[row.key] = row.value;
        } else if (isSectionKey(row.key)) {
          (nextSections as Record<string, boolean>)[row.key] = parseBool(row.value);
        }
      });

      setThemeState((prev) => {
        // Deep compare to avoid unnecessary re-renders every 10s
        let themeChanged = false;
        for (const key of Object.keys(nextTheme)) {
          if ((prev as Record<string, string>)[key] !== (nextTheme as Record<string, string>)[key]) {
            themeChanged = true; break;
          }
        }
        return themeChanged ? { ...prev, ...nextTheme } : prev;
      });
      setSectionsState((prev) => {
        let sectionsChanged = false;
        for (const key of Object.keys(nextSections)) {
          if ((prev as Record<string, boolean>)[key] !== (nextSections as Record<string, boolean>)[key]) {
            sectionsChanged = true; break;
          }
        }
        return sectionsChanged ? { ...prev, ...nextSections } : prev;
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTheme();
    const interval = setInterval(fetchTheme, 10000);
    return () => clearInterval(interval);
  }, [fetchTheme]);

  // Listen for explicit refresh signal (from admin inline edit, AI copilot, etc)
  useEffect(() => {
    const handler = () => {
      fetchTheme();
    };
    window.addEventListener('WMM_SETTINGS_REFRESH', handler);
    return () => window.removeEventListener('WMM_SETTINGS_REFRESH', handler);
  }, [fetchTheme]);

  // Listen for postMessage from admin preview (iframe)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'WMM_THEME_UPDATE') {
        const incomingTheme = e.data.theme as Partial<SiteThemeConfig>;
        const incomingSections = e.data.sections as Partial<SectionsVisibility>;
        if (incomingTheme && Object.keys(incomingTheme).length > 0) {
          setThemeState((prev) => ({ ...prev, ...incomingTheme }));
        }
        if (incomingSections && Object.keys(incomingSections).length > 0) {
          setSectionsState((prev) => ({ ...prev, ...incomingSections }));
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const setTheme = (t: SiteThemeConfig) => setThemeState(t);
  const setSections = (s: SectionsVisibility) => setSectionsState(s);
  const refresh = () => fetchTheme();

  return (
    <SiteThemeContext.Provider value={{ theme, sections, loading, refresh, setTheme, setSections }}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export const useSiteTheme = () => useContext(SiteThemeContext);