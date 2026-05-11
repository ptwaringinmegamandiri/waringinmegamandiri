import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

const socials = [
  { icon: 'ri-instagram-line', href: '#', label: 'Instagram' },
  { icon: 'ri-linkedin-box-line', href: '#', label: 'LinkedIn' },
  { icon: 'ri-facebook-line', href: '#', label: 'Facebook' },
  { icon: 'ri-youtube-line', href: '#', label: 'YouTube' },
];

const kontakInfo = {
  address: 'Jl. Bendungan Hilir Raya G1 No.5 Jakarta Pusat 10210',
  phone: '+62 21 5738001',
  email: 'info@waringinmegamandiri.com',
};

const certifications = [
  { icon: 'ri-verified-badge-line', label: 'ISO 9001:2015' },
  { icon: 'ri-shield-star-line', label: 'LPJK Certified' },
];

const sbuItems = [
  { code: '41011', label: 'Gedung Hunian' },
  { code: '41012', label: 'Gedung Perkantoran' },
  { code: '41013', label: 'Gedung Industri' },
  { code: '41014', label: 'Gedung Perbelanjaan' },
  { code: '41015', label: 'Gedung Kesehatan' },
  { code: '41017', label: 'Gedung Penginapan' },
  { code: '41019', label: 'Tempat Ibadah' },
];

export default function Footer() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const perusahaanLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/tentang-kami' },
    { label: 'Portofolio', path: '/portofolio' },
    { label: 'News', path: '/news' },
    { label: 'Karir', path: '/karir' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const layananLinks = [
    'General Contractor',
    'Struktur & Arsitektur',
    'MEP Engineering',
    'Plumbing & Sanitasi',
    'Renovasi & Rehabilitasi',
  ];

  return (
    <footer className={`relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#050A14]' : 'bg-slate-50'}`}>
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: isDark ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(56,189,248,0.15), transparent)' : 'linear-gradient(90deg, transparent, rgba(14,165,233,0.35), rgba(14,165,233,0.12), transparent)' }} />

      {/* Subtle grid */}
      <div className={`absolute inset-0 grid-pattern-sm pointer-events-none ${isDark ? 'opacity-20' : 'opacity-[0.07]'}`} />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">

        {/* Top section: Brand + Nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* Brand col */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-24 h-20 overflow-hidden rounded shrink-0">
                <img
                  src="https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"
                  alt="PT Waringin Mega Mandiri"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className={`font-syne font-bold text-lg tracking-wide leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>WARINGIN</p>
                <p className={`font-body text-sm tracking-[0.15em] leading-none mt-1.5 font-medium uppercase ${isDark ? 'text-sky-400' : 'text-sky-500'}`}>Mega Mandiri</p>
                <p className={`font-body text-sm mt-1.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Est. 2022 · Jakarta</p>
              </div>
            </div>

            <p className={`text-sm leading-relaxed mb-6 font-body max-w-xs ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
              {t('footer.desc')}
            </p>

            {/* Certifications inline */}
            <div className="flex flex-wrap gap-2 mb-5">
              {certifications.map((c) => (
                <div key={c.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDark ? 'border-sky-400/15 bg-sky-400/5' : 'border-sky-500/15 bg-sky-500/5'}`}>
                  <i className={`${c.icon} text-xs ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                  <span className={`font-body text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  rel="nofollow noreferrer"
                  aria-label={s.label}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-all duration-300 cursor-pointer ${isDark ? 'border-slate-700 text-slate-500 hover:text-sky-400 hover:border-sky-400/40' : 'border-slate-300 text-slate-500 hover:text-sky-500 hover:border-sky-500/40'}`}
                >
                  <i className={`${s.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              PERUSAHAAN
            </h4>
            <ul className="space-y-2.5">
              {perusahaanLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`text-sm transition-colors duration-300 font-body flex items-center gap-1.5 group ${isDark ? 'text-slate-500 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}>
                    <span className={`w-0 group-hover:w-2 h-px transition-all duration-300 shrink-0 ${isDark ? 'bg-sky-400' : 'bg-sky-500'}`} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              LAYANAN
            </h4>
            <ul className="space-y-2.5">
              {layananLinks.map((item) => (
                <li key={item}>
                  <span className={`text-sm font-body flex items-center gap-1.5 group cursor-default transition-colors ${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-600 hover:text-slate-800'}`}>
                    <i className={`ri-checkbox-blank-circle-fill text-[5px] shrink-0 ${isDark ? 'text-sky-400/40' : 'text-sky-500/40'}`} />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              KONTAK
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 mt-0.5 ${isDark ? 'bg-sky-400/8 border-sky-400/15' : 'bg-sky-500/8 border-sky-500/15'}`}>
                  <i className={`ri-map-pin-line text-xs ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                </div>
                <span className={`text-sm leading-relaxed font-body transition-colors ${isDark ? 'text-slate-500 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}>{kontakInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 ${isDark ? 'bg-emerald-400/8 border-emerald-400/15' : 'bg-emerald-500/8 border-emerald-500/15'}`}>
                  <i className={`ri-phone-line text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                </div>
                <a href="tel:+62215738001" className={`text-sm transition-colors cursor-pointer font-body ${isDark ? 'text-slate-500 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}>
                  {kontakInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 ${isDark ? 'bg-amber-400/8 border-amber-400/15' : 'bg-amber-500/8 border-amber-500/15'}`}>
                  <i className={`ri-mail-line text-xs ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                </div>
                <a href="mailto:info@waringinmegamandiri.com" className={`text-sm transition-colors cursor-pointer font-body break-all ${isDark ? 'text-slate-500 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}>
                  {kontakInfo.email}
                </a>
              </li>
            </ul>

            {/* Email CTA */}
            <a
              href="mailto:info@waringinmegamandiri.com"
              className={`mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-body font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${isDark ? 'border-sky-400/25 bg-sky-400/5 text-sky-400 hover:bg-sky-400/12 hover:border-sky-400/40' : 'border-sky-500/25 bg-sky-500/5 text-sky-500 hover:bg-sky-500/12 hover:border-sky-500/40'}`}
            >
              <i className="ri-mail-send-line text-sm" />
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <p className={`text-xs font-body tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>© 2024 PT WARINGIN MEGA MANDIRI · ALL RIGHTS RESERVED</p>
          <div className="flex items-center gap-4 text-xs">
            <span className={`transition-colors cursor-pointer font-body ${isDark ? 'text-slate-700 hover:text-slate-500' : 'text-slate-500 hover:text-slate-800'}`}>{t('footer.privacy')}</span>
            <span className={isDark ? 'text-slate-800' : 'text-slate-300'}>|</span>
            <span className={`transition-colors cursor-pointer font-body ${isDark ? 'text-slate-700 hover:text-slate-500' : 'text-slate-500 hover:text-slate-800'}`}>{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}