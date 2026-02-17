export interface BannerItem {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  link: string;
  bgcolor: string;
}

export const banners: BannerItem[] = [
  {
    id: 1,
    image: '/files/banner3.jpg',
    subtitle: 'SPECIAL OFFER',
    title: 'Recycled metal',
    link: '/collections/all',
    bgcolor: 'bg-blue-200'
  },
  {
    id: 2,
    image: '/files/banner4.jpg',
    subtitle: 'TOP PICKS',
    title: 'Custom woodwork',
    link: '/collections/all',
    bgcolor: 'bg-amber-100'
  },
  {
    id: 3,
    image: '/files/banner5.jpg',
    subtitle: 'MINIMAL COR',
    title: 'Handmade pottery',
    link: '/collections/all',
    bgcolor: 'bg-slate-200'
  }
];
