import { useQuery } from '@tanstack/react-query';
import { getHostels } from '@/api/hostels';
import React from 'react';
import { DestinationCard } from './destination-card';
import { Hostel } from '@/helper/types/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PopularDestinations = () => {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
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
    const published = hostels.filter((h: Hostel) => h?.state === "published" && h?.rooms?.length > 0);
    return [...published].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [hostels]);

  return (
    <section className="container py-16 md:py-20">
      {/* Enhanced Header */}
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Discover{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Popular Destinations
          </span>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Explore our most sought-after hostels with verified locations and quality accommodations
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row animate-pulse">
                <div className="w-full sm:w-2/5 bg-muted h-[240px] sm:h-auto min-h-[240px]" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                  <div className="h-10 bg-muted rounded w-32 mt-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <div className="max-w-md mx-auto space-y-4 px-4">
            <WifiOff className="w-16 h-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Unable to Load Destinations
              </h3>
              <p className="text-sm text-muted-foreground">
                We couldn't fetch the hostels. Please check your internet connection and try again.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Success State - Hostels Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
      )}
    </section>
  );
};

export default PopularDestinations;
