import { useQuery, useMutation } from '@tanstack/react-query';

export interface GalleryImage {
  id: string;
  image_url: string;
  display_order: number;
  caption?: string;
}

export function useGalleryImages(enabled = true) {
  return useQuery<GalleryImage[]>({
    queryKey: ['gallery-images'],
    queryFn: async () => [
      { id: '1', image_url: 'https://picsum.photos/seed/gal1/800/600', display_order: 1, caption: 'Ecosystem Meetup' },
      { id: '2', image_url: 'https://picsum.photos/seed/gal2/800/600', display_order: 2, caption: 'Pitch Night' },
      { id: '3', image_url: 'https://picsum.photos/seed/gal3/800/600', display_order: 3, caption: 'Founder Workshop' },
    ],
    enabled,
  });
}

export function useUploadGalleryImages() {
  return useMutation({
    mutationFn: async (files: File[]) => ({ success: true }),
  });
}

export function useDeleteGalleryImage() {
  return useMutation({
    mutationFn: async (id: string) => ({ success: true }),
  });
}
