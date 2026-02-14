import { Menu, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import UserSection from "./UserSection";
import { useMemo } from "react";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Function to determine if a link is active based on current pathname
  const getActiveLinkId = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/find-hostel')) return 'find-hostel';
    if (path.startsWith('/dashboard')) return 'dashboard';
    return 'home';
  }, [location.pathname]);

  const activeLink = getActiveLinkId;

  // Desktop navigation items - includes Dashboard for authenticated users
  const desktopNavItems = useMemo(() => [
    { name: "Home", path: "/", id: "home" },
    { name: "About Us", path: "/about", id: "about" },
    { name: "Services", path: "/services", id: "services" },
    { name: "Contact", path: "/contact", id: "contact" },
    { name: "Find Hostels", path: "/find-hostel", id: "find-hostel" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard", id: "dashboard" }] : []),
  ], [user]);

  // Mobile navigation items - includes Dashboard only when authenticated
  const mobileNavItems = useMemo(() => [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Find Hostel", path: "/find-hostel" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ], [user]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className="grid place-items-center sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/100 py-2 overflow-hidden"
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
          <span className="text-2xl font-bold text-foreground">Fuse</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-32">
          {desktopNavItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.path}
                className={`text-sm font-medium relative transition-colors
                  ${activeLink === item.id
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }`}
              >
                {item.name}
                {activeLink === item.id && (
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                    layoutId="underline"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          {user ? (
            <UserSection />
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login">
                  <Button size="icon" className="w-full flex px-4">
                    <KeyRound className="h-5 w-5 mr-2" />
                    Log In
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                className="hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/hostel-listing">
                  <Button className="w-full bg-primary hover:bg-primary text-primary-foreground">
                    List Your Hostel
                  </Button>
                </Link>
              </motion.div>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <nav className="flex flex-col space-y-4 mt-8">
                {mobileNavItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
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
                    <Button className="w-full bg-primary hover:bg-primary text-primary-foreground">
                      List Your Hostel
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}