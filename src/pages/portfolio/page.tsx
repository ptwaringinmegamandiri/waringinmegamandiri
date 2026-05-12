import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroBanner from '@/pages/about/components/HeroBanner';
import ProjectCard from '@/pages/portfolio/components/ProjectCard';
import ProjectModal from '@/pages/portfolio/components/ProjectModal';
import LegacyTable from '@/pages/portfolio/components/LegacyTable';
import { useThemeContext } from '@/context/ThemeContext';
import { Project, BuildingType } from '@/mocks/projects';
import { useProjects } from '@/hooks/useProjects';
import { useLegacyProjects } from '@/hooks/useLegacyProjects';
import { useSiteTheme } from '@/context/SiteThemeContext';
import type { LegacyProjectRow } from '@/lib/supabase';

type StatusFilter = 'Semua' | 'Selesai' | 'Ongoing';

const BUILDING_TYPE_LABELS: Record<string, string> = {
  Hotel: 'Hotel',
  Apartemen: 'Apartemen',
  Ruko: 'Ruko',
  Kantor: 'Kantor',
  Perumahan: 'Perumahan',
  Pasar: 'Pasar',
  Mall: 'Mall / Pusat Belanja',
  'Rumah Sakit': 'Rumah Sakit',
  Sekolah: 'Sekolah',
  Kampus: 'Kampus',
  Gudang: 'Gudang',
  Pabrik: 'Pabrik',
  'Rumah Ibadah': 'Rumah Ibadah',
  'Marketing Gallery': 'Marketing Gallery',
  'Club House': 'Club House',
  Infrastruktur: 'Infrastruktur',
  Lainnya: 'Lainnya',
};

