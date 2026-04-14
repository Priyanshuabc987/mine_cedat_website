
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { useEvents } from "@/hooks/useEvents";
import { format } from 'date-fns';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { usePublicEventsHeading, usePublicEventsSubheading } from '@/hooks/useContentSettings';

export default function Home() {
  const { data: eventsData, isLoading, error: eventsError } = useEvents({
    status_filter: 'published',
    page: 1,
    page_size: 50,
  });

  const events = eventsData?.items || [];

  const { data: heading } = usePublicEventsHeading(true);
  const homeHeading = heading || 'Startup Ecosystem Meetups & Events';
  const { data: subheading } = usePublicEventsSubheading(true);
  const homeSubheading = subheading || 'Dynamic Ecosystem of Nexus Communities';

  const sortedHomeEvents = [...events].sort((a: any, b: any) => {
    const now = new Date();
    const aDate = new Date(a.event_date);
    const bDate = new Date(b.event_date);

    const aPast =
      a.calculated_state === 'concluded' ||
      a.calculated_state === 'cancelled' ||
      aDate.getTime() < now.getTime();
    const bPast =
      b.calculated_state === 'concluded' ||
      b.calculated_state === 'cancelled' ||
      bDate.getTime() < now.getTime();

    if (aPast !== bPast) {
      return aPast ? 1 : -1;
    }

    return aDate.getTime() - bDate.getTime();
  });

  const homeEvents = sortedHomeEvents.slice(0, 9);

  return (
    <>
      {generateSEO(seoConfigs.home)}
      <div className="min-h-screen bg-background font-sans selection:bg-accent/20">
        <Navbar />
      
      <main>
        <Hero />
        
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-12 gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-4 break-words">{homeHeading}</h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-xl">{homeSubheading}</p>
              </div>
              <Link href="/events" className="flex-shrink-0 w-full sm:w-auto">
                <Button variant="default" className="rounded-full cursor-pointer w-full sm:w-auto min-h-[44px] px-4 sm:px-6">View All Events</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : eventsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
              </div>
            ) : homeEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {homeEvents.map((event: any) => {
                  const eventDate = new Date(event.event_date);
                  return (
                    <div key={event.id} className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        {event.featured_image_url ? (
                          <ImageWithFallback
                            src={event.featured_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 bg-background/90 backdrop-blur text-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          Upcoming
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] sm:text-xs font-medium text-muted-foreground mb-2 sm:mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" /> {format(eventDate, 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" /> {format(eventDate, 'h:mm a')}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{event.location}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-display font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3 sm:mb-4 flex-1">
                          {event.description || 'Join us for an exciting event in the startup ecosystem.'}
                        </p>
                        <div className="flex items-center justify-end mt-auto gap-2">
                          <Link href={`/events/${event.id}`} className="w-full sm:w-auto">
                            <Button size="sm" className="w-full sm:w-auto rounded-full text-xs sm:text-sm font-semibold">
                              REGISTER NOW
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && !eventsError && homeEvents.length > 0 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <Link href="/events">
                  <Button
                    variant="outline"
                    className="rounded-full min-h-[44px] px-6 sm:px-8"
                  >
                    Show more events
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        <SocialFeed />

        <section className="py-8 sm:py-12 md:py-16 lg:py-24 border-y border-border/40">
           <div className="container mx-auto px-4 sm:px-6 md:px-8">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-8 sm:mb-12 text-center">About CEDAT</h2>
             <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:gap-x-6 md:gap-y-8 max-w-4xl mx-auto text-center">
               <div className="md:col-span-2 md:col-start-1 md:row-start-1">
                 <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2" style={{ color: "#00CCCC" }}>30,000+</div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Community Members</div>
               </div>
               <div className="md:col-span-2 md:col-start-3 md:row-start-1">
                 <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2" style={{ color: "#00CCCC" }}>5,000+</div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Startups & Businesses</div>
               </div>
               <div className="md:col-span-2 md:col-start-5 md:row-start-1">
                 <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2" style={{ color: "#00CCCC" }}>350+</div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Meetups & Events</div>
               </div>
               <div className="md:col-span-2 md:col-start-2 md:row-start-2">
                 <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2" style={{ color: "#00CCCC" }}>80+</div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Ecosystem Partners</div>
               </div>
               <div className="col-span-2 md:col-span-2 md:col-start-4 md:row-start-2 flex flex-col items-center justify-center text-center">
                 <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2" style={{ color: "#00CCCC" }}>30+</div>
                 <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Live Projects</div>
               </div>
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
}
