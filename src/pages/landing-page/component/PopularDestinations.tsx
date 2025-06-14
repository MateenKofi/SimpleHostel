import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { DestinationCard } from './destination-card';

const PopularDestinations = () => {
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
    return [...hostels].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hostels]);

  return (
    <section className="container py-16">
      <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Popular Destinations</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {randomHostels.map((hostel, idx) => (
          <DestinationCard
            key={hostel.id}
            id={hostel.id}
            image={hostel.logoUrl }
            title={hostel.name}
            description={hostel.description}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations