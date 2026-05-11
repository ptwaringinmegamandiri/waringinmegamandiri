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
      <div data-preview-id="navbar" data-preview-label="Navbar">
        <Navbar />
      </div>
      <main>
        <div data-preview-id="about-hero" data-preview-label="About Hero">
          <HeroBanner
            title={t('about.title')}
            subtitle={t('about.subtitle')}
            breadcrumb={t('about.breadcrumb')}
          />
        </div>
        <div data-preview-id="about-profile" data-preview-label="Company Profile">
          <CompanyProfile />
        </div>
        <div data-preview-id="about-vision" data-preview-label="Vision & Mission">
          <VisionMission />
        </div>
        <div data-preview-id="about-values" data-preview-label="Company Values">
          <CompanyValues />
        </div>
        <div data-preview-id="about-team" data-preview-label="Team Section">
          <TeamSection />
        </div>
      </main>
      <div data-preview-id="footer" data-preview-label="Footer">
        <Footer />
      </div>
    </div>
  );
}
