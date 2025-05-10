// import { Header } from "./component/header"
import { HeroCarousel } from "./component/hero-carousel"
import { ContactSection } from "./component/contact-section"
import { FeatureCard } from "./component/feature-card"
import { DestinationCard } from "./component/destination-card"
import { HostelCard } from "./component/hostel-card"
import { AppPromotion } from "./component/app-promotion"

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* <Header /> */}
      <main>
        <HeroCarousel />
        <div className="w-full grid place-items-center">
          <section className="container py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-red-500">HostelFinder</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <section className="container py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DestinationCard
                image="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80"
                title="Bangkok Hostels"
                description="Experience the vibrant culture of Thailand's capital with our selection of top-rated hostels in Bangkok."
                index={0}
              />
              <DestinationCard
                image="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80"
                title="Barcelona Hostels"
                description="Find the perfect base to explore this beautiful Spanish city with our curated hostels in Barcelona."
                index={1}
              />
              <DestinationCard
                image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
                title="London Hostels"
                description="Discover affordable accommodation in the heart of the UK's capital with our London hostel selection."
                index={2}
              />
              <DestinationCard
                image="https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80"
                title="Berlin Hostels"
                description="Stay in Germany's coolest city with our hand-picked selection of Berlin's best hostels."
                index={3}
              />
            </div>
          </section>

          <section className="container py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Hostels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=600&q=80",
                  title: "Backpackers Paradise",
                  location: "Bangkok, Thailand",
                  price: "$15/night",
                },
                {
                  image: "https://images.unsplash.com/photo-1626265774643-f1943311a86b?auto=format&fit=crop&w=600&q=80",
                  title: "Urban Oasis",
                  location: "Barcelona, Spain",
                  price: "$20/night",
                },
                {
                  image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=600&q=80",
                  title: "City Central",
                  location: "London, UK",
                  price: "$25/night",
                },
                {
                  image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                  title: "Art House",
                  location: "Berlin, Germany",
                  price: "$18/night",
                },
              ].map((hostel, index) => (
                <HostelCard
                  key={index}
                  image={hostel.image}
                  title={hostel.title}
                  location={hostel.location}
                  price={hostel.price}
                  index={index}
                />
              ))}
            </div>
          </section>

          <AppPromotion />

          <section className="container pt-16">
            <ContactSection />
          </section>
        </div>
      </main>
    </div>
  )
}
