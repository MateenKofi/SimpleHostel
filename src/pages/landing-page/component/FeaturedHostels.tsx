import React from 'react'
import { HostelCard } from './hostel-card'
import { useQuery } from '@tanstack/react-query';
import { getHostels } from '@/api/hostels';
import { Hostel } from '@/helper/types/types';
import FourCardLoader from '@/components/loaders/FourCardLoader';

const FeaturedHostels = () => {
  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["find_hostel"],
    queryFn: async () => {
      return await getHostels();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const hostels = response?.data;

  // Get 4 random hostels
  const randomHostels = React.useMemo(() => {
    if (!hostels || hostels.length < 1) return [];
    // Only include hostels with state === "PUBLISHED"
    // Only include hostels with state === "published" (note: lowercase published based on type/response, though previously it was "PUBLISHED" or "published"?)
    // The type says state: "published" | "unpublished".
    // The previous code had h?.state === "PUBLISHED" which contradicts the type unless I changed the type but didn't notice the code was using uppercase.
    // The user provided response has "state": "published".
    // So I should fix the check to "published" as well.
    const published = hostels.filter((h: Hostel) => h?.state === "published" && h?.rooms?.length > 1);
    return [...published].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hostels]);



  return (
    <section className="container py-16">
      <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Featured Hostels</h2>
      {isLoading && <FourCardLoader />}
      <div className="grid justify-between w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {randomHostels.map((hostel, index) => (
          <div key={index} className="w-full max-w-sm ">
            <HostelCard
              id={hostel.id}
              key={index}
              image={hostel?.hostelImages ? hostel.hostelImages[0]?.imageUrl : '/logo.png'}
              title={hostel.name}
              location={hostel.location}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedHostels