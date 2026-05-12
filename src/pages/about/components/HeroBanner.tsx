import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
  bgImageUrl?: string;
}

const DEFAULT_ABOUT_BG = 'https://readdy.ai/api/search-image?query=dark%20moody%20construction%20site%20at%20dusk%20with%20massive%20concrete%20building%20skeleton%20under%20construction%2C%20tower%20crane%20silhouette%20against%20stormy%20dark%20charcoal%20sky%2C%20warm%20amber%20industrial%20floodlights%20illuminating%20steel%20scaffolding%2C%20dust%20and%20fog%20in%20the%20air%2C%20cinematic%20wide%20angle%20shot%2C%20ultra%20realistic%20photography%2C%20gritty%20industrial%20atmosphere%2C%20deep%20shadows%2C%20no%20blue%20tones&width=1920&height=500&seq=wmm-banner-dark-v2&orientation=landscape';

export default function HeroBanner({ title, subtitle, breadcrumb, bgImageUrl }: HeroBannerProps) {
  const { t } = useTranslation();

  const bgImage = bgImageUrl || DEFAULT_ABOUT_BG;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/80 via-[#0D1117]/70 to-[#0D1117]" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-body text-sm text-white/60">{t('nav.beranda')}</span>
          <i className="ri-arrow-right-s-line text-sm text-white/30" />
          <span className="font-body text-sm font-medium text-sky-400">{breadcrumb}</span>
        </div>
        <h1 className="font-syne font-black text-3xl md:text-5xl mb-4 text-white">
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <div className="neon-line-short" />
        </div>
        <p className="font-body text-base max-w-2xl mx-auto leading-relaxed text-slate-400">
          {subtitle}
        </p>
      </div>
    </section>
  );
}