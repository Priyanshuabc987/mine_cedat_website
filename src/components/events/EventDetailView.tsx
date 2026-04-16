
"use client";

import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getEventStatus, formatTime } from '@/lib/utils';

interface EventDetailViewProps {
  event: Event;
  layout?: 'default' | 'centered';
  children?: ReactNode;
}

const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true) }, []);
  return hydrated;
};

function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{part}</a>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function EventDetailView({ event, layout = 'default', children }: EventDetailViewProps) {
  const isHydrated = useHydrated();
  const featuredImageUrl = event.featured_image_url;

  const eventStatus = isHydrated ? getEventStatus(event.event_date, event.start_time, event.end_time) : { text: 'Loading...', variant: 'outline' as const };
  const startTimeFormatted = formatTime(event.start_time);
  const endTimeFormatted = formatTime(event.end_time);

  const fullDate = new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const canRegister = eventStatus.text !== 'Concluded' && !!event.external_registration_url;

  const registrationButton = (
    <Button asChild size="lg" className="w-full min-h-[48px] text-base font-semibold" disabled={!canRegister}>
      <a href={canRegister ? event.external_registration_url : undefined} target="_blank" rel="noopener noreferrer">
        {canRegister ? (
          <>
            Register Now <ExternalLink className="w-4 h-4 ml-2" />
          </>
        ) : 'Registration Closed'}
      </a>
    </Button>
  );

  if (layout === 'centered') {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-12">
        {/* Left Column */}
        <div className="flex flex-col items-center text-center space-y-8 lg:items-start lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold break-words leading-tight">
            {event.title}
          </h1>
          <div className="w-full max-w-lg mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-muted lg:mx-0">
            {featuredImageUrl ? (
              <ImageWithFallback src={featuredImageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                <Calendar className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          {event.description && (
            <Card className="w-full text-left border-0 shadow-none bg-transparent">
              <CardHeader className='px-0'>
                <CardTitle className="text-2xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent className='px-0'>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{linkifyText(paragraph)}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (Sticky) */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:sticky lg:top-24">
          {/* 1. Added relative positioning and modern background */}
          <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-card to-muted/30 shadow-2xl shadow-primary/10">

            {/* 2. Prominent "Free Entry" Badge */}
            <div className="absolute top-0 right-6 z-10 translate-x-1/5 translate-y-1/3">
              {/* Changed bg-green to a linear gradient from green to blue */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 font-bold text-primary-foreground text-center text-sm leading-tight shadow-xl">
                Free<br />Entry
              </div>
            </div>


            <CardHeader className="border-b border-border/50 p-5 bg-gradient-to-b from-primary/10 to-transparent">
              <CardTitle>Event Details</CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Added a subtle gradient background and a more defined border color */}
              <div className="space-y-3 rounded-xl border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Time</p>
                    <p className="text-sm font-semibold text-foreground">{isHydrated ? `${startTimeFormatted} - ${endTimeFormatted}` : 'Loading...'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                  <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Date</p>
                    <p className="text-sm font-semibold text-foreground break-words">{fullDate}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3 pt-3 border-t border-border/50">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground/90 break-words">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {registrationButton}
              {canRegister && <p className='text-xs text-muted-foreground text-center'>You will be redirected to an external site to complete your registration.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <div>Default layout not implemented</div>;
}
