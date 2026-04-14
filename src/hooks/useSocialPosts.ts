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
        id: '1',
        platform: 'instagram',
        post_url: 'https://www.instagram.com/p/C4p_...',
        created_at: new Date().toISOString(),
      }
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
