import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HighlightSection from '@/components/HighlightSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HighlightSection />
      </main>
      <Footer />
    </div>
  );
}
