
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Rocket, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Programs", href: "/programs" },
  { name: "Startup World Cup", href: "/startup-world-cup" },
  { name: "Gallery", href: "/gallery" },
  { name: "Ask Us", href: "/ask-us" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-b h-16" : "bg-transparent h-16"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <span className={cn(
            "text-2xl font-black font-headline transition-colors",
            scrolled ? "text-primary" : "text-white"
          )}>Cedat</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-all hover:text-secondary relative group",
                pathname === link.href 
                  ? (scrolled ? "text-primary" : "text-secondary") 
                  : (scrolled ? "text-muted-foreground" : "text-white/80")
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full",
                pathname === link.href && "w-full"
              )} />
            </Link>
          ))}
          <Button asChild className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white font-bold h-11">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(scrolled ? "text-primary" : "text-white")}>
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col space-y-6 mt-12">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-2xl font-extrabold transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 space-y-4">
                  <Button asChild className="rounded-full w-full h-14 text-lg font-bold">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full w-full h-14 text-lg font-bold border-2">
                    <Link href="/register" onClick={() => setIsOpen(false)}>Create Account</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
