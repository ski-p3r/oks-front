"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Finally, a space that feels like home for kidney warriors in India! The resources and community support have been invaluable on my dialysis journey.",
    name: "Priya Sharma",
    role: "Patient, 3 years on dialysis",
    avatar: "/indian-woman-smiling.png",
  },
  {
    quote:
      "As a caregiver to my father, this community has given me practical advice and emotional support that I couldn't find anywhere else.",
    name: "Rahul Verma",
    role: "Caregiver",
    avatar: "/indian-man-30s.png",
  },
  {
    quote:
      "The dialysis center locator helped me maintain my treatment schedule while traveling for work. This platform is truly changing lives.",
    name: "Ananya Patel",
    role: "Transplant recipient",
    avatar: "/young-indian-woman.png",
  },
  {
    quote:
      "Connecting with others who understand the dietary challenges has transformed how I approach kidney-friendly meals. So grateful for this community!",
    name: "Vikram Singh",
    role: "CKD Stage 3 patient",
    avatar: "/middle-aged-indian-man.png",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= testimonials.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#22AA86]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -mr-32 -mb-32 blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-10 bg-[#22AA86] rounded-full mr-2"></div>
              <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                TESTIMONIALS
              </span>
              <div className="h-1 w-10 bg-[#22AA86] rounded-full ml-2"></div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from kidney warriors and caregivers who have found support and
            connection through our platform.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <Card className="h-full border-0 bg-transparent">
                    <CardContent className="p-0 h-full">
                      <div className="bg-gradient-to-br from-background to-muted/30 dark:from-muted/10 dark:to-background border border-muted rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl hover:shadow-[#22AA86]/5 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22AA86]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <Quote className="h-12 w-12 text-[#22AA86]/20 mb-6" />
                        <p className="mb-8 italic text-lg leading-relaxed">
                          {testimonial.quote}
                        </p>

                        <div className="flex items-center gap-4 mt-auto">
                          <Avatar className="h-14 w-14 border-2 border-[#22AA86]/20">
                            <AvatarImage
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                            />
                            <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-lg">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-background/80 backdrop-blur-sm text-foreground hover:bg-[#22AA86]/10 rounded-full h-12 w-12 shadow-lg border border-muted"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 bg-background/80 backdrop-blur-sm text-foreground hover:bg-[#22AA86]/10 rounded-full h-12 w-12 shadow-lg border border-muted"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-[#22AA86] w-8"
                    : "bg-[#22AA86]/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
