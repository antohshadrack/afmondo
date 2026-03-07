"use client";

import ProductCarousel from './components/sections/ProductCarousel';
import type { DbCategory } from '@/lib/supabase/queries';
import type { Product } from './components/shared/ProductCard';

interface CategoryEntry {
  category: DbCategory;
  products: Product[];
}

interface HomeClientProps {
  categoryData: CategoryEntry[];
}

export default function HomeClient({ categoryData }: HomeClientProps) {
  // Only render a carousel if the category has at least one product
  const withProducts = categoryData.filter((entry) => entry.products.length > 0);

  if (withProducts.length === 0) return null;

  return (
    <>
      {withProducts.map((entry) => (
        <ProductCarousel
          key={entry.category.id}
          title={entry.category.name}
          products={entry.products}
          viewAllLink={`/${entry.category.slug}`}
        />
      ))}
    </>
  );
}
