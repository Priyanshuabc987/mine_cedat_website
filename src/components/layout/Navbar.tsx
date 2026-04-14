
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/startup-world-cup", label: "Startup World Cup" },
    { href: "/ask-us", label: "Ask Us" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40 h-16 sm:h-20" : "bg-transparent h-20 sm:h-24"
    )}>
      <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className={cn(
            "text-2xl font-black font-headline tracking-tighter",
            scrolled ? "text-primary" : "text-white drop-shadow-md"
          )}>CEDAT</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={cn(
                "text-sm font-bold transition-colors hover:text-accent cursor-pointer",
                pathname === link.href
                  ? (scrolled ? "text-primary" : "text-accent")
                  : (scrolled ? "text-muted-foreground" : "text-white/90")
              )}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.is_admin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <User className="w-4 h-4 mr-2" />
                    {user?.full_name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.profile_slug && (
                    <Link href={`/member/${user.profile_slug}`}>
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-6 bg-accent hover:bg-accent/90 text-white font-bold">
                Join Community
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center",
            scrolled ? "text-foreground" : "text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border/40 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-xl">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-lg font-bold text-foreground py-2 block">
                {link.label}
              </span>
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {isAuthenticated ? (
            <Button variant="ghost" className="justify-start px-0" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full rounded-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
