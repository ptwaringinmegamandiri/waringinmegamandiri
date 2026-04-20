import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';
import { Project } from '@/mocks/projects';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');

  const images = project.images && project.images.length > 0 ? project.images : [project.image];
  const total = images.length;
  const isCompleted = project.status === 'Selesai';

  const goTo = useCallback(
    (idx: number, dir: 'left' | 'right') => {
      if (sliding || idx === activeIdx) return;
      setSlideDir(dir);
      setSliding(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setSliding(false);
      }, 350);
    },
    [sliding, activeIdx]
  );

  const goPrev = useCallback(() => {
    const prev = (activeIdx - 1 + total) % total;
    goTo(prev, 'left');
  }, [activeIdx, total, goTo]);

  const goNext = useCallback(() => {
    const next = (activeIdx + 1) % total;
    goTo(next, 'right');
  }, [activeIdx, total, goTo]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, goPrev, goNext]);

  const metaItems = [
    { icon: 'ri-map-pin-line', label: t('project.lokasi'), value: project.location },
    { icon: 'ri-calendar-line', label: t('project.tahunLabel'), value: String(project.year) },
    { icon: 'ri-building-line', label: t('project.tipeBangunan'), value: project.buildingType },
    { icon: 'ri-tools-line', label: t('project.paketPekerjaan'), value: project.workPackage },
    ...(project.floors ? [{ icon: 'ri-stack-line', label: t('project.lantai'), value: project.floors }] : []),
    ...(project.buildingArea ? [{ icon: 'ri-layout-line', label: t('project.luasBangunan'), value: project.buildingArea }] : []),
    ...(project.unitCount ? [{ icon: 'ri-home-line', label: t('project.jumlahUnit'), value: project.unitCount }] : []),
    { icon: 'ri-user-line', label: t('project.klien'), value: project.client },
    { icon: 'ri-money-dollar-circle-line', label: t('project.nilai'), value: project.value },
    { icon: 'ri-checkbox-circle-line', label: t('project.status'), value: isCompleted ? t('project.statusSelesai') : t('project.statusOngoing') },
  ];

  // Theme-aware styles
  const backdropBg = isDark ? 'bg-[#0A0E14]/92' : 'bg-[#0F172A]/80';
  const modalBg = isDark
    ? 'bg-gradient-to-br from-[#111827] to-[#0F1520] border border-sky-400/20'
    : 'bg-white border-2 border-blue-200';
  const topLine = isDark
    ? 'bg-gradient-to-r from-sky-400 to-sky-300'
    : 'bg-gradient-to-r from-blue-600 to-blue-400';
  const imgBg = isDark ? 'bg-[#060A10]' : 'bg-slate-100';
  const imgOverlay = isDark ? 'from-[#111827]/85' : 'from-[#1E3A5F]/60';
  const closeBtnStyle = isDark
    ? 'bg-[#0A0E14]/80 border border-sky-400/40 hover:border-sky-400 hover:text-sky-400 text-white'
    : 'bg-white/90 border border-blue-300 hover:border-blue-600 hover:text-blue-600 text-slate-700';
  const counterStyle = isDark
    ? 'bg-[#0A0E14]/80 border border-sky-400/30 text-white'
    : 'bg-white/90 border border-blue-300 text-slate-800';
  const arrowStyle = isDark
    ? 'bg-[#0A0E14]/75 border border-sky-400/40 hover:border-sky-400 hover:bg-sky-400/20 text-white'
    : 'bg-white/90 border border-blue-300 hover:border-blue-600 hover:bg-blue-50 text-slate-700';
  const catBadge = isDark
    ? 'bg-sky-400/20 border border-sky-400/50 text-sky-300'
    : 'bg-blue-600/90 border border-blue-500 text-white';
  const statusBadge = isCompleted
    ? (isDark ? 'bg-green-400/15 border border-green-400/40 text-green-400' : 'bg-emerald-500/90 border border-emerald-400 text-white')
    : (isDark ? 'bg-sky-400/15 border border-sky-400/40 text-sky-300' : 'bg-blue-600/90 border border-blue-500 text-white');
  const dotActive = isCompleted ? (isDark ? 'bg-green-400' : 'bg-white') : (isDark ? 'bg-sky-400 animate-pulse' : 'bg-white animate-pulse');
  const thumbBg = isDark ? 'bg-[#0A0E14]/60 border-b border-sky-400/10' : 'bg-slate-50 border-b border-blue-100';
  const thumbActive = isDark ? 'ring-2 ring-sky-400' : 'ring-2 ring-blue-500';
  const thumbInactive = isDark ? 'ring-1 ring-sky-400/20 opacity-50 hover:opacity-80' : 'ring-1 ring-blue-200 opacity-60 hover:opacity-90';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const metaGridBg = isDark ? 'bg-[#0A0E14]/50 border border-sky-400/10' : 'bg-blue-50 border border-blue-200';
  const metaLabelColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const metaValueColor = isDark ? 'text-white' : 'text-slate-800';
  const metaIconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const descColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const dotIndicatorInactive = isDark ? 'bg-slate-600 hover:bg-slate-400' : 'bg-blue-200 hover:bg-blue-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm ${backdropBg}`} />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className={`h-1 w-full rounded-t-xl ${topLine}`} />

        {/* IMAGE CAROUSEL */}
        <div className={`relative overflow-hidden ${imgBg}`} style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
          {images.map((src, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-all duration-350"
              style={{
                opacity: idx === activeIdx ? (sliding ? 0 : 1) : 0,
                transform: idx === activeIdx
                  ? sliding ? `translateX(${slideDir === 'right' ? '-30px' : '30px'})` : 'translateX(0)'
                  : 'translateX(0)',
                zIndex: idx === activeIdx ? 1 : 0,
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <img
                src={src}
                alt={`${project.name} – ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${imgOverlay} via-transparent to-transparent`} />
            </div>
          ))}

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${closeBtnStyle}`}
            aria-label={t('project.tutup')}
          >
            <i className="ri-close-line text-lg" />
          </button>

          {/* Image Counter */}
          {total > 1 && (
            <div className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 backdrop-blur-sm rounded-lg px-3 py-1 ${counterStyle}`}>
              <i className={`ri-image-line text-xs ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
              <span className="font-body text-xs font-semibold">
                {activeIdx + 1}
                <span className={`mx-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/</span>
                {total}
              </span>
            </div>
          )}

          {/* Prev Arrow */}
          {total > 1 && (
            <button
              onClick={goPrev}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${arrowStyle}`}
              aria-label={t('project.prevPhoto')}
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
          )}

          {/* Next Arrow */}
          {total > 1 && (
            <button
              onClick={goNext}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${arrowStyle}`}
              aria-label={t('project.nextPhoto')}
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          )}

          {/* Category + Status badges */}
          <div className="absolute bottom-4 left-5 z-20 flex items-center gap-3">
            <span className={`font-body text-xs tracking-wide px-3 py-1 rounded-lg backdrop-blur-sm font-semibold ${catBadge}`}>
              {project.buildingType}
            </span>
            <span className={`font-body text-xs px-3 py-1 rounded-lg backdrop-blur-sm font-semibold ${statusBadge}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotActive}`} />
              {isCompleted ? t('project.statusSelesai') : t('project.statusOngoing')}
            </span>
          </div>

          {/* Dot Indicators */}
          {total > 1 && (
            <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx, idx > activeIdx ? 'right' : 'left')}
                  aria-label={`${idx + 1}`}
                  className={`cursor-pointer rounded-full transition-all duration-300 ${
                    idx === activeIdx ? `w-5 h-1.5 ${isDark ? 'bg-sky-400' : 'bg-white'}` : `w-1.5 h-1.5 ${dotIndicatorInactive}`
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {total > 1 && (
          <div className={`flex gap-2 px-5 py-3 overflow-x-auto ${thumbBg}`}>
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > activeIdx ? 'right' : 'left')}
                aria-label={`${idx + 1}`}
                className={`shrink-0 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  idx === activeIdx ? thumbActive : thumbInactive
                }`}
                style={{ width: '72px', height: '48px' }}
              >
                <img src={src} alt={`${idx + 1}`} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        )}

        {/* CONTENT */}
        <div className="p-6 md:p-8">
          <h2 className={`font-syne font-black text-xl md:text-2xl mb-4 leading-snug ${titleColor}`}>
            {project.name}
          </h2>

          {/* Meta Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 rounded-xl ${metaGridBg}`}>
            {metaItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`${item.icon} text-xs ${metaIconColor}`} />
                  <span className={`font-body text-xs tracking-wide ${metaLabelColor}`}>{item.label}</span>
                </div>
                <span className={`font-syne font-semibold text-sm ${metaValueColor}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className={`font-body text-sm leading-relaxed mb-6 ${descColor}`}>
            {project.description}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:info@waringinmegamandiri.co.id"
              className="btn-neon-solid px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap text-center inline-flex items-center justify-center gap-2"
            >
              <i className="ri-mail-send-line" />
              {t('project.diskusi')}
            </a>
            <button
              onClick={onClose}
              className="btn-neon px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap"
            >
              {t('project.tutup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
