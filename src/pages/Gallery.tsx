import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryPhotos } from "@/components/gallery/GalleryPhotos";
import { generateSEO, seoConfigs } from "@/lib/seo";

export default function Gallery() {
  return (
    <>
      {generateSEO(seoConfigs.gallery)}
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          {/* Header */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-12 md:mb-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 break-words">
              Community Moments
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Capturing the energy of innovation. See what happens when the ecosystem unites.
            </p>
          </div>

          {/* Gallery Photos */}
          <section className="mb-8 sm:mb-12 md:mb-16">
            <GalleryPhotos />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
