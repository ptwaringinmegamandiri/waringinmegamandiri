import { useState, useEffect, useCallback } from 'react';
import { supabase, ProjectRow, NewsRow, CareerRow } from '@/lib/supabase';
import ProjectForm from './components/ProjectForm';
import NewsForm from './components/NewsForm';
import CareerForm from './components/CareerForm';
import HighlightSettings from './components/HighlightSettings';
import SiteSettings from './components/SiteSettings';
import ApplicationsPanel from './components/ApplicationsPanel';
import { projects as mockProjects } from '@/mocks/projects';
import { newsArticles as mockNews } from '@/mocks/news';
import { jobListings as mockCareers } from '@/mocks/careers';
import { generateDescription, startAiChat } from '@/lib/gemini';

type ActiveTab = 'projects' | 'news' | 'careers' | 'highlight' | 'settings' | 'applications';
type ViewMode = 'list' | 'add' | 'edit';

const BUILDING_TYPE_LABELS: Record<string, string> = {
  Hotel: 'Hotel', Apartemen: 'Apartemen', Ruko: 'Ruko', Kantor: 'Kantor',
  Perumahan: 'Perumahan', Pasar: 'Pasar', Mall: 'Mall', 'Rumah Sakit': 'Rumah Sakit',
  Sekolah: 'Sekolah', Kampus: 'Kampus', Gudang: 'Gudang', Pabrik: 'Pabrik',
  'Rumah Ibadah': 'Rumah Ibadah', 'Marketing Gallery': 'Marketing Gallery',
  'Club House': 'Club House', Infrastruktur: 'Infrastruktur', Lainnya: 'Lainnya',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  const [view, setView] = useState<ViewMode>('list');
  const [toast, setToast] = useState('');

  // Projects state
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [editProject, setEditProject] = useState<ProjectRow | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // News state
  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [editNews, setEditNews] = useState<NewsRow | null>(null);
  const [newsSearch, setNewsSearch] = useState('');
  const [deleteNewsId, setDeleteNewsId] = useState<number | null>(null);
  const [deletingNews, setDeletingNews] = useState(false);
  const [importingNews, setImportingNews] = useState(false);
  const [importNewsProgress, setImportNewsProgress] = useState(0);

  // Careers state
  const [careers, setCareers] = useState<CareerRow[]>([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [editCareer, setEditCareer] = useState<CareerRow | null>(null);
  const [careerSearch, setCareerSearch] = useState('');
  const [deleteCareerID, setDeleteCareerID] = useState<number | null>(null);
  const [deletingCareer, setDeletingCareer] = useState(false);
  const [importingCareers, setImportingCareers] = useState(false);
  const [importCareersProgress, setImportCareersProgress] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [aiChatSession, setAiChatSession] = useState<any>(null);


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };
  const handleAiGenerate = async (title: string, callback: (desc: string) => void) => {
    if (!title) {
      showToast("Isi judul proyek dulu agar AI bisa menulis deskripsi.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const aiResult = await generateDescription(title);
      callback(aiResult);
      showToast("Deskripsi berhasil dibuat oleh AI!");
    } catch (error) {
      showToast("Gagal memanggil AI. Cek koneksi atau API Key.");
    } finally {
      setIsAiLoading(false);
    }
  };
    const handleSendChatMessage = async () => {
    if (!userInput.trim() || !aiChatSession) return;

    const userMessage = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    try {
      const result = await aiChatSession.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text(); // Kita simpan dulu ke variabel biar aman
      setChatMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Koneksi terputus. Coba cek API Key di Vercel, Bos." }]);
    } finally {
      setIsChatLoading(false);
    }
  };



  // ─── Fetch functions ───────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(id, image_url, sort_order)')
      .order('year', { ascending: false })
      .order('id', { ascending: false });
    if (!error && data) setProjects(data as ProjectRow[]);
    setProjectsLoading(false);
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: false });
    if (!error && data) setNewsList(data as NewsRow[]);
    setNewsLoading(false);
  }, []);

  const fetchCareers = useCallback(async () => {
    setCareersLoading(true);
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('id', { ascending: false });
    if (!error && data) setCareers(data as CareerRow[]);
    setCareersLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => { fetchCareers(); }, [fetchCareers]);
  useEffect(() => {
    // Memulai sesi chat AI saat halaman admin dibuka
    const session = startAiChat();
    setAiChatSession(session);
  }, []);


  // ─── Tab change ────────────────────────────────────────────────────────────
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setView('list');
    setEditProject(null);
    setEditNews(null);
    setEditCareer(null);
  };

  // ─── Project handlers ──────────────────────────────────────────────────────
  const handleImportMockData = async () => {
    if (!window.confirm(`Import proyek dari data lama ke database? Proyek yang sudah ada akan dilewati (tidak duplikat).`)) return;
    setImporting(true);
    setImportProgress(0);

    // Fetch existing project names to avoid duplicates
    const { data: existingProjects } = await supabase.from('projects').select('name');
    const existingNames = new Set((existingProjects || []).map((p: { name: string }) => p.name.toLowerCase()));

    let success = 0;
    let skipped = 0;
    for (let i = 0; i < mockProjects.length; i++) {
      const p = mockProjects[i];
      if (existingNames.has(p.name.toLowerCase())) {
        skipped++;
        setImportProgress(Math.round(((i + 1) / mockProjects.length) * 100));
        continue;
      }
      const payload = {
        name: p.name, building_type: p.buildingType, location: p.location,
        year: p.year, status: p.status, work_package: p.workPackage,
        unit_count: p.unitCount || null, building_area: p.buildingArea || null,
        floors: p.floors || null, description: p.description,
        cover_image: p.image || null, client: p.client, value: p.value,
      };
      const { data: inserted, error } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
      if (!error && inserted) {
        const imgRows = p.images.map((url: string, idx: number) => ({ project_id: inserted.id, image_url: url, sort_order: idx }));
        if (imgRows.length > 0) await supabase.from('project_images').insert(imgRows);
        success++;
      }
      setImportProgress(Math.round(((i + 1) / mockProjects.length) * 100));
    }
    setImporting(false);
    setImportProgress(0);
    fetchProjects();
    showToast(`Import selesai: ${success} ditambahkan, ${skipped} dilewati (sudah ada).`);
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    setDeletingProject(true);
    await supabase.from('projects').delete().eq('id', deleteProjectId);
    setDeleteProjectId(null);
    setDeletingProject(false);
    fetchProjects();
    showToast('Proyek berhasil dihapus.');
  };

  // ─── News handlers ─────────────────────────────────────────────────────────
  const handleDeleteNews = async () => {
    if (!deleteNewsId) return;
    setDeletingNews(true);
    await supabase.from('news').delete().eq('id', deleteNewsId);
    setDeleteNewsId(null);
    setDeletingNews(false);
    fetchNews();
    showToast('Artikel berhasil dihapus.');
  };

  // ─── Career handlers ───────────────────────────────────────────────────────
  const handleDeleteCareer = async () => {
    if (!deleteCareerID) return;
    setDeletingCareer(true);
    await supabase.from('careers').delete().eq('id', deleteCareerID);
    setDeleteCareerID(null);
    setDeletingCareer(false);
    fetchCareers();
    showToast('Lowongan berhasil dihapus.');
  };

  const handleToggleCareerActive = async (career: CareerRow) => {
    await supabase.from('careers').update({ is_active: !career.is_active }).eq('id', career.id);
    fetchCareers();
    showToast(career.is_active ? 'Lowongan dinonaktifkan.' : 'Lowongan diaktifkan.');
  };

  // ─── News Import ───────────────────────────────────────────────────────────
  const handleImportMockNews = async () => {
    if (!window.confirm(`Import ${mockNews.length} artikel dari data yang sudah ada ke database?`)) return;
    setImportingNews(true);
    setImportNewsProgress(0);
    let success = 0;
    for (let i = 0; i < mockNews.length; i++) {
      const n = mockNews[i];
      const payload = {
        slug: n.slug,
        category: n.category,
        title: n.title,
        excerpt: n.excerpt,
        image: n.image,
        author: n.author,
        date: n.date,
        read_time: n.readTime,
        featured: n.featured,
        tags: n.tags,
        content: n.excerpt,
      };
      const { error } = await supabase.from('news').insert(payload);
      if (!error) success++;
      setImportNewsProgress(Math.round(((i + 1) / mockNews.length) * 100));
    }
    setImportingNews(false);
    setImportNewsProgress(0);
    fetchNews();
    showToast(`Berhasil import ${success} artikel ke database!`);
  };

  // ─── Careers Import ────────────────────────────────────────────────────────
  const handleImportMockCareers = async () => {
    if (!window.confirm(`Import ${mockCareers.length} lowongan dari data yang sudah ada ke database?`)) return;
    setImportingCareers(true);
    setImportCareersProgress(0);
    let success = 0;
    for (let i = 0; i < mockCareers.length; i++) {
      const c = mockCareers[i];
      const payload = {
        title: c.title,
        department: c.department,
        location: c.location,
        type: c.type,
        level: c.level,
        salary: c.salary,
        deadline: c.deadline,
        description: c.description,
        requirements: c.requirements,
        benefits: c.benefits,
        tags: c.tags,
        is_active: true,
      };
      const { error } = await supabase.from('careers').insert(payload);
      if (!error) success++;
      setImportCareersProgress(Math.round(((i + 1) / mockCareers.length) * 100));
    }
    setImportingCareers(false);
    setImportCareersProgress(0);
    fetchCareers();
    showToast(`Berhasil import ${success} lowongan ke database!`);
  };

  // ─── Filtered lists ────────────────────────────────────────────────────────
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.client.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredNews = newsList.filter((n) =>
    n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
    n.category.toLowerCase().includes(newsSearch.toLowerCase()) ||
    n.author.toLowerCase().includes(newsSearch.toLowerCase())
  );

  const filteredCareers = careers.filter((c) =>
    c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.department.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.location.toLowerCase().includes(careerSearch.toLowerCase())
  );

  const getAddLabel = () => {
    if (activeTab === 'projects') return 'Tambah Proyek';
    if (activeTab === 'news') return 'Tambah Artikel';
    return 'Tambah Lowongan';
  };

  const handleAdd = () => {
    setEditProject(null);
    setEditNews(null);
    setEditCareer(null);
    setView('add');
  };

  const handleCancel = () => setView('list');

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-amber-400 text-black text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
          <i className="ri-checkbox-circle-line text-base" />{toast}
        </div>
      )}

      {/* Delete Confirm Modals */}
      {deleteProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl text-red-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Hapus Proyek?</h3>
            <p className="text-slate-400 text-sm mb-6">Tindakan ini tidak bisa dibatalkan. Semua foto proyek juga akan dihapus.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteProject} disabled={deletingProject} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">
                {deletingProject ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button onClick={() => setDeleteProjectId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}

      {deleteNewsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl text-red-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Hapus Artikel?</h3>
            <p className="text-slate-400 text-sm mb-6">Artikel yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteNews} disabled={deletingNews} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">
                {deletingNews ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button onClick={() => setDeleteNewsId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}

      {deleteCareerID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-line text-2xl text-red-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Hapus Lowongan?</h3>
            <p className="text-slate-400 text-sm mb-6">Lowongan yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteCareer} disabled={deletingCareer} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">
                {deletingCareer ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button onClick={() => setDeleteCareerID(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-3 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0A0E14] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <i className="ri-arrow-left-line text-sm" />
            </a>
            <div>
              <h1 className="font-bold text-base leading-tight">Admin Panel</h1>
              <p className="text-slate-500 text-xs">PT Waringin Mega Mandiri</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' && activeTab !== 'highlight' && activeTab !== 'settings' && activeTab !== 'applications' && (
              <button
                onClick={handleAdd}
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-5 py-2.5 rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-2 transition-colors"
              >
                <i className="ri-add-line" />{getAddLabel()}
              </button>
            )}
            {view !== 'list' && (
              <button onClick={handleCancel} className="text-slate-400 hover:text-white text-sm cursor-pointer flex items-center gap-1.5 transition-colors">
                <i className="ri-close-line" /> Batal
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        {view === 'list' && (
          <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0 overflow-x-auto">
            {([
              { key: 'projects', label: 'Proyek', icon: 'ri-building-line', count: projects.length },
              { key: 'news', label: 'News', icon: 'ri-newspaper-line', count: newsList.length },
              { key: 'careers', label: 'Karir', icon: 'ri-briefcase-line', count: careers.length },
              { key: 'highlight', label: 'Highlight', icon: 'ri-star-line', count: null },
              { key: 'applications', label: 'Lamaran', icon: 'ri-inbox-line', count: null },
              { key: 'settings', label: 'Pengaturan', icon: 'ri-settings-3-line', count: null },
            ] as { key: ActiveTab; label: string; icon: string; count: number | null }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <i className={tab.icon} />
                {tab.label}
                {tab.count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PROJECTS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'projects' && view === 'list' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{projects.length}</span>
                <span className="text-slate-500 text-xs">Total Proyek</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-sky-400 block animate-pulse">{projects.filter((p) => p.status === 'Ongoing').length}</span>
                <span className="text-slate-500 text-xs">Ongoing</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{projects.filter((p) => p.status === 'Selesai').length}</span>
                <span className="text-slate-500 text-xs">Selesai</span>
              </div>
            </div>

            <div className="relative mb-6">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input type="text" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Cari nama proyek, lokasi, atau klien..." className="w-full bg-[#0D1117] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors" />
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <i className="ri-folder-open-line text-5xl text-slate-700 block mb-4" />
                {projects.length === 0 ? (
                  <>
                    <p className="text-slate-400 text-base font-semibold mb-2">Database masih kosong</p>
                    <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">Kamu punya 77 proyek di data lama. Klik tombol di bawah untuk memindahkannya ke database.</p>
                    <button onClick={handleImportMockData} disabled={importing} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors disabled:opacity-50 mx-auto">
                      {importing ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Mengimport... {importProgress}%</> : <><i className="ri-download-cloud-line" /> Import 77 Proyek dari Data Lama</>}
                    </button>
                    {importing && (
                      <div className="mt-4 max-w-xs mx-auto">
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
                        </div>
                        <p className="text-slate-500 text-xs mt-2">{importProgress}% selesai...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">Tidak ada proyek yang cocok dengan pencarian.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((p) => {
                  const coverImg = p.project_images && p.project_images.length > 0
                    ? p.project_images.sort((a, b) => a.sort_order - b.sort_order)[0].image_url
                    : p.cover_image;
                  return (
                    <div key={p.id} className="bg-[#0D1117] border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex items-center gap-4 transition-colors">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        {coverImg ? <img src={coverImg} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-slate-600 text-xl" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.status === 'Ongoing' ? 'bg-sky-400/15 text-sky-400' : 'bg-green-400/15 text-green-400'}`}>{p.status}</span>
                          <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{BUILDING_TYPE_LABELS[p.building_type] || p.building_type}</span>
                          <span className="text-xs text-amber-400 font-bold">{p.year}</span>
                        </div>
                        <h3 className="font-bold text-sm text-white truncate">{p.name}</h3>
                        <p className="text-slate-500 text-xs truncate"><i className="ri-map-pin-line mr-1" />{p.location}<span className="mx-2 text-slate-700">·</span><i className="ri-user-line mr-1" />{p.client}</p>
                      </div>
                      <div className="hidden md:block text-right shrink-0">
                        <p className="text-amber-400 font-bold text-xs">{p.value}</p>
                        <p className="text-slate-600 text-xs mt-0.5">{p.project_images ? p.project_images.length : 0} foto</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => { setEditProject(p); setView('edit'); }} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-sm" /></button>
                        <button onClick={() => setDeleteProjectId(p.id)} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-sm" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'projects' && (view === 'add' || view === 'edit') && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="font-bold text-xl">{view === 'edit' ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h2>
              <p className="text-slate-500 text-sm mt-1">{view === 'edit' ? `Mengedit: ${editProject?.name}` : 'Isi detail proyek dan upload foto'}</p>
            </div>
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
              <ProjectForm 
  project={editProject} 
  onAiGenerate={handleAiGenerate}
  isAiLoading={isAiLoading}
  onSaved={() => { 
    fetchProjects(); 
    setView('list'); 
    showToast(view === 'edit' ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil ditambahkan!'); 
  }} 
  onCancel={handleCancel} 
/>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* NEWS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'news' && view === 'list' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{newsList.length}</span>
                <span className="text-slate-500 text-xs">Total Artikel</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{newsList.filter((n) => n.featured).length}</span>
                <span className="text-slate-500 text-xs">Featured</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-slate-400 block">{[...new Set(newsList.map((n) => n.category))].length}</span>
                <span className="text-slate-500 text-xs">Kategori</span>
              </div>
            </div>

            <div className="relative mb-6">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input type="text" value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} placeholder="Cari judul, kategori, atau penulis..." className="w-full bg-[#0D1117] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors" />
            </div>

            {newsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-16">
                <i className="ri-newspaper-line text-5xl text-slate-700 block mb-4" />
                {newsList.length === 0 ? (
                  <>
                    <p className="text-slate-400 text-base font-semibold mb-2">Database artikel masih kosong</p>
                    <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">Ada {mockNews.length} artikel di data lama. Klik tombol di bawah untuk memindahkannya ke database.</p>
                    <button onClick={handleImportMockNews} disabled={importingNews} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors disabled:opacity-50 mx-auto">
                      {importingNews ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Mengimport... {importNewsProgress}%</> : <><i className="ri-download-cloud-line" /> Import {mockNews.length} Artikel dari Data Lama</>}
                    </button>
                    {importingNews && (
                      <div className="mt-4 max-w-xs mx-auto">
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full transition-all duration-300" style={{ width: `${importNewsProgress}%` }} />
                        </div>
                        <p className="text-slate-500 text-xs mt-2">{importNewsProgress}% selesai...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">Tidak ada artikel yang cocok dengan pencarian.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNews.map((n) => (
                  <div key={n.id} className="bg-[#0D1117] border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex items-center gap-4 transition-colors">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      {n.image ? <img src={n.image} alt={n.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-slate-600 text-xl" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{n.category}</span>
                        {n.featured && <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400/15 text-amber-400">Featured</span>}
                        <span className="text-xs text-slate-600">{n.date}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate">{n.title}</h3>
                      <p className="text-slate-500 text-xs truncate"><i className="ri-user-line mr-1" />{n.author}<span className="mx-2 text-slate-700">·</span><i className="ri-time-line mr-1" />{n.read_time}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditNews(n); setView('edit'); }} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-sm" /></button>
                      <button onClick={() => setDeleteNewsId(n.id)} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-sm" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'news' && (view === 'add' || view === 'edit') && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="font-bold text-xl">{view === 'edit' ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
              <p className="text-slate-500 text-sm mt-1">{view === 'edit' ? `Mengedit: ${editNews?.title}` : 'Isi detail artikel berita'}</p>
            </div>
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
              <NewsForm news={editNews} onSaved={() => { fetchNews(); setView('list'); showToast(view === 'edit' ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil ditambahkan!'); }} onCancel={handleCancel} />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CAREERS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'careers' && view === 'list' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{careers.length}</span>
                <span className="text-slate-500 text-xs">Total Lowongan</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{careers.filter((c) => c.is_active).length}</span>
                <span className="text-slate-500 text-xs">Aktif</span>
              </div>
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-slate-400 block">{careers.filter((c) => !c.is_active).length}</span>
                <span className="text-slate-500 text-xs">Nonaktif</span>
              </div>
            </div>

            <div className="relative mb-6">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input type="text" value={careerSearch} onChange={(e) => setCareerSearch(e.target.value)} placeholder="Cari posisi, departemen, atau lokasi..." className="w-full bg-[#0D1117] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors" />
            </div>

            {careersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCareers.length === 0 ? (
              <div className="text-center py-16">
                <i className="ri-briefcase-line text-5xl text-slate-700 block mb-4" />
                {careers.length === 0 ? (
                  <>
                    <p className="text-slate-400 text-base font-semibold mb-2">Database lowongan masih kosong</p>
                    <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">Ada {mockCareers.length} lowongan di data lama. Klik tombol di bawah untuk memindahkannya ke database.</p>
                    <button onClick={handleImportMockCareers} disabled={importingCareers} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-6 py-3 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors disabled:opacity-50 mx-auto">
                      {importingCareers ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Mengimport... {importCareersProgress}%</> : <><i className="ri-download-cloud-line" /> Import {mockCareers.length} Lowongan dari Data Lama</>}
                    </button>
                    {importingCareers && (
                      <div className="mt-4 max-w-xs mx-auto">
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full transition-all duration-300" style={{ width: `${importCareersProgress}%` }} />
                        </div>
                        <p className="text-slate-500 text-xs mt-2">{importCareersProgress}% selesai...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">Tidak ada lowongan yang cocok dengan pencarian.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCareers.map((c) => (
                  <div key={c.id} className={`bg-[#0D1117] border rounded-xl p-4 flex items-center gap-4 transition-colors ${c.is_active ? 'border-slate-800 hover:border-slate-600' : 'border-slate-800/50 opacity-60'}`}>
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <i className="ri-briefcase-line text-slate-500 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.is_active ? 'bg-green-400/15 text-green-400' : 'bg-slate-700 text-slate-500'}`}>{c.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{c.type}</span>
                        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{c.level}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate">{c.title}</h3>
                      <p className="text-slate-500 text-xs truncate">
                        <i className="ri-building-line mr-1" />{c.department}
                        <span className="mx-2 text-slate-700">·</span>
                        <i className="ri-map-pin-line mr-1" />{c.location}
                        <span className="mx-2 text-slate-700">·</span>
                        <i className="ri-time-line mr-1" />Deadline: {c.deadline}
                      </p>
                    </div>
                    <div className="hidden md:block text-right shrink-0">
                      <p className="text-amber-400 font-bold text-xs">{c.salary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleCareerActive(c)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${c.is_active ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'}`}
                        title={c.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        <i className={c.is_active ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
                      </button>
                      <button onClick={() => { setEditCareer(c); setView('edit'); }} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-sm" /></button>
                      <button onClick={() => setDeleteCareerID(c.id)} className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-sm" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HIGHLIGHT TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'highlight' && view === 'list' && (
          <HighlightSettings />
        )}

        {activeTab === 'careers' && (view === 'add' || view === 'edit') && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="font-bold text-xl">{view === 'edit' ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}</h2>
              <p className="text-slate-500 text-sm mt-1">{view === 'edit' ? `Mengedit: ${editCareer?.title}` : 'Isi detail posisi yang dibuka'}</p>
            </div>
            <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6">
              <CareerForm career={editCareer} onSaved={() => { fetchCareers(); setView('list'); showToast(view === 'edit' ? 'Lowongan berhasil diperbarui!' : 'Lowongan berhasil ditambahkan!'); }} onCancel={handleCancel} />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* APPLICATIONS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && view === 'list' && (
          <ApplicationsPanel />
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SETTINGS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && view === 'list' && (
          <SiteSettings />
        )}
          {/* Taruh kodenya di sini */}
          {chatMessages.length > -1 && (
            <div className="mt-12 bg-[#0D1628] border border-blue-500/20 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-blue-600/10 p-4 border-b border-blue-500/20">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="text-xl">🤖</span> AI Site Manager (v0 Alternative)
                </h3>
              </div>
              
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/20">
                {chatMessages.length === 0 && (
                  <p className="text-gray-500 text-center text-sm mt-10">Halo Bos! Saya asisten developer kamu. Mau edit apa hari ini?</p>
                )}
                                               {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && <div className="text-blue-400 text-xs animate-pulse p-2">AI sedang berpikir...</div>}
              </div>

              <div className="p-4 border-t border-blue-500/20 flex gap-2 bg-black/40">
                <input 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Suruh AI edit web atau buat konten..."
                  className="flex-1 bg-[#070C17] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleSendChatMessage}
                  disabled={isChatLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  Kirim
                </button>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
