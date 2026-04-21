import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

export default function CtaSection() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        {isDark ? (
          <img
            src="https://readdy.ai/api/search-image?query=futuristic%20construction%20blueprint%20digital%20overlay%20holographic%20building%20design%20BIM%20technology%2C%20dark%20background%20with%20glowing%20neon%20blue%20grid%20lines%2C%20abstract%20technical%20engineering%20visualization%2C%20ultra%20modern%20digital%20construction&width=1920&height=600&seq=wmm-cta1&orientation=landscape"
            alt="Construction Technology"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <img
            src="https://readdy.ai/api/search-image?query=bright%20modern%20architectural%20office%20with%20engineers%20reviewing%20building%20blueprints%20on%20large%20table%2C%20natural%20daylight%20through%20floor%20to%20ceiling%20windows%2C%20clean%20white%20interior%2C%20professional%20construction%20planning%20meeting%2C%20sharp%20focus%2C%20vibrant%20and%20optimistic%20atmosphere%2C%20high%20resolution%20photography&width=1920&height=600&seq=wmm-cta-light-v1&orientation=landscape"
            alt="Construction Technology"
            className="w-full h-full object-cover object-top"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: isDark ? 'rgba(13,17,23,0.92)' : 'rgba(240,246,255,0.90)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-15" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <span className="section-label block mb-4">{t('cta.label')}</span>
        <h2
          className="font-syne font-black text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight"
          style={{ color: isDark ? '#ffffff' : '#0F172A' }}
        >
          {t('cta.title1')}{' '}
          <br className="hidden md:block" />
          <span
            style={{
              background: isDark
                ? 'linear-gradient(90deg, #38BDF8, #7DD3FC)'
                : 'linear-gradient(90deg, #1D4ED8, #2563EB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('cta.title2')}
          </span>
        </h2>
        <div className="flex justify-center mb-8"><div className="neon-line-short" /></div>
        <p
          className="font-body text-base leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: isDark ? '#94A3B8' : '#4B5563' }}
        >
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:info@waringinmegamandiri.com"
            className="btn-neon-solid px-10 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            <i className="ri-mail-send-line" />{t('cta.konsultasi')}
          </a>
          <a
            href="tel:+62215738001"
            className="btn-neon px-10 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            <i className="ri-phone-line" />{t('cta.telepon')}
          </a>
        </div>
        <div
          className="mt-14 pt-10 border-t"
          style={{ borderColor: isDark ? 'rgba(56,189,248,0.10)' : 'rgba(37,99,235,0.12)' }}
        >
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {[
              { icon: 'ri-verified-badge-line', key: 'badge.iso' },
              { icon: 'ri-shield-star-line', key: 'badge.lpjk' },
            ].map((badge) => (
              <div
                key={badge.key}
                className="flex items-center gap-2"
                style={{ color: isDark ? '#94A3B8' : '#4B5563' }}
              >
                <i
                  className={`${badge.icon} text-xl`}
                  style={{ color: isDark ? '#38BDF8' : '#2563EB' }}
                />
                <span className="font-body font-medium text-sm">{t(badge.key)}</span>
              </div>
            ))}
          </div>

          {/* SBU Gred 7 cards */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-1">
              <i
                className="ri-award-line text-base"
                style={{ color: isDark ? '#38BDF8' : '#2563EB' }}
              />
              <span
                className="font-syne font-bold text-xs tracking-widest uppercase"
                style={{ color: isDark ? '#94A3B8' : '#4B5563' }}
              >
                Sertifikasi SBU — Bidang Usaha
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { code: '41011', label: 'Gedung Hunian' },
                { code: '41012', label: 'Gedung Perkantoran' },
                { code: '41013', label: 'Gedung Industri' },
                { code: '41014', label: 'Gedung Perbelanjaan' },
                { code: '41015', label: 'Gedung Kesehatan' },
                { code: '41017', label: 'Gedung Penginapan' },
                { code: '41019', label: 'Tempat Ibadah' },
              ].map((s) => (
                <div
                  key={s.code}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                  style={{
                    borderColor: isDark ? 'rgba(56,189,248,0.18)' : 'rgba(37,99,235,0.18)',
                    backgroundColor: isDark ? 'rgba(56,189,248,0.05)' : 'rgba(37,99,235,0.05)',
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: isDark ? '#38BDF8' : '#2563EB' }}
                  >
                    {s.code}
                  </span>
                  <span
                    className="font-body text-xs"
                    style={{ color: isDark ? '#94A3B8' : '#4B5563' }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
