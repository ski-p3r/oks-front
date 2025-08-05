import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ShoppingBag, MapPin, BookOpen } from "lucide-react";

const features = [
  {
    title: "Community Chat",
    description:
      "Connect with fellow kidney warriors and caregivers in our interactive forum for discussions and peer support.",
    icon: <MessageSquare className="h-10 w-10 text-white" />,
    color: "from-[#22AA86] to-[#1a8a6c]",
  },
  {
    title: "Kidney Care Shelf",
    description:
      "Discover recommended products like low-sodium snacks, kidney-friendly supplements, and essential care items.",
    icon: <ShoppingBag className="h-10 w-10 text-white" />,
    color: "from-[#22AA86] to-[#1a8a6c]",
  },
  {
    title: "Dialysis Center Locator",
    description:
      "Find nearby or travel-friendly dialysis centers across India with our comprehensive search tool.",
    icon: <MapPin className="h-10 w-10 text-white" />,
    color: "from-[#22AA86] to-[#1a8a6c]",
  },
  {
    title: "Story Hub",
    description:
      "Read inspiring stories from community members who are navigating their kidney health journey.",
    icon: <BookOpen className="h-10 w-10 text-white" />,
    color: "from-[#22AA86] to-[#1a8a6c]",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#22AA86]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-10 bg-[#22AA86] rounded-full mr-2"></div>
              <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                OUR SERVICES
              </span>
              <div className="h-1 w-10 bg-[#22AA86] rounded-full ml-2"></div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">Key Features</h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to navigate your kidney health journey with
            confidence and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="h-full">
              <Card className="border-0 bg-transparent h-full group">
                <CardContent className="p-0 h-full">
                  <div className="bg-gradient-to-br border border-white/10 shadow-xl rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-[#22AA86]/10 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#22AA86]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#22AA86]/20 transition-all duration-300"></div>

                    <div className="mb-6 relative z-10">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[#22AA86]/20 border border-white/10 backdrop-blur-sm p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#22AA86] to-[#1a8a6c]"></div>
                        <div className="relative z-10">{feature.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 relative z-10">
                      <div className="h-10 w-10 rounded-full bg-[#22AA86]/10 flex items-center justify-center group-hover:bg-[#22AA86]/20 transition-all duration-300">
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
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
