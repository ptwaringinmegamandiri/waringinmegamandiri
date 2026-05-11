import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { parseCSV, downloadFile } from '@/lib/csvHelper';

type EntityType = 'projects' | 'news' | 'careers';

interface DataExchangePanelProps {
  entity: EntityType;
  label: string;
  onImported?: () => void;
}

const TABLE_MAP: Record<EntityType, string> = {
  projects: 'projects',
  news: 'news',
  careers: 'careers',
};

/* ───────────── CSV TEMPLATES ───────────── */

const PROJECT_TEMPLATE = `name,building_type,location,year,status,work_package,unit_count,building_area,floors,description,client,value,cover_image,images
Hotel Amaris Jakarta,Hotel,Jakarta Pusat,2025,Selesai,"Struktur, Arsitektur dan MEP",120 Unit,"12.500 m²",8 Lantai,"Hotel bintang 3 dengan fasilitas lengkap di pusat kota Jakarta",PT Archipelago International,Rp 45.000.000.000,-,https://example.com/cover.jpg,"https://example.com/1.jpg, https://example.com/2.jpg, https://example.com/3.jpg"`;

const NEWS_TEMPLATE = `slug,category,title,excerpt,image,author,date,read_time,featured,tags,content
hotel-amaris-selesai,Proyek,Hotel Amaris Jakarta Resmi Beroperasi,"Proyek hotel bintang 3 di Jakarta Pusat telah selesai dikerjakan tepat waktu dengan kualitas terbaik.",https://example.com/news.jpg,Tim Redaksi WMM,10 Januari 2026,3 menit,false,"Proyek, Hotel, Jakarta","Artikel lengkap tentang proyek hotel amaris jakarta yang baru saja selesai dibangun."`;

const CAREER_TEMPLATE = `title,department,location,type,level,salary,deadline,description,requirements,benefits,tags,is_active
Site Engineer (Struktur),Engineering,Jakarta Selatan,Full-time,Mid-Level,"Rp 8.000.000 – 13.000.000",30 April 2026,"Bertanggung jawab atas pengawasan teknis di lapangan proyek konstruksi.","S1 Teknik Sipil\nPengalaman 3+ tahun\nSertifikasi K3","BPJS Kesehatan & Ketenagakerjaan\nBonus Proyek\nAsuransi Jiwa","Struktur, Lapangan, Engineering",true`;

const TEMPLATES: Record<EntityType, string> = {
  projects: PROJECT_TEMPLATE,
  news: NEWS_TEMPLATE,
  careers: CAREER_TEMPLATE,
};

const TEMPLATE_NAMES: Record<EntityType, string> = {
  projects: 'template-proyek.csv',
  news: 'template-news.csv',
  careers: 'template-karir.csv',
};

/* ───────────── EXPORT COLUMNS ───────────── */

