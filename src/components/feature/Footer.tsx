import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTheme } from '@/context/SiteThemeContext';

const certifications = [
  { icon: 'ri-verified-badge-line', label: 'ISO 9001:2015' },
  { icon: 'ri-shield-star-line', label: 'Tersertifikasi LPJK' },
];

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();

  const ctaText = theme.navbar_cta_text || 'Hubungi Kami';
  const navbarLogoUrl = theme.navbar_logo_url || '';
  const logoWidth = parseInt(theme.navbar_logo_width || '140', 10);
  const logoHeight = parseInt(theme.navbar_logo_height || '50', 10);

  // Deskripsi & Copyright langsung Bahasa Indonesia
  const footerTagline = theme.footer_tagline || 'Membangun masa depan dengan integritas dan kualitas konstruksi terbaik di Indonesia.';
  const footerCopyright = theme.footer_copyright || `© ${new Date().getFullYear()} PT Waringin Mega Mandiri. Hak Cipta Dilindungi.`;

  const footerTextColor = theme.footer_text_color || '#94A3B8';
  const footerTextSize = parseInt(theme.footer_text_size || '14', 10);

  const kontakAddress = theme.address || 'Jl. Bendungan Hilir Raya G1 No.5 Jakarta Pusat 10210';
  const kontakPhone = theme.phone || '+62 21 5738001';
  const kontakEmail = theme.email || 'info@waringinmegamandiri.com';

  const socials = [
    { icon: 'ri-instagram-line', href: theme.instagram || '#', label: 'Instagram' },
    { icon: 'ri-linkedin-box-line', href: theme.linkedin || '#', label: 'LinkedIn' },
    { icon: 'ri-facebook-line', href: theme.facebook || '#', label: 'Facebook' },
    { icon: 'ri-youtube-line', href: theme.youtube || '#', label: 'YouTube' },
  ].filter((s) => s.href !== '#');

  const perusahaanLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/tentang-kami' },
    { label: 'Portofolio', path: '/portofolio' },
    { label: 'Berita', path: '/news' },
    { label: 'Karir', path: '/karir' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const layananLinks = [
    'Konstruksi Bangunan Gedung',
    'Pekerjaan Infrastruktur',
    'Manajemen Proyek',
    'Desain & Bangun',
    'Renovasi & Pemeliharaan',
  ];

  return (
    <footer
      className="relative overflow-hidden transition-colors duration-300 bg-[#050A14]"
      data-preview-id="footer"
    >
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(56,189,248,0.15), transparent)',
        }}
      />

      <div className="absolute inset-0 grid-pattern-sm pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Bagian Logo */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-5 mb-5">
              <div
                className="overflow-hidden rounded shrink-0"
                style={{ width: logoWidth, height: logoHeight }}
              >
                <img
                  src={
                    navbarLogoUrl ||
                    'https://static.readdy.ai/image/bb09a0928cc8f0d4386aa86b1c375457/e43383809fea645d4b3c3e3429de1214.png'
                  }
                  alt="PT Waringin Mega Mandiri"
                  className="w-full h-full object-contain object-left"
                />
              </div>
            </div>

            <p
              className="leading-relaxed mb-6 font-body max-w-xs"
              style={{ color: footerTextColor, fontSize: `${footerTextSize}px` }}
            >
              {footerTagline}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {certifications.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-400/15 bg-sky-400/5"
                >
                  <i className={`${c.icon} text-xs text-sky-400`} />
                  <span className="font-body text-xs font-semibold text-white">{c.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  rel="nofollow noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center border rounded-lg transition-all duration-300 cursor-pointer border-slate-700 text-slate-500 hover:text-sky-400 hover:border-sky-400/40"
                >
                  <i className={`${s.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              PERUSAHAAN
            </h4>
            <ul className="space-y-2.5">
              {perusahaanLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors duration-300 font-body flex items-center gap-1.5 group text-slate-500 hover:text-sky-400"
                  >
                    <span className="w-0 group-hover:w-2 h-px transition-all duration-300 shrink-0 bg-sky-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Layanan */}
          <div className="lg:col-span-3">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              LAYANAN KAMI
            </h4>
            <ul className="space-y-2.5">
              {layananLinks.map((item) => (
                <li key={item}>
                  <span className="text-sm font-body flex items-center gap-1.5 group cursor-default transition-colors text-slate-500 hover:text-slate-400">
                    <i className="ri-checkbox-blank-circle-fill text-[5px] shrink-0 text-sky-400/40" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div className="lg:col-span-3">
            <h4 className="font-syne font-bold text-xs tracking-widest uppercase mb-4 text-white">
              HUBUNGI KAMI
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 mt-0.5 bg-sky-400/8 border-sky-400/15">
                  <i className="ri-map-pin-line text-xs text-sky-400" />
                </div>
                <span className="text-sm leading-relaxed font-body transition-colors text-slate-500 hover:text-sky-400">
                  {kontakAddress}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 bg-emerald-400/8 border-emerald-400/15">
                  <i className="ri-phone-line text-xs text-emerald-400" />
                </div>
                <a
                  href={`tel:${kontakPhone.replace(/\s/g, '')}`}
                  className="text-sm transition-colors cursor-pointer font-body text-slate-500 hover:text-sky-400"
                >
                  {kontakPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 bg-amber-400/8 border-amber-400/15">
                  <i className="ri-mail-line text-xs text-amber-400" />
                </div>
                <a
                  href={`mailto:${kontakEmail}`}
                  className="text-sm transition-colors cursor-pointer font-body break-all text-slate-500 hover:text-sky-400"
                >
                  {kontakEmail}
                </a>
              </li>
            </ul>

            <a
              href={`mailto:${kontakEmail}`}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-body font-medium transition-all duration-300 cursor-pointer whitespace-nowrap border-sky-400/25 bg-sky-400/5 text-sky-400 hover:bg-sky-400/12 hover:border-sky-400/40"
            >
              <i className="ri-mail-send-line text-sm" />
              {ctaText}
            </a>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-body tracking-wider"
            style={{ color: footerTextColor, fontSize: `${footerTextSize}px` }}
          >
            {footerCopyright}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="transition-colors cursor-pointer font-body text-slate-700 hover:text-slate-500">
              Kebijakan Privasi
            </span>
            <span className="text-slate-800">|</span>
            <span className="transition-colors cursor-pointer font-body text-slate-700 hover:text-slate-500">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}