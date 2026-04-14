
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long'
      })
    };
  };

  const dateInfo = formatDate(event.event_date);
  const isPast = new Date(event.event_date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <Link href={`/events/${event.id}`} className="block h-full">
        <Card className="group relative bg-card rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col min-h-0">
          <div className="aspect-square bg-muted relative overflow-hidden">
            {event.featured_image_url ? (
              <ImageWithFallback
                src={event.featured_image_url}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
              <Badge
                variant={isPast ? 'secondary' : 'default'}
                className="text-[10px] sm:text-xs whitespace-nowrap w-fit shadow-md"
              >
                {isPast ? 'Registration Closed' : 'Registration Open'}
              </Badge>
            </div>

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-background/90 backdrop-blur text-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
               {dateInfo.month} {dateInfo.day}
            </div>
          </div>

          <div className="p-4 sm:p-6 flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{dateInfo.full}</span>
              </span>
               <span className="hidden sm:inline text-muted-foreground/50">•</span>
               <span className="flex items-center gap-1.5 min-w-0">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{dateInfo.time}</span>
              </span>
              {event.location && (
                <>
                  <span className="hidden sm:inline text-muted-foreground/50">•</span>
                  <span className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                </>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-display font-bold group-hover:text-accent transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
            
            {event.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {event.description}
              </p>
            )}
            
            <div className="mt-auto pt-4 text-right">
                <p className="text-sm font-semibold text-accent group-hover:underline">
                  Register Now →
                </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
