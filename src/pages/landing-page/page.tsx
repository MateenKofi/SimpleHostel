import { Header } from './component/header'
import { HeroCarousel } from './component/hero-carousel'
import { ContactSection } from './component/contact-section'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Users, Star, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <main>
        <HeroCarousel />
       <div className=' w-full grid place-items-center '>
       <section className="container py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose HostelFinder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Search className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
                <p className="text-muted-foreground">
                  Find the perfect hostel with our powerful search filters
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
                <p className="text-muted-foreground">
                  Hostels in the heart of every destination
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow travelers worldwide
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Star className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
                <p className="text-muted-foreground">
                  Real reviews from real travelers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
              {
                image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80",
                title: "Bangkok Hostels",
                description: "Experience the vibrant culture of Thailand's capital with our selection of top-rated hostels in Bangkok.",
              },
              {
                image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80",
                title: "Barcelona Hostels",
                description: "Find the perfect base to explore this beautiful Spanish city with our curated hostels in Barcelona.",
              },
              {
                image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
                title: "London Hostels",
                description: "Discover affordable accommodation in the heart of the UK's capital with our London hostel selection.",
              },
              {
                image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80",
                title: "Berlin Hostels",
                description: "Stay in Germany's coolest city with our hand-picked selection of Berlin's best hostels.",
              },
            ].map((destination, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="h-48 sm:h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <h3 className="text-xl font-semibold mb-2">{destination.title}</h3>
                    <p className="text-muted-foreground mb-4">{destination.description}</p>
                    <a href="#" className="text-primary hover:underline inline-flex items-center">
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Hostels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              {
                image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=600&q=80",
                title: "Backpackers Paradise",
                location: "Bangkok, Thailand",
                price: "$15/night"
              },
              {
                image: "https://images.unsplash.com/photo-1626265774643-f1943311a86b?auto=format&fit=crop&w=600&q=80",
                title: "Urban Oasis",
                location: "Barcelona, Spain",
                price: "$20/night"
              },
              {
                image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=600&q=80",
                title: "City Central",
                location: "London, UK",
                price: "$25/night"
              },
              {
                image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                title: "Art House",
                location: "Berlin, Germany",
                price: "$18/night"
              }
            ].map((hostel, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={hostel.image}
                    alt={hostel.title}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform ease-in-out duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {hostel.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{hostel.location}</p>
                  <p className="text-sm font-medium mt-2">{hostel.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Download Our Mobile App
                </h2>
                <p className="text-lg text-muted-foreground">
                  Take HostelFinder with you everywhere. Book hostels on the go, manage your reservations, 
                  and connect with fellow travelers - all from your pocket. Our mobile app makes your 
                  travel experience seamless and worry-free, so you can focus on what matters most - 
                  creating unforgettable memories.
                </p>
              </div>
              <Button size="lg" className="mt-4">
                Get the App
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
                  alt="Mobile app preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container pt-16">
          <ContactSection />
        </section>
       </div>

      </main>

     
    </div>
  )
}

