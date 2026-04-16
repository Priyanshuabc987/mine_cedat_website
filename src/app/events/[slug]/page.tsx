
import { getEventBySlug, getEvents } from "@/lib/data/events";
import { EventDetailView } from "@/components/events/EventDetailView";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StaticEventList } from "@/components/events/StaticEventList"; // FIX: Import the new static component

export async function generateStaticParams() {
  const events = await getEvents({ status_filter: 'published' });
  return events.map((event) => ({
    slug: event.slug,
  }));
}

interface EventDetailPageProps {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {  const resolvedparamms = await params;
  // The slug from params is now guaranteed to exist by generateStaticParams
  const event = await getEventBySlug(resolvedparamms.slug);

  if (!event) {
    notFound();
  }

  // Fetch all published events to find others
  const allPublishedEvents = await getEvents({
    status_filter: 'published',
    page_size: 7 // Fetch a few extra to ensure we have 6 after filtering
  });

  // Filter out the current event and limit the list
  const otherEvents = allPublishedEvents.filter(e => e.id !== event.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
            <Link href="/events" className='mb-8 inline-block'>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <EventDetailView event={event} layout="centered" />

            {/* FIX: Use the new StaticEventList component */}
            {otherEvents.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-bold text-primary tracking-tight mb-10">
                  Other Upcoming Events
                </h2>
                <StaticEventList events={otherEvents} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
