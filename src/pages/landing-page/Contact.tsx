import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle,Facebook,Twitter,Linkedin,Instagram } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 text-white bg-gradient-to-b from-zinc-900 to-zinc-800 md:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596386461350-326ccb383e9f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
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
                Get in <span className="text-red-500">Touch</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-zinc-300"
              >
                Have questions or feedback? We'd love to hear from you. Our team
                is always ready to help with your hostel booking needs.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <ContactFormSection />

        {/* Map Section */}
        <MapSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}

function ContactFormSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-red-500" />,
      title: "Our Location",
      details: [
        "Kumasi",
        "Tanoso",
        "AAMUSTED",
      ],
    },
    {
      icon: <Phone className="w-6 h-6 text-red-500" />,
      title: "Phone Number",
      details: ["+233 54 3983 427"],
    },
    {
      icon: <Mail className="w-6 h-6 text-red-500" />,
      title: "Email Address",
      details: ["fuseinfo@gmail.com", "fusesupport@gmail.com"],
    },
    {
      icon: <Clock className="w-6 h-6 text-red-500" />,
      title: "Working Hours",
      details: [
        "Monday - Friday: 9am - 6pm",
        "Saturday: 10am - 4pm",
        "Sunday: Closed",
      ],
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-white md:py-24 dark:bg-zinc-900">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-white rounded-lg shadow-lg dark:bg-zinc-800"
          >
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">
              Send Us a Message
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium"
                    >
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-medium"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={5}
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="w-full text-white bg-red-500 hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="mr-2"
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Contact Information
            </h2>
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="p-3 mr-4 bg-red-100 rounded-lg dark:bg-red-900/30">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                      {item.details.map((detail, i) => (
                        <p key={i}>{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook className="w-6 h-6 text-red-500" />, href: "#" },
                  { icon: <Twitter className="w-6 h-6 text-red-500" />, href: "#" },
                  { icon: <Instagram className="w-6 h-6 text-red-500" />, href: "#" },
                  { icon: <Linkedin className="w-6 h-6 text-red-500" />, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 transition-colors rounded-full bg-zinc-100 dark:bg-zinc-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Find Us</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Visit our headquarters or reach out online. We're always happy to
            connect with travelers and hostel owners.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px]"
        >
          {/* This would be replaced with an actual map component */}
          <div className="w-full h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3171.835434509374!2d-1.6244293153169!3d6.68848174202198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102abb8b3c0b0b1b%3A0xf577d8b3c0b0b1b!2sKumasi%2C%20Ghana!5e0!3m2!1sen!2sus!4v1697040000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a hostel through Fuse?",
      answer:
        "Booking a hostel is simple! Search for your destination, browse available hostels, select your dates, and complete the booking process. You'll receive a confirmation email with all the details.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify your booking according to the hostel's cancellation policy. Log in to your account, go to 'My Bookings', and follow the instructions for cancellation or modification.",
    },
    {
      question: "How do I list my hostel on Fuse?",
      answer:
        "To list your hostel, click on 'List Your Hostel' in the navigation menu. You'll need to create an account, provide details about your property, and follow our verification process.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store to manage your bookings on the go.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team through this contact form, by emailing fusesupport@gmail.com, or by calling +1 (555) 123-4567. We're available Monday through Friday from 9am to 6pm.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section ref={ref} className="py-16 bg-white md:py-24 dark:bg-zinc-900">
      <div className="container">
        <SEOHelmet
          title="Contact Us - Fuse"
          description="Get in touch with Fuse for any inquiries or support."
          keywords="contact, support, Fuse"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Find quick answers to common questions about Fuse and our
            services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex items-center justify-between w-full p-4 text-left transition-colors rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === index ? "auto" : 0,
                  opacity: openFaq === index ? 1 : 0,
                  marginTop: openFaq === index ? "0.5rem" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white border rounded-lg dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
