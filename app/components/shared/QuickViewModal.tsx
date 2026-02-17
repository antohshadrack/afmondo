import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Reset quantity and image when modal opens or product changes
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedImage(product.image);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Derive gallery images (ensure unique and include main image if needed)
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];
    
  // Ensure main image is in the set if we're building a unique set, 
  // but for simplicity, we'll assume product.images is the source of truth if present.
  // We'll also memoize if needed, but this is fine for now.

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Determine link href
  const href = product.slug ? `/products/${product.slug}` : `/product/${product.id}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm hover:bg-gray-100 transition text-gray-500 hover:text-gray-900"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Product Gallery Section */}
          <div className="bg-gray-50 p-6 md:p-8 flex flex-col h-full min-h-[400px]">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-sm mb-4">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-contain p-4 transition-all duration-300 hover:scale-105"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm z-10">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnails Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img 
                        ? 'border-afmondo-orange shadow-md scale-105' 
                        : 'border-transparent bg-white hover:border-gray-300'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`} 
                      fill 
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-10 flex flex-col h-full">
            <div className="flex-1">
              {product.brand && (
                <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{product.brand}</p>
              )}
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
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
                  <p className="text-sm text-gray-500 mt-1">Starting price</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description || "Experience premium quality with this authenticated product. Designed for durability and performance, suitable for all your needs."}
                </p>
              </div>

              {/* Stock Info (if low) */}
              {product.itemsLeft !== undefined && product.itemsLeft < 10 && (
                <div className="mb-6 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium inline-block">
                  Only {product.itemsLeft} items left!
                </div>
              )}
            </div>

            {/* Actions Area */}
            <div className="space-y-4">
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 w-fit">
                  <button 
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100 text-gray-600 transition disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-afmondo-orange text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transform active:scale-95 duration-200"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                  {quantity > 1 && <span className="bg-white/20 px-2 py-0.5 rounded text-sm ml-1">x{quantity}</span>}
                </button>
              </div>

              {/* View Full Details Link */}
              <Link 
                href={href}
                className="block text-center text-sm font-medium text-gray-500 hover:text-afmondo-orange transition flex items-center justify-center gap-1 group py-2"
                onClick={onClose}
              >
                View full product details 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
