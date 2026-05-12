import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useThemeContext } from '@/context/ThemeContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useSiteTheme } from '@/context/SiteThemeContext';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const DEFAULT_KONTAK_BG = 'https://readdy.ai/api/search-image?query=dark%20moody%20construction%20site%20at%20dusk%20with%20massive%20concrete%20building%20under%20construction%2C%20tower%20crane%20silhouette%20against%20stormy%20dark%20charcoal%20sky%2C%20warm%20amber%20industrial%20floodlights%20illuminating%20steel%20scaffolding%20and%20rebar%2C%20dust%20particles%20in%20air%2C%20cinematic%20wide%20angle%20shot%2C%20ultra%20realistic%20photography%2C%20gritty%20industrial%20atmosphere%2C%20deep%20shadows%2C%20no%20blue%20tones&width=1920&height=700&seq=wmm-kontak-dark-v2&orientation=landscape';

export default function KontakPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { settings } = useSiteSettings();
  const { theme } = useSiteTheme();
  const [formState, setFormState] = useState<FormState>('idle');
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const bgImage = theme.kontak_bg_url || DEFAULT_KONTAK_BG;

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

  const contactCards = [
    {
      icon: 'ri-map-pin-2-line',
      colorClass: 'text-sky-400',
      bgClass: 'bg-sky-400/10 border-sky-400/20',
      nameKey: 'kontak.address',
      val: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      sub: settings.address_short,
      fieldKey: 'address',
    },
    {
      icon: 'ri-phone-line',
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-400/10 border-emerald-400/20',
      nameKey: 'kontak.phone',
      val: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
      sub: settings.phone_alt,
      fieldKey: 'phone',
    },
    {
      icon: 'ri-mail-line',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10 border-amber-400/20',
      nameKey: 'kontak.email',
      val: settings.email,
      href: `mailto:${settings.email}`,
      sub: settings.email_alt,
      fieldKey: 'email',
    },
  ];

  const socialLinks = [
    { icon: 'ri-instagram-line', label: 'Instagram', handle: '@wmm.id', href: settings.instagram, fieldKey: 'instagram' },
    { icon: 'ri-linkedin-box-line', label: 'LinkedIn', handle: 'Waringin Mega Mandiri', href: settings.linkedin, fieldKey: 'linkedin' },
    { icon: 'ri-facebook-line', label: 'Facebook', handle: 'PT WMM Official', href: settings.facebook, fieldKey: 'facebook' },
    { icon: 'ri-youtube-line', label: 'YouTube', handle: 'WMM Channel', href: settings.youtube, fieldKey: 'youtube' },
  ];

  return (
    <div className="min-h-screen bg-[var(--dark-bg)]">
      <div data-preview-id="navbar" data-preview-label="Navbar" data-editable-fields="navbar_brand_text,navbar_cta_text">
        <Navbar />
      </div>

      {/* Hero */}
      <div data-preview-id="kontak-hero" data-preview-label="Kontak Hero" data-editable-fields="kontak_title,kontak_subtitle">
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt="Contact PT Waringin Mega Mandiri"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070C17]/75 via-[#070C17]/80 to-[#070C17]" />
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        </div>

        <div ref={heroRef} className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 border-sky-400/20 bg-sky-400/5">
            <i className="ri-customer-service-2-line text-sm text-sky-400" />
            <span className="text-xs font-body font-medium tracking-widest uppercase text-sky-400">
              {t('kontak.heroBadge')}
            </span>
          </div>
          <h1 className="font-syne font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-5 text-white">
            {theme.kontak_title || t('kontak.heroTitle1')}{' '}
            <span className="text-sky-400">{t('kontak.heroTitle2')}</span>
          </h1>
          <div className="flex justify-center mb-6">
            <div className="neon-line-short" />
          </div>
          <p className="font-body text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-slate-300">
            {theme.kontak_subtitle || t('kontak.heroSubtitle')}
          </p>
        </div>
      </section>
      </div>

      {/* Contact Cards */}
      <div
        data-preview-id="kontak-cards"
        data-preview-label="Contact Cards"
        data-editable-fields="phone,phone_alt,email,email_alt,address,address_short"
        data-edit-field="phone"
      >
      <section className="pb-6 pt-10 md:pt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {contactCards.map((card) => (
              <a
                key={card.nameKey}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'nofollow noreferrer' : undefined}
                className="group rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 cursor-pointer bg-gradient-to-b from-[#0D1628] to-[#0B1424] hover:border hover:border-sky-400/20"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border shrink-0 ${card.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${card.icon} text-2xl ${card.colorClass}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-xs uppercase tracking-widest mb-1.5 text-slate-500">{t(card.nameKey)}</p>
                  <p className="font-syne font-semibold text-sm leading-snug break-words text-white">{card.val}</p>
                  <p className="font-body text-xs mt-1 text-slate-400 opacity-80">{card.sub}</p>
                </div>
                <i className={`ri-arrow-right-up-line text-sm ${card.colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 mt-1`} />
              </a>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* Main: Info + Form */}
      <div data-preview-id="kontak-form" data-preview-label="Contact Form">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: Info Panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <span className="section-label block mb-3">{t('kontak.infoTitle')}</span>
                <h2 className="font-syne font-bold text-2xl md:text-3xl mb-3 text-white">
                  {t('kontak.infoSubtitle')}
                </h2>
                <div className="neon-line-short" />
              </div>

              {/* Operating Hours */}
              <div
                className="rounded-2xl p-6 bg-gradient-to-b from-[#0D1628] to-[#0B1424]"
                data-preview-id="kontak-hours"
                data-preview-label="Jam Operasional"
                data-editable-fields="hours_weekdays,hours_saturday,hours_sunday"
                data-edit-field="hours_weekdays"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl border shrink-0 bg-sky-400/10 border-sky-400/20">
                    <i className="ri-time-line text-lg text-sky-400" />
                  </div>
                  <h3 className="font-syne font-bold text-base text-white">{t('kontak.hours')}</h3>
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
                        <span className="font-body text-slate-400">{day}</span>
                        <span className={`font-body font-medium ${row.open ? 'text-white' : 'text-slate-600'}`}>
                          {hours || row.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Social Media */}
              <div
                className="rounded-2xl p-6 bg-gradient-to-b from-[#0D1628] to-[#0B1424]"
                data-preview-id="kontak-social"
                data-preview-label="Social Media"
                data-editable-fields="instagram,linkedin,facebook,youtube"
                data-edit-field="instagram"
              >
                <h3 className="font-syne font-bold text-base mb-4 text-white">Social Media</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href || '#'}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-300 cursor-pointer group bg-slate-800/50 hover:bg-sky-400/8 border-slate-700/50 hover:border-sky-400/25"
                    >
                      <i className={`${s.icon} text-lg transition-colors text-slate-400 group-hover:text-sky-400`} />
                      <div className="min-w-0">
                        <p className="font-body text-xs text-slate-500">{s.label}</p>
                        <p className="font-body text-xs font-medium truncate text-white">{s.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl p-8 bg-gradient-to-b from-[#0D1628] to-[#0B1424]">
                {formState === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full border mb-6 bg-emerald-400/10 border-emerald-400/25">
                      <i className="ri-checkbox-circle-line text-4xl text-emerald-400" />
                    </div>
                    <h3 className="font-syne font-bold text-2xl mb-3 text-white">{t('kontak.successTitle')}</h3>
                    <p className="font-body text-base leading-relaxed max-w-sm text-slate-400">
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
                      <h2 className="font-syne font-bold text-2xl mb-1 text-white">{t('kontak.formTitle')}</h2>
                      <p className="font-body text-sm text-slate-500">{t('kontak.formSubtitle')}</p>
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
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.name')} <span className="text-sky-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder={t('kontak.namePlaceholder')}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.emailLabel')} <span className="text-sky-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder={t('kontak.emailPlaceholder')}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600"
                          />
                        </div>
                      </div>

                      {/* Row 2: Phone + Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.phoneLabel')} <span className="text-sky-400">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            placeholder={t('kontak.phonePlaceholder')}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.company')}
                          </label>
                          <input
                            type="text"
                            name="company"
                            placeholder={t('kontak.companyPlaceholder')}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600"
                          />
                        </div>
                      </div>

                      {/* Row 3: Project Type + Budget */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.projectType')} <span className="text-sky-400">*</span>
                          </label>
                          <select
                            name="project_type"
                            required
                            defaultValue=""
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body cursor-pointer appearance-none bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white"
                          >
                            <option value="" disabled style={{ backgroundColor: '#070C17', color: '#9CA3AF' }}>{t('kontak.projectTypePlaceholder')}</option>
                            {projectOptions.map((opt) => (
                              <option key={opt.key} value={t(opt.key)} style={{ backgroundColor: '#070C17', color: '#CBD5E1' }}>{t(opt.key)}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                            {t('kontak.budget')}
                          </label>
                          <select
                            name="budget"
                            defaultValue=""
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body cursor-pointer appearance-none bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white"
                          >
                            <option value="" disabled style={{ backgroundColor: '#070C17', color: '#9CA3AF' }}>{t('kontak.budgetPlaceholder')}</option>
                            {budgetOptions.map((opt) => (
                              <option key={opt.key} value={t(opt.key)} style={{ backgroundColor: '#070C17', color: '#CBD5E1' }}>{t(opt.key)}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block font-body text-xs mb-1.5 uppercase tracking-wider text-slate-400">
                          {t('kontak.message')} <span className="text-sky-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          maxLength={500}
                          placeholder={t('kontak.messagePlaceholder')}
                          onChange={(e) => setCharCount(e.target.value.length)}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body resize-none bg-[#070C17] border border-slate-700 hover:border-slate-600 focus:border-sky-400/60 text-white placeholder-slate-600"
                        />
                        <div className="flex justify-between mt-1.5">
                          <span className="font-body text-xs text-slate-600">{t('kontak.charLimit')}</span>
                          <span className={`font-body text-xs ${charCount > 480 ? 'text-amber-400' : 'text-slate-600'}`}>
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
      </div>

      {/* Google Maps */}
      <div
        data-preview-id="kontak-maps"
        data-preview-label="Google Maps"
        data-editable-fields="maps_embed_url"
        data-edit-field="maps_embed_url"
      >
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-sky-400" />
            <h2 className="font-syne font-bold text-xl text-white">{t('kontak.mapTitle')}</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border-2 border-sky-400/10" style={{ height: '380px' }}>
            <iframe
              src={settings.maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PT Waringin Mega Mandiri Location"
            />
          </div>
        </div>
      </section>
      </div>

      <footer
        data-preview-id="footer"
        data-editable-fields="footer_logo_url,footer_tagline,footer_copyright"
      >
        <Footer />
      </footer>
    </div>
  );
}