
"use client";

import { Hero } from "@/components/home/Hero";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EventList } from "@/components/events/EventList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Metrics Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border flex flex-wrap justify-between gap-8 text-center">
          <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">30K+</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Members</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">5K+</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Startups</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">350+</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Events</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">80+</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Partners</div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 pb-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Startup <span className="text-accent italic">Meetups & Events</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Connecting startups and innovators into one powerful network.
            </p>
          </div>
          <Link href="/events">
            <Button size="lg" className="rounded-full group">
              View All Events <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <EventList statusFilter="published" limit={3} />
        
      </section>

      <SocialFeed />

      {/* Programs Teaser */}
      <section className="py-24 pb-10 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <h2 className="text-4xl sm:text-6xl font-black leading-tight">
              Ready to Pitch Your Idea to the World?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Applications for the Startup World Cup 2024 regional finals are now open. Don't miss your chance to win $1M in investment.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/startup-world-cup">
                <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-black px-10 h-16 text-lg">
                  Apply Now
                </Button>
              </Link>
              <Link href="/ask-us">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white/10 px-10 h-16 text-lg">
                  Inquire Further
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
