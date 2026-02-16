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
import { Clock, MapPin } from "lucide-react"
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SEOHelment
        title="Home Page - Fuse"
        description="Discover the best hostels with Fuse"
        keywords="hostels, budget travel, Fuse"
      />
      <main>
        <HeroCarousel />
        <div className="grid w-full place-items-center">
          <section id="about" className="container py-16 md:py-24">
            <h2 className="mb-12 text-3xl font-bold md:text-4xl">
              Why <span className="text-primary">Fuse</span> is The Right Choice for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {/* Verified Hostels - Top Left */}
              <FeatureCard
                icon="Star"
                title="Verified Hostels"
                description="Stay with confidence in hostels verified by our team, ensuring quality and safety standards are met."
                delay={0.1}
              />

              {/* Secure Payments - Top Center */}
              <FeatureCard
                icon="DollarSign"
                title="Secure Payments"
                description="Your transactions are protected with industry-standard encryption and secure payment gateways."
                delay={0.2}
              />

              {/* Flexible Booking - Top Right (Dark Blue CTA Card) */}
              <div className="md:row-span-2 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg p-8 flex flex-col justify-between text-white shadow-lg">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Flexible Booking Schedules</h3>
                  <p className="text-blue-100 leading-relaxed">
                    At Fuse, we understand the importance of balancing your accommodation needs with your busy schedule. That's why our booking system is available on-demand, allowing you to reserve at your own pace, anytime and anywhere.
                  </p>
                  <p className="text-blue-100 leading-relaxed">
                    Whether you're a working professional or a student, you can customize your booking schedule to fit your needs.
                  </p>
                </div>
                <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 w-fit">
                  Start Free Trial
                  <span>→</span>
                </button>
              </div>

              {/* 100+ High Impact Locations - Bottom Left (Spans 2 Columns) */}
              <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-4 rounded-2xl shrink-0">
                    <MapPin className="w-7 h-7 text-primary" strokeWidth={2} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">100+ Verified Locations</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Fuse offers over 100 verified hostel locations across essential cities and campuses. Whether you're a beginner or an experienced traveler, our locations cover prime areas in web development, data science, and cybersecurity, providing practical, hands-on accommodation to help you stay comfortably and competitively in your journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Statistics Section */}
          <StatisticsSection />

          <PopularDestinations />

          {/* Testimonials Section */}
          <TestimonialsSection />

          <FeaturedHostels />

          {/* Blog Section */}
          <BlogSection />

          {/* Newsletter Section */}
          <NewsletterSection />

          <AppPromotion />

          {/* Partners Section */}
          <PartnersSection />

          <section id="contact" className="container pt-16">
            <ContactSection />
          </section>
        </div>
      </main>
    </div>
  )
}
