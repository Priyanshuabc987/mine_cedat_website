
import { getGalleryPhotos, getGalleryVideos } from "@/lib/data/gallery";
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { Metadata } from "next";

// Generate SEO metadata for the page, providing a fallback for the null case.
export const metadata: Metadata = generateSEO(seoConfigs.gallery) || {};

/**
 * This is the main Server Component for the /gallery page.
 * It is responsible for fetching the initial data and passing it to a client component.
 */
export default async function GalleryPage() {
  // Fetch photos and videos in parallel for maximum efficiency.
  // This uses the cached data-fetching functions from /lib/data/gallery.ts
  const [photos, videos] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
  ]);

  // Render the client component and pass the fetched data as props.
  return <GalleryPageClient photos={photos} videos={videos} />;
}
