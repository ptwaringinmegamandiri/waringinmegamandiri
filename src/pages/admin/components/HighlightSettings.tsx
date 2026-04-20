import { useState, useEffect, useCallback } from 'react';
import { supabase, ProjectRow } from '@/lib/supabase';

const MAX_HIGHLIGHT = 9;

export default function HighlightSettings() {
  const [allProjects, setAllProjects] = useState<ProjectRow[]>([]);
  const [featured, setFeatured] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(id, image_url, sort_order)')
      .order('year', { ascending: false })
      .order('id', { ascending: false });
    if (!error && data) {
      const rows = data as ProjectRow[];
      setAllProjects(rows);
      const feat = rows
        .filter((p) => p.is_featured)
        .sort((a, b) => (a.featured_order ?? 99) - (b.featured_order ?? 99));
      setFeatured(feat);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getCoverImage = (p: ProjectRow) => {
    if (p.project_images && p.project_images.length > 0) {
      const sorted = [...p.project_images].sort((a, b) => a.sort_order - b.sort_order);
      return sorted[0].image_url;
    }
    return p.cover_image || null;
  };

  const isSelected = (id: number) => featured.some((f) => f.id === id);

  const toggleProject = (project: ProjectRow) => {
    if (isSelected(project.id)) {
      setFeatured((prev) => prev.filter((f) => f.id !== project.id));
    } else {
      if (featured.length >= MAX_HIGHLIGHT) {
        showToast(`Maksimal ${MAX_HIGHLIGHT} proyek highlight.`);
        return;
      }
      setFeatured((prev) => [...prev, project]);
    }
  };

  const removeFromFeatured = (id: number) => {
    setFeatured((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragStart = (idx: number) => setDragging(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOver(idx);
  };
  const handleDrop = (dropIdx: number) => {
    if (dragging === null || dragging === dropIdx) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    const updated = [...featured];
    const [removed] = updated.splice(dragging, 1);
    updated.splice(dropIdx, 0, removed);
    setFeatured(updated);
    setDragging(null);
    setDragOver(null);
  };
  const handleDragEnd = () => {
    setDragging(null);
    setDragOver(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get all project IDs to reset
      const { data: allIds } = await supabase.from('projects').select('id');
      if (allIds && allIds.length > 0) {
        // Reset all in batches of 10
        const ids = allIds.map((r: { id: number }) => r.id);
        for (let i = 0; i < ids.length; i += 20) {
          const batch = ids.slice(i, i + 20);
          await supabase
            .from('projects')
            .update({ is_featured: false, featured_order: null })
            .in('id', batch);
        }
      }

      // Set new featured projects
      for (let i = 0; i < featured.length; i++) {
        const { error } = await supabase
          .from('projects')
          .update({ is_featured: true, featured_order: i })
          .eq('id', featured[i].id);
        if (error) throw error;
      }

      setSaving(false);
      showToast('Highlight portofolio berhasil disimpan!');
      fetchData();
    } catch (err) {
      setSaving(false);
      showToast('Gagal menyimpan. Coba lagi.');
      console.error(err);
    }
  };

  const filteredProjects = allProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.building_type.toLowerCase().includes(search.toLowerCase())
  );

  const nonFeaturedFiltered = filteredProjects.filter((p) => !isSelected(p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-black text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-base" />{toast}
        </div>
      )}

      {/* Header info */}
      <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl p-4 flex items-start gap-3">
        <i className="ri-information-line text-amber-400 text-lg mt-0.5 shrink-0" />
        <div>
          <p className="text-amber-300 font-semibold text-sm">Tentang Highlight Portofolio</p>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Pilih hingga <strong className="text-white">9 proyek</strong> yang akan ditampilkan sebagai grid utama di halaman Portofolio. Drag &amp; drop untuk atur urutan. Proyek selain highlight tetap tampil di bawah dalam carousel.
          </p>
        </div>
      </div>

      {/* Selected Highlight Slots */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <i className="ri-star-line text-amber-400" />
            Proyek Highlight
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${featured.length >= MAX_HIGHLIGHT ? 'bg-red-500/20 text-red-400' : 'bg-amber-400/20 text-amber-400'}`}>
              {featured.length}/{MAX_HIGHLIGHT}
            </span>
          </h3>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-5 py-2.5 rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
            ) : (
              <><i className="ri-save-line" /> Simpan Perubahan</>
            )}
          </button>
        </div>

        {/* Slots grid */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: MAX_HIGHLIGHT }).map((_, idx) => {
            const proj = featured[idx];
            const isDragTarget = dragOver === idx;
            const isDraggingThis = dragging === idx;
            return (
              <div
                key={idx}
                draggable={!!proj}
                onDragStart={() => proj && handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={`relative rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                  proj
                    ? isDragTarget
                      ? 'border-amber-400 scale-[1.02]'
                      : isDraggingThis
                      ? 'border-amber-400/50 opacity-50'
                      : 'border-slate-700 hover:border-slate-500'
                    : isDragTarget
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-slate-800 border-dashed bg-[#0D1117]'
                }`}
                style={{ minHeight: '100px' }}
              >
                {/* Slot number badge */}
                <div className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs font-bold">
                  {idx + 1}
                </div>

                {proj ? (
                  <>
                    {/* Project card in slot */}
                    <div className="w-full h-24 bg-slate-800 relative">
                      {getCoverImage(proj) ? (
                        <img
                          src={getCoverImage(proj)!}
                          alt={proj.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="ri-image-line text-slate-600 text-xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <div className="p-2.5 bg-[#0D1117]">
                      <p className="text-white text-xs font-bold truncate leading-tight">{proj.name}</p>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{proj.building_type} · {proj.year}</p>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromFeatured(proj.id)}
                      className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs cursor-pointer transition-colors"
                    >
                      <i className="ri-close-line" />
                    </button>
                    {/* Drag handle hint */}
                    <div className="absolute bottom-2 right-2 z-10 opacity-40">
                      <i className="ri-drag-move-2-line text-slate-400 text-xs" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 gap-1">
                    <i className="ri-add-circle-line text-slate-700 text-xl" />
                    <span className="text-slate-700 text-xs">Slot kosong</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Project picker */}
      <div>
        <h3 className="font-bold text-base text-white flex items-center gap-2 mb-4">
          <i className="ri-list-check-2 text-slate-400" />
          Pilih dari Semua Proyek
          <span className="text-slate-600 text-xs font-normal">({allProjects.length} proyek)</span>
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama proyek, lokasi, atau tipe..."
            className="w-full bg-[#0D1117] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Project list */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {nonFeaturedFiltered.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-8">
              {search ? 'Tidak ada proyek yang cocok.' : 'Semua proyek sudah dipilih sebagai highlight.'}
            </p>
          )}
          {nonFeaturedFiltered.map((p) => {
            const cover = getCoverImage(p);
            const selected = isSelected(p.id);
            const full = featured.length >= MAX_HIGHLIGHT && !selected;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 rounded-xl p-3 border transition-all duration-150 ${
                  selected
                    ? 'border-amber-400/50 bg-amber-400/5'
                    : full
                    ? 'border-slate-800 opacity-40 cursor-not-allowed'
                    : 'border-slate-800 hover:border-slate-600 cursor-pointer'
                }`}
                onClick={() => !full && toggleProject(p)}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  {cover ? (
                    <img src={cover} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-image-line text-slate-600 text-lg" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-slate-500 text-xs truncate mt-0.5">
                    <i className="ri-building-2-line mr-1" />{p.building_type}
                    <span className="mx-1.5 text-slate-700">·</span>
                    <i className="ri-map-pin-line mr-1" />{p.location}
                    <span className="mx-1.5 text-slate-700">·</span>
                    {p.year}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                  p.status === 'Ongoing' ? 'bg-sky-400/15 text-sky-400' : 'bg-green-400/15 text-green-400'
                }`}>{p.status}</span>

                {/* Checkbox */}
                <div className={`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors ${
                  selected ? 'bg-amber-400' : 'border border-slate-600'
                }`}>
                  {selected && <i className="ri-check-line text-black text-xs font-bold" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
