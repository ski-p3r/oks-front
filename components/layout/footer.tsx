import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-muted/50 dark:bg-muted/20 pt-20 pb-10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src="/logo.png" alt="Logo" className="h-28" />

            <p className="text-muted-foreground mb-6">
              Connecting kidney patients and caregivers through shared stories,
              resources, and support.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-[#22AA86] hover:bg-[#22AA86] hover:text-white h-10 w-10"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-[#22AA86] hover:bg-[#22AA86] hover:text-white h-10 w-10"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-[#22AA86] hover:bg-[#22AA86] hover:text-white h-10 w-10"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-[#22AA86] hover:bg-[#22AA86] hover:text-white h-10 w-10"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Find Centers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[#22AA86] transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6">Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive updates on kidney health tips and community
              news.
            </p>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="border-[#22AA86] focus-visible:ring-[#22AA86] rounded-xl pl-4 pr-12 py-[1.3rem]"
                />
                <Button className="absolute right-1 top-1 bottom-1 bg-[#22AA86] hover:bg-[#1c8f70] rounded-lg py-2">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates from our company.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-16 pt-8 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Kidney Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
