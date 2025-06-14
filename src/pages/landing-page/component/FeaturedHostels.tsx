import React from 'react'
import { HostelCard } from './hostel-card'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

  const randomHostels = React.useMemo(() => {
      if (!hostels || hostels.length < 1) return [];
      return [...hostels].sort(() => Math.random() - 0.5).slice(0, 4);
    }, [hostels]);
    
  return (
     <section className="container py-16">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Featured Hostels</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {randomHostels.map((hostel, index) => (
                <HostelCard
                id={hostel.id}
                  key={index}
                  image={hostel?.Rooms[0]?.RoomImage[0]?.imageUrl || '/logo.png'}
                  title={hostel.name}
                  location={hostel.location}
                  price={hostel.Rooms[0]?.price || 0}
                  index={index}
                />
              ))}
            </div>
          </section>
  )
}

export default FeaturedHostels