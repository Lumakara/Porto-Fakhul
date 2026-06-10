import { useState } from 'react';
import { User } from 'lucide-react';

interface BrandPhotoProps {
  /** Path to a .webp photo (e.g. "/brand/portrait-1.webp"). */
  src: string;
  alt: string;
  /** Short caption describing the pose/context. */
  caption?: string;
  className?: string;
  /** Index used to vary the placeholder gradient when the photo is absent. */
  variant?: number;
  /** Render the caption chip overlay. */
  showCaption?: boolean;
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #C68A7C 0%, #D4AF37 100%)',
  'linear-gradient(135deg, #A3B19B 0%, #C68A7C 100%)',
  'linear-gradient(135deg, #2A2A2A 0%, #C68A7C 100%)',
  'linear-gradient(135deg, #D4AF37 0%, #A3B19B 100%)',
  'linear-gradient(135deg, #C68A7C 0%, #2A2A2A 100%)',
];

/**
 * Displays a personal-branding photo. When the underlying .webp file is not
 * present (or fails to load), it falls back to a tasteful gradient placeholder
 * with the owner's initials — so the layout never breaks and real photos can be
 * dropped in later without code changes.
 */
export function BrandPhoto({
  src,
  alt,
  caption,
  className = '',
  variant = 0,
  showCaption = true,
}: BrandPhotoProps) {
  const [failed, setFailed] = useState(false);
  const gradient = PLACEHOLDER_GRADIENTS[variant % PLACEHOLDER_GRADIENTS.length];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center relative"
          style={{ background: gradient }}
          role="img"
          aria-label={alt}
        >
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
          <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
            <User className="w-6 h-6 text-white/90" />
          </div>
          <span className="mt-2 font-display text-2xl font-semibold text-white/95 tracking-wide">FR</span>
        </div>
      )}

      {showCaption && caption && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-charcoal/70 to-transparent">
          <span className="text-[10px] font-hud text-white/90 uppercase tracking-widest">{caption}</span>
        </div>
      )}
    </div>
  );
}
