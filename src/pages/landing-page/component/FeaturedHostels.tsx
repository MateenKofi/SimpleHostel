import React from 'react'
import { HostelCard } from './hostel-card'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Hostel } from '@/helper/types/types';

const FeaturedHostels = () => {
     const {
    data: hostels,
  } = useQuery({
    queryKey: ["find_hostel"],
    queryFn: async () => {
      const response = await axios.get(`/api/hostels/get`);
      return response.data?.data;
    },
  });

 // Get 4 random hostels
  const randomHostels = React.useMemo(() => {
    if (!hostels || hostels.length < 1) return [];
    // Only include hostels with state === "PUBLISHED"
    const published = hostels.filter((h:Hostel) => h?.state === "PUBLISHED" && h?.Rooms?.length > 1);
    return [...published].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hostels]);
    
  return (
     <section className="container py-16">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Featured Hostels</h2>
            <div className="grid justify-between w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {randomHostels.map((hostel, index) => (
                <div key={index} className="w-full max-w-sm ">
                <HostelCard
                id={hostel.id}
                  key={index}
                  image={hostel?.HostelImages[0]?.imageUrl || '/logo.png'}
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