import { useState } from 'react';
import { supabase, LegacyProjectRow } from '@/lib/supabase';

interface LegacyProjectFormProps {
  project?: LegacyProjectRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Struktur & Arsitektur',
  'Finishing & Arsitektur Pabrik',
  'Gudang & Fasilitas Pendukung',
  'Ruko Komersial',
  'Rukan Komersial',
  'Shopping Center',
  'Struktur Mall',
  'Struktur Hotel',
  'Finishing Basement',
  'Arsitektur & ME Mall',
  'Common Area Mall',
  'Warehouse & Workshop',
  'Renovasi Hotel',
  'Showroom Otomotif',
  'Gudang Sparepart',
  'Kawasan Otomotif',
  'Gedung Perkantoran',
  'Low Rise Building',
  'Retaining Wall',
  'Stadion & Sarana Olahraga',
  'Gedung Pendidikan',
  'Gedung Sekolah',
  'Renovasi Kampus',
  'Pekerjaan Sipil Mall',
  'Pabrik Industri',
  'Gedung Perbankan',
  'Mall & Retail',
  'Apartemen',
  'Gedung Komersial',
  'Hotel',
  'Struktur High Rise',
  'Renovasi Gedung',
];

export default function LegacyProjectForm({ project, onSaved, onCancel }: LegacyProjectFormProps) {
  const [form, setForm] = useState({
    year: project?.year ?? 2001,
    name: project?.name ?? '',
    client: project?.client ?? '',
    value: project?.value ?? '',
    category: project?.category ?? 'Struktur & Arsitektur',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.client || !form.value) {
      setError('Harap isi nama proyek, klien, dan nilai.');
      return;
    }
    setSaving(true);
    try {
      if (project) {
        const { error: upErr } = await supabase
          .from('legacy_projects')
          .update({
            year: Number(form.year),
            name: form.name,
            client: form.client,
            value: form.value,
            category: form.category,
          })
          .eq('id', project.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase
          .from('legacy_projects')
          .insert({
            year: Number(form.year),
            name: form.name,
            client: form.client,
            value: form.value,
            category: form.category,
          });
        if (insErr) throw insErr;
      }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-[#0D1117] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors';
  const labelCls = 'block text-xs text-slate-400 mb-1.5 font-medium';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
          <i className="ri-error-warning-line mr-2" />{error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tahun <span className="text-red-400">*</span></label>
          <input
            type="number"
            className={inputCls}
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
            min={1990}
            max={2100}
          />
        </div>
        <div>
          <label className={labelCls}>Kategori <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Nama Proyek <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Contoh: Struktur Sunter Point"
        />
      </div>

      <div>
        <label className={labelCls}>Klien <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.client}
          onChange={(e) => set('client', e.target.value)}
          placeholder="Nama perusahaan klien"
        />
      </div>

      <div>
        <label className={labelCls}>Nilai Proyek <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.value}
          onChange={(e) => set('value', e.target.value)}
          placeholder="Contoh: Rp 33.000.000.000"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <><i className="ri-save-line" />{project ? 'Simpan Perubahan' : 'Tambah Proyek'}</>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          Batal
        </button>
      </div>
    </form>
  );
}