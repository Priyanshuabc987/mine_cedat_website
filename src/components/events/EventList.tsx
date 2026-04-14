
import { useState, useCallback, useEffect } from 'react';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChevronDown } from 'lucide-react';
import { useEvents, EventListResponse, Event } from '@/hooks/useEvents';
import { eventsAPI } from '@/lib/api';

interface EventListProps {
  statusFilter?: string;
  showStatusFilter?: boolean;
  className?: string;
  limit?: number; // Add a limit for the number of events to show
}

const PAGE_SIZE = 9; // Changed to 9 for better grid layout (3x3)

export function EventList({
  statusFilter,
  showStatusFilter = false,
  className = "",
  limit
}: EventListProps) {
  const ALL_VALUE = '__all__';
  const [page, setPage] = useState(1);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(statusFilter && statusFilter !== '' ? statusFilter : ALL_VALUE);

  const statusFilterParam = selectedStatusFilter !== ALL_VALUE ? selectedStatusFilter : undefined;

  const { data, isLoading, error } = useEvents({
    status_filter: statusFilterParam,
    page: 1,
    page_size: limit || PAGE_SIZE, // Use limit if provided, otherwise use page size
  });

  const eventsData = data as EventListResponse | undefined;

  useEffect(() => {
    if (eventsData?.items) {
        setAllEvents(eventsData.items);
        setTotal(eventsData.total);
    }
  }, [eventsData?.items, eventsData?.total]);

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatusFilter(value);
    setPage(1);
    setAllEvents([]);
    setTotal(0);
  };

  const loadMore = useCallback(async () => {
    if (limit) return; // Don't load more if a limit is set

    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const res = await eventsAPI.listEvents({
        status_filter: statusFilterParam,
        page: nextPage,
        page_size: PAGE_SIZE,
      });
      const json = await res.json();
      setAllEvents((prev) => [...prev, ...json.items]);
      setPage(nextPage);
      setTotal(json.total);
    } catch {
      // Error is handled by the main error state
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, statusFilterParam, limit]);

  // Sort so that upcoming events (closest future date) appear first,
  const sortedEvents = [...allEvents].sort((a, b) => {
    const now = new Date();
    const aDate = new Date(a.event_date);
    const bDate = new Date(b.event_date);

    const aIsPast = aDate.getTime() < now.getTime() || a.calculated_state === 'concluded' || a.calculated_state === 'cancelled';
    const bIsPast = bDate.getTime() < now.getTime() || b.calculated_state === 'concluded' || b.calculated_state === 'cancelled';

    if (aIsPast !== bIsPast) {
      return aIsPast ? 1 : -1; // Upcoming events first
    }
    
    // For events in the same category (both past or both upcoming), sort by date
    if (aIsPast) {
      return bDate.getTime() - aDate.getTime(); // Most recent past events first
    } else {
      return aDate.getTime() - bDate.getTime(); // Nearest upcoming events first
    }
  });

  const hasMore = total > sortedEvents.length && !limit; // No "Show More" if limit is set

  if (isLoading && sortedEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && sortedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load events. Please try again later.</p>
      </div>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showStatusFilter && (
        <div className="mb-4 sm:mb-6">
          <Select value={selectedStatusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-48 min-h-[44px] rounded-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All Events</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 items-stretch">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="min-h-[44px] px-8 rounded-full"
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-2" />
            )}
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
