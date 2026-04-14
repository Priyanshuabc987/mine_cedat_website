
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trophy, Users, Globe, Rocket, Shield } from "lucide-react";

const TIMELINE = [
  { date: "March 1, 2024", title: "Applications Open", description: "Startups can begin submitting their pitches online." },
  { date: "May 30, 2024", title: "Applications Close", description: "Final call for all regional applications." },
  { date: "June 15, 2024", title: "Top 10 Announcement", description: "Our expert jury selects the best 10 startups." },
  { date: "July 2, 2024", title: "Regional Final", description: "Live pitching event at the Cedat Innovation Center." },
  { date: "October 2024", title: "Grand Final", description: "Winners travel to San Francisco for the global stage." },
];

const FEATURES = [
  {
    icon: Rocket,
    title: "For Startups",
    description: "Gain global exposure, mentorship from industry leaders, and a chance to win $1M investment.",
  },
  {
    icon: Shield,
    title: "For Corporations",
    description: "Discover disruptive technologies, scout for potential M&A targets, and network with innovators.",
  },
  {
    icon: Users,
    title: "For Investors",
    description: "Get early access to high-potential startups and co-invest with top venture capital firms.",
  },
];

const PARTNERS = Array(6).fill(0).map((_, i) => ({
  id: i,
  imageUrl: `https://picsum.photos/seed/logo${i + 10}/200/100`,
}));

export default function StartupWorldCupPage() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-secondary text-sm font-bold tracking-widest uppercase">
              Global Competition
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight">
              Startup World Cup <span className="text-secondary">2024</span>
            </h1>
            <p className="text-xl text-white/80 max-w-xl">
              The world's largest startup competition, bridging ecosystem silos and celebrating innovation globally.
            </p>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 rounded-full px-10 h-14 text-lg font-bold">
              Apply to Compete
            </Button>
          </div>
          <div className="flex-1 relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://picsum.photos/seed/swc_hero/1200/500"
              alt="Startup World Cup"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">Why Attend?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience unparalleled opportunities for growth, networking, and discovery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl p-8 hover:shadow-md transition-all text-center">
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-white py-24 border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">Roadmap to Success</h2>
            <p className="text-muted-foreground">Follow the milestones from regional heats to the global stage.</p>
          </div>
          
          <div className="relative space-y-12">
            <div className="timeline-line hidden md:block" />
            
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 items-start md:items-center relative">
                <div className="md:w-1/3 text-left md:text-right">
                  <span className="text-secondary font-bold text-lg">{item.date}</span>
                </div>
                
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-lg border-4 border-white">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="bg-background p-6 rounded-2xl border">
                    <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">Our Global Partners</h2>
          <p className="text-muted-foreground">Collaborating with the world's leading brands.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border h-24">
              <Image src={partner.imageUrl} alt="Partner" width={120} height={60} className="object-contain" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
