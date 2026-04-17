
import { Hero } from "@/components/home/Hero";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Ecosystem } from "@/components/home/Ecosystem";
import { getEvents } from "@/lib/data/events";
import { getSocialPosts } from "@/lib/data/socialposts";
import { getHeroImages } from "@/lib/data/hero";
import { EventListClient } from "@/components/events/EventListClient";
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: "Cedat: Bangalore's Largest Startup Ecosystem & Tech Community Hub",
  description: "Welcome to Cedat, Bangalore's largest and most diverse startup ecosystem. We are community builders across all sectors, offering regular meetups, events, funding opportunities, and resources for founders in Hardware, Healthcare, Tech, Social Impact, and more. Join us to connect, learn, and grow your startup.",
  openGraph: {
    title: "Cedat: Bangalore's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bangalore's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    url: BASE_URL,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Cedat Community',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cedat: Bangalore's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bangalore's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};


export default async function Home() {

  const [latestEvents, socialPosts, heroImages] = await Promise.all([
    getEvents({
      status_filter: "published",
      page_size: 3
    }),
    getSocialPosts(),
    getHeroImages()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Hero initialImages={heroImages} />

      {/* Metrics Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-3 py-6 sm:p-12 shadow-2xl border flex flex-wrap justify-between gap-8 text-center">
           <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">33K+</div>
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
          <div className="flex-1 min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-black text-primary">30+</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Communities</div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 pb-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Join Bangalore's Most Active <span className="text-primary italic">Startup Events</span>
            </h2>
            <p className="text-muted-foreground text-lg ">
              Explore exclusive meetups and networking sessions. Cedat is your gateway to the heart of the Bangalore startup ecosystem.
            </p>
          </div>
          <Link href="/events">
            <Button size="lg" className="rounded-full group">
              View All Events <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <EventListClient initialEvents={latestEvents} statusFilter="published" />
        
      </section>

      <SocialFeed initialPosts={socialPosts} />

      <Ecosystem />

      {/* Programs Teaser */}
      <section className="py-24 pb-10 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl space-y-8">
            <h2 className="text-4xl sm:text-6xl font-black leading-tight">
              Pitch Your Startup Idea to the World: <span className="text-accent italic">The Startup World Cup</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              This is your chance to shine on a global stage. As the official host of the Startup World Cup regional finals in Bangalore, we're looking for the next game-changers. Secure your spot, get noticed by international investors, and compete for a $1M investment prize.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/startup-world-cup">
                <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-black px-10 h-16 text-lg">
                  Apply for SWC 2024
                </Button>
              </Link>
              <Link href="/ask-us">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-black hover:bg-white/10 px-10 h-16 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
