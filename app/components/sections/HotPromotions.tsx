"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Laptop, Package, Gamepad2, Tag, Printer, Monitor } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface PromotionCategory {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  bgColor: string;
}

const promotions: PromotionCategory[] = [
  {
    id: '1',
    name: 'Student Deals',
    href: '/deals/student',
    icon: <Laptop size={64} className="text-gray-700" />,
    bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
  },
  {
    id: '2',
    name: 'Featured Products',
    href: '/featured',
    icon: <Package size={64} className="text-gray-700" />,
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
  },
  {
    id: '3',
    name: 'Gaming Deals',
    href: '/deals/gaming',
    icon: <Gamepad2 size={64} className="text-gray-700" />,
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
  },
  {
    id: '4',
    name: 'Special Offers',
    href: '/deals/special',
    icon: <Tag size={64} className="text-pink-600" />,
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
  },
  {
    id: '5',
    name: 'Office Printers',
    href: '/electronics/printers',
    icon: <Printer size={64} className="text-gray-700" />,
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
  },
  {
    id: '6',
    name: 'All-in-One Desktops',
    href: '/electronics/desktops',
    icon: <Monitor size={64} className="text-gray-700" />,
    bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
  },
];

export default function HotPromotions() {
  const { t } = useTranslation();
  
  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Hot Promotions</h2>
          <Link 
            href="/promotions"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors"
          >
            {t('common.viewAll')}
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={promo.href}
              className={`${promo.bgColor} rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all hover:scale-105 group min-h-[180px]`}
            >
              <div className="mb-3 group-hover:scale-110 transition-transform">
                {promo.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{promo.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
