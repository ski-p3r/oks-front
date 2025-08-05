"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/api/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (registered === "true") {
      setShowRegistrationSuccess(true);
      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      // Here you would implement your actual login logic
      // For demo purposes, we'll just simulate a delay
      await login({ email, password }).then((data) => console.log(data));
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Login successful!");
      // Redirect to dashboard after successful login
      router.push("/");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9f5f2] dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#22AA86]/10 rounded-br-[100px] z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-[#22AA86]/10 rounded-tl-[100px] z-0"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#22AA86]/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#22AA86]/20 rounded-full blur-3xl z-0"></div>

      {/* Logo and back link */}
      {/* <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">KC</span>
          </div>
          <div>
            <span className="font-bold text-xl block leading-tight">
              Kidney
            </span>
            <span className="font-bold text-xl block leading-tight text-[#22AA86]">
              Community
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-[#22AA86] transition-colors"
        >
          ← Back to home
        </Link>
      </div> */}

      {/* Main card */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800">
        {/* Card header with decorative element */}
        <div className="relative h-16 bg-gradient-to-r from-[#22AA86] to-[#1a8a6c] flex items-center justify-center">
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md">
            <div className="h-8 w-8 rounded-full bg-[#22AA86]/20 flex items-center justify-center">
              <Lock className="h-4 w-4 text-[#22AA86]" />
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="px-8 pt-12 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {showRegistrationSuccess && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>
                Registration successful! You can now sign in with your
                credentials.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#22AA86] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#22AA86] hover:bg-[#1c8f70] h-12 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Card footer */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#22AA86] hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Social proof */}
      <div className="mt-8 flex flex-col items-center z-10">
        <p className="text-sm text-muted-foreground mb-2">
          Trusted by 500+ kidney warriors across India
        </p>
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
            <img
              src="/avatar-1.png"
              alt="Community member"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
            <img
              src="/avatar-2.png"
              alt="Community member"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
            <img
              src="/avatar-3.png"
              alt="Community member"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-[#22AA86] flex items-center justify-center text-white text-xs">
            +500
          </div>
        </div>
      </div>
    </div>
  );
}
