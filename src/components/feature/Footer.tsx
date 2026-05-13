import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

const certifications = [
  { icon: 'ri-verified-badge-line', label: 'ISO 9001:2015' },
  { icon: 'ri-shield-star-line', label: t => t('badge.lpjk') }, // Pakai kamus
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

  const kontakAddress = theme.address || t('kontak.addressVal');
  const kontakPhone = theme.phone || t('kontak.phoneVal');
  const kontakEmail = theme.email || t('kontak.emailVal');

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
          
          {/* Logo & Deskripsi */}
          <div className="lg:col-span-4">
            <div className="mb-5 overflow-hidden rounded" style={{ width: logoWidth, height: logoHeight }}>
              <img
                src={navbarLogoUrl || 'https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png'}
                alt="Logo"
                className="w-full h-full object-contain object-left"
              />
            </div>
            <p className="leading-relaxed mb-6 font-body text-slate-400 text-sm">
              {footerTagline}
            </p>
          </div>

          {/* Kolom Perusahaan */}
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

          {/* Kolom Layanan */}
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

          {/* Kolom Kontak */}
          <div className="lg:col-span-3">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              {t('footer.kontak')}
            </h4>
            <div className="space-y-4 text-sm font-body text-slate-500">
              <p>{kontakAddress}</p>
              <p className="text-emerald-400 font-semibold">{kontakPhone}</p>
              <p className="text-amber-400">{kontakEmail}</p>
            </div>
          </div>
        </div>

        {/* Baris Bawah (Copyright & Privacy) */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <p>{footerCopyright}</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">{t('footer.privacy')}</span>
            <span className="hover:text-white cursor-pointer">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}