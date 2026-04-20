import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@/context/ThemeContext';
import { teamMembers } from '@/mocks/team';

const founderIds = [1, 2];
const managementIds = [3, 4];

interface MemberCardProps {
  member: typeof teamMembers[0];
  isDark: boolean;
}

function MemberCard({ member, isDark }: MemberCardProps) {
  const cardBg = isDark ? '#0D1628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(56,189,248,0.15)' : 'rgba(147,197,253,0.6)';
  const nameColor = isDark ? 'text-white' : 'text-slate-800';
  const positionColor = isDark ? 'text-sky-400' : 'text-blue-600';
  const positionBg = isDark ? 'bg-sky-400/10 border-sky-400/20' : 'bg-blue-50 border-blue-200';
  const descColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const dividerColor = isDark ? 'bg-sky-400/20' : 'bg-blue-100';
  const iconColor = isDark ? 'text-sky-400/40' : 'text-blue-200';

  return (
    <div
      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{ border: `1px solid ${cardBorder}`, background: cardBg }}
    >
      {/* Photo */}
      <div
        className="relative shrink-0 w-full aspect-[3/4] sm:w-40 md:w-44 sm:aspect-[3/4] overflow-hidden"
        style={{ background: isDark ? '#0D1628' : '#e8eef8' }}
      >
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover object-top scale-125 origin-top"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center flex-1 px-5 sm:px-6 py-5 sm:py-6 relative">
        <i className={`ri-double-quotes-l absolute top-3 right-4 text-3xl ${iconColor}`} />

        <span className={`inline-flex items-center self-start gap-1.5 text-xs font-body font-semibold tracking-widest uppercase px-3 py-1 rounded-full border mb-3 ${positionBg} ${positionColor}`}>
          <i className="ri-briefcase-3-line text-xs" />
          {member.position}
        </span>

        <h4 className={`font-syne font-bold text-lg sm:text-xl leading-tight mb-2 ${nameColor}`}>
          {member.name}
        </h4>

        <div className={`w-10 h-0.5 rounded-full mb-3 ${dividerColor}`} />

        <p className={`font-body text-sm leading-relaxed ${descColor}`}>
          {member.description}
        </p>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  const sectionBg = isDark ? 'bg-[#060A10]' : 'bg-[#EEF4FF]';
  const titleColor = isDark ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const accentColor = isDark ? '#60A5FA' : '#1D4ED8';
  const accentEnd = isDark ? '#BAD9FF' : '#3B82F6';
  const groupLabelColor = isDark ? 'text-white' : 'text-slate-800';
  const groupAccentBar = isDark ? 'bg-sky-400' : 'bg-blue-600';
  const groupDivider = isDark ? 'border-sky-400/10' : 'border-blue-100';
  const groupBadgeBg = isDark ? 'bg-sky-400/10 text-sky-400 border-sky-400/20' : 'bg-blue-50 text-blue-700 border-blue-200';

  const founders = teamMembers.filter((m) => founderIds.includes(m.id));
  const management = teamMembers.filter((m) => managementIds.includes(m.id));

  return (
    <section className={`py-20 relative overflow-hidden ${sectionBg}`}>
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="section-label block mb-3">{t('team.label')}</span>
          <h2 className={`font-syne font-bold text-3xl md:text-4xl ${titleColor}`}>
            {t('team.title')}{' '}
            <span style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('team.highlight')}
            </span>
          </h2>
          <div className="flex justify-center mt-4"><div className="neon-line-short" /></div>
          <p className={`font-body text-base mt-4 max-w-xl mx-auto ${subtitleColor}`}>{t('team.subtitle')}</p>
        </div>

        {/* Pendiri Perusahaan */}
        <div className="mb-12">
          <div className={`flex items-center gap-3 mb-7 pb-4 border-b ${groupDivider}`}>
            <div className={`w-1 h-6 rounded-full shrink-0 ${groupAccentBar}`} />
            <h3 className={`font-syne font-bold text-xl ${groupLabelColor}`}>{t('team.pendiri')}</h3>
            <span className={`ml-2 text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${groupBadgeBg}`}>
              {founders.length} {t('team.orang')}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {founders.map((member) => (
              <MemberCard key={member.id} member={{ ...member, position: t(`team.pos.${member.id <= 2 ? 'pemegang' : member.id === 3 ? 'komisaris' : 'direktur'}`), description: t(`team.desc.${member.id}`) }} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Dewan Direksi */}
        <div>
          <div className={`flex items-center gap-3 mb-7 pb-4 border-b ${groupDivider}`}>
            <div className={`w-1 h-6 rounded-full shrink-0 ${groupAccentBar}`} />
            <h3 className={`font-syne font-bold text-xl ${groupLabelColor}`}>{t('team.direksi')}</h3>
            <span className={`ml-2 text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${groupBadgeBg}`}>
              {management.length} {t('team.orang')}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {management.map((member) => (
              <MemberCard key={member.id} member={{ ...member, position: t(`team.pos.${member.id <= 2 ? 'pemegang' : member.id === 3 ? 'komisaris' : 'direktur'}`), description: t(`team.desc.${member.id}`) }} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
