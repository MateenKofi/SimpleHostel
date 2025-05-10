import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from '@components/ui/button'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  category: string
}

export function BlogSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Must-Visit Hostels in Southeast Asia",
      excerpt:
        "Discover the most vibrant and social hostels across Thailand, Vietnam, and Indonesia that won't break your budget.",
      image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80",
      date: "May 2, 2023",
      author: "Emma Wilson",
      category: "Destinations",
    },
    {
      id: 2,
      title: "How to Make Friends While Staying in Hostels",
      excerpt:
        "Practical tips for solo travelers on breaking the ice and forming meaningful connections during your hostel stays.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      date: "April 15, 2023",
      author: "James Rodriguez",
      category: "Travel Tips",
    },
    {
      id: 3,
      title: "Budget-Friendly European Capitals: Hostel Guide",
      excerpt:
        "Navigate the expensive European capitals without emptying your wallet with these affordable hostel recommendations.",
      image: "https://images.unsplash.com/photo-1493707553966-283afac8c358?auto=format&fit=crop&w=600&q=80",
      date: "March 28, 2023",
      author: "Sophie Martin",
      category: "Budget Travel",
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel Tips & Inspiration</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Explore our collection of travel stories, tips, and guides to help you make the most of your hostel
              adventures
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button variant="outline" className="group">
              View All Articles <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">{post.category}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 hover:text-red-500 transition-colors">
                  <a href="#">{post.title}</a>
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{post.excerpt}</p>
                <a href="#" className="inline-flex items-center text-red-500 hover:text-red-600 font-medium">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
