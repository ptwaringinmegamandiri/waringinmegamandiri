import { useEffect } from 'react';
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

interface NewsDetailModalProps {
  article: Article | null;
  onClose: () => void;
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

export default function NewsDetailModal({ article, onClose }: NewsDetailModalProps) {
  const { isDark } = useThemeContext();

  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [article]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!article) return null;

  const colorClass = isDark
    ? (categoryColorsDark[article.category] ?? 'text-sky-400 bg-sky-400/10 border-sky-400/20')
    : (categoryColorsLight[article.category] ?? 'text-sky-700 bg-sky-100 border-sky-300');

  const modalBg = isDark ? 'bg-[#0d1117]' : 'bg-white';
  const overlayBg = 'bg-black/70 backdrop-blur-sm';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const bodyColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const metaColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const dividerColor = isDark ? 'border-slate-800' : 'border-slate-200';
  const closeBtnBg = isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700';
  const tagBg = isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600';
  const authorIconBg = isDark ? 'bg-sky-400/20' : 'bg-blue-100';
  const authorIconColor = isDark ? 'text-sky-400' : 'text-blue-600';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 ${overlayBg}`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl ${modalBg} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${closeBtnBg}`}
        >
          <i className="ri-close-line text-lg" />
        </button>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Content */}
        <div className="p-7 md:p-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
              {article.category}
            </span>
            <span className={`text-xs font-body flex items-center gap-1 ${metaColor}`}>
              <i className="ri-calendar-line" /> {article.date}
            </span>
            <span className={`text-xs font-body flex items-center gap-1 ${metaColor}`}>
              <i className="ri-time-line" /> {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className={`font-syne font-bold text-2xl md:text-3xl leading-snug mb-5 ${titleColor}`}>
            {article.title}
          </h2>

          {/* Author */}
          <div className={`flex items-center gap-3 pb-6 border-b ${dividerColor}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${authorIconBg}`}>
              <i className={`ri-user-line text-sm ${authorIconColor}`} />
            </div>
            <div>
              <p className={`text-sm font-body font-medium ${titleColor}`}>{article.author}</p>
              <p className={`text-xs font-body ${metaColor}`}>PT Waringin Mega Mandiri</p>
            </div>
          </div>

          {/* Article Body */}
          <div className={`mt-6 space-y-4 font-body text-sm leading-relaxed ${bodyColor}`}>
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <>
                <p className="text-base leading-relaxed">{article.excerpt}</p>
                <p>
                  PT Waringin Mega Mandiri (WMM) terus membuktikan komitmennya sebagai kontraktor konstruksi terpercaya di Indonesia. Dengan pengalaman lebih dari 16 tahun dan portofolio lebih dari 77 proyek senilai Rp 3,5 triliun, WMM konsisten menghadirkan hasil terbaik untuk setiap klien.
                </p>
                <p>
                  Dalam setiap proyek yang dikerjakan, WMM mengedepankan standar kualitas internasional yang tercermin dari sertifikasi ISO 9001:2015, SBU, dan keanggotaan aktif di LPJK. Tim profesional WMM yang berpengalaman memastikan setiap tahapan konstruksi berjalan sesuai jadwal, anggaran, dan spesifikasi teknis yang telah disepakati.
                </p>
                <p>
                  Keberhasilan WMM dalam menangani proyek-proyek berskala besar tidak lepas dari sistem manajemen proyek yang terstruktur, penggunaan teknologi konstruksi terkini, serta sumber daya manusia yang kompeten dan berdedikasi tinggi.
                </p>
                <p>
                  Ke depannya, WMM berkomitmen untuk terus berinovasi dan meningkatkan kapasitas dalam menghadapi tantangan industri konstruksi yang semakin kompetitif, sekaligus menjaga kepercayaan para mitra dan klien yang telah terjalin selama bertahun-tahun.
                </p>
              </>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className={`mt-8 pt-6 border-t ${dividerColor}`}>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className={`text-xs font-body px-3 py-1 rounded-full ${tagBg}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
