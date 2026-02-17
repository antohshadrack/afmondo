"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import ProductCard, { type Product } from '../shared/ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
          <Link 
            href={viewAllLink}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors"
          >
            {t('common.viewAll')}
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 hidden lg:block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="carousel"
                size="md"
                showActionButtons={true}
                showBrand={true}
                textAlign="left"
                accentColor="orange"
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 hidden lg:block"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
