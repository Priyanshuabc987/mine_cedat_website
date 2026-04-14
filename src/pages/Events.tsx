
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventList } from "@/components/events/EventList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { usePublicEventsHeading, usePublicEventsSubheading } from "@/hooks/useContentSettings";

export default function Events() {
  const { data: subheading } = usePublicEventsSubheading(true);
  const eventsSubheading = subheading || "Dynamic Ecosystem of Nexus Communities";
  const { data: heading } = usePublicEventsHeading(true);
  const eventsHeading = heading || "Startup Ecosystem Meetups & Events";

  return (
    <>
      {generateSEO(seoConfigs.events)}
      <div className="min-h-screen bg-background">
        <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
            <div className="w-full min-w-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 min-h-[44px] px-3 sm:px-4">
                  <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4 break-words">
                {eventsHeading}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground break-words">
                {eventsSubheading}
              </p>
            </div>
          </div>

          <EventList />
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
