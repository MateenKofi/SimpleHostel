export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  priority?: number;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

export const SEO_CONFIG = {
  siteName: "Best Suit",
  siteUrl: "https://simple-hostel.vercel.app",
  defaultTitle: "Best Suit | Find and Manage Student Hostels in Ghana",
  defaultDescription:
    "Find verified student hostels, compare rooms, book accommodation, manage payments, and run hostel operations with Best Suit.",
  defaultKeywords:
    "Best Suit, student hostels Ghana, hostel booking, student accommodation, hostel management, room booking Ghana",
  defaultImage: "/logo.png",
  locale: "en_GH",
  twitterCard: "summary_large_image",
  contactEmail: "fusehostel01@gmail.com",
  contactPhone: "+233543983427",
  address: {
    locality: "Kumasi",
    region: "Ashanti Region",
    country: "GH",
  },
} as const;

export const PUBLIC_SEO_ROUTES: SeoRoute[] = [
  {
    path: "/",
    title: "Best Suit | Find and Manage Student Hostels in Ghana",
    description:
      "Discover verified student hostels, compare rooms, book accommodation, and manage hostel payments through Best Suit.",
    keywords: "student hostels Ghana, hostel booking Ghana, verified hostels, Best Suit hostel",
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About Best Suit | Student Hostel Booking and Management Platform",
    description:
      "Learn how Best Suit helps students find verified hostels and gives hostel operators tools for bookings, residents, payments, and operations.",
    keywords: "about Best Suit, hostel management platform, student accommodation Ghana",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/services",
    title: "Best Suit Services | Hostel Listings, Booking, Payments, and Management",
    description:
      "Explore Best Suit services for hostel discovery, room booking, resident management, secure payments, and hostel operations.",
    keywords: "hostel services, room booking, hostel payments, resident management",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Best Suit | Hostel Booking and Management Support",
    description:
      "Contact Best Suit for hostel booking support, hostel listing enquiries, and help with student accommodation management.",
    keywords: "contact Best Suit, hostel support Ghana, hostel booking support",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/find-hostel",
    title: "Find Hostels in Ghana | Verified Student Accommodation | Best Suit",
    description:
      "Search verified student hostels, compare rooms, review amenities, and start your booking with Best Suit.",
    keywords: "find hostel Ghana, student accommodation, verified hostels, hostel rooms",
    priority: 0.95,
    changefreq: "daily",
  },
  {
    path: "/map",
    title: "Hostel Map | Find Student Hostels by Location | Best Suit",
    description:
      "Use the Best Suit hostel map to find student accommodation by location, campus area, and nearby hostel options.",
    keywords: "hostel map Ghana, student hostels near me, hostel locations",
    priority: 0.75,
    changefreq: "weekly",
  },
  {
    path: "/hostel-listing",
    title: "List Your Hostel | Join Best Suit Hostel Management Platform",
    description:
      "List your hostel on Best Suit to reach students, manage bookings, track payments, and organize hostel operations.",
    keywords: "list hostel Ghana, hostel management software, hostel owners",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/terms-and-conditions",
    title: "Terms and Conditions | Best Suit",
    description:
      "Review Best Suit terms, privacy information, cookie practices, and data usage policies for hostel booking and management.",
    keywords: "Best Suit terms, privacy policy, hostel booking terms",
    priority: 0.4,
    changefreq: "yearly",
  },
];

export const PRIVATE_ROUTE_PREFIXES = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
  "/change-password",
  "/dashboard",
  "/payment",
  "/payment-success",
  "/payment-cash",
  "/payment-result",
  "/resident-form",
  "/receipt",
  "/find/",
] as const;

export const getSeoRoute = (path: string) =>
  PUBLIC_SEO_ROUTES.find((route) => route.path === path);

export const isPrivateSeoPath = (path: string) =>
  PRIVATE_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));

export const buildCanonicalUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_CONFIG.siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
  email: SEO_CONFIG.contactEmail,
  telephone: SEO_CONFIG.contactPhone,
  address: {
    "@type": "PostalAddress",
    addressLocality: SEO_CONFIG.address.locality,
    addressRegion: SEO_CONFIG.address.region,
    addressCountry: SEO_CONFIG.address.country,
  },
} satisfies JsonLdValue;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SEO_CONFIG.siteUrl}/find-hostel?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
} satisfies JsonLdValue;

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SEO_CONFIG.siteName,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SEO_CONFIG.siteUrl,
  description: SEO_CONFIG.defaultDescription,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GHS",
  },
} satisfies JsonLdValue;
