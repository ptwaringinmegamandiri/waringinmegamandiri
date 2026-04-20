import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroBanner from '@/pages/about/components/HeroBanner';
import CompanyProfile from '@/pages/about/components/CompanyProfile';
import VisionMission from '@/pages/about/components/VisionMission';
import CompanyValues from '@/pages/about/components/CompanyValues';
import TeamSection from '@/pages/about/components/TeamSection';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--dark-bg)] min-h-screen">
      <Navbar />
      <main>
        <HeroBanner
          title={t('about.title')}
          subtitle={t('about.subtitle')}
          breadcrumb={t('about.breadcrumb')}
        />
        <CompanyProfile />
        <VisionMission />
        <CompanyValues />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
