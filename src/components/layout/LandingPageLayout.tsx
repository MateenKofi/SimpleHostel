import { ScrollToTop } from "@pages/landing-page/component/scroll-to-top";
import { ThemeProvider } from "@components/theme-provider";
import { Outlet } from "react-router-dom";
import { Header } from "@/pages/landing-page/component/header";

const LandingPageLayout = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Header/>
      <Outlet />
      <ScrollToTop />
    </ThemeProvider>
  );
};

export default LandingPageLayout;
