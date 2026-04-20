import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';

interface Article {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  content?: string;
}

interface NewsCardProps {
  article: Article;
  featured?: boolean;
  onClick?: () => void;
}

const categoryColorsDark: Record<string, string> = {
  Proyek: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  Teknologi: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  Perusahaan: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  CSR: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Penghargaan: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Insight: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
};

const categoryColorsLight: Record<string, string> = {
  Proyek: 'text-sky-700 bg-sky-100 border-sky-300',
  Teknologi: 'text-violet-700 bg-violet-100 border-violet-300',
  Perusahaan: 'text-amber-700 bg-amber-100 border-amber-300',
  CSR: 'text-emerald-700 bg-emerald-100 border-emerald-300',
  Penghargaan: 'text-orange-700 bg-orange-100 border-orange-300',
  Insight: 'text-teal-700 bg-teal-100 border-teal-300',
};

export default function NewsCard({ article, featured = false, onClick }: NewsCardProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const colorClass = isDark
    ? (categoryColorsDark[article.category] ?? 'text-sky-400 bg-sky-400/10 border-sky-400/20')
    : (categoryColorsLight[article.category] ?? 'text-sky-700 bg-sky-100 border-sky-300');

  const cardBg = isDark
    ? 'bg-[#111827] border border-slate-800 hover:border-sky-400/30'
    : 'bg-white border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md';

  const titleColor = isDark
    ? 'text-white group-hover:text-sky-300'
    : 'text-slate-900 group-hover:text-blue-600';

  const excerptColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const metaColor = isDark ? 'text-slate-600' : 'text-slate-400';
  const authorColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const dividerColor = isDark ? 'border-slate-800' : 'border-blue-100';
  const readMoreColor = isDark
    ? 'text-sky-400'
    : 'text-blue-600';
  const authorIconBg = isDark ? 'bg-sky-400/20' : 'bg-blue-100';
  const authorIconColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const timeIconColor = isDark ? 'text-sky-400/60' : 'text-blue-400';

  if (featured) {
    return (
      <div
        className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col lg:flex-row ${cardBg}`}
        onClick={onClick}
      >
        <div className="lg:w-[55%] w-full h-56 lg:h-auto overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
                {article.category}
              </span>
              <span className={`text-xs font-body ${metaColor}`}>{article.date}</span>
            </div>
            <h3 className={`font-syne font-bold text-xl leading-snug mb-3 transition-colors ${titleColor}`}>
              {article.title}
            </h3>
            <p className={`text-sm leading-relaxed font-body line-clamp-3 ${excerptColor}`}>
              {article.excerpt}
            </p>
          </div>
          <div className={`flex items-center justify-between mt-5 pt-4 border-t ${dividerColor}`}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${authorIconBg}`}>
                <i className={`ri-user-line text-xs ${authorIconColor}`} />
              </div>
              <span className={`text-xs font-body ${authorColor}`}>{article.author}</span>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-body ${authorColor}`}>
              <i className={`ri-time-line ${timeIconColor}`} /> {article.readTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col ${cardBg}`}
      onClick={onClick}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
            {article.category}
          </span>
          <span className={`text-xs font-body ${metaColor}`}>{article.readTime}</span>
        </div>
        <h3 className={`font-syne font-semibold text-base leading-snug mb-2 transition-colors line-clamp-2 ${titleColor}`}>
          {article.title}
        </h3>
        <p className={`text-xs leading-relaxed font-body line-clamp-2 flex-1 ${excerptColor}`}>
          {article.excerpt}
        </p>
        <div className={`flex items-center justify-between mt-4 pt-3 border-t ${dividerColor}`}>
          <span className={`text-xs font-body ${metaColor}`}>{article.date}</span>
          <span className={`text-xs font-body flex items-center gap-1 group-hover:gap-2 transition-all ${readMoreColor}`}>
            {t('news.bacaSelengkapnya')} <i className="ri-arrow-right-line" />
          </span>
        </div>
      </div>
    </div>
  );
}
