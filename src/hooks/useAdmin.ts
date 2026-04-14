import { useQuery, useMutation } from '@tanstack/react-query';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => ({
      total_members: 120,
      total_events: 15,
      published_events: 10,
      total_registrations: 450,
      attended_registrations: 380,
      attendance_rate: 84,
    }),
  });
}

export function useAdminMembers(params: any = {}) {
  return useQuery({
    queryKey: ['admin-members', params],
    queryFn: async () => ({
      items: [],
      total: 0,
    }),
  });
}

export function useAdminMember(id?: string) {
  return useQuery({
    queryKey: ['admin-member', id],
    queryFn: async () => null,
    enabled: !!id,
  });
}

export function useAdminEvents(params: any = {}) {
  return useQuery({
    queryKey: ['admin-events', params],
    queryFn: async () => ({
      items: [],
      total: 0,
    }),
  });
}

export function useAdminEventRegistrations(eventId: string) {
  return useQuery({
    queryKey: ['admin-event-registrations', eventId],
    queryFn: async () => ({
      items: [],
      statistics: {
        total_registered: 0,
        total_attended: 0,
        total_pending: 0,
      },
    }),
    enabled: !!eventId,
  });
}

export function useAdminAllRegistrations(params: any = {}) {
  return useQuery({
    queryKey: ['admin-all-registrations', params],
    queryFn: async () => ({
      items: [],
      total: 0,
    }),
    enabled: params.enabled !== false,
  });
}

export function useAdminRegistrationDetails(id?: string) {
  return useQuery({
    queryKey: ['admin-registration-details', id],
    queryFn: async () => null,
    enabled: !!id,
  });
}

export function useVerifyQRCode() {
  return useMutation({
    mutationFn: async (qrCode: string) => ({
      registration: { id: '1', event_id: '1', attendance_status: 'registered' },
      member: { name: 'John Doe', email: 'john@example.com', company: 'Acme' },
    }),
  });
}

export function useCheckInRegistration() {
  return useMutation({
    mutationFn: async (id: string) => ({ success: true }),
  });
}

export function useApproveRegistration() {
  return useMutation({
    mutationFn: async (id: string) => ({ success: true }),
  });
}
