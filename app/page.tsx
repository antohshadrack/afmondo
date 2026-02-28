import Slideshow from './components/sections/Slideshow';
import CategoryShowcase from './components/sections/CategoryShowcase';
import ProductCarousel from './components/sections/ProductCarousel';
import TrustBadges from './components/sections/TrustBadges';
import FlashSalesSection from './components/sections/FlashSalesSection';
import ProductsGrid from './components/sections/ProductsGrid';
import BrandShowcase from './components/sections/BrandShowcase';
import AboutSection from './components/sections/AboutSection';
import Footer from './components/sections/Footer';
import Header from './components/shared/header';
import { carsData, tractorsData, fridgesData, tvsData, printingMachinesData, furnitureData } from './data/products';
import { getProducts, getFlashSaleProducts } from '@/lib/supabase/queries';
import HomeClient from './HomeClient';

// Server Component — fetches from Supabase then passes down to client sections
export default async function Home() {
  // Fetch live data in parallel; fall back gracefully if DB is empty
  const [flashSaleProducts, featuredProducts] = await Promise.all([
    getFlashSaleProducts(8).catch(() => []),
    getProducts({ featured: true, limit: 12 }).catch(() => []),
  ]);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Header />
      <Slideshow />
      <CategoryShowcase />
      <ProductsGrid products={featuredProducts} />

      <FlashSalesSection products={flashSaleProducts} />

      {/* Static carousels — will be migrated to DB queries as products are added */}
      <HomeClient
        carsData={carsData}
        tractorsData={tractorsData}
        fridgesData={fridgesData}
        tvsData={tvsData}
        printingMachinesData={printingMachinesData}
        furnitureData={furnitureData}
      />

      <TrustBadges />
      <BrandShowcase />
      <AboutSection />
      <Footer />
    </main>
  );
}
