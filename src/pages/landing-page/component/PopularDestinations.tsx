import { useQuery } from '@tanstack/react-query';
import { getHostels } from '@/api/hostels';
import React from 'react';
import { DestinationCard } from './destination-card';
import { Hostel } from '@/helper/types/types';

const PopularDestinations = () => {
  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["find_hostel"],
    queryFn: async () => {
      return await getHostels();
    },
  });

  const hostels = response?.data;

  // Get 4 random hostels
  const randomHostels = React.useMemo(() => {
    if (!hostels || hostels.length < 1) return [];
    // Only include hostels with state === "published"
    const published = hostels.filter((h: Hostel) => h?.state === "published" && h?.rooms?.length > 1);
    return [...published].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hostels]);

  return (
    <section className="container py-16">
      <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Popular Destinations</h2>
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <DestinationCard
              key={idx}
              id={idx}
              image="/logo.png"
              title="Loading..."
              description="Loading..."
              index={idx}
              loading={isLoading}
            />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {randomHostels.map((hostel, idx) => (
          <DestinationCard
            key={hostel.id}
            id={hostel.id}
            image={hostel.logoUrl}
            title={hostel.name}
            description={hostel.description}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;