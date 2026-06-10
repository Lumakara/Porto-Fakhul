export interface BrandPhotoItem {
  src: string;
  alt: string;
  caption: string;
}

/** Personal branding photos. Drop matching .webp files in /public/brand/. */
export const brandPhotos: BrandPhotoItem[] = [
  { src: '/public/brand/portrait-1.webp', alt: 'Fakhul Rohman — studio portrait', caption: 'Studio' },
  { src: '/public/brand/portrait-2.webp', alt: 'Fakhul Rohman — at the workstation', caption: 'At work' },
  { src: '/public/brand/portrait-3.webp', alt: 'Fakhul Rohman — candid outdoor', caption: 'Outdoor' },
  { src: '/public/brand/portrait-4.webp', alt: 'Fakhul Rohman — presenting', caption: 'Speaking' },
  { src: '/public/brand/portrait-5.webp', alt: 'Fakhul Rohman — casual', caption: 'Casual' },
];
