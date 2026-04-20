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
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useThemeContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const navLinks = [
    { labelKey: 'nav.beranda', path: '/' },
    { labelKey: 'nav.tentangKami', path: '/tentang-kami' },
    { labelKey: 'nav.portofolio', path: '/portofolio' },
    { labelKey: 'nav.news', path: '/news' },
    { labelKey: 'nav.karir', path: '/karir' },
    { labelKey: 'nav.kontak', path: '/kontak' },
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

  const scrolledBg = isDark
    ? 'bg-[#070C17]/95 backdrop-blur-md border-b border-sky-400/10'
    : 'bg-white/97 backdrop-blur-md border-b border-sky-400/15 shadow-sm';

  const linkBase = isDark
    ? 'text-slate-300 hover:text-white'
    : 'text-slate-600 hover:text-slate-900';

  const linkActive = isDark ? 'text-sky-400' : 'text-sky-600';

  const langBtnClass = isDark
    ? 'border-sky-400/25 hover:border-sky-400/50 bg-sky-400/5 hover:bg-sky-400/10 text-slate-300 hover:text-white'
    : 'border-sky-500/30 hover:border-sky-500/50 bg-sky-500/5 hover:bg-sky-500/10 text-slate-600 hover:text-slate-900';

  const langDropBg = isDark
    ? 'bg-[#0D1628] border-sky-400/20'
    : 'bg-white border-sky-400/25 shadow-xl';

  const langOptActive = isDark
    ? 'bg-sky-400/15 text-sky-300 font-semibold'
    : 'bg-sky-500/10 text-sky-700 font-semibold';

  const langOptDefault = isDark
    ? 'text-slate-300 hover:bg-sky-400/8 hover:text-white'
    : 'text-slate-600 hover:bg-sky-500/8 hover:text-slate-900';

  const themeBtnClass = isDark
    ? 'border-sky-400/25 bg-sky-400/5 text-slate-300 hover:text-white hover:border-sky-400/50'
    : 'border-sky-500/30 bg-sky-500/5 text-slate-600 hover:text-slate-900 hover:border-sky-500/50';

  const mobilePanelBg = isDark
    ? 'bg-[#070C17] border-l border-sky-400/10'
    : 'bg-white border-l border-sky-400/15';

  const mobileLinkBase = isDark ? 'text-slate-300 border-sky-400/10' : 'text-slate-600 border-sky-400/10';
  const mobileLinkActive = isDark ? 'text-sky-400' : 'text-sky-600';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? scrolledBg : 'bg-transparent'
        }`}
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 xl:px-10 max-w-[1400px]">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-20 h-16 flex items-center justify-center overflow-hidden rounded">
                <img
                  src="https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png"
                  alt="PT Waringin Mega Mandiri Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden md:block">
                <p className={`font-syne font-bold text-lg tracking-wide leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  WARINGIN
                </p>
                <p className="font-body text-sky-500 text-sm tracking-[0.12em] leading-none mt-1.5 font-medium">
                  MEGA MANDIRI
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body font-medium text-xs xl:text-sm tracking-wide transition-all duration-300 relative group whitespace-nowrap ${
                      isActive ? linkActive : linkBase
                    }`}
                  >
                    {t(link.labelKey)}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-sky-500 transition-all duration-300 ${
                        isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-60'
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Language Switcher */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 xl:gap-1.5 border rounded-lg px-2 xl:px-3 py-1.5 transition-all duration-300 cursor-pointer whitespace-nowrap ${langBtnClass}`}
                >
                  <span className="text-sm">{currentLang.flag}</span>
                  <span className="font-body text-xs font-semibold tracking-wide">{currentLang.label}</span>
                  <i className={`ri-arrow-down-s-line text-sm transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div className={`absolute top-full right-0 mt-2 w-32 border rounded-xl overflow-hidden z-50 ${langDropBg}`}>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                          i18n.language === lang.code ? langOptActive : langOptDefault
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
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${themeBtnClass}`}
                aria-label="Toggle theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`text-base ${isDark ? 'ri-sun-line' : 'ri-moon-line'}`} />
              </button>

              <a
                href="mailto:info@waringinmegamandiri.co.id"
                className="btn-neon-solid px-3 xl:px-5 py-2 rounded-lg text-xs xl:text-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                {t('nav.hubungiKami')}
              </a>
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${themeBtnClass}`}
                aria-label="Toggle theme"
              >
                <i className={`text-base ${isDark ? 'ri-sun-line' : 'ri-moon-line'}`} />
              </button>

              {/* Mobile Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer whitespace-nowrap ${langBtnClass}`}
                >
                  <span className="text-sm">{currentLang.flag}</span>
                  <span className="font-body text-xs font-semibold">{currentLang.label}</span>
                </button>
                {langOpen && (
                  <div className={`absolute top-full right-0 mt-2 w-28 border rounded-xl overflow-hidden z-50 ${langDropBg}`}>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body transition-colors cursor-pointer whitespace-nowrap ${
                          i18n.language === lang.code ? langOptActive : langOptDefault
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hamburger */}
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
      </nav>

      {/* Backdrop */}
      {langOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-400 lg:hidden ${menuOpen ? 'visible' : 'invisible'}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-72 h-full transition-transform duration-400 ${mobilePanelBg} ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8 pt-24 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body font-medium text-base py-3 border-b transition-colors duration-300 ${
                    isActive ? mobileLinkActive : mobileLinkBase
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <a
              href="mailto:info@waringinmegamandiri.co.id"
              className="btn-neon-solid px-5 py-3 rounded-lg text-center mt-4 cursor-pointer"
            >
              {t('nav.hubungiKami')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
