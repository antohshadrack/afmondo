export interface FlashSaleProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  itemsLeft: number;
  slug: string;
}

export const flashSaleProducts: FlashSaleProduct[] = [
  {
    id: 1,
    name: 'Delron 2 Burner Electric Cooker',
    price: 188.00,
    originalPrice: 250.00,
    image: '/products/product1.jpg',
    discount: 25,
    itemsLeft: 2,
    slug: 'delron-2-burner'
  },
  {
    id: 2,
    name: 'Delron DB313 2 in 1 Blender',
    price: 175.00,
    originalPrice: 398.00,
    image: '/products/product2.jpg',
    discount: 56,
    itemsLeft: 10,
    slug: 'delron-db313'
  },
  {
    id: 3,
    name: 'No Band 64GB USB3.0 Flash Drive',
    price: 60.00,
    originalPrice: 182.00,
    image: '/products/product3.jpg',
    discount: 67,
    itemsLeft: 12,
    slug: 'no-band-usb'
  },
  {
    id: 4,
    name: 'Black Cross Splicing Chain Necklace',
    price: 20.00,
    originalPrice: 75.00,
    image: '/products/product4.jpg',
    discount: 73,
    itemsLeft: 9,
    slug: 'cross-necklace'
  },
  {
    id: 5,
    name: 'Pro4 True Wireless Earbuds',
    price: 53.00,
    originalPrice: 130.00,
    image: '/products/product5.jpg',
    discount: 59,
    itemsLeft: 11,
    slug: 'pro4-earbuds'
  },
  {
    id: 6,
    name: 'CALLONG CA 800 Wireless Speaker',
    price: 88.00,
    originalPrice: 163.41,
    image: '/products/product6.jpg',
    discount: 46,
    itemsLeft: 26,
    slug: 'callong-ca800'
  }
];

export const flashSaleEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
