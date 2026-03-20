import HeroSection from '@/components/layout/HeroSection';
import TrendingSection from '@/components/product/TrendingSection';
import FeaturedSection from '@/components/product/FeaturedSection';
import CategoryBanner from '@/components/layout/CategoryBanner';
import BrandStatement from '@/components/layout/BrandStatement';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStatement />
      <TrendingSection />
      <CategoryBanner />
      <FeaturedSection />
    </>
  );
}
