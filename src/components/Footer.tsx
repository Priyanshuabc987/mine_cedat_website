
import Link from "next/link";
import { Rocket, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#313336] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-accent" />
              <span className="text-2xl font-bold font-headline">Cedat</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of innovators through community, events, and resources.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/events" className="hover:text-accent transition-colors">Upcoming Events</Link></li>
              <li><Link href="/startup-world-cup" className="hover:text-accent transition-colors">Startup World Cup</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors">Community Gallery</Link></li>
              <li><Link href="/ask-us" className="hover:text-accent transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Innovation Hub, 123 Tech Avenue</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent" />
                <span>hello@cedat.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Cedat Startup Ecosystem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
