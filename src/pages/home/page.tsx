import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from '@/pages/home/components/HeroSection';
import StatsBar from '@/pages/home/components/StatsBar';
import ServicesSection from '@/pages/home/components/ServicesSection';
import FeaturedProjects from '@/pages/home/components/FeaturedProjects';
import ClientsSection from '@/pages/home/components/ClientsSection';
import CtaSection from '@/pages/home/components/CtaSection';
import { useSiteTheme } from '@/context/SiteThemeContext';

export default function HomePage() {
  const { sections } = useSiteTheme();

  return (
    <div className="bg-[var(--dark-bg)] min-h-screen">
      <div data-preview-id="navbar" data-preview-label="Navbar">
        <Navbar />
      </div>
      <main>
        {sections.hero !== false && (
          <div data-preview-id="hero" data-preview-label="Hero Banner">
            <HeroSection />
          </div>
        )}
        {sections.stats !== false && (
          <div data-preview-id="stats" data-preview-label="Stats Bar">
            <StatsBar />
          </div>
        )}
        {sections.services !== false && (
          <div data-preview-id="services" data-preview-label="Services">
            <ServicesSection />
          </div>
        )}
        {sections.projects !== false && (
          <div data-preview-id="projects" data-preview-label="Featured Projects">
            <FeaturedProjects />
          </div>
        )}
        {sections.clients !== false && (
          <div data-preview-id="clients" data-preview-label="Clients">
            <ClientsSection />
          </div>
        )}
        {sections.cta !== false && (
          <div data-preview-id="cta" data-preview-label="CTA Section">
            <CtaSection />
          </div>
        )}
      </main>
      <div data-preview-id="footer" data-preview-label="Footer">
        <Footer />
      </div>
    </div>
  );
}