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
            src="https://readdy.ai/api/search-image?query=modern%20high-rise%20building%20construction%20site%20at%20golden%20hour%20sunset%2C%20warm%20amber%20and%20soft%20orange%20sky%2C%20construction%20cranes%20silhouettes%20against%20sky%2C%20steel%20framework%20and%20scaffolding%20visible%2C%20professional%20architectural%20photography%2C%20Jakarta%20Indonesia%2C%20warm%20tones%2C%20soft%20diffused%20lighting%2C%20cinematic%20wide%20angle%2C%20no%20harsh%20shadows&width=1920&height=500&seq=wmm-banner-light-v3&orientation=landscape"
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        )}
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/80 via-[#0D1117]/70 to-[#0D1117]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/40 to-slate-900/65" />
        )}
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`font-body text-sm ${isDark ? 'text-white/60' : 'text-white/80'}`}>{t('nav.beranda')}</span>
          <i className={`ri-arrow-right-s-line text-sm ${isDark ? 'text-white/30' : 'text-white/50'}`} />
          <span className={`font-body text-sm font-medium ${isDark ? 'text-sky-400' : 'text-sky-300'}`}>{breadcrumb}</span>
        </div>
        <h1 className={`font-syne font-black text-3xl md:text-5xl mb-4 ${isDark ? 'text-white' : 'text-white'}`}>
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <div className="neon-line-short" />
        </div>
        <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-white/85'}`}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}