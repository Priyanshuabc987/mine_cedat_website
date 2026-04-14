import { useQuery, useMutation } from '@tanstack/react-query';

export interface SocialPost {
  id: string;
  post_url: string;
  platform: 'instagram' | 'linkedin';
  created_at: string;
}

export function useSocialPosts() {
  return useQuery<SocialPost[]>({
    queryKey: ['social-posts'],
    queryFn: async () => [],
  });
}

export function useAllSocialPosts() {
  return useQuery<SocialPost[]>({
    queryKey: ['all-social-posts'],
    queryFn: async () => [
      {
        id: "mock-1",
        platform: "linkedin",
        post_url: "https://www.linkedin.com/posts/bmsitm-cedat-career-ugcPost-7385585063482228736-5aRs?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD-8UjYBoMlRh5AE-Fgzec5ad8tJ6RDHCGw",
        created_at: new Date("2026-04-10T10:00:00Z").toISOString(),
        updated_at: new Date("2026-04-10T10:00:00Z").toISOString(),
      },
      {
        id: "mock-2",
        platform: "linkedin",
        post_url: "https://www.linkedin.com/posts/akashakku_cedat-savishkar-srishti-ugcPost-7447161004880453632-EdH-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD-8UjYBoMlRh5AE-Fgzec5ad8tJ6RDHCGw",
        created_at: new Date("2026-04-11T12:30:00Z").toISOString(),
        updated_at: new Date("2026-04-11T12:30:00Z").toISOString(),
      },
      {
        id: "mock-3",
        platform: "linkedin",
        post_url: "https://www.linkedin.com/posts/akashakku_cedat-founders-dinner-activity-7445377869280796672-v2Jo?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD-8UjYBoMlRh5AE-Fgzec5ad8tJ6RDHCGw",
        created_at: new Date("2026-04-11T12:30:00Z").toISOString(),
        updated_at: new Date("2026-04-11T12:30:00Z").toISOString(),
      },
      {
        id: "mock-4",
        platform: "instagram",
        post_url: "https://www.instagram.com/reel/DWnxRbkgP-U/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        created_at: new Date("2026-04-11T12:30:00Z").toISOString(),
        updated_at: new Date("2026-04-11T12:30:00Z").toISOString(),
      },
      {
        id: "mock-5",
        platform: "instagram",
        post_url: "https://www.instagram.com/p/DWlqsVWk0Ln/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        created_at: new Date("2026-04-11T12:30:00Z").toISOString(),
        updated_at: new Date("2026-04-11T12:30:00Z").toISOString(),
      },
    ],
  });
}

export function useAddSocialPost() {
  return useMutation({
    mutationFn: async (data: { post_url: string; platform: string }) => ({ id: 'new-post' }),
  });
}

export function useDeleteSocialPost() {
  return useMutation({
    mutationFn: async (id: string) => ({ success: true }),
  });
}
