import { useThemeContext } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
}

export default function HeroBanner({ title, subtitle, breadcrumb }: HeroBannerProps) {
  const { isDark } = useThemeContext();
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        {isDark ? (
          <img
            src="https://readdy.ai/api/search-image?query=dark%20moody%20construction%20site%20at%20dusk%20with%20massive%20concrete%20building%20skeleton%20under%20construction%2C%20tower%20crane%20silhouette%20against%20stormy%20dark%20charcoal%20sky%2C%20warm%20amber%20industrial%20floodlights%20illuminating%20steel%20scaffolding%2C%20dust%20and%20fog%20in%20the%20air%2C%20cinematic%20wide%20angle%20shot%2C%20ultra%20realistic%20photography%2C%20gritty%20industrial%20atmosphere%2C%20deep%20shadows%2C%20no%20blue%20tones&width=1920&height=500&seq=wmm-banner-dark-v2&orientation=landscape"
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <img
            src="https://readdy.ai/api/search-image?query=bright%20modern%20construction%20site%20with%20tall%20glass%20building%20under%20construction%2C%20clear%20blue%20sky%20with%20white%20clouds%2C%20workers%20in%20yellow%20hard%20hats%20on%20scaffolding%2C%20sunlit%20steel%20structure%20and%20concrete%20pillars%2C%20professional%20architectural%20photography%2C%20vibrant%20colors%2C%20sharp%20details%2C%20clean%20industrial%20environment%2C%20golden%20hour%20sunlight&width=1920&height=500&seq=wmm-banner-light-v2&orientation=landscape"
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        )}
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/80 via-[#0D1117]/70 to-[#0D1117]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F6FF]/75 via-[#F0F6FF]/65 to-[#F0F6FF]" />
        )}
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`font-body text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t('nav.beranda')}</span>
          <i className={`ri-arrow-right-s-line text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <span className={`font-body text-sm font-medium ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>{breadcrumb}</span>
        </div>
        <h1 className={`font-syne font-black text-3xl md:text-5xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <div className="neon-line-short" />
        </div>
        <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
