import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, ProjectRow, NewsRow, CareerRow, LegacyProjectRow } from '@/lib/supabase';
import ProjectForm from './components/ProjectForm';
import NewsForm from './components/NewsForm';
import CareerForm from './components/CareerForm';
import HighlightSettings from './components/HighlightSettings';
import SiteSettings from './components/SiteSettings';
import ApplicationsPanel from './components/ApplicationsPanel';
import AiCopilotPanel from './components/AiCopilotPanel';
import DataExchangePanel from './components/DataExchangePanel';
import InlineEditPopup, { InlineEditData } from './components/InlineEditPopup';
import LivePreview from './components/LivePreview';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { projects as mockProjects } from '@/mocks/projects';
import { newsArticles as mockNews } from '@/mocks/news';
import { jobListings as mockCareers } from '@/mocks/careers';
import { useLegacyProjects } from '@/hooks/useLegacyProjects';
import LegacyProjectForm from './components/LegacyProjectForm';

type ActiveTab = 'projects' | 'news' | 'careers' | 'highlight' | 'settings' | 'applications' | 'legacy';
type ViewMode = 'list' | 'add' | 'edit';

const BUILDING_TYPE_LABELS: Record<string, string> = {
  Hotel: 'Hotel', Apartemen: 'Apartemen', Ruko: 'Ruko', Kantor: 'Kantor',
  Perumahan: 'Perumahan', Pasar: 'Pasar', Mall: 'Mall', 'Rumah Sakit': 'Rumah Sakit',
  Sekolah: 'Sekolah', Kampus: 'Kampus', Gudang: 'Gudang', Pabrik: 'Pabrik',
  'Rumah Ibadah': 'Rumah Ibadah', 'Marketing Gallery': 'Marketing Gallery',
  'Club House': 'Club House', Infrastruktur: 'Infrastruktur', Lainnya: 'Lainnya',
};

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: 'projects', label: 'Proyek', icon: 'ri-building-line' },
  { key: 'legacy', label: 'Sejarah', icon: 'ri-time-line' },
  { key: 'news', label: 'News', icon: 'ri-newspaper-line' },
  { key: 'careers', label: 'Karir', icon: 'ri-briefcase-line' },
  { key: 'highlight', label: 'Highlight', icon: 'ri-star-line' },
  { key: 'applications', label: 'Lamaran', icon: 'ri-inbox-line' },
  { key: 'settings', label: 'Pengaturan', icon: 'ri-settings-3-line' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { theme, sections, refresh } = useSiteTheme();
  const themeRef = useRef(theme);
  const sectionsRef = useRef(sections);
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { sectionsRef.current = sections; }, [sections]);
  const [authUser, setAuthUser] = useState<null | { email?: string }>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  const [view, setView] = useState<ViewMode>('list');
  const [toast, setToast] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [previewEditMode, setPreviewEditMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState<InlineEditData | null>(null);

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

  // Legacy projects state
  const { projects: legacyProjects, loading: legacyLoading, refetch: fetchLegacy } = useLegacyProjects();
  const [editLegacy, setEditLegacy] = useState<LegacyProjectRow | null>(null);
  const [legacySearch, setLegacySearch] = useState('');
  const [deleteLegacyId, setDeleteLegacyId] = useState<number | null>(null);
  const [deletingLegacy, setDeletingLegacy] = useState(false);

  // === RESIZABLE STATE ===
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [chatHeight, setChatHeight] = useState(280);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(400);
  const resizeStartYRef = useRef(0);
  const resizeStartHeightRef = useRef(280);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      // Check dev mode auth first
      const devAuth = localStorage.getItem('wmm_dev_auth');
      if (devAuth) {
        try {
          const parsed = JSON.parse(devAuth);
          if (parsed.email && parsed.timestamp) {
            setAuthUser({ email: parsed.email });
            setAuthLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem('wmm_dev_auth');
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setAuthUser({ email: data.session.user.email || '' });
      } else {
        navigate('/login');
      }
      setAuthLoading(false);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser({ email: session.user.email || '' });
      } else {
        // Don't redirect if dev mode
        if (!localStorage.getItem('wmm_dev_auth')) {
          navigate('/login');
        }
      }
    });

    return () => { listener.subscription.unsubscribe(); };
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('wmm_dev_auth');
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Fetch functions
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
    const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
    if (!error && data) setNewsList(data as NewsRow[]);
    setNewsLoading(false);
  }, []);

  const fetchCareers = useCallback(async () => {
    setCareersLoading(true);
    const { data, error } = await supabase.from('careers').select('*').order('id', { ascending: false });
    if (!error && data) setCareers(data as CareerRow[]);
    setCareersLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setView('list');
    setEditProject(null);
    setEditNews(null);
    setEditCareer(null);
    setEditLegacy(null);
  };

  const handleAdd = () => {
    setEditProject(null);
    setEditNews(null);
    setEditCareer(null);
    setEditLegacy(null);
    setView('add');
  };

  const handleCancel = () => setView('list');

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    setDeletingProject(true);
    await supabase.from('projects').delete().eq('id', deleteProjectId);
    setDeleteProjectId(null);
    setDeletingProject(false);
    fetchProjects();
    showToast('Proyek berhasil dihapus.');
  };

  const handleDeleteNews = async () => {
    if (!deleteNewsId) return;
    setDeletingNews(true);
    await supabase.from('news').delete().eq('id', deleteNewsId);
    setDeleteNewsId(null);
    setDeletingNews(false);
    fetchNews();
    showToast('Artikel berhasil dihapus.');
  };

  const handleDeleteCareer = async () => {
    if (!deleteCareerID) return;
    setDeletingCareer(true);
    await supabase.from('careers').delete().eq('id', deleteCareerID);
    setDeleteCareerID(null);
    setDeletingCareer(false);
    fetchCareers();
    showToast('Lowongan berhasil dihapus.');
  };

  const handleDeleteLegacy = async () => {
    if (!deleteLegacyId) return;
    setDeletingLegacy(true);
    await supabase.from('legacy_projects').delete().eq('id', deleteLegacyId);
    setDeleteLegacyId(null);
    setDeletingLegacy(false);
    fetchLegacy();
    showToast('Proyek sejarah berhasil dihapus.');
  };

  const handleToggleCareerActive = async (career: CareerRow) => {
    await supabase.from('careers').update({ is_active: !career.is_active }).eq('id', career.id);
    fetchCareers();
    showToast(career.is_active ? 'Lowongan dinonaktifkan.' : 'Lowongan diaktifkan.');
  };

  const handleImportMockData = async () => {
    if (!window.confirm(`Import proyek dari data lama ke database? Proyek yang sudah ada akan dilewati.`)) return;
    setImporting(true);
    setImportProgress(0);
    const { data: existingProjects } = await supabase.from('projects').select('name');
    const existingNames = new Set((existingProjects || []).map((p: { name: string }) => p.name.toLowerCase()));
    let success = 0, skipped = 0;
    for (let i = 0; i < mockProjects.length; i++) {
      const p = mockProjects[i];
      if (existingNames.has(p.name.toLowerCase())) { skipped++; setImportProgress(Math.round(((i + 1) / mockProjects.length) * 100)); continue; }
      const payload = { name: p.name, building_type: p.buildingType, location: p.location, year: p.year, status: p.status, work_package: p.workPackage, unit_count: p.unitCount || null, building_area: p.buildingArea || null, floors: p.floors || null, description: p.description, cover_image: p.image || null, client: p.client, value: p.value };
      const { data: inserted, error } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
      if (!error && inserted) {
        const imgRows = p.images.map((url: string, idx: number) => ({ project_id: inserted.id, image_url: url, sort_order: idx }));
        if (imgRows.length > 0) await supabase.from('project_images').insert(imgRows);
        success++;
      }
      setImportProgress(Math.round(((i + 1) / mockProjects.length) * 100));
    }
    setImporting(false); setImportProgress(0); fetchProjects();
    showToast(`Import selesai: ${success} ditambahkan, ${skipped} dilewati.`);
  };

  const handleImportMockNews = async () => {
    if (!window.confirm(`Import ${mockNews.length} artikel dari data lama?`)) return;
    setImportingNews(true); setImportNewsProgress(0);
    let success = 0;
    for (let i = 0; i < mockNews.length; i++) {
      const n = mockNews[i];
      const { error } = await supabase.from('news').insert({ slug: n.slug, category: n.category, title: n.title, excerpt: n.excerpt, image: n.image, author: n.author, date: n.date, read_time: n.readTime, featured: n.featured, tags: n.tags, content: n.excerpt });
      if (!error) success++;
      setImportNewsProgress(Math.round(((i + 1) / mockNews.length) * 100));
    }
    setImportingNews(false); setImportNewsProgress(0); fetchNews();
    showToast(`Berhasil import ${success} artikel!`);
  };

  const handleImportMockCareers = async () => {
    if (!window.confirm(`Import ${mockCareers.length} lowongan dari data lama?`)) return;
    setImportingCareers(true); setImportCareersProgress(0);
    let success = 0;
    for (let i = 0; i < mockCareers.length; i++) {
      const c = mockCareers[i];
      const { error } = await supabase.from('careers').insert({ title: c.title, department: c.department, location: c.location, type: c.type, level: c.level, salary: c.salary, deadline: c.deadline, description: c.description, requirements: c.requirements, benefits: c.benefits, tags: c.tags, is_active: true });
      if (!error) success++;
      setImportCareersProgress(Math.round(((i + 1) / mockCareers.length) * 100));
    }
    setImportingCareers(false); setImportCareersProgress(0); fetchCareers();
    showToast(`Berhasil import ${success} lowongan!`);
  };

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

  const filteredLegacy = legacyProjects.filter((p) =>
    p.name.toLowerCase().includes(legacySearch.toLowerCase()) ||
    p.client.toLowerCase().includes(legacySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(legacySearch.toLowerCase())
  );

  const getAddLabel = () => {
    if (activeTab === 'projects') return 'Tambah Proyek';
    if (activeTab === 'legacy') return 'Tambah Proyek Sejarah';
    if (activeTab === 'news') return 'Tambah Artikel';
    if (activeTab === 'careers') return 'Tambah Lowongan';
    return '';
  };

  // ─── RENDER SIDEBAR CONTENT ─────────────────────────────────────────────
  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'projects':
        if (view !== 'list') return (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="font-bold text-sm text-white">{view === 'edit' ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{view === 'edit' ? `Mengedit: ${editProject?.name}` : 'Isi detail proyek dan upload foto'}</p>
            </div>
            <ProjectForm project={editProject} onSaved={() => { fetchProjects(); setView('list'); showToast(view === 'edit' ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil ditambahkan!'); }} onCancel={handleCancel} />
          </div>
        );
        return (
          <div className="p-5 space-y-5">
            <DataExchangePanel entity="projects" label="Proyek" onImported={fetchProjects} />
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{projects.length}</span>
                <span className="text-slate-500 text-xs mt-1">Total</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-sky-400 block">{projects.filter(p => p.status === 'Ongoing').length}</span>
                <span className="text-slate-500 text-xs mt-1">Ongoing</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{projects.filter(p => p.status === 'Selesai').length}</span>
                <span className="text-slate-500 text-xs mt-1">Selesai</span>
              </div>
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input type="text" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Cari proyek..." className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors" />
            </div>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-folder-open-line text-3xl text-slate-700 block mb-2" />
                {projects.length === 0 ? (
                  <>
                    <p className="text-slate-500 text-xs mb-3">Database kosong</p>
                    <button onClick={handleImportMockData} disabled={importing} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors disabled:opacity-50">
                      {importing ? <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> {importProgress}%</> : <><i className="ri-download-cloud-line" /> Import 77 Proyek</>}
                    </button>
                  </>
                ) : <p className="text-slate-500 text-xs">Tidak ada hasil pencarian.</p>}
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {filteredProjects.map((p) => {
                  const coverImg = p.project_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url || p.cover_image;
                  return (
                    <div key={p.id} className={`bg-[#111827] border rounded-xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group ${selectedSection === `project-${p.id}` ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-800 hover:border-slate-600'}`} onClick={() => { setEditProject(p); setView('edit'); }}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        {coverImg ? <img src={coverImg} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-slate-600 text-base" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-white truncate">{p.name}</h3>
                        <p className="text-slate-500 text-xs truncate mt-0.5">{p.location} · {p.year}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setEditProject(p); setView('edit'); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-xs" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteProjectId(p.id); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-xs" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'news':
        if (view !== 'list') return (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="font-bold text-sm text-white">{view === 'edit' ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{view === 'edit' ? `Mengedit: ${editNews?.title}` : 'Isi detail artikel'}</p>
            </div>
            <NewsForm news={editNews} onSaved={() => { fetchNews(); setView('list'); showToast(view === 'edit' ? 'Artikel diperbarui!' : 'Artikel ditambahkan!'); }} onCancel={handleCancel} />
          </div>
        );
        return (
          <div className="p-5 space-y-5">
            <DataExchangePanel entity="news" label="News" onImported={fetchNews} />
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{newsList.length}</span>
                <span className="text-slate-500 text-xs mt-1">Total</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{newsList.filter(n => n.featured).length}</span>
                <span className="text-slate-500 text-xs mt-1">Featured</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-slate-400 block">{[...new Set(newsList.map(n => n.category))].length}</span>
                <span className="text-slate-500 text-xs mt-1">Kategori</span>
              </div>
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input type="text" value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} placeholder="Cari artikel..." className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors" />
            </div>
            {newsLoading ? (
              <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-newspaper-line text-3xl text-slate-700 block mb-2" />
                {newsList.length === 0 ? (
                  <>
                    <p className="text-slate-500 text-xs mb-3">Database kosong</p>
                    <button onClick={handleImportMockNews} disabled={importingNews} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors disabled:opacity-50">
                      {importingNews ? <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> {importNewsProgress}%</> : <><i className="ri-download-cloud-line" /> Import {mockNews.length} Artikel</>}
                    </button>
                  </>
                ) : <p className="text-slate-500 text-xs">Tidak ada hasil.</p>}
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {filteredNews.map((n) => (
                  <div key={n.id} className={`bg-[#111827] border rounded-xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group ${selectedSection === `news-${n.id}` ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-800 hover:border-slate-600'}`} onClick={() => { setEditNews(n); setView('edit'); }}>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      {n.image ? <img src={n.image} alt={n.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="ri-image-line text-slate-600 text-base" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{n.title}</h3>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{n.category} · {n.date}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditNews(n); setView('edit'); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-xs" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteNewsId(n.id); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-xs" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'careers':
        if (view !== 'list') return (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="font-bold text-sm text-white">{view === 'edit' ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{view === 'edit' ? `Mengedit: ${editCareer?.title}` : 'Isi detail posisi'}</p>
            </div>
            <CareerForm career={editCareer} onSaved={() => { fetchCareers(); setView('list'); showToast(view === 'edit' ? 'Lowongan diperbarui!' : 'Lowongan ditambahkan!'); }} onCancel={handleCancel} />
          </div>
        );
        return (
          <div className="p-5 space-y-5">
            <DataExchangePanel entity="careers" label="Lowongan" onImported={fetchCareers} />
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{careers.length}</span>
                <span className="text-slate-500 text-xs mt-1">Total</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{careers.filter(c => c.is_active).length}</span>
                <span className="text-slate-500 text-xs mt-1">Aktif</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-slate-400 block">{careers.filter(c => !c.is_active).length}</span>
                <span className="text-slate-500 text-xs mt-1">Nonaktif</span>
              </div>
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input type="text" value={careerSearch} onChange={(e) => setCareerSearch(e.target.value)} placeholder="Cari lowongan..." className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors" />
            </div>
            {careersLoading ? (
              <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredCareers.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-briefcase-line text-3xl text-slate-700 block mb-2" />
                {careers.length === 0 ? (
                  <>
                    <p className="text-slate-500 text-xs mb-3">Database kosong</p>
                    <button onClick={handleImportMockCareers} disabled={importingCareers} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors disabled:opacity-50">
                      {importingCareers ? <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> {importCareersProgress}%</> : <><i className="ri-download-cloud-line" /> Import {mockCareers.length} Lowongan</>}
                    </button>
                  </>
                ) : <p className="text-slate-500 text-xs">Tidak ada hasil.</p>}
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {filteredCareers.map((c) => (
                  <div key={c.id} className={`bg-[#111827] border rounded-xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group ${c.is_active ? (selectedSection === `career-${c.id}` ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-800 hover:border-slate-600') : 'border-slate-800/50 opacity-60'}`} onClick={() => { setEditCareer(c); setView('edit'); }}>
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0"><i className="ri-briefcase-line text-slate-500 text-base" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{c.title}</h3>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{c.department} · {c.location}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleToggleCareerActive(c); }} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${c.is_active ? 'bg-slate-800 text-slate-400' : 'bg-green-500/20 text-green-400'}`}><i className={c.is_active ? 'ri-eye-off-line text-xs' : 'ri-eye-line text-xs'} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setEditCareer(c); setView('edit'); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-xs" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteCareerID(c.id); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-xs" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'legacy':
        if (view !== 'list') return (
          <div className="p-5">
            <div className="mb-4">
              <h2 className="font-bold text-sm text-white">{view === 'edit' ? 'Edit Proyek Sejarah' : 'Tambah Proyek Sejarah'}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{view === 'edit' ? `Mengedit: ${editLegacy?.name}` : 'Isi detail proyek 2001-2008'}</p>
            </div>
            <LegacyProjectForm project={editLegacy} onSaved={() => { fetchLegacy(); setView('list'); showToast(view === 'edit' ? 'Proyek sejarah diperbarui!' : 'Proyek sejarah ditambahkan!'); }} onCancel={handleCancel} />
          </div>
        );
        return (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-amber-400 block">{legacyProjects.length}</span>
                <span className="text-slate-500 text-xs mt-1">Total</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-sky-400 block">{legacyProjects.filter(p => p.year >= 2001 && p.year <= 2004).length}</span>
                <span className="text-slate-500 text-xs mt-1">2001-2004</span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                <span className="font-black text-2xl text-green-400 block">{legacyProjects.filter(p => p.year >= 2005 && p.year <= 2008).length}</span>
                <span className="text-slate-500 text-xs mt-1">2005-2008</span>
              </div>
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input type="text" value={legacySearch} onChange={(e) => setLegacySearch(e.target.value)} placeholder="Cari proyek sejarah..." className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors" />
            </div>
            {legacyLoading ? (
              <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredLegacy.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-time-line text-3xl text-slate-700 block mb-2" />
                {legacyProjects.length === 0 ? (
                  <p className="text-slate-500 text-xs">Database kosong. Tambahkan proyek sejarah.</p>
                ) : <p className="text-slate-500 text-xs">Tidak ada hasil pencarian.</p>}
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {filteredLegacy.map((p) => (
                  <div key={p.id} className={`bg-[#111827] border rounded-xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group ${selectedSection === `legacy-${p.id}` ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-800 hover:border-slate-600'}`} onClick={() => { setEditLegacy(p); setView('edit'); }}>
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="font-syne font-bold text-xs text-slate-500">{p.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{p.name}</h3>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{p.client} · {p.value}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditLegacy(p); setView('edit'); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-amber-400/20 hover:text-amber-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-edit-line text-xs" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteLegacyId(p.id); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-colors cursor-pointer"><i className="ri-delete-bin-line text-xs" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'highlight': return <div className="p-5"><HighlightSettings /></div>;
      case 'applications': return <div className="p-5"><ApplicationsPanel /></div>;
      case 'settings': return <div className="p-5"><SiteSettings /></div>;
      default: return null;
    }
  };

  // === RESIZE HANDLERS ===
  const startResizeSidebar = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    resizeStartXRef.current = e.clientX;
    resizeStartWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const startResizeChat = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingChat(true);
    resizeStartYRef.current = e.clientY;
    resizeStartHeightRef.current = chatHeight;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, [chatHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const delta = e.clientX - resizeStartXRef.current;
        const newWidth = Math.max(260, Math.min(600, resizeStartWidthRef.current + delta));
        setSidebarWidth(newWidth);
      }
      if (isResizingChat) {
        const delta = resizeStartYRef.current - e.clientY; // drag up = taller
        const newHeight = Math.max(140, Math.min(520, resizeStartHeightRef.current + delta));
        setChatHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingChat(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    if (isResizingSidebar || isResizingChat) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingChat]);

  return (
    <div className="h-screen w-screen bg-[#080C14] text-white flex flex-col overflow-hidden">
      {/* Auth Loading Screen */}
      {authLoading && (
        <div className="fixed inset-0 z-[70] bg-[#080C14] flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs">Memeriksa sesi...</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-amber-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <i className="ri-checkbox-circle-line text-sm" />{toast}
        </div>
      )}

      {/* Delete Confirm Modals */}
      {deleteProjectId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3"><i className="ri-delete-bin-line text-xl text-red-400" /></div>
            <h3 className="font-bold text-sm mb-1">Hapus Proyek?</h3>
            <p className="text-slate-400 text-xs mb-4">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteProject} disabled={deletingProject} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">{deletingProject ? 'Menghapus...' : 'Ya, Hapus'}</button>
              <button onClick={() => setDeleteProjectId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}
      {deleteNewsId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3"><i className="ri-delete-bin-line text-xl text-red-400" /></div>
            <h3 className="font-bold text-sm mb-1">Hapus Artikel?</h3>
            <p className="text-slate-400 text-xs mb-4">Tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteNews} disabled={deletingNews} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">{deletingNews ? 'Menghapus...' : 'Ya, Hapus'}</button>
              <button onClick={() => setDeleteNewsId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}
      {deleteCareerID && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3"><i className="ri-delete-bin-line text-xl text-red-400" /></div>
            <h3 className="font-bold text-sm mb-1">Hapus Lowongan?</h3>
            <p className="text-slate-400 text-xs mb-4">Tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteCareer} disabled={deletingCareer} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">{deletingCareer ? 'Menghapus...' : 'Ya, Hapus'}</button>
              <button onClick={() => setDeleteCareerID(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}
      {deleteLegacyId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3"><i className="ri-delete-bin-line text-xl text-red-400" /></div>
            <h3 className="font-bold text-sm mb-1">Hapus Proyek Sejarah?</h3>
            <p className="text-slate-400 text-xs mb-4">Tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={handleDeleteLegacy} disabled={deletingLegacy} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50">{deletingLegacy ? 'Menghapus...' : 'Ya, Hapus'}</button>
              <button onClick={() => setDeleteLegacyId(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-2.5 rounded-lg cursor-pointer whitespace-nowrap">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Edit Popup */}
      <InlineEditPopup
        data={inlineEditData}
        themeValues={(theme || {}) as Record<string, string>}
        onClose={() => setInlineEditData(null)}
        onSaved={async () => {
          showToast('Perubahan tersimpan! Preview diperbarui.');
          // Refresh local state
          await refresh();
          // Fetch fresh theme from DB
          const { data: freshRows } = await supabase.from('site_settings').select('key, value');
          const freshTheme: Record<string, string> = {};
          const freshSections: Record<string, boolean> = {};
          (freshRows || []).forEach((r: { key: string; value: string }) => {
            if (['hero','stats','services','projects','clients','cta'].includes(r.key)) {
              freshSections[r.key] = r.value === 'true' || r.value === '1' || r.value === 'yes';
            } else {
              freshTheme[r.key] = r.value;
            }
          });
          // Manually push to LivePreview via custom event (avoiding infinite loop)
          window.dispatchEvent(new CustomEvent('WMM_LIVE_PREVIEW_PUSH_THEME', {
            detail: { type: 'WMM_LIVE_PREVIEW_PUSH_THEME', theme: freshTheme, sections: freshSections },
          }));
        }}
      />

      {/* ═══════ TOP HEADER ═══════ */}
      <header className="h-12 bg-[#0A0E14] border-b border-slate-800 flex items-center px-4 shrink-0 z-40">
        <a href="/" className="flex items-center gap-2 mr-6 shrink-0">
          <div className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <i className="ri-arrow-left-line text-xs" />
          </div>
          <span className="font-bold text-xs">WMM Admin</span>
        </a>

        {/* Tab pills */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {authUser?.email && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-slate-500 text-[10px] hidden sm:block">{authUser.email}</span>
              <button
                onClick={handleLogout}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                title="Logout"
              >
                <i className="ri-logout-box-r-line text-xs" />
              </button>
            </div>
          )}
          {view === 'list' && activeTab !== 'highlight' && activeTab !== 'settings' && activeTab !== 'applications' && (
            <button onClick={handleAdd} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap flex items-center gap-1 transition-colors">
              <i className="ri-add-line" />{getAddLabel()}
            </button>
          )}
          {view !== 'list' && (
            <button onClick={handleCancel} className="text-slate-400 hover:text-white text-[11px] cursor-pointer flex items-center gap-1 transition-colors">
              <i className="ri-close-line" /> Batal
            </button>
          )}
        </div>
      </header>

      {/* ═══════ MAIN BODY: 3-column layout ═══════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Tab content */}
        <div
          className={`shrink-0 border-r border-slate-800 bg-[#0A0E14] overflow-y-auto transition-opacity duration-300 ${sidebarCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}
          style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
        >
          {renderSidebarContent()}
        </div>

        {/* Collapse toggle + Resize handle */}
        <div className="shrink-0 flex flex-col">
          {/* Collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-5 h-8 bg-[#0A0E14] border-r border-slate-800 hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={sidebarCollapsed ? 'ri-arrow-right-s-line text-slate-500 text-xs' : 'ri-arrow-left-s-line text-slate-500 text-xs'} />
          </button>
          {/* Vertical resize drag handle */}
          {!sidebarCollapsed && (
            <div
              className="flex-1 w-5 cursor-col-resize hover:bg-slate-700/50 active:bg-slate-600/50 transition-colors flex items-center justify-center"
              onMouseDown={startResizeSidebar}
              title="Drag untuk resize sidebar"
            >
              <div className="w-px h-8 bg-slate-600" />
            </div>
          )}
          {sidebarCollapsed && <div className="flex-1 w-5" />}
        </div>

        {/* RIGHT PANEL: Preview + AI Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050A14] overflow-hidden">
          {/* Live Preview (top, takes most space) */}
          <div className={`flex-1 min-h-0 relative ${chatExpanded ? 'hidden' : 'flex flex-col'}`}>
            <LivePreview
              themeData={theme}
              sectionsData={sections}
              editMode={previewEditMode}
              selectedSection={selectedSection}
              onSelectSection={(id) => {
                setSelectedSection(id);
                // Auto-scroll sidebar to matching item when in list view
                if (activeTab === 'projects' && id?.startsWith('project-')) {
                  const pid = Number(id.replace('project-', ''));
                  const p = projects.find(x => x.id === pid);
                  if (p) { setEditProject(p); setView('edit'); }
                }
                if (activeTab === 'news' && id?.startsWith('news-')) {
                  const nid = Number(id.replace('news-', ''));
                  const n = newsList.find(x => x.id === nid);
                  if (n) { setEditNews(n); setView('edit'); }
                }
                if (activeTab === 'careers' && id?.startsWith('career-')) {
                  const cid = Number(id.replace('career-', ''));
                  const c = careers.find(x => x.id === cid);
                  if (c) { setEditCareer(c); setView('edit'); }
                }
              }}
              onInlineEdit={(payload) => {
                setInlineEditData({
                  sectionId: payload.id,
                  sectionLabel: payload.label,
                  editField: payload.editField,
                  fields: payload.editableFields.map((key) => ({ key, label: key, value: theme[key as keyof typeof theme] || '' })),
                });
                // When inline editing happens, we need to refresh theme data for the popup
                refresh();
              }}
              onToggleEditMode={() => setPreviewEditMode(!previewEditMode)}
            />
            {selectedSection && (
              <div className="absolute bottom-3 left-3 bg-amber-400/90 text-black text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                <i className="ri-edit-line" /> {selectedSection}
                <button onClick={() => setSelectedSection(null)} className="ml-1 hover:text-red-600 cursor-pointer"><i className="ri-close-line" /></button>
              </div>
            )}
          </div>

          {/* Horizontal resize handle (between preview & chat) */}
          {!chatExpanded && (
            <div
              className="h-3 shrink-0 cursor-row-resize hover:bg-slate-700/50 active:bg-slate-600/50 transition-colors flex items-center justify-center border-t border-b border-slate-800/50"
              onMouseDown={startResizeChat}
              title="Drag untuk resize panel AI chat"
            >
              <div className="w-8 h-px bg-slate-600 rounded" />
            </div>
          )}

          {/* AI Chat Panel (bottom, expandable) */}
          <div
            className={`shrink-0 border-t border-slate-800 bg-[#0A0E14] flex flex-col transition-all duration-300 ${chatExpanded ? 'flex-1' : ''}`}
            style={{ height: chatExpanded ? undefined : chatHeight }}
          >
            {/* Chat header / toggle */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center rounded bg-amber-400/10 border border-amber-400/20">
                  <i className="ri-robot-2-line text-amber-400 text-[10px]" />
                </div>
                <span className="font-bold text-[11px] text-white">AI Copilot</span>
                <span className="text-[10px] text-slate-500">Hybrid AI — Rule + LLM</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setChatExpanded(!chatExpanded)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
                  title={chatExpanded ? 'Minimize chat' : 'Expand chat'}
                >
                  <i className={chatExpanded ? 'ri-contract-up-down-line text-xs' : 'ri-expand-up-down-line text-xs'} />
                </button>
                <button
                  onClick={() => setPreviewEditMode(!previewEditMode)}
                  className={`w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors ${previewEditMode ? 'bg-amber-400/15 text-amber-400' : 'hover:bg-slate-700 text-slate-400 hover:text-white'}`}
                  title="Select to Edit"
                >
                  <i className={previewEditMode ? 'ri-cursor-fill text-xs' : 'ri-cursor-line text-xs'} />
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <AiCopilotPanel
                onProjectAdded={fetchProjects}
                onNewsAdded={fetchNews}
                onCareerAdded={fetchCareers}
                onThemeUpdated={async () => {
                  refresh();
                  // Fetch fresh theme from DB
                  const { data: freshRows } = await supabase.from('site_settings').select('key, value');
                  const freshTheme: Record<string, string> = {};
                  const freshSections: Record<string, boolean> = {};
                  (freshRows || []).forEach((r: { key: string; value: string }) => {
                    if (['hero','stats','services','projects','clients','cta'].includes(r.key)) {
                      freshSections[r.key] = r.value === 'true' || r.value === '1' || r.value === 'yes';
                    } else {
                      freshTheme[r.key] = r.value;
                    }
                  });
                  // Manually push to LivePreview via custom event
                  window.dispatchEvent(new CustomEvent('WMM_LIVE_PREVIEW_PUSH_THEME', {
                    detail: { type: 'WMM_LIVE_PREVIEW_PUSH_THEME', theme: freshTheme, sections: freshSections },
                  }));
                }}
                compact={!chatExpanded}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}