"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const carouselItems = [
  {
    title: "Empowering Kidney Warriors",
    subtitle: "& Their Caregivers",
    description:
      "Connecting kidney patients and caregivers through shared stories, resources, and support for a healthier journey together.",
    image: "/hero-image-1.png",
    ctaText: "Join Our Community",
    ctaLink: "#join",
    secondaryCta: "Share Your Story",
    secondaryCtaLink: "#share",
  },
  {
    title: "Your Journey",
    subtitle: "Our Community",
    description:
      "Find support, resources, and friendship on your kidney health journey with India's first kidney care community.",
    image: "/hero-image-2.png",
    ctaText: "Get Started Today",
    ctaLink: "#start",
    secondaryCta: "Learn More",
    secondaryCtaLink: "#learn",
  },
  {
    title: "India's First",
    subtitle: "Kidney Care Community",
    description:
      "Access India-specific resources, find local dialysis centers, and connect with others who understand your challenges.",
    image: "/hero-image-3.png",
    ctaText: "Explore Resources",
    ctaLink: "#resources",
    secondaryCta: "Find Centers",
    secondaryCtaLink: "#centers",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-b from-background to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#22AA86]/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#22AA86]/5 blur-3xl"></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#22AA86]/10 blur-2xl"></div>
      </div>

      {/* Hero content */}
      <div className="container mx-auto relative z-10 h-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-16 md:py-20 lg:py-0">
          {/* Left content column */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22AA86]/10 text-[#22AA86] text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-[#22AA86] mr-2"></span>
              India's Premier Kidney Support Platform
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-[#22AA86]">
                  {carouselItems[currentSlide].title}
                </span>
                <span className="block">
                  {carouselItems[currentSlide].subtitle}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                {carouselItems[currentSlide].description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-full px-8 h-14 text-base shadow-lg shadow-[#22AA86]/20 group"
              >
                {carouselItems[currentSlide].ctaText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10 rounded-full px-8 h-14 text-base"
              >
                {carouselItems[currentSlide].secondaryCta}
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
              <div className="flex -space-x-3">
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img
                    src="/avatar-1.png"
                    alt="Community member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img
                    src="/avatar-2.png"
                    alt="Community member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                  <img
                    src="/avatar-3.png"
                    alt="Community member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-background bg-[#22AA86] flex items-center justify-center text-white text-xs">
                  +500
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-medium text-foreground">500+</span>{" "}
                kidney warriors
              </p>
            </div>
          </div>

          {/* Right image column with carousel */}
          <div className="lg:col-span-7 relative">
            <div className="relative h-[400px] md:h-[500px] lg:h-[650px] w-full overflow-hidden rounded-[2.5rem]">
              {/* Image carousel */}
              <div
                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="flex h-full">
                  {carouselItems.map((item, index) => (
                    <div key={index} className="min-w-full h-full relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={`${item.title} ${item.subtitle}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Floating info cards */}
                      <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-wrap gap-4">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl w-full max-w-xs">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#22AA86]/20 flex items-center justify-center">
                              <svg
                                className="h-5 w-5 text-[#22AA86]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                Community Support
                              </h3>
                              <p className="text-white/70 text-sm">
                                Connect with others who understand
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl w-full max-w-xs ml-auto">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#22AA86]/20 flex items-center justify-center">
                              <svg
                                className="h-5 w-5 text-[#22AA86]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                Resources & Guides
                              </h3>
                              <p className="text-white/70 text-sm">
                                India-specific kidney care information
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 z-30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full h-12 w-12 shadow-lg border border-white/20"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>

              <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full h-12 w-12 shadow-lg border border-white/20"
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Slide indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "bg-white w-8" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 lg:h-32 overflow-hidden z-10">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.05"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.03"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
