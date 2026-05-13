import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

const certifications = [
  { icon: 'ri-verified-badge-line', label: 'ISO 9001:2015' },
  { icon: 'ri-shield-star-line', label: 'LPJK Certified' },
];

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();

  const ctaText = theme.navbar_cta_text || t('nav.hubungiKami');
  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);

  const footerTagline = theme.footer_tagline || t('footer.desc');
  const footerCopyright = theme.footer_copyright || t('footer.copyright');
  const footerTextColor = theme.footer_text_color || '#94A3B8';
  const footerTextSize = parseInt(theme.footer_text_size || '14', 10);

  const kontakAddress = theme.address || t('kontak.addressVal');
  const kontakPhone = theme.phone || t('kontak.phoneVal');
  const kontakEmail = theme.email || t('kontak.emailVal');

  const socials = [
    { icon: 'ri-instagram-line', href: theme.instagram || '#', label: 'Instagram' },
    { icon: 'ri-linkedin-box-line', href: theme.linkedin || '#', label: 'LinkedIn' },
    { icon: 'ri-facebook-line', href: theme.facebook || '#', label: 'Facebook' },
    { icon: 'ri-youtube-line', href: theme.youtube || '#', label: 'YouTube' },
  ].filter((s) => s.href !== '#');

  const perusahaanLinks = [
    { label: t('nav.beranda'), path: '/' },
    { label: t('nav.tentangKami'), path: '/tentang-kami' },
    { label: t('nav.portofolio'), path: '/portofolio' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.karir'), path: '/karir' },
    { label: t('nav.kontak'), path: '/kontak' },
  ];

  const layananLinks = [
    t('service.gc.scope1.title'),
    t('service.gc.scope2.title'),
    t('service.gc.scope3.title'),
    t('service.gc.scope4.title'),
    t('service.6.title'),
  ];

  return (
    <footer className="relative overflow-hidden transition-colors duration-300 bg-[#050A14] border-t border-white/5">
      <div className="absolute inset-0 grid-pattern-sm pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand col */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-5 mb-5">
              <div className="overflow-hidden rounded shrink-0" style={{ width: logoWidth, height: logoHeight }}>
                <img
                  src={navbarLogoUrl || "https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"}
                  alt="Logo"
                  className="w-full h-full object-contain object-left"
                />
              </div>
            </div>

            <p className="leading-relaxed mb-6 font-body max-w-xs text-slate-400" style={{ fontSize: `${footerTextSize}px` }}>
              {footerTagline}
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-5">
              {certifications.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-400/15 bg-sky-400/5">
                  <i className={`${c.icon} text-xs text-sky-400`} />
                  <span className="font-body text-xs font-semibold text-white">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="w-8 h-8 flex items-center justify-center border rounded-lg border-slate-700 text-slate-500 hover:text-sky-400 hover:border-sky-400/40">
                  <i className={`${s.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              {t('footer.perusahaan')}
            </h4>
            <ul className="space-y-2.5">
              {perusahaanLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm font-body text-slate-500 hover:text-sky-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              {t('footer.layanan')}
            </h4>
            <ul className="space-y-2.5">
              {layananLinks.map((item) => (
                <li key={item} className="text-sm font-body text-slate-500 flex items-center gap-2">
                  <div className="w-1 h-1 bg-sky-400 rounded-full" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              {t(