import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, SiteThemeConfig, SectionsVisibility } from '@/lib/supabase';

// Extended theme map that can hold dynamic _en / _zh localization keys from DB
type DynamicTheme = SiteThemeConfig & Record<string, string | undefined>;

const DEFAULT_THEME: SiteThemeConfig = {
  accent_color: '#3B82F6',
  secondary_color: '#93C5FD',
  theme_mode: 'dark',
  hero_image_url: '',
  hero_title: 'Kontraktor Gedung\n[color=#D4AF37]Terpercaya[/color]\nSkala Nasional',
  hero_subtitle: 'PT Waringin Mega Mandiri adalah anak perusahaan yang tergabung dalam Waringin Group dan telah membangun ruko, pabrik, gudang, hotel, apartemen, restoran, sekolah, kantor, bangunan bertingkat, rumah tinggal hingga kawasan industri.',
  hero_tagline: 'PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022',
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
  navbar_text_color: '#FFFFFF',
  navbar_brand_size: '20',
  footer_text_color: '#94A3B8',
  footer_text_size: '14',
  // Page backgrounds
  about_bg_url: '',
  karir_bg_url: '',
  kontak_bg_url: '',
  news_bg_url: '',
  portfolio_bg_url: '',
  // Navbar
  navbar_brand_text: 'WMM',
  navbar_brand_color: '#FFFFFF',
  navbar_sub_brand_color: '#2563EB',
  navbar_cta_text: 'Konsultasi',
  navbar_logo_url: '',
  navbar_logo_width: '140',
  navbar_logo_height: '50',
  // Footer
  footer_tagline: 'Build To Perfection — PT Waringin Mega Mandiri',
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
  navbar_text_color: '#FFFFFF',
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
  theme: DynamicTheme;
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
  // Client cards (6 clients × 5 fields)
  'client_card_1_name','client_card_1_fullName','client_card_1_desc','client_card_1_projects','client_card_1_category',
  'client_card_2_name','client_card_2_fullName','client_card_2_desc','client_card_2_projects','client_card_2_category',
  'client_card_3_name','client_card_3_fullName','client_card_3_desc','client_card_3_projects','client_card_3_category',
  'client_card_4_name','client_card_4_fullName','client_card_4_desc','client_card_4_projects','client_card_4_category',
  'client_card_5_name','client_card_5_fullName','client_card_5_desc','client_card_5_projects','client_card_5_category',
  'client_card_6_name','client_card_6_fullName','client_card_6_desc','client_card_6_projects','client_card_6_category',
];

const ALL_SECTION_KEYS = ['hero','stats','services','projects','clients','cta'];

function isSiteThemeKey(key: string): boolean {
  if (ALL_THEME_KEYS.includes(key)) return true;
  // Allow dynamic localization suffixes _en and _zh
  if (key.endsWith('_en') || key.endsWith('_zh')) {
    const baseKey = key.replace(/_en$/, '').replace(/_zh$/, '');
    return ALL_THEME_KEYS.includes(baseKey);
  }
  return false;
}

function isSectionKey(key: string): key is keyof SectionsVisibility {
  return ALL_SECTION_KEYS.includes(key);
}

function parseBool(v: string): boolean {
  return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DynamicTheme>(DEFAULT_THEME);
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

/**
 * Hook untuk membaca nilai teks berdasarkan bahasa aktif dengan 3-tier fallback:
 * 1. DB localized key: theme[`${key}_${lang}`]  (e.g. hero_title_en)
 * 2. DB base key: theme[key]                     (Indonesian / default)
 * 3. Static i18n dict: t(i18nKey)               (hardcoded translations)
 *
 * @param key       - DB base key (e.g. 'hero_title')
 * @param i18nKey   - react-i18next key (e.g. 'hero.title1')
 * @returns         localized string
 */
export function useLocalizedTheme(key: string, i18nKey?: string): string {
  const { theme } = useContext(SiteThemeContext);
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) as 'id' | 'en' | 'zh';

  // Tier 1: language-specific DB value
  if (lang && lang !== 'id') {
    const localizedVal = (theme as DynamicTheme)[`${key}_${lang}`];
    if (localizedVal && localizedVal.trim()) return localizedVal;
  }

  // Tier 2: base Indonesian DB value
  const baseVal = (theme as DynamicTheme)[key];
  if (baseVal && baseVal.trim()) return baseVal;

  // Tier 3: static i18n dictionary
  if (i18nKey) return t(i18nKey);

  return '';
}