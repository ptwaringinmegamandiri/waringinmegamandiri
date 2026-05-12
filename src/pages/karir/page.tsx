import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import JobCard from '@/pages/karir/components/JobCard';
import ApplyModal from '@/pages/karir/components/ApplyModal';
import { careerStats } from '@/mocks/careers';
import { useCareers } from '@/hooks/useCareers';
import { useSiteTheme } from '@/context/SiteThemeContext';
import type { Career } from '@/hooks/useCareers';

const DEFAULT_KARIR_BG = 'https://readdy.ai/api/search-image?query=dark%20cinematic%20construction%20workers%20team%20meeting%20on%20site%2C%20group%20of%20engineers%20and%20workers%20in%20hard%20hats%20and%20safety%20vests%20reviewing%20plans%20together%2C%20industrial%20building%20site%20at%20dusk%20with%20dramatic%20orange%20floodlights%2C%20steel%20structure%20scaffolding%20background%2C%20moody%20atmospheric%20photography%2C%20deep%20shadows%2C%20warm%20amber%20tones%2C%20professional%20workforce%2C%20no%20blue%20tones&width=1920&height=900&seq=wmm-karir-dark-v1&orientation=landscape';

type StatusFilter = 'all' | string;

export default function KarirPage() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();
  const { careers, loading } = useCareers();
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');

  const bgImage = theme.karir_bg_url || DEFAULT_KARIR_BG;

  const departments = [
    { key: 'all', label: t('karir.semua') },
    { key: 'Manajemen Proyek', label: t('karir.dept.manajemen') },
    { key: 'Teknologi & Inovasi', label: t('karir.dept.teknologi') },
    { key: 'Engineering', label: t('karir.dept.engineering') },
    { key: 'Estimasi & Biaya', label: t('karir.dept.estimasi') },
    { key: 'Health, Safety & Environment', label: t('karir.dept.hse') },
    { key: 'Desain & Drafting', label: t('karir.dept.desain') },
  ];

  const filtered = activeFilter === 'all'
    ? careers
    : careers.filter((j) => j.department === activeFilter);

  const handleExpand = (job: Career) => {
    setExpandedJob(expandedJob === job.id ? null : job.id);
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)]">
      <div data-preview-id="navbar" data-preview-label="Navbar" data-editable-fields="navbar_brand_text,navbar_cta_text">
        <Navbar />
      </div>

      {/* Hero */}
      <div data-preview-id="karir-hero" data-preview-label="Karir Hero" data-editable-fields="karir_title,karir_subtitle">
        <section className="relative min-h-[580px] flex items-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={bgImage}
              alt="Karir PT Waringin Mega Mandiri"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070C17]/90 via-[#070C17]/65 to-[#070C17]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070C17]/80 via-transparent to-[#070C17]/30" />
          </div>

          <div className="absolute inset-0 grid-pattern-sm opacity-20 pointer-events-none" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-10 text-center pt-36 pb-20">
            <div
              className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6"
              style={{
                borderColor: 'rgba(56,189,248,0.20)',
                backgroundColor: 'rgba(56,189,248,0.05)',
              }}
            >
              <i className="ri-briefcase-line text-sm text-sky-400" />
              <span className="text-xs font-body font-medium tracking-widest uppercase text-sky-400">
                {t('karir.badge')}
              </span>
            </div>

            <h1 className="font-syne font-bold text-4xl md:text-5xl leading-tight mb-5 text-white">
              {theme.karir_title || t('karir.title1')}<br />
              <span className="text-sky-400">{t('karir.title2')}</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed font-body max-w-2xl mx-auto mb-10 text-slate-400">
              {theme.karir_subtitle || t('karir.subtitle')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {careerStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-4 text-center backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(13,22,40,0.75)',
                    border: '1px solid rgba(56,189,248,0.14)',
                  }}
                >
                  <p className="font-syne font-bold text-2xl leading-none text-sky-400">
                    {stat.value}
                  </p>
                  <p className="text-xs font-body mt-1 text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Job Listings */}
      <div data-preview-id="karir-jobs" data-preview-label="Job Listings">
        <section className="py-16 border-t" style={{ borderColor: 'rgba(30,41,59,0.60)' }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="font-syne font-bold text-2xl md:text-3xl mb-3 text-white">
                {t('karir.lowongan')}
              </h2>
              <p className="font-body text-sm text-slate-500">
                {filtered.length} {t('karir.posisiTerbuka')}
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {departments.map((dept) => (
                <button
                  key={dept.key}
                  onClick={() => setActiveFilter(dept.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    activeFilter === dept.key
                      ? 'bg-sky-400/15 border-sky-400/50 text-sky-300'
                      : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden animate-pulse p-6"
                    style={{
                      backgroundColor: 'rgba(13,22,40,0.75)',
                      border: '1px solid rgba(56,189,248,0.10)',
                    }}
                  >
                    <div className="flex gap-3 mb-4">
                      <div className="h-5 w-16 rounded-full bg-slate-700" />
                      <div className="h-5 w-20 rounded-full bg-slate-700" />
                    </div>
                    <div className="h-6 w-2/3 rounded mb-2 bg-slate-700" />
                    <div className="h-4 w-1/3 rounded bg-slate-700/60" />
                    <div className="flex gap-6 mt-4">
                      {[...Array(4)].map((__, j) => (
                        <div key={j} className="h-3 w-24 rounded bg-slate-700/60" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={setSelectedJob}
                    onExpand={handleExpand}
                    isExpanded={expandedJob === job.id}
                  />
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <i className="ri-briefcase-line text-4xl mb-3 block text-slate-700" />
                <p className="font-body text-slate-500">{t('karir.tidakAda')}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Spontaneous Apply CTA */}
      <div data-preview-id="karir-cta" data-preview-label="Apply CTA" data-editable-fields="karir_cta_title,karir_cta_desc">
        <section className="py-20 border-t" style={{ borderColor: 'rgba(30,41,59,0.60)' }}>
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
            <div
              className="rounded-3xl p-10"
              style={{
                background: 'linear-gradient(135deg, #0D1628, #0B1424)',
                border: '1px solid rgba(59,130,246,0.10)',
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-5"
                style={{
                  backgroundColor: 'rgba(56,189,248,0.10)',
                  border: '1px solid rgba(56,189,248,0.20)',
                }}
              >
                <i className="ri-user-add-line text-2xl text-sky-400" />
              </div>
              <h3 className="font-syne font-bold text-2xl mb-3 text-white">
                {theme.karir_cta_title || t('karir.tidakCocok')}
              </h3>
              <p className="font-body text-sm leading-relaxed max-w-md mx-auto mb-7 text-slate-400">
                {theme.karir_cta_desc || t('karir.kirimSpontan')}
              </p>
              <a
                href="mailto:info@waringinmegamandiri.com"
                className="inline-flex items-center gap-2 btn-neon-solid px-7 py-3 rounded-xl font-body font-semibold text-sm cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-send-line" /> {t('karir.kirimBtn')}
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer
        data-preview-id="footer"
        data-editable-fields="footer_logo_url,footer_tagline,footer_copyright"
      >
        <Footer />
      </footer>

      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}