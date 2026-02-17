"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, Tv, Sofa, Refrigerator, Cog, Tag,
  ChevronRight, Monitor, Printer, Truck, Wrench
} from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '../../contexts/TranslationContext';

interface Category {
  name: string;
  href: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
}

const categories: Category[] = [
  {
    name: "categories.vehicles",
    href: "/vehicles",
    icon: <Car size={20} />,
    hasSubmenu: true,
  },
  {
    name: "categories.tractorsFarm",
    href: "/vehicles/tractors",
    icon: <Truck size={20} />,
    hasSubmenu: true,
  },
  {
    name: "categories.electronics",
    href: "/electronics",
    icon: <Monitor size={20} />,
    hasSubmenu: true,
  },
  {
    name: "categories.printingMachines",
    href: "/electronics/printing-machines",
    icon: <Printer size={20} />,
    hasSubmenu: false,
  },
  {
    name: "categories.televisions",
    href: "/electronics/tvs",
    icon: <Tv size={20} />,
    hasSubmenu: false,
  },
  {
    name: "categories.furniture",
    href: "/furniture",
    icon: <Sofa size={20} />,
    hasSubmenu: true,
  },
  {
    name: "categories.refrigerators",
    href: "/appliances/refrigerators",
    icon: <Refrigerator size={20} />,
    hasSubmenu: false,
  },
  {
    name: "categories.kitchenAppliances",
    href: "/appliances/kitchen",
    icon: <Cog size={20} />,
    hasSubmenu: false,
  },
  {
    name: "categories.industrialMachinery",
    href: "/machinery/industrial",
    icon: <Wrench size={20} />,
    hasSubmenu: false,
  },
  {
    name: "categories.specialDeals",
    href: "/deals",
    icon: <Tag size={20} />,
    hasSubmenu: false,
  },
];

// Slider data
const slides = [
  {
    title: "Quality Products",
    description: "From vehicles to electronics, find everything you need at competitive prices",
    image: "/images/hero/slide-1.jpg",
  },
  {
    title: "Farm Equipment",
    description: "Premium tractors and agricultural machinery for your farming needs",
    image: "/images/hero/slide-2.jpg",
  },
  {
    title: "Home Appliances",
    description: "Modern refrigerators, TVs, and furniture for your perfect home",
    image: "/images/hero/slide-3.jpg",
  },
  {
    title: "Print Like a Pro",
    description: "Professional printing solutions for your business",
    image: "/sliders/PrintLikeaPro.jpg",
  }
];

export default function CategoryShowcase() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            
              <nav className="divide-y divide-gray-100">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 group-hover:text-afmondo-green transition-colors">
                        {category.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {t(category.name)}
                      </span>
                    </div>
                    {category.hasSubmenu && (
                      <ChevronRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-afmondo-green transition-colors" 
                      />
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Center - Hero Slider */}
          <div className="lg:col-span-6">
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md h-[300px] sm:h-[400px] relative">
              {/* Slide Image */}
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
              
              {/* Content - Bottom Left */}
              <div className="relative h-full flex items-end z-10">
                <div className="p-6 sm:p-8 pb-12 sm:pb-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                    {t(`hero.slide${currentSlide + 1}Title`)}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mb-4 max-w-md">
                    {t(`hero.slide${currentSlide + 1}Description`)}
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-afmondo-green hover:bg-afmondo-green/80 text-white font-semibold px-6 py-2.5 text-sm rounded-lg transition-colors shadow-lg"
                  >
                    {t('hero.shopNow')}
                  </Link>
                </div>
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'w-8 bg-afmondo-green' 
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Promotional Banners */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Top Banner - Video */}
            <Link
              href="/deals/flash-sales"
              className="block rounded-lg overflow-hidden h-[145px] sm:h-[195px] relative"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/big_sale.mp4" type="video/mp4" />
              </video>
            </Link>

            {/* Bottom Banner - Printer */}
            <Link
              href="/electronics/printing-machines"
              className="block rounded-lg overflow-hidden h-[145px] sm:h-[195px] relative"
            >
              {/* Printer Image */}
              <div className="absolute inset-0">
                <Image
                  src="/products/Epson_L3250.jpg"
                  alt="Epson Printer L3250"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
