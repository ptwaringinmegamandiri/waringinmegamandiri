import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';
import { featuredProjects as mockFeatured } from '@/mocks/projects';

export default function FeaturedProjects() {
  const { projects: allProjects, fromSupabase } = useProjects();
  const { theme } = useSiteTheme();
  const { isDark } = useThemeContext();
  const projectsTitle = theme.projects_title || 'Proyek Ongoing';
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    <section className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#0B0E18]' : 'bg-[#EEF4FF]'}`}
      data-preview-id="projects-slider"
      data-preview-label="Proyek Ongoing"
      data-editable-fields="projects_title"
      data-edit-field="projects"
    >
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-body font-semibold mb-3">PROYEK BERJALAN</p>
            <h2 className={`font-syne font-bold text-3xl md:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-amber-400">{projectsTitle}</span>
            </h2>
          </div>
          <Link
            to="/portofolio"
            className={`border font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap self-start lg:self-auto inline-flex items-center gap-2 transition-colors ${isDark ? 'border-white/20 hover:border-white/50 text-white bg-white/5 hover:bg-white/10' : 'border-slate-300 hover:border-slate-400 text-slate-800 bg-white/60 hover:bg-white'}`}
          >
            Lihat Semua Proyek <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Slider */}
        <div className={`relative rounded-2xl overflow-hidden border ${isDark ? 'border-slate-700/50' : 'border-blue-200'}`}>
          {/* Mobile */}
          <div className="block lg:hidden">
            <div className={`relative w-full transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'} aspect-[4/3]`}>
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 z-10">
                <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${isDark ? 'bg-sky-400/15 text-sky-400 border-sky-400/30' : 'bg-blue-50 text-blue-600 border-blue-300'}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-blue-500'}`} />
                  {project.buildingType}
                </span>
              </div>
            </div>
            <div className={`p-6 transition-all duration-500 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} ${isDark ? 'bg-[#0D1117]' : 'bg-white'}`}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-body ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>
                  <i className={`ri-map-pin-line text-xs`} />
                  {project.location}
                </span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'}`}>·</span>
                <span className={`text-xs font-body ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{project.year}</span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'}`}>·</span>
                <span className={`text-xs font-body font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{project.value}</span>
                <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'}`}>·</span>
                <span className={`text-xs font-body inline-flex items-center gap-1 ${project.status === 'Selesai' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-sky-400' : 'text-blue-600')}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Selesai' ? (isDark ? 'bg-emerald-400' : 'bg-emerald-500') : (isDark ? 'bg-sky-400' : 'bg-blue-500')}`} />
                  {project.status === 'Selesai' ? 'Selesai' : project.status}
                </span>
              </div>
              <h3 className={`font-syne font-bold text-xl mb-2 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</h3>
              <p className={`font-body text-xs leading-relaxed mb-4 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{project.description}</p>
              <div className="flex items-center justify-between">
                <Link to="/portofolio" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors">
                  Detail Proyek <i className="ri-arrow-right-line" />
                </Link>
                <div className="flex items-center gap-2">
                  <button onClick={goPrev} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${isDark ? 'border-slate-700/50 bg-[#0D1117]/70 text-white hover:border-sky-400/30' : 'border-blue-200 bg-white text-slate-700 hover:border-blue-400'}`} aria-label="Previous">
                    <i className="ri-arrow-left-line text-xs" />
                  </button>
                  <button onClick={goNext} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${isDark ? 'border-slate-700/50 bg-[#0D1117]/70 text-white hover:border-sky-400/30' : 'border-blue-200 bg-white text-slate-700 hover:border-blue-400'}`} aria-label="Next">
                    <i className="ri-arrow-right-line text-xs" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4">
                {featuredProjects.map((_, idx) => (
                  <button key={idx} onClick={() => goTo(idx)} className="cursor-pointer transition-all duration-300 rounded-full" style={{ width: idx === active ? '20px' : '5px', height: '5px', backgroundColor: idx === active ? (isDark ? '#38BDF8' : '#2563EB') : (isDark ? '#334155' : '#CBD5E1') }} aria-label={`Go to project ${idx + 1}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block" style={{ minHeight: '480px' }}>
            <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              <img src={project.image} alt={project.name} className="w-full h-full object-cover object-top" />
              <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-[#0D1117]/95 via-[#0D1117]/60 to-transparent' : 'from-slate-900/90 via-slate-900/60 to-transparent'} pointer-events-none`} />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0D1117]/80 via-transparent to-transparent' : 'from-slate-900/80 via-transparent to-transparent'} pointer-events-none`} />
            </div>

            <div className={`relative z-10 flex flex-col justify-end h-full p-12 transition-all duration-500 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`} style={{ minHeight: '480px' }}>
              <div className="max-w-xl">
                <span className={`inline-block text-xs font-body font-semibold px-3 py-1.5 border rounded-full mb-4 ${isDark ? 'text-sky-400 border-sky-400/30 bg-sky-400/8' : 'text-blue-600 border-blue-300 bg-blue-50'}`}>
                  {project.buildingType}
                </span>
                <h3 className={`font-syne font-bold text-2xl md:text-3xl mb-3 leading-tight ${isDark ? 'text-white' : 'text-white'}`}>{project.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-body">
                  <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-200'}`}><i className={`ri-map-pin-line ${isDark ? 'text-sky-400' : 'text-blue-400'}`} />{project.location}</span>
                  <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-200'}`}><i className={`ri-calendar-line ${isDark ? 'text-sky-400' : 'text-blue-400'}`} />{project.year}</span>
                  <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-200'}`}><i className={`ri-money-dollar-circle-line ${isDark ? 'text-amber-400' : 'text-amber-400'}`} />{project.value}</span>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                    {project.status === 'Selesai' ? 'Selesai' : project.status}
                  </span>
                </div>
                <p className={`font-body text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-300'}`}>{project.description}</p>
                <Link to="/portofolio" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors">
                  Detail Proyek <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>

            <button onClick={goPrev} className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${isDark ? 'border-slate-700/50 bg-[#0D1117]/70 text-white hover:border-sky-400/30' : 'border-slate-500/50 bg-slate-900/70 text-white hover:border-blue-400'}`} aria-label="Previous project">
              <i className="ri-arrow-left-line text-sm" />
            </button>
            <button onClick={goNext} className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${isDark ? 'border-slate-700/50 bg-[#0D1117]/70 text-white hover:border-sky-400/30' : 'border-slate-500/50 bg-slate-900/70 text-white hover:border-blue-400'}`} aria-label="Next project">
              <i className="ri-arrow-right-line text-sm" />
            </button>

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