import { Helmet } from 'react-helmet-async';
import {
  buildCanonicalUrl,
  isPrivateSeoPath,
  SEO_CONFIG,
  type JsonLdValue,
} from '@/config/seo';

type SEOHelmetProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  lang?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  jsonLd?: JsonLdValue | JsonLdValue[];
};

const toAbsoluteUrl = (value: string) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SEO_CONFIG.siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

const SEOHelmet = ({
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  image = SEO_CONFIG.defaultImage,
  url,
  keywords = SEO_CONFIG.defaultKeywords,
  lang = 'en',
  canonicalPath,
  noIndex,
  type = "website",
  jsonLd,
}: SEOHelmetProps) => {
  const currentPath =
    canonicalPath ||
    (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = url || buildCanonicalUrl(currentPath);
  const shouldNoIndex = noIndex ?? isPrivateSeoPath(currentPath);
  const robotsContent = shouldNoIndex
    ? 'noindex,nofollow,noarchive'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const absoluteImage = toAbsoluteUrl(image);
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={`${SEO_CONFIG.siteName} preview`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={SEO_CONFIG.twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHelmet;
