import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// ...existing imports...
export function PartnersSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  // Replace with real company names and logo URLs
  const partners = [
    {
      id: 1,
      name: "SamaSoft",
      image:
        "/Samasoftlogo.png",
    },
    {
      id: 2,
      name: "Airbnb",
      image:
        "/airbnb.png",
    },
    {
      id: 3,
      name: "ChippyCode",
      image: "/chippycode.png",
    },
    {
      id: 4,
      name: "Expedia",
      image:
        "/Expedia.png",
    },
    {
      id: 5,
      name: "Agoda",
      image:
        "/agoda.png",
    },
    {
      id: 6,
      name: "TripAdvisor",
      image:
        "/Tripadvisor.png",
    },
  ];
  return (
    <section
      ref={ref}
      className="py-12 bg-white border-t md:py-16 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 text-2xl font-semibold">
            Trusted By Industry Leaders
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We partner with the best in the industries to bring you quality
            experiences
          </p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center h-20 p-2 transition-shadow duration-300 bg-white rounded-md shadow-md w-44 dark:bg-zinc-800 hover:shadow-lg">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="object-cover w-full h-20"
                  style={{ maxWidth: "100%" }}
                />
              
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
