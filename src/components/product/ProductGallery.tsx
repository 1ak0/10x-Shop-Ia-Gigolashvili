import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/** Main photo + clickable thumbnails (local state only). */
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-photo">
        {activeImage && (
          <img
            src={activeImage}
            alt={title}
            width={600}
            height={600}
            className="size-full object-contain p-8 mix-blend-multiply"
          />
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                className={`focus-ring block size-20 overflow-hidden rounded-xl border bg-photo transition-colors ${
                  index === activeIndex ? "border-accent" : "border-line hover:border-ink/30"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  width={80}
                  height={80}
                  className="size-full object-contain p-1.5 mix-blend-multiply"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
