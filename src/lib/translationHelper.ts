import { supabase } from '@/lib/supabase';

/** Keys yang TIDAK perlu diterjemahkan: URL, warna hex, angka, sosmed, kontak */
const NON_TRANSLATABLE_PATTERNS = [
  /^https?:\/\//i,          // URLs
  /^#[0-9a-f]{3,8}$/i,     // Hex colors
  /^\d+(\.\d+)?$/,          // Pure numbers
  /^[+\d\s\-()]+$/,         // Phone numbers
  /^[\w.+-]+@[\w-]+\.\w+$/, // Emails
];

/** Keys yang kontennya tidak perlu diterjemahkan (non-text config) */
const NON_TRANSLATABLE_KEYS = new Set([
  'accent_color', 'secondary_color', 'theme_mode',
  'hero_image_url', 'about_bg_url', 'karir_bg_url', 'news_bg_url',
  'portfolio_bg_url', 'kontak_bg_url',
  'navbar_logo_url', 'footer_logo_url',
  'navbar_logo_width', 'navbar_logo_height',
  'footer_logo_width', 'footer_logo_height',
  'favicon_url',
  'hero_title_color', 'hero_subtitle_color', 'hero_title_size', 'hero_subtitle_size',
  'section_title_color', 'section_title_size', 'body_text_color', 'body_text_size',
  'cta_title_color', 'cta_title_size', 'cta_desc_color', 'cta_desc_size',
  'navbar_text_color', 'navbar_brand_size', 'navbar_brand_color', 'navbar_sub_brand_color',
  'footer_text_color', 'footer_text_size',
  'phone', 'phone_alt', 'email', 'email_alt', 'whatsapp',
  'instagram', 'linkedin', 'facebook', 'youtube', 'maps_embed_url',
  'hero_cta_primary_url', 'hero_cta_secondary_url',
  // Client projects count
  'client_card_1_projects', 'client_card_2_projects', 'client_card_3_projects',
  'client_card_4_projects', 'client_card_5_projects', 'client_card_6_projects',
]);

/**
 * Tentukan apakah sebuah key + value layak diterjemahkan secara otomatis.
 */
export function isTranslatableKey(key: string, value: string): boolean {
  // Cek key blacklist
  if (NON_TRANSLATABLE_KEYS.has(key)) return false;
  // Cek suffix _en / _zh — sudah merupakan terjemahan
  if (key.endsWith('_en') || key.endsWith('_zh')) return false;
  // Cek value pattern non-translatable
  const v = value.trim();
  if (!v || v.length < 2) return false;
  return !NON_TRANSLATABLE_PATTERNS.some((rx) => rx.test(v));
}

interface AiConfig {
  ai_provider: string;
  ai_api_key: string;
  ai_model: string;
}

async function fetchAiConfig(): Promise<AiConfig | null> {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['ai_provider', 'ai_api_key', 'ai_model']);
  const map: Record<string, string> = {};
  data?.forEach((r: { key: string; value: string }) => { map[r.key] = r.value || ''; });
  if (!map.ai_api_key || map.ai_api_key.length < 10) return null;
  return {
    ai_provider: map.ai_provider || 'gemini',
    ai_api_key: map.ai_api_key,
    ai_model: map.ai_model || 'gemini-1.5-flash',
  };
}

/**
 * Terjemahkan teks Indonesia ke English & Chinese via Supabase Edge Function ai-chat.
 * Tag khusus seperti [color=#D4AF37]...[/color] dan \n DIPERTAHANKAN.
 * Mengembalikan { en, zh } atau null jika gagal.
 */
export async function translateText(indonesianText: string): Promise<{ en: string; zh: string } | null> {
  if (!indonesianText.trim()) return null;

  const config = await fetchAiConfig();
  if (!config) return null;

  const systemInstruction = `You are a precise professional translator for a Indonesian construction company website (PT Waringin Mega Mandiri). 
Translate the given Indonesian text into BOTH English (en) and Chinese Simplified (zh).

CRITICAL RULES:
1. Preserve ALL custom tags EXACTLY: [color=#HEXCODE]text[/color] — do NOT change the hex code or remove the tags.
2. Preserve ALL line break characters: \\n — keep them in the same positions.
3. Keep proper nouns, brand names, and company names unchanged (e.g., "PT Waringin Mega Mandiri", "Waringin Group").
4. Output ONLY valid JSON in this exact format (no markdown, no explanation):
{"en":"<english translation>","zh":"<chinese translation>"}`;

  try {
    const res = await supabase.functions.invoke('ai-chat', {
      body: {
        messages: [
          {
            role: 'user',
            content: `${systemInstruction}\n\nTranslate this text:\n${indonesianText}`,
          },
        ],
        provider: config.ai_provider,
        model: config.ai_model,
        language: 'en',
      },
    });

    if (res.error) {
      console.warn('[translateText] Edge Function error:', res.error);
      return null;
    }

    const data = res.data as { response?: string };
    const raw = (data.response || '').trim();

    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*"en"[\s\S]*"zh"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[translateText] No JSON found in AI response:', raw.slice(0, 200));
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as { en?: string; zh?: string };
    if (!parsed.en || !parsed.zh) return null;

    return { en: parsed.en, zh: parsed.zh };
  } catch (err) {
    console.warn('[translateText] Failed to translate:', err);
    return null;
  }
}

/**
 * Simpan terjemahan ke Supabase site_settings.
 * Key disimpan dengan suffix: baseKey_en dan baseKey_zh
 */
export async function saveTranslations(
  baseKey: string,
  translations: { en: string; zh: string }
): Promise<void> {
  const entries = [
    { key: `${baseKey}_en`, value: translations.en },
    { key: `${baseKey}_zh`, value: translations.zh },
  ];

  for (const entry of entries) {
    // Check if exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('key')
      .eq('key', entry.key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('site_settings')
        .update({ value: entry.value })
        .eq('key', entry.key);
    } else {
      await supabase
        .from('site_settings')
        .insert({ key: entry.key, value: entry.value });
    }
  }
}

/**
 * Translate satu field dan simpan ke DB secara background (fire-and-forget).
 * Tidak menunggu hasilnya — aman dipanggil setelah save utama.
 */
export function translateAndSaveAsync(baseKey: string, indonesianText: string): void {
  if (!isTranslatableKey(baseKey, indonesianText)) return;

  // Fire and forget
  (async () => {
    try {
      const translations = await translateText(indonesianText);
      if (translations) {
        await saveTranslations(baseKey, translations);
        // Trigger site theme refresh so live preview updates
        window.dispatchEvent(new Event('WMM_SETTINGS_REFRESH'));
      }
    } catch (err) {
      console.warn(`[translateAndSaveAsync] Failed for key "${baseKey}":`, err);
    }
  })();
}
