import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function Footer() {
  const { t } = useTranslation(); // <-- Ini yang bikin Footer bisa nanya ke Kamus
  const { theme } = useSiteTheme();

  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);

  return (
    <footer className="relative overflow-hidden bg-[#050A14] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <img 
              src={navbarLogoUrl || "https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"} 
              style={{ width: logoWidth, height: logoHeight }}
              className="object-contain mb-5"
            />
            {/* Pakai Kamus: footer.desc */}
            <p className="text-slate-400 text-sm leading-relaxed">{t('footer.desc')}</p>
          </div>

          {/* Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.perusahaan')}</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li><Link to="/">{t('nav.beranda')}</Link></li>
              <li><Link to="/tentang-kami">{t('nav.tentangKami')}</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.layanan')}</h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li>{t('service.gc.title')}</li>
              <li>{t('service.6.title')}</li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase mb-4">{t('footer.kontak')}</h4>
            <p className="text-slate-500 text-sm">{t('kontak.addressVal')}</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex justify-between items-center text-slate-500 text-xs">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-4">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}