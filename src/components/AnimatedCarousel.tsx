import { useEffect, useState } from 'react';
import { logger } from '../lib/utils/logger';

interface AnimatedCarouselProps {
  images: string[];
  direction: 'left' | 'right';
}

export default function AnimatedCarousel({ images, direction }: AnimatedCarouselProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        try {
          const speed = direction === 'left' ? -2 : 2;
          const itemHeight = 288 + 24; // h-72 (288px) + gap-6 (24px)
          const maxOffset = itemHeight * images.length;
          const newOffset = prev + speed;
          
          // Reset cuando llega al final
          if (Math.abs(newOffset) >= maxOffset) {
            return 0;
          }
          return newOffset;
        } catch (error) {
          logger.error('Error in carousel animation:', error);
          return prev;
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  const doubledImages = [...images, ...images, ...images];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="flex flex-col gap-6"
        style={{
          transform: `translateY(${offset}px)`,
          height: 'fit-content',
          willChange: 'transform'
        }}
      >
        {doubledImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="flex-shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
          >
            <img
              src={image}
              alt={`Sample ${index}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Ocultar imagen si falla
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
