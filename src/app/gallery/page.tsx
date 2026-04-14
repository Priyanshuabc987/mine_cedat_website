
"use client";

import { EventGallery } from "@/components/gallery/EventGallery";
import { GalleryPhotos } from "@/components/gallery/GalleryPhotos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
          Community <span className="text-accent italic">Moments</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Capturing the energy of innovation. See what happens when the ecosystem unites across workshops, pitches, and conferences.
        </p>
      </div>

      <Tabs defaultValue="events" className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <TabsList className="rounded-full p-1 bg-muted/50 border h-auto">
            <TabsTrigger value="events" className="rounded-full px-8 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
              Event Stories
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-full px-8 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
              All Photos
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="events">
          <EventGallery />
        </TabsContent>
        <TabsContent value="photos">
          <GalleryPhotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
