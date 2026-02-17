export interface Slide {
  id: number;
  image: string;
  mobileImage: string;
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    image: '/files/banner24.jpg',
    mobileImage: '/files/banner24.jpg',
    subtitle: 'furniture store',
    title: 'Beautify your home',
    description: 'The perfect place for every modern and home furniture store there are many different styles to choose from',
    ctaText: 'SHOP NOW',
    ctaLink: '/collections/all'
  },
  {
    id: 2,
    image: '/files/banner25.jpg',
    mobileImage: '/files/banner25.jpg',
    subtitle: 'furniture store',
    title: 'best furniture',
    description: 'The perfect place for every modern and home furniture store.',
    ctaText: 'SHOP NOW',
    ctaLink: '/collections/all'
  }
];
