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
  showRegistrationButtons?: boolean;
  onRegister?: (eventId: string) => void;
  registeredEventIds?: string[];
  className?: string;
}

const PAGE_SIZE = 6;

export function EventList({
  statusFilter,
  showStatusFilter = false,
  showRegistrationButtons = false,
  onRegister,
  registeredEventIds = [],
  className = ""
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
    page_size: PAGE_SIZE,
  });

  const eventsData = data as EventListResponse | undefined;

  // Sync initial data when first page loads
  useEffect(() => {
    if (eventsData?.items && page === 1) {
      setAllEvents(eventsData.items);
      setTotal(eventsData.total);
    }
  }, [eventsData?.items, eventsData?.total, page]);

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatusFilter(value);
    setPage(1);
    setAllEvents([]);
    setTotal(0);
  };

  const loadMore = useCallback(async () => {
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
      // Error handled by UI
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, statusFilterParam]);

  const displayedEvents = allEvents.length > 0 ? allEvents : (eventsData?.items ?? []);

  // Sort so that upcoming events (closest future date) appear first,
  // and completed/past events are pushed to the end.
  const sortedEvents = [...displayedEvents].sort((a, b) => {
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
      // Upcoming first, past last
      return aPast ? 1 : -1;
    }

    // Within each group, sort by date ascending (nearest first)
    return aDate.getTime() - bDate.getTime();
  });

  const displayTotal = allEvents.length > 0 ? total : (eventsData?.total ?? 0);
  const hasMore = displayTotal > sortedEvents.length;

  if (isLoading && displayedEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && displayedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load events. Please try again.</p>
      </div>
    );
  }

  if (!displayedEvents.length && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Status Filter */}
      {showStatusFilter && (
        <div className="mb-4 sm:mb-6">
          <Select value={selectedStatusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 items-stretch">
        {sortedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showRegistrationButton={showRegistrationButtons}
            onRegister={() => onRegister?.(event.id)}
            isRegistered={registeredEventIds.includes(event.id)}
          />
        ))}
      </div>

      {/* Show More Button */}
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
