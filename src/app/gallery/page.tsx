
import Image from "next/image";

const GALLERY_IMAGES = [
  { id: 1, src: "https://picsum.photos/seed/g1/600/800", alt: "Community Event", span: "row-span-2" },
  { id: 2, src: "https://picsum.photos/seed/g2/600/400", alt: "Pitch Day", span: "" },
  { id: 3, src: "https://picsum.photos/seed/g3/400/600", alt: "Networking", span: "row-span-2" },
  { id: 4, src: "https://picsum.photos/seed/g4/800/600", alt: "Workshop", span: "col-span-2" },
  { id: 5, src: "https://picsum.photos/seed/g5/600/600", alt: "Startup Award", span: "" },
  { id: 6, src: "https://picsum.photos/seed/g6/400/400", alt: "Team Meeting", span: "" },
  { id: 7, src: "https://picsum.photos/seed/g7/800/400", alt: "Conference Stage", span: "col-span-2" },
  { id: 8, src: "https://picsum.photos/seed/g8/400/800", alt: "Happy Founders", span: "row-span-2" },
  { id: 9, src: "https://picsum.photos/seed/g9/600/400", alt: "Expo Hall", span: "" },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline">Community Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a peek into the vibrant life of the Cedat community. Moments captured across workshops, pitches, and conferences.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
        {GALLERY_IMAGES.map((img) => (
          <div key={img.id} className={`relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 ${img.span}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white font-semibold">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
