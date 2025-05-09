import { ScrollToTop } from "@pages/landing-page/component/scroll-to-top";
import { ThemeProvider } from "@components/theme-provider";
import { Outlet } from "react-router-dom";

const LandingPageLayout = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Outlet />
      <ScrollToTop />
    </ThemeProvider>
  );
};

export default LandingPageLayout;
