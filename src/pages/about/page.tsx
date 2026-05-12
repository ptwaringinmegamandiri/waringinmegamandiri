import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroBanner from '@/pages/about/components/HeroBanner';
import CompanyProfile from '@/pages/about/components/CompanyProfile';
import VisionMission from '@/pages/about/components/VisionMission';
import CompanyValues from '@/pages/about/components/CompanyValues';
import TeamSection from '@/pages/about/components/TeamSection';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function AboutPage() {
  const { t } = useTranslation();
  const { theme } = useSiteTheme();
  return (
    <div className="bg-[var(--dark-bg)] min-h-screen">
      <div data-preview-id="navbar" data-preview-label="Navbar" data-editable-fields="navbar_brand_text,navbar_cta_text">
        <Navbar />
      </div>
      <main className="flex-1">
        <div data-preview-id="about-hero" data-preview-label="About Hero" data-editable-fields="about_title,about_subtitle">
          <HeroBanner
            title={theme.about_title || t('about.heroTitle')}
            subtitle={theme.about_subtitle || t('about.heroSubtitle')}
            breadcrumb={t('about.breadcrumb')}
            bgImageUrl={theme.about_bg_url}
          />
        </div>
        <div data-preview-id="about-profile" data-preview-label="Company Profile" data-editable-fields="about_profile_text">
          <CompanyProfile />
        </div>
        <div data-preview-id="about-vision" data-preview-label="Vision & Mission" data-editable-fields="about_vision,about_mission">
          <VisionMission />
        </div>
        <div data-preview-id="about-values" data-preview-label="Company Values">
          <CompanyValues />
        </div>
        <div data-preview-id="about-team" data-preview-label="Team Section">
          <TeamSection />
        </div>
      </main>
      <footer data-preview-id="footer" data-preview-label="Footer" data-editable-fields="footer_logo_url,footer_tagline,footer_copyright">
        <Footer />
      </footer>
    </div>
  );
}