"use client";

import React from 'react';
import { Truck, RotateCcw, ShoppingCart, Lock } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface TrustBadge {
  id: string;
  icon: React.ReactNode;
  title: string;
}

const badges: TrustBadge[] = [
  {
    id: '1',
    icon: <Truck size={40} className="text-white" />,
    title: 'trustBadges.freeShipping',
  },
  {
    id: '2',
    icon: <RotateCcw size={40} className="text-white" />,
    title: 'trustBadges.moneyBack',
  },
  {
    id: '3',
    icon: <ShoppingCart size={40} className="text-white" />,
    title: 'trustBadges.onlinePurchases',
  },
  {
    id: '4',
    icon: <Lock size={40} className="text-white" />,
    title: 'trustBadges.securePayment',
  },
];

export default function TrustBadges() {
  const { t } = useTranslation();
  
  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-afmondo-orange rounded-full flex items-center justify-center">
                {badge.icon}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">
                {t(badge.title)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
