
"use client";

import { Hero } from "@/components/home/Hero";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Loader2, ChevronRight, Zap, Target, Rocket, Users } from "lucide-react";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { format } from 'date-fns';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: eventsData, isLoading, error } = useEvents({
    status_filter: 'published',
    page_size: 6,
  });

  const events = eventsData?.items || [];

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
      <section className="py-24 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Startup Ecosystem <span className="text-accent italic">Meetups</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Connecting startups, students, and innovators into one powerful network.
            </p>
          </div>
          <Link href="/events">
            <Button size="lg" className="rounded-full group">
              View All Events <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={event.featured_image_url || ''}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                      Upcoming
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(event.event_date), 'MMM dd')}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location || 'Bengaluru'}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <Link href={`/events/${event.id}`}>
                    <Button variant="link" className="p-0 h-auto font-black text-accent hover:text-accent/80 mt-2">
                      REGISTER NOW <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <SocialFeed />

      {/* Programs Teaser */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
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
