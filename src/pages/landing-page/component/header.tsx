"use client"

import { Menu, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
// import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [activeLink, setActiveLink] = useState("home")

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className="grid place-items-center sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/100 py-4 overflow-hidden"
    >
      <div className="container flex">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.img
            src="/logo.png"
            alt="logo"
            className="w-10"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          />
          <span className="text-2xl font-bold text-black">Fuse</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-32">
          {[
            { name: "Home", path: "/", id: "home" },
            { name: "Find Hostels", path: "/find-hostel", id: "find-hostel" },
            { name: "About Us", path: "/about", id: "about" },
            { name: "Contact", path: "/contact", id: "contact" },
          ].map((item) => (
            <motion.div key={item.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={item.path}
                className={`text-sm text-black font-medium relative ${activeLink === item.id ? "text-red-500" : "hover:text-red-500"}`}
                onClick={() => setActiveLink(item.id)}
              >
                {item.name}
                {activeLink === item.id && (
                  <motion.span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500" layoutId="underline" />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          {/* <ThemeToggle /> */}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login">
              <Button size="icon" className="w-full flex px-4">
                <KeyRound className="h-5 w-5 mr-2" />
                Log In
              </Button>
            </Link>
          </motion.div>

          <motion.div className="hidden md:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/hostel-listing">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">List Your Hostel</Button>
            </Link>
          </motion.div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {[
                  { name: "Home", path: "/" },
                  { name: "Find Hostel", path: "/find-hostel" },
                  { name: "Dashboard", path: "/dashboard" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={item.path} className="text-sm font-medium text-black hover:text-red-500 transition-colors">
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <Link to="/hostel-listing">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">List Your Hostel</Button>
                  </Link>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
