"use client";

import Slideshow from './components/sections/Slideshow';
import CategoryShowcase from './components/sections/CategoryShowcase';
import ProductCarousel from './components/sections/ProductCarousel';
import HotPromotions from './components/sections/HotPromotions';
import TrustBadges from './components/sections/TrustBadges';
import BannerSection from './components/sections/BannerSection';
import FlashSalesSection from './components/sections/FlashSalesSection';
import ProductsGrid from './components/sections/ProductsGrid';
import BrandShowcase from './components/sections/BrandShowcase';
import TeamSection from './components/sections/TeamSection';
import AboutSection from './components/sections/AboutSection';
import Footer from './components/sections/Footer';
import Header from './components/shared/header';
import { carsData, tractorsData, fridgesData, tvsData, printingMachinesData, furnitureData } from './data/products';
import { useTranslation } from './contexts/TranslationContext';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <main className="min-h-screen bg-white">
      <Header/>
      <Slideshow />
      <CategoryShowcase />
    <ProductsGrid />  

      {/* Flash Sales */}
      <FlashSalesSection />
      {/* Cars Section */}
      <ProductCarousel 
        title={t('products.carsVehicles')}
        products={carsData}
        viewAllLink="/vehicles/cars"
      />

      {/* Tractors & Farm Equipment Section */}
      <ProductCarousel 
        title={t('products.tractorsFarm')}
        products={tractorsData}
        viewAllLink="/vehicles/tractors"
      />

      {/* Refrigerators Section */}
      <ProductCarousel 
        title={t('products.refrigerators')}
        products={fridgesData}
        viewAllLink="/appliances/refrigerators"
      />

      {/* TVs Section */}
      <ProductCarousel 
        title={t('products.televisions')}
        products={tvsData}
        viewAllLink="/electronics/tvs"
      />

      {/* Printing Machines Section */}
      <ProductCarousel 
        title={t('products.printingMachines')}
        products={printingMachinesData}
        viewAllLink="/electronics/printing-machines"
      />

      {/* Furniture Section */}
      <ProductCarousel 
        title={t('products.furniture')}
        products={furnitureData}
        viewAllLink="/furniture"
      />

      {/* Hot Promotions */}
      {/* <HotPromotions /> */}

      {/* Trust Badges */}
      <TrustBadges />


      {/* <BannerSection /> */}
  
      

      {/* Shop By Brands */}
      <BrandShowcase />

      {/* <TeamSection /> */}

      <AboutSection />

      <Footer />
    </main>
  );
}
