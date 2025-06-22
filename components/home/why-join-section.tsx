import { Check } from "lucide-react";

const benefits = [
  "Connect with others who understand your journey.",
  "Access India-specific resources and advice.",
  "Learn from shared experiences and practical tips.",
  "Find local dialysis centers and kidney specialists.",
  "Discover kidney-friendly products and recipes.",
  "Share your story and inspire others.",
];

export default function WhyJoinSection() {
  return (
    <section
      id="why-join"
      className="py-24 bg-muted/50 dark:bg-muted/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#22AA86]/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-1 w-10 bg-[#22AA86] rounded-full mr-2"></div>
              <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                WHY CHOOSE US
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Why Join Our Community?
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="mt-1 bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] rounded-xl p-2 shadow-lg shadow-[#22AA86]/20 transition-transform duration-300 group-hover:scale-110">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
              <img
                src="/community-support.png"
                alt="Community members supporting each other"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-[#22AA86] overflow-hidden">
                      <img
                        src="/avatar-1.png"
                        alt="Community member"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-10 w-10 rounded-full border-2 border-[#22AA86] overflow-hidden">
                      <img
                        src="/avatar-2.png"
                        alt="Community member"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="h-10 w-10 rounded-full border-2 border-[#22AA86] overflow-hidden">
                      <img
                        src="/avatar-3.png"
                        alt="Community member"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      Join 500+ kidney warriors
                    </p>
                    <p className="text-white/70 text-sm">
                      Building a supportive community together
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#22AA86] flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Verified Support Network
                      </p>
                      <p className="text-white/70 text-sm">
                        Trusted by healthcare professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
