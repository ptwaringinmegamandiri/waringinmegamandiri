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
