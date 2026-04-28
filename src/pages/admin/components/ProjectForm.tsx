import { useState, useEffect } from 'react';
import { supabase, ProjectRow } from '@/lib/supabase';
import ImageUploader from './ImageUploader';

const BUILDING_TYPES = [
  'Hotel','Apartemen','Ruko','Kantor','Perumahan','Pasar','Mall',
  'Rumah Sakit','Sekolah','Kampus','Gudang','Pabrik','Rumah Ibadah',
  'Marketing Gallery','Club House','Infrastruktur','Lainnya',
];

const IMAGE_POSITIONS = [
  { value: 'top left', label: 'Kiri Atas' },
  { value: 'top center', label: 'Atas' },
  { value: 'top right', label: 'Kanan Atas' },
  { value: 'center left', label: 'Kiri' },
  { value: 'center', label: 'Tengah' },
  { value: 'center right', label: 'Kanan' },
  { value: 'bottom left', label: 'Kiri Bawah' },
  { value: 'bottom center', label: 'Bawah' },
  { value: 'bottom right', label: 'Kanan Bawah' },
];

interface ProjectFormProps {
  project?: ProjectRow | null;
  onSaved: () => void;
  onCancel: () => void;
  **onAiGenerate: (title: string, callback: (desc: string) => void) => void;**
  **isAiLoading: boolean;**
}

type FormData = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at' | 'project_images'>;

const emptyForm: FormData = {
  name: '', building_type: 'Hotel', location: '', year: new Date().getFullYear(),
  status: 'Selesai', work_package: '', unit_count: '', building_area: '',
  floors: '', description: '', cover_image: '', client: '', value: '',
  image_position: 'center',
};

