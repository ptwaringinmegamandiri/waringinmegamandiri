import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';
import { companyValues } from '@/mocks/team';


export default function CompanyValues() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const sectionBg = isDark ? 'bg-[#060A10]' : 'bg-[#F0F6FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const accentColor = isDark ? '#60A5FA' : '#1D4ED8';
  const accentEnd = isDark ? '#BAD9FF' : '#3B82F6';
  const cardBg = isDark
    ? 'bg-gradient-to-b from-[#0D1628] to-[#0B1424]'
    : 'bg-white border-2 border-blue-200 shadow-sm hover:shadow-md';
  const cardTitleColor = isDark ? 'text-white' : 'text-slate-800';
  const cardDescColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const iconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const iconGlowBg = isDark ? 'rgba(0,180,255,0.15)' : 'rgba(37,99,235,0.10)';

  return (
    <section className={`py-20 relative overflow-hidden ${sectionBg}`}>
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">{t('values.label')}</span>
          <h2 className={`font-syne font-bold text-3xl md:text-4xl ${titleColor}`}>
            {t('values.title')}{' '}
            <span
              style={{
                background: `linear-gradient(90deg, ${accentColor}, ${accentEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('values.highlight')}
            </span>
          </h2>
          <div className="flex justify-center mt-4">
            <div className="neon-line-short" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValues.map((val, idx) => (
            <div
              key={val.id}
              className={`rounded-xl p-8 text-center group hover:scale-105 transition-all duration-300 cursor-default ${cardBg}`}
            >
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5 relative">
                <div
                  className="absolute inset-0 rounded-full transition-opacity group-hover:opacity-60"
                  style={{ background: `rgba(${isDark ? '0,180,255' : '37,99,235'},${0.12 + idx * 0.04})`, opacity: 0.2 }}
                />
                <i
                  className={`${val.icon} text-3xl ${iconColor}`}
                  style={{ filter: `drop-shadow(0 0 8px ${iconGlowBg})` }}
                />
              </div>
              <h3 className={`font-syne font-bold text-base mb-3 ${cardTitleColor}`}>
                {t(`value.${val.id}.title`)}
              </h3>
              <p className={`font-body text-sm leading-relaxed ${cardDescColor}`}>
                {t(`value.${val.id}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
