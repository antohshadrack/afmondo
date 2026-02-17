"use client";

import { products } from "@/lib/data/products";
import ProductCard from '../shared/ProductCard';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ProductsGrid() {
  const { t } = useTranslation();

  return (
    <section className="section-product-v3 mt-16 md:mt-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            {t('productsGrid.title')}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('productsGrid.description')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="carousel"
              size="full"
              showActionButtons={true}
              textAlign="left"
              accentColor="green"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
