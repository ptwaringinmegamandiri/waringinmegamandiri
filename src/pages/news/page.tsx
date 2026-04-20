import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import NewsCard from '@/pages/news/components/NewsCard';
import NewsDetailModal from '@/pages/news/components/NewsDetailModal';
import { useThemeContext } from '@/context/ThemeContext';
import { useNews } from '@/hooks/useNews';
import type { NewsArticle } from '@/hooks/useNews';
import { newsCategories } from '@/mocks/news';

export default function NewsPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();
  const { articles, loading } = useNews();
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const allLabel = t('news.semua');

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const featured = articles.filter((a) => a.featured);
  const displayArticles = activeCategory === 'all' ? articles.filter((a) => !a.featured) : filtered;

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || subLoading) return;
    setSubLoading(true);
    const params = new URLSearchParams();
    params.append('email', email);
    try {
      await fetch('https://readdy.ai/api/form/d76eajjq7u9ee9hcedsg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setSubLoading(false);
    }
  };

  const categories = [{ key: 'all', label: allLabel }, ...newsCategories.map((c) => ({ key: c, label: c }))];

  // Theme styles
  const pageBg = isDark ? 'bg-[var(--dark-bg)]' : 'bg-[#F0F6FF]';
  const heroBadgeBorder = isDark ? 'border-sky-400/20 bg-sky-400/5' : 'border-blue-300 bg-blue-50';
  const heroBadgeText = isDark ? 'text-sky-400' : 'text-blue-700';
  const heroTitle = isDark ? 'text-white' : 'text-slate-900';
  const heroAccent = isDark ? 'text-sky-400' : 'text-blue-700';
  const heroSub = isDark ? 'text-slate-400' : 'text-slate-600';
  const featuredAccentBar = isDark ? 'bg-sky-400' : 'bg-blue-600';
  const featuredTitle = isDark ? 'text-white' : 'text-slate-900';
  const sectionBorder = isDark ? 'border-slate-800/60' : 'border-blue-100';
  const catActive = isDark
    ? 'bg-sky-400/15 border-sky-400/50 text-sky-300'
    : 'bg-blue-600 border-blue-600 text-white';
  const catInactive = isDark
    ? 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
    : 'bg-white border-blue-200 text-slate-600 hover:border-blue-400 hover:text-slate-900';
  const countText = isDark ? 'text-slate-500' : 'text-slate-500';
  const emptyIcon = isDark ? 'text-slate-700' : 'text-blue-200';
  const emptyText = isDark ? 'text-slate-500' : 'text-slate-500';
  const newsletterCardBg = isDark ? 'card-surface' : 'bg-white border-2 border-blue-200 shadow-sm';
  const newsletterIconBg = isDark ? 'bg-sky-400/10 border border-sky-400/20' : 'bg-blue-100 border border-blue-300';
  const newsletterIconColor = isDark ? 'text-sky-400' : 'text-blue-700';
  const newsletterTitle = isDark ? 'text-white' : 'text-slate-900';
  const newsletterSub = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark
    ? 'bg-[var(--dark-bg)] border border-slate-700 text-white placeholder-slate-500 focus:border-sky-400/60'
    : 'bg-white border-2 border-blue-200 text-slate-900 placeholder-slate-400 focus:border-blue-500';
  const subscribedColor = isDark ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern-sm opacity-20 pointer-events-none" />
        <div
          className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.04)' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 ${heroBadgeBorder}`}>
            <i className={`ri-newspaper-line text-sm ${heroBadgeText}`} />
            <span className={`text-xs font-body font-medium tracking-widest uppercase ${heroBadgeText}`}>{t('news.badge')}</span>
          </div>

          <h1 className={`font-syne font-bold text-4xl md:text-5xl leading-tight mb-4 ${heroTitle}`}>
            {t('news.title1')}{' '}
            <span className={heroAccent}>{t('news.title2')}</span>
          </h1>
          <p className={`font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${heroSub}`}>
            {t('news.subtitle')}
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {activeCategory === 'all' && featured.length > 0 && (
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-1 h-5 rounded-full ${featuredAccentBar}`} />
              <h2 className={`font-syne font-bold text-lg ${featuredTitle}`}>{t('news.artikelPilihan')}</h2>
            </div>
            <div className="space-y-5">
              {featured.map((article) => (
                <NewsCard key={article.id} article={article} featured onClick={() => setSelectedArticle(article)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className={`py-12 border-t ${sectionBorder}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.key ? catActive : catInactive
                }`}
              >
                {cat.label}
              </button>
            ))}
            <span className={`ml-auto text-xs font-body self-center hidden sm:block ${countText}`}>
              {filtered.length} {t('news.artikel')}
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <div className={`w-full h-48 ${isDark ? 'bg-slate-700/60' : 'bg-slate-200'}`} />
                  <div className="p-5 space-y-3">
                    <div className={`h-3 w-20 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-4 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Grid */}
              {displayArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayArticles.map((article) => (
                    <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                  ))}
                </div>
              ) : (
                activeCategory !== 'all' && filtered.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((article) => (
                      <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <i className={`ri-newspaper-line text-4xl mb-3 block ${emptyIcon}`} />
                    <p className={`font-body ${emptyText}`}>{t('news.tidakAda')}</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-20 border-t ${sectionBorder}`}>
        <div className="max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <div className={`rounded-3xl p-10 ${newsletterCardBg}`}>
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-5 ${newsletterIconBg}`}>
              <i className={`ri-mail-send-line text-2xl ${newsletterIconColor}`} />
            </div>
            <h3 className={`font-syne font-bold text-2xl mb-3 ${newsletterTitle}`}>
              {t('news.newsletterTitle')}
            </h3>
            <p className={`font-body text-sm leading-relaxed max-w-sm mx-auto mb-7 ${newsletterSub}`}>
              {t('news.newsletterSubtitle')}
            </p>

            {subscribed ? (
              <div className={`flex items-center justify-center gap-2 font-body font-medium ${subscribedColor}`}>
                <i className="ri-checkbox-circle-line text-xl" />
                <span>{t('news.subscribed')}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                data-readdy-form
                id="newsletter-form"
                className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('news.placeholder')}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body ${inputBg}`}
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="btn-neon-solid px-6 py-3 rounded-xl font-body font-semibold text-sm whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  {subLoading ? <i className="ri-loader-4-line animate-spin" /> : t('news.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
