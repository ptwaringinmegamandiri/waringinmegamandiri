import { useEffect, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const clients = [
  {
    name: 'APL Group',
    fullName: 'APL Group (PT Astakona Megatama)',
    desc: 'Pengembang properti komersial & residensial skala nasional',
    icon: 'ri-building-4-line',
    projects: 3,
    category: 'Properti',
  },
  {
    name: 'Astra Land',
    fullName: 'Astra Land Indonesia',
    desc: 'Anak perusahaan Astra International di bidang properti premium',
    icon: 'ri-community-line',
    projects: 5,
    category: 'Properti',
  },
  {
    name: 'ASG Group',
    fullName: 'ASG Group',
    desc: 'Pengembang kawasan perumahan dan komersial terpadu',
    icon: 'ri-home-8-line',
    projects: 4,
    category: 'Properti',
  },
  {
    name: 'Yayasan Charitas',
    fullName: 'Yayasan Rumah Sakit Charitas',
    desc: 'Institusi kesehatan terkemuka di Sumatera Selatan',
    icon: 'ri-hospital-line',
    projects: 2,
    category: 'Kesehatan',
  },
  {
    name: 'PT Sabang Raya',
    fullName: 'PT Sabang Raya Investama',
    desc: 'Perusahaan investasi & hospitality di kawasan Batam',
    icon: 'ri-hotel-line',
    projects: 1,
    category: 'Hospitality',
  },
  {
    name: 'Hilton Garden Inn',
    fullName: 'Hilton Garden Inn Batam',
    desc: 'Brand hotel internasional kelas dunia di Indonesia',
    icon: 'ri-building-2-line',
    projects: 1,
    category: 'Hospitality',
  },
];

const categoryColors: Record<string, { dark: string; light: string }> = {
  Properti: { dark: 'text-sky-400 bg-sky-400/10 border-sky-400/20', light: 'text-blue-700 bg-blue-100 border-blue-300' },
  Kesehatan: { dark: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', light: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
  Hospitality: { dark: 'text-amber-400 bg-amber-400/10 border-amber-400/20', light: 'text-amber-700 bg-amber-100 border-amber-300' },
};

export default function ClientsSection() {
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.reveal-client');
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

  const sectionBg = isDark ? 'bg-[#070C17]' : 'bg-[#EEF4FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-600';

  // Card styles — dark untouched, light dipertegas
  const cardBg = isDark
    ? 'linear-gradient(135deg, #0D1628, #0B1424)'
    : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(59,130,246,0.14)' : 'rgba(37,99,235,0.25)';
  const cardBorderHover = isDark ? 'rgba(59,130,246,0.35)' : 'rgba(37,99,235,0.55)';
  const cardShadow = isDark ? 'none' : '0 2px 8px rgba(37,99,235,0.08)';
  const cardShadowHover = isDark ? 'none' : '0 6px 20px rgba(37,99,235,0.14)';
  const cardTopLine = isDark
    ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.25), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.30), transparent)';

  const clientNameColor = isDark ? 'text-white' : 'text-slate-900';
  const clientDescColor = isDark ? 'text-slate-500' : 'text-slate-600';
  const projectCountColor = isDark ? 'text-sky-400' : 'text-blue-700';
  const projectLabelColor = isDark ? 'text-slate-600' : 'text-slate-500';
  const dividerColor = isDark ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.15)';

  // Bottom bar
  const bottomBarBg = isDark
    ? 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(15,23,42,0.8) 100%)'
    : '#FFFFFF';
  const bottomBarBorder = isDark ? 'rgba(56,189,248,0.12)' : 'rgba(37,99,235,0.25)';
  const bottomBarShadow = isDark ? 'none' : '0 2px 8px rgba(37,99,235,0.08)';
  const bottomIconBg = isDark ? 'bg-sky-400/10 border border-sky-400/20' : 'bg-blue-100 border border-blue-300';
  const bottomIconColor = isDark ? 'text-sky-400' : 'text-blue-700';
  const bottomTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const bottomSubColor = isDark ? 'text-slate-500' : 'text-slate-600';
  const bottomStatColor = isDark ? 'text-sky-400' : 'text-blue-700';

  return (
    <section ref={sectionRef} className={`py-20 relative overflow-hidden ${sectionBg}`} id="klien-mitra">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${isDark ? 'rgba(56,189,248,0.04)' : 'rgba(37,99,235,0.05)'} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className="reveal-client text-center mb-14"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <span className="section-label block mb-4">{t('clients.label')}</span>
          <h2 className={`font-syne font-black text-3xl md:text-4xl lg:text-5xl mb-4 ${titleColor}`}>
            {t('clients.trusted')}{' '}
            <span style={{ background: isDark ? 'linear-gradient(90deg, #38BDF8, #7DD3FC)' : 'linear-gradient(90deg, #1D4ED8, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('clients.terkemuka')}
            </span>
          </h2>
          <div className="flex justify-center mb-5"><div className="neon-line-short" /></div>
          <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${subtitleColor}`}>{t('clients.desc')}</p>
        </div>

        {/* Client Cards — same layout as Lingkup Pekerjaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {clients.map((client, idx) => {
            const catStyle = categoryColors[client.category] || categoryColors['Properti'];
            const iconClass = isDark ? catStyle.dark : catStyle.light;

            return (
              <div
                key={client.name}
                className="reveal-client relative overflow-hidden group cursor-default p-6 rounded-xl"
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  transitionDelay: `${idx * 0.07}s`,
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: cardShadow,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardBorderHover;
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadowHover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-4 right-4 h-px" style={{ background: cardTopLine }} />

                {/* Icon */}
                <div className={`w-12 h-12 flex items-center justify-center mb-4 rounded-xl border ${iconClass}`}>
                  <i className={`${client.icon} text-xl`} />
                </div>

                {/* Name + category badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className={`font-syne font-bold text-sm leading-snug ${clientNameColor}`}>
                    {client.fullName}
                  </h5>
                  <span className={`shrink-0 text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${iconClass}`}>
                    {client.category}
                  </span>
                </div>

                <p className={`font-body text-xs leading-relaxed mb-4 ${clientDescColor}`}>{client.desc}</p>

                {/* Divider */}
                <div className="h-px mb-3" style={{ background: dividerColor }} />

                {/* Project count */}
                <div className="flex items-center gap-1.5">
                  <i className={`ri-building-line text-sm ${projectCountColor}`} />
                  <span className={`font-syne font-bold text-sm ${projectCountColor}`}>{client.projects}</span>
                  <span className={`font-body text-xs ${projectLabelColor}`}>{t('clients.proyekBersama')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div
          className="reveal-client rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            background: bottomBarBg,
            border: `1px solid ${bottomBarBorder}`,
            boxShadow: bottomBarShadow,
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bottomIconBg}`}>
              <i className={`ri-shield-check-line text-lg ${bottomIconColor}`} />
            </div>
            <div>
              <p className={`font-syne font-bold text-sm ${bottomTitleColor}`}>{t('clients.korporat')}</p>
              <p className={`font-body text-xs ${bottomSubColor}`}>{t('clients.sektorDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[
              { val: '200+', label: t('clients.proyekSelesai') },
              { val: '98%', label: t('clients.kepuasan') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`font-syne font-black text-lg ${bottomStatColor}`}>{s.val}</div>
                <div className={`font-body text-xs ${bottomSubColor}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
