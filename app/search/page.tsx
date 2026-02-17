"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import Header from '../components/shared/header';
import Footer from '../components/sections/Footer';
import CategoryShowcase from '../components/sections/CategoryShowcase';
import ProductCard from '../components/shared/ProductCard';
import { carsData, tractorsData, fridgesData, tvsData, printingMachinesData, furnitureData } from '../data/products';
import { useTranslation } from '../contexts/TranslationContext';

// Combine all products
const allProducts = [
  ...carsData,
  ...tractorsData,
  ...fridgesData,
  ...tvsData,
  ...printingMachinesData,
  ...furnitureData,
];

function SearchResults() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand?.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <>
      <Header />
      
      {/* Category Showcase */}
      {/* <CategoryShowcase /> */}

      {/* Search Results Section */}
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600">
                Showing results for: <span className="font-semibold">"{query}"</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Results */}
          {!query.trim() ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Please enter a search query</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="grid"
                  showActionButtons={true}
                  showBrand={true}
                  textAlign="left"
                  accentColor="orange"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading search results...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
