import { useQuery, useMutation } from '@tanstack/react-query';

export interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
}

export function useHeroImages(enabled = true) {
  return useQuery<HeroImage[]>({
    queryKey: ['hero-images'],
    queryFn: async () => [
      { id: '1', image_url: 'https://picsum.photos/seed/hero1/1200/600', display_order: 1 },
      { id: '2', image_url: 'https://picsum.photos/seed/hero2/1200/600', display_order: 2 },
    ],
    enabled,
  });
}

export function useUploadHeroImages() {
  return useMutation({
    mutationFn: async (files: File[]) => ({ success: true }),
  });
}

export function useDeleteHeroImage() {
  return useMutation({
    mutationFn: async (id: string) => ({ success: true }),
  });
}
