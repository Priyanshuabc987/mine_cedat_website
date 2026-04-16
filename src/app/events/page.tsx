
import { getEvents } from '@/lib/data/events';
import { EventListClient } from "@/components/events/EventListClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This page is now a Server Component, responsible for fetching initial data.
export default async function EventsPage() {
  
  // Fetch the initial batch of published events directly on the server.
  // This ensures the data is present in the initial HTML for SEO.
  const initialEvents = await getEvents({
    status_filter: 'published',
    page_size: 6 // A reasonable initial page size
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 hover:bg-primary/70">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-4xl mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
              Startup <span className="text-primary italic">Meetups & Events</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connecting startups, students, and innovators into one powerful network. 
            </p>
          </div>

          {/* 
            The client component receives the server-fetched data as an initial prop.
            It will then handle all client-side logic, like fetching more events.
          */}
          <EventListClient initialEvents={initialEvents} statusFilter="published" />

        </div>
      </main>
    </div>
  );
}
