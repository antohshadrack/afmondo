"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Heart } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand?: string;
  asLowAs?: boolean;
  itemsLeft?: number;
  slug?: string;
}

interface ProductCardProps {
  product: Product;
  
  // Layout options
  variant?: 'carousel' | 'grid' | 'flash-sale';
  size?: 'sm' | 'md' | 'lg';
  
  // Feature toggles
  showActionButtons?: boolean;
  showBrand?: boolean;
  showProgressBar?: boolean;
  showItemsLeft?: boolean;
  
  // Styling options
  textAlign?: 'left' | 'center';
  accentColor?: 'orange' | 'red' | 'green';
}

export default function ProductCard({
  product,
  variant = 'grid',
  size = 'md',
  showActionButtons = true,
  showBrand = false,
  showProgressBar = false,
  showItemsLeft = false,
  textAlign = 'left',
  accentColor = 'orange',
}: ProductCardProps) {
  const { t } = useTranslation();

  // Determine link href
  const href = product.slug ? `/products/${product.slug}` : `/product/${product.id}`;

  // Size classes
  const sizeClasses = {
    sm: 'w-[180px]',
    md: 'w-[200px] sm:w-[220px]',
    lg: 'w-[240px] sm:w-[260px]',
  };

  // Accent color classes
  const accentColors = {
    orange: {
      badge: 'bg-orange-500',
      hover: 'group-hover:text-afmondo-orange',
      progress: 'bg-orange-500',
    },
    red: {
      badge: 'bg-red-500',
      hover: 'group-hover:!text-red-600',
      progress: 'bg-red-500',
    },
    green: {
      badge: 'bg-green-500',
      hover: 'group-hover:text-afmondo-green',
      progress: 'bg-green-500',
    },
  };

  // Variant-specific classes
  const isCarousel = variant === 'carousel';
  const isFlashSale = variant === 'flash-sale';
  const isGrid = variant === 'grid';

  // Container classes
  const containerClasses = isCarousel
    ? `${sizeClasses[size]} flex-shrink-0 snap-start`
    : '';

  // Card classes
  const cardClasses = isFlashSale
    ? 'bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition h-80 flex flex-col border border-gray-200'
    : 'block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group/card';

  // Text alignment
  const textAlignClass = textAlign === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={containerClasses}>
      <Link href={href} className={isFlashSale ? 'group' : cardClasses}>
        {isFlashSale && <div className={cardClasses}>
          {/* Product Image */}
          <div className={`relative ${isFlashSale ? 'bg-gray-100 h-40' : 'aspect-square bg-gray-50'} overflow-hidden shrink-0`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover ${isFlashSale ? 'group-hover:scale-105' : 'group-hover/card:scale-105'} transition-transform duration-300`}
            />
            
            {/* Discount Badge */}
            {product.discount && (
              <div className={`absolute top-2 left-2 ${accentColors[accentColor].badge} text-white text-xs font-bold px-2 py-1 rounded`}>
                -{product.discount}%
              </div>
            )}
            
            {/* Brand Badge */}
            {showBrand && product.brand && (
              <div className="absolute top-2 right-2 bg-white rounded px-2 py-1">
                <span className="text-xs font-semibold text-gray-700">{product.brand}</span>
              </div>
            )}

            {/* Action Buttons Overlay */}
            {showActionButtons && (
              <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-3 opacity-0 ${isFlashSale ? 'group-hover:opacity-100' : 'group-hover/card:opacity-100'} transition-opacity duration-300`}>
                <ShoppingCart className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
                <Search className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
                <Heart className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={`p-3 ${isFlashSale ? 'flex flex-col flex-1 justify-between' : ''} ${textAlignClass}`}>
            {/* Product Name */}
            <h3 className={`text-sm ${isGrid ? 'text-gray-900' : 'text-gray-700'} mb-2 line-clamp-2 ${isCarousel ? 'min-h-[40px]' : ''} ${isFlashSale ? 'text-xs md:text-sm font-medium' : ''} ${accentColors[accentColor].hover} transition`}>
              {product.name}
            </h3>

            {/* Pricing */}
            <div className={isFlashSale ? 'mb-2' : 'space-y-1'}>
              {product.asLowAs && (
                <p className="text-xs text-gray-500">As low as:</p>
              )}
              <div className={`flex items-${textAlign === 'center' ? 'center justify-center' : 'baseline'} gap-2`}>
                <span className={`${isFlashSale ? 'text-sm md:text-base' : 'text-lg'} font-bold text-gray-900`}>
                  CFA {product.price.toLocaleString('fr-SN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              {product.originalPrice && (
                <p className={`text-xs text-gray-${isFlashSale ? '500' : '400'} line-through ${isFlashSale ? 'm-0' : ''}`}>
                  CFA {product.originalPrice.toLocaleString('fr-SN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              )}
            </div>

            {/* Progress Bar & Items Left (Flash Sale) */}
            {showProgressBar && showItemsLeft && product.itemsLeft !== undefined && (
              <div>
                <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${accentColors[accentColor].progress} transition-all`}
                    style={{
                      width: `${Math.max(10, (product.itemsLeft / 30) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {product.itemsLeft} {t('flashSales.itemsLeft')}
                </p>
              </div>
            )}
          </div>
        </div>}
        
        {!isFlashSale && (
          <>
            {/* Product Image */}
            <div className={`relative ${isFlashSale ? 'bg-gray-100 h-40' : 'aspect-square bg-gray-50'} overflow-hidden shrink-0`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover ${isFlashSale ? 'group-hover:scale-105' : 'group-hover/card:scale-105'} transition-transform duration-300`}
              />
              
              {/* Discount Badge */}
              {product.discount && (
                <div className={`absolute top-2 left-2 ${accentColors[accentColor].badge} text-white text-xs font-bold px-2 py-1 rounded`}>
                  -{product.discount}%
                </div>
              )}
              
              {/* Brand Badge */}
              {showBrand && product.brand && (
                <div className="absolute top-2 right-2 bg-white rounded px-2 py-1">
                  <span className="text-xs font-semibold text-gray-700">{product.brand}</span>
                </div>
              )}

              {/* Action Buttons Overlay */}
              {showActionButtons && (
                <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-3 opacity-0 ${isFlashSale ? 'group-hover:opacity-100' : 'group-hover/card:opacity-100'} transition-opacity duration-300`}>
                  <ShoppingCart className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
                  <Search className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
                  <Heart className="rounded-full size-10 p-3 bg-white text-gray-600 hover:bg-black hover:text-white transition cursor-pointer" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={`p-3 ${isFlashSale ? 'flex flex-col flex-1 justify-between' : ''} ${textAlignClass}`}>
              {/* Product Name */}
              <h3 className={`text-sm ${isGrid ? 'text-gray-900' : 'text-gray-700'} mb-2 line-clamp-2 ${isCarousel ? 'min-h-[40px]' : ''} ${isFlashSale ? 'text-xs md:text-sm font-medium' : ''} ${accentColors[accentColor].hover} transition`}>
                {product.name}
              </h3>

              {/* Pricing */}
              <div className={isFlashSale ? 'mb-2' : 'space-y-1'}>
                {product.asLowAs && (
                  <p className="text-xs text-gray-500">As low as:</p>
                )}
                <div className={`flex items-${textAlign === 'center' ? 'center justify-center' : 'baseline'} gap-2`}>
                  <span className={`${isFlashSale ? 'text-sm md:text-base' : 'text-lg'} font-bold text-gray-900`}>
                    CFA {product.price.toLocaleString('fr-SN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                {product.originalPrice && (
                  <p className={`text-xs text-gray-${isFlashSale ? '500' : '400'} line-through ${isFlashSale ? 'm-0' : ''}`}>
                    CFA {product.originalPrice.toLocaleString('fr-SN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
