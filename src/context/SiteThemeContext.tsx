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

function isSiteThemeKey(key: string): key is keyof SiteThemeConfig {
  return ['accent_color','secondary_color','theme_mode','hero_image_url','hero_title','hero_subtitle','hero_tagline','hero_cta_primary_text','hero_cta_primary_url','hero_cta_secondary_text','hero_cta_secondary_url','stats_text','services_title','services_desc','projects_title','clients_title','clients_desc','cta_title','cta_desc','cta_primary_text','cta_secondary_text'].includes(key);
}

function isSectionKey(key: string): key is keyof SectionsVisibility {
  return ['hero','stats','services','projects','clients','cta'].includes(key);
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

      setThemeState((prev) => ({ ...prev, ...nextTheme }));
      setSectionsState((prev) => ({ ...prev, ...nextSections }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTheme();
    const interval = setInterval(fetchTheme, 10000);
    return () => clearInterval(interval);
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