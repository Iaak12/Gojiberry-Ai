import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LogoCloud } from '@/components/LogoCloud';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';
import { Integrations } from '@/components/Integrations';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#0F172A] selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]">
      {/* 1. Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Logo Cloud */}
        <LogoCloud />

        {/* 4. Features Section */}
        <Features />

        {/* 5. Testimonials & Stats Section */}
        <Testimonials />

        {/* 6. Integrations & Stack Replacement Section */}
        <Integrations />

        {/* 7. Pricing Section */}
        <Pricing />

        {/* 8. FAQ Section */}
        <FAQ />

        {/* 9. Final CTA Section */}
        <FinalCTA />
      </main>

      {/* 10. Footer Section */}
      <Footer />
    </div>
  );
}
