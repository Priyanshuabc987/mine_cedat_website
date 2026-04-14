
import { EventCard } from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ALL_EVENTS = [
  {
    title: "Global AI Summit",
    date: "Aug 15, 2024",
    location: "National Conference Hall",
    imageUrl: "https://picsum.photos/seed/e1/600/400",
    category: "Summit",
    isUpcoming: true,
  },
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
    title: "Founder's Breakfast",
    date: "April 10, 2024",
    location: "The Hub Cafe",
    imageUrl: "https://picsum.photos/seed/e3/600/400",
    category: "Networking",
    isUpcoming: false,
  },
  {
    title: "VC Speed Dating",
    date: "March 20, 2024",
    location: "Virtual",
    imageUrl: "https://picsum.photos/seed/e4/600/400",
    category: "Networking",
    isUpcoming: false,
  },
  {
    title: "Blockchain for Dummies",
    date: "Jan 12, 2024",
    location: "Online",
    imageUrl: "https://picsum.photos/seed/e5/600/400",
    category: "Education",
    isUpcoming: false,
  },
];

export default function EventsPage() {
  const upcoming = ALL_EVENTS.filter(e => e.isUpcoming);
  const past = ALL_EVENTS.filter(e => !e.isUpcoming);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline">Events</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore opportunities to learn, pitch, and connect with the startup ecosystem.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex justify-center mb-12">
          <TabsList className="bg-white p-1 rounded-full border shadow-sm h-auto">
            <TabsTrigger value="upcoming" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Past Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
          {upcoming.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No upcoming events scheduled at the moment.</div>
          )}
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