const EXPORT_COLUMNS: Record<EntityType, string> = {
  projects: 'id, name, building_type, location, year, status, work_package, unit_count, building_area, floors, description, cover_image, client, value, created_at, updated_at',
  news: 'id, slug, category, title, excerpt, image, author, date, read_time, featured, tags, content, created_at, updated_at',
  careers: 'id, title, department, location, type, level, salary, deadline, description, requirements, benefits, tags, is_active, created_at, updated_at',
};

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = rows.map((row) =>
    keys.map((k) => {
      let val = row[k];
      if (val === null || val === undefined) val = '';
      const str = String(val);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(','),
  );
  return [header, ...lines].join('\n');
}

export default function DataExchangePanel({ entity, label, onImported }: DataExchangePanelProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<{ added: number; skipped: number; failed: number } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ─── Export ─── */
  const handleExport = useCallback(async () => {
    setExporting(true);
    const { data, error } = await supabase
      .from(TABLE_MAP[entity])
      .select(EXPORT_COLUMNS[entity])
      .order('id', { ascending: false });

    if (error || !data) {
      setExporting(false);
      return;
    }

    const cleanData = data.map((row: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      Object.entries(row).forEach(([k, v]) => {
        if (v !== null && v !== undefined) clean[k] = v;
      });
      return clean;
    });

    const csv = toCSV(cleanData);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(csv, `wmm-${entity}-export-${date}.csv`, 'text/csv');
    setExporting(false);
  }, [entity]);

  /* ─── Template ─── */
  const handleDownloadTemplate = () => {
    downloadFile(TEMPLATES[entity], TEMPLATE_NAMES[entity], 'text/csv');
  };

  /* ─── Import CSV ─── */
  const handleImportFile = useCallback(async (file: File) => {
    setImporting(true);
    setImportProgress(0);
    setImportStats(null);

    let rows: string[][] = [];
    try {
      const text = await file.text();
      rows = parseCSV(text);
      if (rows.length < 2) throw new Error('CSV kosong atau tidak valid');
    } catch (e) {
      setImporting(false);
      return;
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1);

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const cells = dataRows[i];
      const rowObj: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cells[idx] || '';
      });

      // ── Projects ──
      if (entity === 'projects') {
        const name = String(rowObj.name || '').trim();
        if (!name) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const { data: dup } = await supabase.from('projects').select('id').eq('name', name).maybeSingle();
        if (dup) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const payload = {
          name,
          building_type: String(rowObj.building_type || 'Hotel'),
          location: String(rowObj.location || ''),
          year: Number(rowObj.year) || new Date().getFullYear(),
          status: String(rowObj.status || 'Selesai'),
          work_package: String(rowObj.work_package || ''),
          unit_count: String(rowObj.unit_count || ''),
          building_area: String(rowObj.building_area || ''),
          floors: String(rowObj.floors || ''),
          description: String(rowObj.description || ''),
          client: String(rowObj.client || ''),
          value: String(rowObj.value || ''),
          cover_image: String(rowObj.cover_image || ''),
        };

        const { data: inserted, error: insErr } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
        if (insErr || !inserted) { failed++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        // Insert images
        const imgStr = String(rowObj.images || '');
        const imageUrls = imgStr.split(',').map((u) => u.trim()).filter(Boolean);
        if (imageUrls.length > 0) {
          const imgRows = imageUrls.map((url, idx) => ({
            project_id: inserted.id,
            image_url: url,
            sort_order: idx,
          }));
          await supabase.from('project_images').insert(imgRows);
        }
        added++;
      }

      // ── News ──
      if (entity === 'news') {
        const title = String(rowObj.title || '').trim();
        if (!title) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const { data: dup } = await supabase.from('news').select('id').eq('title', title).maybeSingle();
        if (dup) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const tagsStr = String(rowObj.tags || '');
        const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);

        const payload = {
          slug: String(rowObj.slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')),
          category: String(rowObj.category || 'Proyek'),
          title,
          excerpt: String(rowObj.excerpt || ''),
          image: String(rowObj.image || ''),
          author: String(rowObj.author || 'Tim Redaksi WMM'),
          date: String(rowObj.date || new Date().toLocaleDateString('id-ID')),
          read_time: String(rowObj.read_time || '3 menit'),
          featured: String(rowObj.featured || 'false').toLowerCase() === 'true',
          tags,
          content: String(rowObj.content || ''),
        };

        const { error: insErr } = await supabase.from('news').insert(payload);
        if (insErr) failed++;
        else added++;
      }

      // ── Careers ──
      if (entity === 'careers') {
        const title = String(rowObj.title || '').trim();
        if (!title) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const { data: dup } = await supabase.from('careers').select('id').eq('title', title).maybeSingle();
        if (dup) { skipped++; setImportProgress(Math.round(((i + 1) / dataRows.length) * 100)); continue; }

        const reqs = String(rowObj.requirements || '').split('\n').map((r) => r.trim()).filter(Boolean);
        const benefits = String(rowObj.benefits || '').split('\n').map((b) => b.trim()).filter(Boolean);
        const tags = String(rowObj.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

        const payload = {
          title,
          department: String(rowObj.department || 'Engineering'),
          location: String(rowObj.location || 'Jakarta Selatan'),
          type: String(rowObj.type || 'Full-time'),
          level: String(rowObj.level || 'Mid-Level'),
          salary: String(rowObj.salary || ''),
          deadline: String(rowObj.deadline || ''),
          description: String(rowObj.description || ''),
          requirements: reqs,
          benefits,
          tags,
          is_active: String(rowObj.is_active || 'true').toLowerCase() === 'true',
        };

        const { error: insErr } = await supabase.from('careers').insert(payload);
        if (insErr) failed++;
        else added++;
      }

      setImportProgress(Math.round(((i + 1) / dataRows.length) * 100));
    }

    setImporting(false);
    setImportStats({ added, skipped, failed });
    setTimeout(() => setImportStats(null), 8000);
    onImported?.();
  }, [entity, onImported]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('File harus berformat .csv');
      return;
    }
    handleImportFile(file);
    e.target.value = '';
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {exporting ? <div className="w-3 h-3 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" /> : <i className="ri-download-2-line" />}
          Export {label} (CSV)
        </button>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-file-list-3-line" />
          Download Template CSV
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-400/40 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {importing ? <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /> : <i className="ri-upload-2-line" />}
          Import CSV {label}
        </button>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs px-2 py-2 transition-colors cursor-pointer"
        >
          <i className={`ri-question-line ${showGuide ? 'text-amber-400' : ''}`} />
          {showGuide ? 'Tutup Panduan' : 'Panduan'}
        </button>

        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
      </div>

      {importing && (
        <div className="flex items-center gap-3 mb-2">
          <div className="w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
          </div>
          <span className="text-slate-400 text-xs font-medium">{importProgress}%</span>
        </div>
      )}

      {importStats && (
        <div className={`text-xs font-semibold mb-2 ${importStats.failed > 0 ? 'text-red-400' : 'text-green-400'}`}>
          <i className={importStats.failed > 0 ? 'ri-close-circle-line' : 'ri-checkbox-circle-line'} className="mr-1" />
          {importStats.added} ditambah, {importStats.skipped} dilewati (sudah ada), {importStats.failed} gagal
        </div>
      )}

      {showGuide && (
        <div className="bg-[#0D1117] border border-slate-700 rounded-xl p-4 text-sm space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Cara Import CSV {label}</h4>
          <ol className="text-slate-400 text-xs space-y-1.5 list-decimal list-inside">
            <li>Klik <strong className="text-amber-400">Download Template CSV</strong> untuk dapetin file contoh</li>
            <li>Buka file di Excel / Google Sheets / Notepad, isi banyak baris sekaligus</li>
            <li>Simpan file dengan format <strong className="text-white">.csv</strong> (Comma Separated Values)</li>
            <li>Klik <strong className="text-amber-400">Import CSV {label}</strong> dan pilih file yang udah diisi</li>
            <li>Sistem otomatis baca baris demi baris dan masukkin ke database</li>
          </ol>
          <div className="text-slate-500 text-xs border-t border-slate-800 pt-2 mt-2">
            <p className="font-semibold text-slate-400 mb-1">Tips:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>Data yang sudah ada (dicek dari nama/judul) bakal dilewati otomatis — nggak duplikat</li>
              <li>Untuk kolom <strong className="text-white">images</strong> (Proyek), pisahkan URL dengan koma</li>
              <li>Untuk <strong className="text-white">requirements</strong> & <strong className="text-white">benefits</strong> (Karir), tulis satu per baris dalam satu cell</li>
              <li>Untuk <strong className="text-white">tags</strong>, pisahkan dengan koma</li>
              <li>Kolom <strong className="text-white">featured</strong> (News) & <strong className="text-white">is_active</strong> (Karir): isi <code className="text-amber-400">true</code> atau <code className="text-amber-400">false</code></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
