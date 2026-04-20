import { useState, useEffect } from 'react';
import { supabase, CareerRow } from '@/lib/supabase';

interface CareerFormProps {
  career?: CareerRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

const DEPARTMENTS = [
  'Manajemen Proyek', 'Engineering', 'Teknologi & Inovasi', 'Estimasi & Biaya',
  'Health, Safety & Environment', 'Desain & Drafting', 'Keuangan & Akuntansi',
  'HRD & Umum', 'Procurement', 'Lainnya',
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const JOB_LEVELS = ['Junior', 'Junior – Mid', 'Mid-Level', 'Senior', 'Manager', 'Director'];

type FormData = Omit<CareerRow, 'id' | 'created_at' | 'updated_at'>;

const emptyForm: FormData = {
  title: '',
  department: 'Engineering',
  location: 'Jakarta Selatan',
  type: 'Full-time',
  level: 'Mid-Level',
  salary: '',
  deadline: '',
  description: '',
  requirements: [],
  benefits: [],
  tags: [],
  is_active: true,
};

export default function CareerForm({ career, onSaved, onCancel }: CareerFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [requirementsInput, setRequirementsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (career) {
      setForm({
        title: career.title,
        department: career.department,
        location: career.location,
        type: career.type,
        level: career.level,
        salary: career.salary,
        deadline: career.deadline,
        description: career.description,
        requirements: career.requirements || [],
        benefits: career.benefits || [],
        tags: career.tags || [],
        is_active: career.is_active,
      });
      setRequirementsInput((career.requirements || []).join('\n'));
      setBenefitsInput((career.benefits || []).join('\n'));
      setTagsInput((career.tags || []).join(', '));
    } else {
      setForm(emptyForm);
      setRequirementsInput('');
      setBenefitsInput('');
      setTagsInput('');
    }
  }, [career]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.department || !form.location || !form.salary || !form.deadline || !form.description) {
      setError('Harap isi semua field yang wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const parsedRequirements = requirementsInput.split('\n').map((r) => r.trim()).filter(Boolean);
      const parsedBenefits = benefitsInput.split('\n').map((b) => b.trim()).filter(Boolean);
      const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const payload = {
        ...form,
        requirements: parsedRequirements,
        benefits: parsedBenefits,
        tags: parsedTags,
      };

      if (career) {
        const { error: upErr } = await supabase.from('careers').update(payload).eq('id', career.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase.from('careers').insert(payload);
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

      {/* Judul Posisi */}
      <div>
        <label className={labelCls}>Judul Posisi <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Contoh: Site Engineer (Struktur)"
        />
      </div>

      {/* Row: Departemen & Lokasi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Departemen <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.department} onChange={(e) => set('department', e.target.value)}>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Lokasi <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Jakarta Selatan"
          />
        </div>
      </div>

      {/* Row: Tipe & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tipe Pekerjaan <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Level <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.level} onChange={(e) => set('level', e.target.value)}>
            {JOB_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Row: Gaji & Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Range Gaji <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            value={form.salary}
            onChange={(e) => set('salary', e.target.value)}
            placeholder="Rp 8.000.000 – 13.000.000"
          />
        </div>
        <div>
          <label className={labelCls}>Deadline Lamaran <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            placeholder="30 April 2026"
          />
        </div>
      </div>

      {/* Status Aktif */}
      <div>
        <label className={labelCls}>Status Lowongan</label>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => set('is_active', !form.is_active)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.is_active ? 'bg-amber-400' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-slate-400">{form.is_active ? 'Aktif — tampil di halaman karir' : 'Nonaktif — disembunyikan'}</span>
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className={labelCls}>Deskripsi Pekerjaan <span className="text-red-400">*</span></label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Deskripsi tanggung jawab posisi ini..."
          maxLength={500}
        />
        <div className="text-right text-xs text-slate-600 mt-1">{form.description.length}/500</div>
      </div>

      {/* Requirements */}
      <div>
        <label className={labelCls}>Persyaratan <span className="text-slate-600">(satu per baris)</span></label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={5}
          value={requirementsInput}
          onChange={(e) => setRequirementsInput(e.target.value)}
          placeholder={`Minimal S1 Teknik Sipil\nPengalaman 3+ tahun\nMemiliki sertifikasi K3`}
        />
      </div>

      {/* Benefits */}
      <div>
        <label className={labelCls}>Benefit <span className="text-slate-600">(satu per baris)</span></label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          value={benefitsInput}
          onChange={(e) => setBenefitsInput(e.target.value)}
          placeholder={`BPJS Kesehatan & Ketenagakerjaan\nBonus Proyek\nAsuransi Jiwa`}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelCls}>Tags <span className="text-slate-600">(pisah dengan koma)</span></label>
        <input
          className={inputCls}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Struktur, Lapangan, Engineering"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <><i className="ri-save-line" />{career ? 'Simpan Perubahan' : 'Tambah Lowongan'}</>
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
