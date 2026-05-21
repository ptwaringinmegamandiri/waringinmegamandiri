import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useSiteTheme, useLocalizedTheme } from '@/context/SiteThemeContext';
import { renderRichText } from '@/lib/richText';

const DEFAULT_HERO_BG = 'https://readdy.ai/api/search-image?query=modern%20high-rise%20building%20under%20construction%20at%20golden%20hour%20sunset%2C%20dramatic%20orange%20and%20amber%20sky%2C%20construction%20cranes%20silhouettes%2C%20steel%20framework%20structure%2C%20scaffolding%20visible%2C%20warm%20industrial%20lighting%2C%20cinematic%20wide%20angle%20architectural%20photography%2C%20Jakarta%20Indonesia%20construction%20site%2C%20professional%20real%20estate%20development%20photography&width=1920&height=1080&seq=wmm-hero-vercel-sync&orientation=landscape';

export default function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { theme } = useSiteTheme();

  const heroImage = theme.hero_image_url || DEFAULT_HERO_BG;

  // Dynamic localized texts: falls back through DB-localized → DB-base → i18n static dict
  const heroTitleRaw  = useLocalizedTheme('hero_title',  'hero.title1');
  const heroTagline   = useLocalizedTheme('hero_tagline', 'hero.label');
  const heroSubtitle  = useLocalizedTheme('hero_subtitle', 'hero.subtitle');

  const heroTitleColor = theme.hero_title_color || '#FFFFFF';
  const heroSubtitleColor = theme.hero_subtitle_color || '#94A3B8';
  const heroTitleSize = parseInt(theme.hero_title_size || '56', 10);
  const heroSubtitleSize = parseInt(theme.hero_subtitle_size || '18', 10);

  // Split title on \n for multi-line rendering
  const heroTitleLines = heroTitleRaw.split('\\n').filter(Boolean);
  // If no DB value with \n, fall back to the three i18n keys
  const titleLines = heroTitleLines.length > 1
    ? heroTitleLines
    : [t('hero.title1'), t('hero.title2'), t('hero.title3')].filter(Boolean);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImage}
          alt="PT Waringin Mega Mandiri construction site"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-10 flex flex-col justify-center">
          <div ref={titleRef} className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs tracking-[0.2em] uppercase font-body font-semibold" style={{ color: heroSubtitleColor }}>
                {heroTagline}
              </span>
            </div>

            {/* Slogan - Tetap Miring & Pakai Warna Subtitle */}
            <div className="mb-5">
              <span className="text-xs tracking-[0.15em] uppercase font-body italic font-bold" style={{ color: heroSubtitleColor }}>
                {t('hero.slogan')}
              </span>
            </div>

            {/* Judul Utama - Dynamic multi-line from DB dengan rich text color support */}
            <h1 className="font-syne font-black mb-5 leading-[1.05]">
              {titleLines.map((line, idx) => (
                <span key={idx} className="block" style={{ fontSize: `clamp(32px, 6vw, ${heroTitleSize}px)`, lineHeight: '1.1' }}>
                  {renderRichText(line, { fontSize: heroTitleSize, color: heroTitleColor })}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="font-body leading-relaxed mb-10 max-w-xl">
              {renderRichText(heroSubtitle, { fontSize: heroSubtitleSize, color: heroSubtitleColor })}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Link
                to={'/portofolio'}
                className="font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors text-white"
                style={{ backgroundColor: theme.accent_color || '#0ea5e9' }}
              >
                <i className="ri-briefcase-line" />
                {t('hero.lihatPortofolio')}
              </Link>
              <a
                href={'mailto:info@waringinmegamandiri.com'}
                className="border border-white/30 hover:border-white/60 text-white font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10"
              >
                <i className="ri-mail-line" />
                {t('hero.hubungiKami')}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs tracking-widest uppercase font-body" style={{ color: heroSubtitleColor }}>
                {t('hero.scroll')}
              </span>
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-6" style={{ backgroundColor: heroSubtitleColor }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: heroSubtitleColor }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}