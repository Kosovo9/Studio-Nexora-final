import { useEffect, useState } from 'react';

interface AnimatedCarouselProps {
  images: string[];
  direction: 'left' | 'right';
}

export default function AnimatedCarousel({ images, direction }: AnimatedCarouselProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const speed = direction === 'left' ? -1 : 1;
        return prev + speed;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction]);

  const doubledImages = [...images, ...images, ...images];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="flex gap-4 h-full"
        style={{
          transform: `translateX(${offset}px)`,
          width: 'fit-content'
        }}
      >
        {doubledImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 h-64 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20"
          >
            <img
              src={image}
              alt={`Sample ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
