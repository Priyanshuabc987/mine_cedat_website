
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Users, Rocket, Trophy, Briefcase, ChevronRight, Zap, Target, BarChart3, Star, Quote } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";

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

const PROGRAMS = [
  {
    title: "Incubation",
    description: "Nurturing early-stage ideas into viable business models with hands-on support.",
    icon: Zap,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Acceleration",
    description: "Rapid scaling for startups with product-market fit looking to expand globally.",
    icon: Rocket,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Mentorship",
    description: "One-on-one sessions with industry veterans and successful entrepreneurs.",
    icon: Users,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Capital Access",
    description: "Connecting startups with angel investors, VCs, and grant opportunities.",
    icon: BarChart3,
    color: "bg-purple-50 text-purple-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Founder, EcoBloom",
    content: "Cedat transformed our garage project into a funded startup within 6 months. The network here is unmatched.",
    avatar: "https://picsum.photos/seed/user1/100/100",
  },
  {
    name: "Dr. James Wilson",
    role: "CEO, BioTech Solutions",
    content: "The mentorship programs provided us with technical and business clarity that we couldn't find elsewhere.",
    avatar: "https://picsum.photos/seed/user2/100/100",
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
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600"}
            alt="Hero background"
            fill
            className="object-cover brightness-[0.35]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge className="mb-6 bg-secondary hover:bg-secondary text-white border-none py-1.5 px-4 text-sm font-bold uppercase tracking-widest">
              Empowering Innovation
            </Badge>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-[1.1] font-headline">
              The Heart of the <span className="text-secondary italic">Ecosystem</span>
            </h1>
            <p className="text-xl md:text-3xl mb-12 text-gray-200 font-light max-w-2xl leading-relaxed">
              We connect the world's most ambitious founders with the resources, capital, and community they need to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" className="rounded-full px-10 h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                Join the Hub
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-xl font-bold border-2 text-white hover:bg-white/10 border-white">
                Our Programs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border -mt-32 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {METRICS.map((metric, i) => (
              <div key={i} className="text-center space-y-3 group">
                <div className="bg-background w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <metric.icon className="text-primary h-8 w-8" />
                </div>
                <div className="text-4xl font-extrabold text-primary font-headline">{metric.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Tailored Programs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            From ideation to global scaling, we provide the specialized support your venture needs at every stage of the journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROGRAMS.map((program, i) => (
            <Card key={i} className="border-none bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className={`${program.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                <program.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary font-headline">{program.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {program.description}
              </p>
              <Button variant="link" className="p-0 mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Ecosystem Events</h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              Stay connected with our global network through workshops, pitch days, and summit sessions.
            </p>
          </div>
          <Link href="/events" className="hidden md:flex items-center text-primary font-bold hover:underline group text-lg">
            View All Events <ChevronRight className="ml-1 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_EVENTS.map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Voices of Success</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm relative">
                <Quote className="absolute top-8 right-10 text-primary/10 h-16 w-16" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  "{t.content}"
                </p>
                <div className="mt-8 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners/CTA combined */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight">
              Ready to Pitch Your Idea to the World?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Applications for the Startup World Cup 2024 regional finals are now open. Don't miss your chance to win $1M in investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-12 h-16 text-xl font-bold shadow-xl shadow-secondary/20">
                <Link href="/startup-world-cup">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 text-white hover:bg-white/10 border-white rounded-full px-12 h-16 text-xl font-bold">
                <Link href="/ask-us">Inquire Further</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${className}`}>
      {children}
    </div>
  );
}
