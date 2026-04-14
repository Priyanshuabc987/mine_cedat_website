"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/images";
import { useHeroImages } from "@/hooks/useHero";

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: heroImagesFromApi } = useHeroImages(true);

  const heroImages = (heroImagesFromApi ?? [])
    .map((img) => getImageUrl(img.image_url))
    .filter(Boolean);

  // Auto-rotate images
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Reset index if images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [heroImages.length]);

  const hasImages = heroImages.length > 0;

  return (
    <section className="relative w-full h-screen min-h-[500px] overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt={`Hero ${currentImageIndex}`}
              className="w-full h-full object-cover "
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />
        )}

        {/* 🔵 Blue gradient ONLY at bottom */}
       {/* 🎯 Bottom-only gradient (FIXED) */}
<div className="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-green-900/90 to-transparent z-10" />

{/* Optional: readability */}
<div className="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-black/60 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-end px-4 sm:px-6 md:px-8 py-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          Dynamic Ecosystem of Nexus Communities
          {/* <br className="hidden sm:block" /> */}
                      

        </motion.h1>

        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-sm sm:text-base md:text-lg text-white/80 text-center max-w-2xl"
        >
          Connecting startups, students, and innovators into one powerful network.
        </motion.p> */}

      </div>
    </section>
  );
}