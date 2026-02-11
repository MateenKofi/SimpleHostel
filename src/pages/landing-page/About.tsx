import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ContactSection } from "./component/contact-section"
import { Users, Target, Clock, Award } from "lucide-react"
import SEOHelmet from "@/components/SEOHelmet"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 text-white bg-gradient-to-b from-zinc-900 to-zinc-800 md:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/FiestaResidences.jpeg')] bg-cover bg-center opacity-20"></div>
          </div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
              >
                About <span className="text-red-500">Fuse</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-zinc-300"
              >
                Connecting travelers with the perfect hostels since 2015. Our mission is to make hostel booking simple,
                affordable, and social.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <StorySection />

        {/* Mission & Values */}
        <MissionSection />

        {/* Timeline */}
        <TimelineSection />

        {/* Team Section */}
        <TeamSection />

        {/* Contact Section */}
        <section className="container pt-16 pb-16">
          <ContactSection />
        </section>
      </main>
    </div>
  )
}

function StorySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-16 bg-white md:py-24 dark:bg-zinc-900">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Story</h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p>
                Fuse began with a simple idea: make hostel booking as easy as possible for travelers around the
                world. Founded by a group of avid backpackers who were frustrated with existing booking platforms, we
                set out to create something better.
              </p>
              <p>
                What started as a small project in 2015 has grown into a global platform connecting thousands of
                travelers with their perfect hostels every day. We're proud to have helped create countless memories and
                friendships across the globe.
              </p>
              <p>
                Today, Fuse partners with over 10,000 hostels in more than 120 countries, but our mission
                remains the same: to make travel accessible, social, and memorable for everyone.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <img
              src="download (2).jpeg"
              alt="Travelers at a hostel"
              className="absolute inset-0 object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MissionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const values = [
    {
      icon: <Users className="w-8 h-8 text-red-500" />,
      title: "Community",
      description: "We believe travel is better when shared with others.",
    },
    {
      icon: <Target className="w-8 h-8 text-red-500" />,
      title: "Accessibility",
      description: "Making travel possible for everyone, regardless of budget.",
    },
    {
      icon: <Clock className="w-8 h-8 text-red-500" />,
      title: "Reliability",
      description: "Providing accurate information and seamless bookings.",
    },
    {
      icon: <Award className="w-8 h-8 text-red-500" />,
      title: "Quality",
      description: "Curating the best hostels that meet our high standards.",
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Mission & Values</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            We're on a mission to make hostel travel accessible to everyone. Our platform is built on core values that
            guide everything we do.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md dark:bg-zinc-900 hover:shadow-lg"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const timelineEvents = [
    {
      year: "2021",
      title: "Fuse Founded",
      description: "Started with just 100 hostels in 16 regions.",
    },
    {
      year: "2022",
      title: "Mobile App Launch",
      description: "Expanded our reach with iOS and Android applications.",
    },
    {
      year: "2023",
      title: "1,000,000 Bookings",
      description: "Reached our millionth booking milestone.",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to over 10,000 hostels in 12 regions.",
    },
    {
      year: "2025",
      title: "Community Features",
      description: "Launched social networking features for travelers.",
    },
  ]

  return (
    <section ref={ref} className="py-16 bg-white md:py-24 dark:bg-zinc-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Our Journey</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            From humble beginnings to a global platform, here's how Fuse has evolved over the years.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute w-1 h-full transform -translate-x-1/2 bg-red-200 left-1/2 dark:bg-red-900"></div>

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="w-1/2"></div>
                <div className="absolute z-10 flex items-center justify-center w-12 h-12 transform -translate-x-1/2 bg-red-500 rounded-full left-1/2">
                  <span className="font-bold text-white">{event.year}</span>
                </div>
                <div
                  className={`w-1/2 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border ${
                    index % 2 === 0 ? "text-right ml-8" : "text-left mr-8"
                  }`}
                >
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const team = [
    {
      name: "Abdul Mateen Kofi Yeboah",
      role: "Chief Executive Officer & Developer",
      image: "/mateen2.jpg",
      bio: "Former backpacker with a passion for connecting travelers. Tech enthusiast focused on creating seamless user experiences.",
    },
    {
      name: "Amponsah Danquah Junior",
      role: "Head of Partnerships",
      image: "/junior.jpg",
      bio: "Building relationships with hostels all round you.",
    },
    {
      name: "Amponsah Danquah Senior",
      role: "Customer Experience",
      image: "/senior.jpg",
      bio: "Dedicated to ensuring travelers have the best experience possible.",
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <SEOHelmet
        title="About Us - Fuse"
        description="Learn more about Fuse and our mission to connect travelers with the best hostels."
        keywords="about, Fuse, hostels, travel"
      />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            The passionate people behind Fuse who are dedicated to making your travel experiences unforgettable.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md dark:bg-zinc-900 hover:shadow-lg"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-300 "
                />
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-3 font-medium text-red-500">{member.role}</p>
                <p className="mb-4 text-zinc-600 dark:text-zinc-400">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
