import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';

export default function StatsBar() {
  const { theme } = useSiteTheme();
  const { isDark } = useThemeContext();
  const statsText = (theme.stats_text || '35+ tahun pengalaman di bidang konstruksi').replace('BUILT TO PERFECTION', 'BUILD TO PERFECTION');

  return (
    <section
      className="relative z-20 py-12"
      data-preview-id="stats-bar"
      data-preview-label="Stats Bar"
      data-editable-fields="stats_text"
      data-edit-field="stats"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className={`font-syne font-bold text-xl md:text-2xl lg:text-3xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {statsText}
        </p>
      </div>
    </section>
  );
}