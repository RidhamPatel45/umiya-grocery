import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { OfferBanner } from '@/components/home/OfferBanner';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <OfferBanner />
      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  );
}
