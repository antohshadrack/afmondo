# Component Architecture Overview

## Project Structure

This modern Next.js application has been organized with a clean, modular component architecture:

```
app/
├── components/
│   └── sections/
│       ├── Slideshow.tsx          # Hero carousel with auto-rotation
│       ├── BannerSection.tsx       # 3-column feature banners
│       ├── ProductsGrid.tsx        # 8-product grid showcase
│       ├── TeamSection.tsx         # 4-person team grid
│       ├── InstagramSection.tsx    # Instagram feed carousel
│       └── Footer.tsx              # Full footer with links & newsletter
├── lib/
│   └── data/
│       ├── slides.ts               # Slideshow data & types
│       ├── banners.ts              # Banner data & types
│       ├── products.ts             # Product catalog data & types
│       ├── team.ts                 # Team members data & types
│       └── instagram.ts            # Instagram posts data & types
└── page.tsx                        # Main homepage composition
```

## Component Overview

### 1. **Slideshow** (`sections/Slideshow.tsx`)
- Hero carousel with 2 rotating slides
- Auto-rotation on 5-second interval
- Manual prev/next navigation
- Slide indicators with click navigation
- Responsive images (desktop/mobile variants)
- Next.js Image optimization with lazy loading
- **Features**: Auto-play toggle, smooth animations, ARIA labels

### 2. **BannerSection** (`sections/BannerSection.tsx`)
- 3-column responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- Image overlays with gradient and text
- Click-through links to product collections
- Hover scaling effect on images
- **Features**: Link integration, responsive layout, hover animations

### 3. **ProductsGrid** (`sections/ProductsGrid.tsx`)
- 8-product showcase with 4-column grid
- Product cards with:
  - Image with hover effects
  - Price display with sale/original pricing
  - Color variant selector (visual swatches)
  - New/Sale badges
  - Quick View overlay
  - Add to Cart button
- Responsive: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- **Features**: Product variants, price formatting, action buttons, product links

### 4. **TeamSection** (`sections/TeamSection.tsx`)
- 4-person team grid display
- Each member shows:
  - Profile image with hover scale
  - Name, role, and bio
  - Responsive layout
- Responsive: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- **Features**: Team member cards, image optimization, descriptive text

### 5. **InstagramSection** (`sections/InstagramSection.tsx`)
- 5-item carousel showing Instagram posts
- Features:
  - Responsive grid display
  - Carousel navigation (prev/next buttons)
  - Post likes and caption display on hover
  - Direct links to Instagram
  - Follow button CTA
- Responsive: 1 col (mobile) → 2-3 cols (tablet) → 5 cols (desktop)
- **Features**: Social integration, carousel logic, engagement metrics

### 6. **Footer** (`sections/Footer.tsx`)
- 4-column link structure (Shop, Company, Support, Legal)
- Company info section with social icons (Facebook, Instagram, Twitter, Pinterest, LinkedIn)
- Newsletter signup form
- Bottom section with copyright and payment methods
- **Features**: Newsletter subscription, social links, multi-column layout, accessibility

## Data Files (`lib/data/`)

All component data is separated from logic for easy maintenance:

- **slides.ts** - Slideshow images, titles, descriptions, CTAs
- **banners.ts** - Banner titles, images, links
- **products.ts** - 8 products with prices, variants, badges
- **team.ts** - Team members with roles and bios
- **instagram.ts** - Instagram posts with likes and captions

Each data file exports:
1. TypeScript interface(s) for type safety
2. Constant array(s) with demo data

## Key Technologies

- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript for full type safety
- **Styling**: Tailwind CSS for utility-based design
- **Image Optimization**: Next.js Image component
- **State Management**: React hooks (useState, useEffect)
- **Performance**: Automatic code splitting, lazy loading, image optimization

## Styling Approach

- **Responsive Design**: Mobile-first with Tailwind breakpoints (sm, md, lg)
- **Animations**: CSS transitions and transforms for smooth UX
- **Colors**: Consistent gray palette (#000 black, #FFF white, gray-50-950)
- **Typography**: Balanced font weights (light 300, normal 400, semibold 600, bold 700)
- **Spacing**: Consistent gap/padding scales (2, 3, 4, 6, 8 units)

## Component Features

✅ **Fully Typed** - TypeScript interfaces for all data structures
✅ **Responsive** - Mobile-first design with proper breakpoints
✅ **Optimized** - Next.js Image, lazy loading, code splitting
✅ **Accessible** - ARIA labels, semantic HTML, keyboard navigation
✅ **Data-Driven** - Centralized data management in lib/data/
✅ **Modular** - Independent, reusable components
✅ **Production-Ready** - Clean, maintainable, best-practice code

## Usage

All components are automatically composed in `app/page.tsx`:

```tsx
import Slideshow from './components/sections/Slideshow';
import BannerSection from './components/sections/BannerSection';
import ProductsGrid from './components/sections/ProductsGrid';
import TeamSection from './components/sections/TeamSection';
import InstagramSection from './components/sections/InstagramSection';
import Footer from './components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Slideshow />
      <BannerSection />
      <ProductsGrid />
      <TeamSection />
      <InstagramSection />
      <Footer />
    </main>
  );
}
```

## Customization

To customize:
1. **Update data**: Modify files in `lib/data/`
2. **Change styling**: Edit Tailwind classes in components
3. **Add features**: Extend components with additional props and state
4. **Connect real data**: Replace mock data with API calls or CMS data

## Next Steps

- Integrate with e-commerce backend (products API, shopping cart)
- Connect newsletter signup to email service
- Add product detail pages
- Implement search and filtering
- Connect social media feeds from actual Instagram API
- Add analytics tracking
