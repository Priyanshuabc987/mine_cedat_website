
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled';
  is_featured: boolean;
  category?: string;
  theme?: string;
  featured_image_url?: string;
  external_registration_url?: string;
  calculated_state?: string;
  images?: any[];
}

export interface EventListResponse {
  items: Event[];
  total: number;
}

export function useEvents(params: any = {}) {
  return useQuery<EventListResponse>({
    queryKey: ['events', params],
    queryFn: async () => ({
      items: [
        {
          id: '1',
          title: 'FIC Flagship Summit 2024',
          event_date: new Date(Date.now() + 86400000 * 10).toISOString(),
          location: 'Innovation Hub, Bengaluru',
          status: 'published',
          is_featured: true,
          category: 'FIC',
          calculated_state: 'registration_open',
          featured_image_url: 'https://picsum.photos/seed/fic/800/800',
          description: 'The ultimate gathering for founders and investors.'
        }
      ],
      total: 1
    }),
  });
}

export function useEvent(id: string) {
  return useQuery<Event | null>({
    queryKey: ['event', id],
    queryFn: async () => null,
  });
}

export function useFICEvent() {
  return useQuery<Event | null>({
    queryKey: ['fic-event'],
    queryFn: async () => ({
      id: 'fic-1',
      title: 'Founders Innovation Circle (FIC)',
      event_date: new Date(Date.now() + 86400000 * 30).toISOString(),
      location: 'The Nexus, MG Road',
      status: 'published',
      is_featured: true,
      category: 'FIC',
      calculated_state: 'registration_open',
      featured_image_url: 'https://picsum.photos/seed/fic-main/800/800',
      description: 'Join our flagship community event.'
    }),
  });
}

export function useRegisterForEvent() {
  return useMutation({
    mutationFn: async ({ eventId, metadata }: { eventId: string; metadata: any }) => ({ id: 'reg-1', attendance_status: 'registered' }),
  });
}

export function useUnregisterForEvent() {
  return useMutation({
    mutationFn: async (registrationId: string) => ({ success: true }),
  });
}

export function useCreateEvent() { return useMutation({ mutationFn: async (data: any) => ({ id: 'new-id' }) }); }
export function useUpdateEvent() { return useMutation({ mutationFn: async ({ eventId, eventData }: any) => ({ id: eventId }) }); }
export function useDeleteEvent() { return useMutation({ mutationFn: async (id: string) => ({ success: true }) }); }
export function useUploadEventImage() { return useMutation({ mutationFn: async ({ eventId, file }: any) => ({ image_url: '' }) }); }
export function useUpdateEventImage() { return useMutation({ mutationFn: async ({ eventId, imageId, body }: any) => ({ success: true }) }); }
export function useDeleteEventImage() { return useMutation({ mutationFn: async ({ eventId, imageId }: any) => ({ success: true }) }); }
