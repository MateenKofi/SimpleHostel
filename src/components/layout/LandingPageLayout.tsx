import { ScrollToTop } from "@pages/landing-page/component/scroll-to-top";
import { ThemeProvider } from "@components/theme-provider";
import { Outlet } from "react-router-dom";
import { Header } from "@/pages/landing-page/component/header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const LandingPageLayout = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
};

export default LandingPageLayout;
