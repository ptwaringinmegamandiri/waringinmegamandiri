import { useEffect, useRef } from 'react';
import { useSiteTheme, useLocalizedTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const clientsBase = [
  { key: 'client_card_1', name: 'APL Group', fullName: 'APL Group (PT Astakona Megatama)', desc: 'Pengembang properti komersial & residensial skala nasional', icon: 'ri-building-4-line', projects: 3, category: 'Properti' },
  { key: 'client_card_2', name: 'Astra Land', fullName: 'Astra Land Indonesia', desc: 'Anak perusahaan Astra International di bidang properti premium', icon: 'ri-community-line', projects: 5, category: 'Properti' },
  { key: 'client_card_3', name: 'ASG Group', fullName: 'ASG Group', desc: 'Pengembang kawasan perumahan dan komersial terpadu', icon: 'ri-home-8-line', projects: 4, category: 'Properti' },
  { key: 'client_card_4', name: 'Yayasan Charitas', fullName: 'Yayasan Rumah Sakit Charitas', desc: 'Institusi kesehatan terkemuka di Sumatera Selatan', icon: 'ri-hospital-line', projects: 2, category: 'Kesehatan' },
  { key: 'client_card_5', name: 'PT Sabang Raya', fullName: 'PT Sabang Raya Investama', desc: 'Perusahaan investasi & hospitality di kawasan Batam', icon: 'ri-hotel-line', projects: 1, category: 'Properti' },
  { key: 'client_card_6', name: 'Hilton Garden Inn', fullName: 'Hilton Garden Inn Batam', desc: 'Brand hotel internasional kelas dunia di Indonesia', icon: 'ri-building-2-line', projects: 1, category: 'Properti' },
];

const categoryColors: Record<string, string> = {
  Properti: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  Kesehatan: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Hospitality: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Industri: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Pendidikan: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Pemerintahan / BUMN': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  Infrastruktur: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  Lainnya: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

export default function ClientsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useSiteTheme();
  const { isDark } = useThemeContext();
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || 'id') as 'id' | 'en' | 'zh';

  // Helper: get localized theme value with fallback
  const lt = (key: string, fallback: string) => {
    const dyn = theme as Record<string, string | undefined>;
    if (lang !== 'id') {
      const locVal = dyn[`${key}_${lang}`];
      if (locVal && locVal.trim()) return locVal;
    }
    return dyn[key] || fallback;
  };

  const clientsTitle = useLocalizedTheme('clients_title') || 'Dipercaya oleh Perusahaan Terkemuka';
  const clientsDesc  = useLocalizedTheme('clients_desc')  || 'Kami telah dipercaya oleh berbagai perusahaan dan institusi terkemuka di Indonesia untuk menangani proyek konstruksi skala besar dengan standar kualitas internasional.';

  const clients = clientsBase.map((c) => ({
    ...c,
    name:     lt(`${c.key}_name`,     c.name),
    fullName: lt(`${c.key}_fullName`, c.fullName),
    desc:     lt(`${c.key}_desc`,     c.desc),
    projects: Number(lt(`${c.key}_projects`, String(c.projects))) || c.projects,
    category: lt(`${c.key}_category`, c.category),
  }));

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

  return (
    <section
      ref={sectionRef}
      className={`py-20 relative overflow-hidden ${isDark ? 'bg-[#070C17]' : 'bg-[#F0F6FF]'}`}
      id="klien-mitra"
      data-preview-id="clients-section"
      data-preview-label="Klien & Mitra"
      data-editable-fields="clients_title,clients_desc,client_card_1_name,client_card_1_fullName,client_card_1_desc,client_card_1_projects,client_card_1_category,client_card_2_name,client_card_2_fullName,client_card_2_desc,client_card_2_projects,client_card_2_category,client_card_3_name,client_card_3_fullName,client_card_3_desc,client_card_3_projects,client_card_3_category,client_card_4_name,client_card_4_fullName,client_card_4_desc,client_card_4_projects,client_card_4_category,client_card_5_name,client_card_5_fullName,client_card_5_desc,client_card_5_projects,client_card_5_category,client_card_6_name,client_card_6_fullName,client_card_6_desc,client_card_6_projects,client_card_6_category"
      data-edit-field="clients"
    >
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className="reveal-client text-center mb-14"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-body font-semibold mb-4">
            DIPERCAYA OLEH
          </p>
          <h2 className={`font-syne font-black text-3xl md:text-4xl lg:text-5xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {clientsTitle.split(' ').slice(0, -1).join(' ')} <span className="text-amber-400">{clientsTitle.split(' ').slice(-1)}</span>
          </h2>
          <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {clientsDesc}
          </p>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {clients.map((client, idx) => {
            const iconClass = categoryColors[client.category] || categoryColors['Properti'];
            return (
              <div
                key={client.key}
                data-preview-id={client.key}
                data-preview-label={client.name}
                data-editable-fields={`${client.key}_name,${client.key}_fullName,${client.key}_desc,${client.key}_projects,${client.key}_category`}
                className={`reveal-client relative overflow-hidden group cursor-default p-6 rounded-xl border ${isDark ? 'border-slate-700/50 bg-gradient-to-br from-[#0D1628] to-[#0B1424] hover:border-sky-400/30' : 'border-blue-200 bg-white hover:border-blue-400'} transition-all duration-300`}
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease',
                  transitionDelay: `${idx * 0.07}s`,
                }}
              >
                <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-sky-400/25' : 'via-blue-400/25'} to-transparent`} />
                <div className={`w-12 h-12 flex items-center justify-center mb-4 rounded-xl border ${iconClass}`}>
                  <i className={`${client.icon} text-xl`} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className={`font-syne font-bold text-sm leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {client.fullName}
                  </h5>
                  <span
                    className={`shrink-0 text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${iconClass}`}
                  >
                    {client.category}
                  </span>
                </div>
                <p className={`font-body text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {client.desc}
                </p>
                <div className={`h-px mb-3 ${isDark ? '' : 'bg-blue-100'}`} style={isDark ? { backgroundColor: 'rgba(56,189,248,0.08)' } : undefined} />
                <div className="flex items-center gap-1.5">
                  <i className={`ri-building-line text-sm ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                  <span className={`font-syne font-bold text-sm ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>
                    {client.projects}
                  </span>
                  <span className={`font-body text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>proyek bersama</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div
          className={`reveal-client rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border ${isDark ? 'border-sky-400/10 bg-gradient-to-br from-sky-400/5 to-[#0D1628]/80' : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'}`}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${isDark ? 'bg-sky-400/10 border border-sky-400/20' : 'bg-blue-50 border border-blue-200'}`}>
              <i className={`ri-shield-check-line text-lg ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`font-syne font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                50+ Klien Korporat Terpercaya
              </p>
              <p className={`font-body text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Layan berbagai sektor industri di seluruh Indonesia
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[
              { val: '200+', label: 'Proyek Selesai' },
              { val: '98%', label: 'Tingkat Kepuasan' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`font-syne font-black text-lg ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>{s.val}</div>
                <div className={`font-body text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}