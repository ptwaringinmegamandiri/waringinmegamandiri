import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import NewsCard from '@/pages/news/components/NewsCard';
import NewsDetailModal from '@/pages/news/components/NewsDetailModal';
import { useNews } from '@/hooks/useNews';
import type { NewsArticle } from '@/hooks/useNews';
import { newsCategories } from '@/mocks/news';
import { useSiteTheme } from '@/context/SiteThemeContext';

const DEFAULT_NEWS_BG = 'https://readdy.ai/api/search-image?query=dark%20modern%20cityscape%20at%20night%20with%20construction%20cranes%20and%20skyscrapers%20under%20construction%2C%20dramatic%20moody%20atmosphere%20with%20warm%20amber%20lighting%20from%20building%20windows%2C%20cinematic%20urban%20photography%2C%20deep%20shadows%20and%20atmospheric%20fog%2C%20no%20blue%20tones%2C%20professional%20architectural%20night%20shot&width=1920&height=700&seq=wmm-news-dark-v1&orientation=landscape';

export default function NewsPage() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();
  const { articles, loading } = useNews();
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const bgImage = theme.news_bg_url || DEFAULT_NEWS_BG;

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

  return (
    <div className="min-h-screen bg-[var(--dark-bg)]">
      <div data-preview-id="navbar" data-preview-label="Navbar" data-editable-fields="navbar_brand_text,navbar_cta_text">
        <Navbar />
      </div>

      <main className="flex-1">
        {/* Hero */}
        <div data-preview-id="news-hero" data-preview-label="News Hero" data-editable-fields="news_title,news_subtitle">
          <section className="relative pt-36 pb-16 overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={bgImage}
                alt="News PT Waringin Mega Mandiri"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#070C17]/80 via-[#070C17]/70 to-[#070C17]" />
            </div>
            <div className="absolute inset-0 grid-pattern-sm opacity-20 pointer-events-none" />
            <div
              className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: 'rgba(14,165,233,0.05)' }}
            />

            <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
              <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 border-sky-400/20 bg-sky-400/5">
                <i className="ri-newspaper-line text-sm text-sky-400" />
                <span className="text-xs font-body font-medium tracking-widest uppercase text-sky-400">{t('news.badge')}</span>
              </div>

              <h1 className="font-syne font-bold text-4xl md:text-5xl leading-tight mb-4 text-white">
                {theme.news_title || t('news.title1')}{' '}
                <span className="text-sky-400">{t('news.title2')}</span>
              </h1>
              <p className="font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-slate-400">
                {theme.news_subtitle || t('news.subtitle')}
              </p>
            </div>
          </section>
        </div>

        {/* Featured Articles */}
        {activeCategory === 'all' && featured.length > 0 && (
          <div data-preview-id="news-featured" data-preview-label="Featured Articles">
            <section className="pb-8">
              <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-5 rounded-full bg-sky-400" />
                  <h2 className="font-syne font-bold text-lg text-white">{t('news.artikelPilihan')}</h2>
                </div>
                <div className="space-y-5">
                  {featured.map((article) => (
                    <NewsCard key={article.id} article={article} featured onClick={() => setSelectedArticle(article)} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* All Articles */}
        <div data-preview-id="news-grid" data-preview-label="News Grid">
          <section className="py-12 border-t border-slate-800/60">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      activeCategory === cat.key
                        ? 'bg-sky-400/15 border-sky-400/50 text-sky-300'
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
                <span className="ml-auto text-xs font-body self-center hidden sm:block text-slate-500">
                  {filtered.length} {t('news.artikel')}
                </span>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-slate-800/50">
                      <div className="w-full h-48 bg-slate-700/60" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 w-20 rounded-full bg-slate-700" />
                        <div className="h-4 w-full rounded bg-slate-700" />
                        <div className="h-4 w-3/4 rounded bg-slate-700" />
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
                        <i className="ri-newspaper-line text-4xl mb-3 block text-slate-700" />
                        <p className="font-body text-slate-500">{t('news.tidakAda')}</p>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Newsletter */}
        <div data-preview-id="news-newsletter" data-preview-label="Newsletter" data-editable-fields="news_newsletter_title,news_newsletter_desc">
          <section className="py-20 border-t border-slate-800/60">
            <div className="max-w-2xl mx-auto px-6 lg:px-10 text-center">
              <div className="rounded-3xl p-10 card-surface">
                <div className="w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-5 bg-sky-400/10 border border-sky-400/20">
                  <i className="ri-mail-send-line text-2xl text-sky-400" />
                </div>
                <h3 className="font-syne font-bold text-2xl mb-3 text-white">
                  {theme.news_newsletter_title || t('news.newsletterTitle')}
                </h3>
                <p className="font-body text-sm leading-relaxed max-w-sm mx-auto mb-7 text-slate-400">
                  {theme.news_newsletter_desc || t('news.newsletterSubtitle')}
                </p>

                {subscribed ? (
                  <div className="flex items-center justify-center gap-2 font-body font-medium text-emerald-400">
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
                      className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors font-body bg-[var(--dark-bg)] border border-slate-700 text-white placeholder-slate-500 focus:border-sky-400/60"
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
        </div>
      </main>

      <footer
        data-preview-id="footer"
        data-editable-fields="footer_logo_url,footer_tagline,footer_copyright"
      >
        <Footer />
      </footer>

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}