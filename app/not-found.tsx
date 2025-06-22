"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Animated Kidney Illustration */}
        <motion.div
          className="relative w-64 h-64 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full ${
              theme === "dark" ? "text-gray-800" : "text-gray-100"
            }`}
            fill="currentColor"
          >
            <path d="M140,60 C170,90 170,140 140,170 C110,200 60,180 40,150 C20,120 20,80 40,50 C60,20 110,30 140,60 Z" />
          </svg>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-9xl font-bold text-[#22AA86]">4</span>
            <motion.div
              className={`w-20 h-20 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            />
            <span className="text-9xl font-bold text-[#22AA86]">4</span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Oops! It seems like the page you're looking for has been filtered out
          of our system.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            asChild
            className="bg-[#22AA86] hover:bg-[#1c8f70] gap-2"
            size="lg"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10 gap-2"
            size="lg"
          >
            <Link href="/blog">
              <Search className="w-4 h-4" />
              Browse Resources
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="hover:bg-[#22AA86]/10 hover:text-[#22AA86] gap-2"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#22AA86]/5 blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#22AA86]/5 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-[#22AA86]/5 blur-3xl"></div>
      </div>

      {/* Health Tips Section */}
      <motion.div
        className="mt-16 w-full max-w-2xl mx-auto p-6 rounded-xl border border-[#22AA86]/20 bg-[#22AA86]/5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-center">
          While you're here, a quick kidney health tip:
        </h3>
        <p className="text-center text-muted-foreground">
          Staying hydrated is essential for kidney health. Aim to drink at least
          8 glasses of water daily to help your kidneys filter waste
          efficiently.
        </p>
      </motion.div>
    </div>
  );
}
