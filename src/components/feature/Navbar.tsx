// ... existing code ...
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

const LANGUAGES = [
  { code: 'id', label: 'ID', flag: '🇮🇩' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function Navbar() {
  const { i18n } = useTranslation();
  const { toggleTheme, isDark } = useThemeContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/tentang-kami' },
    { label: 'Portofolio', path: '/portofolio' },
    { label: 'News', path: '/news' },
    { label: 'Karir', path: '/karir' },
    { label: 'Kontak', path: '/kontak' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    ? `${isDark ? 'bg-[#070C17]/95 border-sky-400/10' : 'bg-white/92 border-blue-200/50'} backdrop-blur-md border-b`
    : 'bg-transparent';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolledBg}`}>
        <div className="mx-auto px-4 md:px-6 lg:px-8 xl:px-10 max-w-[1400px]">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded">
                <img
                  src="https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"
                  alt="PT Waringin Mega Mandiri"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className={`font-syne font-bold text-base tracking-wide leading-none ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  WARINGIN
                </p>
                <p className="font-body text-sky-400 text-sm tracking-[0.12em] leading-none mt-1 font-medium">
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
                        ? (isDark ? 'text-sky-400' : 'text-blue-600')
                        : isDark
                        ? 'text-white/70 hover:text-white'
                        : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${isDark ? 'bg-sky-400' : 'bg-blue-500'} ${isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-60'}`} />
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
                  className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
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

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'border-white/20 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-400'
                }`}
                title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              >
                <i className={isDark ? 'ri-sun-line text-sm' : 'ri-moon-line text-sm'} />
              </button>

              <a
                href="mailto:info@waringinmegamandiri.com"
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors"
              >
                Hubungi Kami
              </a>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isDark
                    ? 'border-white/20 text-white/70 hover:text-white'
                    : 'border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="font-body text-xs font-semibold">{currentLang.label}</span>
              </button>
              {langOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className={`absolute top-0 right-0 w-72 h-full border-l p-8 pt-24 flex flex-col gap-4 ${isDark ? 'bg-[#070C17] border-sky-400/10' : 'bg-[#EAF2FF] border-blue-200/60'}`}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                        <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body font-medium text-base py-3 border-b transition-colors duration-300 ${
                      isActive
                        ? (isDark ? 'text-sky-400 border-sky-400/30' : 'text-blue-600 border-blue-300')
                        : isDark
                        ? 'text-slate-300 border-sky-400/10'
                        : 'text-slate-700 border-blue-200/50'
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
                Hubungi Kami
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
