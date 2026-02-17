export interface ProductVariant {
  color: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  variants?: ProductVariant[];
  isNew?: boolean;
  isOnSale?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Minimal Chair',
    price: 299,
    originalPrice: 399,
    image: '/products/product6.jpg',
    slug: 'minimal-chair',
    variants: [
      { color: 'Gray', hex: '#808080' },
      { color: 'Black', hex: '#000000' },
      { color: 'Beige', hex: '#F5F5DC' }
    ],
    isOnSale: true
  },
  {
    id: 2,
    name: 'Wooden Table',
    price: 599,
    image: '/products/product5.jpg',
    slug: 'wooden-table',
    variants: [
      { color: 'Natural', hex: '#DEB887' },
      { color: 'Walnut', hex: '#5A4A42' }
    ],
    isNew: true
  },
  {
    id: 3,
    name: 'Leather Sofa',
    price: 1299,
    originalPrice: 1599,
    image: '/products/product4.jpg',
    slug: 'leather-sofa',
    variants: [
      { color: 'Brown', hex: '#8B4513' },
      { color: 'Charcoal', hex: '#36454F' }
    ],
    isOnSale: true
  },
  {
    id: 4,
    name: 'Pendant Lamp',
    price: 199,
    image: '/products/product3.jpg',
    slug: 'pendant-lamp',
    variants: [
      { color: 'White', hex: '#FFFFFF' },
      { color: 'Black', hex: '#000000' },
      { color: 'Gold', hex: '#FFD700' }
    ],
    isNew: true
  },
  {
    id: 5,
    name: 'Modern Cabinet',
    price: 449,
    image: '/products/product2.jpg',
    slug: 'modern-cabinet',
    variants: [
      { color: 'Oak', hex: '#D4A574' },
      { color: 'Ash', hex: '#C0C0C0' }
    ]
  },
  {
    id: 6,
    name: 'Area Rug',
    price: 349,
    originalPrice: 449,
    image: '/products/product1.jpg',
    slug: 'area-rug',
    variants: [
      { color: 'Gray', hex: '#808080' },
      { color: 'Taupe', hex: '#B38B6D' },
      { color: 'Ivory', hex: '#FFFFF0' }
    ],
    isOnSale: true
  },
  {
    id: 7,
    name: 'Wall Mirror',
    price: 279,
    image: '/products/product7.jpg',
    slug: 'wall-mirror',
    variants: [
      { color: 'Gold Frame', hex: '#FFD700' },
      { color: 'Silver Frame', hex: '#C0C0C0' }
    ]
  },
  {
    id: 8,
    name: 'Coffee Table',
    price: 399,
    image: '/products/product8.jpg',
    slug: 'coffee-table',
    variants: [
      { color: 'Walnut', hex: '#5A4A42' },
      { color: 'Maple', hex: '#D2B48C' }
    ]
  }
];
