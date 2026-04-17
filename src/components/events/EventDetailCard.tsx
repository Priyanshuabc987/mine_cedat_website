
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/hooks/useEvents";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { getEventStatus, formatTime } from '@/lib/utils';

interface EventDetailCardProps {
  event: Event;
  className?: string;
}

// This hook is necessary to avoid hydration mismatches between server and client
// when calculating dynamic values like event status.
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true) }, []);
  return hydrated;
};

export function EventDetailCard({ event, className }: EventDetailCardProps) {
  const isHydrated = useHydrated();

  // Safely calculate dynamic values only on the client
  const eventStatus = isHydrated ? getEventStatus(event.event_date, event.start_time, event.end_time) : { text: 'Loading...', variant: 'outline' as const };
  const startTimeFormatted = isHydrated ? formatTime(event.start_time) : '...';
  const endTimeFormatted = isHydrated ? formatTime(event.end_time) : '...';
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

  return (
    <Card className={`relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-card to-muted/30 shadow-2xl shadow-primary/10 ${className}`}>
      <div className="absolute top-0 right-6 z-10 translate-x-1/5 translate-y-1/3">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 font-bold text-primary-foreground text-center text-sm leading-tight shadow-xl">
          Free<br />Entry
        </div>
      </div>

      <CardHeader className="border-b border-border/50 p-5 bg-gradient-to-b from-primary/10 to-transparent">
        <CardTitle>Event Details</CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-3 rounded-xl border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
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
        {canRegister && <p className='text-xs text-muted-foreground text-center'>You will be redirected to an external site.</p>}
      </CardContent>
    </Card>
  );
}
