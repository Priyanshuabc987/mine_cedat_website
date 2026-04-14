import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ZoomIn, Filter, Calendar, MapPin } from "lucide-react";
import { eventsAPI } from '@/lib/api';
import { format } from 'date-fns';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
}

export function EventGallery() {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Fetch published events to get their images
  // Fetch all events by using a large page_size and fetching multiple pages if needed
  const { data: events, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['events-gallery'],
    queryFn: async () => {
      try {
        // First, fetch with large page_size to get as many as possible
        const firstResponse = await eventsAPI.listEvents({ page_size: 1000 });
        if (!firstResponse.ok) {
          throw new Error(`Failed to fetch events: ${firstResponse.status}`);
        }
        const firstData = await firstResponse.json();
        
        // If there are more events, fetch remaining pages
        const totalEvents = firstData.total || 0;
        const firstPageSize = firstData.items?.length || 0;
        
        if (totalEvents > firstPageSize) {
          // Fetch remaining pages
          const remainingPages = Math.ceil((totalEvents - firstPageSize) / 1000);
          const allItems = [...(firstData.items || [])];
          
          for (let page = 2; page <= remainingPages + 1; page++) {
            const response = await eventsAPI.listEvents({ 
              page_size: 1000,
              page: page 
            });
            if (response.ok) {
              const pageData = await response.json();
              allItems.push(...(pageData.items || []));
            }
          }
          
          return {
            ...firstData,
            items: allItems,
            total: totalEvents
          };
        }
        
        return firstData;
      } catch (error) {
        console.error('Error fetching events for gallery:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Extract all images from events and group by year
  const allImages: GalleryImage[] = [];
  const eventsByYear: Record<number, any[]> = {};
  // Track unique image URLs to prevent duplicates
  const seenImageUrls = new Set<string>();
  
  // Safely process events data
  if (events && events.items && Array.isArray(events.items)) {
    events.items.forEach((event: any) => {
      if (!event || !event.event_date) return;
      
      try {
        const eventDate = new Date(event.event_date);
        if (isNaN(eventDate.getTime())) {
          console.warn('Invalid event date:', event.event_date);
          return;
        }
        
        const eventYear = eventDate.getFullYear();
        if (!eventsByYear[eventYear]) {
          eventsByYear[eventYear] = [];
        }
        eventsByYear[eventYear].push(event);
        
        // Process event images with deduplication
        // Also check if featured_image_url matches any gallery image to avoid duplicates
        const featuredImageUrl = event.featured_image_url;
        let featuredImageNormalized: string | null = null;
        if (featuredImageUrl) {
          featuredImageNormalized = featuredImageUrl
            .split('?')[0]
            .split('#')[0]  // Remove hash fragments
            .replace(/\/+/g, '/')  // Normalize multiple slashes
            .replace(/\/$/, '')  // Remove trailing slash
            .toLowerCase()
            .trim();
          seenImageUrls.add(featuredImageNormalized);
        }
        
        if (event.images && Array.isArray(event.images)) {
          event.images.forEach((image: any) => {
            if (image && image.image_url) {
              // Normalize image URL for comparison (remove query params, normalize path, lowercase, remove trailing slash)
              const normalizedUrl = image.image_url
                .split('?')[0]
                .split('#')[0]  // Remove hash fragments
                .replace(/\/+/g, '/')  // Normalize multiple slashes
                .replace(/\/$/, '')  // Remove trailing slash
                .toLowerCase()
                .trim();
              
              // Skip if this image is the same as the featured image (already shown in hero)
              if (featuredImageNormalized && normalizedUrl === featuredImageNormalized) {
                console.debug('Skipping featured image from gallery:', normalizedUrl);
                return;
              }
              
              // Only add if we haven't seen this image URL before
              if (!seenImageUrls.has(normalizedUrl)) {
                seenImageUrls.add(normalizedUrl);
                allImages.push({
                  id: image.id || `img-${Math.random()}`,
                  image_url: image.image_url,
                  caption: image.caption,
                  event_title: event.title,
                  event_date: event.event_date,
                  event_location: event.location,
                });
              } else {
                // Log duplicate for debugging
                console.debug('Skipping duplicate image:', normalizedUrl);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    });
  }

  // Sort years in descending order
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Filter images by selected event and deduplicate
  const filteredImagesRaw = selectedEvent === 'all'
    ? allImages
    : allImages.filter(img => img.event_title === selectedEvent);
  
  // Final deduplication pass to ensure no duplicates by image_url (more aggressive normalization)
  const imageUrlMap = new Map<string, GalleryImage>();
  filteredImagesRaw.forEach(img => {
    const normalizedUrl = img.image_url
      .split('?')[0]
      .split('#')[0]  // Remove hash fragments
      .replace(/\/+/g, '/')  // Normalize multiple slashes
      .replace(/\/$/, '')  // Remove trailing slash
      .toLowerCase()
      .trim();
    if (!imageUrlMap.has(normalizedUrl)) {
      imageUrlMap.set(normalizedUrl, img);
    } else {
      console.debug('Final deduplication: skipping duplicate', normalizedUrl);
    }
  });
  const filteredImages = Array.from(imageUrlMap.values());

  // Get unique event names for filter
  const eventNames = Array.from(new Set(allImages.map(img => img.event_title).filter(Boolean)));

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground space-y-4">
          <div className="text-6xl">⚠️</div>
          <div>
            <h3 className="text-xl font-medium mb-2">Failed to load gallery</h3>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where events data is not available
  if (!events || !events.items || !Array.isArray(events.items)) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground space-y-4">
          <div className="text-6xl">📷</div>
          <div>
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-sm">Event photos will appear here as they are uploaded.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      {/* Filter */}
      {eventNames.length > 0 && (
        <div className="flex items-center justify-center mb-6 sm:mb-8 px-4 sm:px-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {eventNames.map((eventName) => (
                  <SelectItem key={eventName} value={eventName}>
                    {eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Year-Grouped Narrative Layout */}
      {selectedEvent === 'all' && sortedYears.length > 0 && (
        <div className="space-y-12 mb-12">
          {sortedYears.map((year) => {
            const yearEvents = eventsByYear[year];
            const featuredEvent = yearEvents.find((e: any) => e.is_featured) || yearEvents[0];
            const otherEvents = yearEvents.filter((e: any) => e.id !== featuredEvent?.id);
            
            return (
              <div key={year} className="space-y-8">
                {/* Year Separator */}
                <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-0">
                  <div className="flex-1 h-px bg-border" />
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground whitespace-nowrap">{year}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Hero Event (Landmark Event) */}
                {featuredEvent && featuredEvent.featured_image_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <Link href={`/events/${featuredEvent.id}`}>
                      <div className="aspect-[21/9] relative overflow-hidden">
                        <ImageWithFallback
                          src={featuredEvent.featured_image_url}
                          alt={featuredEvent.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{format(new Date(featuredEvent.event_date), 'MMMM d, yyyy')}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-1 sm:mb-2 break-words">{featuredEvent.title}</h3>
                          {featuredEvent.description && (
                            <p className="text-xs sm:text-sm text-white/90 line-clamp-2">{featuredEvent.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Supporting Events Grid */}
                {otherEvents.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {otherEvents.map((event: any) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                        className="relative rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <Link href={`/events/${event.id}`}>
                          <div className="aspect-square relative overflow-hidden">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                              <h4 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 break-words">{event.title}</h4>
                              <p className="text-[10px] sm:text-xs text-white/80">
                                {format(new Date(event.event_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Show empty state if no images and not loading */}
      {!eventsLoading && filteredImages.length === 0 && allImages.length === 0 && sortedYears.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground space-y-4">
            <div className="text-6xl">📷</div>
            <div>
              <h3 className="text-xl font-medium mb-2">No images yet</h3>
              <p className="text-sm">Event photos will appear here as they are uploaded.</p>
            </div>
          </div>
        </div>
      )}

      {/* Show masonry gallery if we have images (when filtering by event) */}
      {filteredImages.length > 0 && selectedEvent !== 'all' && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, index) => {
            // Use normalized URL as key to ensure React doesn't render duplicates
            const normalizedKey = image.image_url
              .split('?')[0]
              .split('#')[0]
              .replace(/\/+/g, '/')
              .replace(/\/$/, '')
              .toLowerCase()
              .trim();
            const uniqueKey = `${image.id}-${normalizedKey}`;
            return (
            <Dialog key={uniqueKey}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden bg-muted"
                >
                  <ImageWithFallback
                    src={image.image_url}
                    alt={image.caption || `${image.event_title} event photo`}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Overlay with event info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-white space-y-2">
                      {image.event_title && (
                        <div className="font-medium text-sm">{image.event_title}</div>
                      )}
                      {image.event_date && (
                        <div className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(image.event_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                      {image.event_location && (
                        <div className="text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {image.event_location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2">
                        <ZoomIn className="w-4 h-4" />
                        <span className="text-xs font-medium">View Full</span>
                      </div>
                    </div>
                  </div>

                  {/* Caption overlay for non-hover state */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                      <p className="text-xs line-clamp-2">{image.caption}</p>
                    </div>
                  )}
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none">
                <DialogTitle className="sr-only">
                  {image.event_title ? `${image.event_title} - Event Photo` : 'Event Photo'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {image.caption || `Photo from ${image.event_title || 'event'}`}
                </DialogDescription>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="relative w-full h-auto bg-black/90 rounded-lg overflow-hidden flex items-center justify-center p-2"
                >
                  <ImageWithFallback
                    src={image.image_url}
                    alt={image.caption || `${image.event_title} event photo`}
                    className="max-h-[85vh] w-auto object-contain rounded-md"
                  />

                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
                    <div className="space-y-2">
                      {image.event_title && (
                        <h3 className="font-medium">{image.event_title}</h3>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        {image.event_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(image.event_date), 'PPP')}
                          </div>
                        )}
                        {image.event_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.event_location}
                          </div>
                        )}
                      </div>
                      {image.caption && (
                        <p className="text-sm text-gray-300">{image.caption}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!eventsLoading && allImages.length > 0 && selectedEvent !== 'all' && (
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Showing {filteredImages.length} of {allImages.length} community moments
          </p>
        </div>
      )}
    </div>
  );
}
