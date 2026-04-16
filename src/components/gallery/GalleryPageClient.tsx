
"use client";

import { useState, useEffect } from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryPageClientProps {
  photos: GalleryItem[];
  videos: GalleryItem[];
}

// Custom hook to determine if the component has been hydrated.
// This is the standard solution to prevent hydration mismatch errors with UI libraries like Radix.
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
};

export function GalleryPageClient({ photos, videos }: GalleryPageClientProps) {
  const isHydrated = useHydrated();

  const Header = () => (
    <div className="container mx-auto px-4 text-center mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
        Community <span className="text-primary italic">Moments</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Capturing the energy of innovation. See what happens when the ecosystem unites.
      </p>
    </div>
  );

  const SkeletonLoader = () => (
    <div className="container mx-auto px-4">
      <div className="flex justify-center mb-12">
        <div className="rounded-full p-1 bg-muted/50 border h-auto flex gap-1">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl break-inside-avoid" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <Header />
      
      {isHydrated ? (
        <Tabs defaultValue="photos" className="container mx-auto px-4">
          <div className="flex justify-center mb-12">
            <TabsList className="rounded-full p-1 bg-muted/50 border h-auto">
              <TabsTrigger value="photos" className="rounded-full px-8 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Photos
              </TabsTrigger>
              <TabsTrigger value="videos" className="rounded-full px-8 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Videos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="photos">
            <GalleryGrid items={photos} />
          </TabsContent>
          <TabsContent value="videos">
            <GalleryGrid items={videos} />
          </TabsContent>
        </Tabs>
      ) : (
        <SkeletonLoader />
      )}
    </div>
  );
}
