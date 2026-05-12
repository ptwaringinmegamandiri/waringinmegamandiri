import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/base/RichTextEditor';

export interface InlineEditField {
  key: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'url' | 'color' | 'fontsize' | 'logo' | 'logodims';
  maxLength?: number;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface InlineEditData {
  sectionId: string;
  sectionLabel: string;
  editField: string;
  fields: InlineEditField[];
}

interface InlineEditPopupProps {
  data: InlineEditData | null;
  themeValues: Record<string, string>;
  onClose: () => void;
  onSaved: () => void;
}

/* Fields yang support rich text coloring */
const RICH_TEXT_FIELDS = new Set([
  'hero_title',
  'hero_subtitle',
  'hero_tagline',
  'cta_title',
  'cta_desc',
  'about_profile_text',
  'about_vision',
  'about_mission',
  'about_subtitle',
  'karir_title',
  'karir_subtitle',
  'karir_cta_desc',
  'news_subtitle',
  'news_newsletter_desc',
  'portfolio_subtitle',
  'portfolio_cta_text',
  'kontak_subtitle',
  'kontak_cta_text',
  'services_desc',
  'clients_desc',
  'footer_tagline',
  'footer_copyright',
  'address',
  'service_card_1_desc',
  'service_card_2_desc',
  'service_card_3_desc',
  'service_card_4_desc',
]);

function supportsRichText(key: string): boolean {
  const dbKey = KEY_MAP[key] || key;
  return RICH_TEXT_FIELDS.has(dbKey) || RICH_TEXT_FIELDS.has(key);
}

/* Map HTML data-editable-fields key → actual DB key in site_settings */
const KEY_MAP: Record<string, string> = {
  // Home hero
  tagline: 'hero_tagline',
  title: 'hero_title',
  subtitle: 'hero_subtitle',
  cta_primary_text: 'cta_primary_text',
  cta_secondary_text: 'cta_secondary_text',
  hero_cta_primary_text: 'hero_cta_primary_text',
  hero_cta_secondary_text: 'hero_cta_secondary_text',
  hero_cta_primary_url: 'hero_cta_primary_url',
  hero_cta_secondary_url: 'hero_cta_secondary_url',
  stats_text: 'stats_text',
  // Services
  services_title: 'services_title',
  services_desc: 'services_desc',
  service_card_1_title: 'service_card_1_title',
  service_card_1_desc: 'service_card_1_desc',
  service_card_2_title: 'service_card_2_title',
  service_card_2_desc: 'service_card_2_desc',
  service_card_3_title: 'service_card_3_title',
  service_card_3_desc: 'service_card_3_desc',
  service_card_4_title: 'service_card_4_title',
  service_card_4_desc: 'service_card_4_desc',
  service_why_1_text: 'service_why_1_text',
  service_why_2_text: 'service_why_2_text',
  service_why_3_text: 'service_why_3_text',
  service_why_4_text: 'service_why_4_text',
  service_why_5_text: 'service_why_5_text',
  service_why_6_text: 'service_why_6_text',
  // Projects
  projects_title: 'projects_title',
  // Clients
  clients_title: 'clients_title',
  clients_desc: 'clients_desc',
  client_card_1_name: 'client_card_1_name',
  client_card_1_fullName: 'client_card_1_fullName',
  client_card_1_desc: 'client_card_1_desc',
  client_card_1_projects: 'client_card_1_projects',
  client_card_2_name: 'client_card_2_name',
  client_card_2_fullName: 'client_card_2_fullName',
  client_card_2_desc: 'client_card_2_desc',
  client_card_2_projects: 'client_card_2_projects',
  client_card_3_name: 'client_card_3_name',
  client_card_3_fullName: 'client_card_3_fullName',
  client_card_3_desc: 'client_card_3_desc',
  client_card_3_projects: 'client_card_3_projects',
  client_card_4_name: 'client_card_4_name',
  client_card_4_fullName: 'client_card_4_fullName',
  client_card_4_desc: 'client_card_4_desc',
  client_card_4_projects: 'client_card_4_projects',
  client_card_5_name: 'client_card_5_name',
  client_card_5_fullName: 'client_card_5_fullName',
  client_card_5_desc: 'client_card_5_desc',
  client_card_5_projects: 'client_card_5_projects',
  client_card_6_name: 'client_card_6_name',
  client_card_6_fullName: 'client_card_6_fullName',
  client_card_6_desc: 'client_card_6_desc',
  client_card_6_projects: 'client_card_6_projects',
  // CTA
  cta_title: 'cta_title',
  cta_desc: 'cta_desc',
  // Kontak / site settings
  phone: 'phone',
  phone_alt: 'phone_alt',
  email: 'email',
  email_alt: 'email_alt',
  whatsapp: 'whatsapp',
  address: 'address',
  address_short: 'address_short',
  hours_weekdays: 'hours_weekdays',
  hours_saturday: 'hours_saturday',
  hours_sunday: 'hours_sunday',
  instagram: 'instagram',
  linkedin: 'linkedin',
  facebook: 'facebook',
  youtube: 'youtube',
  maps_embed_url: 'maps_embed_url',
  // About page
  about_title: 'about_title',
  about_subtitle: 'about_subtitle',
  about_profile_text: 'about_profile_text',
  about_vision: 'about_vision',
  about_mission: 'about_mission',
  // Karir page
  karir_title: 'karir_title',
  karir_subtitle: 'karir_subtitle',
  karir_cta_title: 'karir_cta_title',
  karir_cta_desc: 'karir_cta_desc',
  // News page
  news_title: 'news_title',
  news_subtitle: 'news_subtitle',
  news_newsletter_title: 'news_newsletter_title',
  news_newsletter_desc: 'news_newsletter_desc',
  // Portfolio page
  portfolio_title: 'portfolio_title',
  portfolio_subtitle: 'portfolio_subtitle',
  portfolio_cta_text: 'portfolio_cta_text',
  // Kontak page
  kontak_title: 'kontak_title',
  kontak_subtitle: 'kontak_subtitle',
  kontak_cta_text: 'kontak_cta_text',
  // Navbar
  navbar_brand_text: 'navbar_brand_text',
  navbar_cta_text: 'navbar_cta_text',
  // Footer
  footer_tagline: 'footer_tagline',
  footer_copyright: 'footer_copyright',
  // Logo URLs
  navbar_logo_url: 'navbar_logo_url',
  footer_logo_url: 'footer_logo_url',
  // Logo dimensions
  navbar_logo_width: 'navbar_logo_width',
  navbar_logo_height: 'navbar_logo_height',
  footer_logo_width: 'footer_logo_width',
  footer_logo_height: 'footer_logo_height',
  // Styling keys
  hero_title_color: 'hero_title_color',
  hero_subtitle_color: 'hero_subtitle_color',
  hero_title_size: 'hero_title_size',
  hero_subtitle_size: 'hero_subtitle_size',
  section_title_color: 'section_title_color',
  section_title_size: 'section_title_size',
  body_text_color: 'body_text_color',
  body_text_size: 'body_text_size',
  cta_title_color: 'cta_title_color',
  cta_title_size: 'cta_title_size',
  cta_desc_color: 'cta_desc_color',
  cta_desc_size: 'cta_desc_size',
  navbar_text_color: 'navbar_text_color',
  navbar_brand_size: 'navbar_brand_size',
  footer_text_color: 'footer_text_color',
  footer_text_size: 'footer_text_size',
};

/* Display labels for known keys */
const FIELD_LABELS: Record<string, { label: string; type: InlineEditField['type']; maxLength?: number; placeholder?: string; min?: number; max?: number }> = {
  hero_tagline: { label: 'Tagline', type: 'text', maxLength: 120, placeholder: 'Tagline kecil di atas judul' },
  hero_title: { label: 'Judul Hero', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \\n untuk baris baru' },
  hero_subtitle: { label: 'Deskripsi Hero', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi singkat hero' },
  hero_title_color: { label: 'Warna Judul Hero', type: 'color' },
  hero_subtitle_color: { label: 'Warna Deskripsi Hero', type: 'color' },
  hero_title_size: { label: 'Ukuran Judul Hero (px)', type: 'fontsize', min: 16, max: 96, placeholder: '56' },
  hero_subtitle_size: { label: 'Ukuran Deskripsi Hero (px)', type: 'fontsize', min: 10, max: 32, placeholder: '18' },
  hero_cta_primary_text: { label: 'Tombol CTA Primary Hero', type: 'text', maxLength: 40, placeholder: 'Teks tombol utama hero' },
  hero_cta_secondary_text: { label: 'Tombol CTA Secondary Hero', type: 'text', maxLength: 40, placeholder: 'Teks tombol sekunder hero' },
  hero_cta_primary_url: { label: 'URL Tombol CTA Primary Hero', type: 'url', maxLength: 200, placeholder: '/portofolio atau https://...' },
  hero_cta_secondary_url: { label: 'URL Tombol CTA Secondary Hero', type: 'url', maxLength: 200, placeholder: 'mailto: atau https://...' },
  stats_text: { label: 'Teks Stats', type: 'text', maxLength: 120, placeholder: 'Misal: 35+ tahun pengalaman...' },
  // Services cards
  service_card_1_title: { label: 'Judul Card Layanan 1', type: 'text', maxLength: 80, placeholder: 'Gedung Komersial & Perkantoran' },
  service_card_1_desc: { label: 'Deskripsi Card Layanan 1', type: 'textarea', maxLength: 300, placeholder: 'Deskripsi bidang konstruksi...' },
  service_card_2_title: { label: 'Judul Card Layanan 2', type: 'text', maxLength: 80, placeholder: 'Hunian & Residensial' },
  service_card_2_desc: { label: 'Deskripsi Card Layanan 2', type: 'textarea', maxLength: 300, placeholder: 'Deskripsi bidang konstruksi...' },
  service_card_3_title: { label: 'Judul Card Layanan 3', type: 'text', maxLength: 80, placeholder: 'Fasilitas Publik & Institusi' },
  service_card_3_desc: { label: 'Deskripsi Card Layanan 3', type: 'textarea', maxLength: 300, placeholder: 'Deskripsi bidang konstruksi...' },
  service_card_4_title: { label: 'Judul Card Layanan 4', type: 'text', maxLength: 80, placeholder: 'Proyek Khusus & Mixed-Use' },
  service_card_4_desc: { label: 'Deskripsi Card Layanan 4', type: 'textarea', maxLength: 300, placeholder: 'Deskripsi bidang konstruksi...' },
  service_why_1_text: { label: 'Poin Keunggulan 1', type: 'text', maxLength: 80, placeholder: 'Tim Berpengalaman...' },
  service_why_2_text: { label: 'Poin Keunggulan 2', type: 'text', maxLength: 80, placeholder: 'Manajemen Proyek...' },
  service_why_3_text: { label: 'Poin Keunggulan 3', type: 'text', maxLength: 80, placeholder: 'Komitmen Kualitas...' },
  service_why_4_text: { label: 'Poin Keunggulan 4', type: 'text', maxLength: 80, placeholder: 'Dukungan Penuh...' },
  service_why_5_text: { label: 'Poin Keunggulan 5', type: 'text', maxLength: 80, placeholder: 'Rekam Jejak...' },
  service_why_6_text: { label: 'Poin Keunggulan 6', type: 'text', maxLength: 80, placeholder: 'Komunikasi Aktif...' },
  projects_title: { label: 'Judul Proyek', type: 'text', maxLength: 80, placeholder: 'Misal: Proyek Ongoing' },
  // Client cards
  client_card_1_name: { label: 'Nama Klien 1', type: 'text', maxLength: 40, placeholder: 'APL Group' },
  client_card_1_fullName: { label: 'Nama Lengkap Klien 1', type: 'text', maxLength: 60, placeholder: 'APL Group (PT Astakona Megatama)' },
  client_card_1_desc: { label: 'Deskripsi Klien 1', type: 'textarea', maxLength: 200, placeholder: 'Pengembang properti...' },
  client_card_1_projects: { label: 'Jumlah Proyek Klien 1', type: 'text', maxLength: 10, placeholder: '3' },
  client_card_2_name: { label: 'Nama Klien 2', type: 'text', maxLength: 40, placeholder: 'Astra Land' },
  client_card_2_fullName: { label: 'Nama Lengkap Klien 2', type: 'text', maxLength: 60, placeholder: 'Astra Land Indonesia' },
  client_card_2_desc: { label: 'Deskripsi Klien 2', type: 'textarea', maxLength: 200, placeholder: 'Anak perusahaan Astra...' },
  client_card_2_projects: { label: 'Jumlah Proyek Klien 2', type: 'text', maxLength: 10, placeholder: '5' },
  client_card_3_name: { label: 'Nama Klien 3', type: 'text', maxLength: 40, placeholder: 'ASG Group' },
  client_card_3_fullName: { label: 'Nama Lengkap Klien 3', type: 'text', maxLength: 60, placeholder: 'ASG Group' },
  client_card_3_desc: { label: 'Deskripsi Klien 3', type: 'textarea', maxLength: 200, placeholder: 'Pengembang kawasan...' },
  client_card_3_projects: { label: 'Jumlah Proyek Klien 3', type: 'text', maxLength: 10, placeholder: '4' },
  client_card_4_name: { label: 'Nama Klien 4', type: 'text', maxLength: 40, placeholder: 'Yayasan Charitas' },
  client_card_4_fullName: { label: 'Nama Lengkap Klien 4', type: 'text', maxLength: 60, placeholder: 'Yayasan Rumah Sakit Charitas' },
  client_card_4_desc: { label: 'Deskripsi Klien 4', type: 'textarea', maxLength: 200, placeholder: 'Institusi kesehatan...' },
  client_card_4_projects: { label: 'Jumlah Proyek Klien 4', type: 'text', maxLength: 10, placeholder: '2' },
  client_card_5_name: { label: 'Nama Klien 5', type: 'text', maxLength: 40, placeholder: 'PT Sabang Raya' },
  client_card_5_fullName: { label: 'Nama Lengkap Klien 5', type: 'text', maxLength: 60, placeholder: 'PT Sabang Raya Investama' },
  client_card_5_desc: { label: 'Deskripsi Klien 5', type: 'textarea', maxLength: 200, placeholder: 'Perusahaan investasi...' },
  client_card_5_projects: { label: 'Jumlah Proyek Klien 5', type: 'text', maxLength: 10, placeholder: '1' },
  client_card_6_name: { label: 'Nama Klien 6', type: 'text', maxLength: 40, placeholder: 'Hilton Garden Inn' },
  client_card_6_fullName: { label: 'Nama Lengkap Klien 6', type: 'text', maxLength: 60, placeholder: 'Hilton Garden Inn Batam' },
  client_card_6_desc: { label: 'Deskripsi Klien 6', type: 'textarea', maxLength: 200, placeholder: 'Brand hotel internasional...' },
  client_card_6_projects: { label: 'Jumlah Proyek Klien 6', type: 'text', maxLength: 10, placeholder: '1' },
  cta_title: { label: 'Judul CTA', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \\n untuk baris baru' },
  cta_desc: { label: 'Deskripsi CTA', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi ajakan' },
  cta_title_color: { label: 'Warna Judul CTA', type: 'color' },
  cta_desc_color: { label: 'Warna Deskripsi CTA', type: 'color' },
  cta_title_size: { label: 'Ukuran Judul CTA (px)', type: 'fontsize', min: 20, max: 72, placeholder: '42' },
  cta_desc_size: { label: 'Ukuran Deskripsi CTA (px)', type: 'fontsize', min: 10, max: 32, placeholder: '18' },
  cta_primary_text: { label: 'Tombol CTA Primary', type: 'text', maxLength: 40, placeholder: 'Teks tombol CTA primary' },
  cta_secondary_text: { label: 'Tombol CTA Secondary', type: 'text', maxLength: 40, placeholder: 'Teks tombol CTA sekunder' },
  // Kontak / site settings
  phone: { label: 'Nomor Telepon', type: 'text', maxLength: 30, placeholder: '021-573-8001' },
  phone_alt: { label: 'Telepon Alternatif', type: 'text', maxLength: 30, placeholder: '+62 812-9999-0001' },
  email: { label: 'Email', type: 'text', maxLength: 60, placeholder: 'info@waringinmegamandiri.com' },
  email_alt: { label: 'Email Alternatif', type: 'text', maxLength: 60, placeholder: 'marketing@...' },
  whatsapp: { label: 'WhatsApp', type: 'text', maxLength: 30, placeholder: '+6281299990001' },
  address: { label: 'Alamat Lengkap', type: 'textarea', maxLength: 300, placeholder: 'Jl. ...' },
  address_short: { label: 'Alamat Singkat', type: 'text', maxLength: 100, placeholder: 'Jakarta Pusat, DKI Jakarta' },
  hours_weekdays: { label: 'Jam Kerja Senin–Jumat', type: 'text', maxLength: 60, placeholder: 'Senin – Jumat: 08.00 – 17.00' },
  hours_saturday: { label: 'Jam Kerja Sabtu', type: 'text', maxLength: 60, placeholder: 'Sabtu: 08.00 – 13.00' },
  hours_sunday: { label: 'Jam Kerja Minggu', type: 'text', maxLength: 60, placeholder: 'Minggu: Tutup' },
  instagram: { label: 'Instagram URL', type: 'url', maxLength: 200, placeholder: 'https://instagram.com/...' },
  linkedin: { label: 'LinkedIn URL', type: 'url', maxLength: 200, placeholder: 'https://linkedin.com/...' },
  facebook: { label: 'Facebook URL', type: 'url', maxLength: 200, placeholder: 'https://facebook.com/...' },
  youtube: { label: 'YouTube URL', type: 'url', maxLength: 200, placeholder: 'https://youtube.com/...' },
  maps_embed_url: { label: 'Google Maps Embed URL', type: 'url', maxLength: 500, placeholder: 'https://www.google.com/maps/embed?...' },
  // About page
  about_title: { label: 'Judul Halaman Tentang', type: 'text', maxLength: 80, placeholder: 'Tentang Kami' },
  about_subtitle: { label: 'Deskripsi Halaman Tentang', type: 'textarea', maxLength: 300, placeholder: 'Mengenal lebih dekat PT WMM...' },
  about_profile_text: { label: 'Teks Profil Perusahaan', type: 'textarea', maxLength: 2000, placeholder: 'Deskripsi lengkap profil perusahaan...' },
  about_vision: { label: 'Visi Perusahaan', type: 'textarea', maxLength: 500, placeholder: 'Visi PT Waringin Mega Mandiri...' },
  about_mission: { label: 'Misi Perusahaan', type: 'textarea', maxLength: 1000, placeholder: 'Misi PT Waringin Mega Mandiri...' },
  section_title_color: { label: 'Warna Judul Section', type: 'color' },
  section_title_size: { label: 'Ukuran Judul Section (px)', type: 'fontsize', min: 18, max: 56, placeholder: '36' },
  body_text_color: { label: 'Warna Teks Body', type: 'color' },
  body_text_size: { label: 'Ukuran Teks Body (px)', type: 'fontsize', min: 10, max: 24, placeholder: '16' },
  // Karir page
  karir_title: { label: 'Judul Halaman Karir', type: 'text', maxLength: 80, placeholder: 'Bergabung dengan Tim Terbaik' },
  karir_subtitle: { label: 'Deskripsi Halaman Karir', type: 'textarea', maxLength: 300, placeholder: 'Kami selalu mencari talenta berbakat...' },
  karir_cta_title: { label: 'Judul CTA Karir', type: 'text', maxLength: 80, placeholder: 'Tidak Menemukan Posisi yang Sesuai?' },
  karir_cta_desc: { label: 'Deskripsi CTA Karir', type: 'textarea', maxLength: 300, placeholder: 'Kirimkan lamaran spontan Anda...' },
  // News page
  news_title: { label: 'Judul Halaman Berita', type: 'text', maxLength: 80, placeholder: 'Berita & Artikel' },
  news_subtitle: { label: 'Deskripsi Halaman Berita', type: 'textarea', maxLength: 300, placeholder: 'Update terbaru seputar proyek...' },
  news_newsletter_title: { label: 'Judul Newsletter', type: 'text', maxLength: 80, placeholder: 'Berlangganan Newsletter' },
  news_newsletter_desc: { label: 'Deskripsi Newsletter', type: 'textarea', maxLength: 300, placeholder: 'Dapatkan update proyek terbaru...' },
  // Portfolio page
  portfolio_title: { label: 'Judul Halaman Portofolio', type: 'text', maxLength: 80, placeholder: 'Portofolio Proyek' },
  portfolio_subtitle: { label: 'Deskripsi Halaman Portofolio', type: 'textarea', maxLength: 300, placeholder: 'Jelajahi berbagai proyek konstruksi...' },
  portfolio_cta_text: { label: 'Teks CTA Portofolio', type: 'textarea', maxLength: 200, placeholder: 'Punya proyek konstruksi dalam pikiran?' },
  // Kontak page
  kontak_title: { label: 'Judul Halaman Kontak', type: 'text', maxLength: 80, placeholder: 'Hubungi Kami' },
  kontak_subtitle: { label: 'Deskripsi Halaman Kontak', type: 'textarea', maxLength: 300, placeholder: 'Tim kami siap membantu...' },
  kontak_cta_text: { label: 'Teks CTA Kontak', type: 'textarea', maxLength: 200, placeholder: 'Punya proyek konstruksi dalam pikiran?' },
  // Navbar
  navbar_brand_text: { label: 'Teks Brand Navbar', type: 'text', maxLength: 20, placeholder: 'WMM' },
  navbar_cta_text: { label: 'Teks CTA Navbar', type: 'text', maxLength: 30, placeholder: 'Konsultasi' },
  navbar_text_color: { label: 'Warna Teks Navbar', type: 'color' },
  navbar_brand_size: { label: 'Ukuran Teks Brand (px)', type: 'fontsize', min: 12, max: 32, placeholder: '20' },
  // Footer
  footer_tagline: { label: 'Tagline Footer', type: 'text', maxLength: 100, placeholder: 'Built to Perfection — PT WMM' },
  footer_copyright: { label: 'Teks Copyright Footer', type: 'text', maxLength: 100, placeholder: 'PT WMM. Hak Cipta Dilindungi.' },
  footer_text_color: { label: 'Warna Teks Footer', type: 'color' },
  footer_text_size: { label: 'Ukuran Teks Footer (px)', type: 'fontsize', min: 10, max: 20, placeholder: '14' },
  // Logo
  navbar_logo_url: { label: 'Logo Navbar', type: 'logo' },
  footer_logo_url: { label: 'Logo Footer', type: 'logo' },
  navbar_logo_width: { label: 'Lebar Logo Navbar (px)', type: 'logodims', min: 40, max: 400, placeholder: '140' },
  navbar_logo_height: { label: 'Tinggi Logo Navbar (px)', type: 'logodims', min: 20, max: 200, placeholder: '50' },
  footer_logo_width: { label: 'Lebar Logo Footer (px)', type: 'logodims', min: 40, max: 400, placeholder: '120' },
  footer_logo_height: { label: 'Tinggi Logo Footer (px)', type: 'logodims', min: 20, max: 200, placeholder: '40' },
};

const LOGO_BUCKET = 'project-images';

function isColorKey(key: string): boolean {
  return key.endsWith('_color');
}

function isSizeKey(key: string): boolean {
  return key.endsWith('_size') || key.endsWith('_width') || key.endsWith('_height');
}

export default function InlineEditPopup({ data, themeValues, onClose, onSaved }: InlineEditPopupProps) {
  const [values, setValues] = useState<Record<string, string>>();
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeRef = useRef(themeValues);
  const dataRef = useRef(data);

  // Keep refs in sync without triggering re-render
  themeRef.current = themeValues;
  dataRef.current = data;

  // Only initialize values when data actually changes (sectionId changed)
  useEffect(() => {
    if (!data) { setValues({}); return; }
    setSavedCount(0);
    const dbKeys = data.fields.map(f => KEY_MAP[f.key] || f.key);
    supabase.from('site_settings').select('key, value').in('key', dbKeys).then(({ data: rows }) => {
      const dbMap: Record<string, string> = {};
      (rows || []).forEach((r: { key: string; value: string }) => { dbMap[r.key] = r.value; });
      const initial: Record<string, string> = {};
      data.fields.forEach((f) => {
        const dbKey = KEY_MAP[f.key] || f.key;
        initial[f.key] = dbMap[dbKey] ?? themeRef.current[dbKey] ?? '';
      });
      setValues(initial);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.sectionId]);

  useEffect(() => {
    if (!data) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [data, onClose]);

  useEffect(() => {
    if (!data) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [data, onClose]);

  const handleSave = useCallback(async () => {
    if (!dataRef.current || saving) return;
    setSaving(true);

    const dbFields = dataRef.current.fields.map(f => ({
      ...f,
      dbKey: KEY_MAP[f.key] || f.key,
    }));

    const allDbKeys = dbFields.map(f => f.dbKey);
    const { data: existing } = await supabase.from('site_settings').select('key').in('key', allDbKeys);
    const existingKeys = new Set((existing || []).map((r: { key: string }) => r.key));

    const toUpdate = dbFields.filter(f => existingKeys.has(f.dbKey));
    const toInsert = dbFields.filter(f => !existingKeys.has(f.dbKey));

    let ok = 0;

    for (const f of toUpdate) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: values[f.key] || '' })
        .eq('key', f.dbKey);
      if (!error) ok++;
    }

    for (const f of toInsert) {
      const { error } = await supabase
        .from('site_settings')
        .insert({ key: f.dbKey, value: values[f.key] || '' });
      if (!error) ok++;
    }

    setSaving(false);
    setSavedCount(ok);
    if (ok > 0) {
      onSaved();
      setTimeout(() => onClose(), 1200);
    }
  }, [saving, values, onClose, onSaved]);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  // Logo upload
  const uploadLogo = async (file: File): Promise<string | null> => {
    const fileName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split('.').pop()?.toLowerCase() || 'png'}`;
    const { data: upData, error } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) { console.error('Logo upload error:', error); return null; }
    const { data: urlData } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(upData.path);
    return urlData.publicUrl;
  };

  const handleLogoUpload = async (files: FileList | null, key: string) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setUploadingLogo(true);
    setUploadProgress(0);
    const url = await uploadLogo(file);
    setUploadingLogo(false);
    setUploadProgress(0);
    if (url) {
      handleChange(key, url);
    }
  };

  if (!data) return null;

  // Group fields for better UI
  const textFields = data.fields.filter(f => {
    const dbKey = KEY_MAP[f.key] || f.key;
    const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[f.key];
    return meta && (meta.type === 'text' || meta.type === 'textarea' || meta.type === 'url');
  });
  const colorFields = data.fields.filter(f => {
    const dbKey = KEY_MAP[f.key] || f.key;
    const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[f.key];
    return meta && meta.type === 'color';
  });
  const sizeFields = data.fields.filter(f => {
    const dbKey = KEY_MAP[f.key] || f.key;
    const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[f.key];
    return meta && (meta.type === 'fontsize' || meta.type === 'logodims');
  });
  const logoFields = data.fields.filter(f => {
    const dbKey = KEY_MAP[f.key] || f.key;
    const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[f.key];
    return meta && meta.type === 'logo';
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={panelRef}
        className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20">
              <i className="ri-brush-line text-amber-400 text-xs" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Visual Editor</h3>
              <p className="text-slate-500 text-[10px]">{data.sectionLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-xs" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Logo Upload Section */}
          {logoFields.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logo</h4>
              {logoFields.map((field) => {
                const dbKey = KEY_MAP[field.key] || field.key;
                const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[field.key] || { label: field.key, type: 'logo' as const };
                const logoUrl = values[field.key] || '';
                const isNavbar = dbKey === 'navbar_logo_url';
                const widthKey = isNavbar ? 'navbar_logo_width' : 'footer_logo_width';
                const heightKey = isNavbar ? 'navbar_logo_height' : 'footer_logo_height';
                const width = values[widthKey] || (isNavbar ? '140' : '120');
                const height = values[heightKey] || (isNavbar ? '50' : '40');

                return (
                  <div key={field.key} className="space-y-3">
                    {/* Logo Preview */}
                    <div className="rounded-xl border border-slate-700 bg-[#0D1117] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">{meta.label}</label>
                        {logoUrl && (
                          <button
                            onClick={() => handleChange(field.key, '')}
                            className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Hapus Logo
                          </button>
                        )}
                      </div>
                      {logoUrl ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={logoUrl}
                            alt="Logo preview"
                            className="max-w-full object-contain"
                            style={{ width: `${width}px`, height: `${height}px` }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <p className="text-[10px] text-slate-500">{width}px × {height}px</p>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                            dragOver ? 'border-amber-400 bg-amber-400/5' : 'border-slate-600 hover:border-amber-400/60 hover:bg-amber-400/5'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleLogoUpload(e.dataTransfer.files, field.key); }}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleLogoUpload(e.target.files, field.key)}
                          />
                          {uploadingLogo ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-slate-400 text-xs">Mengupload... {uploadProgress}%</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <i className="ri-upload-cloud-2-line text-2xl text-slate-500" />
                              <span className="text-slate-400 text-sm">Klik atau drag logo ke sini</span>
                              <span className="text-slate-600 text-[10px]">PNG, JPG, WEBP, SVG</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Logo Dimensions */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-medium text-slate-500 mb-1 block">Lebar (px)</label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleChange(widthKey, e.target.value)}
                          min={40}
                          max={400}
                          className="w-full bg-[#0D1117] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-500 mb-1 block">Tinggi (px)</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleChange(heightKey, e.target.value)}
                          min={20}
                          max={200}
                          className="w-full bg-[#0D1117] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Colors Section */}
          {colorFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warna</h4>
              <div className="grid grid-cols-2 gap-3">
                {colorFields.map((field) => {
                  const dbKey = KEY_MAP[field.key] || field.key;
                  const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[field.key] || { label: field.key, type: 'color' as const };
                  const color = values[field.key] || '#FFFFFF';
                  return (
                    <div key={field.key} className="flex items-center gap-3 bg-[#0D1117] border border-slate-700 rounded-xl p-3">
                      <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-slate-600">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <label className="block text-xs font-semibold text-slate-300 truncate">{meta.label}</label>
                        <span className="text-[10px] text-slate-500 font-mono">{color.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Font Sizes Section */}
          {sizeFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ukuran Font</h4>
              {sizeFields.map((field) => {
                const dbKey = KEY_MAP[field.key] || field.key;
                const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[field.key] || { label: field.key, type: 'fontsize' as const, min: 10, max: 96 };
                const val = parseInt(values[field.key] || meta.placeholder || '16', 10);
                const min = meta.min || 10;
                const max = meta.max || 96;
                const previewText = meta.label?.toLowerCase().includes('hero') ? 'Judul Hero' : meta.label?.toLowerCase().includes('cta') ? 'Judul CTA' : 'Sample';
                return (
                  <div key={field.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">{meta.label}</label>
                      <span className="text-xs font-mono text-amber-400 font-bold">{val}px</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={val}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={min}
                        max={max}
                        value={val}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-20 bg-[#0D1117] border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400/60"
                      />
                      <span className="text-[10px] text-slate-500">px</span>
                      {/* Live preview */}
                      <span
                        className="text-slate-300 ml-auto"
                        style={{ fontSize: `${val}px`, lineHeight: '1.2' }}
                      >
                        {previewText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Content Section */}
          {textFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teks & Konten</h4>
              {textFields.map((field) => {
                const dbKey = KEY_MAP[field.key] || field.key;
                const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[field.key] || { label: field.key, type: 'text' as const };
                const isTextarea = meta.type === 'textarea';
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {meta.label}
                    </label>
                    {isTextarea ? (
                      supportsRichText(field.key) ? (
                        <RichTextEditor
                          value={values[field.key] || ''}
                          onChange={(val) => handleChange(field.key, val)}
                          placeholder={meta.placeholder || ''}
                          maxLength={meta.maxLength}
                        />
                      ) : (
                        <textarea
                          value={values[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          maxLength={meta.maxLength || 500}
                          placeholder={meta.placeholder || ''}
                          rows={3}
                          className="w-full bg-[#0D1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
                        />
                      )
                    ) : (
                      <input
                        type={meta.type === 'url' ? 'url' : 'text'}
                        value={values[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        maxLength={meta.maxLength || 200}
                        placeholder={meta.placeholder || ''}
                        className="w-full bg-[#0D1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    )}
                    {meta.maxLength && (
                      <p className="text-[10px] text-slate-600 mt-1 text-right">
                        {(values[field.key] || '').length}/{meta.maxLength}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 shrink-0">
          {savedCount > 0 ? (
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
              <i className="ri-checkbox-circle-line" />
              {savedCount} perubahan disimpan
            </div>
          ) : (
            <span className="text-slate-500 text-[10px]">
              Tekan ESC atau klik luar untuk batal
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || savedCount > 0}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : savedCount > 0 ? (
              <>
                <i className="ri-check-line" />
                Tersimpan
              </>
            ) : (
              <>
                <i className="ri-save-line" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}