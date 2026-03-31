'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HighlightSection from '@/components/HighlightSection';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      setIsRedirecting(true);
      // Determine redirection path based on user data
      // Check if user object has the nested userData or is direct
      const userData = user?.userData || user;
      
      if (userData?.schoolSlug) {
        router.replace(`/school/${userData.schoolSlug}`);
      } else {
        router.replace('/create-school');
      }
    }
  }, [mounted, isLoggedIn, user, router]);

  // Prevent flash of content for logged-in users
  if (!mounted || (isLoggedIn && isRedirecting)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

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
