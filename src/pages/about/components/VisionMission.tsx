import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

export default function VisionMission() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const misiItems = ['vm.misi1', 'vm.misi2', 'vm.misi3'];

  const sectionBg = isDark ? 'bg-[#0A0E14]' : 'bg-[#EEF4FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const accentColor = isDark ? '#60A5FA' : '#1D4ED8';
  const accentEnd = isDark ? '#BAD9FF' : '#3B82F6';
  const cardBg = isDark
    ? 'bg-gradient-to-br from-[#0D1628] to-[#0B1424]'
    : 'bg-white border-2 border-blue-200 shadow-sm';
  const topLine = isDark
    ? 'bg-gradient-to-r from-sky-500 to-sky-300'
    : 'bg-gradient-to-r from-blue-600 to-blue-400';
  const iconBg = isDark ? 'bg-sky-400/10 border-sky-400/30' : 'bg-blue-50 border-blue-200';
  const iconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const cardTitleColor = isDark ? 'text-white' : 'text-slate-900';
  const quoteColor = isDark ? 'text-slate-200' : 'text-slate-800';
  const quoteBorder = isDark ? 'border-sky-400' : 'border-blue-600';
  const misiTextColor = isDark ? 'text-slate-400' : 'text-slate-900';
  const misiNumBg = isDark ? 'bg-sky-400/15 text-sky-400' : 'bg-blue-600 text-white';

  return (
    <section className={`py-20 relative overflow-hidden ${sectionBg}`}>
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">{t('vm.label')}</span>
          <h2 className={`font-syne font-bold text-3xl md:text-4xl ${titleColor}`}>
            {t('vm.title')}{' '}
            <span
              style={{
                background: `linear-gradient(90deg, ${accentColor}, ${accentEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('vm.highlight')}
            </span>
          </h2>
          <div className="flex justify-center mt-4">
            <div className="neon-line-short" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visi */}
          <div className={`relative rounded-xl p-8 overflow-hidden group ${cardBg}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${topLine}`} />
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle, ${isDark ? '#3B82F6' : '#2563EB'}, transparent)` }}
            />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 flex items-center justify-center border rounded-xl ${iconBg}`}>
                <i className={`ri-eye-line text-2xl ${iconColor}`} />
              </div>
              <h3 className={`font-syne font-bold text-xl ${cardTitleColor}`}>{t('vm.visi')}</h3>
            </div>

            <blockquote className={`font-body text-lg leading-relaxed italic border-l-2 pl-5 ${quoteColor} ${quoteBorder}`}>
              &ldquo;{t('vm.visiQuote')}&rdquo;
            </blockquote>
          </div>

          {/* Misi */}
          <div className={`relative rounded-xl p-8 overflow-hidden group ${cardBg}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${topLine}`} />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 flex items-center justify-center border rounded-xl ${iconBg}`}>
                <i className={`ri-focus-3-line text-2xl ${iconColor}`} />
              </div>
              <h3 className={`font-syne font-bold text-xl ${cardTitleColor}`}>{t('vm.misi')}</h3>
            </div>

            <ul className="space-y-4">
              {misiItems.map((key, idx) => (
                <li key={key} className={`flex items-start gap-3 font-body text-sm leading-relaxed ${misiTextColor}`}>
                  <span className={`w-5 h-5 flex items-center justify-center shrink-0 rounded font-syne font-bold text-xs mt-0.5 ${misiNumBg}`}>
                    {idx + 1}
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
