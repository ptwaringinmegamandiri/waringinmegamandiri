import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProjectRow {
  id: number;
  name: string;
  building_type: string;
  location: string;
  year: number;
  status: 'Selesai' | 'Ongoing';
  work_package: string;
  unit_count?: string;
  building_area?: string;
  floors?: string;
  description: string;
  cover_image?: string;
  client: string;
  value: string;
  is_featured?: boolean;
  featured_order?: number | null;
  image_position?: string;
  created_at?: string;
  updated_at?: string;
  project_images?: ProjectImageRow[];
}

export interface ProjectImageRow {
  id: number;
  project_id: number;
  image_url: string;
  sort_order: number;
  created_at?: string;
}

export interface NewsRow {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  author: string;
  date: string;
  read_time: string;
  featured: boolean;
  tags?: string[];
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerRow {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  deadline: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LegacyProjectRow {
  id: number;
  year: number;
  name: string;
  client: string;
  value: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteThemeConfig {
  accent_color?: string;
  secondary_color?: string;
  theme_mode?: 'dark' | 'light';
  hero_image_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_tagline?: string;
  stats_text?: string;
  services_title?: string;
  services_desc?: string;
  projects_title?: string;
  clients_title?: string;
  clients_desc?: string;
  cta_title?: string;
  cta_desc?: string;
  cta_primary_text?: string;
  cta_secondary_text?: string;
  hero_cta_primary_text?: string;
  hero_cta_primary_url?: string;
  hero_cta_secondary_text?: string;
  hero_cta_secondary_url?: string;
  // About page
  about_title?: string;
  about_subtitle?: string;
  about_profile_text?: string;
  about_vision?: string;
  about_mission?: string;
  // Karir page
  karir_title?: string;
  karir_subtitle?: string;
  karir_cta_title?: string;
  karir_cta_desc?: string;
  // News page
  news_title?: string;
  news_subtitle?: string;
  news_newsletter_title?: string;
  news_newsletter_desc?: string;
  // Portfolio page
  portfolio_title?: string;
  portfolio_subtitle?: string;
  portfolio_cta_text?: string;
  // Kontak page
  kontak_title?: string;
  kontak_subtitle?: string;
  kontak_cta_text?: string;
  // Navbar
  navbar_brand_text?: string;
  navbar_cta_text?: string;
  navbar_logo_url?: string;
  navbar_logo_width?: string;
  navbar_logo_height?: string;
  // Footer
  footer_tagline?: string;
  footer_copyright?: string;
  footer_logo_url?: string;
  footer_logo_width?: string;
  footer_logo_height?: string;
  // Styling
  hero_title_color?: string;
  hero_subtitle_color?: string;
  hero_title_size?: string;
  hero_subtitle_size?: string;
  section_title_color?: string;
  section_title_size?: string;
  body_text_color?: string;
  body_text_size?: string;
  cta_title_color?: string;
  cta_title_size?: string;
  cta_desc_color?: string;
  cta_desc_size?: string;
  navbar_text_color?: string;
  navbar_brand_size?: string;
  footer_text_color?: string;
  footer_text_size?: string;
}

export interface SectionsVisibility {
  hero?: boolean;
  stats?: boolean;
  services?: boolean;
  projects?: boolean;
  clients?: boolean;
  cta?: boolean;
}