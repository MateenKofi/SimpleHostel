import SEOHelmet from '@/components/SEOHelmet'
import { FindHostel } from './find-hostel'
import { getSeoRoute } from '@/config/seo';

const findHostelSeo = getSeoRoute("/find-hostel");

const hostelSearchJsonLd = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  name: "Find Hostels in Ghana",
  description: "Search verified student hostels and compare available accommodation on Best Suit.",
};

const FindHostelPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHelmet
        title={findHostelSeo?.title}
        description={findHostelSeo?.description}
        keywords={findHostelSeo?.keywords}
        canonicalPath="/find-hostel"
        jsonLd={hostelSearchJsonLd}
      />
      <main>
        <FindHostel />
      </main>
    </div>
  )
}
export default FindHostelPage
