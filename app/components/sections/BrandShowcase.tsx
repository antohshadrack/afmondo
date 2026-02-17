"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface Brand {
  id: string;
  name: string;
  href: string;
}

const brands: Brand[] = [
  // Vehicles
  { id: '1', name: 'Toyota', href: '/brands/toyota' },
  { id: '2', name: 'Honda', href: '/brands/honda' },
  { id: '3', name: 'Nissan', href: '/brands/nissan' },
  // Electronics
  { id: '4', name: 'Samsung', href: '/brands/samsung' },
  { id: '5', name: 'LG', href: '/brands/lg' },
  { id: '6', name: 'Sony', href: '/brands/sony' },
  // Furniture
  { id: '7', name: 'IKEA', href: '/brands/ikea' },
  { id: '8', name: 'Ashley', href: '/brands/ashley' },
  // Appliances
  { id: '9', name: 'Bosch', href: '/brands/bosch' },
  { id: '10', name: 'Whirlpool', href: '/brands/whirlpool' },
  // Machinery
  { id: '11', name: 'Caterpillar', href: '/brands/caterpillar' },
  { id: '12', name: 'John Deere', href: '/brands/johndeere' },
];

export default function BrandShowcase() {
  const { t } = useTranslation();
  
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('brands.title')}</h2>
          <Link 
            href="/brands"
            className="text-afmondo-orange hover:text-afmondo-orange font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors"
          >
            {t('common.viewAll')}
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={brand.href}
              className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all hover:scale-105 group aspect-[3/2] flex items-center justify-center"
            >
              {/* Diagonal Stripe Decoration */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-blue-200 border-l-[40px] border-l-transparent opacity-50"></div>
              
              {/* Brand Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 group-hover:text-afmondo-orange transition-colors z-10">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
