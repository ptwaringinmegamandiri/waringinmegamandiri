import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

export default function CompanyProfile() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const keyPoints = [
    { icon: 'ri-map-pin-2-line', key: 'profile.kota' },
    { icon: 'ri-group-line', key: 'profile.tenaga' },
    { icon: 'ri-building-line', key: 'profile.proyek' },
    { icon: 'ri-global-line', key: 'profile.standar' },
  ];

  const sectionBg = isDark ? 'bg-[#060A10]' : 'bg-[#F0F6FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const bodyColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const keyPointColor = isDark ? 'text-slate-300' : 'text-slate-800';
  const accentColor = isDark ? '#60A5FA' : '#1D4ED8';
  const accentEnd = isDark ? '#BAD9FF' : '#3B82F6';
  const iconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const badgeBg = isDark
    ? 'bg-[#0D1628] border border-sky-400/20'
    : 'bg-white border border-blue-200 shadow-md';
  const badgeYearColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const badgeSubColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const imgOverlay = isDark ? 'from-[#060A10]/60' : 'from-[#F0F6FF]/50';
  const imgBorder = isDark ? '' : 'border-2 border-blue-200';
  const cornerBorder = isDark ? 'border-sky-400' : 'border-blue-500';

  return (
    <section className={`py-20 relative overflow-hidden ${sectionBg}`}>
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className={`relative rounded-xl overflow-hidden ${imgBorder}`} style={{ height: '420px' }}>
              <img
                src="https://readdy.ai/api/search-image?query=modern%20construction%20company%20headquarters%20building%20Jakarta%20Indonesia%2C%20sleek%20glass%20office%20exterior%2C%20corporate%20architecture%2C%20professional%20business%20environment%2C%20bright%20daylight%2C%20clean%20architectural%20photography%2C%20sharp%20details%2C%20blue%20sky%20background%2C%20impressive%20commercial%20building%20facade&width=800&height=600&seq=wmm-company-v2&orientation=landscape"
                alt="PT Waringin Mega Mandiri Kantor Pusat"
                className="w-full h-full object-cover object-top"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${imgOverlay} to-transparent`} />
            </div>
            {/* Floating badge */}
            <div className={`absolute -bottom-6 -right-4 lg:-right-8 rounded-xl p-5 text-center ${badgeBg}`}>
              <span
                className="font-syne font-black text-4xl block"
                style={{ color: badgeYearColor }}
              >
                2022
              </span>
              <span className={`font-body text-xs tracking-widest uppercase ${badgeSubColor}`}>{t('profile.founded')}</span>
            </div>
            {/* Corner bracket */}
            <div className={`absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 ${cornerBorder}`} />
          </div>

          {/* Content */}
          <div>
            <span className="section-label block mb-4">{t('profile.label')}</span>
            <h2 className={`font-syne font-bold text-2xl md:text-3xl mb-2 ${titleColor}`}>
              {t('profile.title')}{' '}
              <span
                style={{
                  background: `linear-gradient(90deg, ${accentColor}, ${accentEnd})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('profile.highlight')}
              </span>
            </h2>
            <div className="neon-line-short mb-6" />
            <div className={`space-y-4 font-body text-base leading-relaxed ${bodyColor}`}>
              <p>{t('profile.p1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('profile.p2') }} />
              <p>{t('profile.p3')}</p>
            </div>

            {/* Key Points */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {keyPoints.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                    isDark
                      ? 'bg-transparent'
                      : 'bg-white border border-blue-200 shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-lg ${isDark ? '' : 'bg-blue-50'}`}>
                    <i className={`${item.icon} text-lg ${iconColor}`} />
                  </div>
                  <span className={`font-body text-sm font-medium ${keyPointColor}`}>{t(item.key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
