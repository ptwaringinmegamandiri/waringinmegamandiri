import { useRef } from 'react';
import { useSiteTheme } from '@/context/SiteThemeContext';
import { useThemeContext } from '@/context/ThemeContext';
import { renderRichText } from '@/lib/richText';

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useSiteTheme();
  const { isDark } = useThemeContext();
  const ctaTitle = theme.cta_title || 'Siap Membangun\nMasa Depan Anda?';
  const ctaDesc = theme.cta_desc || 'Tim ahli kami siap membantu mewujudkan visi konstruksi Anda — mulai dari perencanaan hingga serah terima proyek.';
  const ctaPrimaryText = theme.cta_primary_text || 'Konsultasi Gratis';
  const ctaSecondaryText = theme.cta_secondary_text || 'Telepon Kami';

  // Styling dari theme
  const ctaTitleColor = theme.cta_title_color || (isDark ? '#FFFFFF' : '#0F172A');
  const ctaDescColor = theme.cta_desc_color || (isDark ? '#94A3B8' : '#475569');
  const ctaTitleSize = parseInt(theme.cta_title_size || '42', 10);
  const ctaDescSize = parseInt(theme.cta_desc_size || '18', 10);

  const ctaTitleLines = ctaTitle.split('\n');

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: isDark ? '#070C17' : '#F0F6FF' }}
      data-preview-id="cta-section"
      data-preview-label="Call to Action"
      data-editable-fields="cta_title,cta_desc,cta_primary_text,cta_secondary_text,cta_title_color,cta_desc_color,cta_title_size,cta_desc_size"
      data-edit-field="cta"
    >
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20construction%20blueprint%20digital%20overlay%20holographic%20building%20design%20BIM%20technology%2C%20dark%20background%20with%20glowing%20neon%20blue%20grid%20lines%2C%20abstract%20technical%20engineering%20visualization%2C%20ultra%20modern%20digital%20construction&width=1920&height=600&seq=wmm-cta1&orientation=landscape"
          alt="Construction Technology"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ backgroundColor: isDark ? 'rgba(13,17,23,0.92)' : 'rgba(240,246,255,0.85)' }} />
        <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <span className="section-label block mb-4">HUBUNGI KAMI</span>
          <h2
          className="font-syne font-black mb-6 leading-tight"
          style={{ color: ctaTitleColor, fontSize: `clamp(28px, 5vw, ${ctaTitleSize}px)` }}
        >
          {ctaTitleLines.map((line, i) => (
            <span key={i}>
              {renderRichText(line, { fontSize: ctaTitleSize, lineHeight: '1.2', color: ctaTitleColor }, `cta-title-${i}`)}
              {i < ctaTitleLines.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <div className="flex justify-center mb-8">
          <div className="neon-line-short" />
        </div>
        <p
          className="font-body leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: ctaDescColor, fontSize: `clamp(14px, 2.5vw, ${ctaDescSize}px)` }}
        >
          {renderRichText(ctaDesc, { fontSize: ctaDescSize, lineHeight: '1.75', color: ctaDescColor }, 'cta-desc')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:info@waringinmegamandiri.com"
            className="btn-neon-solid px-10 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            <i className="ri-mail-send-line" />
            {ctaPrimaryText}
          </a>
          <a
            href="tel:+62215738001"
            className="btn-neon px-10 py-4 rounded-lg text-base cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            <i className="ri-phone-line" />
            {ctaSecondaryText}
          </a>
        </div>

        <div className={`mt-14 pt-10 border-t ${isDark ? 'border-sky-400/10' : 'border-blue-200'}`}>
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {[
              { icon: 'ri-verified-badge-line', text: 'ISO 9001:2015 Certified' },
              { icon: 'ri-shield-star-line', text: 'LPJK Terdaftar' },
            ].map((badge) => (
              <div key={badge.text} className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <i className={`${badge.icon} text-xl ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                <span className="font-body font-medium text-sm">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* SBU Gred 7 chips */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-1">
              <i className={`ri-award-line text-base ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
              <span className={`font-syne font-bold text-xs tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDark ? 'border-sky-400/15 bg-sky-400/5' : 'border-blue-200 bg-blue-50'}`}
                >
                  <span className={`font-mono text-[10px] font-bold ${isDark ? 'text-sky-400' : 'text-blue-600'}`}>{s.code}</span>
                  <span className={`font-body text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}