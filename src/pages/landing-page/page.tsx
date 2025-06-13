import { HeroCarousel } from "./component/hero-carousel"
import { ContactSection } from "./component/contact-section"
import { FeatureCard } from "./component/feature-card"
import { AppPromotion } from "./component/app-promotion"
import { TestimonialsSection } from "./component/TestimonialsSection"
import { StatisticsSection } from "./component/StatisticsSection"
import { HowItWorksSection } from "./component/HowItWorks"
import { NewsletterSection } from "./component/NewsLetter"
import { BlogSection } from "./component/BlogSection"
import { PartnersSection } from "./component/PartnersSections"
import SEOHelment from '@components/SEOHelmet'
import PopularDestinations from "./component/PopularDestinations"
import FeaturedHostels from "./component/FeaturedHostels"
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SEOHelment
        title="Landing Page - Fuse"
        description="Discover the best hostels with Fuse"
        keywords="hostels, budget travel, Fuse"
      />
      <main>
        <HeroCarousel />
        <div className="grid w-full place-items-center">
          <section className="container py-16 md:py-24">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
              Why Choose <span className="text-red-500">Fuse</span>?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon="Search"
                title="Easy Search"
                description="Find the perfect hostel with our powerful search filters"
                delay={0.1}
              />
              <FeatureCard
                icon="MapPin"
                title="Prime Locations"
                description="Hostels in the heart of every destination"
                delay={0.2}
              />
              <FeatureCard
                icon="Users"
                title="Community"
                description="Connect with fellow travelers worldwide"
                delay={0.3}
              />
              <FeatureCard
                icon="Star"
                title="Verified Reviews"
                description="Real reviews from real travelers"
                delay={0.4}
              />
            </div>
          </section>

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Statistics Section */}
          <StatisticsSection />

         <PopularDestinations/>

          {/* Testimonials Section */}
          <TestimonialsSection />

        <FeaturedHostels/>

          {/* Blog Section */}
          <BlogSection />

          {/* Newsletter Section */}
          <NewsletterSection />

          <AppPromotion />

          {/* Partners Section */}
          <PartnersSection />

          <section className="container pt-16">
            <ContactSection />
          </section>
        </div>
      </main>
    </div>
  )
}
