import { useState, useMemo } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { LegacyProjectRow } from '@/lib/supabase';

interface LegacyTableProps {
  projects: LegacyProjectRow[];
}

export default function LegacyTable({ projects }: LegacyTableProps) {
  const { isDark } = useThemeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<number | 'Semua'>('Semua');

  const availableYears = useMemo(
    () => [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = yearFilter === 'Semua' || p.year === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [projects, searchTerm, yearFilter]);

  // Theme tokens
  const wrapperBg = isDark ? 'bg-[#0D1117] border border-slate-800' : 'bg-white border-2 border-blue-100 shadow-sm';
  const headerBg = isDark ? 'bg-slate-900/95' : 'bg-slate-50';
  const headerText = isDark ? 'text-slate-300' : 'text-slate-700';
  const rowEven = isDark ? 'bg-[#0D1628]/30' : 'bg-white';
  const rowOdd = isDark ? 'bg-[#0D1117]' : 'bg-slate-50/60';
  const rowText = isDark ? 'text-slate-300' : 'text-slate-700';
  const rowTextSecondary = isDark ? 'text-slate-500' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-800' : 'border-blue-100';
  const hoverBg = isDark ? 'hover:bg-slate-800/40' : 'hover:bg-blue-50';
  const inputBg = isDark ? 'bg-[#0D1628] border-slate-700 text-slate-300' : 'bg-white border-blue-200 text-slate-700';
  const yearBadge = isDark
    ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30'
    : 'bg-blue-50 text-blue-700 border border-blue-200';
  const categoryBadge = isDark
    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  const emptyText = isDark ? 'text-slate-500' : 'text-slate-500';
  const emptyIcon = isDark ? 'text-slate-700' : 'text-blue-200';
  const cardValue = isDark ? 'text-sky-400' : 'text-blue-700';

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 flex-1 w-full sm:max-w-md ${inputBg} border`}>
          <i className={`ri-search-line text-sm ${isDark ? 'text-slate-500' : 'text-blue-400'}`} />
          <input
            type="text"
            placeholder="Cari proyek, klien, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-xs font-body w-full"
            style={{ color: 'inherit' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="cursor-pointer shrink-0">
              <i className={`ri-close-line text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 flex-1 sm:flex-none ${inputBg} border`}>
            <i className={`ri-calendar-line text-sm ${isDark ? 'text-slate-500' : 'text-blue-400'}`} />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value === 'Semua' ? 'Semua' : Number(e.target.value))}
              className="bg-transparent outline-none text-xs font-body cursor-pointer appearance-none pr-4 w-full sm:w-auto"
              style={{ color: 'inherit' }}
            >
              <option value="Semua">Semua Tahun</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <i className={`ri-arrow-down-s-line text-sm pointer-events-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          </div>
        </div>
      </div>

      {/* ========== MOBILE: Card List (sm:hidden) — max 5 cards visible, rest scroll ========== */}
      <div className="sm:hidden">
        <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
          {filtered.map((project) => (
            <div
              key={project.id}
              className={`rounded-xl p-4 ${wrapperBg} transition-colors duration-150 shrink-0`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className={`inline-block font-body text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${yearBadge}`}>
                  {project.year}
                </span>
              </div>

              <h4 className={`font-body text-sm font-semibold leading-snug mb-2 ${rowText}`}>
                {project.name}
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-block font-body text-xs font-medium px-2.5 py-1 rounded-md ${categoryBadge}`}>
                  {project.category}
                </span>
                <span className={`font-body text-xs ${rowTextSecondary}`}>
                  {project.client}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <i className={`ri-inbox-line text-4xl mb-3 block ${emptyIcon}`} />
              <p className={`font-body text-sm ${emptyText}`}>
                Tidak ada proyek yang sesuai filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========== DESKTOP: Table (hidden sm:block) ========== */}
      <div className={`hidden sm:block rounded-xl overflow-hidden ${wrapperBg}`}>
        <div className="overflow-x-auto overflow-y-auto max-h-[480px]">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className={`sticky top-0 z-10 ${headerBg} backdrop-blur-sm`}>
              <tr className={`border-b ${borderColor}`}>
                <th className={`px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wider ${headerText}`}>
                  Tahun
                </th>
                <th className={`px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wider ${headerText}`}>
                  Nama Proyek
                </th>
                <th className={`px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wider ${headerText}`}>
                  Klien
                </th>
                <th className={`px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wider ${headerText}`}>
                  Kategori
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, idx) => (
                <tr
                  key={project.id}
                  className={`border-b ${borderColor} ${idx % 2 === 0 ? rowEven : rowOdd} ${hoverBg} transition-colors duration-150`}
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-block font-body text-xs font-bold px-2.5 py-1 rounded-md ${yearBadge}`}>
                      {project.year}
                    </span>
                  </td>
                  <td className={`px-4 py-3.5 font-body text-sm font-semibold leading-snug ${rowText}`}>
                    {project.name}
                  </td>
                  <td className={`px-4 py-3.5 font-body text-xs ${rowTextSecondary}`}>
                    {project.client}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-block font-body text-xs font-medium px-2.5 py-1 rounded-md ${categoryBadge}`}>
                      {project.category}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center">
                    <i className={`ri-inbox-line text-4xl mb-3 block ${emptyIcon}`} />
                    <p className={`font-body text-sm ${emptyText}`}>
                      Tidak ada proyek yang sesuai filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}