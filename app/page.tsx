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
import { getProducts, getFlashSaleProducts, getCategories } from '@/lib/supabase/queries';
import HomeClient from './HomeClient';

// Server Component — fetches all data from Supabase then passes down to client sections
export default async function Home() {
  // 1. Fetch flash sales, featured products, and all categories in parallel
  const [flashSaleProducts, featuredProducts, categories] = await Promise.all([
    getFlashSaleProducts(8).catch(() => []),
    getProducts({ featured: true, limit: 12 }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  // 2. For each category, fetch its products dynamically (no hardcoded slugs)
  const categoryData = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      products: await getProducts({ categorySlug: cat.slug, limit: 8 }).catch(() => []),
    }))
  );

  // 3. Derive the earliest flash_sale_ends for the countdown timer
  const saleEndsAt = flashSaleProducts.length > 0
    ? flashSaleProducts.map((p) => p.flash_sale_ends).filter(Boolean).sort()[0] ?? undefined
    : undefined;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Header />
      <Slideshow />
      <CategoryShowcase categories={categories} />
      <ProductsGrid products={featuredProducts} />

      <FlashSalesSection products={flashSaleProducts} saleEndsAt={saleEndsAt} />

      {/* Category carousels — one per DB category, hidden if no products */}
      <HomeClient categoryData={categoryData} />

      <TrustBadges />
      <BrandShowcase />
      <AboutSection />
      <Footer />
    </main>
  );
}

