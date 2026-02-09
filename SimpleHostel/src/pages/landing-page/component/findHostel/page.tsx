import SEOHelmet from '@/components/SEOHelmet'
import { FindHostel } from './find-hostel'

const FindHostelPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHelmet
        title="Find Hostel - Fuse"
        description="Search for the best hostels on Fuse."
        keywords="find hostel, Fuse, student accommodation"
      />
      <main>
        <FindHostel />
      </main>
    </div>
  )
}
export default FindHostelPage
