import { useState, useEffect } from 'react';
import { supabase, NewsRow } from '@/lib/supabase';

interface NewsFormProps {
  news?: NewsRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

const NEWS_CATEGORIES = ['Proyek', 'Perusahaan', 'Kemitraan', 'Sertifikasi', 'Insight'];

type FormData = Omit<NewsRow, 'id' | 'created_at' | 'updated_at'>;

const emptyForm: FormData = {
  slug: '',
  category: 'Proyek',
  title: '',
  excerpt: '',
  image: '',
  author: 'Tim Redaksi WMM',
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  read_time: '3 menit',
  featured: false,
  tags: [],
  content: '',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function NewsForm({ news, onSaved, onCancel }: NewsFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (news) {
      setForm({
        slug: news.slug,
        category: news.category,
        title: news.title,
        excerpt: news.excerpt,
        image: news.image || '',
        author: news.author,
        date: news.date,
        read_time: news.read_time,
        featured: news.featured,
        tags: news.tags || [],
        content: news.content || '',
      });
      setTagsInput((news.tags || []).join(', '));
    } else {
      setForm(emptyForm);
      setTagsInput('');
    }
  }, [news]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleTitleChange = (val: string) => {
    set('title', val);
    if (!news) set('slug', slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.slug || !form.excerpt || !form.author || !form.date) {
      setError('Harap isi semua field yang wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = { ...form, tags: parsedTags };

      if (news) {
        const { error: upErr } = await supabase.from('news').update(payload).eq('id', news.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase.from('news').insert(payload);
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

      {/* Judul */}
      <div>
        <label className={labelCls}>Judul Artikel <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Judul berita..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>Slug URL <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          placeholder="judul-artikel-dalam-url"
        />
        <p className="text-xs text-slate-600 mt-1">Otomatis dibuat dari judul, bisa diedit manual</p>
      </div>

      {/* Row: Kategori & Featured */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Kategori <span className="text-red-400">*</span></label>
          <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {NEWS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Featured</label>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => set('featured', !form.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.featured ? 'bg-amber-400' : 'bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-slate-400">{form.featured ? 'Ya, tampilkan di atas' : 'Tidak'}</span>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Ringkasan (Excerpt) <span className="text-red-400">*</span></label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          placeholder="Ringkasan singkat artikel..."
          maxLength={500}
        />
        <div className="text-right text-xs text-slate-600 mt-1">{form.excerpt.length}/500</div>
      </div>

      {/* URL Gambar */}
      <div>
        <label className={labelCls}>URL Gambar</label>
        <input
          className={inputCls}
          value={form.image}
          onChange={(e) => set('image', e.target.value)}
          placeholder="https://..."
        />
        {form.image && (
          <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-slate-800">
            <img src={form.image} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Row: Penulis & Tanggal */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Penulis <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            value={form.author}
            onChange={(e) => set('author', e.target.value)}
            placeholder="Nama penulis"
          />
        </div>
        <div>
          <label className={labelCls}>Tanggal <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            placeholder="10 Januari 2026"
          />
        </div>
      </div>

      {/* Row: Waktu Baca & Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Estimasi Baca</label>
          <input
            className={inputCls}
            value={form.read_time}
            onChange={(e) => set('read_time', e.target.value)}
            placeholder="5 menit"
          />
        </div>
        <div>
          <label className={labelCls}>Tags <span className="text-slate-600">(pisah dengan koma)</span></label>
          <input
            className={inputCls}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Proyek, Hotel, Jakarta"
          />
        </div>
      </div>

      {/* Konten */}
      <div>
        <label className={labelCls}>Konten Artikel</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={8}
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          placeholder="Isi lengkap artikel..."
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
            <><i className="ri-save-line" />{news ? 'Simpan Perubahan' : 'Tambah Artikel'}</>
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
