import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import EventsSection from '@/components/sections/EventsSection';
import AppSection from '@/components/sections/AppSection';
import CollaborationsSection from '@/components/sections/CollaborationsSection';
import Footer from '@/components/Footer';

// Lazy load 3D background for performance
const Logo3DBackground = lazy(() => import('@/components/Logo3DBackground'));

const Index = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Ignite Room - Student-Led Technology Community | Learn, Build, Innovate</title>
        <meta 
          name="description" 
          content="Join Ignite Room, a vibrant student-led technology community empowering learners, innovators, and builders. Discover events, workshops, and collaboration opportunities." 
        />
        <meta name="keywords" content="Ignite Room, student community, technology, innovation, workshops, events, coding, learning" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Ignite Room - Student-Led Technology Community" />
        <meta property="og:description" content="Empowering learners, innovators, and builders through technology and community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ignite-room.com" />
        <meta property="og:image" content="https://ignite-room.com/og-image.jpg" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ignite Room - Student-Led Technology Community" />
        <meta name="twitter:description" content="Empowering learners, innovators, and builders through technology and community." />
        <meta name="twitter:image" content="https://ignite-room.com/twitter-image.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ff2d55" />
        <link rel="canonical" content="https://ignite-room.com" />
        
        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ignite Room",
            "description": "Student-led technology community empowering learners, innovators, and builders",
            "url": "https://ignite-room.com",
            "logo": "https://ignite-room.com/logo.png",
            "sameAs": [
              "https://twitter.com/igniteroom",
              "https://instagram.com/igniteroom",
              "https://linkedin.com/company/igniteroom"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "General Inquiries",
              "email": "hello@ignite-room.com"
            }
          })}
        </script>
      </Helmet>

      <div className="relative min-h-screen bg-background">
        {/* 3D Background - lazy loaded, now visible throughout */}
        <Suspense fallback={null}>
          <Logo3DBackground />
        </Suspense>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10" role="main">
          <HeroSection />
          <AboutSection />
          <EventsSection />
          {/* TeamSection removed as requested */}
          <AppSection />
          <CollaborationsSection />
        </main>

        {/* Footer */}
        <footer className="relative z-20 pointer-events-auto" role="contentinfo">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Index;