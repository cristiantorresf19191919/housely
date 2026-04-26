'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { PropertyImage } from '@/types';

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [hero, ...rest] = images;
  if (!hero) return null;

  return (
    <div className="grid grid-cols-12 gap-2 md:gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative col-span-12 md:col-span-8 aspect-[4/3] overflow-hidden bg-cream-200"
      >
        <Image
          src={hero.url}
          alt={hero.alt}
          fill
          priority
          sizes="(min-width: 768px) 66vw, 100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
        {rest.slice(0, 3).map((img, i) => (
          <motion.div
            key={img.url}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative aspect-[4/3] overflow-hidden bg-cream-200"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