export default function ProjectForm({ project, onSaved, onCancel, onAiGenerate, isAiLoading }: ProjectFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name, building_type: project.building_type,
        location: project.location, year: project.year, status: project.status,
        work_package: project.work_package, unit_count: project.unit_count || '',
        building_area: project.building_area || '', floors: project.floors || '',
        description: project.description, cover_image: project.cover_image || '',
        client: project.client, value: project.value,
        image_position: project.image_position || 'center',
      });
      const imgs = project.project_images
        ? project.project_images.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url)
        : project.cover_image ? [project.cover_image] : [];
      setImages(imgs);
    } else {
      setForm(emptyForm);
      setImages([]);
    }
  }, [project]);

  const set = (key: keyof FormData, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.location || !form.client || !form.value || !form.description) {
      setError('Harap isi semua field yang wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const coverImage = images[0] || '';
      const payload = { ...form, cover_image: coverImage, year: Number(form.year) };

      let projectId: number;
      if (project) {
        const { error: upErr } = await supabase.from('projects').update(payload).eq('id', project.id);
        if (upErr) throw upErr;
        projectId = project.id;
        await supabase.from('project_images').delete().eq('project_id', projectId);
      } else {
        const { data, error: insErr } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
        if (insErr) throw insErr;
        projectId = data!.id;
      }

      if (images.length > 0) {
        const imgRows = images.map((url, idx) => ({
          project_id: projectId, image_url: url, sort_order: idx,
        }));
        const { error: imgErr } = await supabase.from('project_images').insert(imgRows);
        if (imgErr) throw imgErr;
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

  const coverImage = images[0] || '';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
          <i className="ri-error-warning-line mr-2" />{error}
        </div>
      )}

      {/* Foto Proyek */}
      <div>
        <label className={labelCls}>Foto Proyek <span className="text-slate-600">(foto pertama = cover)</span></label>
        <ImageUploader images={images} onChange={setImages} maxImages={10} />
      </div>

      {/* Image Position Picker */}
      {coverImage && (
        <div>
          <label className={labelCls}>
            Fokus Foto Cover
            <span className="text-slate-600 ml-1.5 font-normal">— atur bagian foto yang tampil di card</span>
          </label>
          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-slate-700 shrink-0">
              <img
                src={coverImage}
                alt="Preview"
                className="w-full h-full object-cover transition-all duration-300"
                style={{ objectPosition: form.image_position || 'center' }}
              />
              <div className="absolute inset-0 border-2 border-amber-400/40 rounded-lg pointer-events-none" />
            </div>
            {/* 3x3 Grid Picker */}
            <div>
              <div className="grid grid-cols-3 gap-1 w-24">
                {IMAGE_POSITIONS.map((pos) => {
                  const isActive = (form.image_position || 'center') === pos.value;
                  return (
                    <button
                      key={pos.value}
                      type="button"
                      title={pos.label}
                      onClick={() => set('image_position', pos.value)}
                      className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-current'}`} />
                    </button>
                  );
                })}
              </div>
              <p className="text-slate-600 text-xs mt-2">
                Aktif: <span className="text-amber-400">{IMAGE_POSITIONS.find(p => p.value === (form.image_position || 'center'))?.label}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nama Proyek */}
      <div>
        <label className={labelCls}>Nama Proyek <span className="text-red-400">*</span></label>
        <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Contoh: Hotel Amaris Jakarta" />
      </div>

      {/* Row: Tipe & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tipe Bangunan <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.building_type} onChange={(e) => set('building_type', e.target.value)}>
            {BUILDING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value as 'Selesai' | 'Ongoing')}>
            <option value="Selesai">Selesai</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>
      </div>

      {/* Row: Lokasi & Tahun */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Lokasi <span className="text-red-400">*</span></label>
          <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Contoh: Jakarta Selatan" />
        </div>
        <div>
          <label className={labelCls}>Tahun <span className="text-red-400">*</span></label>
          <input type="number" className={inputCls} value={form.year} onChange={(e) => set('year', e.target.value)} min={1990} max={2100} />
        </div>
      </div>

      {/* Paket Pekerjaan */}
      <div>
        <label className={labelCls}>Paket Pekerjaan <span className="text-red-400">*</span></label>
        <input className={inputCls} value={form.work_package} onChange={(e) => set('work_package', e.target.value)} placeholder="Contoh: Struktur, Arsitektur dan MEP" />
      </div>

      {/* Row: Lantai, Luas, Unit */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Lantai</label>
          <input className={inputCls} value={form.floors} onChange={(e) => set('floors', e.target.value)} placeholder="Contoh: 10 Lantai" />
        </div>
        <div>
          <label className={labelCls}>Luas Bangunan</label>
          <input className={inputCls} value={form.building_area} onChange={(e) => set('building_area', e.target.value)} placeholder="Contoh: 5.000 m²" />
        </div>
        <div>
          <label className={labelCls}>Jumlah Unit</label>
          <input className={inputCls} value={form.unit_count} onChange={(e) => set('unit_count', e.target.value)} placeholder="Contoh: 50 Unit" />
        </div>
      </div>

      {/* Row: Klien & Nilai */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Klien <span className="text-red-400">*</span></label>
          <input className={inputCls} value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Nama perusahaan klien" />
        </div>
        <div>
          <label className={labelCls}>Nilai Kontrak <span className="text-red-400">*</span></label>
          <input className={inputCls} value={form.value} onChange={(e) => set('value', e.target.value)} placeholder="Contoh: Rp 10.000.000.000,-" />
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <div className="flex justify-between items-center mb-1">
  <label className={labelCls}>Deskripsi <span className="text-red-400">*</span></label>
  <button
    type="button"
    onClick={() => onAiGenerate(form.title, (aiDesc) => set('description', aiDesc))}
    disabled={isAiLoading}
    className="text-[10px] bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 px-2 py-1 rounded transition-all disabled:opacity-50"
  >
    {isAiLoading ? '⌛ Sedang Menulis...' : '🪄 Bantu Tulis (AI)'}
  </button>
</div>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Deskripsi singkat proyek..."
          maxLength={500}
        />
        <div className="text-right text-xs text-slate-600 mt-1">{form.description.length}/500</div>
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
