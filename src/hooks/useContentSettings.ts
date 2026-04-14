import { useQuery, useMutation } from '@tanstack/react-query';

export function useAdminEventsHeading(enabled = true) {
  return useQuery({
    queryKey: ['admin-events-heading'],
    queryFn: async () => "Startup Ecosystem Meetups & Events",
    enabled,
  });
}

export function useAdminEventsSubheading(enabled = true) {
  return useQuery({
    queryKey: ['admin-events-subheading'],
    queryFn: async () => "Dynamic Ecosystem of Nexus Communities",
    enabled,
  });
}

export function useUpdateEventsHeading() {
  return useMutation({
    mutationFn: async (value: string) => value,
  });
}

export function useUpdateEventsSubheading() {
  return useMutation({
    mutationFn: async (value: string) => value,
  });
}

export function usePublicEventsHeading(enabled = true) {
  return useQuery({
    queryKey: ['public-events-heading'],
    queryFn: async () => "Startup Ecosystem Meetups & Events",
    enabled,
  });
}

export function usePublicEventsSubheading(enabled = true) {
  return useQuery({
    queryKey: ['public-events-subheading'],
    queryFn: async () => "Dynamic Ecosystem of Nexus Communities",
    enabled,
  });
}
