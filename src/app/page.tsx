import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Users, Rocket, Trophy, Briefcase, ChevronRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const MOCK_EVENTS = [
  {
    title: "Eco-Tech Innovation Summit 2024",
    date: "May 15, 2024",
    location: "Green Hall, Silicon Valley",
    imageUrl: "https://picsum.photos/seed/event1/600/400",
    category: "Workshop",
    isUpcoming: true,
  },
  {
    title: "Regional Startup Pitch Day",
    date: "June 2, 2024",
    location: "Innovation Hub HQ",
    imageUrl: "https://picsum.photos/seed/event2/600/400",
    category: "Competition",
    isUpcoming: true,
  },
  {
    title: "Angel Investor Roundtable",
    date: "July 10, 2024",
    location: "Virtual Meeting",
    imageUrl: "https://picsum.photos/seed/event3/600/400",
    category: "Networking",
    isUpcoming: true,
  },
];

const METRICS = [
  { icon: Users, label: "Active Members", value: "5,000+" },
  { icon: Rocket, label: "Startups Funded", value: "120+" },
  { icon: Trophy, label: "Global Partners", value: "45" },
  { icon: Briefcase, label: "Successful Projects", value: "300+" },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-startup');

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600"}
            alt="Hero background"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-headline">
              Unlocking Potential in the <span className="text-secondary">Ecosystem</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-2xl">
              Cedat is a leading community platform connecting startups, investors, and talent to build the future of innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8 text-lg font-bold bg-primary hover:bg-primary/90">
                Explore Events
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-bold border-2 text-white hover:bg-white/10 border-white">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-10 shadow-sm border -mt-32 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {METRICS.map((metric, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="bg-background w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="text-primary h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-primary font-headline">{metric.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Featured Events</h2>
            <p className="text-muted-foreground max-w-xl">
              Don't miss out on our upcoming workshops, competitions, and networking sessions.
            </p>
          </div>
          <Link href="/events" className="hidden md:flex items-center text-primary font-bold hover:underline">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to take the next step?</h2>
            <p className="text-lg text-white/80">
              Join the Startup World Cup regional finals and get a chance to compete globally.
            </p>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-10 font-bold">
              <Link href="/startup-world-cup">Startup World Cup Details</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Community</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Witness the energy and collaboration that drives our ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <div className="relative rounded-2xl overflow-hidden row-span-2 col-span-2">
            <Image src="https://picsum.photos/seed/comm1/800/800" fill className="object-cover" alt="Gallery" />
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <Image src="https://picsum.photos/seed/comm2/400/300" fill className="object-cover" alt="Gallery" />
          </div>
          <div className="relative rounded-2xl overflow-hidden row-span-2">
            <Image src="https://picsum.photos/seed/comm3/400/600" fill className="object-cover" alt="Gallery" />
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <Image src="https://picsum.photos/seed/comm4/400/300" fill className="object-cover" alt="Gallery" />
          </div>
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-full">
            <Link href="/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
