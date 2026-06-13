import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface LocalImageProps {
  /** Path to a local image served from /public (e.g. "/brand/cover.webp"). */
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Initials/short text shown on the solid fallback when the image is missing. */
  fallbackText?: string;
  /** Eager-load above-the-fold images (banners/avatars). Defaults to lazy. */
  priority?: boolean;
}

/**
 * Renders a local image with a clean, *solid* (non-gradient) fallback when the
 * file is missing or fails to load — so layouts never break before the user
 * drops their real .webp assets into /public. Replaces the old gradient
 * placeholders across About / Projects / ProjectDetail.
 */
export function LocalImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackText,
  priority = false,
}: LocalImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-stone ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone text-charcoal-light"
          role="img"
          aria-label={alt}
        >
          {fallbackText ? (
            <span className="font-display text-3xl font-semibold text-charcoal/70 tracking-wide">
              {fallbackText}
            </span>
          ) : (
            <>
              <ImageOff className="w-6 h-6 text-charcoal/30" />
              <span className="font-hud text-[9px] uppercase tracking-widest text-charcoal/40">
                Add image
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LocalImage;
