import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useGalleryImages } from "@/hooks/useGallery";

export function GalleryPhotos() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data, isLoading, isError } = useGalleryImages(true);
  const galleryImages = (data ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      src: img.image_url,
      alt: "CEDAT gallery image",
    }));

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading gallery images...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load gallery images. Please refresh and try again.
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground space-y-4">
          <div className="text-6xl">📷</div>
          <div>
            <h3 className="text-xl font-medium mb-2">No gallery photos yet</h3>
            <p className="text-sm">Gallery photos will appear here after admins upload them.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {galleryImages.map((image, index) => (
          <Dialog key={image.src} open={selectedIndex === index} onOpenChange={(open) => setSelectedIndex(open ? index : null)}>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden bg-muted"
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-3">
                    <ZoomIn className="w-6 h-6 text-foreground" />
                  </div>
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none">
              <DialogTitle className="sr-only">{image.alt}</DialogTitle>
              <DialogDescription className="sr-only">Gallery photo - {image.alt}</DialogDescription>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full bg-black/90 rounded-lg overflow-hidden flex items-center justify-center p-2"
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="max-h-[85vh] w-auto object-contain rounded-md"
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
