export interface BrandPhotoItem {
  src: string;
  alt: string;
  caption: string;
}

/** Personal branding photos. Drop matching .webp files in /public/brand/.
 *  Files in `public/` are served from the site root, so the path is
 *  `/brand/...` (NOT `/public/brand/...`). */
export const brandPhotos: BrandPhotoItem[] = [
  { src: '/brand/portrait-1.webp', alt: 'Fakhul Rohman — studio portrait', caption: 'Studio' },
  { src: '/brand/portrait-2.webp', alt: 'Fakhul Rohman — at the workstation', caption: 'At work' },
  { src: '/brand/portrait-3.webp', alt: 'Fakhul Rohman — candid outdoor', caption: 'Outdoor' },
  { src: '/brand/portrait-4.webp', alt: 'Fakhul Rohman — presenting', caption: 'Speaking' },
  { src: '/brand/portrait-5.webp', alt: 'Fakhul Rohman — casual', caption: 'Casual' },
];
