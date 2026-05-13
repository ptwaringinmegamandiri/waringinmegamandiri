import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();
  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);

  const layananLinks = [
    t('service.gc.scope1.title'),
    t('service.gc.scope2.title'),
    t('service.gc.scope3.title'),
    t('service.gc.scope4.title'),
    t('service.6.title'),
  ];

  return (
    <footer className="relative bg-[#050A14] border-t border-white/5 pt-14 pb-8">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          <div className="lg:col-span-4">
            <div className="mb-4 overflow-hidden rounded" style={{ width: logoWidth, height: logoHeight }}>
              <img src={navbarLogoUrl || "https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"} className="w-full h-full object-contain object-left" />
            </div>
            <p className="text-slate-400 text-sm font-body italic mb-2">{t('hero.slogan')} — PT Waringin Mega Mandiri</p>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">{t('footer.desc')}</p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase mb-4 tracking-widest">{t('footer.perusahaan')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">{t('nav.beranda')}</Link></li>
              <li><Link to="/tentang-kami" className="hover:text-sky-400 transition-colors">{t('nav.tentangKami')}</Link></li>
              <li><Link to="/portofolio" className="hover:text-sky-400 transition-colors">{t('nav.portofolio')}</Link></li>
              <li><Link to="/news" className="hover:text-sky-400 transition-colors">{t('nav.news')}</Link></li>
              <li><Link to="/karir" className="hover:text-sky-400 transition-colors">{t('nav.karir')}</Link></li>
              <li><Link to="/kontak" className="hover:text-sky-400 transition-colors">{t('nav.kontak')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4 tracking-widest">{t('footer.layanan')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {layananLinks.map((item) => (
                <li key={item} className="flex items-center gap-2"><div className="w-1 h-1 bg-sky-400 rounded-full" /> {item}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4 tracking-widest">{t('footer.kontak')}</h4>
            <div className="space-y-3 text-sm text-slate-400 font-body">
              <div className="flex gap-2 items-center"><i className="ri-map-pin-line text-sky-400" /><p>{t('kontak.addressVal')}</p></div>
              <div className="flex gap-2 items-center"><i className="ri-phone-line text-sky-400" /><p>{t('kontak.phoneVal')}</p></div>
              <div className="flex gap-2 items-center"><i className="ri-mail-line text-sky-400" /><p>{t('kontak.emailVal')}</p></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-600 text-xs gap-3">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <span className="hover:text-sky-400 cursor-pointer">{t('footer.privacy')}</span>
            <span className="hover:text-sky-400 cursor-pointer">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}