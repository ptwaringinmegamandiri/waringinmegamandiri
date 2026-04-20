import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/context/ThemeContext';

const scopeIcons = [
  'ri-building-2-line',
  'ri-home-4-line',
  'ri-hospital-line',
  'ri-layout-masonry-line',
];

export default function ServicesSection() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const sectionRef = useRef<HTMLDivElement>(null);

  const scopes = [
    { title: t('service.gc.scope1.title'), desc: t('service.gc.scope1.desc'), icon: scopeIcons[0] },
    { title: t('service.gc.scope2.title'), desc: t('service.gc.scope2.desc'), icon: scopeIcons[1] },
    { title: t('service.gc.scope3.title'), desc: t('service.gc.scope3.desc'), icon: scopeIcons[2] },
    { title: t('service.gc.scope4.title'), desc: t('service.gc.scope4.desc'), icon: scopeIcons[3] },
  ];

  const whyUs = [
    t('service.gc.why1'), t('service.gc.why2'), t('service.gc.why3'),
    t('service.gc.why4'), t('service.gc.why5'), t('service.gc.why6'),
  ];

  const stats = [
    { val: t('service.gc.stat1.val'), label: t('service.gc.stat1.label') },
    { val: t('service.gc.stat2.val'), label: t('service.gc.stat2.label') },
    { val: t('service.gc.stat3.val'), label: t('service.gc.stat3.label') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.reveal-item');
            els.forEach((el, idx) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, idx * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sectionBg = isDark ? 'bg-[#0D1117]' : 'bg-[#EEF4FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const accentColor = isDark ? '#38BDF8' : '#1D4ED8';
  const accentColorEnd = isDark ? '#7DD3FC' : '#3B82F6';
  const heroBg = isDark
    ? 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(238,244,255,0.95) 100%)';
  const heroBorder = isDark ? 'rgba(56,189,248,0.15)' : 'rgba(37,99,235,0.15)';
  const heroTopLine = isDark
    ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)';
  const heroDescColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const statsDivider = isDark ? 'border-slate-700/50' : 'border-blue-100';
  const statsLabelColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const scopeCardBg = isDark
    ? 'linear-gradient(135deg, #0D1628, #0B1424)'
    : '#FFFFFF';
  const scopeCardBorder = isDark ? 'rgba(59,130,246,0.14)' : 'rgba(37,99,235,0.25)';
  const scopeCardBorderHover = isDark ? 'rgba(59,130,246,0.35)' : 'rgba(37,99,235,0.55)';
  const scopeCardShadow = isDark ? 'none' : '0 2px 8px rgba(37,99,235,0.08)';
  const scopeCardShadowHover = isDark ? 'none' : '0 6px 20px rgba(37,99,235,0.14)';
  const scopeIconBg = isDark ? 'bg-sky-400/8 border-sky-400/15' : 'bg-blue-100 border-blue-300';
  const scopeIconColor = isDark ? 'text-sky-400' : 'text-blue-700';
  const scopeTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const scopeDescColor = isDark ? 'text-slate-500' : 'text-slate-600';
  const whyBg = isDark
    ? 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(15,23,42,0.8) 100%)'
    : '#FFFFFF';
  const whyBorder = isDark ? 'rgba(56,189,248,0.12)' : 'rgba(37,99,235,0.25)';
  const whyItemBorder = isDark ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.18)';
  const whyItemBg = isDark ? 'transparent' : '#F0F6FF';
  const whyItemText = isDark ? 'text-slate-300' : 'text-slate-800';
  const whyCheckBg = isDark ? 'bg-sky-400/15' : 'bg-blue-600';
  const whyCheckIcon = isDark ? 'text-sky-400' : 'text-white';
  const whySubText = isDark ? 'text-slate-500' : 'text-slate-600';
  const whyTitleColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <section ref={sectionRef} className={`py-24 relative overflow-hidden ${sectionBg}`} id="layanan">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${isDark ? 'rgba(56,189,248,0.05)' : 'rgba(37,99,235,0.04)'} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${isDark ? 'rgba(56,189,248,0.04)' : 'rgba(37,99,235,0.03)'} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 reveal-item" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <span className="section-label block mb-4">{t('services.label')}</span>
          <h2 className={`font-syne font-bold text-3xl md:text-4xl lg:text-5xl mb-4 ${titleColor}`}>
            {t('services.titleHighlight')}{' '}
            <span style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColorEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('services.titleSuffix')}
            </span>
          </h2>
          <div className="flex justify-center mb-5">
            <div className="neon-line-short" />
          </div>
          <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${subtitleColor}`}>
            {t('services.subtitle')}
          </p>
        </div>

        {/* Main Service Hero Card */}
        <div
          className="reveal-item relative rounded-2xl overflow-hidden mb-10"
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            background: heroBg,
            border: `1px solid ${heroBorder}`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: heroTopLine }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20construction%20workers%20in%20hard%20hats%20overseeing%20a%20large%20commercial%20building%20project%20in%20Jakarta%20Indonesia%2C%20modern%20high-rise%20building%20under%20construction%20with%20cranes%2C%20blue%20sky%20background%2C%20clean%20and%20sharp%20photography%20style%2C%20architectural%20construction%20site&width=700&height=500&seq=gc-hero-01&orientation=landscape"
                alt="General Contractor PT Waringin Mega Mandiri"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 hidden lg:block" style={{ background: isDark ? 'linear-gradient(to right, transparent, rgba(13,17,23,0.80))' : 'linear-gradient(to right, transparent, rgba(238,244,255,0.80))' }} />
              <div className="absolute inset-0 lg:hidden" style={{ background: isDark ? 'linear-gradient(to top, rgba(13,17,23,0.70), transparent)' : 'linear-gradient(to top, rgba(238,244,255,0.70), transparent)' }} />
              <div className="absolute bottom-6 left-6 right-6 flex gap-4 lg:hidden">
                {stats.map((s) => (
                  <div key={s.label} className="flex-1 text-center">
                    <div className="font-syne font-bold text-xl" style={{ color: accentColor }}>{s.val}</div>
                    <div className={`font-body text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-5 w-fit">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isDark ? 'bg-sky-400/10 border border-sky-400/20' : 'bg-blue-50 border border-blue-200'}`}>
                  <i className={`ri-hammer-line text-sm ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                </div>
                <span className={`font-body text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>
                  {t('service.gc.tagline')}
                </span>
              </div>

              <h3 className={`font-syne font-bold text-3xl lg:text-4xl mb-4 ${titleColor}`}>
                {t('service.gc.title')}
              </h3>

              <p className={`font-body text-sm leading-relaxed mb-8 ${heroDescColor}`}>
                {t('service.gc.description')}
              </p>

              <div className={`hidden lg:flex gap-6 mb-8 pb-8 border-b ${statsDivider}`}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-syne font-bold text-2xl" style={{ color: accentColor }}>{s.val}</div>
                    <div className={`font-body text-xs mt-0.5 ${statsLabelColor}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-body font-semibold text-sm text-white whitespace-nowrap cursor-pointer w-fit transition-all duration-300 hover:gap-3"
                style={{ background: `linear-gradient(90deg, ${isDark ? '#0EA5E9' : '#1D4ED8'}, ${isDark ? '#38BDF8' : '#3B82F6'})` }}
              >
                <i className="ri-phone-line" />
                {t('service.gc.cta')}
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="mb-10">
          <div className="reveal-item text-center mb-8" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <h4 className={`font-syne font-bold text-xl mb-2 ${titleColor}`}>{t('services.lingkupPekerjaan')}</h4>
            <p className={`font-body text-sm ${subtitleColor}`}>{t('services.lingkupSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scopes.map((scope, idx) => (
              <div
                key={scope.title}
                className="reveal-item relative overflow-hidden group cursor-default p-6 rounded-xl"
                style={{
                  opacity: 0,
                  transform: 'translateY(30px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  transitionDelay: `${idx * 0.08}s`,
                  background: scopeCardBg,
                  border: `1px solid ${scopeCardBorder}`,
                  boxShadow: scopeCardShadow,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = scopeCardBorderHover;
                  (e.currentTarget as HTMLElement).style.boxShadow = scopeCardShadowHover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = scopeCardBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = scopeCardShadow;
                }}
              >
                <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(56,189,248,0.25)' : 'rgba(37,99,235,0.30)'}, transparent)` }} />
                <div className={`w-12 h-12 flex items-center justify-center mb-4 rounded-xl border ${scopeIconBg}`}>
                  <i className={`${scope.icon} text-xl ${scopeIconColor}`} />
                </div>
                <h5 className={`font-syne font-bold text-sm mb-2 leading-snug ${scopeTitleColor}`}>{scope.title}</h5>
                <p className={`font-body text-xs leading-relaxed ${scopeDescColor}`}>{scope.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          className="reveal-item rounded-2xl p-8 lg:p-10"
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            background: whyBg,
            border: `1px solid ${whyBorder}`,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-64 shrink-0">
              <span className="section-label block mb-3">{t('services.keunggulan')}</span>
              <h4 className={`font-syne font-bold text-2xl leading-tight ${whyTitleColor}`}>
                {t('services.mengapaWMM')}{' '}
                <span style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColorEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  WMM?
                </span>
              </h4>
              <p className={`font-body text-sm mt-3 leading-relaxed ${whySubText}`}>
                {t('services.dukunganDesc')}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whyUs.map((item, idx) => (
                <div
                  key={item}
                  className="reveal-item flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-default"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${idx * 0.06}s`,
                    border: `1px solid ${whyItemBorder}`,
                    background: whyItemBg,
                  }}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full shrink-0 ${whyCheckBg}`}>
                    <i className={`ri-check-line text-xs ${whyCheckIcon}`} />
                  </div>
                  <span className={`font-body text-sm font-medium ${whyItemText}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
