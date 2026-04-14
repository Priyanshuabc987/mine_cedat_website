import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Image as ImageIcon, CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { API_BASE_URL } from '@/lib/queryClient';

interface EventDetailViewProps {
  event: Event;
  showRegistrationButton?: boolean;
  onRegister?: () => void;
  isRegistered?: boolean;
  isRegistering?: boolean;
  /** Centered single-column layout: 1:1 image, date/location, then children, then about */
  layout?: 'default' | 'centered';
  children?: ReactNode;
}

// Convert any http/https URLs in plain text into clickable links
function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    const isUrl = /^https?:\/\/\S+$/i.test(part);
    if (isUrl) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function EventDetailView({
  event,
  showRegistrationButton = false,
  onRegister,
  isRegistered = false,
  isRegistering = false,
  layout = 'default',
  children
}: EventDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getFeaturedImage = () => {
    if (event.featured_image_url) return event.featured_image_url;
    if (event.images && event.images.length > 0) {
      return event.images[0].image_url;
    }
    return null;
  };

  const featuredImageUrl = getFeaturedImage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const dateInfo = formatDate(event.event_date);

  // Centered layout: 1:1 image, date/location, children (e.g. registration), then about
  if (layout === 'centered') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 lg:items-start lg:text-left">
          {/* Title */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold break-words leading-tight">
              {event.title}
            </h1>
            {/* <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                {dateInfo.time}
              </span>
              <span className="hidden sm:inline text-muted-foreground/60">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                {dateInfo.full}
              </span>
              {event.location && (
                <>
                  <span className="hidden sm:inline text-muted-foreground/60">•</span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="break-words">{event.location}</span>
                  </span>
                </>
              )}
            </div> */}
          </div>

          {/* 1:1 Image */}
          <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-muted lg:mx-0">
            {featuredImageUrl ? (
              <ImageWithFallback
                src={featuredImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          {/* Right column: injected content (registration, etc.) */}
          {children && (
            <div className="block md:hidden w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:sticky lg:top-24">
              {children}
            </div>
          )}
          {/* About This Event */}
          {event.description && (
            <Card className="w-full text-left border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {linkifyText(paragraph)}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: injected content (registration, etc.) */}
        {children && (
          <div className="hidden md:block w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:sticky lg:top-24">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-muted">
        {featuredImageUrl ? (
          <ImageWithFallback
            src={featuredImageUrl}
            alt={event.title}
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
          </div>
        )}

        {/* Bottom gradient only — keeps the photo bright while text stays readable */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
          aria-hidden
        />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="p-4 sm:p-6 md:p-8 text-white w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Badge
                variant={
                  event.calculated_state === 'registration_open' ? 'default' :
                    event.calculated_state === 'registration_closed' ? 'secondary' :
                      event.calculated_state === 'ongoing' ? 'default' :
                        event.calculated_state === 'concluded' ? 'outline' :
                          'secondary'
                }
                className="text-[10px] sm:text-xs w-fit"
              >
                {event.calculated_state === 'registration_open' ? 'Registration Open' :
                  event.calculated_state === 'registration_closed' ? 'Registration Closed' :
                    event.calculated_state === 'ongoing' ? 'Event Ongoing' :
                      event.calculated_state === 'concluded' ? 'Event Concluded' :
                        event.calculated_state === 'cancelled' ? 'Cancelled' :
                          event.status === 'published' ? 'Live Event' : event.status}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4 break-words leading-tight">
              {event.title}
            </h1>

            <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                {dateInfo.full}
              </span>
              <span className="flex items-center gap-2 text-white/90">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                {dateInfo.time}
              </span>
              {event.location && (
                <span className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-words">{event.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Event Details */}
        <div className="space-y-4 sm:space-y-6">
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-left">About This Event</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <div className="prose prose-sm max-w-none text-left">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {linkifyText(paragraph)}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event Images Gallery */}
          {event.images && event.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Event Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {(() => {
                    // Deduplicate images by image_url to prevent showing the same image twice
                    const seenUrls = new Set<string>();
                    const uniqueImages = event.images
                      .sort((a, b) => b.display_order - a.display_order)
                      .filter((image) => {
                        if (!image || !image.image_url) return false;
                        const normalizedUrl = image.image_url
                          .split('?')[0]
                          .split('#')[0]  // Remove hash fragments
                          .replace(/\/+/g, '/')  // Normalize multiple slashes
                          .replace(/\/$/, '')  // Remove trailing slash
                          .toLowerCase()
                          .trim();
                        if (seenUrls.has(normalizedUrl)) {
                          console.debug('EventDetailView: Skipping duplicate image', normalizedUrl);
                          return false; // Skip duplicate
                        }
                        seenUrls.add(normalizedUrl);
                        return true;
                      });
                    return uniqueImages;
                  })().map((image) => (
                    <Dialog key={image.id}>
                      <DialogTrigger asChild>
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group">
                          <ImageWithFallback
                            src={image.image_url}
                            alt={image.caption || 'Event image'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                              {image.caption}
                            </div>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogTitle className="sr-only">
                          {image.caption || `${event.title} - Event Image`}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          {image.caption ? `Image: ${image.caption}` : `Image from ${event.title}`}
                        </DialogDescription>
                        <ImageWithFallback
                          src={image.image_url}
                          alt={image.caption || 'Event image'}
                          className="w-full h-auto max-h-[80vh] object-contain"
                        />
                        {image.caption && (
                          <p className="text-center mt-4 text-muted-foreground">
                            {image.caption}
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Hidden on mobile, shown in RegistrationForm */}
        {showRegistrationButton && (
          <div className="space-y-4 sm:space-y-6">
            {/* Registration Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-4">
                  <div className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Free Entry
                  </div>

                  {isRegistered ? (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        ✓ Registered
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        You will receive a QR code via email for check-in.
                      </p>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full min-h-[44px]"
                      onClick={onRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? 'Confirming...' : 'REGISTER NOW'}
                    </Button>
                  )}

                  <Separator />

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Registration is free</p>
                    <p>• CEDAT membership required</p>
                    <p>• QR code sent via email</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Calendar Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add to Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download calendar file to add this event to your calendar app.
                </p>
                <a
                  href={`${API_BASE_URL.replace(/\/+$/, '')}/api/events/${event.id}/calendar`}
                  download={`cedat-event-${event.id}.ics`}
                >
                  <Button variant="outline" className="w-full min-h-[44px]">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Download .ics File
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-left">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground">Time</p>
                      <p className="text-sm font-semibold text-foreground">{dateInfo.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-border/60">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground">Date</p>
                      <p className="text-sm font-semibold text-foreground break-words">{dateInfo.full}</p>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3 pt-3 border-t border-border/60">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground ring-1 ring-border/40">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">Location</p>
                        <p className="text-sm font-medium text-foreground break-words">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
