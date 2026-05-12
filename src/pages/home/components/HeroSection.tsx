import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';

const DEFAULT_HERO_BG = 'https://readdy.ai/api/search-image?query=modern%20high-rise%20building%20under%20construction%20at%20golden%20hour%20sunset%2C%20dramatic%20orange%20and%20amber%20sky%2C%20construction%20cranes%20silhouettes%2C%20steel%20framework%20structure%2C%20scaffolding%20visible%2C%20warm%20industrial%20lighting%2C%20cinematic%20wide%20angle%20architectural%20photography%2C%20Jakarta%20Indonesia%20construction%20site%2C%20professional%20real%20estate%20development%20photography&width=1920&height=1080&seq=wmm-hero-vercel-sync&orientation=landscape';

export default function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const { theme } = useSiteTheme();

  const heroImage = theme.hero_image_url || DEFAULT_HERO_BG;
  const { isDark } = useThemeContext();
  const tagline = theme.hero_tagline || 'PT WARINGIN MEGA MANDIRI — BERDIRI SEJAK 2022';
  const title = theme.hero_title || 'Kontraktor Gedung\nTerpercaya\nSkala Nasional';
  const subtitle = theme.hero_subtitle || 'PT Waringin Mega Mandiri adalah anak perusahaan yang tergabung dalam Waringin Group dan telah membangun ruko, pabrik, gudang, hotel, apartemen, restoran, sekolah, kantor, bangunan bertingkat, rumah tinggal hingga kawasan industri.';
  const accentColor = isDark ? (theme.secondary_color || '#93C5FD') : '#1D4ED8';

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

  const titleLines = title.split('\n');

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
      data-preview-id="hero-section"
      data-preview-label="Hero Section"
      data-editable-fields="hero_tagline,hero_title,hero_subtitle,hero_cta_primary_text,hero_cta_secondary_text"
      data-edit-field="hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImage}
          alt="PT Waringin Mega Mandiri construction site"
          className="w-full h-full object-cover object-top"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/30 via-black/20 to-black/50' : 'from-slate-900/55 via-slate-900/40 to-slate-900/65'}`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-black/60 via-black/30 to-transparent' : 'from-slate-900/60 via-slate-900/30 to-transparent'}`} />
      </div>

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-10 flex flex-col justify-center">
          <div ref={titleRef} className="max-w-3xl">
            {/* Small label */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs tracking-[0.2em] uppercase font-body font-semibold ${isDark ? '' : 'text-sky-300'}`}
                style={{ color: isDark ? accentColor : undefined }}
              >
                {tagline}
              </span>
            </div>

            {/* Brand line */}
            <div className="mb-5">
              <span className={`text-xs tracking-[0.15em] uppercase font-body ${isDark ? 'text-white/80' : 'text-white/90'}`}>
                BUILT TO PERFECTION
              </span>
            </div>

            {/* Dynamic title lines */}
            <h1 className={`font-syne font-black mb-5 leading-[1.05] ${isDark ? 'text-white' : 'text-white'}`}>
              {titleLines.map((line, i) => (
                <span key={i} className="block text-4xl md:text-6xl lg:text-7xl" style={{ color: i === titleLines.length - 1 ? (isDark ? accentColor : '#60A5FA') : undefined }}>
                  {line}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className={`font-body text-base md:text-lg leading-relaxed mb-10 max-w-xl ${isDark ? 'text-white/80' : 'text-white/90'}`}>
              {subtitle}
            </p>

            {/* CTA Buttons — dynamic from theme */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Link
                to={theme.hero_cta_primary_url || '/portofolio'}
                className="font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors text-white"
                style={{ backgroundColor: theme.accent_color || '#0ea5e9' }}
              >
                <i className="ri-briefcase-line" />
                {theme.hero_cta_primary_text || 'Lihat Portofolio'}
              </Link>
              <a
                href={theme.hero_cta_secondary_url || 'mailto:info@waringinmegamandiri.com'}
                className="border border-white/30 hover:border-white/60 text-white font-bold px-6 py-3 rounded-lg text-sm cursor-pointer whitespace-nowrap inline-flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10"
              >
                <i className="ri-mail-line" />
                {theme.hero_cta_secondary_text || 'Hubungi Kami'}
              </a>
            </div>

            {/* Scroll indicator */}
            <div className="flex items-center gap-2">
              <span className={`text-xs tracking-widest uppercase font-body ${isDark ? 'text-white/50' : 'text-white/70'}`}>
                SCROLL
              </span>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-px h-6 ${isDark ? 'bg-white/30' : 'bg-white/50'}`} />
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-white/50' : 'bg-white/70'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}