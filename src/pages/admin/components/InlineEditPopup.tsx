import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface InlineEditField {
  key: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'url';
  maxLength?: number;
  placeholder?: string;
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

/* Map HTML data-editable-fields key → actual DB key in site_settings */
const KEY_MAP: Record<string, string> = {
  tagline: 'hero_tagline',
  title: 'hero_title',
  subtitle: 'hero_subtitle',
  cta_primary_text: 'cta_primary_text',
  cta_secondary_text: 'cta_secondary_text',
};

/* Display labels for known keys */
const FIELD_LABELS: Record<string, { label: string; type: 'text' | 'textarea' | 'url'; maxLength?: number; placeholder?: string }> = {
  hero_tagline: { label: 'Tagline', type: 'text', maxLength: 120, placeholder: 'Tagline kecil di atas judul' },
  hero_title: { label: 'Judul Hero', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \\n untuk baris baru' },
  hero_subtitle: { label: 'Deskripsi Hero', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi singkat hero' },
  hero_cta_primary_text: { label: 'Tombol CTA Primary Hero', type: 'text', maxLength: 40, placeholder: 'Teks tombol utama hero' },
  hero_cta_secondary_text: { label: 'Tombol CTA Secondary Hero', type: 'text', maxLength: 40, placeholder: 'Teks tombol sekunder hero' },
  stats_text: { label: 'Teks Stats', type: 'text', maxLength: 120, placeholder: 'Misal: 35+ tahun pengalaman...' },
  services_title: { label: 'Judul Layanan', type: 'text', maxLength: 80, placeholder: 'Misal: Layanan Kami' },
  services_desc: { label: 'Deskripsi Layanan', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi singkat layanan' },
  projects_title: { label: 'Judul Proyek', type: 'text', maxLength: 80, placeholder: 'Misal: Proyek Ongoing' },
  clients_title: { label: 'Judul Klien', type: 'text', maxLength: 120, placeholder: 'Misal: Dipercaya oleh Perusahaan Terkemuka' },
  clients_desc: { label: 'Deskripsi Klien', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi mitra/klien' },
  cta_title: { label: 'Judul CTA', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \\n untuk baris baru' },
  cta_desc: { label: 'Deskripsi CTA', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi ajakan' },
  cta_primary_text: { label: 'Tombol CTA Primary', type: 'text', maxLength: 40, placeholder: 'Teks tombol CTA primary' },
  cta_secondary_text: { label: 'Tombol CTA Secondary', type: 'text', maxLength: 40, placeholder: 'Teks tombol CTA sekunder' },
};

export default function InlineEditPopup({ data, themeValues = {}, onClose, onSaved }: InlineEditPopupProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
    const initial: Record<string, string> = {};
    data.fields.forEach((f) => {
      // Map HTML key to DB key for lookup, then back to original key for display
      const dbKey = KEY_MAP[f.key] || f.key;
      initial[f.key] = themeValues[dbKey] || '';
    });
    setValues(initial);
    setSavedCount(0);
  }, [data, themeValues]);

  // Close on ESC
  useEffect(() => {
    if (!data) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [data, onClose]);

  // Close on click outside
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
    if (!data || saving) return;
    setSaving(true);

    // Map each field's key to its DB key for saving
    const dbFields = data.fields.map(f => ({
      ...f,
      dbKey: KEY_MAP[f.key] || f.key,
    }));

    // Get all existing keys to avoid duplicate inserts
    const allDbKeys = dbFields.map(f => f.dbKey);
    const { data: existing } = await supabase.from('site_settings').select('key').in('key', allDbKeys);
    const existingKeys = new Set((existing || []).map((r: { key: string }) => r.key));

    const toUpdate = dbFields.filter(f => existingKeys.has(f.dbKey));
    const toInsert = dbFields.filter(f => !existingKeys.has(f.dbKey));

    let ok = 0;

    // Update existing
    for (const f of toUpdate) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: values[f.key] || '' })
        .eq('key', f.dbKey);
      if (!error) ok++;
    }

    // Insert new
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
  }, [data, saving, values, onClose, onSaved]);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={panelRef}
        className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20">
              <i className="ri-edit-line text-amber-400 text-xs" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Edit Langsung</h3>
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {data.fields.map((field) => {
            // Lookup by DB key first, then fallback to original key
            const dbKey = KEY_MAP[field.key] || field.key;
            const meta = FIELD_LABELS[dbKey] || FIELD_LABELS[field.key] || { label: field.key, type: 'text' as const };
            const isTextarea = meta.type === 'textarea';
            return (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {meta.label}
                </label>
                {isTextarea ? (
                  <textarea
                    value={values[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    maxLength={meta.maxLength || 500}
                    placeholder={meta.placeholder || ''}
                    rows={3}
                    className="w-full bg-[#0D1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
                  />
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