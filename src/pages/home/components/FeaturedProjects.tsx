import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { featuredProjects as mockFeatured } from '@/mocks/projects';
import { useThemeContext } from '@/context/ThemeContext';
import { useProjects } from '@/hooks/useProjects';

export default function FeaturedProjects() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { projects: allProjects, fromSupabase } = useProjects();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Selalu pakai proyek Ongoing — dari DB kalau ada, fallback ke mock
  const featuredProjects = (() => {
    if (fromSupabase && allProjects.length > 0) {
      const ongoing = allProjects.filter((p) => p.status === 'Ongoing');
      return ongoing.length > 0 ? ongoing : allProjects.slice(0, 6);
    }
    return mockFeatured;
  })();

  const goTo = (idx: number) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 400);
  };

  const goNext = () => goTo((active + 1) % featuredProjects.length);
  const goPrev = () => goTo((active - 1 + featuredProjects.length) % featuredProjects.length);

  useEffect(() => {
    setActive(0);
  }, [featuredProjects.length]);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, featuredProjects.length]);

  if (featuredProjects.length === 0) return null;
  const project = featuredProjects[Math.min(active, featuredProjects.length - 1)];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#0B0E18' : '#F0F6FF' }}
    >
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-label block mb-3">{t('featured.showcase')}</span>
            <h2
              className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl"
              style={{ color: isDark ? '#ffffff' : '#0F172A' }}
            >
              {t('featured.proyek')}{' '}
              <span
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, #38BDF8, #7DD3FC)'
                    : 'linear-gradient(90deg, #1D4ED8, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('featured.unggulan')}
              </span>
            </h2>
          </div>
          <Link
            to="/portofolio"
            className="btn-neon px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap self-start lg:self-auto"
          >
            {t('featured.lihatSemua')} <i className="ri-arrow-right-line ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <div className="relative rounded-2xl overflow-hidden glow-border">

          {/* ── MOBILE layout: foto atas, konten bawah ── */}
          <div className="block lg:hidden">
            {/* Foto */}
            <div
              className={`relative w-full transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'} aspect-[4/3]`}
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: project.imagePosition || 'center' }}
              />
              {/* Status badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={
                    project.status === 'Selesai'
                      ? { backgroundColor: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.30)' }
                      : { backgroundColor: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(37,99,235,0.10)', color: isDark ? '#7DD3FC' : '#1D4ED8', border: isDark ? '1px solid rgba(56,189,248,0.30)' : '1px solid rgba(37,99,235,0.25)' }
                  }
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: project.status === 'Selesai' ? '#34D399' : isDark ? '#38BDF8' : '#2563EB' }} />
                  {project.status === 'Selesai' ? t('featured.selesai') : project.status}
                </span>
              </div>
            </div>

            {/* Konten */}
            <div
              className={`p-6 transition-all duration-500 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              style={{ backgroundColor: isDark ? '#0D1117' : '#F0F6FF' }}
            >
              <span
                className="inline-block font-body font-semibold text-xs tracking-wide px-3 py-1 border rounded-full mb-3"
                style={{
                  borderColor: isDark ? 'rgba(56,189,248,0.40)' : 'rgba(37,99,235,0.35)',
                  color: isDark ? '#7DD3FC' : '#1D4ED8',
                  backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.07)',
                }}
              >
                {project.buildingType}
              </span>
              <h3
                className="font-syne font-bold text-xl mb-2 leading-tight"
                style={{ color: isDark ? '#ffffff' : '#0F172A' }}
              >
                {project.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-body" style={{ color: isDark ? '#94A3B8' : '#4B5563' }}>
                <span className="flex items-center gap-1"><i className="ri-map-pin-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.location}</span>
                <span className="flex items-center gap-1"><i className="ri-calendar-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.year}</span>
                <span className="flex items-center gap-1"><i className="ri-money-dollar-circle-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.value}</span>
              </div>
              <p className="font-body text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: isDark ? '#94A3B8' : '#4B5563' }}>
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <Link to="/portofolio" className="btn-neon-solid px-4 py-2 rounded-lg text-xs cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
                  {t('featured.detailProyek')} <i className="ri-arrow-right-line" />
                </Link>
                {/* Mobile nav arrows */}
                <div className="flex items-center gap-2">
                  <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all" style={{ border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(37,99,235,0.22)', backgroundColor: isDark ? 'rgba(13,17,23,0.70)' : 'rgba(240,246,255,0.90)' }} aria-label="Previous">
                    <i className="ri-arrow-left-line text-xs" style={{ color: isDark ? '#ffffff' : '#0F172A' }} />
                  </button>
                  <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all" style={{ border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(37,99,235,0.22)', backgroundColor: isDark ? 'rgba(13,17,23,0.70)' : 'rgba(240,246,255,0.90)' }} aria-label="Next">
                    <i className="ri-arrow-right-line text-xs" style={{ color: isDark ? '#ffffff' : '#0F172A' }} />
                  </button>
                </div>
              </div>
              {/* Dots */}
              <div className="flex items-center gap-1.5 mt-4">
                {featuredProjects.map((_, idx) => (
                  <button key={idx} onClick={() => goTo(idx)} className="cursor-pointer transition-all duration-300 rounded-full" style={{ width: idx === active ? '20px' : '5px', height: '5px', backgroundColor: idx === active ? (isDark ? '#38BDF8' : '#2563EB') : (isDark ? '#334155' : '#CBD5E1') }} aria-label={`Go to project ${idx + 1}`} />
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP layout: foto background, konten overlay ── */}
          <div className="hidden lg:block" style={{ minHeight: '480px' }}>
            {/* Background Image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top" />
              {isDark ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/95 via-[#0D1117]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F0F6FF]/95 via-[#F0F6FF]/65 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F0F6FF]/75 via-transparent to-transparent" />
                </>
              )}
            </div>

            {/* Content */}
            <div
              className={`relative z-10 flex flex-col justify-end h-full p-12 transition-all duration-500 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
              style={{ minHeight: '480px' }}
            >
              <div className="max-w-xl">
                <span
                  className="inline-block font-body font-semibold text-xs tracking-wide px-3 py-1.5 border rounded-full mb-4"
                  style={{
                    borderColor: isDark ? 'rgba(56,189,248,0.40)' : 'rgba(37,99,235,0.35)',
                    color: isDark ? '#7DD3FC' : '#1D4ED8',
                    backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.07)',
                  }}
                >
                  {project.buildingType}
                </span>
                <h3 className="font-syne font-bold text-2xl md:text-3xl mb-3 leading-tight" style={{ color: isDark ? '#ffffff' : '#0F172A' }}>
                  {project.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-body" style={{ color: isDark ? '#94A3B8' : '#4B5563' }}>
                  <span className="flex items-center gap-1.5"><i className="ri-map-pin-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.location}</span>
                  <span className="flex items-center gap-1.5"><i className="ri-calendar-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.year}</span>
                  <span className="flex items-center gap-1.5"><i className="ri-money-dollar-circle-line" style={{ color: isDark ? '#38BDF8' : '#2563EB' }} />{project.value}</span>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={
                      project.status === 'Selesai'
                        ? { backgroundColor: 'rgba(52,211,153,0.10)', color: isDark ? '#34D399' : '#059669', border: '1px solid rgba(52,211,153,0.25)' }
                        : { backgroundColor: isDark ? 'rgba(56,189,248,0.10)' : 'rgba(37,99,235,0.08)', color: isDark ? '#7DD3FC' : '#1D4ED8', border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(37,99,235,0.22)' }
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.status === 'Selesai' ? '#34D399' : isDark ? '#38BDF8' : '#2563EB' }} />
                    {project.status === 'Selesai' ? t('featured.selesai') : project.status}
                  </span>
                </div>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: isDark ? '#94A3B8' : '#4B5563' }}>
                  {project.description}
                </p>
                <Link to="/portofolio" className="btn-neon-solid px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2">
                  {t('featured.detailProyek')} <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>

            {/* Desktop Nav Arrows */}
            <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer" style={{ border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(37,99,235,0.22)', backgroundColor: isDark ? 'rgba(13,17,23,0.70)' : 'rgba(240,246,255,0.80)' }} aria-label="Previous project">
              <i className="ri-arrow-left-line text-sm" style={{ color: isDark ? '#ffffff' : '#0F172A' }} />
            </button>
            <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer" style={{ border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(37,99,235,0.22)', backgroundColor: isDark ? 'rgba(13,17,23,0.70)' : 'rgba(240,246,255,0.80)' }} aria-label="Next project">
              <i className="ri-arrow-right-line text-sm" style={{ color: isDark ? '#ffffff' : '#0F172A' }} />
            </button>

            {/* Desktop Dots */}
            <div className="absolute bottom-5 right-8 z-20 flex items-center gap-2">
              {featuredProjects.map((_, idx) => (
                <button key={idx} onClick={() => goTo(idx)} className="cursor-pointer transition-all duration-300 rounded-full" style={{ width: idx === active ? '24px' : '6px', height: '6px', backgroundColor: idx === active ? (isDark ? '#38BDF8' : '#2563EB') : (isDark ? '#334155' : '#CBD5E1') }} aria-label={`Go to project ${idx + 1}`} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
