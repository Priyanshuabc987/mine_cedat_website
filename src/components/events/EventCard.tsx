import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface EventCardProps {
  event: Event;
  showRegistrationButton?: boolean;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export function EventCard({
  event,
  showRegistrationButton = false,
  onRegister,
  isRegistered = false
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.toLocaleDateString('en-US', { year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const dateInfo = formatDate(event.event_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="group relative bg-card rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col min-h-0">
        {/* Image */}
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

          {/* Status Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 flex flex-col gap-1.5 sm:gap-2">
            <Badge 
              variant={
                event.calculated_state === 'registration_open' ? 'default' :
                event.calculated_state === 'registration_closed' ? 'secondary' :
                event.calculated_state === 'ongoing' ? 'default' :
                event.calculated_state === 'concluded' ? 'outline' :
                event.status === 'published' ? 'default' : 'secondary'
              } 
              className="text-[10px] sm:text-xs whitespace-nowrap w-fit"
            >
              {event.calculated_state === 'registration_open' ? 'Registration Open' :
               event.calculated_state === 'registration_closed' ? 'Registration Closed' :
               event.calculated_state === 'ongoing' ? 'Ongoing' :
               event.calculated_state === 'concluded' ? 'Concluded' :
               event.calculated_state === 'draft' ? 'Draft' :
               event.calculated_state === 'cancelled' ? 'Cancelled' :
               event.status === 'published' ? 'Live' : event.status}
            </Badge>
          </div>

          {/* Date Badge */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-background/90 backdrop-blur text-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
            {dateInfo.month} {dateInfo.day}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[10px] sm:text-xs font-medium text-muted-foreground mb-2 sm:mb-3">
            <span className="flex items-center gap-1 min-w-0">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{dateInfo.full} at {dateInfo.time}</span>
            </span>
            {event.location && (
              <>
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                <span className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-3 group-hover:text-accent transition-colors line-clamp-2 min-h-[3.5rem] sm:min-h-[4rem]">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3 sm:mb-4 flex-1">
              {event.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end mt-auto pt-2 border-t border-border/50 gap-2">
            {showRegistrationButton ? (
              <Button
                size="sm"
                onClick={() => {
                  if (event.external_registration_url) {
                    window.open(event.external_registration_url, '_blank');
                    return;
                  }
                  onRegister?.();
                }}
                disabled={
                  isRegistered || 
                  event.calculated_state === 'registration_closed' ||
                  event.calculated_state === 'ongoing' ||
                  event.calculated_state === 'concluded' ||
                  event.calculated_state === 'cancelled' ||
                  event.calculated_state === 'draft'
                }
                variant={isRegistered ? "secondary" : "default"}
                className="text-xs sm:text-sm whitespace-nowrap min-h-[44px] px-3 sm:px-4 rounded-full"
              >
                <span className="hidden sm:inline">
                  {isRegistered
                    ? 'Registered'
                    : event.calculated_state === 'concluded' || event.calculated_state === 'cancelled'
                    ? 'Event Completed'
                    : 'REGISTER NOW'}
                </span>
                <span className="sm:hidden">
                  {isRegistered
                    ? 'Registered'
                    : event.calculated_state === 'concluded' || event.calculated_state === 'cancelled'
                    ? 'Completed'
                    : 'Confirm'}
                </span>
              </Button>
            ) : (
              <Link href={`/events/${event.id}`} className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="w-full sm:w-auto rounded-full text-xs sm:text-sm font-semibold min-h-[44px]"
                  disabled={event.calculated_state === 'concluded' || event.calculated_state === 'cancelled'}
                  variant={
                    event.calculated_state === 'concluded' || event.calculated_state === 'cancelled'
                      ? 'secondary'
                      : 'default'
                  }
                >
                  {event.calculated_state === 'concluded' || event.calculated_state === 'cancelled'
                    ? 'Event Completed'
                    : 'Register Now'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
