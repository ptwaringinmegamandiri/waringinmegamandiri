import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';
import { Project } from '@/mocks/projects';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const isCompleted = project.status === 'Selesai';

  const cardBg = isDark
    ? 'bg-gradient-to-b from-[#0D1628] to-[#0B1424] hover:border hover:border-sky-400/25'
    : 'bg-white border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-lg';

  const titleColor = isDark ? 'text-white group-hover:text-sky-300' : 'text-slate-900 group-hover:text-blue-700';
  const metaColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const iconColor = isDark ? 'text-sky-400' : 'text-blue-500';
  const valueColor = isDark ? 'text-sky-400' : 'text-blue-700';
  const clientColor = isDark ? 'text-slate-600' : 'text-slate-400';
  const dividerColor = isDark ? 'border-sky-400/10' : 'border-blue-100';
  const yearBg = isDark
    ? 'bg-rose-400/10 border border-rose-400/30 text-rose-400'
    : 'bg-blue-50 border border-blue-200 text-blue-700';
  const workPkgColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const overlayBg = isDark ? 'bg-[#0A0E14]/50' : 'bg-[#1E3A5F]/40';
  const typeBadgeBg = isDark
    ? 'bg-[#0A0E14]/85 border border-sky-400/50 text-sky-300'
    : 'bg-white/90 border border-blue-400/60 text-blue-700';
  const statusOngoingBg = isDark
    ? 'bg-sky-400/15 border border-sky-400/40 text-sky-300'
    : 'bg-blue-600/90 border border-blue-500 text-white';
  const statusDoneBg = isDark
    ? 'bg-green-400/15 border border-green-400/40 text-green-400'
    : 'bg-emerald-500/90 border border-emerald-400 text-white';
  const cornerBorder = isDark ? 'border-sky-400' : 'border-blue-500';

  return (
    <div
      className={`project-card rounded-xl overflow-hidden cursor-pointer group relative transition-all duration-300 flex flex-col ${cardBg}`}
      onClick={() => onSelect(project)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={project.image}
          alt={project.name}
          className="project-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ objectPosition: project.imagePosition || 'center' }}
        />
        {/* Hover overlay */}
        <div className={`project-overlay absolute inset-0 ${overlayBg} opacity-0 transition-opacity duration-400 flex items-center justify-center`}>
          <div className={`px-5 py-2 rounded-lg text-sm font-body font-semibold ${isDark ? 'bg-sky-400/20 border border-sky-400/60 text-sky-300' : 'bg-white/90 border border-blue-400 text-blue-700'}`}>
            <i className="ri-eye-line mr-2" />
            {t('project.lihatDetail')}
          </div>
        </div>

        {/* Building Type Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`font-body text-xs tracking-wide px-2.5 py-1 rounded-lg backdrop-blur-sm font-semibold ${typeBadgeBg}`}>
            {project.buildingType}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`font-body text-xs tracking-wide px-2.5 py-1 rounded-lg backdrop-blur-sm font-semibold ${isCompleted ? statusDoneBg : statusOngoingBg}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isCompleted ? (isDark ? 'bg-green-400' : 'bg-white') : (isDark ? 'bg-sky-400 animate-pulse' : 'bg-white animate-pulse')}`} />
            {isCompleted ? t('project.statusSelesai') : t('project.statusOngoing')}
          </span>
        </div>

        {/* Corner brackets on hover */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 ${cornerBorder} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className={`absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 ${cornerBorder} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Year badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`font-body text-xs font-bold px-2 py-0.5 rounded ${yearBg}`}>{project.year}</span>
        </div>

        <h3 className={`font-syne font-bold text-sm mb-1.5 leading-snug transition-colors duration-300 line-clamp-2 ${titleColor}`}>
          {project.name}
        </h3>

        {/* Work Package */}
        <p className={`font-body text-xs mb-2 line-clamp-1 ${workPkgColor}`}>
          <i className={`ri-tools-line mr-1 ${iconColor}`} />{project.workPackage}
        </p>

        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs font-body ${metaColor}`}>
          <span className="flex items-center gap-1">
            <i className={`ri-map-pin-line ${iconColor}`} />{project.location}
          </span>
          {project.floors && (
            <span className="flex items-center gap-1">
              <i className={`ri-building-line ${iconColor}`} />{project.floors}
            </span>
          )}
          {project.buildingArea && (
            <span className="flex items-center gap-1">
              <i className={`ri-layout-line ${iconColor}`} />{project.buildingArea}
            </span>
          )}
          {project.unitCount && (
            <span className="flex items-center gap-1">
              <i className={`ri-home-line ${iconColor}`} />{project.unitCount}
            </span>
          )}
        </div>

        {/* Bottom bar */}
        <div className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${dividerColor}`}>
          <span className={`font-syne font-bold text-xs truncate ${valueColor}`}>{project.value}</span>
          <span className={`font-body text-xs truncate text-right ${clientColor}`}>{project.client}</span>
        </div>
      </div>
    </div>
  );
}
