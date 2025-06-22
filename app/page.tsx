import CtaSection from "@/components/home/cta-section";
import FeatureSection from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import Testimonials from "@/components/home/testimonials";
import WhyJoinSection from "@/components/home/why-join-section";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <WhyJoinSection />
      <Testimonials />
      <CtaSection />
    </main>
  );
}
