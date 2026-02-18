"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from '../contexts/TranslationContext';
import Header from '../components/shared/header';
import Footer from '../components/sections/Footer';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { t } = useTranslation();

  const subtotal = getCartTotal();
  const shipping = 0; // Configured as free or calculated at checkout normally
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.title')}</h1>
            <p className="text-gray-500 mb-8">{t('cart.empty')}</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 bg-afmondo-orange text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition w-full"
            >
              {t('cart.continueShopping')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                <div className="col-span-6">{t('cart.product')}</div>
                <div className="col-span-2 text-center">{t('cart.price')}</div>
                <div className="col-span-2 text-center">{t('cart.quantity')}</div>
                <div className="col-span-2 text-right">{t('cart.total')}</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 transition hover:bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex gap-4">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          {item.brand && (
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.brand}</span>
                          )}
                          <Link href={item.slug ? `/products/${item.slug}` : `/product/${item.id}`} className="font-semibold text-gray-900 hover:text-afmondo-orange transition line-clamp-2">
                            {item.name}
                          </Link>
                          <div className="md:hidden mt-2 font-bold text-afmondo-orange">
                            {item.price.toLocaleString()} CFA
                          </div>
                        </div>
                      </div>

                      {/* Price (Desktop) */}
                      <div className="hidden md:block col-span-2 text-center font-medium text-gray-600">
                        {item.price.toLocaleString()} CFA
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center gap-4">
                        <span className="md:hidden text-sm text-gray-500">{t('cart.quantity')}:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 transition disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Remove Button (Mobile) */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Total Price & Remove (Desktop) */}
                      <div className="hidden md:block col-span-2 text-right">
                        <div className="font-bold text-gray-900 mb-2">
                          {(item.price * item.quantity).toLocaleString()} CFA
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 transition"
                        >
                          <Trash2 size={14} />
                          {t('cart.remove')}
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">{t('cart.summary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium text-gray-900">{subtotal.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-sm">{t('cart.shippingCalculated') || "Calculated at checkout"}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="text-2xl font-bold text-afmondo-orange">{total.toLocaleString()} CFA</span>
                </div>
              </div>

              <button className="w-full bg-afmondo-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                {t('cart.checkout')}
                <ArrowRight size={20} />
              </button>
              
              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-afmondo-orange transition">
                  {t('cart.continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
