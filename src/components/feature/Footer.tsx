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
  email: 'info@waringinmegamandiri.co.id',
};

const certifications = [
  { icon: 'ri-verified-badge-line', label: 'ISO 9001:2015' },
  { icon: 'ri-shield-star-line', label: 'LPJK Certified' },
];



export default function Footer() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const footerBg = isDark ? '#050A14' : '#0B1E4A';

  // All text white on both dark/light (footer always has dark bg)
  const textMuted = 'text-white/80';
  const textBody = 'text-white/80';
  const textHeading = 'text-white';
  const textBrand = isDark ? 'text-sky-400' : 'text-sky-300';
  const textEst = 'text-white/60';

  const certBadgeBg = isDark
    ? 'border-sky-400/15 bg-sky-400/5'
    : 'border-white/30 bg-white/10';
  const certIconCol = isDark ? 'text-sky-400' : 'text-white';
  const certTextCol = 'text-white font-semibold';

  const socialBtn = isDark
    ? 'border-slate-700 text-slate-500 hover:text-sky-400 hover:border-sky-400/40'
    : 'border-white/30 text-white/70 hover:text-white hover:border-white/60';

  const navLink = isDark
    ? 'text-slate-500 hover:text-sky-400'
    : 'text-white/70 hover:text-white';
  const navAccent = isDark ? 'bg-sky-400' : 'bg-white';

  const serviceText = isDark
    ? 'text-slate-500 hover:text-slate-400'
    : 'text-white/70 hover:text-white';
  const serviceDot = isDark ? 'text-sky-400/40' : 'text-white/40';

  const contactIconBgAddr = isDark ? 'bg-sky-400/8 border-sky-400/15' : 'bg-white/10 border-white/20';
  const contactIconAddr = isDark ? 'text-sky-400' : 'text-sky-300';
  const contactIconBgPhone = isDark ? 'bg-emerald-400/8 border-emerald-400/15' : 'bg-white/10 border-white/20';
  const contactIconPhone = isDark ? 'text-emerald-400' : 'text-emerald-300';
  const contactIconBgMail = isDark ? 'bg-amber-400/8 border-amber-400/15' : 'bg-white/10 border-white/20';
  const contactIconMail = isDark ? 'text-amber-400' : 'text-amber-300';
  const contactLink = isDark ? 'text-slate-500 hover:text-sky-400' : 'text-white/70 hover:text-white';

  const ctaBtn = isDark
    ? 'border-sky-400/25 bg-sky-400/5 text-sky-400 hover:bg-sky-400/12 hover:border-sky-400/40'
    : 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50';

  const bottomBorder = isDark ? 'border-slate-800/80' : 'border-white/10';
  const bottomText = isDark ? 'text-slate-600' : 'text-white/50';
  const bottomLinks = isDark ? 'text-slate-700 hover:text-slate-500' : 'text-white/50 hover:text-white';
  const bottomDivider = isDark ? 'text-slate-800' : 'text-white/30';

  const perusahaanLinks = [
    { labelKey: 'nav.beranda', path: '/' },
    { labelKey: 'nav.tentangKami', path: '/tentang-kami' },
    { labelKey: 'nav.portofolio', path: '/portofolio' },
    { labelKey: 'nav.news', path: '/news' },
    { labelKey: 'nav.karir', path: '/karir' },
    { labelKey: 'nav.kontak', path: '/kontak' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: footerBg }}>
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(56,189,248,0.15), transparent)' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern-sm opacity-20 pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">

        {/* Top section: Brand + Nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* Brand col */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-16 overflow-hidden rounded shrink-0">
                <img
                  src="https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"
                  alt="PT Waringin Mega Mandiri"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className={`font-syne font-bold text-base tracking-wide leading-none ${textHeading}`}>WARINGIN</p>
                <p className={`font-body text-xs tracking-[0.15em] leading-none mt-1.5 font-medium uppercase ${textBrand}`}>Mega Mandiri</p>
                <p className={`font-body text-xs mt-1.5 ${textEst}`}>Est. 2022 · Jakarta</p>
              </div>
            </div>

            <p className={`text-sm leading-relaxed mb-6 font-body max-w-xs ${textBody}`}>
              {t('footer.desc')}
            </p>

            {/* Certifications inline */}
            <div className="flex flex-wrap gap-2 mb-5">
              {certifications.map((c) => (
                <div
                  key={c.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${certBadgeBg}`}
                >
                  <i className={`${c.icon} text-xs ${certIconCol}`} />
                  <span className={`font-body text-xs font-semibold ${certTextCol}`}>{c.label}</span>
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
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-all duration-300 cursor-pointer ${socialBtn}`}
                >
                  <i className={`${s.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${textHeading}`}>
              {t('footer.perusahaan')}
            </h4>
            <ul className="space-y-2.5">
              {perusahaanLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm transition-colors duration-300 font-body flex items-center gap-1.5 group ${navLink}`}
                  >
                    <span className={`w-0 group-hover:w-2 h-px transition-all duration-300 shrink-0 ${navAccent}`} />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${textHeading}`}>
              {t('footer.layanan')}
            </h4>
            <ul className="space-y-2.5">
              {[
                'General Contractor',
                'Struktur & Arsitektur',
                'MEP Engineering',
                'Plumbing & Sanitasi',
                'Renovasi & Rehabilitasi',
              ].map((item) => (
                <li key={item}>
                  <span className={`text-sm font-body flex items-center gap-1.5 group cursor-default transition-colors ${serviceText}`}>
                    <i className={`ri-checkbox-blank-circle-fill text-[5px] shrink-0 ${serviceDot}`} />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h4 className={`font-syne font-bold text-xs tracking-widest uppercase mb-4 ${textHeading}`}>
              {t('footer.kontak')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 mt-0.5 ${contactIconBgAddr}`}>
                  <i className={`ri-map-pin-line text-xs ${contactIconAddr}`} />
                </div>
                <span className={`text-sm leading-relaxed font-body ${contactLink}`}>{kontakInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 ${contactIconBgPhone}`}>
                  <i className={`ri-phone-line text-xs ${contactIconPhone}`} />
                </div>
                <a href="tel:+62215738001" className={`text-sm transition-colors cursor-pointer font-body ${contactLink}`}>
                  {kontakInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 ${contactIconBgMail}`}>
                  <i className={`ri-mail-line text-xs ${contactIconMail}`} />
                </div>
                <a href="mailto:info@waringinmegamandiri.co.id" className={`text-sm transition-colors cursor-pointer font-body break-all ${contactLink}`}>
                  {kontakInfo.email}
                </a>
              </li>
            </ul>

            {/* Email CTA */}
            <a
              href="mailto:info@waringinmegamandiri.co.id"
              className={`mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-body font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${ctaBtn}`}
            >
              <i className="ri-mail-send-line text-sm" />
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 ${bottomBorder}`}>
          <p className={`text-xs font-body tracking-wider ${bottomText}`}>{t('footer.copyright')}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className={`transition-colors cursor-pointer font-body ${bottomLinks}`}>{t('footer.privacy')}</span>
            <span className={bottomDivider}>|</span>
            <span className={`transition-colors cursor-pointer font-body ${bottomLinks}`}>{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
