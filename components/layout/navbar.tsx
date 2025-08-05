"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ShoppingCart,
  Heart,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clearUser, getUser } from "@/lib/getUser";
import { Badge } from "@/components/ui/badge";
import { getCartCount } from "@/lib/api/cart";
import { getWishlistCount } from "@/lib/api/wishlist";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    city: string;
    avatar_url: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (mounted) fetchUser();
    // if (user) {
    // Fetch cart count
    getCartCount().then((data) => setCartCount(data));
    getWishlistCount().then((data) => setWishlistCount(data));
  }, [pathname]);

  const fetchUser = async () => {
    await getUser().then((data) => setUser(data));
  };

  // Fetch cart and wishlist counts
  useEffect(() => {
    if (user) {
      // Fetch cart count
      getCartCount().then((data) => setCartCount(data));
      getWishlistCount().then((data) => setWishlistCount(data));
    }
  }, [user]);

  // Fix hydration issues with theme toggle
  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Stories", href: "/stories" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-28" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-[#22AA86] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Shopping Icons */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl border border-border hover:bg-[#22AA86]/10 hover:text-[#22AA86] relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[#22AA86] text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl border border-border hover:bg-[#22AA86]/10 hover:text-[#22AA86] relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[#22AA86] text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl border border-border hover:bg-[#22AA86]/10 hover:text-[#22AA86]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-[#22AA86]" />
              ) : (
                <Moon className="h-5 w-5 text-[#22AA86]" />
              )}
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-[#22AA86]">
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt="User"
                  />
                  <AvatarFallback className="bg-[#22AA86] text-white">
                    {user.first_name[0] + user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/orders"
                    className="flex items-center cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/wishlist"
                    className="flex items-center cursor-pointer"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/cart"
                    className="flex items-center cursor-pointer"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Cart</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    clearUser();
                    fetchUser();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#22AA86] hover:bg-[#22AA86]/10 hover:text-[#22AA86]"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-lg px-6"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto py-6 pb-8 bg-background">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-[#22AA86] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Shopping links for mobile */}
            {user && (
              <>
                <div className="h-px w-full bg-border my-2"></div>
                <Link
                  href="/orders"
                  className="flex items-center text-sm font-medium hover:text-[#22AA86] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center text-sm font-medium hover:text-[#22AA86] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge className="ml-2 bg-[#22AA86] text-white text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center text-sm font-medium hover:text-[#22AA86] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {cartCount > 0 && (
                    <Badge className="ml-2 bg-[#22AA86] text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </>
            )}

            {!user && (
              <div className="flex flex-col space-y-3 pt-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="w-full bg-[#22AA86] hover:bg-[#1c8f70] rounded-xl"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
