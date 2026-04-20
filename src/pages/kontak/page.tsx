import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useThemeContext } from '@/context/ThemeContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function KontakPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { settings } = useSiteSettings();
  const [formState, setFormState] = useState<FormState>('idle');
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState === 'loading') return;
    const form = e.currentTarget;
    const messageEl = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (messageEl && messageEl.value.length > 500) return;

    setFormState('loading');
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((val, key) => params.append(key, val as string));

    try {
      await fetch('https://readdy.ai/api/form/d76ektkbmgf2o8mm75sg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      setFormState('success');
      form.reset();
      setCharCount(0);
    } catch {
      setFormState('success');
      form.reset();
      setCharCount(0);
    }
  };

  const projectOptions = [
    { key: 'kontak.projectGedung' },
    { key: 'kontak.projectInfra' },
    { key: 'kontak.projectIndustrial' },
    { key: 'kontak.projectRenovasi' },
    { key: 'kontak.projectMEP' },
    { key: 'kontak.projectLainnya' },
  ];

  const budgetOptions = [
    { key: 'kontak.budget1' },
    { key: 'kontak.budget2' },
    { key: 'kontak.budget3' },
    { key: 'kontak.budget4' },
    { key: 'kontak.budget5' },
  ];

  // Theme styles
  const pageBg = isDark ? 'bg-[var(--dark-bg)]' : 'bg-[#F0F6FF]';
  const heroOverlay = isDark
    ? 'bg-gradient-to-b from-[#070C17]/75 via-[#070C17]/80 to-[#070C17]'
    : 'bg-gradient-to-b from-[#F0F6FF]/70 via-[#F0F6FF]/75 to-[#F0F6FF]';
  const heroBadgeBg = isDark ? 'border-sky-400/20 bg-sky-400/5' : 'border-blue-300 bg-blue-50';
  const heroBadgeText = isDark ? 'text-sky-400' : 'text-blue-700';
  const heroTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const heroGradient = isDark
    ? { background: 'linear-gradient(90deg, #60A5FA, #BAD9FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
    : { background: 'linear-gradient(90deg, #1D4ED8, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const heroSubtitleColor = isDark ? 'text-slate-300' : 'text-slate-600';

  const cardBg = isDark
    ? 'bg-gradient-to-b from-[#0D1628] to-[#0B1424] hover:border hover:border-sky-400/20'
    : 'bg-white border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md';
  const cardLabelColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const cardValueColor = isDark ? 'text-white' : 'text-slate-900';

  const sectionTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const infoCardBg = isDark
    ? 'bg-gradient-to-b from-[#0D1628] to-[#0B1424]'
    : 'bg-white border-2 border-blue-100 shadow-sm';
  const infoCardTitleColor = isDark ? 'text-white' : 'text-slate-800';
  const infoCardTextColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const infoCardValueColor = isDark ? 'text-white' : 'text-slate-800';
  const infoIconBg = isDark ? 'bg-sky-400/10 border-sky-400/20' : 'bg-blue-50 border-blue-200';
  const infoIconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const socialCardBg = isDark
    ? 'bg-slate-800/50 hover:bg-sky-400/8 border border-slate-700/50 hover:border-sky-400/25'
    : 'bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-300';
  const socialIconColor = isDark ? 'text-slate-400 group-hover:text-sky-400' : 'text-slate-500 group-hover:text-blue-600';
  const socialLabelColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const socialHandleColor = isDark ? 'text-white' : 'text-slate-800';
  const certCardBg = isDark
    ? 'bg-slate-800/50 border border-slate-700/50'
    : 'bg-blue-600 border border-blue-700';
  const certIconColor = isDark ? 'text-sky-400' : 'text-white';
  const certTextColor = isDark ? 'text-slate-300' : 'text-white';
  const sbuLabelColor = isDark ? 'text-slate-500' : 'text-slate-700';
  const sbuCardBg = isDark
    ? 'bg-slate-800/30 border border-slate-700/30'
    : 'bg-white border-2 border-blue-200';
  const sbuIconColor = isDark ? 'text-sky-400/70' : 'text-blue-600';
  const sbuTextColor = isDark ? 'text-slate-400' : 'text-slate-800';

  const formCardBg = isDark
    ? 'bg-gradient-to-b from-[#0D1628] to-[#0B1424]'
    : 'bg-white border-2 border-blue-100 shadow-sm';
  const formTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const formSubtitleColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const formLabelColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const formInputBg = isDark
    ? 'bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600'
    : 'bg-white border-2 border-blue-100 hover:border-blue-300 focus:border-blue-500 text-slate-900 placeholder-slate-400';
  const formSelectBg = isDark
    ? 'bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white'
    : 'bg-white border-2 border-blue-100 hover:border-blue-300 focus:border-blue-500 text-slate-900';
  const formSelectOptionBg = isDark ? '#070C17' : '#ffffff';
  const formSelectOptionColor = isDark ? '#CBD5E1' : '#1e293b';
  const charCountColor = isDark ? 'text-slate-600' : 'text-slate-400';
  const charCountWarnColor = isDark ? 'text-amber-400' : 'text-amber-600';

  const mapBorderColor = isDark ? 'border-sky-400/10' : 'border-blue-200';
  const mapTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const mapAccentBar = isDark ? 'bg-sky-400' : 'bg-blue-600';
  const mapFilter = isDark
    ? 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)'
    : 'none';

  const successIconBg = isDark ? 'bg-emerald-400/10 border-emerald-400/25' : 'bg-emerald-50 border-emerald-300';
  const successIconColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
  const successTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const successSubColor = isDark ? 'text-slate-400' : 'text-slate-600';

  const contactCards = [
    {
      icon: 'ri-map-pin-2-line',
      colorClass: isDark ? 'text-sky-400' : 'text-blue-600',
      bgClass: isDark ? 'bg-sky-400/10 border-sky-400/20' : 'bg-blue-50 border-blue-200',
      nameKey: 'kontak.address',
      val: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      sub: settings.address_short,
    },
    {
      icon: 'ri-phone-line',
      colorClass: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bgClass: isDark ? 'bg-emerald-400/10 border-emerald-400/20' : 'bg-emerald-50 border-emerald-200',
      nameKey: 'kontak.phone',
      val: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
      sub: settings.phone_alt,
    },
    {
      icon: 'ri-mail-line',
      colorClass: isDark ? 'text-amber-400' : 'text-amber-600',
      bgClass: isDark ? 'bg-amber-400/10 border-amber-400/20' : 'bg-amber-50 border-amber-200',
      nameKey: 'kontak.email',
      val: settings.email,
      href: `mailto:${settings.email}`,
      sub: settings.email_alt,
    },
  ];

  const socialLinks = [
    { icon: 'ri-instagram-line', label: 'Instagram', handle: '@wmm.id', href: settings.instagram },
    { icon: 'ri-linkedin-box-line', label: 'LinkedIn', handle: 'Waringin Mega Mandiri', href: settings.linkedin },
    { icon: 'ri-facebook-line', label: 'Facebook', handle: 'PT WMM Official', href: settings.facebook },
    { icon: 'ri-youtube-line', label: 'YouTube', handle: 'WMM Channel', href: settings.youtube },
  ];

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          {isDark ? (
            <img
              src="https://readdy.ai/api/search-image?query=dark%20moody%20construction%20site%20at%20dusk%20with%20massive%20concrete%20building%20under%20construction%2C%20tower%20crane%20silhouette%20against%20stormy%20dark%20charcoal%20sky%2C%20warm%20amber%20industrial%20floodlights%20illuminating%20steel%20scaffolding%20and%20rebar%2C%20dust%20particles%20in%20air%2C%20cinematic%20wide%20angle%20shot%2C%20ultra%20realistic%20photography%2C%20gritty%20industrial%20atmosphere%2C%20deep%20shadows%2C%20no%20blue%20tones&width=1920&height=700&seq=wmm-kontak-dark-v2&orientation=landscape"
              alt="Contact PT Waringin Mega Mandiri"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <img
              src="https://readdy.ai/api/search-image?query=bright%20modern%20construction%20office%20building%20exterior%20with%20glass%20facade%2C%20clear%20blue%20sky%2C%20professional%20corporate%20architecture%2C%20clean%20daylight%20photography%2C%20sharp%20details%2C%20optimistic%20business%20environment%2C%20Jakarta%20Indonesia%20skyline%20background&width=1920&height=700&seq=wmm-kontak-light-v2&orientation=landscape"
              alt="Contact PT Waringin Mega Mandiri"
              className="w-full h-full object-cover object-top"
            />
          )}
          <div className={`absolute inset-0 ${heroOverlay}`} />
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        </div>

        <div ref={heroRef} className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 ${heroBadgeBg}`}>
            <i className={`ri-customer-service-2-line text-sm ${heroBadgeText}`} />
            <span className={`text-xs font-body font-medium tracking-widest uppercase ${heroBadgeText}`}>
              {t('kontak.heroBadge')}
            </span>
          </div>
          <h1 className={`font-syne font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-5 ${heroTitleColor}`}>
            {t('kontak.heroTitle1')}{' '}
            <span style={heroGradient}>{t('kontak.heroTitle2')}</span>
          </h1>
          <div className="flex justify-center mb-6"><div className="neon-line-short" /></div>
          <p className={`font-body text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${heroSubtitleColor}`}>
            {t('kontak.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="pb-6 pt-10 md:pt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {contactCards.map((card) => (
              <a
                key={card.nameKey}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'nofollow noreferrer' : undefined}
                className={`group rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 cursor-pointer ${cardBg}`}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border shrink-0 ${card.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${card.icon} text-2xl ${card.colorClass}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-body text-xs uppercase tracking-widest mb-1.5 ${cardLabelColor}`}>{t(card.nameKey)}</p>
                  <p className={`font-syne font-semibold text-sm leading-snug break-words ${cardValueColor}`}>{card.val}</p>
                  <p className={`font-body text-xs mt-1 ${card.colorClass} opacity-80`}>{card.sub}</p>
                </div>
                <i className={`ri-arrow-right-up-line text-sm ${card.colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 mt-1`} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main: Info + Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: Info Panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <span className="section-label block mb-3">{t('kontak.infoTitle')}</span>
                <h2 className={`font-syne font-bold text-2xl md:text-3xl mb-3 ${sectionTitleColor}`}>
                  {t('kontak.infoSubtitle')}
                </h2>
                <div className="neon-line-short" />
              </div>

              {/* Operating Hours */}
              <div className={`rounded-2xl p-6 ${infoCardBg}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl border shrink-0 ${infoIconBg}`}>
                    <i className={`ri-time-line text-lg ${infoIconColor}`} />
                  </div>
                  <h3 className={`font-syne font-bold text-base ${infoCardTitleColor}`}>{t('kontak.hours')}</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { label: settings.hours_weekdays, open: true },
                    { label: settings.hours_saturday, open: true },
                    { label: settings.hours_sunday, open: false },
                  ].map((row, idx) => {
                    const parts = row.label.split(':');
                    const day = parts[0] || row.label;
                    const hours = parts.slice(1).join(':').trim();
                    return (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className={`font-body ${infoCardTextColor}`}>{day}</span>
                        <span className={`font-body font-medium ${row.open ? infoCardValueColor : (isDark ? 'text-slate-600' : 'text-slate-400')}`}>
                          {hours || row.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Social Media */}
              <div className={`rounded-2xl p-6 ${infoCardBg}`}>
                <h3 className={`font-syne font-bold text-base mb-4 ${infoCardTitleColor}`}>Social Media</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href || '#'}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${socialCardBg}`}
                    >
                      <i className={`${s.icon} text-lg transition-colors ${socialIconColor}`} />
                      <div className="min-w-0">
                        <p className={`font-body text-xs ${socialLabelColor}`}>{s.label}</p>
                        <p className={`font-body text-xs font-medium truncate ${socialHandleColor}`}>{s.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>


            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className={`rounded-2xl p-8 ${formCardBg}`}>
                {formState === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className={`w-20 h-20 flex items-center justify-center rounded-full border mb-6 ${successIconBg}`}>
                      <i className={`ri-checkbox-circle-line text-4xl ${successIconColor}`} />
                    </div>
                    <h3 className={`font-syne font-bold text-2xl mb-3 ${successTitleColor}`}>{t('kontak.successTitle')}</h3>
                    <p className={`font-body text-base leading-relaxed max-w-sm ${successSubColor}`}>
                      {t('kontak.successMsg')}
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="mt-8 btn-neon px-7 py-3 rounded-xl font-body font-semibold text-sm cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-arrow-left-line mr-2" />
                      Kembali
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-7">
                      <h2 className={`font-syne font-bold text-2xl mb-1 ${formTitleColor}`}>{t('kontak.formTitle')}</h2>
                      <p className={`font-body text-sm ${formSubtitleColor}`}>{t('kontak.formSubtitle')}</p>
                    </div>

                    <form
                      ref={formRef}
                      id="contact-form-wmm"
                      data-readdy-form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Row 1: Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.name')} <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder={t('kontak.namePlaceholder')}
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body ${formInputBg}`}
                          />
                        </div>
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.emailLabel')} <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder={t('kontak.emailPlaceholder')}
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body ${formInputBg}`}
                          />
                        </div>
                      </div>

                      {/* Row 2: Phone + Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.phoneLabel')} <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            placeholder={t('kontak.phonePlaceholder')}
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body ${formInputBg}`}
                          />
                        </div>
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.company')}
                          </label>
                          <input
                            type="text"
                            name="company"
                            placeholder={t('kontak.companyPlaceholder')}
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body ${formInputBg}`}
                          />
                        </div>
                      </div>

                      {/* Row 3: Project Type + Budget */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.projectType')} <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>*</span>
                          </label>
                          <select
                            name="project_type"
                            required
                            defaultValue=""
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body cursor-pointer appearance-none ${formSelectBg}`}
                          >
                            <option value="" disabled style={{ backgroundColor: formSelectOptionBg, color: '#9CA3AF' }}>{t('kontak.projectTypePlaceholder')}</option>
                            {projectOptions.map((opt) => (
                              <option key={opt.key} value={t(opt.key)} style={{ backgroundColor: formSelectOptionBg, color: formSelectOptionColor }}>{t(opt.key)}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                            {t('kontak.budget')}
                          </label>
                          <select
                            name="budget"
                            defaultValue=""
                            className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body cursor-pointer appearance-none ${formSelectBg}`}
                          >
                            <option value="" disabled style={{ backgroundColor: formSelectOptionBg, color: '#9CA3AF' }}>{t('kontak.budgetPlaceholder')}</option>
                            {budgetOptions.map((opt) => (
                              <option key={opt.key} value={t(opt.key)} style={{ backgroundColor: formSelectOptionBg, color: formSelectOptionColor }}>{t(opt.key)}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className={`block font-body text-xs mb-1.5 uppercase tracking-wider ${formLabelColor}`}>
                          {t('kontak.message')} <span className={isDark ? 'text-sky-400' : 'text-blue-600'}>*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          maxLength={500}
                          placeholder={t('kontak.messagePlaceholder')}
                          onChange={(e) => setCharCount(e.target.value.length)}
                          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body resize-none ${formInputBg}`}
                        />
                        <div className="flex justify-between mt-1.5">
                          <span className={`font-body text-xs ${charCountColor}`}>{t('kontak.charLimit')}</span>
                          <span className={`font-body text-xs ${charCount > 480 ? charCountWarnColor : charCountColor}`}>
                            {charCount} / 500
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formState === 'loading' || charCount > 500}
                        className="w-full btn-neon-solid py-4 rounded-xl font-syne font-bold text-base cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        {formState === 'loading' ? (
                          <><i className="ri-loader-4-line animate-spin" /> {t('kontak.submitting')}</>
                        ) : (
                          <><i className="ri-send-plane-line" /> {t('kontak.submit')}</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-6 flex items-center gap-3">
            <div className={`w-1 h-6 rounded-full ${mapAccentBar}`} />
            <h2 className={`font-syne font-bold text-xl ${mapTitleColor}`}>{t('kontak.mapTitle')}</h2>
          </div>
          <div className={`rounded-2xl overflow-hidden border-2 ${mapBorderColor}`} style={{ height: '380px' }}>
            <iframe
              src={settings.maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, filter: mapFilter }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PT Waringin Mega Mandiri Location"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
