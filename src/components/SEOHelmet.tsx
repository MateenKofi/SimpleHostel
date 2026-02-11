import { Helmet } from 'react-helmet-async';

type SEOHelmetProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  lang?: string;
};

const generateOgImage = (title: string) =>
  `https://ogimage.dev/api/og?title=${encodeURIComponent(title)}&theme=dark`;

const SEOHelmet = ({
  title = 'EasyFind | Find Your Perfect Hostel',
  description = 'Explore and book student hostels by price, location, and amenities. EasyFind makes it effortless.',
  image,
  url = typeof window !== 'undefined' ? window.location.href : '',
  keywords = 'hostel finder, student accommodation, booking, easyfind, Ghana hostels',
  lang = 'en',
}: SEOHelmetProps) => {
  const ogImage = image || generateOgImage(title);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHelmet;
