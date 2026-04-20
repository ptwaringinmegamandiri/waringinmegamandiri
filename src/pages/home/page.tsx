import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from '@/pages/home/components/HeroSection';
import ServicesSection from '@/pages/home/components/ServicesSection';
import FeaturedProjects from '@/pages/home/components/FeaturedProjects';
import ClientsSection from '@/pages/home/components/ClientsSection';
import CtaSection from '@/pages/home/components/CtaSection';

export default function HomePage() {
  return (
    <div className="bg-[var(--dark-bg)] min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturedProjects />
        <ClientsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
