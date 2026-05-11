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

const FIELD_LABELS: Record<string, { label: string; type: 'text' | 'textarea' | 'url'; maxLength?: number; placeholder?: string }> = {
  tagline: { label: 'Tagline', type: 'text', maxLength: 120, placeholder: 'Tagline kecil di atas judul' },
  title: { label: 'Judul Hero', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \n untuk baris baru' },
  subtitle: { label: 'Deskripsi', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi singkat' },
  cta_primary_text: { label: 'Tombol CTA Utama', type: 'text', maxLength: 40, placeholder: 'Teks tombol utama' },
  cta_secondary_text: { label: 'Tombol CTA Sekunder', type: 'text', maxLength: 40, placeholder: 'Teks tombol sekunder' },
  stats_text: { label: 'Teks Stats', type: 'text', maxLength: 120, placeholder: 'Misal: 35+ tahun pengalaman...' },
  services_title: { label: 'Judul Layanan', type: 'text', maxLength: 80, placeholder: 'Misal: Layanan Kami' },
  services_desc: { label: 'Deskripsi Layanan', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi singkat layanan' },
  projects_title: { label: 'Judul Proyek', type: 'text', maxLength: 80, placeholder: 'Misal: Proyek Ongoing' },
  clients_title: { label: 'Judul Klien', type: 'text', maxLength: 120, placeholder: 'Misal: Dipercaya oleh Perusahaan Terkemuka' },
  clients_desc: { label: 'Deskripsi Klien', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi mitra/klien' },
  cta_title: { label: 'Judul CTA', type: 'textarea', maxLength: 200, placeholder: 'Gunakan \n untuk baris baru' },
  cta_desc: { label: 'Deskripsi CTA', type: 'textarea', maxLength: 500, placeholder: 'Deskripsi ajakan' },
};

export default function InlineEditPopup({ data, themeValues, onClose, onSaved }: InlineEditPopupProps) {
  const [values, setValues] = useState<Record<string, string>>();
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
    const initial: Record<string, string> = {};
    data.fields.forEach((f) => {
      initial[f.key] = themeValues[f.key] || f.value || '';
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

    // Get all existing keys to avoid duplicate inserts
    const { data: existing } = await supabase.from('site_settings').select('key').in('key', data.fields.map(f => f.key));
    const existingKeys = new Set((existing || []).map((r: { key: string }) => r.key));

    const toUpdate = data.fields.filter(f => existingKeys.has(f.key));
    const toInsert = data.fields.filter(f => !existingKeys.has(f.key));

    let ok = 0;

    // Update existing
    for (const f of toUpdate) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: values[f.key] || '' })
        .eq('key', f.key);
      if (!error) ok++;
    }

    // Insert new
    for (const f of toInsert) {
      const { error } = await supabase
        .from('site_settings')
        .insert({ key: f.key, value: values[f.key] || '' });
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
            const meta = FIELD_LABELS[field.key] || { label: field.key, type: 'text' as const };
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