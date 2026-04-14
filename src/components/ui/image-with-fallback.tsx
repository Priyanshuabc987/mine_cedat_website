
"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export function ImageWithFallback({ src, fallbackSrc = 'https://picsum.photos/seed/fallback/800/600', alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
