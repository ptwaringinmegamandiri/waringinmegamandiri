import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Application {
  id: number;
  career_id?: number;
  posisi: string;
  departemen?: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string;
  pendidikan_terakhir?: string;
  pengalaman_kerja?: string;
  linkedin_portfolio?: string;
  motivasi?: string;
  link_cv?: string;
  status: string;
  notes?: string;
  created_at: string;
}

const STATUS_OPTIONS = ['Baru', 'Ditinjau', 'Interview', 'Diterima', 'Ditolak'];

const STATUS_STYLES: Record<string, string> = {
  Baru: 'bg-sky-400/15 text-sky-400',
  Ditinjau: 'bg-amber-400/15 text-amber-400',
  Interview: 'bg-violet-400/15 text-violet-400',
  Diterima: 'bg-green-400/15 text-green-400',
  Ditolak: 'bg-red-400/15 text-red-400',
};

export default function ApplicationsPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setApplications(data as Application[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    await supabase
      .from('job_applications')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: newStatus } : prev);
    setUpdatingId(null);
    showToast(`Status diubah ke "${newStatus}"`);
  };

  const handleSaveNotes = async (id: number, notes: string) => {
    await supabase
      .from('job_applications')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes } : a))
    );
    showToast('Catatan disimpan!');
  };

  const filtered = applications.filter((a) => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchSearch =
      a.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      a.posisi.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-black text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-base" />{toast}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-[#0D1117] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D1117] border-b border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 className="font-bold text-white text-base">{selected.nama_lengkap}</h3>
                <p className="text-amber-400 text-xs mt-0.5">{selected.posisi}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Status Lamaran</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      disabled={updatingId === selected.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all border ${
                        selected.status === s
                          ? `${STATUS_STYLES[s]} border-current`
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Email', value: selected.email, icon: 'ri-mail-line', href: `mailto:${selected.email}` },
                  { label: 'No. HP / WA', value: selected.nomor_hp, icon: 'ri-phone-line', href: `tel:${selected.nomor_hp}` },
                  { label: 'Pendidikan', value: selected.pendidikan_terakhir || '-', icon: 'ri-graduation-cap-line' },
                  { label: 'Pengalaman', value: selected.pengalaman_kerja || '-', icon: 'ri-briefcase-line' },
                  { label: 'Departemen', value: selected.departemen || '-', icon: 'ri-building-line' },
                  { label: 'Tanggal Masuk', value: formatDate(selected.created_at), icon: 'ri-calendar-line' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#070C17] rounded-xl p-3">
                    <p className="text-slate-600 text-xs mb-1 flex items-center gap-1.5">
                      <i className={`${item.icon} text-slate-700`} />{item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-sky-400 text-sm font-medium hover:underline break-all">{item.value}</a>
                    ) : (
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* LinkedIn / Portfolio */}
              {selected.linkedin_portfolio && (
                <div className="bg-[#070C17] rounded-xl p-4">
                  <p className="text-slate-600 text-xs mb-1.5 flex items-center gap-1.5">
                    <i className="ri-links-line text-slate-700" />LinkedIn / Portfolio
                  </p>
                  <a href={selected.linkedin_portfolio} target="_blank" rel="nofollow noreferrer" className="text-sky-400 text-sm hover:underline break-all">
                    {selected.linkedin_portfolio}
                  </a>
                </div>
              )}

              {/* CV Link */}
              {selected.link_cv && (
                <div className="bg-[#070C17] rounded-xl p-4">
                  <p className="text-slate-600 text-xs mb-1.5 flex items-center gap-1.5">
                    <i className="ri-file-user-line text-slate-700" />Link CV
                  </p>
                  <a href={selected.link_cv} target="_blank" rel="nofollow noreferrer" className="text-amber-400 text-sm hover:underline break-all flex items-center gap-1.5">
                    <i className="ri-external-link-line" />{selected.link_cv}
                  </a>
                </div>
              )}

              {/* Motivasi */}
              {selected.motivasi && (
                <div className="bg-[#070C17] rounded-xl p-4">
                  <p className="text-slate-600 text-xs mb-2 flex items-center gap-1.5">
                    <i className="ri-chat-quote-line text-slate-700" />Surat Lamaran / Motivasi
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.motivasi}</p>
                </div>
              )}

              {/* Notes */}
              <NotesEditor
                initialNotes={selected.notes || ''}
                onSave={(notes) => handleSaveNotes(selected.id, notes)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {['all', ...STATUS_OPTIONS].map((s) => {
          const count = s === 'all' ? applications.length : applications.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-xl p-3 text-center transition-all cursor-pointer border ${
                filterStatus === s
                  ? 'border-amber-400/50 bg-amber-400/10'
                  : 'border-slate-800 bg-[#0D1117] hover:border-slate-700'
              }`}
            >
              <span className={`font-black text-xl block ${filterStatus === s ? 'text-amber-400' : 'text-white'}`}>{count}</span>
              <span className="text-slate-500 text-xs">{s === 'all' ? 'Semua' : s}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, posisi, atau email pelamar..."
          className="w-full bg-[#0D1117] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <i className="ri-inbox-line text-5xl text-slate-700 block mb-4" />
          <p className="text-slate-400 text-base font-semibold mb-1">
            {applications.length === 0 ? 'Belum ada lamaran masuk' : 'Tidak ada lamaran yang cocok'}
          </p>
          <p className="text-slate-600 text-sm">Lamaran dari pelamar akan muncul di sini secara otomatis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-[#0D1117] border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer"
              onClick={() => setSelected(app)}
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{app.nama_lengkap.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[app.status] || 'bg-slate-700 text-slate-400'}`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-600">{formatDate(app.created_at)}</span>
                </div>
                <h3 className="font-bold text-sm text-white truncate">{app.nama_lengkap}</h3>
                <p className="text-slate-500 text-xs truncate">
                  <i className="ri-briefcase-line mr-1" />{app.posisi}
                  <span className="mx-2 text-slate-700">·</span>
                  <i className="ri-mail-line mr-1" />{app.email}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => { e.stopPropagation(); handleStatusChange(app.id, e.target.value); }}
                  disabled={updatingId === app.id}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(app); }}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-lg text-slate-400 transition-colors cursor-pointer"
                >
                  <i className="ri-eye-line text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesEditor({ initialNotes, onSave }: { initialNotes: string; onSave: (notes: string) => void }) {
  const [notes, setNotes] = useState(initialNotes);
  const [dirty, setDirty] = useState(false);

  const handleChange = (v: string) => {
    setNotes(v);
    setDirty(true);
  };

  return (
    <div className="bg-[#070C17] rounded-xl p-4">
      <p className="text-slate-600 text-xs mb-2 flex items-center gap-1.5">
        <i className="ri-sticky-note-line text-slate-700" />Catatan Internal (tidak terlihat pelamar)
      </p>
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Tambahkan catatan tentang pelamar ini..."
        className="w-full bg-[#0D1117] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
      />
      {dirty && (
        <button
          onClick={() => { onSave(notes); setDirty(false); }}
          className="mt-2 flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors"
        >
          <i className="ri-save-line" />Simpan Catatan
        </button>
      )}
    </div>
  );
}
