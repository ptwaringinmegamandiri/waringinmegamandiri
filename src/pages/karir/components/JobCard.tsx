import { useTranslation } from 'react-i18next';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onExpand: (job: Job) => void;
  isExpanded: boolean;
}

export default function JobCard({ job, onApply, onExpand, isExpanded }: JobCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`card-surface rounded-2xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-sky-400/40' : ''
      }`}
    >
      {/* Card Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => onExpand(job)}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-body font-medium px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-syne font-bold text-white text-lg leading-tight mb-1">
              {job.title}
            </h3>
            <p className="text-slate-400 text-sm font-body">{job.department}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-body font-semibold px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 whitespace-nowrap">
              {job.type}
            </span>
            <div className="w-8 h-8 flex items-center justify-center">
              <i
                className={`ri-arrow-down-s-line text-slate-400 text-xl transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 font-body">
          <span className="flex items-center gap-1.5">
            <i className="ri-map-pin-line text-sky-400/70" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-bar-chart-line text-sky-400/70" />
            {job.level}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-money-dollar-circle-line text-sky-400/70" />
            {job.salary}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-calendar-line text-sky-400/70" />
            {t('karir.deadline')}: {job.deadline}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-800 px-6 pb-6">
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <h4 className="font-syne font-semibold text-white text-sm mb-3">{t('karir.deskripsiPekerjaan')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-body">{job.description}</p>

              <h4 className="font-syne font-semibold text-white text-sm mt-5 mb-3">{t('karir.keuntungan')}</h4>
              <ul className="space-y-1.5">
                {job.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-400 font-body">
                    <i className="ri-check-line text-emerald-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="font-syne font-semibold text-white text-sm mb-3">{t('karir.kualifikasi')}</h4>
              <ul className="space-y-2">
                {job.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-slate-400 font-body">
                    <i className="ri-arrow-right-s-line text-sky-400 mt-0.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Apply CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onApply(job)}
              className="btn-neon-solid px-7 py-2.5 rounded-xl font-body font-semibold text-sm cursor-pointer whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <i className="ri-send-plane-line" /> {t('karir.lamarSekarang')}
              </span>
            </button>
            <a
              href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(job.title)}%20di%20PT%20Waringin%20Mega%20Mandiri.`}
              target="_blank"
              rel="nofollow noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:border-green-400/50 hover:text-green-400 transition-all text-sm font-body cursor-pointer whitespace-nowrap"
            >
              <i className="ri-whatsapp-line" /> {t('karir.tanyaWA')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
