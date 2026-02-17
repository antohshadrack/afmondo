"use client";

import React from 'react';
import Image from 'next/image';
import { X, ShoppingCart } from 'lucide-react';
import { Product } from './ProductCard';
import { useCart } from '../../contexts/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            )}
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-afmondo-orange">
                  {product.price.toLocaleString()} CFA
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()} CFA
                  </span>
                )}
              </div>
              {product.asLowAs && (
                <p className="text-sm text-gray-500 mt-1">As low as</p>
              )}
            </div>

            {/* Stock Info */}
            {product.itemsLeft !== undefined && (
              <div className="mb-6">
                <p className="text-sm text-red-600 font-semibold">
                  Only {product.itemsLeft} items left in stock!
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-6 flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">
                High-quality product with excellent features and durability. 
                Perfect for your needs with guaranteed satisfaction.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-afmondo-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
