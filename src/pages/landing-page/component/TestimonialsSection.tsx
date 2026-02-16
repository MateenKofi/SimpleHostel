import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  location: string
  image: string
  rating: number
  text: string
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Abena Owusu",
      location: "Accra, Ghana",
      image: "/Beautiful Young Woman applying facial cream fresh Healthy Skin Beauty Cosmetics and Facial treatment _ Premium AI-generated image.jpeg",
      rating: 5,
      text: "Found affordable, safe accommodation in Accra. The reviews were spot-on and booking was seamless.",
    },
    {
      id: 2,
      name: "Kofi Mensah",
      image: "/Download free image of Happy young man headphones headset adult_  by ae about face, light, person, neon, and men 13067768.jpeg",
      location: "Kumasi, Ghana",
      rating: 5,
      text: "Great social hostels with amazing vibes. The filters helped me find exactly what I needed.",
    },
    {
      id: 3,
      name: "Ama Frimpong",
      location: "Cape Coast, Ghana",
      image: "download (1).jpeg",
      rating: 5,
      text: "Reliable platform with accurate photos. My go-to app for budget travel in Ghana.",
    },
  ]

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Travelers Say</h2>
          <p className="text-lg text-muted-foreground">
            Real reviews from real travelers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 overflow-hidden rounded-full bg-muted">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute p-1 bg-primary rounded-full -bottom-1 -right-1">
                      <Quote className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>

                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{testimonial.location}</p>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-sm italic text-foreground/80">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
