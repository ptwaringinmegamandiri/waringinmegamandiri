import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { milestones } from '@/mocks/team';

export default function Timeline() {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#0A0E14] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">{t('about.perjalanan')}</span>
          <h2 className="font-orbitron font-bold text-white text-3xl md:text-4xl">
            {t('about.historyMilestone')}
          </h2>
          <div className="flex justify-center mt-4">
            <div className="neon-line-short" />
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,180,255,0.5), transparent)' }}
          />

          <div className="space-y-8">
            {milestones.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              const isActive = active === idx;

              return (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  onClick={() => setActive(isActive ? null : idx)}
                >
                  <div className={`flex-1 md:w-[calc(50%-2rem)] pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className={`glow-border bg-gradient-to-br from-[#111827] to-[#0F1520] rounded-lg p-5 cursor-pointer transition-all duration-300 ${isActive ? 'border-neon/60' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                        <span className="font-orbitron font-black text-xl text-neon" style={{ textShadow: '0 0 10px rgba(0,180,255,0.5)' }}>
                          {m.year}
                        </span>
                        <i className={`ri-arrow-down-s-line text-neon transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                      </div>
                      <p className="font-rajdhani text-gray-400 text-sm leading-relaxed">{t(`milestone.${m.year}`)}</p>
                    </div>
                  </div>

                  <div className="absolute left-6 md:left-1/2 top-5 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-neon border-neon scale-125' : 'bg-[#0A0E14] border-neon/50'}`}
                      style={isActive ? { boxShadow: '0 0 12px rgba(0,180,255,0.8)' } : {}}
                    />
                  </div>

                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
