import { supabase } from '@/lib/supabase';

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: 'confirm' | 'success' | 'error' | 'image_preview' | 'followup';
  payload?: unknown;
}

export interface ParsedIntent {
  type:
    | 'add_project'
    | 'update_project'
    | 'update_setting'
    | 'add_news'
    | 'update_news'
    | 'add_career'
    | 'update_career'
    | 'delete_project'
    | 'delete_news'
    | 'delete_career'
    | 'list_projects'
    | 'list_news'
    | 'list_careers'
    | 'generate_image'
    | 'help'
    | 'update_theme_color'
    | 'update_hero_content'
    | 'update_sections'
    | 'generate_hero_image'
    | 'followup_data'
    | 'unknown';
  data?: Record<string, unknown>;
  targetName?: string;
  settingKey?: string;
  settingValue?: string;
  imageTarget?: 'project' | 'news';
  imagePrompt?: string;
  themeKey?: string;
  themeValue?: string;
  heroField?: string;
  heroValue?: string;
  sectionsMap?: Record<string, boolean>;
  confidence: 'high' | 'medium' | 'low';
  /* conversational state */
  followUpFor?: ParsedIntent;
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  data?: unknown;
  imageUrl?: string;
  needsFollowUp?: boolean;
  missingFields?: string[];
  followUpFor?: ParsedIntent;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SETTING MAP                                                      */
/* ═══════════════════════════════════════════════════════════════════ */
const SETTING_MAP: Record<string, string> = {
  telepon: 'phone',
  'nomor telepon': 'phone',
  'no telepon': 'phone',
  'no telp': 'phone',
  telpon: 'phone',
  'telepon alternatif': 'phone_alt',
  'no telepon alternatif': 'phone_alt',
  email: 'email',
  surel: 'email',
  'email alternatif': 'email_alt',
  'email kedua': 'email_alt',
  whatsapp: 'whatsapp',
  wa: 'whatsapp',
  'nomor wa': 'whatsapp',
  alamat: 'address',
  'alamat lengkap': 'address',
  'alamat singkat': 'address_short',
  maps: 'maps_embed_url',
  'google maps': 'maps_embed_url',
  'url maps': 'maps_embed_url',
  instagram: 'instagram',
  ig: 'instagram',
  linkedin: 'linkedin',
  facebook: 'facebook',
  fb: 'facebook',
  youtube: 'youtube',
  yt: 'youtube',
  'jam kerja': 'hours_weekdays',
  'jam operasional': 'hours_weekdays',
  'jam weekday': 'hours_weekdays',
  'jam sabtu': 'hours_saturday',
  'jam minggu': 'hours_sunday',
};

const THEME_COLOR_MAP: Record<string, string> = {
  accent: 'accent_color',
  'accent color': 'accent_color',
  'warna utama': 'accent_color',
  'warna accent': 'accent_color',
  'primary color': 'accent_color',
  secondary: 'secondary_color',
  'secondary color': 'secondary_color',
  'warna kedua': 'secondary_color',
  'warna secondary': 'secondary_color',
  'warna bantu': 'secondary_color',
  mode: 'theme_mode',
  'theme mode': 'theme_mode',
  'dark mode': 'theme_mode',
  'light mode': 'theme_mode',
};

const SECTION_MAP: Record<string, string> = {
  hero: 'hero',
  'hero banner': 'hero',
  stats: 'stats',
  'stats bar': 'stats',
  'angka': 'stats',
  services: 'services',
  'layanan': 'services',
  projects: 'projects',
  'proyek': 'projects',
  'featured projects': 'projects',
  clients: 'clients',
  'klien': 'clients',
  'client logos': 'clients',
  cta: 'cta',
  'call to action': 'cta',
};

const BUILDING_TYPE_MAP: Record<string, string> = {
  hotel: 'Hotel',
  apartemen: 'Apartemen',
  ruko: 'Ruko',
  kantor: 'Kantor',
  perumahan: 'Perumahan',
  pasar: 'Pasar',
  mall: 'Mall',
  'rumah sakit': 'Rumah Sakit',
  sekolah: 'Sekolah',
  kampus: 'Kampus',
  gudang: 'Gudang',
  pabrik: 'Pabrik',
  'rumah ibadah': 'Rumah Ibadah',
  'marketing gallery': 'Marketing Gallery',
  'club house': 'Club House',
  infrastruktur: 'Infrastruktur',
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  PROMPT BUILDER for image generation                              */
/* ═══════════════════════════════════════════════════════════════════ */
function buildImagePrompt(name: string, buildingType: string, location: string): string {
  const type = buildingType || 'building';
  const loc = location || 'urban area';
  const base = `A stunning professional architectural photograph of a modern ${type.toLowerCase()} named ${name} located in ${loc}, Indonesia, captured during golden hour with dramatic warm lighting, clean contemporary design with glass facades and geometric concrete structures, construction site background with scaffolding and cranes, professional real estate photography style, high detail, cinematic composition, photorealistic rendering`;
  if (base.length < 150) {
    return `${base}, ultra high resolution, sharp focus, vibrant colors, clear blue sky, tropical vegetation, urban cityscape background, professional architectural visualization for property marketing and portfolio showcase`;
  }
  return base;
}

function buildNewsImagePrompt(title: string, category: string): string {
  const cat = category || 'construction';
  const base = `Professional editorial photograph for a news article titled "${title}" about ${cat} industry in Indonesia, modern construction site with workers in safety helmets, concrete structures and steel beams, golden hour warm lighting, dramatic sky, professional photojournalism style, high detail sharp focus, corporate magazine quality, editorial photography composition`;
  if (base.length < 150) {
    return `${base}, vibrant colors, urban development theme, Southeast Asian cityscape, professional business photography, magazine cover quality, photorealistic rendering with cinematic atmosphere`;
  }
  return base;
}

function getStableDiffusionUrl(prompt: string, width: number, height: number): string {
  const seq = Date.now() + Math.floor(Math.random() * 1000);
  const safePrompt = encodeURIComponent(prompt);
  return `https://readdy.ai/api/search-image?query=${safePrompt}&width=${width}&height=${height}&seq=${seq}&orientation=landscape`;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  ENTITY EXTRACTORS                                                */
/* ═══════════════════════════════════════════════════════════════════ */
function extractQuotedOrAfterKeyword(text: string, keywords: string[]): string | undefined {
  const quoted = text.match(/["']([^"']+)["']/);
  if (quoted) return quoted[1].trim();

  const lowerText = text.toLowerCase();
  const boundaries = [
    'tahun', 'tipe', 'jenis', 'kategori', 'status', 'klien', 'client',
    'nilai', 'value', 'harga', 'kontrak', 'lokasi', 'di', 'untuk',
    'dari', 'dan', 'yang', 'dengan', 'sebagai', 'department', 'divisi',
    'bagian', 'penulis', 'author', 'kategori', 'menjadi', 'jadi',
    'update', 'ganti', 'ubah', 'rubah', 'edit',
  ];

  for (const kw of keywords) {
    const idx = lowerText.indexOf(kw.toLowerCase());
    if (idx !== -1) {
      let after = text.slice(idx + kw.length).trim();
      after = after.replace(/^[:",.\s]+/, '');

      let end = after.length;
      const padded = ' ' + after.toLowerCase() + ' ';
      for (const b of boundaries) {
        const bIdx = padded.indexOf(' ' + b + ' ');
        if (bIdx !== -1 && bIdx - 1 < end) {
          end = bIdx - 1;
        }
      }
      const result = after.slice(0, end).trim();
      if (result.length > 2) return result;
    }
  }
  return undefined;
}

export function extractProjectData(text: string, isUpdate = false): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const name = extractQuotedOrAfterKeyword(text, ['namanya', 'nama proyek', 'nama', 'berjudul', 'judul', 'tentang']);
  if (name) result.name = name;

  const loc = extractQuotedOrAfterKeyword(text, ['lokasi', 'di', 'berlokasi di']);
  if (loc) result.location = loc;

  const yearMatch = text.match(/tahun\s+(\d{4})/);
  if (yearMatch) result.year = parseInt(yearMatch[1], 10);

  const typeMatch = text.match(/(?:tipe|jenis|kategori)\s+(\w+(?:\s+\w+)?)/i);
  if (typeMatch) {
    const t = typeMatch[1].toLowerCase();
    result.building_type = BUILDING_TYPE_MAP[t] || t.charAt(0).toUpperCase() + t.slice(1);
  }

  if (/\bongoing\b|\bberjalan\b|\bsedang dikerjakan\b/i.test(text)) result.status = 'Ongoing';
  else if (/\bselesai\b|\bcompleted\b|\bfinished\b/i.test(text)) result.status = 'Selesai';

  const client = extractQuotedOrAfterKeyword(text, ['klien', 'client', 'untuk', 'dari']);
  if (client) result.client = client;

  const valMatch = text.match(/(?:nilai|value|harga|kontrak)\s+["']?([^"']+?)["']?(?:\s|$|,|\.)/i);
  if (valMatch) result.value = valMatch[1].trim();

  const descMatch = text.match(/(?:deskripsi|description|keterangan)\s+["']?([^"']+?)["']?(?:\s*$|,\s*(tahun|tipe|status|lokasi))/i);
  if (descMatch) result.description = descMatch[1].trim();

  if (!isUpdate) {
    result.work_package = '-';
  }
  return result;
}

export function extractNewsData(text: string, isUpdate = false): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const title = extractQuotedOrAfterKeyword(text, ['judulnya', 'judul', 'berjudul', 'tentang', 'dengan judul']);
  if (title) {
    result.title = title;
    if (!isUpdate) result.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  const cat = extractQuotedOrAfterKeyword(text, ['kategori', 'kategorinya', 'jenis']);
  if (cat) result.category = cat;
  const author = extractQuotedOrAfterKeyword(text, ['penulis', 'author', 'ditulis oleh', 'oleh']);
  if (author) result.author = author;

  if (!isUpdate) {
    result.date = new Date().toISOString().split('T')[0];
    result.read_time = '3 menit';
    result.excerpt = '';
    result.content = '';
    result.featured = false;
    result.tags = [];
    result.image = null;
  }
  return result;
}

export function extractCareerData(text: string, isUpdate = false): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const title = extractQuotedOrAfterKeyword(text, ['judulnya', 'judul', 'posisi', 'jabatan', 'untuk posisi']);
  if (title) result.title = title;
  const dept = extractQuotedOrAfterKeyword(text, ['departemen', 'divisi', 'bagian', 'department']);
  if (dept) result.department = dept;
  const loc = extractQuotedOrAfterKeyword(text, ['lokasi', 'di', 'berlokasi di']);
  if (loc) result.location = loc;
  const type = extractQuotedOrAfterKeyword(text, ['tipe', 'jenis', 'type']);
  if (type) result.type = type;

  const salary = extractQuotedOrAfterKeyword(text, ['gaji', 'salary', 'upah']);
  if (salary) result.salary = salary;

  const level = extractQuotedOrAfterKeyword(text, ['level', 'tingkat', 'grade']);
  if (level) result.level = level;

  if (!isUpdate) {
    result.is_active = true;
    result.salary = result.salary || 'Negosiasi';
    result.deadline = 'Open';
    result.level = result.level || 'Staff';
    result.description = '';
    result.requirements = [];
    result.benefits = [];
    result.tags = [];
  }
  return result;
}

function extractSettingUpdate(text: string): { key?: string; value?: string } {
  const lower = text.toLowerCase();
  for (const [label, dbKey] of Object.entries(SETTING_MAP)) {
    const idx = lower.indexOf(label);
    if (idx !== -1) {
      let after = text.slice(idx + label.length).trim();
      after = after.replace(/^[:",.\s]+/, '').replace(/^(menjadi|jadi|to|dengan|with)\s+/i, '');
      after = after.replace(/^["']|["']$/g, '').trim();
      if (after.length > 0) return { key: dbKey, value: after };
    }
  }
  return {};
}

function extractTargetName(text: string): string | undefined {
  return extractQuotedOrAfterKeyword(text, [
    'namanya', 'nama', 'judul', 'berjudul', 'yang', 'project', 'proyek',
    'artikel', 'berita', 'lowongan', 'karir', 'posisi',
  ]);
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  INTENT DETECTION                                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export function parseIntent(text: string, previousIntent?: ParsedIntent): ParsedIntent {
  const lower = text.toLowerCase().trim();

  /* ── FOLLOW-UP DATA ( conversational ) ─────────────────────── */
  if (previousIntent) {
    if (['add_project','update_project'].includes(previousIntent.type)) {
      const extra = extractProjectData(text, previousIntent.type === 'update_project');
      return { type: 'followup_data', data: extra, followUpFor: previousIntent, confidence: 'high' };
    }
    if (['add_news','update_news'].includes(previousIntent.type)) {
      const extra = extractNewsData(text, previousIntent.type === 'update_news');
      return { type: 'followup_data', data: extra, followUpFor: previousIntent, confidence: 'high' };
    }
    if (['add_career','update_career'].includes(previousIntent.type)) {
      const extra = extractCareerData(text, previousIntent.type === 'update_career');
      return { type: 'followup_data', data: extra, followUpFor: previousIntent, confidence: 'high' };
    }
  }

  if (/^(bantuan|help|cara|panduan|tutorial|apa bisa)/.test(lower)) {
    return { type: 'help', confidence: 'high' };
  }

  // ── GENERATE IMAGE ─────────────────────────────────────────────
  if (/(\b(generate|buatkan|bikin|create)\b.*\b(gambar|image|foto|cover|banner)\b|\b(gambar|image|foto|cover|banner)\b.*\b(generate|buatkan|bikin|create|update)\b)/i.test(lower)) {
    const targetName = extractTargetName(text);
    const isNews = /\b(berita|news|artikel|article)\b/.test(lower);
    const isProject = /\b(proyek|project)\b/.test(lower);
    const target = isNews ? 'news' : isProject ? 'project' : 'project';

    let prompt: string | undefined;
    const promptMatch = text.match(/(?:dengan prompt|promptnya|prompt|deskripsi gambar)[\s:]+["']?([^"']+)["']?/i);
    if (promptMatch) prompt = promptMatch[1].trim();

    return {
      type: 'generate_image',
      targetName,
      imageTarget: target,
      imagePrompt: prompt,
      confidence: targetName ? 'high' : 'medium',
    };
  }

  // ── LIST ───────────────────────────────────────────────────────
  if (/\b(lihat|daftar|list|tampilkan|show)\b/.test(lower) && /\b(proyek|project|projects)\b/.test(lower)) {
    return { type: 'list_projects', confidence: 'high' };
  }
  if (/\b(lihat|daftar|list|tampilkan|show)\b/.test(lower) && /\b(berita|news|artikel)\b/.test(lower)) {
    return { type: 'list_news', confidence: 'high' };
  }
  if (/\b(lihat|daftar|list|tampilkan|show)\b/.test(lower) && /\b(lowongan|karir|career|job|pekerjaan|posisi)\b/.test(lower)) {
    return { type: 'list_careers', confidence: 'high' };
  }

  // ── DELETE ──────────────────────────────────────────────────────
  if (/\b(hapus|delete|remove|buang)\b/.test(lower) && /\b(proyek|project)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'delete_project', targetName: name, confidence: name ? 'high' : 'medium' };
  }
  if (/\b(hapus|delete|remove|buang)\b/.test(lower) && /\b(berita|news|artikel)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'delete_news', targetName: name, confidence: name ? 'high' : 'medium' };
  }
  if (/\b(hapus|delete|remove|buang)\b/.test(lower) && /\b(lowongan|karir|career|job|posisi)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'delete_career', targetName: name, confidence: name ? 'high' : 'medium' };
  }

  // ── UPDATE EXISTING ─────────────────────────────────────────────
  if (/\b(ubah|update|edit|ganti|rubah|revisi|perbarui)\b/.test(lower) && /\b(proyek|project)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'update_project', targetName: name, data: extractProjectData(text, true), confidence: name ? 'high' : 'medium' };
  }
  if (/\b(ubah|update|edit|ganti|rubah|revisi|perbarui)\b/.test(lower) && /\b(berita|news|artikel|article)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'update_news', targetName: name, data: extractNewsData(text, true), confidence: name ? 'high' : 'medium' };
  }
  if (/\b(ubah|update|edit|ganti|rubah|revisi|perbarui)\b/.test(lower) && /\b(lowongan|karir|career|job|posisi)\b/.test(lower)) {
    const name = extractTargetName(text);
    return { type: 'update_career', targetName: name, data: extractCareerData(text, true), confidence: name ? 'high' : 'medium' };
  }

  // ── ADD ─────────────────────────────────────────────────────────
  if (/\b(tambah|buat|add|create|new|insert)\b/.test(lower) && /\b(proyek|project)\b/.test(lower)) {
    return { type: 'add_project', data: extractProjectData(text), confidence: 'high' };
  }
  if (/\b(tambah|buat|add|create|new|insert)\b/.test(lower) && /\b(berita|news|artikel|article)\b/.test(lower)) {
    return { type: 'add_news', data: extractNewsData(text), confidence: 'high' };
  }
  if (/\b(tambah|buat|add|create|new|insert|buka)\b/.test(lower) && /\b(lowongan|karir|career|job|pekerjaan|posisi)\b/.test(lower)) {
    return { type: 'add_career', data: extractCareerData(text), confidence: 'high' };
  }

  // ── SETTINGS ────────────────────────────────────────────────────
  if (/\b(ubah|ganti|update|edit|rubah)\b/.test(lower)) {
    const { key, value } = extractSettingUpdate(text);
    if (key) {
      return { type: 'update_setting', settingKey: key, settingValue: value, confidence: 'high' };
    }
  }

  // THEME COLOR UPDATE
  if (/\b(ubah|ganti|update|edit|set)\b/.test(lower) && /\b(warna|color|theme|mode)\b/.test(lower)) {
    for (const [label, dbKey] of Object.entries(THEME_COLOR_MAP)) {
      if (lower.includes(label)) {
        const hexMatch = text.match(/#[0-9A-Fa-f]{6}/);
        if (hexMatch) return { type: 'update_theme_color', themeKey: dbKey, themeValue: hexMatch[0], confidence: 'high' };
        const afterKeywords = ['jadi', 'menjadi', 'ke', 'to', 'dengan', 'warnanya'];
        for (const kw of afterKeywords) {
          const kwIdx = lower.indexOf(kw);
          if (kwIdx !== -1) {
            let after = text.slice(kwIdx + kw.length).trim().replace(/^[:",.\s]+/, '');
            if (after.length > 0) return { type: 'update_theme_color', themeKey: dbKey, themeValue: after, confidence: 'high' };
          }
        }
      }
    }
  }

  // HERO CONTENT UPDATE
  if (/\b(ubah|ganti|update|edit|set)\b/.test(lower) && /\b(hero|banner)\b/.test(lower)) {
    const fields = [
      { key: 'hero_tagline', labels: ['tagline', 'label atas', 'subtitle atas'] },
      { key: 'hero_title', labels: ['judul', 'title', 'headline'] },
      { key: 'hero_subtitle', labels: ['deskripsi', 'subtitle', 'keterangan', 'penjelasan'] },
    ];
    for (const field of fields) {
      for (const label of field.labels) {
        if (lower.includes(label)) {
          const quoted = text.match(/["']([^"']+)["']/);
          if (quoted) return { type: 'update_hero_content', heroField: field.key, heroValue: quoted[1], confidence: 'high' };
          const jadiIdx = lower.indexOf('jadi');
          if (jadiIdx !== -1) {
            let after = text.slice(jadiIdx + 4).trim().replace(/^[:",.\s]+/, '');
            if (after.length > 0) return { type: 'update_hero_content', heroField: field.key, heroValue: after, confidence: 'high' };
          }
        }
      }
    }
  }

  // GENERATE HERO IMAGE
  if (/\b(generate|buatkan|bikin|create|update|ganti)\b.*\b(gambar|image|foto|cover|banner|hero)\b/i.test(lower) && /\bhero\b/.test(lower)) {
    const prompt = text.match(/(?:dengan prompt|promptnya|prompt|deskripsi gambar|gambar)[\s:]+["']?([^"']+)["']?/i);
    return {
      type: 'generate_hero_image',
      imagePrompt: prompt ? prompt[1].trim() : undefined,
      confidence: prompt ? 'high' : 'medium',
    };
  }

  // SECTIONS VISIBILITY
  if (/\b(sembunyikan|hide|matikan|nonaktif|aktif|tampilkan|show)\b/.test(lower)) {
    const sections: Record<string, boolean> = {};
    for (const [label, key] of Object.entries(SECTION_MAP)) {
      if (lower.includes(label)) {
        sections[key] = /\b(sembunyikan|hide|matikan|nonaktif)\b/.test(lower) ? false : true;
      }
    }
    if (Object.keys(sections).length > 0) {
      return { type: 'update_sections', sectionsMap: sections, confidence: 'high' };
    }
  }

  return { type: 'unknown', confidence: 'low' };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  EXECUTION                                                        */
/* ═══════════════════════════════════════════════════════════════════ */
export async function executeIntent(intent: ParsedIntent): Promise<ExecutionResult> {
  const upsertSetting = async (key: string, value: string) => {
    const { data } = await supabase.from('site_settings').select('key').eq('key', key);
    if (data && data.length > 0) {
      await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('site_settings').insert({ key, value });
    }
  };

  /* ── FOLLOWUP DATA MERGE ──────────────────────────────────────── */
  if (intent.type === 'followup_data' && intent.followUpFor && intent.data) {
    const base = intent.followUpFor;
    const merged: ParsedIntent = {
      ...base,
      data: { ...base.data, ...intent.data },
      confidence: 'high',
    };
    return executeIntent(merged);
  }

  /* ── HELPER: check required fields for add operations ───────── */
  const checkRequiredFields = (fields: string[], labels: Record<string, string>): ExecutionResult | null => {
    const missing = fields.filter((f) => !intent.data || !intent.data[f] || (intent.data[f] as string).toString().trim() === '');
    if (missing.length > 0) {
      const questions = missing.map((f) => labels[f] || f);
      const lastMissing = missing[missing.length - 1];
      return {
        success: false,
        message: `Oke, saya bantu isi datanya. ${questions.map((q, i) => `${i + 1}. ${q}?`).join('\n')}\n\nAtau bisa jawab sekaligus, misal: "nama Hotel ABC, lokasi Jakarta, tipe Hotel".`,
        needsFollowUp: true,
        missingFields: missing,
        followUpFor: intent,
      };
    }
    return null;
  };

  switch (intent.type) {
    /* ═══════════════════════════════════════════════════════════════ */
    case 'generate_image': {
      const targetName = intent.targetName;
      if (!targetName) {
        return { success: false, message: 'Nama proyek/artikel tidak terdeteksi. Contoh: "Generate cover image untuk proyek Hotel ABC" atau "Bikin gambar untuk artikel Proyek Selesai".' };
      }

      const target = intent.imageTarget || 'project';
      let prompt: string;
      let record: { name: string; building_type?: string; location?: string; category?: string; title?: string } | null = null;

      if (target === 'project') {
        const { data } = await supabase
          .from('projects')
          .select('name, building_type, location, cover_image')
          .ilike('name', `%${targetName}%`)
          .maybeSingle();
        if (!data) {
          return { success: false, message: `Proyek "${targetName}" tidak ditemukan.` };
        }
        record = data;
        prompt = intent.imagePrompt || buildImagePrompt(data.name, data.building_type || '', data.location || '');
      } else {
        const { data } = await supabase
          .from('news')
          .select('title, category, image')
          .ilike('title', `%${targetName}%`)
          .maybeSingle();
        if (!data) {
          return { success: false, message: `Artikel "${targetName}" tidak ditemukan.` };
        }
        record = data;
        prompt = intent.imagePrompt || buildNewsImagePrompt(data.title, data.category || '');
      }

      const imageUrl = getStableDiffusionUrl(prompt, 1024, 576);

      if (target === 'project') {
        await supabase.from('projects').update({ cover_image: imageUrl, updated_at: new Date().toISOString() }).eq('name', record.name);
      } else {
        await supabase.from('news').update({ image: imageUrl, updated_at: new Date().toISOString() }).eq('title', record.title);
      }

      return {
        success: true,
        message: `Cover image untuk ${target === 'project' ? 'proyek' : 'artikel'} "${target === 'project' ? record.name : record.title}" berhasil dibuat! Gambar sudah tersimpan dan akan muncul di website.`,
        imageUrl,
      };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'add_project': {
      const payload = intent.data || {};
      const missingCheck = checkRequiredFields(
        ['name', 'location', 'building_type'],
        { name: 'Nama proyeknya apa', location: 'Lokasinya di mana', building_type: 'Tipe bangunannya apa (Hotel, Apartemen, Ruko, dll)' }
      );
      if (missingCheck) return missingCheck;

      payload.status = payload.status || 'Ongoing';
      payload.year = payload.year || new Date().getFullYear();
      payload.client = payload.client || '-';
      payload.value = payload.value || 'Konfidensial';
      payload.work_package = payload.work_package || '-';
      payload.description = payload.description || generateProjectDescription(payload.name as string, payload.building_type as string, payload.location as string);
      payload.cover_image = null;

      const { data, error } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
      if (error) return { success: false, message: `Gagal menambah proyek: ${error.message}` };
      return { success: true, message: `Proyek "${payload.name}" berhasil ditambahkan! ID: ${data?.id ?? '-'}.\n\n📋 Ringkasan yang tersimpan:\n• Nama: ${payload.name}\n• Lokasi: ${payload.location}\n• Tipe: ${payload.building_type}\n• Tahun: ${payload.year}\n• Status: ${payload.status}\n\nKamu bisa edit detail lengkap di tab Proyek.`, data };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'update_project': {
      if (!intent.targetName) {
        return { success: false, message: 'Nama proyek tidak terdeteksi. Contoh: "Ubah proyek Hotel ABC lokasi jadi Bandung tahun 2026".', needsFollowUp: true, missingFields: ['targetName'], followUpFor: intent };
      }
      const { data: found } = await supabase.from('projects').select('id, name').ilike('name', `%${intent.targetName}%`);
      if (!found || found.length === 0) {
        return { success: false, message: `Proyek "${intent.targetName}" tidak ditemukan.` };
      }
      if (found.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${found.length} proyek mirip. Spesifikasikan nama lengkapnya:\n${found.map((d: { name: string }) => `- ${d.name}`).join('\n')}`,
        };
      }
      const updates = { ...intent.data, updated_at: new Date().toISOString() };
      Object.keys(updates).forEach((k) => {
        if (updates[k] === undefined || updates[k] === null || updates[k] === '') delete updates[k];
      });
      if (Object.keys(updates).length <= 1) {
        return { success: false, message: 'Tidak ada perubahan yang terdeteksi. Sebutkan data yang mau diubah, contoh: "Ubah proyek Hotel ABC lokasi jadi Bandung".' };
      }
      const { error } = await supabase.from('projects').update(updates).eq('id', found[0].id);
      if (error) return { success: false, message: `Gagal update: ${error.message}` };
      const changed = Object.keys(updates).filter((k) => k !== 'updated_at').join(', ');
      return { success: true, message: `Proyek "${found[0].name}" berhasil diperbarui! Field yang diubah: ${changed}.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'add_news': {
      const payload = intent.data || {};
      const missingCheck = checkRequiredFields(
        ['title'],
        { title: 'Judul artikelnya apa' }
      );
      if (missingCheck) return missingCheck;

      payload.slug = payload.slug || (payload.title as string).toLowerCase().replace(/\s+/g, '-');
      payload.date = payload.date || new Date().toISOString().split('T')[0];
      payload.category = payload.category || 'Umum';
      payload.author = payload.author || 'Admin';
      payload.read_time = '3 menit';
      payload.excerpt = payload.excerpt || generateNewsExcerpt(payload.title as string, payload.category as string);
      payload.content = payload.content || payload.excerpt;
      payload.featured = false;
      payload.tags = [];
      payload.image = null;

      const { data, error } = await supabase.from('news').insert(payload).select('id').maybeSingle();
      if (error) return { success: false, message: `Gagal menambah artikel: ${error.message}` };
      return { success: true, message: `Artikel "${payload.title}" berhasil ditambahkan! ID: ${data?.id ?? '-'}`, data };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'update_news': {
      if (!intent.targetName) {
        return { success: false, message: 'Judul artikel tidak terdeteksi. Contoh: "Ubah artikel Proyek Baru kategori jadi Pembangunan".' };
      }
      const { data: found } = await supabase.from('news').select('id, title').ilike('title', `%${intent.targetName}%`);
      if (!found || found.length === 0) {
        return { success: false, message: `Artikel "${intent.targetName}" tidak ditemukan.` };
      }
      if (found.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${found.length} artikel mirip. Spesifikasikan judul lengkapnya:\n${found.map((d: { title: string }) => `- ${d.title}`).join('\n')}`,
        };
      }
      const updates = { ...intent.data, updated_at: new Date().toISOString() };
      Object.keys(updates).forEach((k) => {
        if (updates[k] === undefined || updates[k] === null || updates[k] === '') delete updates[k];
      });
      if (Object.keys(updates).length <= 1) {
        return { success: false, message: 'Tidak ada perubahan yang terdeteksi. Sebutkan data yang mau diubah.' };
      }
      const { error } = await supabase.from('news').update(updates).eq('id', found[0].id);
      if (error) return { success: false, message: `Gagal update: ${error.message}` };
      const changed = Object.keys(updates).filter((k) => k !== 'updated_at').join(', ');
      return { success: true, message: `Artikel "${found[0].title}" berhasil diperbarui! Field yang diubah: ${changed}.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'add_career': {
      const payload = intent.data || {};
      const missingCheck = checkRequiredFields(
        ['title'],
        { title: 'Posisi/judul lowongannya apa' }
      );
      if (missingCheck) return missingCheck;

      payload.department = payload.department || 'Umum';
      payload.location = payload.location || 'Jakarta';
      payload.type = payload.type || 'Full-time';
      payload.level = payload.level || 'Staff';
      payload.salary = payload.salary || 'Negosiasi';
      payload.deadline = 'Open';
      payload.is_active = true;
      payload.description = payload.description || generateJobDescription(payload.title as string, payload.department as string);
      payload.requirements = [];
      payload.benefits = [];
      payload.tags = [];

      const { data, error } = await supabase.from('careers').insert(payload).select('id').maybeSingle();
      if (error) return { success: false, message: `Gagal menambah lowongan: ${error.message}` };
      return { success: true, message: `Lowongan "${payload.title}" berhasil ditambahkan! ID: ${data?.id ?? '-'}`, data };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'update_career': {
      if (!intent.targetName) {
        return { success: false, message: 'Judul posisi tidak terdeteksi. Contoh: "Ubah lowongan Site Manager gaji jadi 15 juta".' };
      }
      const { data: found } = await supabase.from('careers').select('id, title').ilike('title', `%${intent.targetName}%`);
      if (!found || found.length === 0) {
        return { success: false, message: `Lowongan "${intent.targetName}" tidak ditemukan.` };
      }
      if (found.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${found.length} lowongan mirip. Spesifikasikan judul lengkapnya:\n${found.map((d: { title: string }) => `- ${d.title}`).join('\n')}`,
        };
      }
      const updates = { ...intent.data, updated_at: new Date().toISOString() };
      Object.keys(updates).forEach((k) => {
        if (updates[k] === undefined || updates[k] === null || updates[k] === '') delete updates[k];
      });
      if (Object.keys(updates).length <= 1) {
        return { success: false, message: 'Tidak ada perubahan yang terdeteksi. Sebutkan data yang mau diubah.' };
      }
      const { error } = await supabase.from('careers').update(updates).eq('id', found[0].id);
      if (error) return { success: false, message: `Gagal update: ${error.message}` };
      const changed = Object.keys(updates).filter((k) => k !== 'updated_at').join(', ');
      return { success: true, message: `Lowongan "${found[0].title}" berhasil diperbarui! Field yang diubah: ${changed}.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'update_setting': {
      if (!intent.settingKey) {
        return { success: false, message: 'Field pengaturan tidak dikenali. Coba sebutkan lebih spesifik, misal: "Ubah nomor telepon jadi 021-573-8001".' };
      }
      const { error } = await supabase
        .from('site_settings')
        .update({ value: intent.settingValue || '', updated_at: new Date().toISOString() })
        .eq('key', intent.settingKey);
      if (error) return { success: false, message: `Gagal update pengaturan: ${error.message}` };
      return { success: true, message: 'Pengaturan berhasil diperbarui dan langsung berlaku di website!' };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'delete_project': {
      if (!intent.targetName) {
        return { success: false, message: 'Nama proyek tidak terdeteksi. Tolong sebutkan nama proyek yang mau dihapus.' };
      }
      const { data } = await supabase.from('projects').select('id, name').ilike('name', `%${intent.targetName}%`);
      if (!data || data.length === 0) {
        return { success: false, message: `Proyek dengan nama "${intent.targetName}" tidak ditemukan.` };
      }
      if (data.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${data.length} proyek dengan nama mirip. Tolong spesifikasikan nama lengkapnya:\n${data.map((d: { name: string }) => `- ${d.name}`).join('\n')}`,
        };
      }
      const { error } = await supabase.from('projects').delete().eq('id', data[0].id);
      if (error) return { success: false, message: `Gagal menghapus: ${error.message}` };
      return { success: true, message: `Proyek "${data[0].name}" berhasil dihapus.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'delete_news': {
      if (!intent.targetName) {
        return { success: false, message: 'Judul artikel tidak terdeteksi. Tolong sebutkan judul artikel yang mau dihapus.' };
      }
      const { data } = await supabase.from('news').select('id, title').ilike('title', `%${intent.targetName}%`);
      if (!data || data.length === 0) {
        return { success: false, message: `Artikel dengan judul "${intent.targetName}" tidak ditemukan.` };
      }
      if (data.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${data.length} artikel dengan judul mirip. Tolong spesifikasikan judul lengkapnya:\n${data.map((d: { title: string }) => `- ${d.title}`).join('\n')}`,
        };
      }
      const { error } = await supabase.from('news').delete().eq('id', data[0].id);
      if (error) return { success: false, message: `Gagal menghapus: ${error.message}` };
      return { success: true, message: `Artikel "${data[0].title}" berhasil dihapus.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'delete_career': {
      if (!intent.targetName) {
        return { success: false, message: 'Judul posisi tidak terdeteksi. Tolong sebutkan posisi yang mau dihapus.' };
      }
      const { data } = await supabase.from('careers').select('id, title').ilike('title', `%${intent.targetName}%`);
      if (!data || data.length === 0) {
        return { success: false, message: `Lowongan dengan posisi "${intent.targetName}" tidak ditemukan.` };
      }
      if (data.length > 1) {
        return {
          success: false,
          message: `Ditemukan ${data.length} lowongan dengan judul mirip. Tolong spesifikasikan judul lengkapnya:\n${data.map((d: { title: string }) => `- ${d.title}`).join('\n')}`,
        };
      }
      const { error } = await supabase.from('careers').delete().eq('id', data[0].id);
      if (error) return { success: false, message: `Gagal menghapus: ${error.message}` };
      return { success: true, message: `Lowongan "${data[0].title}" berhasil dihapus.` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'list_projects': {
      const { data, error } = await supabase.from('projects').select('id, name, location, year, status, building_type').order('year', { ascending: false });
      if (error) return { success: false, message: `Gagal mengambil data: ${error.message}` };
      if (!data || data.length === 0) return { success: true, message: 'Belum ada proyek di database.' };
      const list = data
        .map((p: { name: string; location: string; year: number; status: string; building_type: string }) => `• ${p.name} (${p.building_type}, ${p.location}, ${p.year}) — ${p.status}`)
        .join('\n');
      return { success: true, message: `Ditemukan ${data.length} proyek:\n${list}` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'list_news': {
      const { data, error } = await supabase.from('news').select('id, title, category, date, featured').order('id', { ascending: false });
      if (error) return { success: false, message: `Gagal mengambil data: ${error.message}` };
      if (!data || data.length === 0) return { success: true, message: 'Belum ada artikel di database.' };
      const list = data
        .map((n: { title: string; category: string; date: string; featured: boolean }) => `• ${n.title} (${n.category}, ${n.date})${n.featured ? ' ⭐' : ''}`)
        .join('\n');
      return { success: true, message: `Ditemukan ${data.length} artikel:\n${list}` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'list_careers': {
      const { data, error } = await supabase.from('careers').select('id, title, department, location, is_active').order('id', { ascending: false });
      if (error) return { success: false, message: `Gagal mengambil data: ${error.message}` };
      if (!data || data.length === 0) return { success: true, message: 'Belum ada lowongan di database.' };
      const list = data
        .map((c: { title: string; department: string; location: string; is_active: boolean }) => `• ${c.title} (${c.department}, ${c.location})${c.is_active ? ' ✅' : ' ⏸️'}`)
        .join('\n');
      return { success: true, message: `Ditemukan ${data.length} lowongan:\n${list}` };
    }

    /* ═══════════════════════════════════════════════════════════════ */
    case 'help':
      return {
        success: true,
        message: `Halo! Saya AI Admin Copilot WMM. Berikut yang bisa saya bantu:

✏️ TAMBAH KONTEN (conversational — bisa nanya balik!)
• "Tambah proyek" → Saya akan tanya nama, lokasi, tipe
• "Buat artikel" → Saya akan tanya judul dan kategori
• "Tambah lowongan" → Saya akan tanya posisi dan departemen

📝 EDIT KONTEN YANG ADA
• "Ubah proyek Hotel ABC lokasi jadi Bandung"
• "Update artikel Proyek Baru kategori jadi Pembangunan"
• "Edit lowongan Site Manager gaji jadi 15 juta"

🎨 TEMA & LAYOUT
• "Ubah warna accent jadi merah" → #EF4444
• "Ganti judul hero jadi Kontraktor Terbaik"
• "Sembunyikan stats bar" → section ilang
• "Generate gambar hero dengan prompt ..."

🖼️ GENERATE GAMBAR
• "Generate cover image untuk proyek Hotel ABC"
• "Bikin gambar untuk artikel tentang proyek X"

⚙️ UPDATE PENGATURAN
• "Ubah nomor telepon jadi 021-573-8001"
• "Ganti email jadi info@wmm.co.id"

📋 LIHAT DATA
• "Lihat semua proyek" • "Daftar berita" • "List lowongan"

🗑️ HAPUS DATA
• "Hapus proyek Hotel ABC" • "Delete artikel tentang proyek X"

Saya akan langsung menjalankan perintahmu ke database. Kalau ada data yang kurang, saya akan nanya balik!`,
      };

    case 'generate_hero_image': {
      const prompt = intent.imagePrompt || 'modern construction site golden hour Jakarta Indonesia, professional architectural photography, wide angle, dramatic sky, warm lighting';
      const safePrompt = encodeURIComponent(prompt);
      const seq = Date.now() + Math.floor(Math.random() * 1000);
      const imageUrl = `https://readdy.ai/api/search-image?query=${safePrompt}&width=1920&height=1080&seq=${seq}&orientation=landscape`;
      await upsertSetting('hero_image_url', imageUrl);
      return {
        success: true,
        message: `Gambar hero berhasil di-generate dan tersimpan! Website langsung pakai gambar baru.`,
        imageUrl,
      };
    }

    case 'update_hero_content': {
      if (!intent.heroField || !intent.heroValue) {
        return { success: false, message: 'Konten hero tidak terdeteksi. Contoh: "Ubah judul hero jadi \'Kontraktor Terbaik\'" atau "Ganti deskripsi hero jadi PT WMM adalah...".' };
      }
      await upsertSetting(intent.heroField, intent.heroValue);
      const labelMap: Record<string, string> = {
        hero_tagline: 'Tagline',
        hero_title: 'Judul',
        hero_subtitle: 'Deskripsi',
        hero_cta_primary_text: 'CTA Primary',
        hero_cta_secondary_text: 'CTA Secondary',
      };
      return {
        success: true,
        message: `Hero ${labelMap[intent.heroField] || intent.heroField} berhasil diubah menjadi "${intent.heroValue}" dan langsung tampil di website!`,
      };
    }

    case 'update_theme_color': {
      if (!intent.themeKey) {
        return { success: false, message: 'Field warna tidak dikenali. Coba: "Ubah warna accent jadi #EF4444" atau "Ganti secondary color jadi biru".' };
      }
      let colorValue = intent.themeValue || '#3B82F6';
      const namedColors: Record<string, string> = {
        merah: '#EF4444', red: '#EF4444',
        hijau: '#10B981', green: '#10B981',
        biru: '#3B82F6', blue: '#3B82F6',
        kuning: '#F59E0B', yellow: '#F59E0B',
        ungu: '#8B5CF6', purple: '#8B5CF6',
        oranye: '#FB923C', orange: '#FB923C',
        pink: '#EC4899', merahmuda: '#EC4899',
        cyan: '#06B6D4', teal: '#14B8A6',
        hitam: '#000000', putih: '#FFFFFF',
        abu: '#6B7280', grey: '#6B7280',
        coklat: '#92400E', brown: '#92400E',
      };
      const lowerColor = colorValue.toLowerCase();
      if (namedColors[lowerColor]) colorValue = namedColors[lowerColor];
      await upsertSetting(intent.themeKey, colorValue);
      const labelMap: Record<string, string> = {
        accent_color: 'Accent',
        secondary_color: 'Secondary',
        theme_mode: 'Mode',
      };
      return {
        success: true,
        message: `${labelMap[intent.themeKey] || 'Warna'} berhasil diubah menjadi "${colorValue}" dan langsung berlaku di website!`,
      };
    }

    case 'update_sections': {
      if (!intent.sectionsMap) {
        return { success: false, message: 'Section tidak terdeteksi. Contoh: "Sembunyikan stats bar" atau "Tampilkan services section".' };
      }
      const results: string[] = [];
      for (const [key, visible] of Object.entries(intent.sectionsMap)) {
        await upsertSetting(key, visible ? 'true' : 'false');
        const labelMap: Record<string, string> = {
          hero: 'Hero Banner',
          stats: 'Stats Bar',
          services: 'Services',
          projects: 'Featured Projects',
          clients: 'Clients',
          cta: 'CTA Section',
        };
        results.push(`${labelMap[key] || key}: ${visible ? 'ditampilkan' : 'disembunyikan'}`);
      }
      return {
        success: true,
        message: `Section di homepage berhasil diubah:\n${results.map(r => `• ${r}`).join('\n')}`,
      };
    }

    default:
      return { success: false, message: 'Maaf, saya belum mengerti perintah tersebut. Ketik "bantuan" untuk lihat command yang tersedia.' };
  }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  AUTO GENERATE DESCRIPTIONS                                       */
/* ═══════════════════════════════════════════════════════════════════ */
function generateProjectDescription(name: string, buildingType: string, location: string): string {
  const type = buildingType || 'bangunan';
  const loc = location || 'Indonesia';
  const descs = [
    `${name} adalah proyek ${type.toLowerCase()} skala menengah yang berlokasi di ${loc}. Proyek ini mencakup pekerjaan struktur, arsitektur, MEP, dan finishing dengan standar kualitas tinggi. Dikerjakan oleh tim profesional PT Waringin Mega Mandiri dengan komitmen ketepatan waktu dan keselamatan kerja.`,
    `Proyek ${name} merupakan pengembangan ${type.toLowerCase()} modern di kawasan ${loc}. Meliputi konstruksi lengkap dari fondasi hingga handover, dengan penerapan teknologi konstruksi terkini dan manajemen proyek berbasis digital.`,
    `${name} adalah salah satu proyek unggulan di ${loc} dalam kategori ${type.toLowerCase()}. Dibangun dengan standar internasional, proyek ini menunjukkan keahlian WMM dalam menangani proyek kompleks dengan hasil berkualitas.`,
  ];
  return descs[Math.floor(Math.random() * descs.length)];
}

function generateNewsExcerpt(title: string, category: string): string {
  return `Artikel terbaru tentang ${title} dalam kategori ${category}. Informasi ini membahas perkembangan terkini di industri konstruksi Indonesia dan kontribusi PT Waringin Mega Mandiri dalam proyek-proyek strategis nasional.`;
}

function generateJobDescription(title: string, department: string): string {
  return `Kami membuka lowongan untuk posisi ${title} di departemen ${department}. Posisi ini bertanggung jawab dalam mengelola dan menjalankan tugas operasional sesuai dengan standar perusahaan. Kandidat ideal memiliki pengalaman relevan, kemampuan komunikasi baik, dan semangat kerja tinggi.`;
}