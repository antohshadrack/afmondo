export interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  caption: string;
  link: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    image: '/files/instagram1.jpg',
    likes: 1204,
    caption: 'Timeless elegance meets modern comfort',
    link: 'https://instagram.com/ afmondo'
  },
  {
    id: 2,
    image: '/files/instagram2.jpg',
    likes: 856,
    caption: 'Handcrafted with love and attention to detail',
    link: 'https://instagram.com/ afmondo'
  },
  {
    id: 3,
    image: '/files/instagram3.jpg',
    likes: 2103,
    caption: 'Where functionality meets artistry',
    link: 'https://instagram.com/ afmondo'
  },
  {
    id: 4,
    image: '/files/instagram4.jpg',
    likes: 1567,
    caption: 'Sustainable design for a better tomorrow',
    link: 'https://instagram.com/ afmondo'
  },
  {
    id: 5,
    image: '/files/instagram5.jpg',
    likes: 892,
    caption: 'Your space, your style, your story',
    link: 'https://instagram.com/ afmondo'
  },
  {
    id: 6,
    image: '/files/instagram6.jpg',
    likes: 1721,
    caption: 'Transform your home with peace of mind',
    link: 'https://instagram.com/ afmondo'
  }
];
