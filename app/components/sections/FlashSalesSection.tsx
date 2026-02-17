"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { flashSaleProducts, flashSaleEndTime } from "@/lib/data/flashsales";
import { useTranslation } from '../../contexts/TranslationContext';
import ProductCard from '../shared/ProductCard';

export default function FlashSalesSection() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = flashSaleEndTime.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <section className="flash-sales bg-white py-6 md:py-8 mt-12 md:mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="inline-block">⚡</span>
              {t('flashSales.title')}
            </div>
            <div className="text-gray-700 text-base md:text-lg font-semibold">
              {t('flashSales.timeLeft')}:{" "}
              <span className="text-red-600 font-bold">
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
          <Link
            href="/flash-sales"
            className="text-gray-900 font-semibold hover:text-gray-600 transition flex items-center gap-1"
          >
            {t('common.viewAll')} <span>›</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="flash-sale"
              showActionButtons={false}
              showProgressBar={true}
              showItemsLeft={true}
              accentColor="red"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
