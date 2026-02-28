"use client";

import ProductCarousel from './components/sections/ProductCarousel';
import { useTranslation } from './contexts/TranslationContext';
import type { Product } from './components/shared/ProductCard';

interface HomeClientProps {
  carsData: Product[];
  tractorsData: Product[];
  fridgesData: Product[];
  tvsData: Product[];
  printingMachinesData: Product[];
  furnitureData: Product[];
}

export default function HomeClient({
  carsData, tractorsData, fridgesData, tvsData, printingMachinesData, furnitureData,
}: HomeClientProps) {
  const { t } = useTranslation();

  return (
    <>
      <ProductCarousel title={t('products.carsVehicles')} products={carsData} viewAllLink="/vehicles/cars" />
      <ProductCarousel title={t('products.tractorsFarm')} products={tractorsData} viewAllLink="/vehicles/tractors" />
      <ProductCarousel title={t('products.refrigerators')} products={fridgesData} viewAllLink="/appliances/refrigerators" />
      <ProductCarousel title={t('products.televisions')} products={tvsData} viewAllLink="/electronics/tvs" />
      <ProductCarousel title={t('products.printingMachines')} products={printingMachinesData} viewAllLink="/electronics/printing-machines" />
      <ProductCarousel title={t('products.furniture')} products={furnitureData} viewAllLink="/furniture" />
    </>
  );
}
