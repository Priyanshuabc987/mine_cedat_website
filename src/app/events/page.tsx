
"use client";

import { EventList } from "@/components/events/EventList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 hover:bg-accent/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-4xl mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
              Startup <span className="text-accent italic">Meetups & Events</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connecting startups, students, and innovators into one powerful network. 
            </p>
          </div>

          <EventList statusFilter="published"  />

        </div>
      </main>
    </div>
  );
}
