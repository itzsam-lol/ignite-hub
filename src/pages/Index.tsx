import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import EventsSection from '@/components/sections/EventsSection';
import TeamSection from '@/components/sections/TeamSection';
import AppSection from '@/components/sections/AppSection';
import CollaborationsSection from '@/components/sections/CollaborationsSection';
import Footer from '@/components/Footer';

// Lazy load 3D background for performance
const Logo3DBackground = lazy(() => import('@/components/Logo3DBackground'));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* 3D Background - lazy loaded */}
      <Suspense fallback={null}>
        <Logo3DBackground />
      </Suspense>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <AppSection />
        <CollaborationsSection />
      </main>

      {/* Footer */}
      <footer className="relative z-20 pointer-events-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
