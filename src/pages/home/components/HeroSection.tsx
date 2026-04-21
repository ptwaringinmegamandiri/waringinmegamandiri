import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

export default function HeroSection() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const titleRef = useRef<HTMLDivElement>(null);

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
    <section className="dark-overlay relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {isDark ? (
          <img
            src="https://readdy.ai/api/search-image?query=dark%20moody%20construction%20site%20at%20twilight%20with%20tall%20concrete%20building%20skeleton%20under%20construction%2C%20massive%20tower%20crane%20silhouette%20against%20stormy%20dark%20charcoal%20sky%2C%20warm%20orange%20industrial%20floodlights%20illuminating%20steel%20beams%20and%20scaffolding%20structure%2C%20construction%20workers%20wearing%20safety%20helmets%2C%20dust%20and%20fog%20in%20the%20air%2C%20cinematic%20wide%20angle%20shot%2C%20ultra%20realistic%20photography%2C%20gritty%20industrial%20atmosphere%2C%20deep%20shadows%2C%20no%20blue%20color%20tones&width=1920&height=1080&seq=wmm-hero-dark-v4&orientation=landscape"
            alt="PT Waringin Mega Mandiri construction site"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <img
            src="https://readdy.ai/api/search-image?query=bright%20daylight%20modern%20construction%20site%20with%20tall%20glass%20skyscraper%20under%20construction%2C%20blue%20clear%20sky%20with%20white%20clouds%2C%20workers%20in%20yellow%20hard%20hats%20and%20orange%20vests%20on%20scaffolding%2C%20sunlit%20steel%20structure%20and%20concrete%20pillars%2C%20professional%20architectural%20photography%2C%20vibrant%20colors%2C%20sharp%20details%2C%20clean%20industrial%20environment%2C%20golden%20hour%20sunlight%2C%20optimistic%20and%20energetic%20atmosphere&width=1920&height=1080&seq=wmm-hero-light-v1&orientation=landscape"
            alt="PT Waringin Mega Mandiri construction site"
            className="w-full h-full object-cover object-top"
          />
        )}
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#070C17]/70 via-[#070C17]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070C17]/50 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F0F6FF]/80 via-[#F0F6FF]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F0F6FF]/50 via-transparent to-transparent" />
          </>
        )}
      </div>

      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-10 flex flex-col justify-center">
          <div ref={titleRef} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-sky-400 opacity-70" />
              <span className="section-label">{t('hero.label')}</span>
            </div>

            <div className="mb-5">
              <span
                className="font-syne font-black text-xs md:text-sm tracking-[0.35em] uppercase"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, #60A5FA, #BAD9FF)'
                    : 'linear-gradient(90deg, #1D4ED8, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('hero.slogan')}
              </span>
            </div>

            <h1 className="font-syne font-black mb-5 leading-[1.1]" style={{ color: isDark ? '#ffffff' : '#0F172A' }}>
              <span className="block text-4xl md:text-6xl lg:text-7xl">{t('hero.title1')}</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl">{t('hero.title2')}</span>
              <span
                className="block text-4xl md:text-6xl lg:text-7xl"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, #60A5FA, #BAD9FF)'
                    : 'linear-gradient(90deg, #1D4ED8, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('hero.title3')}
              </span>
            </h1>

            <p
              className="font-body text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              style={{ color: isDark ? '#CBD5E1' : '#374151' }}
            >
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Link
                to="/portofolio"
                className="btn-neon-solid px-8 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap"
              >
                <i className="ri-briefcase-line mr-2" />
                {t('hero.lihatPortofolio')}
              </Link>
              <a
                href="mailto:info@waringinmegamandiri.co.id"
                className="btn-neon px-8 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-line mr-2" />
                {t('hero.hubungiKami')}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-sky-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400/80 animate-bounce" />
              </div>
              <span
                className="font-body text-xs tracking-widest uppercase"
                style={{ color: isDark ? '#64748B' : '#6B7280' }}
              >
                {t('hero.scroll')}
              </span>
            </div>
          </div>
        </div>

        <div
          className="w-full border-t backdrop-blur-sm"
          style={{
            borderColor: isDark ? 'rgba(56,189,248,0.10)' : 'rgba(37,99,235,0.12)',
            backgroundColor: isDark ? 'rgba(7,12,23,0.80)' : 'rgba(240,246,255,0.85)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="py-5 px-6 flex items-center justify-center text-center">
              <span
                className="font-black text-2xl md:text-3xl"
                style={{
                  fontFamily: '"Merriweather", serif',
                  color: isDark ? '#7DD3FC' : '#1D4ED8'
                }}
              >
                35+ tahun pengalaman di bidang konstruksi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
