import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';

const scopeItemsBase = [
  { key: 'service_card_1', icon: 'ri-building-2-line', defaultTitle: 'Gedung Komersial & Perkantoran', defaultDesc: 'Pembangunan gedung komersial, perkantoran, dan pusat perbelanjaan dengan standar konstruksi internasional.' },
  { key: 'service_card_2', icon: 'ri-home-4-line', defaultTitle: 'Hunian & Residensial', defaultDesc: 'Konstruksi hunian premium, apartemen, dan perumahan dengan kualitas material terbaik dan pengerjaan presisi.' },
  { key: 'service_card_3', icon: 'ri-hospital-line', defaultTitle: 'Fasilitas Publik & Institusi', defaultDesc: 'Pembangunan fasilitas publik, rumah sakit, sekolah, dan gedung pemerintahan sesuai standar yang berlaku.' },
  { key: 'service_card_4', icon: 'ri-layout-masonry-line', defaultTitle: 'Proyek Khusus & Mixed-Use', defaultDesc: 'Penanganan proyek dengan kompleksitas tinggi, termasuk mixed-use development dan bangunan dengan desain arsitektur unik.' },
];

const whyItemsBase = [
  { key: 'service_why_1', text: 'Tim Berpengalaman dari PT. Waringin Mega' },
  { key: 'service_why_2', text: 'Manajemen Proyek Terstruktur & Transparan' },
  { key: 'service_why_3', text: 'Komitmen Kualitas & Ketepatan Waktu' },
  { key: 'service_why_4', text: 'Dukungan Penuh Tenaga, Peralatan & Keuangan' },
  { key: 'service_why_5', text: 'Rekam Jejak Proyek yang Terbukti' },
  { key: 'service_why_6', text: 'Komunikasi Aktif dengan Klien' },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useSiteTheme();
  const { isDark } = useThemeContext();
  const servicesTitle = theme.services_title || 'Layanan Kami';
  const servicesDesc = theme.services_desc || 'Kami menyediakan solusi konstruksi komprehensif dengan teknologi terdepan untuk memenuhi setiap kebutuhan proyek Anda.';

  const scopeItems = scopeItemsBase.map((item) => ({
    ...item,
    title: theme[`${item.key}_title` as keyof typeof theme] || item.defaultTitle,
    desc: theme[`${item.key}_desc` as keyof typeof theme] || item.defaultDesc,
  }));

  const whyItems = whyItemsBase.map((item) => ({
    ...item,
    text: theme[`${item.key}_text` as keyof typeof theme] || item.text,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.reveal-item');
            els.forEach((el, idx) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, idx * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#0D1117]' : 'bg-[#EEF4FF]'}`}
      id="layanan"
      data-preview-id="services-section"
      data-preview-label="Layanan Kami"
      data-editable-fields="services_title,services_desc,service_card_1_title,service_card_1_desc,service_card_2_title,service_card_2_desc,service_card_3_title,service_card_3_desc,service_card_4_title,service_card_4_desc,service_why_1_text,service_why_2_text,service_why_3_text,service_why_4_text,service_why_5_text,service_why_6_text"
      data-edit-field="services"
    >
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 reveal-item" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-body font-semibold mb-4">
            APA YANG KAMI LAKUKAN
          </p>
          <h2 className={`font-syne font-bold text-3xl md:text-4xl lg:text-5xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {servicesTitle.split(' ').slice(0, -1).join(' ')} <span className="text-amber-400">{servicesTitle.split(' ').slice(-1)}</span>
          </h2>
          <p className={`font-body text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {servicesDesc}
          </p>
        </div>

        {/* Main Service Hero Card */}
        <div
          className={`reveal-item relative rounded-2xl overflow-hidden mb-10 border ${isDark ? 'border-slate-700/50 bg-[#0D1628]' : 'border-blue-200/80 bg-white'}`}
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
        >
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-sky-400/40' : 'via-blue-400/40'} to-transparent`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20construction%20workers%20in%20safety%20helmets%20and%20orange%20vests%20overlooking%20a%20large%20commercial%20building%20construction%20site%20in%20Jakarta%20Indonesia%2C%20modern%20high-rise%20building%20under%20construction%20with%20tower%20cranes%2C%20golden%20hour%20warm%20lighting%2C%20cinematic%20construction%20photography&width=700&height=500&seq=gc-hero-vercel&orientation=landscape"
                alt="General Contractor PT Waringin Mega Mandiri"
                className="w-full h-full object-cover object-top"
              />
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDark ? 'to-[#0D1628]/80' : 'to-white/80'} hidden lg:block`} />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0D1628]/70' : 'from-white/70'} to-transparent lg:hidden`} />
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-5 w-fit">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isDark ? 'bg-sky-400/10 border-sky-400/20' : 'bg-blue-50 border-blue-200'}`}>
                  <i className={`ri-hammer-line text-sm ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                </div>
                <span className={`font-body text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>
                  SOLUSI KONSTRUKSI PROFESIONAL & TERPERCAYA
                </span>
              </div>

              <h3 className={`font-syne font-bold text-3xl lg:text-4xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                General Contractor
              </h3>

              <p className={`font-body text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                PT. Waringin Mega Mandiri hadir sebagai General Contractor profesional yang berpengalaman dalam pelaksanaan proyek konstruksi skala menengah hingga besar. Didukung oleh tim berpengalaman dari PT. Waringin Mega, kami menghadirkan hasil pekerjaan berkualitas terbaik untuk setiap klien.
              </p>

              <div className={`hidden lg:flex gap-8 mb-8 pb-8 border-b ${isDark ? 'border-slate-700/50' : 'border-blue-100'}`}>
                <div>
                  <div className={`font-syne font-bold text-2xl ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>30+</div>
                  <div className={`font-body text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Proyek Selesai</div>
                </div>
                <div>
                  <div className={`font-syne font-bold text-2xl ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>100%</div>
                  <div className={`font-body text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Kepuasan Klien</div>
                </div>
                <div>
                  <div className={`font-syne font-bold text-2xl ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>2022</div>
                  <div className={`font-body text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Tahun Berdiri</div>
                </div>
              </div>

              <Link
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-body font-semibold text-sm text-white whitespace-nowrap cursor-pointer w-fit bg-sky-500 hover:bg-sky-400 transition-colors"
              >
                <i className="ri-phone-line" />
                Konsultasi Proyek
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="mb-10">
          <div className="reveal-item text-center mb-8" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <h4 className={`font-syne font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Lingkup Pekerjaan</h4>
            <p className={`font-body text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Bidang konstruksi yang kami tangani secara profesional</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scopeItems.map((scope, idx) => (
              <div
                key={scope.key}
                data-preview-id={scope.key}
                data-preview-label={scope.title}
                data-editable-fields={`${scope.key}_title,${scope.key}_desc`}
                className={`reveal-item relative overflow-hidden group cursor-default p-6 rounded-xl border ${isDark ? 'border-slate-700/50 bg-gradient-to-br from-[#0D1628] to-[#0B1424] hover:border-sky-400/30' : 'border-blue-200 bg-white hover:border-blue-400'} transition-all duration-300`}
                style={{
                  opacity: 0,
                  transform: 'translateY(30px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease',
                  transitionDelay: `${idx * 0.08}s`,
                }}
              >
                <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-sky-400/25' : 'via-blue-400/25'} to-transparent`} />
                <div className={`w-12 h-12 flex items-center justify-center mb-4 rounded-xl border ${isDark ? 'bg-sky-400/8 border-sky-400/15' : 'bg-blue-50 border-blue-200'}`}>
                  <i className={`${scope.icon} text-xl ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                </div>
                <h5 className={`font-syne font-bold text-sm mb-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{scope.title}</h5>
                <p className={`font-body text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{scope.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          className={`reveal-item rounded-2xl p-8 lg:p-10 border ${isDark ? 'border-sky-400/10 bg-gradient-to-br from-sky-400/5 to-[#0D1628]/80' : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'}`}
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-64 shrink-0">
              <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-body font-semibold mb-3">KEUNGGULAN KAMI</p>
              <h4 className={`font-syne font-bold text-2xl leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mengapa Memilih <span className="text-amber-400">WMM?</span>
              </h4>
              <p className={`font-body text-sm mt-3 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Kami hadir dengan dukungan penuh dari PT. Waringin Mega untuk memastikan setiap proyek berjalan optimal.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whyItems.map((item, idx) => (
                <div
                  key={item.key}
                  data-preview-id={item.key}
                  data-preview-label={item.text}
                  data-editable-fields={`${item.key}_text`}
                  className={`reveal-item flex items-center gap-3 p-4 rounded-xl border ${isDark ? 'border-sky-400/8 bg-transparent hover:bg-sky-400/5' : 'border-blue-100 bg-transparent hover:bg-blue-50'} transition-all duration-300 cursor-default`}
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${idx * 0.06}s`,
                  }}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full ${isDark ? 'bg-sky-400/15' : 'bg-blue-100'}`}>
                    <i className={`ri-check-line text-xs ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                  </div>
                  <span className={`font-body text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}