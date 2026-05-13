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

  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);

  const perusahaanLinks = [
    { label: t('nav.beranda'), path: '/' },
    { label: t('nav.tentangKami'), path: '/tentang-kami' },
    { label: t('nav.portofolio'), path: '/portofolio' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.karir'), path: '/karir' },
    { label: t('nav.kontak'), path: '/kontak' },
  ];

  return (
    <footer className="relative bg-[#050A14] border-t border-white/5 pt-14 pb-8">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-5 overflow-hidden rounded" style={{ width: logoWidth, height: logoHeight }}>
              <img src={navbarLogoUrl || "https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"} className="w-full h-full object-contain object-left" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{t('footer.desc')}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {certifications.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-400/15 bg-sky-400/5 text-white text-xs font-semibold">
                  <i className={c.icon} /> {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.perusahaan')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {perusahaanLinks.map((item) => (
                <li key={item.path}><Link to={item.path} className="hover:text-sky-400">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.layanan')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>{t('service.gc.title')}</li>
              <li>{t('service.6.title')}</li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.kontak')}</h4>
            <div className="space-y-4 text-sm text-slate-500 font-body">
              <p>{t('kontak.addressVal')}</p>
              <p className="text-emerald-400">{t('kontak.phoneVal')}</p>
              <p className="text-amber-400">{t('kontak.emailVal')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs gap-3">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">{t('footer.privacy')}</span>
            <span>|</span>
            <span className="hover:text-white cursor-pointer">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}