export default function PortfolioPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { theme } = useSiteTheme();
  const { projects, featuredProjects, loading: projectsLoading } = useProjects();
  const { projects: legacyProjects, loading: legacyLoading } = useLegacyProjects();
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('Semua');
  const [activeBuildingType, setActiveBuildingType] = useState<BuildingType | 'Semua'>('Semua');
  const [activeYear, setActiveYear] = useState<number | 'Semua'>('Semua');
  const [selected, setSelected] = useState<Project | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const GRID_COUNT = 9; // 3 rows x 3 cols

  const getCardsPerSlide = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());

  useEffect(() => {
    const handleResize = () => setCardsPerSlide(getCardsPerSlide());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CARDS_PER_SLIDE = cardsPerSlide;

  const selesaiCount = projects.filter((p) => p.status === 'Selesai' && p.year >= 2010).length;
  const ongoingCount = projects.filter((p) => p.status === 'Ongoing' && p.year >= 2010).length;

  const availableYears = useMemo(() => {
    const years = [...new Set(projects.filter((p) => p.year >= 2010).map((p) => p.year))].sort((a, b) => b - a);
    return years;
  }, [projects]);

  const availableBuildingTypes = useMemo(() => {
    const types = [...new Set(projects.filter((p) => p.year >= 2010).map((p) => p.buildingType))] as BuildingType[];
    return types.sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const statusOk = activeStatus === 'Semua' || p.status === activeStatus;
      const typeOk = activeBuildingType === 'Semua' || p.buildingType === activeBuildingType;
      const yearOk = activeYear === 'Semua' || p.year === activeYear;
      const isModern = p.year >= 2010;
      return statusOk && typeOk && yearOk && isModern;
    });
  }, [projects, activeStatus, activeBuildingType, activeYear]);

  const resetFilters = () => {
    setActiveStatus('Semua');
    setActiveBuildingType('Semua');
    setActiveYear('Semua');
  };

  const hasActiveFilter = activeStatus !== 'Semua' || activeBuildingType !== 'Semua' || activeYear !== 'Semua';

  const hasFeatured = featuredProjects.length > 0;

  const gridProjects = useMemo(() => {
    if (hasFeatured && !hasActiveFilter) {
      const featuredInFilter = featuredProjects.filter((fp) =>
        filtered.some((f) => f.id === fp.id)
      );
      return featuredInFilter.slice(0, GRID_COUNT);
    }
    return filtered.slice(0, GRID_COUNT);
  }, [filtered, featuredProjects, hasFeatured, hasActiveFilter]);

  const carouselProjects = useMemo(() => {
    if (hasFeatured && !hasActiveFilter) {
      const gridIds = new Set(gridProjects.map((p) => p.id));
      return filtered.filter((p) => !gridIds.has(p.id));
    }
    return filtered.slice(GRID_COUNT);
  }, [filtered, gridProjects, hasFeatured, hasActiveFilter]);
  const totalSlides = Math.max(0, carouselProjects.length - CARDS_PER_SLIDE);

  useEffect(() => {
    setCarouselIndex(0);
    setDragOffset(0);
  }, [filtered]);

  const goTo = useCallback((index: number) => {
    setCarouselIndex(Math.max(0, Math.min(index, totalSlides)));
    setDragOffset(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => goTo(carouselIndex - 1), [carouselIndex, goTo]);
  const nextSlide = useCallback(() => goTo(carouselIndex + 1), [carouselIndex, goTo]);

  const onMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStartX(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; setDragOffset(e.clientX - dragStartX); };
  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) nextSlide();
    else if (dragOffset > 60) prevSlide();
    setDragOffset(0);
  };
  const onTouchStart = (e: React.TouchEvent) => { setIsDragging(true); setDragStartX(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { if (!isDragging) return; setDragOffset(e.touches[0].clientX - dragStartX); };
  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) nextSlide();
    else if (dragOffset > 60) prevSlide();
    setDragOffset(0);
  };

  const getCardWidth = () => {
    if (!carouselRef.current) return 0;
    const gap = CARDS_PER_SLIDE === 1 ? 0 : 24;
    return (carouselRef.current.offsetWidth - gap * (CARDS_PER_SLIDE - 1)) / CARDS_PER_SLIDE;
  };
  const translateX = -(carouselIndex * (getCardWidth() + (CARDS_PER_SLIDE === 1 ? 0 : 24))) + dragOffset;

  const sectionBg = isDark ? 'bg-[var(--dark-bg)]' : 'bg-[#F0F6FF]';
  const filterBarBg = isDark
    ? 'bg-[#0D1117] border border-slate-800'
    : 'bg-white border-2 border-blue-100 shadow-sm';
  const filterTabActive = isDark ? 'bg-white/10 text-white' : 'bg-blue-600 text-white';
  const filterTabInactive = isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800';
  const filterDivider = isDark ? 'bg-slate-800' : 'bg-blue-100';
  const selectBg = isDark
    ? 'bg-[#0D1117] border border-slate-800'
    : 'bg-white border-2 border-blue-100 shadow-sm';
  const selectIconColor = isDark ? 'text-slate-500' : 'text-blue-500';
  const selectTextColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const selectArrowColor = isDark ? 'text-slate-600' : 'text-slate-400';
  const selectColorScheme = isDark ? 'dark' : 'light';
  const selectOptionBg = isDark ? '#0D1117' : '#ffffff';
  const selectOptionColor = isDark ? '#CBD5E1' : '#1e293b';
  const resetBtnColor = isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800';
  const ctaBorderColor = isDark ? 'border-sky-400/10' : 'border-blue-200';
  const ctaTextColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const emptyIconColor = isDark ? 'text-slate-700' : 'text-blue-200';
  const emptyTextColor = isDark ? 'text-slate-600' : 'text-slate-500';
  const emptyLinkColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const carouselBtnActive = isDark
    ? 'bg-sky-400/20 border border-sky-400/40 text-sky-300 hover:bg-sky-400/30'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  const carouselBtnDisabled = isDark
    ? 'bg-slate-800/50 border border-slate-700 text-slate-600 cursor-not-allowed'
    : 'bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed';
  const carouselDivider = isDark ? 'border-sky-400/10' : 'border-blue-100';

  return (
    <div className={`min-h-screen ${sectionBg}`}>
      <div data-preview-id="navbar" data-preview-label="Navbar" data-editable-fields="navbar_brand_text,navbar_cta_text">
        <Navbar />
      </div>
      <main className="flex-1">
        <div data-preview-id="portfolio-hero" data-preview-label="Portfolio Hero" data-editable-fields="portfolio_title,portfolio_subtitle">
          <HeroBanner
            title={theme.portfolio_title || t('portfolio.title')}
            subtitle={theme.portfolio_subtitle || t('portfolio.subtitle')}
            breadcrumb={t('portfolio.breadcrumb')}
          />
        </div>
        <div data-preview-id="portfolio-content" data-preview-label="Projects Grid & Filters">

        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">

              {/* Status tabs */}
              <div className={`flex items-center rounded-lg p-1 gap-0.5 ${filterBarBg}`}>
                {(['Semua', 'Ongoing', 'Selesai'] as StatusFilter[]).map((s) => {
                  const isActive = activeStatus === s;
                  const count = s === 'Semua'
                    ? filtered.length
                    : projects.filter((p) => p.status === s && p.year >= 2010).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setActiveStatus(s)}
                      className={`relative font-body text-xs px-4 py-2 rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isActive ? filterTabActive : filterTabInactive
                      }`}
                    >
                      {s !== 'Semua' && (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          s === 'Ongoing'
                            ? (isActive ? (isDark ? 'bg-sky-400' : 'bg-white') : (isDark ? 'bg-sky-400 animate-pulse' : 'bg-blue-400 animate-pulse'))
                            : (isActive ? (isDark ? 'bg-green-400' : 'bg-white') : (isDark ? 'bg-green-400' : 'bg-emerald-500'))
                        }`} />
                      )}
                      {s} {s === 'Semua' ? '' : `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className={`hidden md:block w-px h-8 ${filterDivider}`} />

              {/* Tipe Bangunan dropdown */}
              <div className="relative">
                <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 cursor-pointer ${selectBg}`}>
                  <i className={`ri-building-2-line text-sm ${selectIconColor}`} />
                  <select
                    value={activeBuildingType}
                    onChange={(e) => setActiveBuildingType(e.target.value as BuildingType | 'Semua')}
                    className={`font-body text-xs cursor-pointer outline-none appearance-none pr-5 min-w-[120px] ${selectTextColor}`}
                    style={{ colorScheme: selectColorScheme, backgroundColor: 'transparent' }}
                  >
                    <option value="Semua" style={{ backgroundColor: selectOptionBg, color: selectOptionColor }}>Semua Tipe</option>
                    {availableBuildingTypes.map((type) => (
                      <option key={type} value={type} style={{ backgroundColor: selectOptionBg, color: selectOptionColor }}>{BUILDING_TYPE_LABELS[type] || type}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line text-sm pointer-events-none ${selectArrowColor}`} />
                </div>
                {activeBuildingType !== 'Semua' && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>

              {/* Tahun dropdown */}
              <div className="relative">
                <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 cursor-pointer ${selectBg}`}>
                  <i className={`ri-calendar-line text-sm ${selectIconColor}`} />
                  <select
                    value={activeYear}
                    onChange={(e) => setActiveYear(e.target.value === 'Semua' ? 'Semua' : Number(e.target.value))}
                    className={`font-body text-xs cursor-pointer outline-none appearance-none pr-5 min-w-[100px] ${selectTextColor}`}
                    style={{ colorScheme: selectColorScheme, backgroundColor: 'transparent' }}
                  >
                    <option value="Semua" style={{ backgroundColor: selectOptionBg, color: selectOptionColor }}>Semua Tahun</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year} style={{ backgroundColor: selectOptionBg, color: selectOptionColor }}>{year}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line text-sm pointer-events-none ${selectArrowColor}`} />
                </div>
                {activeYear !== 'Semua' && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-rose-400" />
                )}
              </div>

              {/* Reset button */}
              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-1.5 font-body text-xs transition-colors cursor-pointer whitespace-nowrap ml-auto ${resetBtnColor}`}
                >
                  <i className="ri-close-circle-line text-sm" />
                  Reset
                </button>
              )}
            </div>

            {/* Projects Grid - first 9 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={setSelected} />
              ))}
            </div>

            {/* Carousel for remaining projects */}
            {carouselProjects.length > 0 && (
              <div className={`mt-10 pt-8 border-t ${carouselDivider}`}>
                {/* Carousel header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className={`font-syne font-bold text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Proyek Lainnya
                    </span>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((i) => {
                        const activeIdx = totalSlides <= 0 ? 0 : carouselIndex <= 0 ? 0 : carouselIndex >= totalSlides ? 2 : 1;
                        return (
                          <button
                            key={i}
                            onClick={() => goTo(i === 0 ? 0 : i === 2 ? totalSlides : Math.floor(totalSlides / 2))}
                            className={`rounded-full transition-all duration-200 cursor-pointer ${
                              i === activeIdx
                                ? (isDark ? 'bg-sky-400 w-2.5 h-2.5' : 'bg-blue-600 w-2.5 h-2.5')
                                : (isDark ? 'bg-slate-700 hover:bg-slate-500 w-2 h-2' : 'bg-slate-300 hover:bg-slate-400 w-2 h-2')
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      disabled={carouselIndex === 0}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${carouselIndex === 0 ? carouselBtnDisabled : carouselBtnActive}`}
                    >
                      <i className="ri-arrow-left-s-line text-base" />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={carouselIndex >= totalSlides}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${carouselIndex >= totalSlides ? carouselBtnDisabled : carouselBtnActive}`}
                    >
                      <i className="ri-arrow-right-s-line text-base" />
                    </button>
                  </div>
                </div>

                {/* Carousel track */}
                <div
                  ref={carouselRef}
                  className="overflow-hidden"
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  <div
                    className="flex"
                    style={{
                      gap: '24px',
                      transform: `translateX(${translateX}px)`,
                      transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {carouselProjects.map((project) => (
                      <div
                        key={project.id}
                        style={{
                          minWidth: CARDS_PER_SLIDE === 1
                            ? '100%'
                            : CARDS_PER_SLIDE === 2
                            ? 'calc((100% - 24px) / 2)'
                            : 'calc((100% - 48px) / 3)',
                          maxWidth: CARDS_PER_SLIDE === 1
                            ? '100%'
                            : CARDS_PER_SLIDE === 2
                            ? 'calc((100% - 24px) / 2)'
                            : 'calc((100% - 48px) / 3)',
                        }}
                      >
                        <ProjectCard project={project} onSelect={setSelected} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Legacy Projects Table */}
            <div className={`mt-14 pt-10 border-t ${carouselDivider}`}>
              <div className="mb-6">
                <span className={`font-syne font-bold text-lg block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Daftar Proyek
                </span>
              </div>
              {legacyLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <LegacyTable projects={legacyProjects} />
              )}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <i className={`ri-folder-open-line text-5xl mb-4 block ${emptyIconColor}`} />
                <p className={`font-body text-base ${emptyTextColor}`}>Tidak ada proyek yang sesuai filter.</p>
                <button onClick={resetFilters} className={`mt-4 font-body text-sm cursor-pointer hover:underline ${emptyLinkColor}`}>
                  Reset filter
                </button>
              </div>
            )}

            {/* CTA */}
            <div className={`text-center mt-16 pt-12 border-t ${ctaBorderColor}`}>
              <p className={`font-body text-base mb-6 max-w-xl mx-auto ${ctaTextColor}`}>
                {theme.portfolio_cta_text || t('portfolio.konsultasiCta')}
              </p>
              <a
                href="/kontak"
                className="btn-neon-solid px-8 py-4 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
              >
                <i className="ri-mail-send-line" />
                {t('portfolio.konsultasiBtn')}
              </a>
            </div>
          </div>
        </section>
      </div>
      </main>

      <footer
        data-preview-id="footer"
        data-editable-fields="footer_logo_url,footer_tagline,footer_copyright"
      >
        <Footer />
      </footer>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}