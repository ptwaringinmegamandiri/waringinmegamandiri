import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

const LANGUAGES = [
  { code: 'id', label: 'ID', flag: '🇮🇩' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme } = useSiteTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const brandText = theme.navbar_brand_text || 'WARINGIN';
  const ctaText = theme.navbar_cta_text || t('nav.hubungiKami');
  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);
  const navTextColor = theme.navbar_text_color || '#FFFFFF';
  const brandSize = parseInt(theme.navbar_brand_size || '16', 10);
  const brandColor = theme.navbar_brand_color || '#FFFFFF';
  const subBrandColor = theme.navbar_sub_brand_color || '#2563EB';

  const navLinks = [
    { label: t('nav.beranda'), path: '/' },
    { label: t('nav.tentangKami'), path: '/tentang-kami' },
    { label: t('nav.portofolio'), path: '/portofolio' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.karir'), path: '/karir' },
    { label: t('nav.kontak'), path: '/kontak' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const scrolledBg = scrolled
    ? 'bg-[#070C17] lg:bg-[#070C17]/95 border-sky-400/10 lg:backdrop-blur-md border-b'
    : 'bg-transparent';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolledBg}`}>
        <div className="mx-auto px-4 md:px-6 lg:px-8 xl:px-10 max-w-[1400px]">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0"
              data-preview-id="navbar"
              data-editable-fields="navbar_logo_url,navbar_brand_text,navbar_cta_text,navbar_logo_width,navbar_logo_height,navbar_text_color,navbar_brand_size,navbar_brand_color,navbar_sub_brand_color"
            >
              <div className="flex items-center justify-center overflow-hidden rounded shrink-0"
                style={{
                  width: isMobileView ? Math.min(logoWidth, 100) : logoWidth,
                  height: isMobileView ? Math.min(logoHeight, 36) : logoHeight,
                }}
              >
                <img
                  src={navbarLogoUrl || "https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"}
                  alt="PT Waringin Mega Mandiri"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-syne font-bold tracking-wide leading-none text-white"
                  style={{ fontSize: `${brandSize}px`, color: brandColor }}
                >
                  {brandText}
                </p>
                <p className="font-body text-sm tracking-[0.12em] leading-none mt-1.5 font-medium"
                  style={{ color: subBrandColor }}
                >
                  MEGA MANDIRI
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body font-medium text-sm tracking-wide transition-all duration-300 relative group whitespace-nowrap ${
                      isActive
                        ? 'text-sky-400'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 bg-sky-400 ${isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-60'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Right side: Lang + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 transition-all duration-300 cursor-pointer whitespace-nowrap border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <span className="text-sm">{currentLang.flag}</span>
                  <span className="font-body text-xs font-semibold tracking-wide">{currentLang.label}</span>
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 border border-slate-700/50 bg-[#0D1628] rounded-xl overflow-hidden z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                          i18n.language === lang.code
                            ? 'bg-sky-400/15 text-sky-300 font-semibold'
                            : 'text-slate-300 hover:bg-sky-400/8 hover:text-white'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {i18n.language === lang.code && (
                          <i className="ri-check-line text-sky-500 ml-auto text-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="mailto:info@waringinmegamandiri.com"
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors"
              >
                {ctaText}
              </a>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer whitespace-nowrap border-white/20 text-white/70 hover:text-white"
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="font-body text-xs font-semibold">{currentLang.label}</span>
              </button>
              {langOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-[6px] cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-[3px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                <span className={`block w-6 h-[3px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-[3px] rounded-full bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 right-0 w-72 h-full border-l p-8 pt-24 flex flex-col gap-4 bg-[#070C17] border-sky-400/10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body font-medium text-base py-3 border-b transition-colors duration-300 ${
                      isActive
                        ? 'text-sky-400 border-sky-400/30'
                        : 'text-slate-300 border-sky-400/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="mailto:info@waringinmegamandiri.com"
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm px-5 py-3 rounded-lg text-center mt-4 cursor-pointer"
              >
                {ctaText}
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}