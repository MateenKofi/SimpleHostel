import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

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
      title: "Experience the Best Hostels in Your Favorite Locations",
      excerpt:
        "Discover the most vibrant and social hostels across your favorite destinations that won't break your budget.",
      image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80",
      date: "2024-06-01",
      author: "Jane Doe",
      category: "Destinations",
    },
    {
      id: 2,
      title: "How to Make Friends While Staying in Hostels",
      excerpt:
        "Practical tips for solo travelers on breaking the ice and forming meaningful connections during your hostel stays.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      date: "2024-05-25",
      author: "John Smith",
      category: "Travel Tips",
    },
    {
      id: 3,
      title: "Budget-Friendly Luxury Hostels: Hostel Guide",
      excerpt:
        "Navigate the expensive Luxury Hostels without emptying your wallet with these affordable hostel recommendations.",
      image: "https://images.unsplash.com/photo-1493707553966-283afac8c358?auto=format&fit=crop&w=600&q=80",
      date: "2024-05-15",
      author: "Emily Johnson",
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
          className="flex flex-col justify-between mb-12 md:flex-row md:items-end"
        >
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Travel Tips & Inspiration</h2>
            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              Explore our collection of travel stories, tips, and guides to help you make the most of your hostel
              adventures
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden transition-shadow bg-white shadow-md dark:bg-zinc-900 rounded-xl hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">{post.category}</span>
                </div>
              </div>
              <div className="p-6">
              
                <h3 className="mb-2 text-xl font-bold transition-colors hover:text-red-500">
                  <Link to={`/find-hostel`}>{post.title}</Link>
                </h3>
                <p className="mb-4 text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
                <Link to={`/find-hostel`} className="inline-flex items-center font-medium text-red-500 hover:text-red-600">
                  Find A Hostel <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
