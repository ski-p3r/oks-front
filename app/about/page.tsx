import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Dr. Ananya Sharma",
    role: "Founder & Nephrologist",
    bio: "With over 15 years of experience in nephrology, Dr. Sharma founded Kidney Community after seeing the need for better support systems for kidney patients in India.",
    avatar: "/team-member-1.png",
  },
  {
    name: "Rajiv Mehta",
    role: "Patient Advocate",
    bio: "As a kidney transplant recipient, Rajiv brings firsthand experience and passion to our community, ensuring we address the real needs of kidney warriors.",
    avatar: "/team-member-2.png",
  },
  {
    name: "Dr. Priya Patel",
    role: "Medical Advisor",
    bio: "Specializing in renal nutrition, Dr. Patel provides expert guidance on dietary recommendations and educational content for our community members.",
    avatar: "/team-member-3.png",
  },
  {
    name: "Vikram Singh",
    role: "Community Manager",
    bio: "Vikram oversees our online community, facilitating discussions and ensuring a supportive environment for all members to share and learn.",
    avatar: "/team-member-4.png",
  },
];

const impactStats = [
  { number: "500+", label: "Kidney Warriors Connected" },
  { number: "50+", label: "Dialysis Centers Mapped" },
  { number: "24", label: "Support Groups Formed" },
  { number: "100+", label: "Success Stories Shared" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22AA86]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2"></div>
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  ABOUT US
                </span>
                <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Every Story Creates a{" "}
              <span className="text-[#22AA86]">Ripple of Hope</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              We're building India's first community platform dedicated to
              supporting kidney patients and their caregivers through
              connection, resources, and shared experiences.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-xl px-8"
              >
                Join Our Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10 rounded-xl px-8"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#22AA86]/10 rounded-full blur-2xl"></div>

              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/about-story.png"
                  alt="Kidney Community founding story"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="h-1 w-10 bg-[#22AA86] rounded-full mr-2"></div>
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  OUR STORY
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bridging the Gap in India's Kidney Care
              </h2>

              <div className="space-y-6 text-muted-foreground">
                <p>
                  Kidney Community was born from a personal journey. When our
                  founder's father was diagnosed with chronic kidney disease in
                  2018, they discovered a significant gap in India's healthcare
                  system: while medical treatment was available, emotional
                  support and practical guidance were scarce.
                </p>

                <p>
                  We recognized that kidney disease affects not just the patient
                  but entire families. Caregivers often feel isolated,
                  overwhelmed by medical jargon, and unsure where to find
                  reliable information specific to Indian healthcare contexts.
                </p>

                <p>
                  In 2022, we launched this platform with a simple mission: to
                  ensure no kidney patient or caregiver in India feels alone in
                  their journey. We've grown from a small WhatsApp group to a
                  nationwide community, connecting warriors across the country.
                </p>
              </div>

              <div className="mt-8">
                <Link href="/get-involved">
                  <Button
                    variant="outline"
                    className="border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10 rounded-xl"
                  >
                    How You Can Help
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2"></div>
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  OUR VALUES
                </span>
                <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Guides Us
            </h2>

            <p className="text-lg text-muted-foreground">
              Our community is built on core principles that shape everything we
              do, from the resources we create to how we foster connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-background to-muted/30 dark:from-muted/10 dark:to-background border border-muted rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-[#22AA86]/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22AA86]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] flex items-center justify-center shadow-lg mb-6 border border-white/10 backdrop-blur-sm p-3 relative overflow-hidden">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3">Community First</h3>

              <p className="text-muted-foreground">
                We believe in the power of shared experiences. Every feature on
                our platform is designed to foster meaningful connections
                between kidney warriors and caregivers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background to-muted/30 dark:from-muted/10 dark:to-background border border-muted rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-[#22AA86]/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22AA86]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] flex items-center justify-center shadow-lg mb-6 border border-white/10 backdrop-blur-sm p-3 relative overflow-hidden">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3">Trusted Information</h3>

              <p className="text-muted-foreground">
                We work with medical professionals to ensure all resources are
                accurate, up-to-date, and relevant to the Indian healthcare
                context.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background to-muted/30 dark:from-muted/10 dark:to-background border border-muted rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-[#22AA86]/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22AA86]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] flex items-center justify-center shadow-lg mb-6 border border-white/10 backdrop-blur-sm p-3 relative overflow-hidden">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3">Empathy & Support</h3>

              <p className="text-muted-foreground">
                We create a judgment-free space where everyone's journey is
                respected, and emotional support is as valued as practical
                advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2"></div>
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  OUR TEAM
                </span>
                <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet the People Behind Kidney Community
            </h2>

            <p className="text-lg text-muted-foreground">
              Our diverse team brings together medical expertise, personal
              experience with kidney disease, and a shared passion for
              supporting the kidney care community in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-background dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-muted hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-[#22AA86]/20">
                    <AvatarImage
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-[#22AA86] font-medium text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              We're also supported by a network of medical advisors, volunteers,
              and community moderators across India.
            </p>

            <Link href="/get-involved">
              <Button className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-xl px-8">
                Join Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-[#22AA86]">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-white rounded-full mr-2"></div>
                <span className="text-white font-medium text-sm tracking-wider">
                  OUR IMPACT
                </span>
                <div className="h-1 w-6 bg-white rounded-full ml-2"></div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Making a Difference Together
            </h2>

            <p className="text-lg text-white/80">
              Since our launch, we've been growing steadily and creating
              meaningful change in the lives of kidney patients and caregivers
              across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <p className="text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/testimonials">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 rounded-xl px-8"
              >
                Read Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-background to-muted/30 dark:from-muted/10 dark:to-background border border-muted rounded-3xl p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're a kidney patient, caregiver, medical
                professional, or supporter, there's a place for you in our
                community.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-xl px-8"
                >
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10 rounded-xl px-8"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
